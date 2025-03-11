import { Request, Response } from 'express';
import 'express-async-errors'; 
import express from 'express';
import { json } from 'body-parser' ;
import { errorHandler } from './errorHandler';
import { NotFoundError } from './errors/notFoundError';

//import mongoose from 'mongoose';
const routes = require('./routes');

const app = express();
app.use(json());


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


// mongoose.connect(process.env.MONGO_URI)
//   .then(() =>{
//     app.listen(port, () => {
//         console.log(`Server is running on port ${port}`);
//     });
//   })
//   .catch((error: Error) => {
//     console.log(error);
//   });
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
