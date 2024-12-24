const Organization = require("../models/organizationsModel");
const User = require("../models/usersModel");
const Projects = require("../models/projectsModel");
const Project_env = require("../models/project_envModel");
const Satuses = require("../models/statusModel");
const Environments = require("../models/environmentsModel");
const User_Roles = require("../models/user_rolesModel");
const Permission = require("../models/permissionModel");
const Roles = require("../models/rolesModel");

const { Op } = require("sequelize"); // Import Sequelize operators

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const crypto = require("crypto");
const transporter = require("../../core/nodeMailer/mailer");
const { logError } = require("../../../errorLogger");
//sesion - organization_id , project_id , user_id , env_id , project_env_id , project_id_edit

class UserController {
  //get Organisation_id in register page
  async getOrganisationId(req, res) {
    console.log("Inside getOrganizationId and user rolles controller");

    try {
      // fetch the first record from the organization table
      const organizations = await Organization.findAll();

      // first organization or default to null if none found
      const organization = organizations.length > 0 ? organizations[0] : null;

      res.render("auth", {
        isRegisterPath: true,
        organization: organization || null,
      });
    } catch (error) {
      console.error("Error fetching organization details:", error.message);
      logError(error.message || "Error fetching organization details", req.url);
      res.status(500).send("Server Error");
    }
  }

  //register function
  async register(req, res) {
    console.log("Inside controller register function");

    const { username, email, password, organization_id } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        req.flash("error", "Account already exists.");
        return res.redirect("/register");
      } else {
        // generate 10-character UUID
        const user_id = uuidv4().replace(/-/g, "").slice(0, 10);
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user in the database
        const newUser = await User.create({
          user_id,
          organization_id,
          username,
          email,
          password_hash: hashedPassword,
        });
      }

