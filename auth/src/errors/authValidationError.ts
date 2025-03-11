import { CustomError } from "./customError";
import { ValidationError } from "express-validator";

export class AuthValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super("error validating user");
        Object.setPrototypeOf(this, AuthValidationError.prototype);
    }

    serializeErrors(): { message: string; field?: string }[] {
        return this.errors.map(err => {
            if (err.type === "field") {
                return { message: err.msg, field: err.path };
            }
            return { message: err.msg };
        });
    }
}