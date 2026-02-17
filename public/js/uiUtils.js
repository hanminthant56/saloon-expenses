// --- General / Global Functions Starts --- 

// +++ Toast Alert +++ 
    let toastTimer; 
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toastAlert');
        const msgEl = document.getElementById('toastMessage');
        
        // Clear any existing timer
        clearTimeout(toastTimer);

        // Set message and color
        msgEl.textContent = message;
        toast.classList.remove('bg-green-600', 'bg-red-600'); // Clear old colors
        
        if (type === 'success') {
            toast.classList.add('bg-green-600');
        } else {
            toast.classList.add('bg-red-600');
        }

        // Show the toast
        toast.classList.add('active');

        // Set timer to hide
        toastTimer = setTimeout(() => {
            toast.classList.remove('active');
        }, 2500); 
    }

// +++ Confirmation Modal +++ 
    let confirmAction = () => {}; 
    function showConfirm(message, callback) {
        const msgEl = document.getElementById('confirmMessage');
        msgEl.textContent = message;
        
        confirmAction = callback; // Store the action
        
        openModal('confirmationModal'); // Use your existing modal-opening function
    }
    //@@@@@ can delete later if it is not being used @@@@@
    // Function called by the "Confirm" button
    function handleConfirm() {
        confirmAction(); // Run the stored action
        closeModal('confirmationModal');
    }
    // Function called by the "Cancel" button
    function handleCancel() {
        closeModal('confirmationModal');
    }

// +++ Tab Functionality +++ 
    function showTab(target) {
        // Hide all tab content
        //hover:text-gray-700 hover:border-gray-300
        document.querySelectorAll('#tab-content > div').forEach(content => {
            content.classList.add('hidden');
        });

        // Deactivate all tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
            button.setAttribute('aria-selected', 'false');
            button.classList.add("hover:text-gray-700", "hover:border-gray-300");
        });

        // Show the selected tab content
        document.getElementById(target).classList.remove('hidden');
        // Activate the corresponding tab button
        const activeTabButton = document.querySelector(`[data-tab-target="#${target}"]`);
        if(activeTabButton) {
            activeTabButton.classList.add('active');
            activeTabButton.classList.remove("hover:text-gray-700", "hover:border-gray-300");
            activeTabButton.setAttribute('aria-selected', 'true');
        }
    }

// +++  Function to show a modal +++ 
    function openModal(target) {
        if(target == "mainFormModal") document.getElementById('loginErrorMsg').style.display = 'none';
        const modal = document.getElementById(target);
        if (modal) {
            modal.classList.remove('hidden'); 
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        }
    }

// +++ Function to close a modal (kept the same) +++ 
    function closeModal(target) {
        const modal = document.getElementById(target);
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
    }

//Local Storage SET/GET/CHECK useruid Process
    function getLocalStorage(itemName) {
        const deviceId = localStorage.getItem(itemName);
        // console.log("deviceID (getLocalStorage app)- ", deviceId);
        return deviceId;
    }

    function setLocalStorage(itemName,useruid) {
        // const deviceId = crypto.randomUUID();
        localStorage.setItem(itemName, useruid);
        // console.log("New unique ID generated(setLocalStorage app): ", useruid);
    }

    function checkLocalStorage(itemName){
        const deviceId = localStorage.getItem(itemName);
        return deviceId ? true : false;
    }

    function removeLocalStorage(itemName){
        localStorage.removeItem(itemName);
    }

    //for language changes 
    


// --- General / Global Functions ENDS ---  

// --- ...Start --- 

