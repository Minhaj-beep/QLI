import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from '../OnBoarding/Login';
import CreateAccount from '../OnBoarding/CreateAccount';
import TabNavigator from './TabNavigator';
import Profile from '../Profile/Profile';
import ProfileDash from '../Profile/ProfileDash';
import TransactionHistory from '../Transaction/TransactionHistory';
import WithdrawFund from '../Withdraw/WithdrawFund';
import DemoDetails from '../Course/DemoClass/DemoDetails';
import MessageChat from '../Messages/Chat/MessageChat';
import Cart from '../Cart/Cart';
import Notifications from '../Notifications/Notifications';
import PaymentHistory from '../Transaction/PaymentHistory';
import AccountSettings from '../Account/AccountSettings';
import AccountActivity from '../Account/AccountActivity';
import CourseDetails from '../Course/CourseDetails/CourseDetails';
import LCourseDetails from '../Course/LiveCourse/LCourseDetails';
import Assessments from '../Course/Assessments/Assessments';
import GTList from '../Course/LiveCourse/GTList';
import LiveAssessmentList from '../Course/LiveCourse/LiveAssessmentList';

const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerTintColor: 'white',
  headerBackTitle: 'Back',
};

const AuthenticatedStack = () => {
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="ProfileDash"
        component={ProfileDash}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistory}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="WithdrawFund"
        component={WithdrawFund}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="DemoDetails"
        component={DemoDetails}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="MessageChat"
        component={MessageChat}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistory}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="AccountActivity"
        component={AccountActivity}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="CourseDetails"
        component={CourseDetails}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="LCourseDetails"
        component={LCourseDetails}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="Assessments"
        component={Assessments}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="GTList"
        component={GTList}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="LiveAssessmentList"
        component={LiveAssessmentList}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
    </Stack.Navigator>
  );
};

const OnBoardingStack = () => {
  const [isLoggenIn, setIsLoggedIn] = useState(null)
  const getLoggedIn = async () => {
    try{
      let v = await  AsyncStorage.getItem('isLoggedInBefore')
      if(v !== null){
        // console.log(v)
        setIsLoggedIn(v)
        console.log('===========================AsyncStorage.setItem==================', v)
      } else {
        setIsLoggedIn('false')
        console.log('===========================AsyncStorage.setItem==================', v)
      }
    } catch (e){
      console.log('===========================Error==================', e)
    }
  }
  getLoggedIn()
  return (
    <>
      {
        isLoggenIn !== null ?
        <Stack.Navigator initialRouteName={isLoggenIn !== 'true' ? "CreateAccount" : "Login"}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CreateAccount"
            component={CreateAccount}
            options={{headerShown: false}}
            screenOptionStyle={screenOptionStyle}
          />
        </Stack.Navigator>
        : <></>
      }
    </>
  );
};

export {AuthenticatedStack, OnBoardingStack};
