import mongoose from 'mongoose';
import  { app } from "./app";

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URL must be defined');
}

if (!process.env.JWT_TOKEN) {
  throw new Error('JWT_TOKEN must be defined');
}


const port = 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() =>{
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.log(error);
  });
