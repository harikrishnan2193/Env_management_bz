require("dotenv").config();

const Roles = require("../models/rolesModel");
const User = require("../models/usersModel");
const User_Roles = require("../models/user_rolesModel");
const Environments = require("../models/environmentsModel");
const Permission = require("../models/permissionModel");
const Project_env = require("../models/project_envModel");
const Env_History = require("../models/env_history")


const { Op } = require("sequelize");
const transporter = require("../../core/nodeMailer/mailer");
const { logError } = require("../../../errorLogger");

class AccessController {
  // get all users and roles in the environment page
  async getAllusers_Allroles(req, res) {
    console.log("inside getAllusersAllroles Controller");
    try {
      const users = await User.findAll();
      console.log("Fetched users:", users);

      // map through the users to fetch their roles and role scopes
      const usersWithRoleScopes = await Promise.all(
        users.map(async (user) => {
          // find the role associated with the user
          const userRole = await User_Roles.findOne({
            where: { user_id: user.user_id },
          });
          if (!userRole) {
            console.log(`No role found for user ID: ${user.user_id}`);
            return { ...user.dataValues, role_scope: null };
          }

          // find role scope associated with the role
          const role = await Roles.findOne({
            where: { role_id: userRole.role_id },
          });
          const roleScope = role ? role.role_scope : null;

          // add role_scope to the user object
          return { ...user.dataValues, role_scope: roleScope };
        })
      );

      console.log("Users with role scopes:", usersWithRoleScopes);

      // get all roles (no filter on role_scope)
      const roles = await Roles.findAll();
      console.log("All roles:", roles);

      const loggedInUserId = req.session.user_id;
      console.log("Logged-in user ID is", loggedInUserId);
      const selectedProjectId = req.session.project_id;
      console.log("Selected project ID is", selectedProjectId);

      res.json({
        users: usersWithRoleScopes,
        roles,
        loggedInUserId,
        selectedProjectId,
      });
    } catch (error) {
      logError(error.message || "Error fetching users and roles", req.url);
      console.error("Error fetching users and roles:", error.message);
      res.status(500).send("Server Error");
    }
  }

