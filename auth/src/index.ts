import { Request, Response } from 'express';
import mongoose from 'mongoose';
import 'express-async-errors'; 
import express from 'express';
import { json } from 'body-parser' ;
import cookieSession from 'cookie-session';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/notFoundError';

//import mongoose from 'mongoose';
const routes = require('./routes');

const app = express();
app.set('trust-proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: true
}));

app.use((req: Request, res: Response, next) => {
    console.log(req.path, req.method);
    next();
})

const port = 5000;
app.use("/api/users", routes);

app.get('*', () => {
    throw new NotFoundError();
});

app.use(errorHandler);

if (!process.env.JWT_TOKEN) {
  throw new Error('JWT_TOKEN must be defined');
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URL must be defined');
}

mongoose.connect(process.env.MONGO_URI)
  .then(() =>{
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.log(error);
  });
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
