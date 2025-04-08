import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from '@expasshub/utils';
import cookieSession from 'cookie-session';
import { currentUser } from '@expasshub/utils';


const routes = require('./routes/index');
const app = express();

app.use(json());

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !=='test',
}));

app.use(currentUser);

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.path, req.method)
    next();
});

app.use('/api/tickets', routes);

// app.get('*', () => {
//     throw new NotFoundError();
// });

app.use(errorHandler);

export { app };