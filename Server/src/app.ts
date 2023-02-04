import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

import { connectToDB, createRESTTable, createTable } from './controller/common';
import { runContainer } from './controller/docker';

const app = express();
app.use(express.json());

dotenv.config(); //read the .env file 

/* Requests for creating model in DB */


/* Requests for querying model from DB */
app.get('/', (req: Request, res: Response) => res.send('API is alive'));

app.get('/test', connectToDB);

app.post('/element/', createTable);
app.post('/element/:name', createRESTTable);

app.get('/container/', runContainer);


app.listen(process.env.PORT, ()=>{
	console.log(`app is listening on port ${process.env.PORT}!`);
});