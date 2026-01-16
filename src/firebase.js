// Import the functions 
import { initializeApp } from "firebase/app";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    setDoc,
    getDoc,
    getDocs, 
    doc, 
    updateDoc, 
    onSnapshot,
    deleteDoc, 
    deleteField
} from "firebase/firestore";
import { 
    getAuth,
    onAuthStateChanged, 
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';

// --- Firebase configuration Start --- 

//testing one

const firebaseConfig = {
    apiKey: "AIzaSyDRj1eucro5jEbBJgfu2O7YWkFpULSUrZg",
    authDomain: "saloon-expenses-93775.firebaseapp.com",
    projectId: "saloon-expenses-93775",
    storageBucket: "saloon-expenses-93775.firebasestorage.app",
    messagingSenderId: "170109564429",
    appId: "1:170109564429:web:99dfde416f55575676c744",
    measurementId: "G-9RX9KBHQZX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- Firebase configuration Ends --- 

// --- Firebase CRUD Start --- 
//get real-time datas
function getRealTimeDatas(collectionName, callback, useruid = ""){
    const collectionRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(collectionRef, (snapshot)=>{
        callback(snapshot, useruid);
    });
    // console.log("datas getRealTimeDatas- ", datas);
}

//Add a new data (no need userId, it will automatically created)
async function addDataWithoutDocumentID(collectionName, datas) {
    console.log("Attempting to add new data...(addData firebase)");
    const collectionRef = collection(db, collectionName);
    try{
        const addRef = await addDoc(collectionRef, datas);
        // console.log("checking the addref(addData firebase) - ", addRef);
        console.log("✅ Document written with ID(addData firebase): ", addRef.id);
        return addRef.id;
    } catch (e) {
        console.error("❌ Error adding document(addData firebase): ", e);
    }
}

//set data need userId
async function addDataWithDocumentID(collection,docId, datas) {
    console.log("Attempting to set new data...(setData firebase)");
    const docRef = doc(db, collection, docId);
    try {
        const setRef = await setDoc(docRef, datas)
        console.log("checking the setRef(setData firebase) - ", setRef);
    } catch(e) {
        console.error("❌ Error setting document(setData firebase): ", e);
    }
}
//Update Data based on the collection ID
async function updateDataWithDocumentID(collectionName, documentID, datas) {
    const updateDocRed = doc(db,collectionName,documentID);
    try{
        await updateDoc(updateDocRed, datas);
        console.log("Document successfully updated!(updateData firebase)");
    }catch(e) {
        console.error("Error updating document: (updateData firebase)", e);
    }
}
// +++ read(get all document) +++
async function getAllDatas(collectionName) {
    // console.log("Attempting to read all users...(getDatas firebase)");
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const datas = [];
        querySnapshot.forEach((doc)=> {
            datas.push({id: doc.id, ...doc.data()});
        });
        // console.log("✅ Successfully read users. Count(getDatas firebase):", datas.length);
        // console.log("datas array(getDatas firebase) - ", datas);
        return datas;
    } catch (e) {
        console.error("❌ Error reading documents(getAllDatas firebase): ", e);
    }
}
// +++ read(get the date of one document) +++
async function getDataOnDocumentID(collectionName, documentID) {
    const DocRef = doc(db, collectionName, documentID);
    try {
        const dataDoc = await getDoc(DocRef);
        if(dataDoc.exists()){
        // console.log(" data array (getData firebase) - ", dataDoc.data());
            return dataDoc.data();
        }
    } catch (e) {
        console.error("Error getting users(getDataOnDocumentID firebase): ", e);
    }
}

// async function deleteTransaction(transId, useruid, callback){
//   if(!db || !useruid){
//     console.error('Authentication required to delete data.(deleteTransaction)');
//     return;
//   }
//   const transRef = doc(db, "transactions", transId)
//   try {
//     const transPromise = await getData('transactions', transId);
//     const balancePromise = await getData('balance', 'cardAmount');
//     const userPromise = await getData("users", useruid);
//     const usedAmount = transPromise.usedAmount;
//     const userBalance = userPromise.balance;
//     const cardTotal = balancePromise.amount + usedAmount;
//     const userBalanceTotal = userBalance + usedAmount;
//     await updateData("balance", "cardAmount",{
//       amount:cardTotal
//     });
//     if(userPromise.owe < 0) {
//       let userOwe = userPromise.owe;
//       let userOweCheck = userOwe>usedAmount?userOwe-usedAmount:usedAmount-userOwe;
//       if(userOweCheck > 0){
//         const payBack = userOweCheck + userBalance;
//         await updateData("users", useruid, {
//           balance:payBack,
//           owe:0,
//           oweTo:{}
//         });
//       } else if(userOwe == 0) {
//         await updateData("users", useruid, {
//           owe:0,
//           oweTo:{}
//         });
//       }else{
//         await updateData("users", useruid, {
//           owe:userOweCheck,
//         });
//       }
//     }else{
//       await updateData("users", useruid, {
//           balance:userBalanceTotal
//         });
//     }
//     await deleteDoc(transRef);
//     // console.log("attempting to get transactions(deleteTransaction firebase)- ", transPromise);
//     // console.log("attempting to get Balance(deleteTransaction firebase)- ", balancePromise);
//     // console.log(`✅ Success: Transaction document '${transId}' has been deleted(deleteTransaction firebase).`);
//     callback("ဖျက်ပြီးပါပြီ။", 'success');
//   }catch(e) {
//     console.error(`❌ Error deleting transaction '${transId}'(deleteTransaction firebase):`, e);
      
//       // Example of simple error handling in the console:
//       if (error.code === 'not-found') {
//           console.error("The document does not exist.(deleteTransaction firebase)");
//       }
//   }
// }

// --- Firebase CRUD Ends --- 

// --- Auth Management Start --- 

// VVVVVV variable section VVVVVV
// let transSubmit = ()=>{};

// !!!!!!!!!!!!!!!!!!!!!!!!!!!
// +++ Auth Changing Check +++
onAuthStateChanged(auth, (user)=>{
    if(user) {
    // console.log("got sign in from onAuthStateChanged");
        hiddenEmptyState();
        //Auth Management
        manageCurrentUserThings(user.uid);
        //to set up/ store transaction usage
        setupTransactionForm(newTransaction, user.uid);
        //to set up/ store top-up 
        setupTopUpForm(newTopUp, user.uid);
        // getTransactions(user.uid);
        getRealTimeDatas("transactions", getTransactions, user.uid);
        // getCardBalance();
        getRealTimeDatas("card", getCardBalance);
        //getUserDatas()
        getRealTimeDatas("users", getUserDatas, user.uid);
    }else{
        handleSignOut();
        getTTButton(disableTTButton);
        clearHTML();
        // console.log("got sign out from onAuthStateChanged");
    }
})
// !!!!!!!!!!!!!!!!!!!!!!!!!!!

async function manageCurrentUserThings(useruid) {
    try{
        const dataObj = await getDataOnDocumentID("users", useruid);
        // const username = dataObj.name;
        // console.log("username from (manageCurrentUserThings firebase) - ",dataObj);
        handleSignIn(dataObj.name, dataObj.userAvatar);//handleSignIn is from uiUtils.js (user)
        const userdatas = [useruid, dataObj.name];
        // setLocalStorage (uiUtils.js)saving array into String
        setLocalStorage("userdatas", JSON.stringify(userdatas));
        return dataObj;
    }catch(e){
        console.error("error on getting current users(manageCurrentUserThings firebase): ",e);
    }
}

// --- Auth Management Ends --- 

// --- ...Start --- 

// +++ getting username on uid
// async function getUsernameOnUID(useruid){
//     try{
//         const dataPromise = await getDataOnDocumentID("users", useruid);
//         // const username = dataPromise.name;
//         // console.log("username from (getUsernameOnUID firebase) - ",username);
//         return dataPromise;
//     }catch(e){
//         console.error("error on getting username(getUsernameOnUID firebase): ",e);
//     }
// }

// +++ sumit the Login form +++ 
function signInWithAcc(email, password){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showToast("Logined Successful!");
    })
    .catch((error) => {
        loginErrorMsg.style.display = 'block';
        console.error("Error:", error);
    });
}
loginForm(signInWithAcc);//submitForm is from uiUtils.js

