import {
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  View,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider, extendTheme, Modal, VStack, Image, Text, Button, ScrollView} from 'native-base';
import {
  AuthenticatedStack,
  OnBoardingStack,
} from './screens/Navigators/StackNavigator';
import {store} from './screens/Redux/store';
import {Provider, useSelector, useDispatch} from 'react-redux';
import 'react-native-reanimated';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PushNotification from 'react-native-push-notification'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLoggedIn, setLoading, setIsLoggedInBefore } from './screens/Redux/Features/authSlice';
const {width, height} = Dimensions.get('window');

const theme = extendTheme({
  colors: {
    primary: {
      50: '#395061',
      100: '#364b5b',
      600: '#395061',
    },
    secondary: {
      50: '#F0E1EB',
    },
    amber: {
      400: '#d97706',
    },
    white: {
      100: '#FFFFFF',
    },
    greyScale: {
      400: '#FCFCFC',
      600: '#F3F3F3',
      800: '#8C8C8C',
    },
    green: {
      100: '#29D363',
    },
    error: {
      100: '#F65656',
    },
    warning: {
      100: '#FFBE40',
    },
  },
});
// Auth Validation
const RootNavigation = () => {
  const dispatch = useDispatch()
  const Loading = useSelector(state => state.Auth.Loading);
  const LoggedIn = useSelector(state => state.Auth.LoggedIn);
  const GUser = useSelector(state => state.Auth.GUser);
  const User_ID = useSelector(state => state.Auth.User_ID);
  const JWT = useSelector(state => state.Auth.JWT);
  const email = useSelector(state => state.Auth.Mail);
  const [timerId, setTimerId] = useState(null);
  const [showModal, setShowModal] = useState(null);
  // console.log('__________________Google user____________________', User_ID, JWT, email)


  // Checking every time when the user login status or user type (Google user/ Normal user) changes
  useEffect(()=>{
    if(!GUser && LoggedIn) { // calling a timer if the user is logged in and not logged in with google
      console.log('_______________________SET TIMER_____________________________')
      onFocus()
    }
    else if (!LoggedIn) { // stopping the timer when the user logs out
      console.log('_______________________KILL TIMER_____________________________')
      onBlur()
    }
  },[GUser, LoggedIn])

  // calling a function to check the user if or if not logged in on an another device or browser every after 5 sec
  const onFocus = () => {
    const intervalId = setInterval(() => {
      // console.log('Game on________________________________________________');
      checkValidToken()
    }, 5000);
    setTimerId(intervalId);
  };

  // function to stop the timer that has been starting from login
  const onBlur = () => {
    console.log('Bye__________________________________________________')
    clearInterval(timerId);
  };

  // function to check vaild user
  const checkValidToken = async () => {
    const requestOptions = {
      method: 'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': User_ID,
      }
    }
    fetch('https://api.dev.qlearning.academy/getCoursebyInstructor', requestOptions)
    .then(response => response.json())
    .then(result => {
      if(result.message === "Token is Not Valid" && result.status === 500){
        setShowModal(true)
      }
    })
  }

  // clearning local storage 
  const ClearLocalStorage = async () => {
    try {
      await AsyncStorage.clear();
      await AsyncStorage.setItem('isLoggedInBefore', 'true')
    } catch (e) {
      alert('Local storage error: ' + e);
    }
  };

  // Main function to logout 
  const logOutFromCurrentDevice = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': JWT,
        type: 'text',
      },
      body: JSON.stringify({
        email: email,
        userType: 'INSTRUCTOR',
      }),
    };

    await fetch('https://api.dev.qlearning.academy/logout', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log('Has the user logged out ??????? ', result)
    })
  }

  // Handling actions if the user is logged to another device/browser
  const logout = () => {
    dispatch(setLoading(true));
    dispatch(setLoggedIn(false));
    dispatch(setIsLoggedInBefore(true));
    ClearLocalStorage();
    dispatch(setLoading(false));
    logOutFromCurrentDevice()
    setShowModal(false)
  }

  PushNotification.configure({
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
      alert(notification.data.from)
      let data = JSON.parse(notification.data.app)
      console.log(data.courseCode, data.type)
      // notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    onAction: function (notification) {
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATION:", notification);
    },

    onRegistrationError: function(err) {
      console.error(err.message, err);
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  return (
    <NavigationContainer>
        <GestureHandlerRootView style={{flex: 1}}>
          <StatusBar animated={true} backgroundColor="#F1F1F1" barStyle="dark-content" />

          {/* Modal for asking the user to login again */}
          <Modal isOpen={showModal}>
            <Modal.Content maxWidth="700px">
              <Modal.Body>
                <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5} justifyContent="center" alignItems="center">
                  <Image source={require('./assets/ACSettings/DeleteAccount.png')} resizeMode="contain" size="md" alt="successful" />
                  <Text fontWeight="bold" color={'red.400'} fontSize="17">Please try to re-login</Text> 
                  <Text fontWeight="bold" textAlign={'center'} style={{color:"#000"}} fontSize="14">You are already logged in on another device or browser!</Text> 
                  <Button 
                    bg={'red.400'}
                    colorScheme="blueGray"
                    style={{paddingTop:10,paddingBottom:10,paddingLeft:40, paddingRight:40}}
                    _pressed={{bg: "#fcfcfc",
                      _text:{color: "#3e5160"}
                      }}
                      onPress={()=>
                        logout()
                      }
                      >
                    OK 
                  </Button>
                </VStack>
              </Modal.Body>
            </Modal.Content>
          </Modal>

          {LoggedIn ? <AuthenticatedStack /> : <OnBoardingStack />}
          {Loading ? (
            <View style={styles.loading}>
              <ActivityIndicator
                size="large"
                color="#364b5b"
                style={styles.loader}
              />
            </View>
          ) : null}
        </GestureHandlerRootView>
    </NavigationContainer>
  );
};

const App = () => {

  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <RootNavigation />
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F3F3',
    opacity: 0.5,
  },
  loader: {
    position: 'absolute',
  },
});
