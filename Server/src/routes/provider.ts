import express, { Request, Response } from 'express';
import { provider } from '../db/provider' ;
import { Element, Attribute } from '../extras';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
	res.send('provider route is alive');
});

// make sure that the backend is actually connected to a postgres database
// so that the model can be created and data uploaded
router.get('/connected/', async (req: Request, res: Response) =>{
	const msg = await provider.query(
		`select table_name `+
		`from information_schema.tables `+
		`where table_schema != 'pg_catalog' and table_schema != 'information_schema'`,
		[]
	);
	res.send(msg);
});

// add a list of elements (tables) to the database
router.post('/elements/', (req: Request, res: Response) => {
	const eles = req.body;
	
	let queries: Promise<string>[] = [];
	for (const ele of eles){
		let text = `CREATE TABLE ${ele.name} (`;
		ele.attributes.forEach((att: Attribute, idx: number) => { 
			if(idx !== 0) 
				text += ', ' 
			text += `${att.name} ${att.type}` ;
		});
		text += `);`;
		queries.push(provider.query(text,[]));
	}
	
	Promise.all(queries)
		.then((msgs)=>{
			console.log(typeof(msgs), msgs);
			res.status(200).json();
		})
		.catch((msgs)=>{
			console.log(typeof(msgs), msgs);
			res.status(409).json({error: msgs}); 
		});
});

router.put('/element/:name', (req: Request, res: Response) => {
	provider.insertTransaction(req.params.name, req.body.columns, req.body.data)
		.then((msg) => {
			console.log(msg);
			res.status(200).json();
		})
		.catch((error) => {
			console.error(error);
			res.status(409).json({error: error});
		});
});

router.put('/attribute/:element/:name', (req: Request, res: Response) => {
	let message = 'Error: To be implemented\n';
	res.status(503);
	res.send(message);
});

router.put('/relation/:name', (req: Request, res: Response) => {
	let message = 'Error: To be implemented\n';
	res.status(503);
	res.send(message);
});

export default router;









