import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import index from './routes/index';
import builder from './routes/builder';

dotenv.config(); //read the .env file 
const app = express();
app.use(express.json());
app.use(cors());

/* import routes */
app.use('/', index);

app.use('/builder/', builder);


app.listen(process.env.PORT, () => {
	console.log(`app is listening on port ${process.env.PORT}!`);
});

export interface Attribute{
	name: string;
	type: 'varchar(40)' | 'text' | 'integer' | 'double precision';
	unique: boolean;
}

export interface Element{
	name: string;
	attributes: Attribute[];
}

export interface Relation{
	name: string;
	srcElement: string;
	srcAttribute: string;
	trgElement: string;
	trgAttribute: string;
	cardinality: 'one to one' | 'one to many' | 'many to one' | 'many to many';
}