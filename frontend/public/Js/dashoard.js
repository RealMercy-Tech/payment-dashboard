const username = document.getElementById("userdisplay");
const balance = document.getElementById("balance");

const token = localStorage.getItem("token");


async function loadDashboard() {
try{

    const res = await fetch('http://localhost:3000/api/transfer/dashboard', {
        method: "GET",
        headers: {
        'Content-Type': 'application/json',
         "Authorization": `Bearer ${token}`
        }
    });

    const data = await res.json();

    if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
}

    if(!res.ok){ 
        console.log(data.message);
        window.location.href = "login.html";
    return;
}



// display username
username.textContent = data.user.username;
balance.textContent = `₦${Number(data.user.balance).toLocaleString()}`


} catch(error){
    console.error(error);
    alert("unable to laod dashboard");
}
    
}

loadDashboard();

// for transfer history 
 async function loadTransactions() {
    const token = localStorage.getItem("token");
 const currentUser = localStorage.getItem("username");


  try {
    const response = await fetch('http://localhost:3000/api/transfer/history', {
       method: "GET",
        headers: {
        'Content-Type': 'application/json',
         "Authorization": `Bearer ${token}`
        }
    });
    const data = await response.json();
    const transactions = data.transactions;

    const container = document.getElementById("transactions");
    container.innerHTML = "";

    if (transactions.length === 0) {
      container.innerHTML = "<p>No transactions found</p>";
      return;
    }

    transactions.forEach(tx => {
    const isSender = currentUser?.trim().toLowerCase() === tx.sender_name?.trim().toLowerCase();

    // 1. Create the container div using our modern class name
    const div = document.createElement("div");
    div.className = "transaction-item";

    // 2. Format the date beautifully (e.g., "May 17, 1:32 PM")
    const formattedDate = new Date(tx.created_at).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // 3. Construct modern layout structure
    div.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <!-- Dynamic modern icon container based on send/receive status -->
            <div class="tx-icon" style="
                width: 40px; 
                height: 40px; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                background-color: ${isSender ? '#fef2f2' : '#f0fdf4'}; 
                color: ${isSender ? '#ef4444' : '#22c55e'};
                font-size: 0.9rem;">
                <i class="fas ${isSender ? 'fa-arrow-up-right-from-square' : 'fa-arrow-down-left-from-square'}"></i>
            </div>
            
            <!-- Details stacked cleanly -->
            <div class="tx-details" style="display: flex; flex-direction: column; gap: 0.25rem;">
                <span class="tx-name" style="font-weight: 600; font-size: 0.95rem; color: #1e293b;">
                    ${isSender ? `To: ${tx.receiver_name}` : `From: ${tx.sender_name}`}
                </span>
                <span class="tx-date" style="font-size: 0.8rem; color: #64748b;">
                    ${formattedDate} • <span style="text-transform: capitalize; font-weight: 500;">${tx.status}</span>
                </span>
            </div>
        </div>

        <!-- Right Side: Beautiful green or red balance color adjustments -->
        <span class="tx-amount" style="
            font-weight: 600; 
            font-size: 1rem; 
            color: ${isSender ? '#ef4444' : '#22c55e'};">
            ${isSender ? '-' : '+'}₦${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
    `;

    // 4. Safely append to your layout container (make sure 'container' points to your HTML's ID 'transactions')
    const transactionContainer = document.getElementById("transactions") || container;
    transactionContainer.appendChild(div);
});

  } catch (error) {
    console.error("Error:", error);
  }
}

loadTransactions();
