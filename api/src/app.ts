import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler';
import notFound from './middlewares/notFound';
import bodyParser from'body-parser';

import alertedbyRoutes from './routes/alertedbyRoutes';
import alertRoutes from './routes/alertfromaiRoutes';
import authRoutes from './routes/authRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import hadasRoutes from './routes/hadasRoutes';
import involvedinRoutes from './routes/involvedinRoutes';
import participantRoutes from './routes/participantRoutes';
import regionRoutes from './routes/regionRoutes';
import reportRoutes from './routes/reportRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app: Application = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean) as string[];


app.use(helmet()); 
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(bodyParser.json());


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.use('/api/alertedby', alertedbyRoutes);
app.use('/api/alert', alertRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/hadas', hadasRoutes);
app.use('/api/involvedin', involvedinRoutes);
app.use('/api/participant', participantRoutes);
app.use('/api/region', regionRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/user', userRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;