import express, { Request, Response } from 'express';
// import { commitContainer, runContainer } from '../docker/builder';
// import { Element } from '../app';
// import { createTable } from '../db/builder';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
	res.send('provider route is alive');
});

// make sure that the backend is actually connected to a postgres database
// so that the model can be created and data uploaded
router.get('/connected/', (req: Request, res: Response) =>{

});

router.post('/tables/', (req: Request, res: Response) => {
	let message = 'Error: To be implemented\n';
	res.status(503);
	res.send(message);

	
// 	let eles = req.body[0];
// 	let rels = req.body[1];
// 	let message = 'tables created';
// 	try{
// 		eles.forEach(async (ele: Element) => await createTable(ele.name, ele.attributes));
// 	} catch (error: any){
// 		message = error.message;
// 		res.status(500);
// 	}
// 	res.send(message);
// });

// router.post('/commit/', (req: Request, res: Response) => {
// 	res.send(commitContainer());

});

router.post('/element/:name', (req: Request, res: Response) => {
	let message = 'Error: To be implemented\n';
	res.status(503);
	res.send(message);
});

router.post('/attribute/:element/:name', (req: Request, res: Response) => {
	let message = 'Error: To be implemented\n';
	res.status(503);
	res.send(message);
});

router.post('/relation/:name', (req: Request, res: Response) => {
	let message = 'Error: To be implemented\n';
	res.status(503);
	res.send(message);
});

export default router;









