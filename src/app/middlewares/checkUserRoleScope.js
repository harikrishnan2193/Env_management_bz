const User_Roles = require('../models/user_rolesModel')
const Roles = require('../models/rolesModel')

const checkUserRoleScope = (requiredScope) => {
    console.log('inside checkUserRoleScope middleware');

    return async (req, res, next) => {
        try {
            // user_id from session
            const userId = req.session.user_id;

            if (!userId) {
                return res.status(401).send('Unauthorized: User not authenticated');
            }

            // all role_ids assigned to the user
            const userRoles = await User_Roles.findAll({
                where: { user_id: userId },
                attributes: ['role_id'],
            });

            if (!userRoles || userRoles.length === 0) {
                return res.render('404', { message: 'Access Denied: User has no roles assigned' });
            }

            // extract role_ids
            const roleIds = userRoles.map((role) => role.role_id);

            // check any of the role_ids has the required role_scope
            const roles = await Roles.findAll({
                where: {
                    role_id: roleIds,
                    role_scope: requiredScope,
                },
            });

            if (roles && roles.length > 0) {
                return next();
            }
            else {
                return res.render('404', { message: 'Access Denied: Insufficient Permissions' });
            }

        } catch (error) {
            console.error('Error in checkUserRoleScope middleware:', error);
            return res.status(500).send('Internal Server Error');
        }
    };
};

module.exports = checkUserRoleScope;
