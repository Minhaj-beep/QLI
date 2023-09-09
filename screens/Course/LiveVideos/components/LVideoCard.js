import {View, Dimensions, ScrollView, Linking, TouchableWithoutFeedback, StyleSheet,TouchableOpacity} from 'react-native';
import {useState,useEffect, useCallback, React} from 'react';
import {Image,VStack, Modal, Text, HStack,Icon,Divider,Button } from 'native-base';
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
    const [showModal, setShowModal] = useState(false)
    const [ CDSeconds, setCDSeconds] = useState();
    const BaseURL = useSelector(state => state.UserData.BaseURL)
    const liveStatus = props.data.liveStatus;
    const Sdate = props.data.date;
    const email = useSelector(state => state.Login.email);
    const CourseCode = useSelector(state => state.UserData.SingleCD.courseCode);

    const navigation = props.navigation;
    const data = props.data;
    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'-');
    let dateString = new Date(data.createdTime)
    console.log('dateString :', dateString)
    const options = { month: 'short', day: 'numeric', year: 'numeric' }
    console.log(dateString.toLocaleDateString('en-US', options))


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
    console.log(`{
      CDSeconds: ${CDSeconds}
    }`)
     
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
              setShowModal(true)
            }else{
              alert('something went wrong, please try again later');
            }
          })
      }
    }

    // today.toLocaleDateString("en-US", options)

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
          <Text style={{fontSize: 9,color: '#395061', paddingLeft:7,paddingRight:7,paddingTop:5,paddingBottom:5}} >Scheduled at {dateString.toLocaleDateString('en-US', options) + ' ' + dateString.toLocaleTimeString('en-US')}</Text>
          </View>
      </VStack>
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

const isItLiveTime = (startTime, endTime) => {
  let st = startTime.substring(0, startTime.length - 3).split(':')
  let et = endTime.substring(0, endTime.length - 3).split(':')

  //getting current time and break into hour and minute
  const now = new Date();
  const options = {hour12: false};
  const time = now.toLocaleTimeString(undefined, options).substring(0, endTime.length - 3).split(':')

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++', st, et, time)
  // if current time hour is >= start time hour and current time hour is <= end time hour
  if(parseInt(time[1]) >= parseInt(st[1]) && parseInt(time[1]) <= parseInt(et[1])){
    // if current time hour is greater to start time hour and smaller than end time hour => make live
    // if()
    
    // else if current time hour is equals start time hour
      // if current time minute is equals start time hour

    // else if current time hour is equals end time hour
  }

    // if(parseInt())
    // console.log(`
    //   hour: ${typeof(hour)}
    //   minute: ${minute}
    //   startTime: ${startTime}
    //   endTime: ${typeof(endTime[0])}
    // `)

    // if(hour > parseInt(startTime[0]) && hour < parseInt(endTime[0])){
    //   // console.log('1111111111111111111111111111111111')
    //   setSLBtn(false)
    // } else if (hour === parseInt(startTime[0]) && minute > parseInt(startTime[1])){
    //   // console.log('2222222222222222222222222222222222')
    //   setSLBtn(false)
    // } else if (hour === parseInt(endTime[0]) && minute < parseInt(endTime[1])){
    //   // console.log('3333333333333333333333333333333333')
    //   setSLBtn(false)
    // }
}

function addMinutesToIsoTime(isoTime, duration) {
  const dateObj = new Date(isoTime);
  dateObj.setMinutes(dateObj.getMinutes() + duration);
  return dateObj.toISOString();
}

