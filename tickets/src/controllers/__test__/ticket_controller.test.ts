import request from 'supertest';
import { app } from '../../app';


const client = require('../../test/setup');
const myApp = request(app);
describe('test for POST /api/tickets', () => {
    describe('test for POST /api/tickets', () => {
        it('must be found', async () => {
            const res = await myApp
                .post('/api/tickets');
            expect(res.status).not.toEqual(404);
        });

        it('should require auth returns 401 for not authorised user', async () => {
            const res = await myApp.post('/api/tickets')
                .expect(401);
            //console.log(res);
            //expect(res.status).toEqual(401);
        });

        it('should require auth returns, not 401 for authorised user', async () => {
            const res = await myApp.post('/api/tickets')
                .set('Cookie', global.signIn())
                .send({});
            expect(res.status).not.toEqual(401);
        });
    })

    describe('it should return 400 for invalid or missing parameters', () => {
        it('should return 400 for invalid price', async () => {
            const res = await myApp.post('/api/tickets')
                .set('Cookie', global.signIn())
                .send({"title": "sport", "price": "string"})
                .expect(400)
        });

        it('should return 400 for negative price', async () => {
            await myApp.post('/api/tickets')
                .set('Cookie', global.signIn())
                .send({'title': "sport", "price": -200 })
                .expect(400)
        });

        it('should return 400 for missing price', async () => {
            await myApp.post('/api/tickets')
            .set('Cookie', global.signIn())
            .send({"title": "sport"})
            .expect(400)
        })

        it('should return 400 for invalid price', async () => {
            const res = await myApp.post('/api/tickets')
                .set('Cookie', global.signIn())
                .send({"title": "sport", "price": "200p"})
                .expect(400)
        });

        it('should return 400 for missing title', async() => {
            await myApp.post('/api/tickets')
            .set('Cookie', global.signIn())
            .send({"price": "20"})
            .expect(400)
        });

        it('should not return 400 for correct params', async() => {
            const res = await myApp.post('/api/tickets')
            .set('Cookie', global.signIn())
            .send({'title': "book review", "price": "500"})
            expect(res).not.toEqual(400)
        })
    })

    describe('should create and store a ticket object in the datatbase', () => {
        const title = "book review";
        const price = 200;
        it('should return 201 after creation', async () => {
            await myApp.post('/api/tickets')
            .set('Cookie', global.signIn())
            .send({ title, price })
            .expect(201);
        });

        it('should return an object with status = success', async () => {
            const res = await myApp.post('/api/tickets')
            .set('Cookie', global.signIn())
            .send({ title, price })
            expect(res.body.status).toEqual('success');
        })

        it('should store an object to the tickets table', async () => {
            const res = await myApp.post('/api/tickets')
            .set('Cookie', global.signIn())
            .send({ title, price })

            const tickets = await client.query('SELECT * FROM tickets;');
            expect(tickets.rowCount).toBeGreaterThan(0);
            expect(tickets.rowCount).toEqual(1);
            expect(tickets.rows[0].title).toEqual(title);
            expect(tickets.rows[0].price).toEqual(price)
        })
        
    })
});

/*------------------------------- get /api/tickts/:id -------------------------------------*/

describe('test for get /api/tickets/:id', () => {

    it('should return 404 if a ticket with the given id doesnt exist', async () => {
        const res = await myApp.get('/api/tickets/vghbjnkj')
        .expect(404);
    });

    it('should return 200 if the ticket exists', async () => {
        const title = "book review";
        const price = 200;
        const res = await myApp.post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({ title, price });
        const id = res.body.object.id;
        const obj = res.body.object;
        const ticky = await myApp.get(`/api/tickets/${id}`);
        expect(ticky.body.object.title).toEqual(title);
        expect(ticky.body.object.price).toEqual(price);
        expect(ticky.body.object.id).toEqual(id);
        expect(ticky.body.status).toEqual('success');
    });

});

/*------------------ get /api/tickets -------------------------------------*/

describe('tests the index route GET /api/tickets', () => {

    const addTicket = async (title: string, price: number) => {
        const res = await myApp.post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({ title, price });
    }

    it('should always return 200', async () => {
        await myApp.get('/api/tickets')
        .expect(200);
    });

    it('should return an empty list if there are no tickets availble', async () => {
        const res = await myApp.get('/api/tickets')
        expect(res.body.object.length).toEqual(0);
        const tickets = await client.query('SELECT * FROM tickets;');
        expect(tickets.rowCount).toEqual(0);
    });

    it('should return a list of all available tickets', async () => {
        const tickets = [
            {title: "book", price: 200},
            { title: "horse race", price: 500},
            {title: "concert", price: 1000}
        ]
        tickets.map((ticket) => {
            addTicket(ticket.title, ticket.price)
        });
        const res = await myApp.get('/api/tickets');
        expect(res.body.object.length).toEqual(3);
        
        const ticks = await client.query('SELECT * FROM tickets;');
        expect(ticks.rowCount).toEqual(3);
    })

});

/**----------------DELETE /api/ticket/:id ----------------------- */
describe('tests the DELETE /api/tickets/:id endpoint', () => {
    it("should return 404 if the ticket does not exist", async () => {
        myApp.delete('/api/tickets/jnkmlfgg')
        .expect(404)
    })

    it('should delete the specified ticket with status 200', async () => {
        const title = "book review";
        const price = 200;
        const res = await myApp.post('/api/tickets')
            .set('Cookie', global.signIn())
            .send({ title, price })
            expect(res.body.status).toEqual('success');
        const id = res.body.object.id;

        const ticks = await client.query('SELECT * FROM tickets;');
        expect(ticks.rowCount).toEqual(1);

        const del = await myApp.delete(`/api/tickets/${id}`)
            .set('Cookie', global.signIn())
            .expect(200);
        
        const tick  = await client.query('SELECT * FROM tickets;');
        expect(tick.rowCount).toEqual(0);
})
});


/**------------------UPDATE /api/tickets/:id ---------------------- */

describe('tests the PUT /api/tickets/:id endpoint', () => {

    it("should return 404 if ticket with given id does not exist", async () => {
        myApp.put('/api/tickets/fghj;hglfhdszdfhfkjl')
        .expect(404)
    })

    it('should return 200', async () => {
        const title = "book review";
        const price = 200;
        const res = await myApp.post('/api/tickets')
            .set('Cookie', global.signIn())
            .send({ title, price })
            expect(res.body.status).toEqual('success');
        const id = res.body.object.id;

        const update = await myApp.put(`/api/tickets/${id}`)
            .set('Cookie', global.signIn())
            .send({ title: "concert", price: 100 })
            .expect(200);
        
        const tickets  = await client.query('SELECT * FROM tickets;');
        expect(tickets.rowCount).toEqual(1);
        expect(tickets.rows[0].title).toEqual("concert");
        expect(tickets.rows[0].price).toEqual(100)
        expect(tickets.rows[0].id).toEqual(id)
    })

});