import { Request, Response } from "express";
import { db } from "./firebaseConfig";
import { getProjectId } from "./metadataService";

export default async (req: Request, res: Response) => {
  const projectId = await getProjectId();
  try {
    const settingsDoc = await db.doc(`_rowy_/settings`).get();
    const rowyRunUrl = settingsDoc.get("rowyRunUrl");
    const setupCompleted = settingsDoc.get("setupCompleted");
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
};
