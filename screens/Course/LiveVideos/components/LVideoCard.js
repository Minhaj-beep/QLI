import {View, Dimensions, ScrollView, Linking, TouchableWithoutFeedback, StyleSheet,TouchableOpacity,Text} from 'react-native';
import {useState,useEffect, useCallback, React} from 'react';
import {Image,VStack, HStack,Icon,Divider,Button } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useDispatch,useSelector} from 'react-redux';
import CountDown from 'react-native-countdown-component';
import CountDownTimer from 'react-native-countdown-timer-hooks'
import { setLiveClassD } from '../../../Redux/Features/CourseSlice';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
// import { setLiveClassData } from '../redux-toolkit/features/courseSlice';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

const LVideoCard = ({props}) => {
    const setLiveClassData = setLiveClassD

    const dispatch = useDispatch();

    const [LStarted, setLStarted] = useState(false);
    const [cameraPermissionStatus, setCameraPermissionStatus] = useState(null);
    const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState(null); 
    const [ CDSeconds, setCDSeconds] = useState();
    const BaseURL = useSelector(state => state.UserData.BaseURL)
    const liveStatus = props.data.liveStatus;
    const Sdate = props.data.date;
    const email = useSelector(state => state.Login.email);
    const CourseCode = useSelector(state => state.UserData.SingleCD.courseCode);

    const navigation = props.navigation;
    const data = props.data;
    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'-');
    console.log(utc)
    // console.log(data, 'data')


    const [day, setDate] = useState(0);
    const [hour, setHour] = useState(0);
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);
      
  useEffect(()=>{

    const SEC = 1000;
    const MIN = SEC * 60;
    const HOUR = MIN * 60;
    const DAY = HOUR * 24;
    const date = Date.now;
    
    const time = Date.parse(Sdate) - Date.now();
    setDate(Math.floor(time / DAY));
    setHour(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMin(Math.floor((time / MIN) % 60));
    setSec(Math.floor((time / SEC) % 60));
    const CDsec = ToSeconds(time);
    setCDSeconds(CDsec);
    console.log(CDSeconds)
     
  },[])

    const SDdate = Sdate.slice(0,10);

    const ToSeconds = (time) =>{
      const sec = Math.floor((time) / 1000);
        console.log('seconds:'+sec)
        return sec;
    }

    const startClass = () =>{
      const API = BaseURL+"startLiveClass";
      if(data.liveUUID === ''){
        alert('something went wrong, please try again later');
      }else{
        const requestOptions ={
          method:'POST',
          headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'gmailUserType':'INSTRUCTOR',
              'token':email
            },
            body:JSON.stringify({
              courseCode:CourseCode,
              liveClassOrder:data.liveClassOrder,
              liveUUID:data.liveUUID
            })
        }
        fetch(API, requestOptions)
          .then((res) => res.json())
          .then((result) => {
            if(result.status === 200){
              dispatch(setLiveClassData(data))
              navigation.navigate('LiveClass')
              console.log('Live started')
            }else{
              alert('something went wrong, please try again later');
            }
          })
      }
    }
    

const CJoin = () =>{
  // console.log(data.date);
  let date = data.date;
  const LDate = moment(date).format('DD MMM YYYY hh:mm a');
  return(
    <VStack>
    <HStack justifyContent="space-between" alignItems="center">
      <VStack  space={2} width={width / 1.5}>
          <Text style={{fontWeight:'bold', color: '#395061'}}>{data.topicName}</Text>
          <View style={{backgroundColor:'#F0E1EB',borderRadius:10, alignSelf:'flex-start'}}>
          <Text style={{fontSize: 9,color: '#395061', paddingLeft:7,paddingRight:7,paddingTop:5,paddingBottom:5}} >Scheduled at {LDate}</Text>
          </View>
      </VStack>
      {/* {console.log(CDSeconds, 'Tine')} */}
        {
          CDSeconds > 0 ?
          <CountDownTimer
          containerStyle={styles.count}
          timestamp={CDSeconds}
          onFinish={() => {
            setLStarted(true)
          }}
          textStyle={{backgroundColor: 'White', color: '#8C8C8C', fontSize: 12, borderWidth: 0,  }}
          /> 
          : null
        }
      </HStack>
    <Divider mx={1} ml={0} mt={3} bg="primary.50"/>
</VStack>
  )
}

const Join = () => {
  var date = data.date.split('T')
  return(
    <VStack>
  <HStack justifyContent="space-between" alignItems="center">
          <VStack  space={2} width={width / 1.5}>
              <Text style={{fontWeight:'bold', color: '#395061'}}>{data.topicName}</Text>
              <View style={{backgroundColor:'#F0E1EB',borderRadius:10, alignSelf:'flex-start'}}>                      
              </View>
          </VStack>
          {
            date[0] === utc ?
            <TouchableOpacity
              style={{borderWidth:1,borderColor:'#395061',borderRadius:10}}
              onPress={() => {
                startClass();
              }}
            >
              <Text style={{fontSize:10, color:"black", paddingLeft:10,paddingRight:10,paddingTop:3,paddingBottom:3}}>
                Start Live
              </Text>
            </TouchableOpacity>
            : 
            <Text style={{fontSize:12, color:"red", paddingLeft:10,paddingRight:10,paddingTop:3,paddingBottom:3}}>
              Date Expired
            </Text>
          }
  </HStack>
  <Divider mx={1} ml={0} mt={3} bg="primary.50"/>
  </VStack>
  )
}

    const USCard = () =>{
      return(
        <VStack>
            <HStack justifyContent="space-between" alignItems="center">
                    <VStack  space={1}>
                        <Text style={{fontWeight:'bold', color: '#395061'}}>{data.topicName}</Text>
                        {/* <Text style={{fontSize: 13,color: '#395061',padding:1}} >{SDdate}</Text> */}
                        
                    <View style={{backgroundColor:'#F0E1EB', marginTop:5, borderRadius:10, alignSelf:'flex-start'}}>
                      <Text style={{fontSize: 11,color: '#395061', paddingLeft:7,paddingRight:7,paddingTop:5,paddingBottom:5}} >Completed on {SDdate}</Text>
                    </View>
                    </VStack>
                    {/* <Icon size="lg" as={Ionicons} name="chevron-forward-outline" color="#000000"/> */}
            </HStack>
            <Divider mx={1} ml={0} mt={2} bg="primary.50"/>
        </VStack>
      )
    }


    const SCard = () =>{
      console.log(LStarted)
       if(liveStatus === 'INPROGRESS'){
        setLStarted(true)
      }
      return(
        <View>
        {LStarted === false ? <CJoin/> : <Join/>}
        {/* <Join/> */}
        </View>
      )
    }
  
    // console.log(props)
  return (
    <View>
    {/* {liveStatus === 'SCHEDULED' && <SCard/>} */}
    {liveStatus === 'SCHEDULED' && <Join/>}
    {liveStatus === 'COMPLETED' && <USCard/>}
    {liveStatus === 'INPROGRESS' && <Join/>}
    {/* <SCard/> */}
    </View>
  )
}

export default LVideoCard

const styles = StyleSheet.create({})