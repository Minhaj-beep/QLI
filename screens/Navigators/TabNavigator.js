import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'native-base';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../Home';
import Search from '../Search/Search';
import Messages from '../Messages/Messages'
import Course from '../Course/Course'
import Learners from '../Learners/Learners';


const Img01 = require("../../assets/BottomNav/01.png");
const Img02 = require("../../assets/BottomNav/02.png");
const Img03 = require("../../assets/BottomNav/03.png");
const Img04 = require("../../assets/BottomNav/04.png");

const Img11 = require("../../assets/BottomNav/11.png");
const Img12 = require("../../assets/BottomNav/12.png");
const Img13 = require("../../assets/BottomNav/13.png");
const Img14 = require("../../assets/BottomNav/14.png");

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerTintColor: 'white',
  headerBackTitle: 'Back',
};


const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: "#395061",
        tabBarInactiveTintColor: "#8C8C8C",
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: "Dashboard",
          // tabBarShowLabel:true,
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                resizeMode={"contain"}
                source={focused ? Img11 : Img01}
                alt="nav"
                style={focused ? styles.NavImg : styles.NavImgActive}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Courses"
        component={Course}
        options={{
          headerShown: false,
          tabBarLabel: "Courses",
          // tabBarShowLabel:false,
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                resizeMode={"contain"}
                source={focused ? Img12 : Img02}
                alt="nav"
                style={focused ? styles.NavImg : styles.NavImgActive}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Learners"
        component={Learners}
        options={{
          headerShown: false,
          tabBarLabel: "Learners",
          // tabBarShowLabel:false,
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                resizeMode={"contain"}
                source={focused ? Img13 : Img03}
                alt="nav"
                style={focused ? styles.NavImg : styles.NavImgActive}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          headerShown: false,
          tabBarLabel: "Messages",
          // tabBarShowLabel:false,
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                resizeMode={"contain"}
                source={focused ? Img14 : Img04}
                alt="nav"
                style={focused ? styles.NavImg : styles.NavImgActive}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  NavImg: {
    height: 60,
    width: 60,
    marginBottom: 5,
  },
  NavImgActive: {
    height: 25,
    width: 25,
  },
});
