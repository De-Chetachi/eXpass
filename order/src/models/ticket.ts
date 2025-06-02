import { client } from "../index";
import {v4 as uuidv4} from "uuid";
import { Order } from "./order";
import { OrderStatus } from "@expasshub/utils";

interface ticketAttrs {
    id?: string;
    title: string;
    price: number;
    version: number;
}

export class Ticket {
    id: string;
    title: string;
    price: number;
    version: number;

    constructor(attrs: ticketAttrs) {
        this.id = attrs.id || uuidv4();
        this.title = attrs.title;
        this.price = attrs.price;
        this.version = attrs.version;
    }
    async save() {
        console.log('Saving ticket:', this);    
        try{
            const log_ = await client.query('INSERT INTO tickets (id, title, price, version) VALUES ($1, $2, $3, $4);',
                [this.id, this.title, this.price, this.version]
            );
        } catch (error: any) {
            console.error('Error saving ticket:', error);
        }
    }

    async isReserved() {
       const orders = await Order.find({ ticketId: this.id });
       if (!orders.length) {
           return false;
       }
       if (orders[0].status === OrderStatus.OrderCancelled) {
        return false;
       }
       return true;
    }

    async update() {
        const old = await Ticket.findById(this.id);
        if (!old) {
            throw new Error('tickt not found');
        }
        if (this.version !== old.version + 1) {
            throw new Error('version inconsistent');
        }
        await client.query('UPDATE tickets SET id = $1, price = $2, version = $3, title = $4;',
            [this.id, this.price, this.version, this.title]
        );
    }

    async delete() {
        await client.query('DELETE FROM tickets WHERE id = $1;',
            [this.id]
        );
    }

    static async build(attrs: ticketAttrs) {
        return new Ticket(attrs);
    }

    static async findById(id: string) {
        const ticket = await client.query('SELECT * FROM tickets WHERE id = $1;',
            [id]
        );

        if (ticket.rowCount === 0) {
            return null;
        }
        const ticketObj = new Ticket(ticket.rows[0]);
        return ticketObj;
    }

    static async findAll() {
        const tickets = await client.query('SELECT * FROM tickets;');
        return tickets.rows.map((row) => {
            const ticket = new Ticket(row);
            return ticket;
        })
    }

}