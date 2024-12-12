const User_Roles = require('../models/user_rolesModel')
const { Op } = require('sequelize');

const checkUserAssociation = (checkOrgWide = true) => async (req, res, next) => {
    console.log('inside checkUserAssociation Middleware');
    
    try {
        const user_id = req.session.user_id;

        // extract project_id
        const project_id = req.body.project_id || req.query.project_id || req.session.project_id;
        console.log('user id is:',user_id);
        console.log('project id is:',project_id);
        

        if (!user_id || !project_id) {
            req.flash('error', 'User ID or Project ID is missing.');
            return res.redirect('/projects');
        }

        const query = {
            user_id,
            ...(checkOrgWide
                ? { [Op.or]: [{ project_id }, { project_id: null }] } // allow org-wide or project-specific
                : { project_id }), // only project-specific
        };
        console.log('quary is:',query);
        

        const userInUserRoles = await User_Roles.findOne({ where: query });
        console.log('userInUserRoles is:',userInUserRoles);
        

        if (!userInUserRoles) {
            req.flash('error', 'You are not authorized to access this project.');
            return res.redirect('/projects');
        }

        // attach user role details to the request object for use in the controller
        req.userRoleDetails = userInUserRoles;

        next();
    } catch (error) {
        console.error('Error checking user association:', error.message);
        res.status(500).send('Server Error');
    }
};



module.exports = checkUserAssociation;
