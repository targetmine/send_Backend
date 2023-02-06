import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { createContainer } from './controller/common';
import { runContainer, createTables, commitContainer } from './controller/docker';

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config(); //read the .env file 

/* I'm alive request */
app.get('/', (req: Request, res: Response) => res.send('API is alive'));

/* Requests for creating model in DB */
app.post('/container/', createContainer);
app.get('/commit/', commitContainer);

/* Requests for querying model from DB */


app.listen(process.env.PORT, () => {
	console.log(`app is listening on port ${process.env.PORT}!`);
});