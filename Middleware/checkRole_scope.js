const Roles = require('../Models/rolesModel')


const checkRoleScope = (requiredScope, requiredRole) => {
    return async (req, res, next) => {
        try {
            // fetch role scope dynamically based on the inputs
            const scope = await Roles.findOne({
                where: {
                    role_scope: requiredScope,
                    role_name: requiredRole,
                },
            });

            if (!scope) {
                return res.status(404).send(`Role scope for '${requiredRole}' not found.`);
            }

            // attach the role scope data to the request object
            req.roleScope = scope;
            
            next();
        } catch (error) {
            console.error('Error checking role scope:', error);
            res.status(500).send('Internal Server Error');
        }
    };
};

module.exports = checkRoleScope;