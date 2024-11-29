const express = require('express')
const router = new express.Router()

const usersController = require('../Controllers/userController')
const checkRoleScope = require('../Middleware/checkRole_scope')
const checkUserAssociation = require('../Middleware/checkUserAssociation');

//get the Organization
router.get('/register', usersController.getOrganisationId)

//register user with organization id
router.post('/register', usersController.register)

//login
router.post('/login', usersController.login)

//get project status table
router.get('/project/status', usersController.getProjectStatus)

//add new project
router.post('/project/add',checkRoleScope('project', 'project_admin'), usersController.addNewProject)

//get all project 
router.get('/projects', usersController.getAllProjects)

//get selected project all detils
router.get('/project/alldetils',checkUserAssociation(true), usersController.getProjectAllDetils)

//get env status from environments table 
router.get('/project/envStatus',checkUserAssociation(true), usersController.getEnvStatus)

//delete a project
router.post('/project/delete',checkUserAssociation(true),checkRoleScope(['organization', 'project'], ['project_admin']), usersController.deleteProject)

//get all env belongs to the selected type
router.get('/project/env_type/envs',checkUserAssociation(true), usersController.getAllEnvs);

//update envs 
router.post('/project/updateEnvs', usersController.updateEnvs);

//update project details(update project - editProject)
router.post('/project/update', usersController.updateProjectDetails)


module.exports = router