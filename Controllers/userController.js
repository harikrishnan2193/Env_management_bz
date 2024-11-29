const Organization = require('../Models/organizationsModel')
const User = require('../Models/usersModel')
const Projects = require('../Models/projectsModel')
const Project_env = require('../Models/project_envModel')
const Satuses = require('../Models/statusModel')
const Environments = require('../Models/environmentsModel')
const User_Roles = require('../Models/user_rolesModel')
const Permission = require('../Models/permissionModel')
const Roles = require('../Models/rolesModel')

// const { Op } = require('sequelize'); // Import Sequelize operators

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
//sesion - organization_id , project_id , user_id , env_id , project_env_id , project_id_edit

//get Organisation_id in register page
exports.getOrganisationId = async (req, res) => {
    console.log('Inside getOrganizationId and user rolles controller');

    try {
        // Fetch the first record from the organization table
        const organizations = await Organization.findAll();

        // //get all roles from roles table 
        // const roles = await Roles.findAll();
        // console.log(roles);

        // first organization or default to null if none found
        const organization = organizations.length > 0 ? organizations[0] : null;

        res.render('auth', {
            isRegisterPath: true,
            organization: organization || null,
            // allRoles: roles || null,
        });

    } catch (error) {
        console.error('Error fetching organization details:', error.message);
        res.status(500).send('Server Error');
    }
}

//register function
exports.register = async (req, res) => {
    console.log('Inside controller register function');

    const { username, email, password, organization_id } = req.body

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            req.flash('error', 'Account already exists.')
            return res.redirect('/register')
        }
        else {
            // generate 10-character UUID
            const user_id = uuidv4().replace(/-/g, '').slice(0, 10);
            // hash password
            const hashedPassword = await bcrypt.hash(password, 10)

            // create new user in the database
            const newUser = await User.create({
                user_id,
                organization_id,
                username,
                email,
                password_hash: hashedPassword
            })

        }

        req.flash('success', 'Registration successful! You can now log in.');
        return res.redirect('/');

    } catch (error) {
        console.error('Error during user registration:', error);
        req.flash('error', 'Something went wrong. Please try again.');
        return res.redirect('/register');
    }
}

//login function
exports.login = async (req, res) => {
    console.log('Inside login controller');

    const { email, password } = req.body

    if (!email || !password) {
        req.flash('error', 'Please fill out all fields.');
        return res.redirect('/');
    }

    try {
        const user = await User.findOne({ where: { email } })
        const user_id = user.user_id
        console.log(user_id);
        req.session.user_id = user_id // Store user_id in session


        if (!user) {
            req.flash('error', 'Invalid email or password.')
            return res.redirect('/')
        }
        else {
            const passwordMatch = await bcrypt.compare(password, user.password_hash)


            if (!passwordMatch) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/');
            }
            else {

                req.session.regenerate((err) => {
                    if (err) {
                        console.error("Error regenerating session:", err);
                        req.flash('error', 'Something went wrong. Please try again.');
                        return res.redirect('/');
                    }
                
                    req.session.user_id = user.user_id;
                    req.session.organization_id = user.organization_id; // set organisation_id in session
                
                    // token for authentication
                    // const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET);
                    // console.log("JWT Token:", token);
                
                    req.flash('success', 'Login successful!');
                    return res.redirect('/projects');
                });
            }
        }

    } catch (error) {
        req.flash('error', 'Something went wrong. Please try again.');
        return res.redirect('/')
    }
}

//get project status table
exports.getProjectStatus = async (req, res) => {
    console.log('inside getProjectStatus Controller');

    try {
        const status = await Satuses.findAll();

        res.render('addProjects', { status });
        console.log(status);

    } catch (error) {
        console.error('Error fetching projects:', error.message);
        res.status(500).send('Server Error');
    }
}

