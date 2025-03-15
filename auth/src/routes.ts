import express from "express";
import { body, validationResult } from 'express-validator';
import { authValidationHandler } from "./middlewares/authValidationHandler";
import { currentUser } from "./middlewares/currentUser";

const AuthController = require("./controllers");

const router = express.Router();

router.post("/register", [
    body('email').isEmail()
    .withMessage('email must be valid'),
    body('password').trim().isLength({ min:8 })
    .withMessage('password must be atleast 8 characters long'),
    body('username').notEmpty()
    .withMessage('please provide a username')
], authValidationHandler, AuthController.register);

router.post("/login", [
    body('email').isEmail()
    .withMessage('email must be a valid email'),
    body('password').trim().notEmpty()
    .withMessage('provide a valid password')
], AuthController.login);

 
router.post("/logout", AuthController.logout);

router.get("/getUser", currentUser, AuthController.getUser);

module.exports = router;