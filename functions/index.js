/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
import * as functions from "firebase-functions";
import cors from "cors";
import { onDocumentCreated } from "firebase-functions/firestore";
import { db } from "../firebaseConfig.js";
const corsHandler = cors({ origin: true });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

export const helloWorld = functions.https.onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});

corsHandler(request, response, () => {
  // Your function logic here
  const data = { message: 'Hello from Firebase Function!' };
  response.status(200).send(data);
});
});




export const addCoverImage = onDocumentCreated("products/{productId}", async (event) => {
  corsHandler(request, response,async  () => {
  const productData = event.data?.data();
  const productId = event.params.productId;

  if (!productData) return;

  const images = productData.images;

  if (Array.isArray(images) && images.length > 0) {
    const coverImage = images[0];

    await db.doc(`products/${productId}`).update({
      coverImage: coverImage,
    });

    console.log(`Cover image set for product ${productId}`);
  } else {
    console.log(`No images array or empty for product ${productId}`);
  }

});
});