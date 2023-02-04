import { spawn } from "child_process";
import { Request, Response } from "express";

export function runContainer(req: Request, res: Response){
const ls = spawn("docker", ["run", 
  "--name", "some-postgres",
  "-p", "5433:5432",
  "-e", "POSTGRES_PASSWORD=example", 
  "-d",
  "postgres"]);
// docker run --name some-postgres -p 5433:5432 -e POSTGRES_PASSWORD=example -d  postgres

ls.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
});

ls.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
});

ls.on('error', (error) => {
    console.log(`error: ${error.message}`);
});

ls.on("close", code => {
    console.log(`child process exited with code ${code}`);
    res.send('container running')
});
}