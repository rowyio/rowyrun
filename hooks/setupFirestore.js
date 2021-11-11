import { db } from "./firebaseConfig";
import { firestoreRegions } from "./regions";
import { asyncExecute } from "./terminalUtils";
const regionConverter = (region, serviceRegions) => {
  if (serviceRegions.includes(region)) {
    return region;
  } else {
    return serviceRegions.find((r) => r.split("-")[0] === region.split("-")[0]);
  }
};
const firestoreExists = async() =>{
    try {
        await db.collection("_rowy_").doc("existsTest").set({value:"test"})
        await db.collection("_rowy_").doc("existsTest").delete()
        return true
    } catch (error) {
       return false 
    }
}

export const setupFirestore = () => {
    if(!firestoreExists()){
    const firestoreRegion = regionConverter(process.env.GOOGLE_CLOUD_REGION, firestoreRegions);
    return asyncExecute(`terraform -chdir=../terraform-firestore -var="project_id=${process.env.GOOGLE_CLOUD_PROJECT}" -var="region=${firestoreRegion}"`, (stdout) => {});
    } else {
      console.log("Firestore already exists");
      return false
    }
}
