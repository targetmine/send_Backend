import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import index from './routes/index';
import provider from './routes/provider';

dotenv.config(); //read the .env file 
const app = express();
app.use(express.json({limit: '10mb'}));
app.use(cors());

/* import routes */
app.use('/', index);

app.use('/provider/', provider);

app.listen(process.env.PORT, () => {
	console.log(`app is listening on port ${process.env.PORT}!`);
});