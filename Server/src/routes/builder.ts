import express, { Request, Response } from 'express';
import { commitContainer, runContainer } from '../docker/builder';
import { Element } from '../app';
import { createTable } from '../db/builder';

const router = express.Router();

router.get('/', (req: Request, res: Response) => res.send('builder route is alive'));

router.get('/container/', (req: Request, res: Response) => {
	res.send(runContainer());
});

router.post('/tables/', (req: Request, res: Response) => {
	let eles = req.body[0];
	let rels = req.body[1];
	let message = 'tables created';
	try{
		eles.forEach(async (ele: Element) => await createTable(ele.name, ele.attributes));
	} catch (error: any){
		message = error.message;
		res.status(500);
	}
	res.send(message);
});

router.post('/commit/', (req: Request, res: Response) => {
	res.send(commitContainer());
});

export default router;



// import { Request, Response } from 'express';
// import { createTables, runContainer } from './docker';
// import { connectToDB } from './query';

// export function createContainer(req: Request, res: Response) {
// 	let eles = req.body[0];
// 	let rels = req.body[1];
// 	runContainer()
// 		.then((data)=>{
// 			console.log(`Container running: ${data}`);
// 			// res.send(data);
// 			return connectToDB();
// 		})
// 		.then(()=>{
// 			console.log('connected');
// 			let pros = createTables(eles, rels);
// 			// console.log(pros);
// 			return Promise.all(pros); //true;
// 			// return pros;
// 		})
// 		// .then((data) => {
// 		// 	console.log(`Tables?: ${data}`);
// 		// 	return Promise.all(data);
// 		// })
// 		.then(() => {
// 			console.log('tables created');
// 			return true;
// 		})
// 		.catch(error =>{
// 			console.log('error', error);
// 			res.status(500).send(error);
// 		});
// };



