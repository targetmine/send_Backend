import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config(); //read the .env file 

app.get('/test', (req, res, next) => {
	res.send('hello world');
})

app.listen(process.env.PORT, ()=>{
	console.log(`app is listening on port ${process.env.PORT}!`);
})