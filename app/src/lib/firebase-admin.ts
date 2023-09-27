// import admin, { getApps, initializeApp, cert } from "firebase-admin/app"
// import { getStorage } from "firebase-admin/storage"
// import serviceAccount from "../../credentials/firebaseServiceAccount.json"

// if (!getApps().length) {
//   try {
//     initializeApp({
//       // @ts-ignore
//       credential: cert(serviceAccount),
//       storageBucket: "gs://transpact-e8548.appspot.com",
//     })
//   } catch (error: any) {
//     console.log("Firebase admin initialization error", error.stack)
//   }
// }

// const bucket = getStorage().bucket()

// export { bucket }