      req.flash("success", "Registration successful! You can now log in.");
      return res.redirect("/");
    } catch (error) {
      console.error("Error during user registration:", error);
      logError(error.message, req.url);
      req.flash("error", "Something went wrong. Please try again.");
      return res.redirect("/register");
    }
  }

  //login function
  async login(req, res) {
    console.log("Inside login controller");

    const { email, password } = req.body;

    if (!email || !password) {
      req.flash("error", "Please fill out all fields.");
      return res.redirect("/");
    }

    try {
      const user = await User.findOne({ where: { email } });
      const user_id = user.user_id;
      console.log(user_id);
      req.session.user_id = user_id; // Store user_id in session

      if (!user) {
        req.flash("error", "User not found.");
        logError("Error logging in : User not found", req.url);
        return res.redirect("/");
      } else {
        const passwordMatch = await bcrypt.compare(
          password,
          user.password_hash
        );

        if (!passwordMatch) {
          req.flash("error", "Invalid email or password.");
          logError("Invalid email or password (password mismatch).", req.url);
          return res.redirect("/");
        } else {
          req.session.regenerate((err) => {
            if (err) {
              logError(err.message || "Error regenerating session:", req.url);
              console.error("Error regenerating session:", err);
              req.flash("error", "Something went wrong. Please try again.");
              return res.redirect("/");
            }

            req.session.user_id = user.user_id;
            req.session.organization_id = user.organization_id; // set organisation_id in session

            // token for authentication
            // const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET);
            // console.log("JWT Token:", token);

            req.flash("success", "Login successful!");
            return res.redirect("/projects");
          });
        }
      }
    } catch (error) {
      req.flash("error", "Something went wrong. Please try again.");
      logError(error.message, req.url);
      return res.redirect("/");
    }
  }

  // render forget password page
  async forgetPage(req, res) {
    try {
      res.render("forgetPassword", {
        title: "Forget Password",
      });
    } catch (error) {
      console.error("Error rendering forget password page:", error);
      logError(
        error.message || "Error rendering forget password page:",
        req.url
      );
      req.flash("error", "Something went wrong. Please try again.");
      return res.redirect("/");
    }
  }

  // forget pasword
  async forgotPassword(req, res) {
    console.log("inside forgotPassword controller");

    const { email } = req.body;

    if (!email) {
      req.flash("error", "Please provide your email.");
      return res.redirect("/forgetPage");
    }

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        req.flash("error", "No account found with this email.");
        logError("Account not found with this email", req.url);
        console.log("No account found with this email.");
        return res.redirect("/forgetPage");
      }

      // generate reset token
      const token = crypto.randomBytes(32).toString("hex");
      const resetToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      const resetTokenExpires = Date.now() + 3600000; // experation 1 hr

      // update user with token and expiration
      user.reset_token = resetToken;
      user.reset_token_expires = resetTokenExpires;
      await user.save();

      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/reset-password/${token}`;

      await transporter.sendMail({
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
              <h2 style="text-align: center; color: #007BFF;">Password Reset Request</h2>
              <p style="font-size: 16px;">You requested a password reset. Click the link below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 25px; margin-top: 15px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
              </div>
              <p style="font-size: 16px; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
              <p style="font-size: 14px; color: #888888; text-align: center; margin-top: 40px;">If you have any questions, feel free to contact our support team.</p>
            </div>
          </div>`,
      });

      req.flash("success", "Password reset link sent to your email.");
      console.log("Password reset link sent to the email.");
      return res.redirect("/forgetPage");
    } catch (error) {
      console.error(error);
      logError(error.message, req.url);
      req.flash("error", "Something went wrong. Please try again.");
      return res.redirect("/forgetPage");
    }
  }

  //reset password
  async resetPassword(req, res) {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      req.flash("error", "Please provide all required fields.");
      return res.redirect(`/reset-password/${token}`);
    }

    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match. Please try again.");
      return res.redirect(`/reset-password/${token}`);
    }

    try {
      const resetToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      const user = await User.findOne({
        where: {
          reset_token: resetToken,
          reset_token_expires: { [Op.gt]: Date.now() },
        },
      });

      if (!user) {
        req.flash("error", "Invalid User or expired token.");
        logError("Invalid User or expired token.", req.url);
        return res.redirect("/forgetPage");
      } else {
        // update password
        user.password_hash = await bcrypt.hash(password, 10);
        user.reset_token = null;
        user.reset_token_expires = null;
        await user.save();
      }

      req.flash("success", "Password updated successfully.");
      return res.redirect("/");
    } catch (error) {
      console.error(error);
      logError(error.message, req.url);
      req.flash("error", "Something went wrong. Please try again.");
      return res.redirect("/forgetPage");
    }
  }

  //get project status table
  async getProjectStatus(req, res) {
    console.log("inside getProjectStatus Controller");

    try {
      const status = await Satuses.findAll();

      res.render("addProjects", { status });
      console.log(status);
    } catch (error) {
      logError(error.message || "Error fetching projects", req.url);
      console.error("Error fetching projects:", error.message);
      res.status(500).send("Server Error");
    }
  }

  //add new project
  async addNewProject(req, res) {
    console.log("Inside addNewProject Controller");

    const { name, description, technology, status } = req.body;
    const organization_id = req.session.organization_id;
    const user_id = req.session.user_id;

    if (!organization_id) {
      console.log("Session expired. Please log in again.");
      req.flash("error", "Invalid Please login again.");
      return res.redirect("/");
    }

    if (!name || !description || !technology || !status) {
      return res.status(400).send("Please fill all the fields.");
    }

    try {
      // generate a unique project_id
      const project_id = uuidv4();

      await Projects.create({
        project_id,
        organization_id,
        project_name: name,
        description,
        status_id: status,
        technology,
      });

      const scope = req.roleScope; // from middleware

      await User_Roles.create({
        user_id,
        organization_id,
        project_id,
        role_id: scope.role_id,
        assigned_by: user_id,
      });

      const allEnvs = await Environments.findAll();

      for (const env of allEnvs) {
        const env_id = env.env_id;

        // check if permission already exists
        const existingPermission = await Permission.findOne({
          where: {
            role_id: scope.role_id, // dynamically fetched role_id
            env_id,
          },
        });

        if (existingPermission) {
          // update the existing permission
          await existingPermission.update({
            can_view: 1,
            can_edit: 1,
          });
        } else {
          await Permission.create({
            role_id: scope.role_id,
            env_id,
            can_view: 1,
            can_edit: 1,
          });
        }
      }

      res.redirect("/projects");
    } catch (error) {
      logError(error.message || "Error creating project", req.url);
      console.error("Error creating project:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  // get all projects
  async getAllProjects(req, res) {
    console.log("Inside getAllProjects Controller");
    const organization_id = req.session.organization_id;
    const user_id = req.session.user_id;

    if (!organization_id || !user_id) {
      console.log("Organization ID or User ID is not found in session");
      req.flash("error", "Please login again.");
      return res.redirect("/");
    }

    try {
      const userRoles = await User_Roles.findAll({
        where: { user_id, organization_id },
      });

      let projects = [];

      if (userRoles.length === 0) {
        console.log("User has no roles assigned and is not a admin privilage");
        return res.render("projects", { projects });
      }

      if (userRoles.some((role) => role.project_id === null)) {
        console.log("User is a superadmin");
        projects = await Projects.findAll({
          where: { organization_id },
        });
      } else {
        const projectIds = userRoles.map((role) => role.project_id);

        projects = await Projects.findAll({
          where: {
            organization_id,
            project_id: projectIds,
          },
        });
      }

      res.render("projects", { projects });
    } catch (error) {
      logError(error.message || "Error fetching projects", req.url);
      console.error("Error fetching projects:", error.message);
      res.status(500).send("Server Error");
    }
  }

  // get selected project all detils (edit button)
  async getProjectAllDetils(req, res) {
    console.log("Inside getProjectAllDetils Controller");

    const { project_id } = req.query;
    req.session.project_id_edit = project_id; // store project_id in session as project_id_edit

    if (!project_id) {
      console.log("project_id is not provided");
      req.flash("error", "Please select a project.");
      return res.redirect("/projects");
    }

    try {
      const userRoleDetails = req.userRoleDetails;
      console.log("userRoleDetails is:", userRoleDetails);

      const projectDetils = await Projects.findAll({
        where: { project_id },
      });

      const status = await Satuses.findAll();
      console.log(status);

      const role_id = userRoleDetails.role_id; // from middleware

      res.render("editProject", { projectDetils, status, role_id });
      console.log(projectDetils);
    } catch (error) {
      logError(error.message || "Error fetching project details", req.url);
      console.error("Error fetching project details:", error.message);
      res.status(500).send("Server Error");
    }
  }

  //get env status from environments table ,check user in user_roles ,check role_scope
  async getEnvStatus(req, res) {
    console.log("Inside getEnvStatus controller");

    // remove the env_id from session
    if (req.session.env_id) {
      delete req.session.env_id;
    }

    const { project_id } = req.query;
    req.session.project_id = project_id; // store selected project's project_id in session

    try {
      const userRoleDetails = req.userRoleDetails;

      const envStatus = await Environments.findAll();

      // fetch role_scope and role_name from the Roles table
      const roleDetails = await Roles.findOne({
        where: { role_id: userRoleDetails.role_id },
      });

      if (!roleDetails) {
        req.flash("error", "Role details not found.");
        return res.redirect("/projects");
      }

      res.render("projectEnvs", {
        envStatus,
        roleDetails: {
          role_scope: roleDetails.role_scope,
          role_name: roleDetails.role_name,
        },
        allEnvs: [], //allEnvs: [] is used in getAllEnvs controller
      });
    } catch (error) {
      logError(
        error.message || "Error fetching environment status or role details",
        req.url
      );
      console.error(
        "Error fetching environment status or role details:",
        error.message
      );
      res.status(500).send("Server Error");
    }
  }

  //delete a project
  async deleteProject(req, res) {
    console.log("inside delete controller");

    const { project_id } = req.body;

    // console.log('User Role Details:', req.userRoleDetails);

    if (!project_id) {
      return res.status(400).send("Project ID is required");
    }

    try {
      // middleware
      const { role_id } = req.userRoleDetails;

      // check the user's role matches
      const role = await Roles.findOne({
        where: {
          role_id,
          [Op.or]: [
            { role_scope: "organization" },
            { role_scope: "project", role_name: "project_admin" }, //organization or project && project_admin
          ],
        },
      });

      if (!role) {
        logError("Error Deleting Project: Authorization error", req.url);
        req.flash("error", "You are not authorized to delete this project.");
        return res.redirect("/projects");
      }

      await Projects.destroy({
        where: { project_id },
      });
      await Project_env.destroy({
        where: { project_id },
      });
      await User_Roles.destroy({
        where: { project_id },
      });

      console.log(`Project with ID ${project_id} deleted successfully`);
      req.flash("success", "Project deleted successfully.");
      res.redirect("/projects");
    } catch (error) {
      logError(error.message || "Error deleting project", req.url);
      console.error("Error deleting project:", error.message);
      res.status(500).send("Server Error");
    }
  }

  // get all environments belonging to the selected type
  async getAllEnvs(req, res) {
    console.log("Inside getAllEnvs controller");

    const { env_id } = req.query;
    const project_id = req.session.project_id;
    const userRoleDetails = req.userRoleDetails; // checkUserAssociation middleware

    console.log("env_id is:", env_id);
    req.session.env_id = env_id; // save env_id in session

    if (!env_id || !project_id) {
      console.log("env_id or project_id is not available");
      req.flash("error", "Please select the project.");
      return res.redirect("/projects");
    }

    try {
      // get role_id and ensure role details are available
      const role_id = userRoleDetails.role_id;

      // fetch role details (role_scope and role_name) from Roles table
      const roleDetails = await Roles.findOne({
        where: {
          role_id: role_id,
        },
      });
      if (!roleDetails) {
        console.log("Role details not found.");
        logError("Role details Not Found", req.url);
        return res.status(403).send("Role details not found.");
      }

      const permission = await Permission.findOne({
        where: { role_id, env_id },
      });

      // check if the user has view/edit permissions
      const canView = permission ? permission.can_view === 1 : false;
      const canEdit = permission ? permission.can_edit === 1 : false;

      // fetch all environments for the project and env_id
      const allEnvs = await Project_env.findAll({
        where: {
          project_id,
          env_id,
        },
      });

      // fetch environment statuses
      const envStatus = await Environments.findAll();

      if (allEnvs.length > 0) {
        const project_env_id = allEnvs[0].project_env_id;
        req.session.project_env_id = project_env_id; // store project_env_id in the session
      }

      return res.render("projectEnvs", {
        envStatus,
        allEnvs,
        canView,
        canEdit,
        roleDetails,
      });
    } catch (error) {
      logError(error.message || "Error fetching all environments", req.url);
      console.error("Error fetching all environments:", error.message);
      res.status(500).send("Server Error");
    }
  }

  // update envs
  async updateEnvs(req, res) {
    // console.log("Inside updateEnvs controller");

    try {
      const envData = req.body;
      const project_id = req.session.project_id;
      const env_id = req.session.env_id;
      const user_id = req.session.user_id;

      if (!project_id || !env_id) {
        req.flash("error", "Env is missing. Please select an Env type");
        return res.redirect(`/project/envStatus?project_id=${project_id}`);
      }

      // check the record exists
      const existingEnv = await Project_env.findOne({
        where: {
          project_id: project_id,
          env_id: env_id,
        },
      });

      if (existingEnv) {
        await Project_env.update(
          {
            env_content: envData.env_content.trim(),
            updated_by: user_id,
          },

          {
            where: {
              project_id: project_id,
              env_id: env_id,
            },
          }
        );
        req.flash("success", "Your environment was updated successfully!");
      } else {
        const newProjectEnvId = uuidv4();

        await Project_env.create({
          project_env_id: newProjectEnvId,
          project_id: project_id,
          env_id: env_id,
          env_content: envData.env_content,
          updated_by: user_id,
        });
        req.flash("success", "A new environment was created successfully!");
      }

      res.redirect("/project/env_type/envs?env_id=" + env_id);
    } catch (error) {
      logError(
        error.message || "Error updating or creating environment",
        req.url
      );
      console.error("Error updating or creating environment:", error.message);
      res.status(500).send("Server Error");
    }
  }

  // controller function to update project details(editProject)
  async updateProjectDetails(req, res) {
    console.log("inside updateProjectDetails controller");
    const { name, description, technology, status, project_id } = req.body;

    if (!project_id) {
      console.log("Project ID is required");
      req.flash("error", "Please select a project.");
      return res.redirect("/projects");
    }

    try {
      await Projects.update(
        {
          project_name: name,
          description: description,
          technology: technology,
          status_id: status,
        },
        {
          where: { project_id: project_id },
        }
      );

      console.log("Project details updated successfully");
      res.redirect("/projects");
    } catch (error) {
      logError(error.message || "Error updating project details", req.url);
      console.error("Error updating project details:", error.message);
      res.status(500).send("Server Error");
    }
  }

  // logout function
  async logout(req, res) {
    console.log("inside logout controller");

    req.session.destroy((err) => {
      if (err) {
        logError("Logout Failure", req.url);
        console.error("Error destroying session:", err);
        return res.redirect(
          "/projects?message=Unable to logout. Please try again."
        );
      }

      res.clearCookie("connect.sid"); // clear the session cookie
      return res.redirect("/");
    });
  }

  //!Profile related functions
  // render profile page
  async renderProfile(req, res) {
    try {
      const user_id = req.session.user_id;

      if (!user_id) {
        return res.redirect("/");
      }

      res.render("profile");
    } catch (error) {
      logError(error.message || "Error rendering profile page", req.url);
      console.error("Error rendering profile page:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  // send profile data
  async getProfileData(req, res) {
    try {
      const user_id = req.session.user_id;

      if (!user_id) {
        logError("Error fetching profile data : Unauthorized", req.url);
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findOne({ where: { user_id } });

      if (!user) {
        logError("Error fetching profile data : User not found", req.url);
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        userId: user.user_id,
        email: user.email,
        username: user.username,
        password: user.password_hash,
      });
    } catch (error) {
      logError(error.message || "Error fetching profile data", req.url);
      console.error("Error fetching profile data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // change password
  async changePassword(req, res) {
    const { oldPassword, oldPasswordHash, newPassword, userId } = req.body;

    try {
      const match = await bcrypt.compare(oldPassword, oldPasswordHash);

      if (!match) {
        logError(
          "Error updating password : Old and new password does not matching",
          req.url
        );
        return res.status(400).json({ error: "old password is incorrect" });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      const updated = await User.update(
        { password_hash: newPasswordHash },
        { where: { user_id: userId } }
      );

      if (updated[0] > 0) {
        res.status(200).json({ message: "Password updated successfully!" });
      } else {
        logError("Error updating password : User not found", req.url);
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      logError(error.message || "Error updating password", req.url);
      console.error("Error updating password:", error);
      res.status(500).json({ error: "Error updating passowrd" });
    }
  }
}

module.exports = UserController;
