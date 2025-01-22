// import { createGuestUser } from '@/lib/auth';
import { Hono } from 'hono';

const app = new Hono().post('/', async (c) => {
    // const { token } = await createGuestUser();
    // return c.json({ generatedToken: token });
    return c.json({ message: 'returns new user!' });
});

export default app;