// +++ New transaction/top-up button enable/disable on AuthChange
    // TT means transaction and top-up
    // - - - get New transaction/top-up button first
    function getTTButton(callback){
        const transSubmit = document.getElementById("trans-submit");
        const topupSubmit = document.getElementById("topup-submit");
        // console.log("trans button (getTTButton uiUtils)-",transSubmit);
        // console.log("topup button (getTTButton uiUtils)-",topupSubmit);
        callback(transSubmit, topupSubmit);
    }
    // - - - enable button
    function enableTTButton(transSubmit, topupSubmit){
        // console.log("enableTTButton is running...");
        transSubmit.classList.remove("bg-gray-200", "cursor-not-allowed");
        topupSubmit.classList.remove("bg-gray-200", "cursor-not-allowed");
        transSubmit.classList.add("bg-blue-600", "hover:bg-blue-700");
        topupSubmit.classList.add("bg-blue-600", "hover:bg-blue-700");
        transSubmit.removeAttribute("disabled");
        topupSubmit.removeAttribute("disabled");
        
    }
    // - - - disable button
    function disableTTButton(transSubmit, topupSubmit){
        // console.log("disableTTButton is running...");
        transSubmit.classList.remove("bg-blue-600", "hover:bg-blue-700");
        topupSubmit.classList.remove("bg-blue-600", "hover:bg-blue-700");
        transSubmit.classList.add("bg-gray-200", "cursor-not-allowed");
        topupSubmit.classList.add("bg-gray-200", "cursor-not-allowed");
        transSubmit.setAttribute("disabled", "");
        topupSubmit.setAttribute("disabled", "");
    }

// +++ submit login form +++
function loginForm(callback) {
    //sumit the form
    const loginForm = document.getElementById('loginForm');
    if(loginForm){

        loginForm.addEventListener('submit', (e)=>{
            //set variables of the login form
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const loginErrorMsg = document.getElementById('loginErrorMsg');
            //not showing error msg at first
            if(loginErrorMsg) loginErrorMsg.style.display = 'none';
            //stop page reload
            e.preventDefault();
            //hide old error message
            loginErrorMsg.style.display = 'none'
            //get the values
            const email = emailInput.value;
            const password = passwordInput.value;
            callback(email, password);
        });

    }else{
        console.error("there is no loginForm or loginForm");
    }
}

// +++ login button  +++ 
function handleSignIn(username, userAvatar){
    //set common variables for login and logout
    const loginSection = document.getElementById('loginSection');
    const userSection = document.getElementById('userSection');
    const userAvatarSpan = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    //close the login form
    closeModal('mainFormModal');
    loginSection.classList.remove('active');
    loginSection.classList.add('hidden');
    userSection.classList.remove('hidden');
    userSection.classList.add('active');
    userAvatarSpan.innerText = userAvatar;
    //show the user name
    userName.textContent = username;
    getTTButton(enableTTButton);
}

