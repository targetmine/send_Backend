import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config(); //read the .env file 

app.get('/test', (req: Request, res: Response, next: NextFunction) => {
	res.send('hello world');
})

app.listen(process.env.PORT, ()=>{
	console.log(`app is listening on port ${process.env.PORT}!`);
})