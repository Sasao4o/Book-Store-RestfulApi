const express = require("express");;
const router = express.Router();
const userController = require("../controller/userController"); 
const authController = require("../controller/authController"); 

router.route("/").post(userController.createUser).get(userController.getUser);
router.route("/register").post(authController.register);
router.route("/login").post(authController.login, authController.loginMultiFactor);
router.route("/forgetPw").post(authController.forgetPw);
router.route("/resetPw/:token").post(authController.resetPw);
router.route("/multifactorauth").post(authController.protect, authController.enableMultiFactor, authController.veriftMultiFactor)
router.route("/newpassword").post(authController.protect, authController.updatePw);

 
module.exports = router;
