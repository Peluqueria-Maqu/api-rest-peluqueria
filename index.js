import 'dotenv/config';
import './DATABASE/connectdb.js';
import express from 'express';
import apiRouter from './src/routes/api.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1', apiRouter);

// solo para el ejemplo del login/token
app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🎇🎇🎇🎇🎇🎇  http://localhost:${PORT}  🎇🎇🎇🎇🎇🎇`))