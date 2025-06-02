import express from "express";
import { Request, Response, NextFunction } from 'express';
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { errorHandler, currentUser } from '@expasshub/utils'
import { getRouter } from "./routes/get";
import { getAllRouter } from "./routes/index";
//import { deleteRouter } from "./routes/delete";
//import { updateRouter } from "./routes/update";
import { createRouter } from "./routes/create";

export const router = express.Router();

export const app = express();
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
}));

app.use(currentUser);

app.use(getAllRouter);
app.use(createRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.path, req.method);
    next();
});
//app.use(getRouter);
//app.use(getAllRouter);
app.use(errorHandler);




