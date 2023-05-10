import { Text, View, ScrollView } from "native-base"
import React from "react"
import AppBar from "../components/Navbar"
import { useSelector, useDispatch } from "react-redux"
import LcCard from "../Course/LcCard"
import RcCard from "../Course/RcCard"
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native"
import { setSingleLiveCourse, setLiveAssessmentList } from "../Redux/Features/CourseSlice"
import { setCCThumbImg, setCCIntroVideo, setSingleCD } from "../Redux/Features/userDataSlice"
import { setLoading } from "../Redux/Features/authSlice"
const { width, height } = Dimensions.get('window')

const MyCourses = ({navigation}) => {
    const AppBarContent = {
        title: 'My Courses',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
    }

    const dispatch = useDispatch()
    const liveCourseL = useSelector(state => state.Course.LiveCourses)
    const CourseR = useSelector(state => state.UserData.CourseData)

    const RenderRecordedCourses = () => {
        return CourseR.map((data, index) => {
            const courseD = { 
              data:data,
              navigation:navigation,
            }
            return(
              <View key={index} style={styles.RCList}>
                <TouchableOpacity onPress={() => {
                  dispatch(setLoading(true));
                  dispatch(setSingleCD(data))
                //   getCourseOverview(data.courseCode);
                //   getCourseFAQ(data.courseCode);
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
    }

    const RenderLiveCourses = () => {
        return liveCourseL.map((data,index) =>{
            const courseD ={
              data:data,
              navigation:navigation
            }
            return(
              <View key={index} >
                <TouchableOpacity style={styles.LcCard}
                  onPress={()=>{
                    dispatch(setSingleLiveCourse(data))
                    console.log('helooooooooooooooo: ', Object.keys(data.assesmentList).length)
                    dispatch(setLiveAssessmentList(data.assesmentList))
                    console.log('data ==================>', Object.keys(data.assesmentList).length, ' assesment for class code ', data.courseCode)
                    // getCourseOverview(data.courseCode)
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
            <AppBar props={AppBarContent}/>
              <ScrollView nestedScrollEnabled={true}>
                <View style={{width:width*0.88, flex:1, alignSelf:"center"}}>
                    <Text style={{fontSize:14, fontWeight:"bold", color:'#8C8C8C'}}>Recorded courses</Text>
                    {Object.keys(CourseR).length > 0 ? <RenderRecordedCourses/> : 
                        <Text style={{fontSize:12, alignSelf:"center", marginTop:"10%", color:'#8C8C8C'}}>Currently you don't have any recorded courses</Text>
                    }
                    <Text style={{marginTop:15, fontSize:14, fontWeight:"bold", color:'#8C8C8C'}}>Live courses</Text>
                    {Object.keys(liveCourseL).length > 0 ? <RenderLiveCourses/> : 
                        <Text style={{fontSize:12, alignSelf:"center", marginTop:"10%", color:'#8C8C8C'}}>Currently you don't have any live courses</Text>
                    }
                </View>
              </ScrollView>
        </View>
    )
}

export default MyCourses

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#F3F3F3',
        flex:1,
        width:width,
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:10
    },
    LcCard:{
        marginTop:10
    },
    RCList:{
        marginTop: 10
    },
})