//add new project
exports.addNewProject = async (req, res) => {
    console.log("Inside addNewProject Controller");

    const { name, description, technology, status } = req.body;
    const organization_id = req.session.organization_id;
    const user_id = req.session.user_id;

    if (!organization_id) {
        return res.status(401).send('Session expired. Please log in again.');
    }

    if (!name || !description || !technology || !status) {
        return res.status(400).send('Please fill all the fields.');
    }

    try {
        // Generate a unique project_id
        const project_id = uuidv4();

        await Projects.create({
            project_id,
            organization_id,
            project_name: name,
            description,
            status_id: status,
            technology,
        });

        // Use the role scope data from the middleware
        const scope = req.roleScope; // Access the role scope from middleware

        await User_Roles.create({
            user_id,
            organization_id,
            project_id,
            role_id: scope.role_id, // Dynamically assign role_id
            assigned_by: user_id,
        });

        // Get all env_id values from the Environments table
        const allEnvs = await Environments.findAll();

        // Insert or update permissions for each environment
        for (const env of allEnvs) {
            const env_id = env.env_id;

            // Check if permission already exists
            const existingPermission = await Permission.findOne({
                where: {
                    role_id: scope.role_id, // Use dynamically fetched role_id
                    env_id,
                },
            });

            if (existingPermission) {
                // Update the existing permission
                await existingPermission.update({
                    can_view: 1,
                    can_edit: 1,
                });
            } else {
                // Insert new permission if it does not exist
                await Permission.create({
                    role_id: scope.role_id, // Use dynamically fetched role_id
                    env_id,
                    can_view: 1,
                    can_edit: 1,
                });
            }
        }
        
        res.redirect('/projects');
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).send("Internal Server Error");
    }
}

//get all project 
exports.getAllProjects = async (req, res) => {
    console.log('inside getAllProject Controller');
    const organization_id = req.session.organization_id;

    if (!organization_id) {
        console.log("Organization ID is undefined in session");
        return res.status(401).send('Organization ID not found in session. Please login again');
    }
    else {
        try {
            const projects = await Projects.findAll({
                where: { organization_id }
            });

            res.render('projects', { projects });

        } catch (error) {
            console.error('Error fetching projects:', error.message);
            res.status(500).send('Server Error');
        }
    }
}

// get selected project all detils (edit button)
exports.getProjectAllDetils = async (req, res) => {
    console.log('Inside getProjectAllDetils Controller');

    const { project_id } = req.query;
    req.session.project_id_edit = project_id; // Store project_id in session as project_id_edit

    if (!project_id) {
        console.log("project_id is not provided");
        return res.status(401).send('project_id is not provided');
    }

    try {
        // Middleware attaches user role details to req.userRoleDetails
        const userRoleDetails = req.userRoleDetails;
        console.log('userRoleDetails is:', userRoleDetails);
        

        const projectDetils = await Projects.findAll({
            where: { project_id },
        });

        const status = await Satuses.findAll();
        console.log(status);

        const role_id = userRoleDetails.role_id; // Access the role_id from middleware

        res.render('editProject', { projectDetils, status, role_id });
        console.log(projectDetils);
    } catch (error) {
        console.error('Error fetching project details:', error.message);
        res.status(500).send('Server Error');
    }
}

//get env status from environments table ,check user in user_roles ,check role_scope
exports.getEnvStatus = async (req, res) => {
    console.log('Inside getEnvStatus controller');

    const { project_id } = req.query;
    req.session.project_id = project_id; // Store selected project's project_id in session

    try {
        // Middleware provides userRoleDetails
        const userRoleDetails = req.userRoleDetails;

        // Fetch all environments
        const envStatus = await Environments.findAll();

        // Fetch role_scope and role_name from the Roles table
        const roleDetails = await Roles.findOne({
            where: { role_id: userRoleDetails.role_id },
        });

        if (!roleDetails) {
            req.flash('error', 'Role details not found.');
            return res.redirect('/projects');
        }

        // Render the frontend with role details
        res.render('projectEnvs', {
            envStatus,
            roleDetails: {
                role_scope: roleDetails.role_scope,
                role_name: roleDetails.role_name,
            },
            allEnvs: [], //allEnvs: [] is used in getAllEnvs controller
        });
    } catch (error) {
        console.error('Error fetching environment status or role details:', error.message);
        res.status(500).send('Server Error');
    }
}

