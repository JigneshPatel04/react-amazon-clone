import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAL8f4XFM8wXhUOQ6MsHAlQv_175QnVY64',
  authDomain: 'challenge-c438d.firebaseapp.com',
  databaseURL: 'https://challenge-c438d.firebaseio.com',
  projectId: 'challenge-c438d',
  storageBucket: 'challenge-c438d.appspot.com',
  messagingSenderId: '700441679088',
  appId: '1:700441679088:web:4bb535a941da9345e35e35',
  measurementId: 'G-E2YWG3DLDT',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
export { db, auth };
