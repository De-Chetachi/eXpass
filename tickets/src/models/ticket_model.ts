import {v4 as uuidv4}  from 'uuid';
import { client } from '../index';

//let client: Client;
// if(process.env.NODE_ENV === "test") {
//     client = require('../test/setup');
// } else {
//     client = require('../index');
// }

interface ticketAttrs {
    id?: string;
    version: number;
    title: string,
    price: number,
    userId: string,
}

class Ticket {
    id: string
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId: string | null = null;

    constructor (attrs: ticketAttrs) {
        this.title = attrs.title;
        this.price = attrs.price;
        this.userId = attrs.userId;
        this.id = attrs.id || uuidv4();
        this.version = attrs.version
    }


    get isReserved() {
        if (this.orderId) {
            return true;
        }
        return false;
    }

    static  build (attrs: ticketAttrs){
        return new Ticket(attrs);
    }

    async save() {
        await client.query('INSERT INTO tickets (id, title, price, userId, version) VALUES ($1, $2, $3, $4, $5);',
            [this.id, this.title, this.price, this.userId, this.version]
        );
    }

    async update() {
        const old = await Ticket.findById(this.id);
        if (!old) {
            throw new Error('ticket not found');
        }
        if(this.version === old.version + 1) {
            await client.query('UPDATE tickets SET title = $1, price = $2, version = $3, orderId = $4 WHERE id = $5;',
                [this.title, this.price, this.version, this.orderId, this.id]
            );
        } 
    }


    async delete() {
        await client.query('DELETE FROM tickets WHERE id = $1;',
            [this.id]
        )
    }

    static async findAll(): Promise<Ticket[]> {
        const tickets = await client.query('SELECT * FROM tickets;');
        return tickets.rows.map((row) => {
            const ticket = new Ticket(row);
            ticket.userId = row.userid;
            ticket.orderId = row.orderid || null;
            return ticket;
        });
    }

    static async findById(id: string) : Promise<Ticket | null> {
        try{
            const ticket = await client.query('SELECT * FROM tickets WHERE id = $1;',
                [id]
            );
            if (ticket.rowCount === 0) {
                return null;
            }
            const ticketObj =  new Ticket(ticket.rows[0]);
            ticketObj.userId = ticket.rows[0].userid;
            ticketObj.orderId = ticket.rows[0].orderid || null;
            return ticketObj;

        } catch(err: any) {
            console.log(err.message);
            return null;
        }
    }

}

export default Ticket;