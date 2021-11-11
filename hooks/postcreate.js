import { db } from "./firebaseConfig";
import { logo } from "./asciiLogo";
import { getRowyApp, registerRowyApp,logError } from "./createRowyApp";
import { getTerraformOutput } from "./terminalUtils";


async function start() {
  try {
    const terraformOutput = await getTerraformOutput("terraform");
    console.log({terraformOutput});
    const {rowy_run_url,owner_email} = terraformOutput;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT
    const rowyAppURL = `https://${projectId}.rowy.app/setup?rowyRunUrl=${rowy_run_url}`;
    const update = {
      rowyRunBuildStatus: "COMPLETE",
      rowyRunUrl:rowy_run_url,
    };
    await db.doc("/_rowy_/settings").update(update);
    
    const userManagement = {
      owner: {
        email: owner_email,
      },
    };

    await db.doc("_rowy_/userManagement").set(userManagement, { merge: true });

    const firebaseConfig = await getRowyApp(projectId);
    const { success, message } = await registerRowyApp({
      ownerEmail: owner_email,
      firebaseConfig,
      rowyRunUrl: rowy_run_url,
    });
    if (!success && message !== "project already exists")
      throw new Error(message);
    console.log(logo);
    console.log(
      `
  🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩
  🟩  🎊  Successfully deployed Rowy Run 🎊                                                  🟩
  🟩                                                                                       🟩
  🟩  Continue the setup process by going to the link below:                               🟩
  🟩  👉 ${rowyAppURL}  🟩
  🟩                                                                                       🟩
  🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩`
    );
  } catch (error) {
    console.log(error);
    await logError({
      event: "post-create",
      error: error.message,
    });
    throw new Error(error.message);
  }
}

start();
