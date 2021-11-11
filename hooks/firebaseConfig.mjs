// Initialize Firebase Admin
import admin from 'firebase-admin';

const credential = admin.credential.applicationDefault();
admin.initializeApp({
  credential
});
const db = admin.firestore();
db.settings({ timestampsInSnapshots: true, ignoreUndefinedProperties: true });
export { db };
