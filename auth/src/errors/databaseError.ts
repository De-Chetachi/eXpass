import { CustomError } from "./customError";

export class DatabaseError extends CustomError {
    statusCode = 500;
    reason = "error connecting to database";

    constructor() {
        super("error connecting to database");

        Object.setPrototypeOf(this, DatabaseError.prototype);
    }

    serializeErrors(): { message: string; field?: string; }[] {
        return [{ message: this.reason }]
    }
}