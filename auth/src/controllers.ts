import { Request, Response} from "express";
import { validationResult } from "express-validator";
import { AuthValidationError } from './errors/authValidationError';
class AuthController {
//   constructor() {
//     this.auth = new AuthService();
//   }
  static login(req: Request, res: Response) {
    //const { email, password } = req.body;
    // const token = this.auth.login(email, password);
    res.send({to: "hello world welsome to tickethub"});
    console.log("hello world welsome to tickethub");
  }

static async register(req: Request, res: Response) {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AuthValidationError(errors.array());
    }
    else {
      const { email, password, name } = req.body;
      res.status(201).json({ email, name, password });
    }
  }


  static async logout(req: Request, res: Response) {
    // this.auth.logout();
    res.json({ message: "Logged out" });
  }

  static async getUser(req: Request, res: Response) {
    
    res.send({to: "hello world welsome to tickethub"});
    console.log("hello world welsome to tickethub");
  }
}

module.exports = AuthController;