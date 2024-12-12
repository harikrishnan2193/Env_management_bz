const express = require('express')
const router = new express.Router()

const checkRoleScope = require('../app/middlewares/checkRole_scope')
const checkUserRoleScope = require('../app/middlewares/checkUserRoleScope')

const AccessController = require('../app/controllers/accessController')
const accessController = new AccessController() //instance


//route to get all users and all roles
router.get('/getAllUsers_AllRoles', accessController.getAllusers_Allroles)

//add user to user_roles table
router.post('/postUser_roles', accessController.postUser_roles) //

// Route to get the logged-in user's role_scope
router.get('/getUserRoleScope', accessController.getUserRoleScope);

//Render roles managing page
router.get('/superadmin/permission', checkUserRoleScope('organization'), accessController.renderPermissions)

//get all roles to permission page
router.get('/getAllRoles_toPermision', accessController.getAllRoles_toPermision);

// remove a role
router.delete('/removeRole/:roleId', accessController.removeRole);

//get all env_typs
router.get('/getenv/typs', accessController.getAllEnvTypes);

// get update permission
router.post('/updatePermission', accessController.getUpdatedPermission) //

// fetch selected permission for a given role and environment
router.post('/getselected/permissions', accessController.getSelectedPermissions) //

//add new roles 
router.post('/addNewRoles', accessController.addNewRoles);

//get user associated with that project
router.get('/users/associated', accessController.users_Associated);

//remove a user from user_rols table
router.delete('/users/delete/:id', accessController.remove_Auser)

//add super admin
router.post('/postnew_admin', checkRoleScope(['organization'], ['admin']), accessController.postNew_admin)

module.exports = router