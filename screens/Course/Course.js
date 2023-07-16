import React,{useEffect} from 'react';
import {View, Dimensions, ScrollView, TouchableWithoutFeedback, StyleSheet,TouchableOpacity,Text,useWindowDimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../components/Navbar';
import {Box} from 'native-base';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RCourse from './RCourse';
import LCourse from './LCourse';
import AssessmentTab from './AssessmentTab';
import {setIAssessmentList} from '../Redux/Features/CourseSlice';
import {useDispatch,useSelector} from 'react-redux';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window')

const Tab = createMaterialTopTabNavigator();

const Courses = ({navigation, route}) => {

  const dispatch = useDispatch();
  const email = useSelector(state => state.Auth.GUser);
  const BaseURL = useSelector(state => state.UserData.BaseURL)
  let selectedTab = route.params && route.params.hasOwnProperty('initialTab') ? route.params.initialTab : 'RCourse'
  // const JWT = useSelector(state => state.Auth.JWT);
  // console.log(JWT)

  useEffect(() => {
    if (route.params &&  route.params.hasOwnProperty('initialTab')) {
      // Set the target tab as the initial route
      navigation.jumpTo( route.params.initialTab);
    }
  }, [route.params]);


  const GetIAssessment = () =>{
    const API = BaseURL+'getAssessmentbyEmail'
    var requestOptions = {
      method:'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'gmailUserType':'INSTRUCTOR',
        'token':email
      }
    }

    fetch(API, requestOptions)
    .then(response => response.json())
    .then(result => {
      if(result.status === 200){
        dispatch(setIAssessmentList(result.data))
      }else{
        console.log(result.message)
      }
    }).catch(error => {
      console.log(error)
      // alert('CError:'+error)
    })
  }
  const AppBarContent = {
    title: 'Courses',
    navigation: navigation,
    ArrowVisibility: false,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  const screenProps = route.params && route.params.hasOwnProperty('initialTab') ? route.params.screenProps : {};

  return (
  <View style={styles.container}>
    <SafeAreaView>
    <AppBar props={AppBarContent}/>
      <ScrollView nestedScrollEnabled={true}>
        <View>
          <Tab.Navigator
            initialRouteName={selectedTab}
            screenOptions={{
              tabBarLabelStyle:{fontSize:12, color:'#3e5160', fontWeight:'bold'},
              tabBarStyle:{backgroundColor:'#F3F3F3'},
              swipeEnabled: true,
              tabBarScrollEnabled: true,
              tabBarItemStyle: { width: width / 3 },
            }}
            style={{height:height}}
            screenProps={screenProps}
          >
            <Tab.Screen 
              name="RCourse" 
              component={RCourse}
              options={{ tabBarLabel: 'Recorded Course' }}
            />
            <Tab.Screen 
              name="LCourse" 
              component={LCourse}
              options={{ tabBarLabel: 'Live Course' }}
            />
            <Tab.Screen 
              name="AssessmentTab"
              options={{ tabBarLabel: 'Assessment' }}
            >
              {() => <AssessmentTab screenProps={screenProps} />}
            </Tab.Screen>
          </Tab.Navigator>
        </View>
        </ScrollView>
      </SafeAreaView>
  </View>
  )
}

export default Courses

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F3F3'
  },
})