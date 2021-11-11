const client = require("firebase-tools");

import { httpsPost } from "./utils.mjs";
import { getGCPEmail } from "./utils.mjs";
const hostname = "rowy.run";
export const getRowyApp = (projectId) =>
  new Promise((resolve) => {
    const getSDKConfig = (appId) =>
      client.apps.sdkconfig("web", appId, { project: projectId });
    client.apps
      .list("WEB", { project: projectId })
      .then((data) => {
        const filteredConfigs = data.filter(
          (config) => config.displayName === "rowyApp"
        );
        if (filteredConfigs.length === 0) {
          client.apps
            .create("WEB", "rowyApp", { project: projectId })
            .then((newApp) => {
              getSDKConfig(newApp.appId).then((config) => {
                resolve(config.sdkConfig);
              });
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          getSDKConfig(filteredConfigs[0].appId).then((config) => {
            resolve(config.sdkConfig);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

export const registerRowyApp = async (body) =>
  httpsPost({
    hostname,
    path: `/createProject`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

export const logError = async (body) => {
  const ownerEmail = await getGCPEmail();
  return httpsPost({
    hostname,
    path: `/deploymentError`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: { projectId: process.env.GOOGLE_CLOUD_PROJECT, ownerEmail, ...body },
  });
};
