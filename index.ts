// Importing env variables
import 'dotenv/config';

// Importing packages
import express, { Express } from 'express';
import cors from 'cors';

// Importing configs
import routes from './src/routes/index';
import mongooseConnect from './src/configs/mongoose.config';

const app: Express = express();
const port = process.env.PORT;

mongooseConnect();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.listen(port, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${port} - ${new Date().toDateString()} / ${new Date().toLocaleTimeString()}`
  );
});
