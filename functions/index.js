const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const webpush = require("web-push");

admin.initializeApp();

// 1. These are your "Digital Stamps" (I'll show you how to get these keys next)
const publicVapidKey = "BHZPEKD6CKAKNS_I8vutW8LkYO8QULf_pEtVdFfZP3Wzkj5IQDqVfcaXfKHP3aNr_fuIaB1Zkum2khH-88kA--A";
const privateVapidKey = "6tEFqhji4-gDqnvQ1vxMOzo59oiJZTP5aeZ5bnlnPWM";

webpush.setVapidDetails(
  "mailto:hopepain512@gmail.com",
  publicVapidKey,
  privateVapidKey
);

// 2. The Robot starts watching the "transactions" collection
exports.sendTopUpNotification = onDocumentCreated("transactions/{docId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const transaction = snapshot.data();
  
  // Only continue if the transaction type is "topup"
//   if (transaction.type !== "topup") return;
    const dataType = transaction.type === "Top-Up"?"Top-Up":"Usage";
    const usedOrAdd = transaction.type === "Top-Up"?"added":"used";
    const toOrFrom = transaction.type === "Top-Up"?"to":"from";
  const senderId = transaction.useruid;
  const senderName = transaction.name;
  const amount = transaction.topUpAmount;

  // 3. Find everyone's "Address" (Subscriptions) from the database
  const subsSnapshot = await admin.firestore().collection("subscriptions").get();

  const promises = [];

  subsSnapshot.forEach((doc) => {
    const data = doc.data();

    // 4. THE FILTER: If the ID matches the sender, SKIP THEM
    if (data.userId === senderId) {
      return; 
    }

    // 5. Create the message
    const payload = JSON.stringify({
      title: `💰 ${dataType} Alert!`,
      message: `${senderName} just ${usedOrAdd} ${amount}円 ${toOrFrom} the card!`
    });

    // 6. Send it!
    promises.push(
      webpush.sendNotification(data.sub, payload).catch(err => {
        console.error("Error sending to user:", data.userId, err);
        // If the address is old/broken, delete it from database
        if (err.statusCode === 410 || err.statusCode === 404) {
          return doc.ref.delete();
        }
      })
    );
  });

  return Promise.all(promises);
});