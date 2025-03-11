import express from "express";
import { body, validationResult } from 'express-validator';
const AuthController = require("./controllers");

const router = express.Router();

router.post("/login", AuthController.login);

router.post("/register", [
    body('email').isEmail()
    .withMessage('email must be valid'),
    body('password').trim().isLength({ min:8 })
    .withMessage('password must be atleast 8 characters long')
], AuthController.register);

router.post("/logout", AuthController.logout);

router.get("/getUser", AuthController.getUser);

module.exports = router;