import {v4 as uuidv4}  from 'uuid';
import { Client } from 'pg';

let client: Client;
if(process.env.NODE_ENV === "test") {
    client = require('../test/setup');
} else {
    client = require('../index');
}

interface ticketAttrs {
    title: string,
    price: number,
    userId: string,
}

class Ticket {
    id: string
    title: string;
    price: number;
    userId: string;

    constructor (attrs: ticketAttrs) {
        this.title = attrs.title;
        this.price = attrs.price;
        this.userId = attrs.userId;
        this.id = uuidv4();
    }

    static  build (attrs: ticketAttrs){
        return new Ticket(attrs);
    }

    async save() {
        await client.query('INSERT INTO tickets (id, title, price, userId) VALUES ($1, $2, $3, $4)',
            [this.id, this.title, this.price, this.userId]
        );
    }
    static async findAll(): Promise<Ticket[]> {
        const tickets = await client.query('SELECT * FROM tickets');
        return tickets.rows.map((row: ticketAttrs) => {
           return new Ticket(row);
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
            ticketObj.id = ticket.rows[0].id;
            return ticketObj;

        } catch(err: any) {
            console.log(err.message);
            return null;
        }
    }
}

export default Ticket;