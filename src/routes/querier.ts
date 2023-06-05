import express, { Request, Response } from 'express';
import { querier } from '../db/querier';
import { toStringArray } from '../extras';

const router = express.Router();

/*------------------*/
/* GET REQUESTS     */
/*------------------*/

// retrieve the list of elements and relations of the stored model
router.get('/model/', (_: Request, res: Response) => {
	querier.getModel()
	.then(msg => {
		console.log(`GET /model/ request: ${msg}`);
		res.status(200).json(msg);
	})
	.catch(error => {
		console.error(`GET /model/ request error: ${error.msg}`);
		res.status(409).json({error: error});
	});
});

// retrieve the details of a single table in the database
router.get('/element/:name?', (req: Request, res: Response) => {
	const atts = toStringArray(req.query.attr);
	querier.getElement(req.params.name, atts, Number(req.query.rows))
	.then(msg =>{
		console.log(`GET /element/:name? request: ${msg}`);
		res.status(200).json(msg);
	})
	.catch(error => {
		console.error(`GET /model/:name? request error: ${error.msg}`);
		res.status(409).json({error: error.msg});
	});
});

/*------------------*/
/* POST REQUESTS    */
/*------------------*/
/*------------------*/
/* PUT REQUESTS     */
/*------------------*/

export default router;