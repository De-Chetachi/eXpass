//import { router } from "../app";
import { requireAuth, NotAuthorizedError, NotFoundError } from "@expasshub/utils";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import express from "express";
import { Request, Response } from "express";

const router = express.Router();
router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {

    //find the orders
    const orders = await Order.find({ userId: req.currentUser!.id });
    for (let order of orders) {
        await order.populate();
    }

    res.status(200).json({ status: "success", message: "orders successfully retrieved", object: orders });
});

export {router as getAllRouter};