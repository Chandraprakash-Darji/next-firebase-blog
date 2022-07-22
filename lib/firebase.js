import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// Config for firebase setUp
const firebaseConfig = {
    apiKey: "AIzaSyD66Has_uG_tIxsCENBM7RR7-SWciW9Nzc",
    authDomain: "nextapplearn.firebaseapp.com",
    projectId: "nextapplearn",
    storageBucket: "nextapplearn.appspot.com",
    messagingSenderId: "165390507590",
    appId: "1:165390507590:web:e9af2ab1b859bc57f07447",
};
// If App is not there then it initialize it
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

// Creating required instance and exporting
export const auth = firebase.auth();
export const goggleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;

export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

/**
 * Function to get the user with the userName
 * @param {string} username
 */
export async function getUserWithuserName(username) {
    const userRef = firestore.collection("users");
    const query = userRef.where("username", "==", username).limit(1);
    const userDoc = (await query.get()).docs[0];
    return userDoc;
}

/**
 * Convert a firestore document to json
 * @param {firestore document SnapShot} doc
 * @returns {object}
 */
export function postToJson(doc) {
    const data = doc.data();
    return {
        ...data,
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    };
}
