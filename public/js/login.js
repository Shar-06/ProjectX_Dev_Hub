
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsU3NSYzqjCKZFr7ktapDMKAoLnXuOODE",
  authDomain: "projectxloginpage.firebaseapp.com",
  projectId: "projectxloginpage",
  storageBucket: "projectxloginpage.firebasestorage.app",
  messagingSenderId: "485642614683",
  appId: "1:485642614683:web:93603fb88f7948bd1d533e",
  measurementId: "G-4Z3F4NWJNH"
};


window.addEventListener("DOMContentLoaded", () => {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider()

  function getLoginDetails(){

    let pwd = document.getElementById("passwd").value;
    let userName = document.getElementById("userName").value;

    signInWithEmailAndPassword(auth, userName, pwd)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("logged in, auth successful")
      window.location.href="admin.html";
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });


    console.log(userName);
    console.log(pwd);
  }

  function googleAuth(){
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log("user verified: "+ user.emailVerified);
      console.log("user name: "+user.displayName);
      console.log("user email: "+user.email);
      console.log("user ID: "+user.uid);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      const userEmail = user.email;
      let userRole;
      
      //fetch user role from database using email after a successful user authentication
      fetch(`https://communitysportsx-a0byh7gsa5fhf7gf.centralus-01.azurewebsites.net/api/v1/users?email=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(data => {
          if (data && data.role) {
              userRole = data.role;

              //redirect to correct user page based on user role
              if(userRole == "admin"){
                window.location.href="admin.html";
              }
              if(userRole == "resident"){
                window.location.href="#";
              }
              if(userRole == "staff"){
                window.location.href="#";
              }
              else{
                alert("You are registered but you have not been assigned a role as a user");
                window.location.href="#"; //redirect to waiting page
              }
          } else {
            userRole = data.role;
          }
      })
      .catch(error => console.error('Error:', error));
      
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }


    document.getElementById("googleBtn").addEventListener("click", function(event){
      event.preventDefault();
      googleAuth();
    });
    document.getElementById("loginBtn").addEventListener("click",  function(event){
      event.preventDefault();
      getLoginDetails()
    });
});