// +++ logout button  +++
async function userLogout() {
    try {
      await signOut(auth);
      handleSignOut();//from uiUtils.js
    } catch (e){
        console.error("Error signing out(userLogout firebase):", e);
    }
}

// +++ card balance +++
function getCardBalance(snapshot) {
    let cardbalance = 0;
    snapshot.forEach((doc)=>{
        cardbalance = doc.data().balance;
    });
    setUpCardbalance(cardbalance)
        // setUpCardbalance(card.balance);
}

// SSSS transaction section SSSS Starts
function getTransactions(snapshot, useruid){
    let dataList = []
    snapshot.forEach(doc=>{
        dataList.push({id:doc.id, ...doc.data()});
    });
    dataList.sort((a,b)=>b.id-a.id);
    // console.log("dataList getTransactions - ", dataList);
    renderTransactionList(dataList, useruid);
}

// // +++ New Transaction +++
async function newTransaction(usedAmount, datetime, useruid){
    if(usedAmount<= 0){
        return;
    }
    let userbalance, cardbalance, oldCardBalance, lastestid = 0;
    let username, userDebtStatus = "";
    let userDebtToObj = {};
    let userAvatar = "";
    // getting the usedAmout before calculation
    const usedAmountBeforeCalc = usedAmount;
    // console.log("userdatas(newTransaction firebase)",userdatas);
    try{
        // *** user part
        const user = await getDataOnDocumentID("users", useruid);
        userbalance = user.balance;
        username = user.name;
        userDebtStatus = user.debtStatus;
        userDebtToObj = user.debtTo;
        userAvatar = user.userAvatar;
        // console.log("data (newTransaction firebase)-",user);
        // *** card balance part
        const card = await getDataOnDocumentID("card", "cardID");
        // console.log("card (newTransaction firebase)-",card);
        oldCardBalance = card.balance;
        // console.log("oldCardBalance(newTransaction firebase)-",oldCardBalance);
        cardbalance = card.balance;
        // console.log("cardbalance(newTransaction firebase)-",cardbalance);
        // *** Transactions
        const transactions = await getAllDatas("transactions");
        let sortedTrans = transactions.sort((a,b)=>b.id - a.id);
        // console.log("sortedTrans (newTransaction firebase)-",sortedTrans);
        lastestid = sortedTrans[0]?sortedTrans[0].id:0;
        // console.log("lastestid(true falase) (newTransaction firebase)-",lastestid);
    }catch(e){
        console.error("error (if newTransaction firebase)-",e);
    }
    // console.log("debtStatus - ",userDebtStatus);
    // console.log("userDebtToObj - ",userDebtToObj);
    // console.log("userbalance (newTransaction firebase)-",userbalance);
    // this checking user can use his own balance
    // i am just checking the extra because userbalnce have to be 
    // less than or equal to card balance
    let userArray;
    try{
        const users = await getAllDatas("users");
        // console.log("users (newTransaction firebase)- ", users);
        userArray = users.map(user => [user.id, user.name, user.balance, user.debtTo, user.debtStatus,user.oweMe, user.oweStatus, user.userAvatar]);
        
        userArray.sort((a, b) => b[2] - a[2]);
        // console.log("first sorting according to the balance array(newTransaction firebase)-",userArray);
    }catch(e) {
        console.error("error (else newTransaction firebase)- ",e);
    }
    // console.log("cardbalance(newTransaction firebase)-",cardbalance);
    // console.log("usedAmount(newTransaction firebase)-",usedAmount);
    // !!! cardbalance >= usedAmount if Starts
    if(cardbalance >= usedAmount){

        // !!! userbalance >= usedAmount if Starts
        if(userbalance >= usedAmount) {
            let usedAmountBeforeCalc = usedAmount;
            cardbalance -= usedAmount;//this line have to be before calculation
            usedAmount -= userbalance;
            // console.log("userbalance left-", usedAmount*-1);
            updateDataWithDocumentID("card", "cardID", {
                balance: cardbalance
            });
            updateDataWithDocumentID("users", useruid, {
                balance: usedAmount*-1
            });
            addDataWithoutDocumentID("transactions", {
                id: lastestid + 1,
                useruid: useruid,
                name: username,
                type: "use",
                oldCardBalance: oldCardBalance,
                newCardBalance: cardbalance,
                datetime: datetime,
                usedAmount: usedAmountBeforeCalc,
            });

        }else{// !!! userbalance >= usedAmount else Starts

            if(userbalance > 0) {
      
                cardbalance -= userbalance;
                usedAmount -= userbalance;
                userbalance = 0;
                // ****************** dont forget to update this information too lately
                userArray.map((ele, index, arr)=>{
                    if(arr[index][0] == useruid){
                        arr[index][2] = 0;
                    }
                });
                userArray.sort((a,b)=> b[2]-a[2]);
                // console.log("2nd sorting according to the balance array(newTransaction firebase)-", userArray);

            }

            const userDebtToArray = Object.entries(userDebtToObj);
            if(userDebtStatus == "yes" && userDebtToArray.length > 0) {
                const priorityIDs = userDebtToArray.map(item => item[0]);
                
                // Users we owe money to (exclude self)
                const main = userArray.filter(user => priorityIDs.includes(user[0]) && user[0] !== useruid);
                // Users we don't owe money to (exclude self)
                const others = userArray.filter(user => !priorityIDs.includes(user[0]) && user[0] !== useruid);
                
                // Rebuild array: Priority -> Others
                userArray = [...main, ...others];
            } else {
                // If no priority, just ensure we don't borrow from ourselves
                userArray = userArray.filter(user => user[0] !== useruid);
            }

            // console.log("used amount before starting  - ", usedAmount);
            // console.log("card balance 1st time before starting  - ", cardbalance);
            let i = 0;
            let usersLeftMoney = [];
            let debt = 0;
            let amountBeforeCalc = 0;
            let debtToArr = [...userDebtToArray];
            // let owe = 0;
            let oweMeArr = []
            let currentTransactionDebtArr = [];
            // !!! 1st while start
            while(usedAmount > 0 && i < userArray.length) {
        
                let leftMoney = 0;
                let borrowMoney = 0;
                // prepare the datas
                const lenderId = userArray[i][0];
                const lenderName = userArray[i][1];
                const lenderAvatar= userArray[i][7]
                amountBeforeCalc= usedAmount;//this have to be before calculation
                usedAmount -= userArray[i][2];//userArray[i][2](balance)
        
                // console.log("usedAmount(newTransaction firebase)-",usedAmount);
                borrowMoney = usedAmount > 0?amountBeforeCalc - usedAmount:amountBeforeCalc;
                leftMoney = usedAmount > 0?0:usedAmount*-1;
                debt+= borrowMoney;
                
                // console.log("userArray ", userArray);
                // console.log("lenderAvatar ", lenderAvatar);
                //if there is check plus it, or create it
                const existingDebtIndex = debtToArr.findIndex(item => item[0] === userArray[i][0]);
                // console.log("existingDebtIndex - ", existingDebtIndex)
                if (existingDebtIndex !== -1) {
                    // Update existing debt
                    debtToArr[existingDebtIndex][1].debt += borrowMoney;
                } else {
                    // Add new debt
                    debtToArr.push([
                        lenderId, 
                        {
                            id: lenderId, 
                            name: lenderName, 
                            debt: borrowMoney,
                            userAvatar: lenderAvatar, 
                            clickedPayBack: "no",
                        }
                    ]);
                }

                currentTransactionDebtArr.push([
                    lenderId, 
                    {
                        id: lenderId, 
                        name: lenderName, 
                        debt: borrowMoney, // Only the amount borrowed right now
                        userAvatar: lenderAvatar, 
                    }
                ]);
                
                oweMeArr.push([lenderId,{lendId:lenderId, lendname:lenderName, 
                    leftMoney:leftMoney, borrowId:useruid, borrowName:username, borrowMoney:borrowMoney
                }]);
                usersLeftMoney.push([lenderId, lenderName, leftMoney])
                i++;
        
                // updateDataWithDocumentID()
                
            }// !!! 1st while end
            cardbalance -= debt;
            console.log("card balance end time before starting  - ", cardbalance);
            console.log("oweMeArr (else newTransaction firebase)-",oweMeArr);
            // console.log("userArray (else newTransaction firebase)-",userArray);
            // console.log("debtTo (else newTransaction firebase)-",debtToArr);
            // console.log("userLeftMoney (else newTransaction firebase)-",usersLeftMoney)
            // ... inside your main function ...

            for (let i = 0; i < oweMeArr.length; i++) {

                const lendId = oweMeArr[i][1].lendId; // Who is lending the money
                // const lenderAvatar = oweMeArr[i][1].debtorAvatar; // Who is lending the money
                const borrowId = oweMeArr[i][1].borrowId; // Who is borrowing
                const borrowName = oweMeArr[i][1].borrowName;
                const borrowMoney = oweMeArr[i][1].borrowMoney;

                let specialUserOweMeObj = {};

                // 1. Find the Lender's current "Owe Me" data from the main array
                for (let j = 0; j < userArray.length; j++) {
                    const speciUserId = userArray[j][0];
                    if (lendId == speciUserId) {
                        // Use empty object {} if undefined
                        specialUserOweMeObj = userArray[j][5] || {}; 
                    }
                }

                // console.log("Processing Lender:", lendId);
                // console.log("Borrower:", borrowName, "Amount:", borrowMoney);

                // 2. Convert to Array to search/update
                let speciOweMeArr = Object.entries(specialUserOweMeObj);

                // 3. CHECK: Does this Borrower already owe money to this Lender?
                // We search for 'borrowId', NOT 'lendId'
                const existingOweIndex = speciOweMeArr.findIndex(item => item[0] === borrowId);

                if (existingOweIndex !== -1) {
                    // --- CASE A: ALREADY EXISTS (UPDATE) ---
                    // console.log("Found existing debt. Updating...");
                    
                    // Add the new money to the existing 'owe' amount
                    speciOweMeArr[existingOweIndex][1].owe += borrowMoney;
                    
                } else {
                    // --- CASE B: NEW DEBT (CREATE) ---
                    console.log("New debt relationship. Creating...");
                    // console.log("userAvatar (oweMe) ", userAvatar);
                    
                    speciOweMeArr.push([
                        borrowId, 
                        {
                            id: borrowId,
                            name: borrowName,
                            owe: borrowMoney,
                            userAvatar:userAvatar,
                            gotMoneyBack:"no"
                        }
                    ]);
                }

                // 4. Convert back to Object
                const newSpecialUserOweMeObj = Object.fromEntries(speciOweMeArr);
                // console.log("Final OweMe Object for this lender:", newSpecialUserOweMeObj);

                // 5. SAVE TO DATABASE (Uncommented and fixed)
                for (let k = 0; k < usersLeftMoney.length; k++) {
                    const leftMoneyId = usersLeftMoney[k][0];
                    
                    // We find the Lender in the 'usersLeftMoney' list to get their correct remaining balance
                    if (lendId == leftMoneyId) {
                        const usersLM = usersLeftMoney[k][2]; // [2] is the left balance
                        
                        console.log(`Saving to DB for ${lendId}...`);
                        
                        updateDataWithDocumentID("users", lendId, {
                            oweMe: newSpecialUserOweMeObj,
                            oweStatus: "yes",
                            balance: usersLM,
                        });
                    }
                }
            }
            //changing into obj same intention as oweMe
            const totalDebtToObj = Object.fromEntries(debtToArr);
            const currentTransDebtObj = Object.fromEntries(currentTransactionDebtArr);
            // // console.log("debtToObj - ",debtToObj);
            updateDataWithDocumentID("users", useruid, {
                debtTo: totalDebtToObj,
                debtStatus: "yes",
                balance: userbalance, // Should be 0
                redeem:"no"
            });

            updateDataWithDocumentID("card", "cardID", {
                balance: cardbalance
            });
            
            addDataWithoutDocumentID("transactions", {
                id: lastestid + 1,
                useruid: useruid,
                name: username,
                type: "use",
                oldCardBalance: oldCardBalance,
                newCardBalance: cardbalance,
                datetime: datetime,
                usedAmount: usedAmountBeforeCalc,
                debtTo: currentTransDebtObj
            });

        }// !!! userbalance >= usedAmount if end
    
        showToast("added new transaction successfully");
    }else{// !!! cardbalance >= usedAmount else Starts
        // console.log("card balance not suffiently is running...");
        showToast("You don't have enough balance left. Please top-up first", "fail");
    }

}


