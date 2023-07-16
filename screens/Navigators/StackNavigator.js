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
import NotificationsManagement from '../Notification Management/NotificationManagement';
import LiveVideos from '../Course/LiveVideos/LiveVideos';
import PayoutInfo from '../PayoutInfo/PayoutInfo';
import PayoutList from '../PayoutInfo/PayoutList';
import Chapters from '../Course/Chapters';
import Lessons from '../Course/Lessons';
import LessonDetails from '../Course/LessonDetails';
import GTStart from '../Course/LiveCourse/GTStart';
import LiveClass from '../Course/LiveClass/LiveClass';
import GoLive from '../Course/LiveCourse/GoLive';
import DemoChat from '../Course/CourseDetails/DemoChat';
import DemoClass from '../DemoClass/DemoClass';
import ViewDemoClass from '../DemoClass/ViewDemoClass';
import CourseDiscount from '../Discount/CourseDiscount';
import GoDemoLive from '../DemoClass/GoDemoLive';
import MyCourses from '../MyCourses/MyCourses';
import StudentPreview from '../Course/CourseDetails/StudentPreview';
import MyAssessment from '../MyAssessments/MyAssessments';
import PurchaseList from '../PurchaseList/PurchaseList';
import AssessmentsStudentPreview from '../Course/CourseDetails/components/AssessmentsStudentPreview';
import Promotion from '../PushNotificationScreens/Promotion';
import Subscription from '../PushNotificationScreens/Subscription';
import CourseCompletion from '../PushNotificationScreens/CourseCompletion';
import ViewCourse from '../PushNotificationScreens/ViewCourse';

import { useSelector } from 'react-redux';

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
      <Stack.Screen
        name="NotificationsManagement"
        component={NotificationsManagement}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="LiveVideos"
        component={LiveVideos}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="PayoutInfo"
        component={PayoutInfo}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="PayoutList"
        component={PayoutList}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="Chapters"
        component={Chapters}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="Lessons"
        component={Lessons}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="LessonDetails"
        component={LessonDetails}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="GTStart"
        component={GTStart}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="LiveClass"
        component={LiveClass}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="GoLive"
        component={GoLive}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="DemoChat"
        component={DemoChat}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="DemoClass"
        component={DemoClass}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="ViewDemoClass"
        component={ViewDemoClass}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="CourseDiscount"
        component={CourseDiscount}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="GoDemoLive"
        component={GoDemoLive}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="MyCourses"
        component={MyCourses}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="StudentPreview"
        component={StudentPreview}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="MyAssessment"
        component={MyAssessment}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="PurchaseList"
        component={PurchaseList}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="AssessmentsStudentPreview"
        component={AssessmentsStudentPreview}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="Promotion"
        component={Promotion}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="Subscription"
        component={Subscription}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="CourseCompletion"
        component={CourseCompletion}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
      <Stack.Screen
        name="ViewCourse"
        component={ViewCourse}
        options={{headerShown: false}}
        screenOptionStyle={screenOptionStyle}
      />
    </Stack.Navigator>
  );
};

const OnBoardingStack = () => {
  const isLoggedinBefore = useSelector(state => state.Auth.IsLoggedInBefore);
  return (
    <>
      {
        !isLoggedinBefore ?
        <Stack.Navigator initialRouteName={"CreateAccount"}>
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
        : 
        <Stack.Navigator initialRouteName={"Login"}>
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
      }
    </>
  );
};

export {AuthenticatedStack, OnBoardingStack};
