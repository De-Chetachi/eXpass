import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { AuthValidationError } from "../errors/authValidationError";

export const authValidationHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
          throw new AuthValidationError(errors.array());
    }
}