  // add or update user in user_roles table
  async postUser_roles(req, res) {
    console.log("Inside postUser_roles controller");

    const { user_id, role_id, loggedInUserId, selectedProjectId, currentPath } =
      req.body;
    const organization_id = req.session.organization_id;

    if (!user_id || !role_id) {
      return res
        .status(400)
        .json({ success: false, message: "Please select both user and role" });
    }

    try {
      let historyViewMessage = "";
      // user email from users table
      const user = await User.findOne({ where: { user_id: user_id } });
      const role = await Roles.findOne({ where: { role_id: role_id } })

      if (!user) {
        logError(
          error.message || "Error updating user roles : User not found",
          req.url
        );

        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const userEmail = user.email;
      const userName = user.username;
      const userRole = role.role_name;
      console.log("userEmail is :", userEmail);
      console.log("currentPath is :", currentPath);

      let message;
      const existingRole = await User_Roles.findOne({
        where: {
          user_id: user_id,
          project_id: selectedProjectId,
        },
      });

      if (existingRole) {
        await existingRole.update({
          role_id: role_id,
          organization_id: organization_id,
          assigned_by: loggedInUserId,
        });
        historyViewMessage = `User ${userName}'s role is changed to ${userRole}.`;
        message = "User role updated successfully";
      } else {
        await User_Roles.create({
          user_id: user_id,
          role_id: role_id,
          organization_id: organization_id,
          project_id: selectedProjectId,
          assigned_by: loggedInUserId,
        });
        historyViewMessage = `User ${userName} is asigned to new role ${userRole}.`;
        message = "User role added successfully";
      }
      // add history record to env_history
      await Env_History.create({
        project_id: selectedProjectId,
        history_view: historyViewMessage,
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Project Role Assignment",
        html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Role Assignment Notification</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            background-color: #f4f4f9;
                            padding: 20px;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: #ffffff;
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                        }
                        .header {
                            text-align: center;
                            font-size: 24px;
                            margin-bottom: 20px;
                            color: #4CAF50;
                        }
                        .content {
                            text-align: center;
                            font-size: 18px;
                        }
                        .footer {
                            text-align: center;
                            font-size: 14px;
                            margin-top: 20px;
                            color: #888;
                        }
                        .button {
                            display: inline-block;
                            background-color: #4CAF50;
                            color: #fff;
                            text-decoration: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            margin-top: 20px;
                            font-size: 16px;
                        }
                        .button:hover {
                            background-color: #45a049;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">Project Role Assignment</div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>You have been assigned a new role in the project.</p>
                            <p><strong>Project Path:</strong> ${currentPath}</p>
                            <p>Please log in and check your dashboard for more details.</p>
                            <a href="${currentPath}" class="button">Go to Dashboard</a>
                        </div>
                        <div class="footer">
                            <p>If you have any questions, please contact our support team.</p>
                            <p>&copy; ${new Date().getFullYear()} BzAnalytics. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logError(error.message || "Error sending email", req.url);
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      res.status(200).json({ success: true, message });
    } catch (error) {
      logError(error.message || "Error processing User_Roles", req.url);
      console.error("Error processing User_Roles:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  // controller to get the logged-in user's role_scope
  async getUserRoleScope(req, res) {
    console.log("inside getUserRoleScope controller");

    const user_id = req.session.user_id;

    if (!user_id) {
      // return res.status(401).json({ error: 'User not logged in' });
      req.flash("error", "User not logged in.");
      return res.status(401).redirect("/");
    }

    try {
      // get user's role_id from User_Roles table
      const userRole = await User_Roles.findOne({
        where: { user_id },
      });

      if (!userRole) {
        logError("Error getting User Roles : User role not found", req.url);
        return res.status(404).json({ error: "User role not found" });
      }

      const roleDetails = await Roles.findOne({
        where: { role_id: userRole.role_id },
      });

      if (!roleDetails) {
        logError("Error getting User Roles : Role details not found", req.url);
        return res.status(404).json({ error: "Role details not found" });
      }

      res.json({ role_scope: roleDetails.role_scope });
    } catch (error) {
      logError(error.message || "Error fetching user role scope", req.url);
      console.error("Error fetching user role scope:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  //render roles managing page
  async renderPermissions(req, res) {
    res.render("permissions");
  }

  //get all roles to permission page
  async getAllRoles_toPermision(req, res) {
    console.log("inside getAllRoles_toPermision controller");

    try {
      const roles = await Roles.findAll();
      console.log(roles);

      res.json(roles);
    } catch (error) {
      logError(error.message || "Error fetching roles", req.url);
      console.error("Error fetching roles:", error.message);
      res.status(500).send("Server Error");
    }
  }

  // remove a role
  async removeRole(req, res) {
    console.log("inside removeRole controller");

    const { roleId } = req.params;

    try {
      // check if the role is in use in the user_roles table
      const roleInUse = await User_Roles.findOne({
        where: { role_id: roleId },
      });

      if (roleInUse) {
        return res.status(400).json({
          message:
            "This role cannot be removed as it is in use by one or more users.",
        });
      } else {
        // find the role by ID
        const role = await Roles.findByPk(roleId);
        if (!role) {
          return res.status(404).json({ message: "Role not found" });
        }

        // destroy the role if it is not in use
        await role.destroy();
        res.status(200).json({ message: "Role removed successfully" });
      }
    } catch (error) {
      console.error("Error removing role:", error);
      res.status(500).json({ message: "Error removing role" });
    }
  }

  //get all env_typs
  async getAllEnvTypes(req, res) {
    console.log("inside getAllEnvTypes controller");

    try {
      const types = await Environments.findAll();
      res.status(200).json(types);
    } catch (error) {
      console.error("Error fetching environment types:", error);
      res.status(500).send("Server Error");
    }
  }

  // get update permission
  async getUpdatedPermission(req, res) {
    console.log("Inside getUpdatedPermission controller");

    const { role_id, env_id, permission_type, value } = req.body;

    try {
      let permission = await Permission.findOne({
        where: {
          role_id: role_id,
          env_id: env_id,
        },
      });

      const permissionValue = value ? 1 : 0;

      if (!permission) {
        permission = await Permission.create({
          role_id: role_id,
          env_id: env_id,
          [permission_type]: permissionValue, // dynamically set the permission
        });

        // fetch the environment type from the environments table using env_id
        const environment = await Environments.findOne({
          where: { env_id: env_id },
        });

        if (!environment) {
          logError(
            "Error updating permission : Environment not found ",
            req.url
          );
          return res
            .status(404)
            .json({ success: false, error: "Environment not found" });
        }

        return res.json({
          success: true,
          message: `${permission_type} created successfully for environment : ${environment.env_type}`,
        });
      } else {
        // dynamically update the permission field (can_view or can_edit) based on the permission_type
        const updatedData = {};
        updatedData[permission_type] = permissionValue;

        // update the permission record
        await permission.update(updatedData);

        // fetch the environment type from the environments table using env_id
        const environment = await Environments.findOne({
          where: { env_id: env_id },
        });

        if (!environment) {
          logError(
            "Error updating permission : Environment not found ",
            req.url
          );
          return res
            .status(404)
            .json({ success: false, error: "Environment not found" });
        }

        res.json({
          success: true,
          message: `${permission_type} updated successfully for environment : ${environment.env_type}`,
        });
      }
    } catch (error) {
      logError(error.message || "Error updating permission", req.url);
      console.error("Error updating permission:", error);
      res
        .status(500)
        .json({ success: false, error: "Error updating permission" });
    }
  }

  // fetch selected permission for a given role and environment
  async getSelectedPermissions(req, res) {
    console.log("inside getSelectedPermissions controller");

    const { role_id, env_details } = req.body;
    console.log(role_id);
    console.log(env_details);

    // extract the env_ids from env_details array
    const envIds = env_details.map((env) => env.env_id);

    try {
      // fetch permissions for the given role_id and env_ids
      const permissions = await Permission.findAll({
        where: {
          role_id: role_id,
          env_id: {
            [Op.in]: envIds,
          },
        },
      });

      // check if found any permissions
      if (permissions.length > 0) {
        // map the results
        const result = permissions.map((permission) => ({
          env_id: permission.env_id,
          can_view: permission.can_view,
          can_edit: permission.can_edit,
        }));
        // console.log(result);

        res.status(200).json({
          success: true,
          permissions: result,
        });
      } else {
        // if no permissions are found, return empty checkboxes for all environments
        const result = env_details.map((env) => ({
          env_id: env.env_id,
          can_view: null,
          can_edit: null,
        }));

        res.status(200).json({
          success: true,
          permissions: result,
        });
      }
    } catch (error) {
      logError(error.message || "Error fetching selected permissions", req.url);
      console.error("Error fetching selected permissions:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to fetch selected permissions",
      });
    }
  }

  // add New Role
  async addNewRoles(req, res) {
    console.log("inside addNewRoles controller");

    const { roleName, roleDescription, roleScope } = req.body;

    try {
      if (!roleName || !roleDescription || !roleScope) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newRole = await Roles.create({
        role_name: roleName,
        description: roleDescription,
        role_scope: roleScope,
      });

      return res
        .status(200)
        .json({ message: "Role added successfully!", newRole });
    } catch (error) {
      console.error("Error adding role:", error.message);
      logError(error.message || "Error adding role", req.url);
      return res
        .status(500)
        .json({ message: "Error adding role. Please try again." });
    }
  }

  // get users associated with the project
  async users_Associated(req, res) {
    console.log("Inside users_Associated controller");

    const project_id = req.session.project_id;

    try {
      const userRoles = await User_Roles.findAll({
        where: { project_id },
        attributes: ["user_id", "role_id"], // fetch user_id and role_id
        include: [
          {
            model: User,
            as: "user",
            attributes: ["username"], // fetch username from the Roles table
          },
          {
            model: Roles,
            as: "role",
            attributes: ["role_name"], // fetch role_name from the Roles table
          },
        ],
      });

      if (!userRoles.length) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "No users associated with this project.",
        });
      }

      const responseData = userRoles.map((role) => ({
        user_id: role.user_id,
        username: role.user?.username || "Unknown",
        role_name: role.role?.role_name || "Unknown",
      }));

      res.status(200).json({
        success: true,
        data: responseData,
      });
    } catch (error) {
      logError(error.message || "Error fetching user details", req.url);
      console.error("Error fetching user details:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching user details",
      });
    }
  }

  //remove a user from user_rols table
  async remove_Auser(req, res) {
    console.log("inside remove_Auser controller");

    const userId = req.params.id;
    const projectId = req.session.project_id;

    try {
      const user = await User.findOne({ where: { user_id: userId } });
      const userName = user.username;

      const result = await User_Roles.destroy({
        where: {
          user_id: userId,
          project_id: projectId,
        },
      });

      if (result) {
        // add history record to env_history
        await Env_History.create({
          project_id: projectId,
          history_view: `User ${userName} is removed from the project.`,
        });
        res
          .status(200)
          .json({ success: true, message: "User deleted successfully" });
      } else {
        logError("Error deleting user : User not found", req.url);
        res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (error) {
      logError(error.message || "Error deleting user", req.url);
      console.error("Error deleting user:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  // add super admin
  async postNew_admin(req, res) {
    console.log("Inside postNew_admin controller");

    try {
      const { user_id } = req.body;
      const role_id = req.roleScope.role_id; // from middleware
      const organization_id = req.session.organization_id;
      if (!user_id || !role_id || !organization_id) {
        return res.status(400).json({
          error: "User ID, Role ID, and Organization ID are required.",
        });
      }

      // check if the user already exists in User_Roles
      const userInUsers_roles = await User_Roles.findOne({
        where: { user_id: user_id },
      });

      if (userInUsers_roles) {
        // user exists, delete the record
        await User_Roles.destroy({
          where: { user_id: user_id },
        });

        console.log("Existing user role deleted successfully");
      }

      await User_Roles.create({
        user_id: user_id,
        role_id: role_id,
        organization_id: organization_id,
        assigned_by: null,
        project_id: null,
      });

      console.log("New user role assigned successfully");

      res.json({ message: "Admin added successfully!" });
    } catch (error) {
      logError(error.message || "Error adding new admin", req.url);
      console.error("Error adding new admin:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getAllPermissions(req, res) {
    try {
      const result = await Environments.findAll(); // fetch all environments
      console.log(result);

      res.render("permissionManagement", { data: result });
    } catch (error) {
      logError(
        error.message || "An error occurred while fetching permissions",
        req.url
      );
      console.log(error);
      res.status(500).send("An error occurred while fetching permissions.");
    }
  }

  async addPermission(req, res) {
    try {
      const { permissionType, descriptionInput } = req.body; // getting permission data

      const newPermission = await Environments.create({
        env_type: permissionType,
        description: descriptionInput,
      });

      res
        .status(201)
        .json({ message: "permission added successfully", newPermission });
    } catch (error) {
      logError(error.message || "Error adding permission", req.url);
      console.error("error adding permission:", error);
      res.status(500).json({ error: "failed to add permission" });
    }
  }

  async deletePermission(req, res) {
    const { id } = req.params;

    try {
      // check if the env_id exists in the ProjectEnv table
      const projectEnvExists = await Project_env.findOne({
        where: { env_id: id },
      });

      if (projectEnvExists) {
        return res.status(400).json({
          error: "already in use",
          msg: "Permission cannot be deleted as it is in use.",
        });
      }

      // not in use, proceed to delete
      const deletedCount = await Environments.destroy({
        where: { env_id: id },
      });

      if (deletedCount > 0) {
        res.status(200).json({ message: "Permission deleted successfully" });
      } else {
        logError("Error Deleting permission : Permission not found", req.url);
        res.status(404).json({ error: "Permission not found" });
      }
    } catch (error) {
      logError(error.message || "Error Deleting permission", req.url);
      console.error("Error deleting permission:", error);
      res.status(500).json({ error: "Failed to delete permission" });
    }
  }

  async updatePermission(req, res) {
    const { id } = req.params;
    const { env_type, description } = req.body;

    try {
      const updated = await Environments.update(
        { env_type, description },
        { where: { env_id: id } }
      );

      if (updated[0] > 0) {
        res.status(200).json({ message: "permission updated successfully" });
      } else {
        res.status(404).json({ error: "Permission not found" });
      }
    } catch (error) {
      logError(error.message || "Error updating permission", req.url);
      console.error("error updating permission:", error);
      res.status(500).json({ error: "Failed to update permission" });
    }
  }
}
module.exports = AccessController;
