import { Request, Response, NextFunction } from 'express';

class TicketController {
    static async getTickets(req: Request, res: Response, next: NextFunction){
        res.send();
    }
}

export default TicketController; 