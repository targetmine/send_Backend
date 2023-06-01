import { spawnSync } from "child_process";

export function runContainer(){
	let command = spawnSync('docker', ['run', 
		'--name', `${process.env.DB_CONTAINER_NAME}`,
		'--rm',
		'-p', `${process.env.DB_PORT}:5432`,
		'-e', `POSTGRES_PASSWORD=${process.env.DB_PASSWORD}`,
		'-e', `PGDATA=${process.env.DB_PGDATA}`,
		'-d',
		'postgres']);
		
	if( command.error ){
		console.log(`docker run error: ${command.error.message}`);
		throw command.error;
	}

	console.log(`docker run exit - code: ${command.status} & signal: ${command.signal}`);
	return `docker run exit - code: ${command.status} & signal: ${command.signal}`;
}

export function commitContainer(){
	const command = spawnSync('docker', ['commit', 
		`${process.env.DB_CONTAINER_NAME}`,
		`${process.env.DOCKER_USER}/datashare-data:latest`]);
		
	if( command.error ){
		console.log(`docker commit error: ${command.error.message}`);
		throw command.error;
	}
	
	console.log(`docker commit exit - code: ${command.status} & signal: ${command.signal}`);
	return `docker commit exit - code: ${command.status} & signal: ${command.signal}`;
}

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