// SSSS transaction section SSSS End

// SSSS user section SSSS Starts

// +++ check user debt or owe
async function checkUserDebtOwe(useruid, type) {
    // 1. Create reference
    const docRef = doc(db, "users", useruid);

    // 2. Fetch the document (This returns the 'doc' snapshot)
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // --- YOUR CODE STARTS HERE ---
        const user = docSnap.data(); // docSnap is your 'doc'
        
        let hasData = true;
        if(type === "debtTo") {
            hasData = Object.keys(user.debtTo || {}).length > 0; 
        }else{
            hasData = Object.keys(user.oweMe || {}).length > 0;
        }
        
        if (hasData) { 
            console.log("There is data left!"); 
            return "yes";
        } else { 
            console.log("The map is empty."); 
            return "no";
        }
        // --- YOUR CODE ENDS HERE ---
    } else {
        console.log("No such user!");
    }
}

// +++ User section 

function getUserDatas(snapshot, useruid){
    let dataList = []
    snapshot.forEach(doc=>{
        dataList.push({id:doc.id, ...doc.data()});
    });
    const selfDatas = dataList.filter(user=>user.id === useruid);
    renderSelfList(selfDatas, useruid);
    // console.log("selfDatas getUserDatas - ", selfDatas);
    const otherMembersDatas = dataList.filter(user=>user.id !== useruid);
    // console.log("otherMembersDatas getUserDatas - ", otherMembersDatas);

    renderOtherUsersList(otherMembersDatas);
}

