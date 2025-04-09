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
    
    it('it should return 404 for missing id', async () => {
        await myApp.get('/api/tickets')
        .expect(404);

    });

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
    it('should return an empty list if there are not tickets availble', async () => {

    });

    it('should return a list of all available tickets', async () => {
        
    })

});