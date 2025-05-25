const firebaseConfig = {
  apiKey: "AIzaSyDScRQZhidNCpQiPRk0XnQaPF6SM6NPi1U",
  authDomain: "login-c94f8.firebaseapp.com",
  projectId: "login-c94f8",
  storageBucket: "login-c94f8.firebasestorage.app",
  messagingSenderId: "277803117358",
  appId: "1:277803117358:web:6d2f387bff41859bf3e8bf"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Google Authentication Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
const googleSignUpBtn = document.getElementById('googleSignUp');

function createNewUserNotification(currentUserid, currentUsername){
    const currentTime = new Date().toTimeString().split(' ')[0];;
    const currentDate = new Date().toISOString().split('T')[0];
    const viewStatus = "unread";
    const notificationType = "user-created";
    const notificationMessage = "new user has registered";
    
    fetch(`/api/v1/notifications/post-notification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date:currentDate,timeslot:currentTime,status:viewStatus,message:notificationMessage,userid:currentUserid,type:notificationType,username:currentUsername}),
        })
        .then((response) => {
             if (!response.ok) throw new Error("Failed to create a register new user notification");
                return response.json();
        })
        .then(() => {
        })
}


// Google Sign Up
googleSignUpBtn.addEventListener('click', () => {
  auth.signInWithPopup(googleProvider)
  .then((result) => {
      // This gives you a Google Access Token
      const credential = result.credential;
      const token = credential.accessToken;
      
      // The signed-in user info
      const user = result.user;
      createNewUserNotification(user.uid,user.displayName);
      
      // Create a JSON object with the user details
      const userData = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          providerData: user.providerData,
          metadata: {
              creationTime: user.metadata.creationTime,
              lastSignInTime: user.metadata.lastSignInTime
          },
          // Add any additional custom data you want to store
          registrationDate: new Date().toISOString()
      };
      
 
      //Send to the backend

      fetch('/api/v1/users/post-user', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              
          },
          body: JSON.stringify(userData)
      })
      .then(response => response.json())
      .then(data => {
          console.log('Success:', data);
          
         // window.location.href = 'dashboard.html';
      })
      .catch((error) => {
          console.error('Error:', error);
          //window.location.href = 'dashboard.html';
      });
      
      // 3. Or store in localStorage temporarily
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
      
      console.error('Google sign-up error:', {
          errorCode,
          errorMessage,
          email,
          credential
      });
      
      alert(`Error with Google sign-up: ${errorMessage}`);
  });
});

// Check if user is already signed in
auth.onAuthStateChanged((user) => {
  if (user) {
      // User is signed in
      console.log('Already signed');
  }
});