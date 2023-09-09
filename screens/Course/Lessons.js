import { StyleSheet, Text, View,ScrollView,Dimensions } from 'react-native';
import React from 'react';
import AppBar from '../components/Navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack,Icon, IconButton } from 'native-base';
import LCard from './Lessons/LCard';
import {useDispatch,useSelector} from 'react-redux';
import { useEffect,useState } from 'react';

const { width, height } = Dimensions.get('window')

const Lessons = ({navigation}) => {

    // const SingleCD = useSelector(state => state.UData.SingleCD);
    const LessonData = useSelector(state => state.UserData.LessonData);
    const Assessment = useSelector(state => state.Course.Assessment);
    const BaseURL = useSelector(state => state.UserData.BaseURL)
    
    const [PTitle, setPTitle] = useState(' ');
    // const [LeData, setLeData] = useState(null);
    const LeData = LessonData.lessonList
    // const email = useSelector(state => state.login.email);
    // const courseCode = SingleCD.courseCode;
    console.log(LessonData.ChapterName)
  
    useEffect(() => {
        // getAllLessons()
        if(Assessment === true){
            setPTitle('Assessments')
        }else{
            setPTitle('Lessons')
        }
    },[])

    
//  const getAllLessons = () =>{
//     if(LessonData.courseCode != '' || LessonData.order != ''){
//         const API = BaseURL+'getLessonbyCourse?courseCode='+LessonData.courseCode+'&chapterOrder='+LessonData.order;
//         const requestOptions ={
//             method:'GET',
//             headers:{
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'gmailUserType':'INSTRUCTOR',
//                 'token':email
//               },
//         }
//         console.log(API)
//         fetch(API, requestOptions)
//             .then(response => response.json())
//             .then(result => {
//                 if(result.status === 200){
//                     // console.log(result.data.lessonList)
//                    setLeData(result.data.lessonList)
//                 }else if(result.status > 200){
//                     console.log(result)
//                     alert(result.message)
//                 }
//             }).catch(error =>{
//                 console.log(error)
//                 alert('Error exception: ' + error)
//             })
//     }
//  }


    const AppBarContent = {
        title: PTitle,
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
      }

      const LItem = () => {
        return LeData.map((data,index) =>{
            const LData = {
                data:data,
                navigation: navigation,
            }
            // console.log(data)
            return(
                <View key={index}>
                    <LCard props={LData}/>
                </View>
            )
        })
      }

  return (
    <View style={styles.TopContainer}>
        <ScrollView>
            <View>
                <AppBar props={AppBarContent}/>
                <VStack style={styles.Container} m={5}>
                   { Assessment ? <Text style={styles.Notice} >Assessments of {LessonData.ChapterName}</Text>
                    : <Text style={styles.Notice} >Lessons of {LessonData.ChapterName}</Text>}

                    { LeData != null && LItem()}
                    {/* <LCard/> */}
                </VStack>    
            </View>
        </ScrollView>
    </View>
  )
}

export default Lessons

const styles = StyleSheet.create({
    TopContainer:{
        flex: 1,
        top: 0,
        backgroundColor:'#f5f5f5',
        height:height,
        width:width,
    },
    Container:{
        // margin:10
        // paddingLeft:20,
        // paddingRight:20,
        // paddingTop:30,
        // paddingBottom:20
    },
    Notice:{
        fontSize:11,
        alignSelf:'center', 
        backgroundColor:'#f0e1eb', 
        color:"#364b5b",
        padding:10, 
        borderRadius:4,
        width:width/1.1,
        marginBottom:15,
        maxWidth:width/1
    }
})