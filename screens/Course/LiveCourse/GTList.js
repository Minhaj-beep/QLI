import {View, Dimensions, ScrollView, TouchableWithoutFeedback, StyleSheet,TouchableOpacity} from 'react-native';
import {useState,useEffect,React} from 'react';
import {Button,VStack,useToast, HStack,Text,Divider } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import LVStarted from './components/LVStarted'
import PLVStarted from './components/PLVStarted';
import { setLoading } from '../../Redux/Features/userDataSlice';
import { setCurrentLiveCourseCode } from '../../Redux/Features/CourseSlice';

const { width, height } = Dimensions.get('window');

const GTList = ({navigation}) => {

    const dispatch = useDispatch()

    const BaseURL = useSelector(state => state.UserData.BaseURL);
    const SingleCD = useSelector(state => state.Course.SingleLiveCourse);
    const email = useSelector(state => state.Login.email);
    
    const [PreviousData, setPreviousData] = useState();
    const [UpcomingData, setUpcomingData] = useState();

    useEffect(()=>{
        GetPreviousData()
        GetUpcomingData()
    },[])

    const GetUpcomingData = () =>{
        dispatch(setLoading(true))
        const API = BaseURL+'getScheduledLiveCourseClass?courseCode='+SingleCD.courseCode;
        let requestOptions ={
            method:'GET',
            headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'gmailUserType':'INSTRUCTOR',
              'token':email
            }
          }
        
        fetch(API, requestOptions)
        .then(res => res.json())
        .then(result => {
            if(result.status === 200){
                setUpcomingData(result.data)
                dispatch(setCurrentLiveCourseCode(SingleCD.courseCode))
                console.log("data =========", Object.keys(result.data).length)
                // console.log("data =========", result.data)
                dispatch(setLoading(false))
            }else if(result.status > 200){
                console.log(result.message)
                dispatch(setLoading(false))
            }
        })
        .catch(error => {
            // alert('Error: '+error)
            console.log(error)
            dispatch(setLoading(false))
        })
      } 
      console.log('Single couse data: ' +SingleCD.courseCode)
    //   SingleCD.map((i)=>console.log(i))

    const GetPreviousData = () =>{
        dispatch(setLoading(true))
        const API = BaseURL+'getCompletedLiveCourseClass?courseCode='+SingleCD.courseCode;
        let requestOptions ={
            method:'GET',
            headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'gmailUserType':'INSTRUCTOR',
              'token':email
            }
          }
        
        fetch(API, requestOptions)
        .then(res => res.json())
        .then(result => {
            if(result.status === 200){
                setPreviousData(result.data)
                console.log('hello data : ', Object.keys(result.data).length)
                dispatch(setLoading(false))
            }else if(result.status > 200){
                console.log(result.message)
                // alert(result.message)
                dispatch(setLoading(false))
            }
        })
        .catch(error => {
            console.log('Error: '+error)
            // alert(error)
            dispatch(setLoading(false))
        })
      } 

    const AppBarContent = {
        title: 'Live Videos',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
      }

    const PCRender = () => {
        if(Object.keys(PreviousData).length > 0) {
            return PreviousData.map((data, index)=>{
                // const LVdata = {
                //     data:data,
                //     navigation: navigation
                // }
                return(
                    <View key={index}>
                    <PLVStarted props={data} />
                    </View>
                )
            })
        } else {
            return (
                <View style={{width:"100%", alignItems:"center"}}>
                    <Text style={{fontSize:11,color:'#8C8C8C' }}>No previous live classes found!</Text>
                </View>
            )
        }
    }

    const UCRender = () => {
        if(Object.keys(UpcomingData).length > 0){
            return UpcomingData.map((data, index)=>{
                const LVdata = {
                    data:data,
                    navigation: navigation
                }
                return(
                    <View key={index}>
                    <LVStarted props={LVdata} />
                    </View>
                )
            })
        } else {
            return (
                <View style={{width:"100%", alignItems:"center"}}>
                    <Text style={{fontSize:11,color:'#8C8C8C' }}>No upcoming live classes found!</Text>
                </View>
            )
        }
    }

  return (
    <SafeAreaView>
        <AppBar props={AppBarContent}/>
        <ScrollView style={styles.TopContainer}>
            <VStack style={{marginTop:10}} space={5}>
               <VStack space={4}>
                <Text style={{fontSize:14, fontWeight:'bold'}} color='primary.100'>Upcoming Classes</Text>
                <VStack>
                    {UpcomingData ? <UCRender/> :null}
                </VStack>
               </VStack>

               <VStack  space={4}>
                <Text style={{fontSize:14, fontWeight:'bold'}} color='primary.100'>Previous Classes</Text>
                <VStack>
                    {PreviousData ? <PCRender/> :null}
                </VStack>
               </VStack>
            </VStack>
        </ScrollView>
    </SafeAreaView>
  )
}

export default GTList

const styles = StyleSheet.create({
    TopContainer:{
        margin:15
    }
})