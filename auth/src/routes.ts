import express from "express";
import { body, validationResult } from 'express-validator';
import { authValidationHandler } from "@expasshub/utils";
import { currentUser } from "@expasshub/utils";

const AuthController = require("./controllers/userController");

const router = express.Router();

router.post("/register", [
    body('email').isEmail()
    .withMessage('email must be valid'),
    body('password').trim().isLength({ min:8 })
    .withMessage('password must be atleast 8 characters long'),
    body('username').notEmpty()
    .withMessage('please provide a username')
], currentUser, authValidationHandler, AuthController.register);

router.post("/login", currentUser, AuthController.login);

 
router.post("/logout", AuthController.logout);

router.get("/getUser", currentUser, AuthController.getUser);

module.exports = router;