import {firebase} from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { Alert, ToastAndroid } from 'react-native';
//import firestore from '@react-native-firebase/firestore';
import {addUser, clearUser} from '../../reducers/currentUserSlice';

const firebaseConfig = {
  apiKey: 'AIzaSyAILGUM4uf4f_KCAJYikqZaJOjWbgldZ0I',
};

export const initializeFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized');
  } else {
    firebase.app(); // if already initialized, use that one
    console.log('Firebase already initialized');
  }
};

export const ADMIN_EMAIL = 'admin@email.com';

export const initCheckAuthState = () => {
  console.log('Checking auth state');
  auth().onAuthStateChanged(user => {
    if (user) {
      console.log('User is signed in');
    } else {
      console.log('User is signed out');
    }
  });
};

export const addFirestoreUser = async (user) => {
  if (user.email === ADMIN_EMAIL) {
    ToastAndroid.show('Admin user added to Firestore Collection', ToastAndroid.SHORT);
    return firestore().collection('users').doc(`${user.uid}`)
      .set({
        email: user.email,
        uid: user.uid,
        role: 'ADMIN'
      });
  } else {
    ToastAndroid.show('Worker user added to Firestore Collection', ToastAndroid.SHORT);
    return firestore().collection('users').doc(`${user.uid}`)
      .set({
        email: user.email,
        uid: user.uid,
        role: 'WORKER',
      });
  }
};

export const removeFirestoreUser = async (user) => {
  ToastAndroid.show('User removed from Firestore Database', ToastAndroid.SHORT);
  return firestore().collection('users').doc(`${user.uid}`).delete();
};

export const updateFirestoreUserName = async (user, name) => {
  ToastAndroid.show(`User name changed in Firestore Document`, ToastAndroid.SHORT)
  firestore().collection('users').doc(`${user.uid}`)
    .update({
      name: name
    });
};

export const getFirestoreUser = async (user) => {
  return firestore().collection(`users`)
    .doc(`${user.uid}`)
    .get();
};

export const addTaskToFirebaseUser = async (user, task) => {
  ToastAndroid.show(`Task added to Firestore Document`, ToastAndroid.SHORT);
  const arrayUnion = firestore.FieldValue.arrayUnion(task);
  firestore().collection('users').doc(`${user.uid}`)
    .update({
      tasks: arrayUnion
    });
};

export const removeTaskFromFirebaseUser = async (user, task) => {
  ToastAndroid.show(`Task removed from Firestore Document`, ToastAndroid.SHORT);
  const arrayRemove = firestore.FieldValue.arrayRemove(task);
  firestore().collection('users').doc(`${user.uid}`)
    .update({
      tasks: arrayRemove
    });
};

export const realTimeFirestoreUser = async (user, dispatch, callbackSet) => {
  const unsubscribe = firestore().collection(`users`)
    .doc(`${user.uid}`)
    .onSnapshot(documentSnapshot => {
      console.log(documentSnapshot.get('tasks'))
      dispatch(callbackSet(documentSnapshot.get('tasks')));
    });
  // Stop listening for updates when no longer required
  return () => unsubscribe();
}

export const realTimeFirestoreAllWorkerUsers = (callbackSetUserList, callbackSetIsLoading) => {
  callbackSetIsLoading(true); //callback sets isLoading state to true
  const unsubscribe = firestore().collection(`users`)
    .onSnapshot(collectionSnapshot => {
      const list = [] //for each doc in 'users' collection, push that doc.data() to list
      collectionSnapshot.docs.forEach(user => {
        if (user.data().email !== ADMIN_EMAIL && !list.includes(user)) list.push(user.data());
      });
      callbackSetUserList(list); //callback recieves a list of all users data that are not admins as argument
      callbackSetIsLoading(false); //callback sets isLoading state to false
    });

  // Stop listening for updates when no longer required
  return () => unsubscribe();

}