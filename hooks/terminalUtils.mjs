import * as child from "child_process";

export function execute(command, callback) {
  console.log(command);
  child.exec(command, function (error, stdout, stderr) {
    console.log({ error, stdout, stderr });
    callback(stdout);
  });
}

export const asyncExecute = async (command, callback) =>
  new Promise(async (resolve, reject) => {
    child.exec(command, async function (error, stdout, stderr) {
      console.log({ error, stdout, stderr });
      await callback(error, stdout, stderr);
      resolve(!error);
    });
  });
export const getTerraformOutput =(chdir)=> new Promise((resolve,reject) =>{
  execute(`terraform -chdir=${chdir} output -json`, (stdout) => {
    const output = JSON.parse(stdout);
    resolve(output)
  });
});