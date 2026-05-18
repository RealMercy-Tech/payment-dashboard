
const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');
//const login = document.getElementById('login');

// login.addEventListener("click", () => {
 // alert("login successfull")
//})

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById('user').value;
    const password = document.getElementById('password').value;

 try{
    const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    });
  const data = await res.json();
  
  if(res.ok){
    
    localStorage.setItem("token", data.token);

    // save user
  localStorage.setItem("username", data.user.username);

    message.style.color = 'green';
    message.textContent = data.message;

    // Redirect to dashboard if successfull

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);


  } else {
    message.style.color = 'red';
    message.textContent = data.message;
  }

 } catch (err){
  console.error("FETCH ERROR:", err); 
  message.style.color = 'red';
  message.textContent = "Server error. Please try again";
 }

});
