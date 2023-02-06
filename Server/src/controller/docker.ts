import { spawn } from "child_process";
import { QueryResult } from "pg";
import { Attribute, Element, Relation } from '../controller/common';
import { createTableQuery } from "./query";

export function runContainer(): Promise<string>{
	return new Promise((resolve, reject) => {
		const ls = spawn('docker', ['run', 
			'--name', `${process.env.DB_CONTAINER_NAME}`,
			'--rm',
			'-p', `${process.env.DB_PORT}:5432`,
			'-e', `POSTGRES_PASSWORD=${process.env.DB_PASSWORD}`,
			'-e', `PGDATA=${process.env.DB_PGDATA}`,
			'-d',
			'postgres']);
		let out: string = '';
		ls.stdout.on('data', data => {
			out += `${data}`;
			console.log(`stdout: ${data}`);
		});
		ls.stderr.on('data', data => {
			out += `${data}`;
			console.log(`stderr: ${data}`);
		});
		ls.on('error', (error) => {
			console.log(`error: ${error.message}`);
			reject(error);
		});
		ls.on("close", code => {
			console.log(`Process closed with code ${code}`);
			resolve(out);
		});
	});
}

export function commitContainer(): Promise<string>{
	return new Promise((resolve, reject) => {
		const ls = spawn('docker', ['commit', 
			`${process.env.DB_CONTAINER_NAME}`,
			`${process.env.DOCKER_USER}/dataShare-data:latest`]);
		let out: string = '';
		ls.stdout.on('data', data => {
			out += `${data}`;
			console.log(`stdout: ${data}`);
		});
		ls.stderr.on('data', data => {
			out += `${data}`;
			console.log(`stderr: ${data}`);
		});
		ls.on('error', (error) => {
			console.log(`error: ${error.message}`);
			reject(error);
		});
		ls.on("close", code => {
			console.log(`Process closed with code ${code}`);
			resolve(out);
		});
	});
}

export function createTables(elements: Element[], relations: Relation[]) {
	let tablePromises: Promise<QueryResult>[] = [];
	elements.forEach((ele: Element) => {
		let q = `CREATE TABLE ${ele.name} ( `;
		ele.attributes.forEach((att: Attribute, idx: number) => { 
			if(idx !== 0) q += ', ' 
			q += `${att.name} ${att.type}` ;
		});
		q += `);`;
		tablePromises.push(createTableQuery(q));
	});

	return tablePromises;
	// Promise.all(tablePromises)
	// 	.then(() => {
	// 		return new Promise((resolve, reject) => {
	// 			resolve('Tables created');
	// 		});
	// 	})
	// 	.catch(error => {
	// 		return new Promise((resolve, reject) => {
	// 			reject(error);
	// 		});
	// 	});

}