const Join = () => {
  const [isStart, setIsStart] = useState(false) 
  var date = data.date.split('T')

  function isCurrentTimeLessThanAddedTime(timeString) {
    // Create a Date object for the current time
    const currentTime = new Date();
  
    // Convert the input time string to a Date object
    const inputTime = new Date(timeString);
  
    // Add one hour to the input time
    inputTime.setHours(inputTime.getHours() + 1);
  
    // Compare the current time with the added time
    return currentTime < inputTime;
  }

  //Finding the date in 'Tue, Apr 25, 2023, 10:28 AM' format based on time Zone
  const istOptions = { timeZone: 'Asia/Kolkata', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  const utcDate = new Date(data.date);
  const istDateTime = moment.utc(data.date).local().format('ddd, MMM D, YYYY, h:mm A');
  
  //Find out the secondes left for the live class
  const remainingTime = Date.parse(data.date) - Date.now();
  const sec = Math.floor((remainingTime) / 1000)

  //Find out start time, end time and current time
  let now = new Date()
  now = new Date(now.getTime() + (330 * 60 * 1000))
  const startDate = new Date(data.date)
  const endDate = new Date(data.toDate)
  const isCurrentLessThanAdded = isCurrentTimeLessThanAddedTime(startDate)
  console.log('WTFFFFFFFFFFFFF= ', isCurrentLessThanAdded)


  return(
    <VStack>
      <HStack justifyContent="space-between" alignItems="center">
          <VStack  space={2} width={width / 1.5}>
              <Text style={{fontWeight:'bold', color: '#395061'}}>{data.topicName}</Text>
              <View style={{backgroundColor:'#F0E1EB', marginTop:5, borderRadius:10, alignSelf:'flex-start'}}>
                <Text style={{fontSize: 11,color: '#395061', paddingLeft:7,paddingRight:7,paddingTop:5,paddingBottom:5}} >Scheduled at {istDateTime}</Text>
              </View>
          </VStack>
          {
            date[0] === utc  ?
            <>
              {
                now >= startDate && now < endDate ?
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
                <>
                {/* {console.log('Khnog uthi goisile: ', now >= startDate, now < endDate)} */}
                  {
                    isStart ?
                    <>
                      {
                        isCurrentLessThanAdded ?
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
                    </>
                    :
                    <CountDownTimer
                      containerStyle={styles.count}
                      timestamp={sec}
                      timerCallback={() => {
                        setIsStart(true)
                      }}
                      textStyle={{backgroundColor: 'White', color: '#8C8C8C',  fontWeight:"bold", fontSize: 12, borderWidth: 0,  }}
                    /> 

                  }
                </>

              }
            </>
            : 
            <>
              { CDSeconds > 0 ?
                <CountDownTimer
                containerStyle={styles.count}
                timestamp={CDSeconds}
                onFinish={() => {
                  setLStarted(true)
                }}
                textStyle={{backgroundColor: 'White', color: '#8C8C8C', fontSize: 12, borderWidth: 0,  }}
                /> 
                :
                <Text style={{fontSize:12, color:"red", paddingLeft:10,paddingRight:10,paddingTop:3,paddingBottom:3}}>
                  Date Expired
                </Text>
              }
            </>
          }
  </HStack>
  <Divider mx={1} ml={0} mt={3} bg="primary.50"/>
  </VStack>
  )
}

    const USCard = () =>{
      //Finding the date in 'Tue, Apr 25, 2023, 10:28 AM' format based on time Zone
      const istOptions = { timeZone: 'Asia/Kolkata', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
      const utcDate = new Date(data.date);
      const istDateTime = moment.utc(data.date).local().format('ddd, MMM D, YYYY, h:mm A');
      return(
        <VStack>
            <HStack justifyContent="space-between" alignItems="center">
                    <VStack  space={1} width={width / 1.5}>
                        <Text style={{fontWeight:'bold', color: '#395061'}}>{data.topicName}</Text>
                        {/* <Text style={{fontSize: 13,color: '#395061',padding:1}} >{SDdate}</Text> */}
                        
                    <View style={{backgroundColor:'#F0E1EB', marginTop:5, borderRadius:10, alignSelf:'flex-start'}}>
                      <Text style={{fontSize: 11,color: '#395061', paddingLeft:7,paddingRight:7,paddingTop:5,paddingBottom:5}} >Scheduled at {istDateTime}</Text>
                    </View>
                    </VStack>
                    <Text style={{fontSize:12, color:"#395061", paddingLeft:10,paddingRight:10,paddingTop:3,paddingBottom:3}}>Completed</Text>
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
      {/* Modal for showing warning: not to recive calls during the class */}
      <Modal isOpen={showModal}>
      <Modal.Content maxWidth="700px">
          <Modal.Body>
          <VStack safeArea flex={1} p={2} w="90%" mx="auto" justifyContent="center" alignItems="center">
              <Image source={require('../../../../assets/warning.png')} resizeMode="contain" size={40} alt="successful" />
              <Text fontWeight="bold" color={'orange.400'} fontSize="17">Warning!</Text> 
              <Text marginY={5} fontWeight="bold" textAlign={'center'} style={{color:"#000"}} fontSize="14">Please do not recive any kind calls during the class. If the screen get stuck/freeze try re-installing the app again.</Text> 
              <HStack space={2}>
              <Button  bg={'orange.400'} colorScheme="blueGray" style={{paddingTop:10,paddingBottom:10,paddingLeft:40, paddingRight:40}}
                  _pressed={{bg: "#fcfcfc", _text:{color: "#3e5160"}}}
                  onPress={()=> setShowModal(false)}
                  >
                  Cancel
              </Button>
              <Button  bg={'primary.900'} colorScheme="blueGray" style={{paddingTop:10,paddingBottom:10,paddingLeft:40, paddingRight:40}}
                  _pressed={{bg: "#fcfcfc", _text:{color: "#3e5160"}}}
                  onPress={()=> {
                      setShowModal(false)
                      navigation.navigate('LiveClass')
                      console.log('Live started')
                  }}
                  >
                  Continue
              </Button>
              </HStack>
          </VStack>
          </Modal.Body>
    </Modal.Content>
    </Modal>

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