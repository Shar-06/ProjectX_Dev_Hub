// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDScRQZhidNCpQiPRk0XnQaPF6SM6NPi1U",
  authDomain: "login-c94f8.firebaseapp.com",
  projectId: "login-c94f8",
  storageBucket: "login-c94f8.firebasestorage.app",
  messagingSenderId: "277803117358",
  appId: "1:277803117358:web:6d2f387bff41859bf3e8bf"
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
      window.location.href='./html/admin.html';
      // ...

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
  }

  function googleAuth(){
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      const userEmail = user.email;
      const userID = user.uid;
      //fetch user role from database using email after a successful user authentication
      fetch(`/api/v1/users/id/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(data => {
        if(data.data){
              const userRole = data.data.role;
              const userEmail = data.data.email;          
             //redirect to correct user page based on user role
              if( userEmail == "msesenyanelevi@gmail.com"){
                window.location.href="../html/admin.html";
              }
              else if(userRole == "Resident"){
                window.location.href="../html/bookingPage.html";
              }
              else if(userRole == "Facility Staff"){
                window.location.href="../html/facilityStaffPage.html";
              }
              else{
                alert("You are registered but you have not been assigned a role as a user");
                window.location.href="#"; //redirect to waiting page
              }
        }
      })
      .catch(error => {
          console.error('Error fetching user role:', error);
          alert("User not registered, please register first!!!");
      });
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


