const express = require("express")
const router = new express.Router()

const checkRoleScope = require("../app/middlewares/checkRole_scope")
const checkUserAssociation = require("../app/middlewares/checkUserAssociation")

const UsersController = require("../app/controllers/userController")
const usersController = new UsersController(); //instance

//get the Organization
router.get("/register", usersController.getOrganisationId)

//register user with organization id
router.post("/register", usersController.register)

//login
router.post("/login", usersController.login)

//render forget password page
router.get("/forgetPage", usersController.forgetPage)

//forget pasword
router.post("/forgot-password", usersController.forgotPassword)

//render reset-password page
router.get("/reset-password/:token", (req, res) => {res.render("reset-password", { token: req.params.token })})

//reset password
router.post("/reset-password/:token", usersController.resetPassword)

//get project status table
router.get("/project/status", usersController.getProjectStatus)

//add new project
router.post("/project/add",checkRoleScope("project", "Project_admin"),usersController.addNewProject)

//get all project
router.get("/projects", usersController.getAllProjects)

//get selected project all detils
router.get("/project/alldetils",checkUserAssociation(true),usersController.getProjectAllDetils)

//get env status from environments table
router.get("/project/envStatus",checkUserAssociation(true),usersController.getEnvStatus)

//delete a project
router.post("/project/delete",checkUserAssociation(true),usersController.deleteProject)

//get all env belongs to the selected type
router.get("/project/env_type/envs",checkUserAssociation(true),usersController.getAllEnvs)

//update envs
router.post("/project/updateEnvs", usersController.updateEnvs)

//update project details(update project - editProject)
router.post("/project/update", usersController.updateProjectDetails)

//logout
router.get("/logout", usersController.logout)

// Route to render the profile page
router.get("/profile", usersController.renderProfile)

// api endpoint to fetch profile data
router.get("/api/profile", usersController.getProfileData)

//change password
router.put("/api/change-password", usersController.changePassword)

// get history of a project
router.get('/project/history', usersController.getHistoryByProject)

module.exports = router
