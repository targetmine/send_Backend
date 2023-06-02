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

router.post('/model/', (req: Request, res: Response) => {
	provider.saveModel(req.body)
	.then(msg => {
		console.log(`Model request response: ${msg}`);
		res.status(200).json(msg);
	})
	.catch(error => {
		console.error(`Model request error: ${error.msg}\n`);
		res.status(300).json({error: error.msg});
	})
})

// add a list of elements (tables) to the database
router.post('/element/', (req: Request, res: Response) => {
	provider.createTable(req.body)
	.then(values => {
		res.status(200).json(values);
	}) 
	.catch(error => {
		res.status(409).json({error: error});
	})
});

// add columns to an existing element
router.put('/element/add-column/', (req: Request, res: Response) => {
	provider.addColumn(req.body.name, req.body.columns)
		.then(msg => {
			res.status(200).json(msg);
		})
		.catch(error => {
			res.status(409).json({error: error});
		})
});

router.put('/element/:name', body('data.*.*').exists().dataSanitize(), (req: Request, res: Response) => {
	const result = validationResult(req);
	if( !result. isEmpty() ){
		res.status(422).json({error: result.array()});
	}
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

export default router;









