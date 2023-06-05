import express, { Request, Response } from 'express';
import { provider } from '../db/provider' ;
import { ExpressValidator, validationResult } from 'express-validator';

const router = express.Router();

const { body } = new ExpressValidator({}, 
	// custom sanitizers
	{
		dataSanitize: (value: string) => {			
			const sv =  value.replaceAll(`'`, `''`);
			return `'${sv}'`;
		}
	}
);
/*------------------*/
/* GET REQUESTS     */
/*------------------*/

/*------------------*/
/* POST REQUESTS    */
/*------------------*/

// request to set the model in the database, including both elements and relations
router.post('/model/', (req: Request, res: Response) => {
	provider.saveModel(req.body)
	.then(msg => {
		console.log(`POST /model/ request: ${msg}`);
		res.status(200).json(msg);
	})
	.catch(error => {
		console.error(`POST /model/ request error: ${error.msg}\n`);
		res.status(300).json({error: error.msg});
	});
})

// add a list of elements (tables) to the database
router.post('/element/', (req: Request, res: Response) => {
	provider.createTable(req.body)
	.then(msg => {
		console.log(`POST /elements/ request: ${msg}`);
		res.status(200).json(msg);
	}) 
	.catch(error => {
		console.error(`POST /elements/ request error: ${error.msg}`);
		res.status(409).json({error: error.msg});
	});
});

/*------------------*/
/* PUT REQUESTS     */
/*------------------*/

// add columns to an existing element
router.put('/element/add-column/', (req: Request, res: Response) => {
	provider.addColumn(req.body.name, req.body.columns)
	.then(msg => {
		console.log(`PUT /element/add-column/ request: ${msg}`);
		res.status(200).json(msg);
	})
	.catch(error => {
		console.error(`PUT /element/add-column/ request error: ${error.msg}`);
		res.status(409).json({error: error.msg});
	});
});

// add values (rows) to an existing element (table)
router.put('/element/:name', body('data.*.*').exists().dataSanitize(), (req: Request, res: Response) => {
	// if data does not get validate, trigger the corresponding error
	const result = validationResult(req);
	if( !result.isEmpty() ){
		console.error(`PUT /element/:name request error: ${result.array()}`);
		res.status(422).json({error: result.array()});
	}
	provider.insertTransaction(req.params.name, req.body.primaryKeys, req.body.columns, req.body.data)
	.then((msg) => {
		console.log(`PUT /element/:name request: ${msg}`);
			res.status(200).json(msg);
	})
	.catch((error) => {
		console.error(`PUT /element/:name error request: ${error.msg}`);
		res.status(409).json({error: error.msg});
	});
});

export default router;