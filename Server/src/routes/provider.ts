import express, { Request, Response } from 'express';
import { provider } from '../db/provider' ;

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
	provider.createTables(req.body.tables)
		.then((msg) => {
			console.log(msg);
			res.status(200).json();
		})
		.catch((error) => {
			console.error(error);
			res.status(409).json({error: error});
		})
});

router.put('/element/:name', (req: Request, res: Response) => {
	provider.insertTransaction(req.params.name, req.body.primaryKeys, req.body.columns, req.body.data)
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









