import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import boardRoutes from './routes/boardRoutes.js';
import listRoutes from './routes/listRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/auth', authRoutes);



const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB Connected')
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
}).catch((err) => {
    console.log('MongoDB connection error', err)
})