// +++ payBack actiomn +++
function handlePayBack(useruid, creditorId){
    // +++ set the confirm action
showConfirm("Are you Sure You will pay debt?", ()=>{
    payBackProcess(useruid, creditorId);
});
}//async function handlePayBack(useruid, creditorId) ends
async function payBackProcess(useruid, creditorId) {
    try{
        const creditorData = await getDataOnDocumentID("users", creditorId);
        const currentUserData = await getDataOnDocumentID("users", useruid);
        // console.log("creditorId ",creditorId);
        // console.log("currentUserData ",currentUserData.debtTo[creditorId]);
        creditorData.oweMe[useruid].gotMoneyBack = "checkState";
        currentUserData.debtTo[creditorId].clickedPayBack = "yes";
        // console.log("creditorData 2",creditorData);
        // console.log("creditorData.oweMe",creditorData.oweMe);
        updateDataWithDocumentID("users", creditorId, {
            oweMe:creditorData.oweMe
        });
        updateDataWithDocumentID("users", useruid, {
            debtTo:currentUserData.debtTo
        });
    }catch(e){
        console.error("Cant handle to pay back", e);
    }
}
// +++ accept payBack actiomn +++
function handleAccept(useruid, debtorId){
    // +++ set the confirm action
showConfirm("Are you Sure You accepted the debt?", ()=>{

    acceptPayBackProcess(useruid, debtorId);
});
}//async function handlePayBack(useruid, debtorId) ends
async function acceptPayBackProcess(useruid, debtorId) { 

    // console.log("oweStatus ", oweStatus);
    
    
    updateDataWithDocumentID("users", debtorId, {
        [`debtTo.${useruid}`]:deleteField()
    });
    updateDataWithDocumentID("users", useruid, {
        [`oweMe.${debtorId}`]:deleteField()
    });
    const debtStatus = await checkUserDebtOwe("2AL26KWg4yTg4AJpAwIlNIhFMH73", "debtTo");
    const oweStatus = await checkUserDebtOwe("6kip3HNA1nhu0FoxtbQ3qv5VbCs1", "oweMe");
    updateDataWithDocumentID("users", debtorId, {
        debtStatus:debtStatus
    });
    updateDataWithDocumentID("users", useruid, {
        oweStatus:oweStatus
    });
}