// +++ logout button  +++
function handleSignOut(){
    //set common variables for login and logout
    const loginSection = document.getElementById('loginSection');
    const userSection = document.getElementById('userSection');
    const userName = document.getElementById('userName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    userSection.classList.add('hidden');
    userSection.classList.remove('active');
    loginSection.classList.remove('hidden');
    loginSection.classList.add('active');
    userName.textContent = '';
    email.textContent = '';
    password.textContent = '';
    openModal('mainFormModal');
    getTTButton(disableTTButton);
    removeLocalStorage("userdatas");
}

// +++ get current datetime 
function getCurrentDateTime() {
    const now = new Date();

    const days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
    const year = now.getFullYear();
    const month = String(now.getMonth()+1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dayName = days[now.getDay()];// 0=Sun, 1=Mon, etc.
    const hours = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}(${dayName}) ${hours}:${min}`;
}

//cardbalance 
function setUpCardbalance(cardbalance) {
    const cardBalanceAmount = document.getElementById('cardBalanceAmount');
    cardBalanceAmount.innerText = cardbalance + "円";
}

// SSSS transaction section SSSS Starts
// // +++ new Transaction or Usage
function setupTransactionForm(callback, useruid){

    const transForm = document.getElementById('new-transaction-form');
    if (transForm) {
        transForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Stop reload
            const usedAmountEle = document.getElementById('usedAmount');
            const usedAmount = Number(usedAmountEle.value);
            const datetime = getCurrentDateTime();
            const transacTrans = lang();
            if(usedAmount <= 0) {
                showToast(transacTrans.msgInvalidAmount, "fail");
                usedAmountEle.value = "";
                return;
            }
            showConfirm(transacTrans.confirmText, ()=>{
                // Call the callback
                callback(usedAmount, datetime, useruid);
            })
            
            usedAmountEle.value = "";
        });
    } else {
        console.error("Error: Could not find 'new-transaction-form'");
    }
}
// // +++ transaction history(transactions)
function renderTransactionList(transactions, useruid) {
    const listContainer = document.getElementById('transactionList');
    const emptyState = document.getElementById('history-empty-state');

    //setting the language

    const listTrans = lang();
    
    //Clear current list
    listContainer.innerHTML = '';

    //Check if no data
    if (!transactions || transactions.length === 0) {
        emptyState.classList.remove('hidden'); // Show "No Data" UI
        return;
    } else {
        emptyState.classList.add('hidden'); // Hide "No Data" UI
    }
    // 3. Loop through data and create HTML
    transactions.forEach(data => {
        // --- LOGIC: Determine Red vs Green ---
        // 'data type' ("use" or "topup")
        // console.log(" trans data - ", data);
        const isExpense = data.type === 'use'; 
        // Set colors and signs based on type
        const color = isExpense ? 'red' : 'green'; // 'red' or 'green'
        const sign = isExpense ? '-' : '+';        // '-' or '+'
        const amount = isExpense ? data.usedAmount : data.topUpAmount;
        // console.log("data (transactions uiUtils) - ",data);
        // --- TEMPLATE: Your HTML goes here ---
        let cardHTML = `
            <div class="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden animate-fade-in">
                
                <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-${color}-500"></div>

                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    
                    <div class="pl-2">
                        <h3 class="text-lg font-bold text-gray-900">${data.name || 'Unknown User'}</h3>
                        <p class="text-xs text-gray-400 mt-1">${data.datetime}</p>
                    </div>

                    <div class="flex flex-col sm:items-end">
                        <span class="text-xl font-extrabold text-${color}-600">
                            ${sign}${amount}円
                        </span>
                        
                        <span class="text-xs text-gray-500 mt-1">
                            <span data-i18n="label_balance_before">${listTrans.labelBalanceBefore}</span> <span class="font-medium text-gray-700">${data.oldCardBalance}円</span>
                        </span>
                        <span class="text-xs text-gray-500 mt-1">
                            <span data-i18n="label_balance_after">${listTrans.labelBalanceAfter}</span> <span class="font-medium text-gray-700">${data.newCardBalance}円</span>
                        </span>
                    </div>
                </div>
                `;
        if(useruid == data.useruid){
            
            cardHTML += `
                <div class="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-3">
                    <button onclick="handleUpdate('${data.id}')" class="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                        Update
                    </button>
                    <button onclick="handleDelete('${data.id}')" class="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                        Delete
                    </button>
                </div>
        `;
        }
        cardHTML += `</div>`;

        // 4. Inject the HTML into the container
        listContainer.innerHTML += cardHTML;
    });
}

// SSSS transaction section SSSS End

// SSSS user section SSSS Start
// +++ render user list
function renderSelfList(selfDatas, useruid) {
    const listContainer = document.getElementById('selfDatas');
    const selfTrans = lang();

    //prepare the datas
    const name = selfDatas[0].name;
    const balance = selfDatas[0].balance;
    const debtTo = selfDatas[0].debtTo;
    const oweMe = selfDatas[0].oweMe;
    const currentUserAvatar = selfDatas[0].userAvatar;
    
    // clear the list first
    listContainer.innerHTML = '';

    // green card section or the last card section starts
    let lastCardPaidStatus = selfTrans.statusClearDebt;
    let lastCardPaidData = "status_clear_debt";
    let lastCardPaidTextColor = "green";
    let lastCardPaidAnimate = "";
    let lastCardSignForBalance = balance > 0?"+"+balance:balance;
    let lastCardTextColor = balance === 0?"gray":"green";
    // green card section or the last card section ends
    let sameToOweHeight = "h-[266px]";
    // let color = "";
    let cardHTML = "";
    
    if(debtTo && Object.keys(debtTo).length != 0) {
        lastCardPaidStatus = selfTrans.statusHasDebt;
        lastCardPaidData = "status_has_debt";
        lastCardPaidTextColor = "red";
        lastCardPaidAnimate = "animate-pulse";
        const debtToArr = Object.entries(debtTo);
        if(debtToArr.length > 0) {

            debtToArr.forEach((creditor)=>{
                const creditorId = creditor[1].id;
                const creditorName = creditor[1].name;
                const creditorAvatar = creditor[1].userAvatar;
                const debtToCreditor = creditor[1].debt;
                const debtToClickedCheck = creditor[1].clickedPayBack;
                let paidBtnCheck = "";
                if(debtToClickedCheck === "no"){
                    paidBtnCheck += 
                    `
                        <div class="text-white text-lg font-bold"><span data-i18n="msg_confirm_payback">${selfTrans.msgConfirmPayback}</span></div>
                        <p class="text-gray-400 text-sm" data-i18n="msg_notify_helper">${selfTrans.msgNotifyHelper}</p>
                        <button onclick="event.stopPropagation(); handlePayBack('${useruid}', '${creditorId}', '${selfTrans.msgConfirmPayDebt}')" class="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-red-500 to-pink-600 shadow-lg hover:shadow-red-500/30 transform transition active:scale-95">
                                        💸 <span data-i18n="btn_paid">${selfTrans.btnPaid}</span>
                        </button>
                    `;
                }else{
                    paidBtnCheck += 
                    `
                        <div class="text-white text-lg font-bold">${creditorName} <span data-i18n="msg_wait_confirm">${selfTrans.msgWaitConfirm}</span></div>
                        <button disabled onclick="event.stopPropagation();" data-i18n="status_sent"  class="w-full py-3 rounded-xl text-white font-bold bg-gray-500 shadow-lg hover:shadow-gray-500/30">
                            ${selfTrans.statusSent}
                        </button>
                    `;
                }
                cardHTML += `
                    <div class="flip-card cursor-pointer" onclick="this.classList.toggle('flipped')">
                        <div class="flip-card-inner">
                            <div class="flip-card-front ${sameToOweHeight} bg-white p-6 shadow-sm border border-gray-200 relative overflow-hidden">
                                <div class="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>
                                
                                <div class="flex justify-between items-start mb-4 mt-2">
                                    <div class="flex items-center gap-3 text-left">
                                        <div class="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-lg">${creditorAvatar}</div>
                                        <div>
                                            <h3 class="text-lg font-bold text-gray-900 leading-tight">${creditorName}</h3>
                                            <p class="text-xs text-gray-500" data-i18n="label_creditor">${selfTrans.labelCreditor}</p>
                                        </div>
                                    </div>
                                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse"  data-i18n="status_has_debt">${selfTrans.statusHasDebt}</span>
                                </div>
        
                                <div class="bg-red-50 p-3 rounded-lg text-center border border-red-100 mb-4">
                                    <p class="text-xs text-red-500 uppercase tracking-wide" data-i18n="label_debt">${selfTrans.labelDebt}</p>
                                    <p class="text-2xl font-bold text-red-600">-${debtToCreditor}円</p>
                                </div>
        
                                <div class="text-xs text-gray-400 mt-auto"><span data-i18n="label_debt">${selfTrans.cardClickPay}</span><span class="text-lg">↻</span></div>
                            </div>
        
                            <div class="flip-card-back bg-gray-900 p-6 shadow-lg border border-gray-800 relative overflow-hidden">
                                <div class="flex flex-col h-full justify-center items-center gap-4">
                        
                                    ${/* this paidbtnCheck is checking the btn is already clicked or not */ ''}
                                    ${paidBtnCheck}
                                    
                                    <button class="text-gray-500 text-xs hover:text-white mt-2" data-i18n="btn_back">${selfTrans.btnBack}</button>
                                </div>
                            </div>
        
                        </div>${/* class="flip-card-inner" ends */ ''}
                    </div>${/* class="flip-card cursor-pointer"ends */ ''}
                `;
            });//debtToArr.forEach((creditor) ends
        }//if(debtToArr.length > 0) { ends
    }//if(debtTo && Object.keys(debtTo).length != 0) { ends
    // console.log("oweMe array - ", oweMe)
    // console.log("oweMe array - ", Object.keys(oweMe).length)
    if(oweMe && Object.keys(oweMe).length != 0) {
        sameToOweHeight = "h-[304px]";
        const oweMeArr = Object.entries(oweMe);
        if(oweMeArr.length > 0) {
            oweMeArr.forEach((debtor)=>{
                // console.log("debtor", debtor);
                const debtorPayBackCheck = debtor[1].gotMoneyBack;
                const debtorId = debtor[1].id;
                const debtorName = debtor[1].name;
                const debtorDebt = debtor[1].owe;
                const debtorAvatar = debtor[1].userAvatar;
                if(debtorPayBackCheck === "checkState"){

                    cardHTML += `
                        <div class="flip-card cursor-pointer" onclick="this.classList.toggle('flipped')">
                            <div class="flip-card-inner">
                                <div class="flip-card-front bg-white p-6 shadow-sm border border-gray-200 relative overflow-hidden">
                                    <div class="absolute top-0 left-0 right-0 h-1 bg-yellow-500"></div>
            
                                    <div class="flex justify-between items-start mb-4 mt-2">
                                        <div class="flex items-center gap-3 text-left">
                                            <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">${debtorAvatar}</div>
                                            <div>
                                                <h3 class="text-lg font-bold text-gray-900 leading-tight">${debtorName}</h3>
                                                <p class="text-xs text-gray-500">Status: Paying you...</p>
                                            </div>
                                        </div>
                                        <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 animate-pulse">WAITING</span>
                                    </div>
            
                                    <div class="bg-yellow-50 p-3 rounded-lg text-center border border-yellow-100 mb-4">
                                        <p class="text-xs text-yellow-600 uppercase tracking-wide">Incoming Payment</p>
                                        <p class="text-2xl font-bold text-gray-800">${debtorDebt}円</p>
                                    </div>
                    
                                        <div class="text-xs text-gray-400 mt-auto">Click to Confirm <span class="text-lg">↻</span></div>
                                    </div>${/* <div class="flip-card-front bg-white p-6... ends */ ''}
                
                                    <div class="flip-card-back bg-yellow-50 p-6 shadow-lg border border-yellow-200">
                                        <div class="flex flex-col h-full justify-center items-center gap-3">
                                            <div class="h-12 w-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-2xl mb-2">?</div>
                                            
                                            <div class="text-gray-800 text-lg font-bold">Did you accept?</div>
                                            <p class="text-gray-500 text-xs mb-4">${debtorName} <span data-i18n="msg_claimed_payment">${selfTrans.msgClaimedPayment}</span></p>
                
                                            <button onclick="event.stopPropagation(); handleAccept('${useruid}', '${debtorId}', '${selfTrans.msgConfirmReceive}')" data-i18n="status_received" class="w-full py-2.5 rounded-lg text-white font-bold bg-green-500 hover:bg-green-600 shadow-md transition active:scale-95">
                                                ${selfTrans.statusReceived}
                                            </button>
                
                                            <button onclick="event.stopPropagation(); handleReject('user_id')" data-i18n="status_not_received" class="w-full py-2.5 rounded-lg text-gray-600 font-bold bg-white border border-gray-300 hover:bg-gray-50 transition active:scale-95">
                                                ${selfTrans.statusNotReceived}
                                            </button>
                                        </div>
                                    </div>${/* <div class="flip-card-back bg-yellow-50 p-6... ends */ ''}
                                </div>${/* class="flip-card-inner" ends */ ''}
                            </div>${/* class="flip-card cursor-pointer"ends */ ''}
                        `;
                }else {//if(debtorPayBackCheck === "checkState") ends
                    cardHTML += `
                            <div class="bg-white ${sameToOweHeight} rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 relative overflow-hidden">
                                <div class="absolute top-0 left-0 right-0 h-1 bg-yellow-500"></div>

                                <div class="flex justify-between items-start mb-4 mt-2">
                                    <div class="flex items-center gap-3">
                                        <div class="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-lg">
                                            ${debtorAvatar}
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-bold text-gray-900 leading-tight">${debtorName}</h3>
                                            <p class="text-xs text-gray-500" data-i18n="label_incoming_debt">${selfTrans.labelIncomingDebt}</p>
                                        </div>
                                    </div>${/* <div class="flex items-center gap-3"> ends */ ''}
                                    <span  data-i18n="status_not_received" class="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                                        ${selfTrans.statusNotReceived}
                                    </span>
                                </div>${/* <div class="flex justify-between items-start mb-4 mt-2"> ends */ ''}

                                <div class="bg-gray-50 p-3 rounded-lg text-center mb-4">
                                    <div class="bg-gray-50 p-3 rounded-lg text-center">
                                        <p class="text-xs text-yellow-500 uppercase tracking-wide"  data-i18n="label_amount">${selfTrans.labelAmount}</p>
                                        <p class="text-lg font-bold text-yellow-400"  data-i18n="label_debt">${debtorDebt}円</p>
                                    </div>
                                </div>
                            </div>${/** <div class="bg-white ${sameToOweHeight} ends */ ''}
                    `;
                }// else {//if(debtorPayBackCheck === "checkState") ends
            });//oweMe.forEach((debtor) ends
        }//if(oweMeArr.length > 0) { ends
    }//if(oweMe && Object.keys(oweMe).length != 0) { ends

    cardHTML += `
        <div class="bg-white ${sameToOweHeight} rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 relative overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-1 bg-${lastCardPaidTextColor}-500"></div>

            <div class="flex justify-between items-start mb-4 mt-2">
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-full bg-${lastCardPaidTextColor}-100 flex items-center justify-center text-${lastCardPaidTextColor}-600 font-bold text-lg">
                        ${currentUserAvatar}
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 leading-tight">${name}</h3>
                        <p class="text-xs text-gray-500" data-i18n="label_you" >${selfTrans.labelYou}</p>
                    </div>
                </div>
                <span data-i18n="${lastCardPaidData}" class="px-2.5 py-1 rounded-full text-xs font-bold bg-${lastCardPaidTextColor}-100 text-${lastCardPaidTextColor}-700 ${lastCardPaidAnimate}">
                ${lastCardPaidStatus}
                </span>
            </div>

            <div class="bg-gray-50 p-3 rounded-lg text-center mb-4">
                <div class="bg-gray-50 p-3 rounded-lg text-center">
                    <p class="text-xs text-${lastCardTextColor}-500 uppercase tracking-wide" data-i18n="label_amount" >${selfTrans.labelAmount}</p>
                    <p class="text-lg font-bold text-${lastCardTextColor}-400">${lastCardSignForBalance}円</p>
                </div>
            </div>
        </div>
    `;

    listContainer.innerHTML += cardHTML;

}//renderSelfList end

function renderOtherUsersList(otherMembersDatas){
    const otherMembersDatasSpan = document.getElementById('otherMembersDatas');
    otherMembersDatasSpan.innerHTML = '';
    let color, balanceColor, sign, paidStatus, paidStatusData = "";
    let cardHTML = "";
    const otherTrans = lang();
    //set the datas for self
    otherMembersDatas.forEach(other=>{
        const debtStatus = Object.keys(other.debtTo).length > 0;
        color = debtStatus?"red":"green";
        sign = debtStatus?"-":"+";
        paidStatus = debtStatus?otherTrans.statusHasDebt:otherTrans.statusClearDebt;
        paidStatusData = debtStatus?"status_has_debt":"status_clear_debt";
        const otherBalance = other.balance;
        sign = otherBalance>0?sign:"";
        balanceColor = otherBalance>0?"green":"gray";
        //prepare the datas
        const otherUserAvatar = other.userAvatar;
        const otherName = other.name;
        balanceSign = otherBalance>0?"+":"";
        const balanceWithSign = balanceSign + otherBalance;
        const otherDebtToArr = Object.entries(other.debtTo);
        let otherDebtTotal = 0;
        if(debtStatus){
            otherDebtToArr.forEach(debts=>{
                const debt = debts[1].debt
                otherDebtTotal += debt
            });//otherDebtToArr.forEach(debts=>{ ends
        }
        const otherDebtTotalWithSign = otherDebtTotal>0?"-"+otherDebtTotal:otherDebtTotal;
        color = otherBalance>0 || otherDebtTotal>0?color:"gray";
        cardHTML += `
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 relative overflow-hidden">
                <div class="absolute top-0 left-0 right-0 h-1 bg-${color}-500"></div>

                <div class="flex justify-between items-start mb-4 mt-2">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 rounded-full bg-${color}-100 flex items-center justify-center text-${color}-600 font-bold text-lg">
                            ${otherUserAvatar}
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-gray-900 leading-tight">${otherName}</h3>
                        </div>
                    </div>
                    <span data-i18n="${paidStatusData}" class="px-2.5 py-1 rounded-full text-xs font-bold bg-${color}-100 text-${color}-700">
                    ${paidStatus}
                    </span>
                </div>${/* <div class="flex justify-between items-start mb-4 mt-2">  ends */ ''}

                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="bg-${balanceColor}-50 p-3 rounded-lg text-center">
                        <p class="text-xs text-${balanceColor}-500 uppercase tracking-wide" data-i18n="label_amount">${otherTrans.labelAmount}</p>
                        <p class="text-lg font-bold text-${balanceColor}-400">${balanceWithSign}円</p>
                    </div>
                    <div class="bg-${color}-50 p-3 rounded-lg text-center border border-${color}-100 bg-${color}-50">
                        <p class="text-xs text-${color}-500 uppercase tracking-wide" data-i18n="label_debt">${otherTrans.labelDebt}</p>
                        <p class="text-lg font-bold text-${color}-600">${otherDebtTotalWithSign}円</p>
                    </div>
                </div>${/* <div class="grid grid-cols-2 gap-4 mb-6">  ends */ ''}
            </div>${/* <div class="bg-white rounded-2xl  ends */ ''}
        `;
    });//otherMembersDatas.forEach(other=>{ ends

    otherMembersDatasSpan.innerHTML += cardHTML;

} // renderOtherUsersList ends

// SSSS user section SSSS End

// // +++ top-up
function setupTopUpForm(callback, useruid){

    const topUpForm = document.getElementById('top-up-form');
    if (topUpForm) {
        topUpForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Stop reload
            const topUpAmountEle = document.getElementById('topUpAmount');
            const topUpAmount = Number(topUpAmountEle.value);
            
            const topupTrans = lang();
            if(topUpAmount <= 0) {
                showToast(topupTrans.msgInvalidAmount, "fail");
                usedAmountEle.value = "";
                return;
            }
            const datetime = getCurrentDateTime();
            showConfirm(topupTrans.confirmText, ()=>{
                // Call the callback
                callback(topUpAmount, datetime, useruid);
            });
            
            topUpAmountEle.value = "";
        });
    } else {
        console.error("Error: Could not find 'top-up-form'");
    }
}

// --- ...End --- 

// +++ auth html clear
function hiddenEmptyState(){
    const historyEmpty = document.getElementById('history-empty-state');
    const selfDatasEmpty = document.getElementById('selfDatas-empty-state');
    const otherUsersDatasEmpty = document.getElementById('otherUsers-empty-state');
    historyEmpty.classList.add("hidden");
    selfDatasEmpty.classList.add("hidden");
    otherUsersDatasEmpty.classList.add("hidden");

}

function clearHTML(){
    const transactionList = document.getElementById('transactionList');
    const selfDatas = document.getElementById('selfDatas');
    const otherMembersDatas = document.getElementById('otherMembersDatas');
    const historyEmpty = document.getElementById('history-empty-state');
    const selfDatasEmpty = document.getElementById('selfDatas-empty-state');
    const otherUsersDatasEmpty = document.getElementById('otherUsers-empty-state');
    
    transactionList.innerHTML = '';
    selfDatas.innerHTML = '';
    otherMembersDatas.innerHTML = '';
    historyEmpty.classList.remove("hidden");
    selfDatasEmpty.classList.remove("hidden");
    otherUsersDatasEmpty.classList.remove("hidden");
}   

// --- immediately run function here  Start ---
// --- immediately run function here  Start ---


