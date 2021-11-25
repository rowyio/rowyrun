import express from "express";
import cors from "cors";
import { getProjectId } from "./metadataService";
import {db} from './firebaseConfig'
const app = express();
// json is the default content-type for POST requests
app.use(express.json());

app.use(cors());

app.get("/", async (req, res) => {
  const projectId = await getProjectId();
  try {
    const settingsDoc = await db.doc(`_rowy_/settings`).get();
    const rowyRunUrl = settingsDoc.get("rowyRunUrl");
    const setupCompleted = settingsDoc.get("rowyRunBuildStatus") === "COMPLETE";
    if (setupCompleted) {
      res.redirect(`https://${projectId}.rowy.app`);
    } else {
      res.redirect(
        `https://${projectId}.rowy.app/setup?rowyRunUrl=${rowyRunUrl}`
      );
    }
  } catch (error) {
    res.redirect(`https://${projectId}.rowy.app/setup`);
  }
});