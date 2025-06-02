//import { router } from "../app";
import { requireAuth, NotAuthorizedError, NotFoundError } from "@expasshub/utils";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import express from "express";

const router = express.Router();   

router.get("/api/orders/:orderId", requireAuth, async (req, res, next) => {
    const orderId = req.params.orderId;
    console.log(orderId);

    //find the order
    const order = await Order.findById(orderId);
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    order.populate();

    res.status(200).json({ status: "success", message: "order successfully retrieved", object: order });
});

export { router as getRouter };