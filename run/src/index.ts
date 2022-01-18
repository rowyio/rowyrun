import express from "express";
import cors from "cors";
import rowyRedirect from "./rowyRedirect";
import { getProjectId } from "./metadataService";
import { db } from "./firebaseConfig";
import { asyncExecute } from "./terminalUtils";
import fs from "fs";
import { verifyRowyServiceRequest } from "./middleware/auth";
const app = express();
// json is the default content-type for POST requests
app.use(express.json());

app.use(cors());

app.post("/autoUpdateService", verifyRowyServiceRequest, async (req, res) => {
  try {
    const { name, memory, region } = req.body;
    let _memory: string = memory ?? "1Gi";
    let _additionalDependencies = [];
    const projectId = await getProjectId();
    const rowySettings = (
      await db.collection("_rowy_").doc("settings").get()
    ).data();
    if (!rowySettings) throw new Error("No rowy settings found");
    const _region = region ?? rowySettings.rowyRunRegion;
    const serviceDocPath = db
      .collection("_rowy_")
      .doc("builder")
      .collection("services")
      .doc(name);
    const serviceSettings = (await serviceDocPath.get()).data();
    if (serviceSettings) {
      _additionalDependencies = serviceSettings.additionalDependencies ?? [];
      _memory = serviceSettings.memory ?? _memory;
    } else {
      await serviceDocPath.set({
        memory: _memory,
        name: name,
        region: _region,
        additionalDependencies: [],
      });
    }
    await asyncExecute(`mkdir -p deployImage/${name}`);
    // create dockerFile
    const dockerFile = `
      FROM gcr.io/rowy-run/${name}
      WORKDIR /home/node/app
      COPY --from=gcr.io/rowy-run/${name} /home/node/app/ .
      RUN npm install ${_additionalDependencies.join(" ")} --production
      EXPOSE 8080
      CMD [ "node",  "build/index.js" ]
      `;
    fs.writeFileSync(`deployImage/${name}/Dockerfile`, dockerFile);

    await asyncExecute(
      `cd deployImage/${name} && gcloud config set project ${projectId}`
    );
    await asyncExecute(
      `cd deployImage/${name} && gcloud builds submit --tag gcr.io/${projectId}/${name}`
    );
    await asyncExecute(
      `cd deployImage/${name} && gcloud run deploy ${name} --image gcr.io/${projectId}/${name} --platform managed --memory ${_memory} --region ${_region} --allow-unauthenticated`
    );
    res.sendStatus(200);
  } catch (error) {
    console.log({ error });
    res.sendStatus(500).send({ error });
  }
});
app.get("/", rowyRedirect);
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`rowy-builder: listening on port ${port}!`);
});
// Exports for testing purposes.
module.exports = app;
