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
//real one

const firebaseConfig = {
  apiKey: "AIzaSyAMfZIUshs9swwQbfgArcbUCoGp-2dagFU",
  authDomain: "saloonexpensesbyhmt.firebaseapp.com",
  projectId: "saloonexpensesbyhmt",
  storageBucket: "saloonexpensesbyhmt.firebasestorage.app",
  messagingSenderId: "1071786708712",
  appId: "1:1071786708712:web:6c6aa0d8e1d1ca9112035d",
  measurementId: "G-CSKCFYFNV4"
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
    const usedAmountBeforeCalc = usedAmount;
    let userbalance, cardbalance, oldCardBalance, lastestid = 0;
    let username,userAvatar = "";
    let users, userDebtTo = {};
    // getting the usedAmout before calculation
    // console.log("userdatas(newTransaction firebase)",userdatas);
    try{
        // *** card balance part
        const card = await getDataOnDocumentID("card", "cardID");
        // console.log("card (newTransaction firebase)-",card);
        oldCardBalance = card.balance;
        // console.log("oldCardBalance(newTransaction firebase)-",oldCardBalance);
        cardbalance = card.balance;
        // console.log("cardbalance(newTransaction firebase)-",cardbalance);
        //checking not to use the amount if usedamout is bigger than the cardbalance
        if(cardbalance < usedAmount) {
            showToast("You don't have enough balance left. Please top-up first", "fail");
            return;
        }
        // *** user part
        const user = await getDataOnDocumentID("users", useruid);
        userbalance = user.balance;
        username = user.name;
        userDebtTo = user.debtTo;
        userAvatar = user.userAvatar;
        // console.log("data (newTransaction firebase)-",user);
        // *** Transactions
        const transactions = await getAllDatas("transactions");
        console.log("transactions (transactions firebase)-",transactions);
        let sortedTrans = transactions.sort((a,b)=>b.id - a.id);
        // console.log("sortedTrans (sortedTrans firebase)-",sortedTrans);
        lastestid = sortedTrans[0] && !isNaN(sortedTrans[0].id)?sortedTrans[0].id:0;
        // console.log("lastestid(true falase) (newTransaction firebase)-",lastestid);
        users = await getAllDatas("users");
        // console.log("users (newTransaction firebase)- ", users);
        //getting the highest balance sorting
        users.sort((a, b) => b.balance - a.balance);
    }catch(e){
        console.error("Transaction Flow Error(firebase):", e.message);
    }

    if(userbalance >= usedAmount) {
        cardbalance -= usedAmount;//this line have to be before calculation
        usedAmount -= userbalance;
        // console.log("userbalance left-", usedAmount*-1);
        updateDataWithDocumentID("users", useruid, {
            balance: usedAmount*-1
        });
    }else{// !!! userbalance >= usedAmount else Starts
        // this if statment will use userbalance first
        if(userbalance > 0){
            cardbalance -= userbalance;
            usedAmount -= userbalance;
            userbalance = 0;
            users.map(v=>v.id == useruid?{...v,balance:0}:v);
        }
        // const main = users.filter(user=>user.id == useruid);
        const others = users.filter(user=>user.id != useruid && user.balance > usedAmount);
        
        if(Object.keys(userDebtTo).length>0){
            others.sort((lenderA, lenderB)=>{
                const oweA = lenderA.oweMe?.[useruid]?.owe || 0;
                const oweB = lenderB.oweMe?.[useruid]?.owe || 0;
                return oweB-oweA;
            });
        }else{
            others.sort((lenderA,lenderB)=>lenderB.balance-lenderA.balance);
        }
        let totalUsedAmount = 0;
        for (let i = 0; i < others.length; i++) {
            if(usedAmount > 0 ){
                const other = others[i];
                const lenderId = other.id;
                const lenderName = other.name;
                const lenderAvater = other.userAvatar;
                const amountBeforeCalc = usedAmount;
                usedAmount -= other.balance;
                //calculating how much the user borrow and how other user balance left
                let borrowAmount = usedAmount > 0 ? amountBeforeCalc - usedAmount:amountBeforeCalc;
                // console.log("borrowAmount - ",borrowAmount);
                let otherUserLeftAmount = usedAmount > 0?0:usedAmount*-1;
                totalUsedAmount += borrowAmount;
                if(userDebtTo[lenderId]?.id) {
                    userDebtTo[lenderId].debt += borrowAmount;
                }else{
                    userDebtTo[lenderId] = {
                        id: lenderId, 
                        name: lenderName, 
                        debt: borrowAmount,
                        userAvatar: lenderAvater, 
                        clickedPayBack: "no",
                    };
                }
                // console.log("userDebtTo (firebase)-",userDebtTo);
                // ?????? there i have to do currentTransactionDebtArr ????
                if(other.oweMe[useruid]?.id){
                    other.oweMe[useruid].owe += borrowAmount;
                }else{
                    if(!other.oweMe)other.oweMe = {};
                    other.oweMe[useruid] = {
                        gotMoneyBack:"no",
                        id:useruid,
                        name:username,
                        owe:borrowAmount,
                        userAvatar:userAvatar
                    }
                }
                // console.log("other.oweMe (firebase)-",other.oweMe);
                updateDataWithDocumentID("users", lenderId, {
                    oweMe: other.oweMe,
                    balance: otherUserLeftAmount
                });
            } //if(usedAmount > 0) ends 
        }//for (let i = 0; i < users.length; i++) { ends 
        // console.log("cardbalance 1 - ",cardbalance);
        cardbalance -= totalUsedAmount;
        // console.log("cardbalance 2 - ",cardbalance);

        
        
    }// !!! userbalance >= usedAmount else end
    updateDataWithDocumentID("users", useruid, {
        debtTo: userDebtTo,
        balance:userbalance
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
    });


}// newTransaction() ends


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