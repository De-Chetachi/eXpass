import { Request, Response, NextFunction } from "express";
import { CustomError  } from "./errors/customError";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction 
) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({ errors: err.serializeErrors() });
    }
    else {
        res.status(400).json({
            errors: [{ message: 'something went wrong'}]
        });
    }

}