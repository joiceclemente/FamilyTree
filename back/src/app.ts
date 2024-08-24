import express, { Application } from 'express';
import cors from 'cors';
import router from './router';
import { connectDB } from './config/dbConfig';

const app: Application = express();

connectDB();

app.use(express.json());

app.use(cors());

app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Backend is running');
  });  

export default app;
