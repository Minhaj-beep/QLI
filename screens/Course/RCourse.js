import { View,Dimensions,StyleSheet,TouchableOpacity,ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HStack, Text } from 'native-base';
const { width, height } = Dimensions.get('window')
import {useDispatch,useSelector} from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import RcCard from './RcCard';
import DemoCard from './DemoCard';
import {setCCThumbImg,setCCIntroVideo,setCCOverview,setCCFAQ,setLoading,setSingleCD} from '../Redux/Features/userDataSlice'


export default function RCourse({navigation}) {
  const dispatch = useDispatch();

//   const Jwt_Token = useSelector(state => state.login.JWT);
  const email = useSelector(state => state.Auth.GUser);
  // const email = 'sushmitha.maneesh08@gmail.com';
//   const name = useSelector(state => state.Auth.GUser);
  const CourseR = useSelector(state => state.UserData.CourseData);
  const BaseURL = useSelector(state => state.UserData.BaseURL)
  const [CourseData, setLCourseData] = useState()

  const [CTab, setCTab] = useState(true);
  const [DTab, setDTab] = useState(false);
  // console.log(CourseR)
  useEffect(()=>{
    if(CourseR.length != 0){
      setLCourseData(CourseR)
    }
  })
  const getCourseOverview = (courseCode) =>{
    const API = BaseURL+'getCourseOverview/?courseCode='+courseCode;
    if( courseCode ===''){
      console.log('Something went wrong, please Login again');
    }else{
      const requestOptions = {
        method: 'GET',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'gmailUserType':'INSTRUCTOR',
          'token':email
        },
      }
      // console.log(requestOptions);
      fetch(API, requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.status === 200)
          {
            const over = result.data[0]
            // console.log(over);
            dispatch(setCCOverview(over));
          }else if(result.status > 200){
            // alert('Error: ' + result.message);
            console.log(result.message);
          }
        }).catch(error =>{
          console.log(error)
          // alert('Error: ' + error);
        })
    }
    
  };

  const getCourseFAQ =(courseCode) => {
    const API = BaseURL+'getAllFaq/?courseCode='+courseCode
    if(courseCode === ''){
      console.log('Something went wrong');
    }else{
      const requestOptions = {
        method:'GET',
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'x-auth-token':Jwt_Token,
        // },
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'gmailUserType':'INSTRUCTOR',
          'token':email
        },
      }
      fetch(BaseURL+'getAllFaq/?courseCode='+courseCode, requestOptions)
      .then(response => response.json())
      .then(result => {
        if(result.status === 200){
                const f = result.data[0]
                const faq = f.faqList
                dispatch(setCCFAQ(faq))
                console.log('update FAQ')
              }else if(result.status > 200){
                // alert('Error' + result.messsage)
                console.log(result.message)
              } 
      })
      .catch(error => {
        console.log('error', error)
        // alert('Error:' + error);
      });
        }
      }

  const VRender = () => {
    return CourseData.map((data, index) => {
      const courseD = { 
        data:data,
        navigation:navigation,
      }
      console.log(data.isDemo)
      return(
        <View key={index} style={styles.RCList}>
          <TouchableOpacity onPress={() => {
            dispatch(setLoading(true));
            dispatch(setSingleCD(data))
            getCourseOverview(data.courseCode);
            getCourseFAQ(data.courseCode);
            dispatch(setCCThumbImg(data.thumbNailImagePath)) 
            dispatch(setCCIntroVideo(data.introVideoPath))
            navigation.navigate('CourseDetails')
            dispatch(setLoading(false))
          }}>
            <RcCard props={courseD}/>
          </TouchableOpacity>
        </View>
      )
    })
  };

  const CRender = () =>{
    return(
      <View>
        {CourseData ? <VRender/> : <Text style={{fontSize:12, color:'#8C8C8C'}}>Currently you don't have any courses</Text>}
      </View>
    )
  }

  const DCRender = ({navigation}) => {
    return(
      <TouchableOpacity 
      onPress={() => navigation.navigate('DemoDetails')}
      >
        <DemoCard navigation={navigation}/>
      </TouchableOpacity>
    )
  }
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ alignItems: 'center'}}>
        <HStack space={3} mt={5} style={styles.TRC} borderWidth={1}>
          <TouchableOpacity
            onPress={()=>{
              setCTab(true)
              setDTab(false)
            }}
          >
            <Text style={CTab ? styles.TAButton : styles.TButton}>Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{
              setCTab(false)
              setDTab(true)
            }}
          >
            <Text style={DTab ? styles.TAButton : styles.TButton}>Demo Courses</Text>
          </TouchableOpacity>
          </HStack>
        <ScrollView style={{ marginBottom:150, marginTop:20}} nestedScrollEnabled={true}>
          {CTab ? <CRender/> : <DCRender/>}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#F3F3F3',
    height:height,
    // paddingLeft:10,
    // paddingRight:10,
    width:width,
  },
  RCList:{
    marginTop: 10
  },
  TButton:{
    color:'#364b5b',
    fontSize:14,
    paddingLeft:15,
    paddingRight:15,
    paddingTop:5,
    paddingBottom:5,
  },
  TRC:{
    borderRadius: 10,
    borderColor:'#FFFFFF',
    backgroundColor:'#F9F9F9'
  }, 
  TAButton:{
    color:'#364b5b',
    backgroundColor:'#FFFFFF',
    borderRadius:10,
    fontSize:15,
    paddingLeft:15,
    paddingRight:15,
    paddingTop:5,
    paddingBottom:5,
  }
})