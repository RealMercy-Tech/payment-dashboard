import express from "express";
import bodyParser from "body-parser";
import  bcrypt from "bcrypt";
import { authSignup, authLogin } from "../services/authservice.js";
import env from "dotenv";

const router = express.Router();

//router.use(bodyParser.urlencoded({ extended: true }));
//router.use(bodyParser.json());
env.config();



//signup route
router.post("/signup", authSignup);
// login route

router.post("/login", authLogin);


export default router;

