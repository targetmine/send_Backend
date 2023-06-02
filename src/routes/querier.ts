import express, { Request, Response } from 'express';
import { querier } from '../db/querier';
import { toString } from 'express-validator/src/utils';
import { type } from 'os';

const router = express.Router();

router.get('/model/', (req: Request, res: Response) => {
	querier.getModel()
		.then(msg => {
			console.log(`Get model request: ${msg}`);
			res.status(200).json(
				JSON.parse(msg)
			)
		})
		.catch(error => {
			console.error(`Get model error: ${error.message}`);
			res.status(409).json({error: error});
		})
});

router.get('/element/:name?', (req: Request, res: Response) => {
	const atts = toStringArray(req.query.attr);
	querier.getElement(req.params.name, atts, Number(req.query.rows))
	 	.then(msg =>{
			console.log(`Get element request: ${msg}\n`);
			res.status(200).json(msg);
		})
	 	.catch(error => {
			console.error(`Get element error: ${error.msg}\n`);
			res.status(409).json({error: error.msg});
		});
});


function toStringArray(foo: any): string[]|undefined{
	if (!Array.isArray(foo)) return undefined;
	let s: string[] = [];
	foo.forEach(_ => {
		if (typeof _ !== 'string') return undefined;
		s.push(_ as string);
	})
	return s;
}

export default router;