import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectToDB, createRESTTable } from './controller/common';
import { runContainer, createTables, commitContainer } from './controller/docker';

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config(); //read the .env file 

/* I'm alive request */
app.get('/', (req: Request, res: Response) => res.send('API is alive'));

/* Requests for creating model in DB */
app.get('/container/', runContainer);
app.post('/tables/', createTables);

app.get('/commit/', commitContainer);

/* Requests for querying model from DB */


app.get('/tables/', connectToDB);


app.post('/element/:name', createRESTTable);




app.listen(process.env.PORT, () => {
	console.log(`app is listening on port ${process.env.PORT}!`);
});