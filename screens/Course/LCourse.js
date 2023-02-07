import { View, Text,Dimensions,StyleSheet,TouchableOpacity,ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Container,HStack,VStack,Image,Center } from 'native-base';
const { width, height } = Dimensions.get('window')
import {useDispatch,useSelector} from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import LcCard from './LcCard';
import {setSingleLiveCourse} from '../Redux/Features/CourseSlice'
import { setLiveAssessmentList } from '../Redux/Features/CourseSlice';

const LCourse = ({navigation}) => {

  const dispatch = useDispatch();

//   const Jwt_Token = useSelector(state => state.login.JWT);
  const email = useSelector(state => state.Login.email);
  const name = useSelector(state => state.Login.Name);
  const liveCourseL = useSelector(state => state.Course.LiveCourses);
  const BaseURL = useSelector(state => state.UserData.BaseURL)
  const [liveCourseData, setLiveCourseData] = useState()
  console.log(liveCourseL)

  useEffect(()=>{
    if(liveCourseL.length != 0){
      setLiveCourseData(liveCourseL)
    }
  })

  const getLiveCourse = () =>{
    const API = BaseURL+'getLiveCoursebyInstructor';

    if(email === ''){
      alert('Something went wrong, please try again later');
    }else{
      var requestOptions = {
        method:'GET',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'gmailUserType':'INSTRUCTOR',
          'token':email
        },
      }
      fetch(API, requestOptions)
        .then(response => response.json())
        .then(result => {
          // console.log('Got LiveData')
          setLiveData(result)
          
        })
    }

  }

  const VRender = () =>{
    return liveCourseData.map((data,index) =>{
      const courseD ={
        data:data,
        navigation:navigation
      }
      // console.log(courseD.courseCode)
      return(
        <View key={index}>
          <TouchableOpacity style={styles.LcCard}
            onPress={()=>{
              dispatch(setSingleLiveCourse(data))
              console.log('helooooooooooooooo: ', Object.keys(data.assesmentList).length)
              dispatch(setLiveAssessmentList(data.assesmentList))
              console.log('data ==================>', Object.keys(data.assesmentList).length, ' assesment for class code ', data.courseCode)
              // data.assesmentList.map((i)=>{
              //   console.log('data ==================>', i.assessmentDetails)
              // })
              navigation.navigate('LCourseDetails')
            }}
          >
              <LcCard props={courseD}/>
          </TouchableOpacity>
        </View>
      )
    })
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ alignItems: 'center'}} >
        <ScrollView style={{ marginBottom:150}} nestedScrollEnabled={true}>
          {liveCourseData ? <VRender/> : 
              <Text style={{fontSize:12, marginTop:"10%", color:'#8C8C8C'}}>Currently you don't have any courses</Text>
          }
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default LCourse

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#F3F3F3',
      height:height,
      paddingLeft:10,
      paddingRight:10,
      paddingBottom:10
      },
      LcCard:{
        marginTop:10
      }
})