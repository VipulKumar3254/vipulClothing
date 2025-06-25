// functions/index.js
const functions = require('firebase-functions');
// const { onCall } = require("firebase-functions/v2/https"); 
const admin = require('firebase-admin');
const { defineSecret, defineString } = require("firebase-functions/params");
const Razorpay = require("razorpay");

admin.initializeApp();

// exports.getTotalUsers = functions.https.onCall(async (data, context) => {
//   try {
//     let totalUsers = 0;
//     let nextPageToken;

//     do {
//       const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
//       totalUsers += listUsersResult.users.length;
//       nextPageToken = listUsersResult.pageToken;
//     } while (nextPageToken);

//     return { totalUsers };
//   } catch (err) {
//     console.error('Error fetching users:', err);
//     throw new functions.https.HttpsError('internal', 'Failed to fetch users');
//   }
// });


// exports.getTotalOrders = functions.https.onCall(async (data, context) => {
//   try {
//     const snapshot = await admin.firestore().collection('orders').get();
//     const totalOrders = snapshot.size;

//     return { totalOrders };
//   } catch (error) {
//     console.error("Error fetching total orders:", error);
//     throw new functions.https.HttpsError("internal", "Unable to fetch total orders");
//   }
// });

// exports.getTotalProducts = functions.https.onCall(async (data, context) => {
//   try {
//     const snapshot = await admin.firestore().collection('products').get();
//     return { totalProducts: snapshot.size };
//   } catch (error) {
//     throw new functions.https.HttpsError("internal", "Could not get product count");
//   }
// });

// const name = defineString("USERNAME")
// exports.userName = functions.https.onCall(async (data, context) => {
//   return name.value();
// });


// 🔑 Razorpay credentials (only one pair)
const razorpayKeyId = defineString("RAZORPAY_KEY_ID");
const razorpayKeySecret = defineSecret("RAZORPAY_KEY_SECRET");

exports.createRazorpayOrderV2 = functions.https.onCall(
  {
    secrets: [razorpayKeySecret],
  },
  async (data) => {
    const { amount } = data;
    console.log("amount is ",amount);
    console.log('data is ',data);

    if (!amount || amount <= 0) {
      throw new Error("bhai amount kuch jyada hi kam hai");
      // throw new functions.https.HttpsError("invalid-argument", "Invalid amount.");
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId.value(),
      key_secret: razorpayKeySecret.value(),
    });

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    try {
      const order = await razorpay.orders.create(options);
      return order; // contains id, amount, currency, etc.
    } catch (error) {
      console.error("❌ Razorpay error:", error);
      throw new functions.https.HttpsError("internal", "Order creation failed");
    }
  }
);

// exports.yesboss = onCall(
//   {
//     secrets: [razorpayKeySecret],
//   },
//   async (data) => {
//     const { amount } = data;
//     console.log("amount is ",amount);
//     console.log('data is ',data);

//     if (!amount || amount <= 0) {
//       throw new Error("bhai amount kuch jyada hi kam hai");
//       // throw new functions.https.HttpsError("invalid-argument", "Invalid amount.");
//     }

//     const razorpay = new Razorpay({
//       key_id: razorpayKeyId.value(),
//       key_secret: razorpayKeySecret.value(),
//     });

//     const options = {
//       amount: amount * 100, // Convert to paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`
//     };

//     try {
//       const order = await razorpay.orders.create(options);
//       return order; // contains id, amount, currency, etc.
//     } catch (error) {
//       console.error("❌ Razorpay error:", error);
//       throw new functions.https.HttpsError("internal", "Order creation failed");
//     }
//   }
// );