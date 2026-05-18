const accountInputEl = document.getElementById("account");
const receiverName = document.getElementById("receivername");
const form = document.getElementById("transferform");
const sendBnt = document.getElementById("submit");
   

let timeout;
let isValidUser = false;

// to check user

async function checkUser () {
 
    const accountInput = accountInputEl.value;
    const token = localStorage.getItem("token");

     //reset state 
     isValidUser = false;
    sendBnt.disabled = true;

    if(accountInput.length < 10){
        receiverName.textContent = "";
        return
    }

    // Show loadind

    receiverName.textContent = "Checking user....";

    try{

         const res = await fetch('http://localhost:3000/api/transfer/user',{
           method: "POST",
        headers: {
        'Content-Type': 'application/json',
         "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({accountInput})
     
         });

         const data = await res.json();
         
         if(res.ok){
            receiverName.textContent = data.username;

            // valid user
            isValidUser = true;
            sendBnt.disabled = false
         } else{
            receiverName.textContent = data.message;
            sendBnt.disabled = true;
         }
    }catch(error){
      receiverName.textContent = "Network error";
      sendBnt.disabled = true;
    }
}



//Debounce input
accountInputEl.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        checkUser();
    }, 500);
});


// transfer handle
 form.addEventListener("submit", async (e) => {
  e.preventDefault();
   const token = localStorage.getItem("token")
  const receiverAccount = accountInputEl.value;
 const amount = document.getElementById("amount").value;

   sendBnt.textContent = "Sending.."

 try{

   const res = await fetch('http://localhost:3000/api/transfer/transfer', {
       method: "POST",
        headers: {
        'Content-Type': 'application/json',
         "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
         receiverAccount:   receiverAccount,
            amount: Number(amount)
        })
   });

   const data = await res.json();

   if(res.ok){
    alert(data.message);
    // reset form
    form.reset();
    receiverName.textContent = ""
    sendBnt.disabled = true;
    // update balance
    localStorage.setItem("refreshBalance", "true");
    window.location.href = "dashboard.html"
   }else{
    alert(data.message);
    sendBnt.disabled  = false;
   }

  
 } catch(err){
  alert("Transfer invalid")
 }
sendBnt.textContent = "send"
 });