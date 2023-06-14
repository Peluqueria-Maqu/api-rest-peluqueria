import 'dotenv/config';
import './DATABASE/connectdb.js';
import express from 'express';
import authRoute from './src/routes/auth.route.js';

const app = express();

app.use(express.json());
app.use('/api/v1', authRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🎇🎇🎇🎇🎇🎇  http://localhost:${PORT}  🎇🎇🎇🎇🎇🎇`))