// Controller function to delete a project
exports.deleteProject = async (req, res) => {
    const { project_id } = req.body;

    if (!project_id) {
        return res.status(400).send('Project ID is required');
    }

    try {
        // The middlewares ensure user association and permissions; no need to re-check
        // Perform deletion of the project and associated records
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
        req.flash('success', 'Project deleted successfully.');
        res.redirect('/projects');
    } catch (error) {
        console.error('Error deleting project:', error.message);
        res.status(500).send('Server Error');
    }
}

// Get all environments belonging to the selected type
exports.getAllEnvs = async (req, res) => {
    console.log('Inside getAllEnvs controller');

    const { env_id } = req.query;
    const project_id = req.session.project_id;
    const userRoleDetails = req.userRoleDetails; // Populated by checkUserAssociation middleware

    console.log('env_id is:', env_id);
    req.session.env_id = env_id // save env_id in session

    // Validate required parameters
    if (!env_id || !project_id) {
        console.log('env_id or project_id is not available');
        return res.status(400).send('env_id or project_id is not available. Please login again...');
    }

    try {
        // Get role_id and ensure role details are available
        const role_id = userRoleDetails.role_id;

        // Fetch role details (role_scope and role_name) from Roles table
        const roleDetails = await Roles.findOne({
            where: {
                role_id: role_id,
            },
        });
        if (!roleDetails) {
            console.log("Role details not found.");
            return res.status(403).send('Role details not found.');
        }

        // Fetch permissions for the user's role and environment
        const permission = await Permission.findOne({
            where: { role_id, env_id },
        });

        // Check if the user has view/edit permissions
        const canView = permission ? permission.can_view === 1 : false;
        const canEdit = permission ? permission.can_edit === 1 : false;

        // Fetch all environments for the project and env_id
        const allEnvs = await Project_env.findAll({
            where: {
                project_id,
                env_id,
            },
        });

        // Fetch environment statuses
        const envStatus = await Environments.findAll();

        if (allEnvs.length > 0) {
            const project_env_id = allEnvs[0].project_env_id;
            req.session.project_env_id = project_env_id; // Store project_env_id in the session
        }

        // Render the environments page
        return res.render('projectEnvs', {
            envStatus,
            allEnvs,
            canView,
            canEdit,
            roleDetails 
        });
    } catch (error) {
        console.error('Error fetching all environments:', error.message);
        res.status(500).send('Server Error');
    }
}

// update envs 
exports.updateEnvs = async (req, res) => {
    console.log('Inside updateEnvs controller');

    try {
        const envData = req.body;
        const project_id = req.session.project_id;
        const env_id = req.session.env_id;
        const user_id = req.session.user_id;

        console.log("Project ID:", project_id);
        console.log("Env ID:", env_id);
        console.log('user_id:', user_id);


        // validate IDs
        if (!project_id || !env_id) {
            return res.status(400).send('Project ID or Env ID is missing.');
        }

        // check the record exists
        const existingEnv = await Project_env.findOne({
            where: {
                project_id: project_id,
                env_id: env_id
            }
        });

        if (existingEnv) {
            // If found, update it
            await Project_env.update(
                {
                    env_content: envData.env_content,
                    updated_by: user_id
                },

                {
                    where: {
                        project_id: project_id,
                        env_id: env_id
                    }
                }
            );
            req.flash('success', 'Your environment was updated successfully!');
        } else {
            // If not found, create a new entry with a new uuid
            const newProjectEnvId = uuidv4();

            await Project_env.create({
                project_env_id: newProjectEnvId,
                project_id: project_id,
                env_id: env_id,
                env_content: envData.env_content,
                updated_by: user_id
            });
            req.flash('success', 'A new environment was created successfully!');
        }

        res.redirect('/project/env_type/envs?env_id=' + env_id);

    } catch (error) {
        console.error('Error updating or creating environment:', error.message);
        res.status(500).send('Server Error');
    }
}

// Controller function to update project details(editProject)
exports.updateProjectDetails = async (req, res) => {
    const { name, description, technology, status, project_id } = req.body;
    if (!project_id) {
        return res.status(400).send('Project ID is required');
    }

    try {
        // Update project details in the database
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

        console.log('Project details updated successfully');
        res.redirect('/projects');

    } catch (error) {
        console.error('Error updating project details:', error.message);
        res.status(500).send('Server Error');
    }
}
