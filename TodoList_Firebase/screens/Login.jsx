import React, { useState } from 'react'
import { Button, Dimensions, TextInput, View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/database';
import { addUser } from '../reducers/currentUserSlice';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigator = useNavigation();

  const saveUser = (user) => {
    const { email, uid, displayName } = user;
    dispatch(addUser({ email, uid, displayName, role: 'admin' }));
  }

  //Logout user
  const logoutUser = () => {
    auth().signOut().then(() => {
      console.log('User signed out!');
    });
  };

  const createUserInFirebaseDatabase = (user) => {
    let userToSave = { email, uid, displayName, role: '' };
    const { email, uid, displayName } = user;
    if (email=== 'admin@gmail.com') {
      Alert.alert("Admin added to database")
      userToSave = { email, uid, displayName, role: 'admin' };
    }
    else {
      userToSave = { email, uid, displayName, role: 'user' };
      Alert.alert(" added to database")
    }
    //let userToSave = { email, uid, displayName, role: 'admin' };
    // 'https://shiftapp-9b217-default-rtdb.europe-west1.firebasedatabase.app/'
    firebase.app().database('https://shiftapp-8535b-default-rtdb.europe-west1.firebasedatabase.app/')
      .ref(`/users/${uid}`)
      .set(userToSave).then(() => {
        console.log('User added!');
        navigator.navigate('Auth');
      }).catch((error) => {
        console.log(error);
      });
  };

  const loginUser = (email, password) => {
    setIsLoading(true);
    console.log("parte 1")
    auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("parte 2");
        saveUser(userCredential.user);
        setIsLoading(false);
        setError('');
        navigator.navigate('Auth');
      })
      .catch((error) => {
        console.log("login falhou:  " + error);
        auth().createUserWithEmailAndPassword(email,password)
          .then((userCredential) => {
            saveUser(userCredential.user);
            setIsLoading(false);
            setError('');
            console.log("pas");
            createUserInFirebaseDatabase(userCredential.user);
          })
          .catch(error => {
            setIsLoading(false);
            setError(error.message);
          });
      });
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        label='Email Address'
        placeholder='example@gmail.com'
        value={email}
        onChangeText={email => setEmail(email)}
        autoCapitalize={'none'}
      />

      <TextInput
        label='Password'
        placeholder='enter password'
        value={password}
        onChangeText={password => setPassword(password)}
        secureTextEntry
      />
      {
        isLoading ?
          <ActivityIndicator
            size='large'
            color='#0F5340'
            style={{marginBottom: 80}}
          /> :
          <Button
            onPress={() => loginUser(email, password)}
            title={'Sign In'}
          />
      }
      { error && <Text style={styles.error}>{error}</Text> }
      <Button style={styles.logout_button} title="Logout" onPress={logoutUser} />
    </View>
  )
}

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#EFEFEF',
    height: height - 80,
    width: width,
    marginTop: 80,
    paddingVertical: height / 25,
    paddingHorizontal: width / 20,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  error: {
    color: 'red',
    marginTop: 20
  }
})

export default Login;
