import {firebase} from '@react-native-firebase/database';

export const firestoreGetCollection = () => {
  return Promise.resolve(
    firebase
      .app()
      .database(
        'https://shiftapp-8535b-default-rtdb.europe-west1.firebasedatabase.app/',
      ),
  );
};
