import {v4 as uuidv4}  from 'uuid';

const client = require('../index');

interface ticketAttrs {
    title: string,
    price: number,
}

class Ticket {
    id: string
    title: string;
    price: number;

    constructor (attrs: ticketAttrs) {
        this.title = attrs.title;
        this.price = attrs.price;
        this.id = uuidv4();
    }

    static  build (attrs: ticketAttrs){
        return new Ticket(attrs);
    }

    async save() {
        await client.query('INSERT INTO tickets (id, title, price) VALUES ($1, $2, $3)',
            [this.id, this.title, this.price]
        );
    }
}

export default Ticket;