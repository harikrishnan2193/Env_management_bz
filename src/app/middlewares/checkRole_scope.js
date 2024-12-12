const Roles = require('../models/rolesModel')


const checkRoleScope = (requiredScope, requiredRole) => {
    console.log('inside checkRoleScope Middleware');
    
    return async (req, res, next) => {
        try {
            // fetch role scope dynamically based on the inputs
            const scope = await Roles.findOne({
                where: {
                    role_scope: requiredScope,
                    role_name: requiredRole,
                },
            });
            console.log('scope is:', scope);
            

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