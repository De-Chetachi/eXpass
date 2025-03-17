import request from 'supertest';
import { app } from '../app';


//signup test

it('returns a 201 on successful sign up',
    async () => {
        return request(app)
        .post('/api/users/register')
        .send({
            email: 'cheta@gmail.com',
            password: 'password',
            username: 'cheta',
        })
        .expect(201);
    }
);

it('returns 400 for invalid email or password', 
    async () => {
        return request(app)
        .post('/api/users/register')
        .send({
            email: 'cheta@gmail.com',
            password: 'pass',
            username: 'cheta',
        })
        .expect(400);
    }
);

it('returns 400 for invalid email or password', 
    async () => {
        return request(app)
        .post('/api/users/register')
        .send({
            email: 'cheta@gmail',
            password: 'password',
            username: 'cheta',
        })
        .expect(400);
    }
);

it('returns 400 for invalid email or password', 
    async () => {
        return request(app)
        .post('/api/users/register')
        .send({
            email: 'cheta@gmail',
            password: 'password',
            username: 'cheta',
        })
        .expect(400);
    }
);

it('returns 400 for missing username', 
    async () => {
        return request(app)
        .post('/api/users/register')
        .send({
            email: 'cheta@gmail',
            password: 'password',
        })
        .expect(400);
    }
);

it('returns 400 for missing password', 
    async () => {
        return request(app)
        .post('/api/users/register')
        .send({
            email: 'cheta@gmail',
            username: 'cheta',
        })
        .expect(400);
    }
);

it('returns 400 for missing email', 
    async () => {
        return request(app)
        .post('/api/users/register')
        .send({
            password: 'password',
            username: 'cheta',
        })
        .expect(400);
    }
);

it('disallows duplicate account', async () => {
    await request(app)
    .post('/api/users/register')
    .send({
        email: 'cheta@gmail.com',
        password: 'password',
        username: 'cheta',
    })
    .expect(201);


    await request(app)
    .post('/api/users/register')
    .send({
        email: 'cheta@gmail.com',
        password: 'password',
        username: 'cheta',
    })
    .expect(400);
})


//signin test
it('returns a 400 on trying to login a non existent account',
    async () => {
        await request(app)
        .post('/api/users/login')
        .send({
            email: 'cheta@gmail.com',
            password: 'password',
        })
        .expect(400);
    }
);

it('returns a 200 and sets cookie on successful login',
    async () => {
        await request(app)
        .post('/api/users/register')
        .send({
            email: 'cheta@gmail.com',
            password: 'password',
            username: 'cheta',
        })
        .expect(201);
    const res = await request(app)
        .post('/api/users/login')
        .send({
            email: 'cheta@gmail.com',
            password: 'password',
        })
        .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
    }
);

it('fails for invalid credentials',
    async () => {
        await request(app)
        .post('/api/users/register')
        .send({
            email: 'cheta@gmail.com',
            password: 'password',
            username: 'cheta',
        })
        .expect(201);
        await request(app)
        .post('/api/users/login')
        .send({
            email: 'cheta@gmail.com',
            password: 'passworded',
        })
        .expect(400);
    }
);


//get user test

it('returns 200 for logged in user', async () => {

    const cookie = await getAuthCookie();
    const res = await request(app)
        .get('/api/users/getUser')
        .set('Cookie', cookie)
        .send()
        .expect(200);
    expect(res.body.object.email).toEqual('cheta@gmail.com');
})



//logout test

it('clears cookie after signout', async () => {
    await request(app)
    .post('/api/users/register')
    .send({
        email: 'cheta@gmail.com',
        password: 'password',
        username: 'cheta',
    })
    .expect(201)

    await request(app)
    .post('/api/users/login')
    .send({
        email: 'cheta@gmail.com',
        password: 'password',
    })
    .expect(200);
    
    const res = await request(app)
    .post('/api/users/logout')
    .send({})
    .expect(200);
    const cookie = res.get('Set-Cookie');
    if (!cookie) throw new Error("Expected cookie but got undefined.");
    expect(cookie[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
})