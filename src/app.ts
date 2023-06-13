import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import provider from './routes/provider';
import querier from './routes/querier'; 

dotenv.config(); //read the .env file 
const app = express();
app.use(express.json({limit: '10mb'})); // limit for the request body
app.use(cors());

// default route
app.get('/', (req: Request, res: Response) => res.send('API is alive') );
// routes for provider front-end
app.use('/provider/', provider);
// routes for querier front-end
app.use('/querier/', querier);

app.listen(process.env.PORT, () => {
	console.log(`app is listening on port ${process.env.PORT}!`);
});

process.on('uncaughtException', err => console.log(`Undhandled error ${err}`));