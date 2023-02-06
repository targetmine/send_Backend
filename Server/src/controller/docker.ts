import { spawn } from "child_process";
import { Request, Response } from "express";
import { Pool, QueryResult } from 'pg';
import { Attribute, Element, Relation } from '../controller/common';
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD, 
	port: parseInt(process.env.DB_PORT || '5432')
});

export function runContainer(req: Request, res: Response){
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
		res.status(500).send(error);
	});
	ls.on("close", code => {
			console.log(`Process closed with code ${code}`);
			res.send(out);
	});
}

export function commitContainer(req: Request, res: Response){
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
		res.status(500).send(error);
	});
	ls.on("close", code => {
			console.log(`Process closed with code ${code}`);
			res.send(out);
	});
}

export function createTables(req: Request, res: Response){
	let eles = req.body[0];
	let tablePromises: Promise<boolean>[] = [];
	eles.forEach((ele: Element) => {
		let q = `CREATE TABLE ${ele.name} ( `;
		ele.attributes.forEach((att: Attribute, idx: number) => { 
			if(idx !== 0) q += ', ' 
			q += `${att.name} ${att.type}` ;
		});
		q += `);`;
		tablePromises.push(new Promise((resolve, reject) => {
			pool.query(q, [])
				.then(function(result){
					resolve(true);
				})
				.catch(function(error){
					reject(error);
				});
		}));
	});

	Promise.all(tablePromises)
		.then((data) => {
			res.send(data);
		})
		.catch(error => {
			res.status(500);
			res.send(error);
		});
	
}