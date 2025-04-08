import request from 'supertest';
import { app } from '../../app';

const myApp = request(app);
describe('ticket controller test', () => {
    describe('test for POST /api/tickets', () => {
        it('must be found', async () => {
            const res = await myApp
                .post('/api/tickets');
            expect(res.status).not.toEqual(404);
        });

        it('should require auth returns 401 for not authorised user', async () => {
            await myApp.post('/api/tickets')
                .expect(401);
        });

        it('should require auth returns, not 401 for authorised user', async () => {
            const res = await myApp.post('/api/tickets')
                .set('Cookie', global.signIn())
                .send({});
            expect(res.status).not.toEqual(401);
        });


        it('should return 201 statuscode on success', async() => {
            const res = await myApp.post('/api/tickets')
                .set('Cookie', global.signIn())
                .send({})

        });


        it('should create and store a ticket object in the datatbase', async () => {

        });

        it('should return object with status success on success', async () => {

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
                .send({'title': "sport", "price": "-200"})
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
                .send({"title": "sport", "price": ["200"]})
                .expect(400)
        });

        it('should return 400 for missing title', async() => {
            await myApp.post('/api/tickets')
            .set('Cookie', global.signIn())
            .send({"price": "20"})
            .expect(400)
        });
    })
})