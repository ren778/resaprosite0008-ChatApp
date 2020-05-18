(() => {
  'use strict';

  const firebaseConfig = {
    apiKey: "AIzaSyAAM9IHeqDyAMVFhxB_p8Ktzpw6IggP4hs",
    authDomain: "myfirebasechatapp-5bed6.firebaseapp.com",
    databaseURL: "https://myfirebasechatapp-5bed6.firebaseio.com",
    projectId: "myfirebasechatapp-5bed6",
    storageBucket: "myfirebasechatapp-5bed6.appspot.com",
    messagingSenderId: "479719065806",
    appId: "1:479719065806:web:1486d334179e7fd97ea89f",
    measurementId: "G-GDX93MRZB9"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  const db = firebase.firestore();
  /* db.settings({
    timestampsInSnapshots: true
  }); */
  const collection = db.collection('messages');

  const auth = firebase.auth();
  let me = null;

  const message = document.getElementById('message');
  const form = document.querySelector('form');
  const messages = document.getElementById('messages');
  const login = document.getElementById('login');
  const logout = document.getElementById('logout');

  login.addEventListener('click', () => {
    auth.signInAnonymously();
  });

  logout.addEventListener('click', () => {
    auth.signOut();
  });

  auth.onAuthStateChanged(user => {
    if (user) {
      me = user;

      while (messages.firstChild) {
        messages.removeChild(messages.firstChild);
      }

      collection.orderBy('created').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const li = document.createElement('li');
            const d = change.doc.data();
            li.textContent = d.uid.substr(0,8) + ': ' + d.message;
            messages.appendChild(li);
          }
        });
      });
      console.log(`Logged in as: ${user.uid}`);
      login.classList.add('hidden');
      [logout, form, messages].forEach(el => {
        el.classList.remove('hidden');
      });
      message.focus();
      return;
    }
    me = null;
    console.log('Nobody is logged in');
    login.classList.remove('hidden');
    login.classList.remove('hidden');
    [logout, form, messages].forEach(el => {
      el.classList.add('hidden');
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const val = message.value.trim();
    if (val === "") {
      return;
    }

    message.value = '';
    message.focus();

    collection.add({
      message: val,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      uid: me ? me.uid : 'nobody'
    })
    .then(doc => {
      console.log(`${doc.id} added!`);
    })
    .catch(error => {
      console.log('document add error!');
      console.log(error);
    });
  });
})();
