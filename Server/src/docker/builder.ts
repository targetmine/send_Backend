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