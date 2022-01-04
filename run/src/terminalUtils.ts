import { spawn, exec } from "child_process";

export function execute(command: string, callback: any) {
  console.log(command);
  exec(command, function (error, stdout, stderr) {
    console.log({ error, stdout, stderr });
    callback(stdout);
  });
}

export const asyncExecute = async (command: string, callback?: any) =>
  new Promise(async (resolve, reject) => {
    exec(command, async function (error, stdout, stderr) {
      console.log({ error, stdout, stderr });
      if (callback) await callback(error, stdout, stderr);
      resolve(!error);
    });
  });
export const asyncSpawn = async (command: string, args: string[]) =>
  new Promise(async (resolve, reject) => {
    const execution = spawn(command, args, { stdio: "inherit" });
    // execution.stdout.on("data", function (data: any) {
    //   console.log("stdout: " + data.toString());
    // });

    // execution.stderr.on("data", function (data: any) {
    //   console.log("stderr: " + data.toString());
    // });

    execution.on("exit", function (code: any) {
      console.log("child process exited with code" + code.toString());
      resolve(code);
    });
  });