// SSSS user section SSSS End

// SSSS notification section SSSS Starts

export async function saveSubscriptionToDb(subscription, useruid) {
    try {
        await addDoc(collection(db, "subscriptions"), {
            userId: useruid,
            sub: JSON.parse(JSON.stringify(subscription)), // This is the phone's address
            createdAt: new Date()
        });
    } catch (e) {
        console.error("Error saving sub: ", e);
    }
}

// SSSS notification section SSSS Ends


// +++ top up handling +++
async function newTopUp(topUpAmount, datetime, useruid) {
    let userbalance, cardbalance, oldCardBalance, lastestid = 0;
    let username = "";
    // console.log("userdatas(newTransaction firebase)",userdatas);
    try{
        // *** user part
        const user = await getDataOnDocumentID("users", useruid);
        userbalance = user.balance;
        username = user.name;
        // console.log("data (newTransaction firebase)-",user);
        // *** card balance part
        const card = await getDataOnDocumentID("card", "cardID");
        // console.log("card (newTransaction firebase)-",card);
        oldCardBalance = card.balance;
        // console.log("oldCardBalance(newTransaction firebase)-",oldCardBalance);
        cardbalance = card.balance;
        // console.log("cardbalance(newTransaction firebase)-",cardbalance);
        // *** Transactions
        const transactions = await getAllDatas("transactions");
        let sortedTrans = transactions.sort((a,b)=>b.id - a.id);
        // console.log("sortedTrans (newTransaction firebase)-",sortedTrans);
        lastestid = sortedTrans[0]?sortedTrans[0].id:0;
        // console.log("lastestid(true falase) (newTransaction firebase)-",lastestid);
        showToast("topped up successfully");
    }catch(e){
        console.error("error (if newTransaction firebase)-",e);
    }
    
    cardbalance += topUpAmount;
    userbalance += topUpAmount;
    updateDataWithDocumentID("card", "cardID", {
        balance:cardbalance
    });
    updateDataWithDocumentID("users", useruid, {
        balance:userbalance
    });
    addDataWithoutDocumentID("transactions", {
        id:lastestid+1,
        useruid:useruid,
        name:username,
        oldCardBalance:oldCardBalance,
        newCardBalance:cardbalance,
        datetime:datetime,
        topUpAmount:topUpAmount,
        type:"topup",
    });
}

//  --- ... End ---

// test area

window.userLogout = userLogout;
window.handlePayBack = handlePayBack;
window.handleAccept = handleAccept;