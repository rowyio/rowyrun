import { db } from "./firebaseConfig.mjs";
import { logError } from "./createRowyApp.mjs";
//import { setupFirestore } from "./setupFirestore.mjs";

async function start() {
  //await setupFirestore();
  try {
    const settings = {
      rowyRunBuildStatus: "BUILDING",
      rowyRunRegion: process.env.GOOGLE_CLOUD_REGION,
    };
    await db.doc("_rowy_/settings").set(settings, { merge: true });
    const publicSettings = {
      signInOptions: ["google"],
    };
    await db.doc("_rowy_/publicSettings").set(publicSettings, { merge: true });
  } catch (error) {
    await logError({
      event: "pre-build",
      error,
    });
    throw new Error(`Rowy deployment failed: ${JSON.stringify(error)}`);
  }
}

start();
