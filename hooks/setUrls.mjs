import { db } from "./firebaseConfig.mjs";
import { logError } from "./createRowyApp.mjs";
import { getTerraformOutput } from "./terminalUtils.mjs";

async function start() {
  try {
    const terraformOutput = await getTerraformOutput("terraform");
    console.log({ terraformOutput });
    const { rowy_backend_url, rowy_hooks_url } = terraformOutput;

    const rowyRunUrl = rowy_backend_url.value;
    const rowyHooksUrl = rowy_hooks_url.value;

    const update = {
      rowyRunBuildStatus: "COMPLETE",
      rowyRunUrl,
      services: {
        hooks: rowyHooksUrl,
      },
      rowyRunRegion: process.env.GOOGLE_CLOUD_REGION,
    };
    await db.doc("/_rowy_/settings").set(update, { merge: true });
  } catch (error) {
    console.log(error);
    await logError({
      event: "set-run-urls",
      error: error.message,
    });
    throw new Error(error.message);
  }
}

start();
