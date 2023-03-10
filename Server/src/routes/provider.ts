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
router.post('/elements/', async (req: Request, res: Response) => {
	const eles = req.body;
	let message = 'Success';
	try{
	eles.forEach(async (ele: Element) => {
		let text = `CREATE TABLE ${ele.name} (`;
		ele.attributes.forEach((att: Attribute, idx: number) => { 
			if(idx !== 0) 
				text += ', ' 
			text += `${att.name} ${att.type}` ;
		});
		text += `);`;

	
		await provider.query(text,[]);
		 

	// const { rows } = await provider.query(text, []);
// 	let rels = req.body[1];
// 	let message = 'tables created';
// 	try{
// 		eles.forEach(async (ele: Element) => await createTable(ele.name, ele.attributes));
// 	} catch (error: any){
// 		message = error.message;
// 		res.status(500);
// 	}
// 	res.send(message);
		});
	} catch(e: any){
			res.status(409);
			message = e.message;
			console.error(`post provider/elements/\n${e.message}`);
		}

// router.post('/commit/', (req: Request, res: Response) => {
	res.send(message);

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









