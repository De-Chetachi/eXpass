import { Request, Response, NextFunction } from 'express';
import 'express-async-errors'; 
import express from 'express';
import { json } from 'body-parser' ;
import cookieSession from 'cookie-session';
import { errorHandler } from '@expasshub/utils';
import { NotFoundError } from '@expasshub/utils';

//import mongoose from 'mongoose';
const routes = require('./routes');
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
  //secure: false,
}));

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.path, req.method);
    next();
});

app.use("/api/users", routes);

app.get('*', () => {
    throw new NotFoundError();
});

app.use(errorHandler);


export { app };