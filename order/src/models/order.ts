import { v4 as uuidv4 } from "uuid";
import { client } from "../index";
import { Ticket } from "./ticket";
import { OrderStatus } from "@expasshub/utils";


interface OrderAttrs{
    id?: string;
    status?: OrderStatus;
    expiresAt?: string;
    userId: string;
    version? : number;
    ticket: Ticket | string;
}

interface OrderSearch{
    id?: string;
    status?: OrderStatus;
    userId?: string;
    ticketId?: string;
}

export class Order {
    id: string;
    userId: string;
    ticket: Ticket | string;
    status: OrderStatus;
    expiresAt: string;
    version: number;

    constructor(attrs: OrderAttrs) {
        this.id = attrs.id || uuidv4();
        this.ticket = attrs.ticket;
        this.userId = attrs.userId;
        this.version = attrs.version || 0;
        this.status = attrs.status || OrderStatus.OrderCreated;
        const date = new Date;
        const wait = 15 * 60 * 1000
        date.setTime(date.getTime() + wait)
        this.expiresAt = attrs.expiresAt || date.toISOString();
    }

    static async build(attrs: OrderAttrs) {
        return new Order(attrs);
    }

    async save() {
        let tikid;
        if (this.ticket instanceof Ticket) {
             tikid = this.ticket.id
         } else{
            tikid = this.ticket
         }
       
        await client.query('INSERT INTO orders (id, ticketid, userid, status, expiresat, version) VALUES ($1, $2, $3, $4, $5, $6);',
            [this.id, tikid, this.userId, this.status, this.expiresAt, this.version]
        );
    }

    async populate() {
        if (!(this.ticket instanceof Ticket)){
           const ticketId = this.ticket;
           const ticket = await Ticket.findById(ticketId);
           if(!ticket) {
            throw new Error('invalid ticket id');
           }
           this.ticket = ticket;
        }
    }
    async update() {
        const old = await Ticket.findById(this.id);
        if (!old) {
            throw new Error('ticket not found');
        }
        if (old.version === this.version - 1) { 
            if (this.ticket instanceof Ticket) {
                this.ticket = this.ticket.id
            }
            
            await client.query('UPDATE orders SET ticketid = $1, userid = $2, status = $3, expiresat = $4 WHERE id = $5;',
                [this.ticket, this.userId, this.status, this.expiresAt, this.id]
            );
        }
    }
    async delete() {
        await client.query('DELETE FROM orders WHERE id = $1;',
            [this.id]
        );
    }


    static async findById(id: string) {
        const order = await client.query('SELECT * FROM orders WHERE id = $1;',
            [id]
        );

        if (order.rowCount === 0) {
            return null;
        }
        const orderObj = new Order(order.rows[0]);
        orderObj.ticket = order.rows[0].ticketid;
        orderObj.userId = order.rows[0].userid;

        return orderObj;
    }

    static async find(params: OrderSearch) {
        const keys = Object.keys(params);
        if (keys.length === 0) {
            return this.findAll();
        }
        const values = Object.values(params);
        const where = [];
        let index = 0;
        for (let key of keys){
            const condition = `${key.toLowerCase()} = $${++index}`;
            where.push(condition);
        }
        const sql = 'SELECT * FROM orders WHERE ' + where.join(' AND ') + ';';
        const orders =  await client.query(sql, values);
        return orders.rows.map((row) => {
            const order = new Order(row);
            order.ticket = row.ticketid;
            order.userId = row.userid;
            return order;
        });
    }

    static async findAll() {
        const orders = await client.query('SELECT * FROM orders;');
        return orders.rows.map((row) => {
            const order = new Order(row);
            order.ticket = row.ticketid;
            order.userId = row.userid;
            return order;
        })
    }
}