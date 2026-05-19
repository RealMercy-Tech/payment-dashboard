
const loginForm = document.getElementById('form');

const API_URL = "https://payment-dashboard-backend-cke4.onrender.com";

// loginButton.addEventListener("click", () => {
//  alert("click successfull")
// })

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phonenum = document.getElementById("number").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  //console.log( JSON.stringify({username, email, phonenum, password}))
try{
    const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, email, phonenum, password})
    });

   console.log(res)
   
    
  const data = await res.json();
 //console.log(data)

  if(res.ok){
    message.style.color = 'green';
    message.textContent = data.message;
   
    window.location.href = "login.html"; 
   
  }else{
   message.style.color = 'red';
    message.textContent = data.message;
  }


} catch(error){
 console.error(error)
  alert("Server connection failed");
}

});