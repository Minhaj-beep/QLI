import {View, Dimensions, ScrollView, TouchableWithoutFeedback, StyleSheet,TouchableOpacity} from 'react-native';
import {useState,useEffect,React, useRef} from 'react';
import {FormControl,Input,Icon,Text,HStack, Image, VStack,Button, Modal} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import DocumentPicker from 'react-native-document-picker'
import { setLoading } from '../../Redux/Features/userDataSlice';
import ResoucreFile from './components/ResoucreFile';
import { setLiveClassDetails } from '../../Redux/Features/CourseSlice';
import { setUpcomingClassData } from '../../Redux/Features/CourseSlice';
import moment from 'moment';


const { width, height } = Dimensions.get('window')

const GTStart = ({navigation}) => {

  const dispatch = useDispatch()
  const BaseURL = useSelector(state => state.UserData.BaseURL);
  const SingleCD = useSelector(state => state.Course.SingleLiveCourse);
  const email = useSelector(state => state.Login.email);
  const GTD = useSelector(state => state.Course.LiveClassDetails);
  console.log('WHat is GTD: ', GTD)
  const captionRef = useRef()
  const [captionErr, setCaptionErr] = useState(false)

  const [LCaption, setLCaption] = useState(GTD.liveCaption);
  const [Resource, setResource] = useState(GTD.resourceDetails);
  const [updateResource, setUpdateResource] = useState();
  const [RView, setRView] = useState('auto');
  const [showModal, setShowModal] = useState(false)

  const [GTData, setGTData] = useState(GTD);

  const [RName, setRName] = useState();
  const [FLink, setFLink] = useState();
  const [RType,setRType] = useState();
  const [Order, setOrder] = useState(GTD.liveClassOrder);

  const [CurrentDate,setCurrentDate] = useState();
  const [CurrentTime,setCurrentTime] = useState();

  const [SLBtn, setSLBtn] = useState(true);

  // console.log('yet')
  // console.log(GTData)

  const handleStartLive = () => {
    if(GTD.hasOwnProperty("joinLiveLink")){
      // console.log(GTD.joinLiveLink, 'console.log')
      setShowModal(true)
    } else {
      alert('Kindly save the class name and retry!')
    }
  }

  function compareDateWithCurrent(dateString) {
    const givenDate = moment(dateString).startOf('day');
    const currentDate = moment().startOf('day');
  
    return givenDate.isSame(currentDate);
  }

  useEffect(()=>{
    // console.log(GTData, '+++++++++++++++++++++++++')
    let dateToday = new Date().toJSON().slice(0, 10)
    dateToday = dateToday.split('-')
    const scheduledDate = GTData.scheduledDate.split('-')
    let startTime = GTData.startTime.split(':')
    let endTime = GTData.endTime.split(':')
    const hour = new Date().getHours() 
    const minute = new Date().getMinutes() 
    // console.log('==========================')
    // console.log(dateToday[0], scheduledDate[0], dateToday[1], scheduledDate[1], parseInt(dateToday[2]), parseInt(scheduledDate[2]))
    // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    // console.log(`
    //   hour: ${hour}
    //   minute: ${minute}
    //   startTime: ${startTime}
    //   endTime: ${endTime[0]}
    // `)
    if(dateToday[0] === scheduledDate[0] && dateToday[1] === scheduledDate[1] && compareDateWithCurrent(GTData.scheduledDate)) {
      if(hour > parseInt(startTime[0]) && hour < parseInt(endTime[0])){
        console.log('1111111111111111111111111111111111')
        setSLBtn(false)
      } else if (hour === parseInt(startTime[0]) && minute > parseInt(startTime[1])){
        console.log('2222222222222222222222222222222222')
        setSLBtn(false)
      } else if (hour === parseInt(endTime[0]) && minute < parseInt(endTime[1])){
        console.log('3333333333333333333333333333333333')
        setSLBtn(false)
      }
      // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++2')
    }
  },[])

  const GetSCC = () =>{
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
            // console.log(result.data)
            let data = result.data
            data.map((data, index)=>{
              if(data.liveClassOrder === GTData.liveClassOrder){
                setGTData(data)
                // dispatch(setLiveClassDetails(data))
              }
            })
            dispatch(setLoading(false))
        }else if(result.status > 200){
            alert(result.message)
            alert(result.message)
            dispatch(setLoading(false))
        }
    })
    .catch(error => {
        alert('Error: '+error)
        alert(error)
        dispatch(setLoading(false))
    })
  } 

  const RRender = () =>{
    return Resource.map((data,index)=>{

      // let data = {
      //   resourceName:RName,
      //   resourcePath:FLink
      // }

      const RData = {
        data:data,
        navigation:navigation
      }
      return(
        <View pointerEvents={RView} key={index}>
         {Resource ? <ResoucreFile props={RData}/> : null}
        </View>
      )

    })
  }

  // const GetData = () =>{
  //   dispatch(setLoading(true))
  //   const API = BaseURL+'getGotoLiveCourse?courseCode='+SingleCD.courseCode;
  //   let requestOptions ={
  //       method:'GET',
  //       headers:{
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //         'gmailUserType':'INSTRUCTOR',
  //         'token':email
  //       }
  //     }
    
  //   fetch(API, requestOptions)
  //   .then(res => res.json())
  //   .then(result => {
  //       if(result.status === 200){
  //           // console.log(result.data)
  //           let DD = result.data
  //           let RR =  DD[0].resourceDetails
  //           // console.log(RR)
  //           setLCaption(DD[0].liveCaption)
  //           setResource(DD[0].resourceDetails)
  //           setUpdateResource(RR[0].resourcePath)
  //           // console.log(RR[0].resourcePath)
  //           dispatch(setLoading(false))
  //       }else if(result.status > 200){
  //           alert(result.message)
  //           alert(result.message)
  //           dispatch(setLoading(false))
  //       }
  //   })
  //   .catch(error => {
  //       alert('Error: '+error)
  //       alert(error)
  //       dispatch(setLoading(false))
  //   })
  // } 

  const UpdateData = () =>{
    dispatch(setLoading(true))
    const API = BaseURL+'GotoLiveCourse';
    let requestOptions ={
        method:'POST',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'gmailUserType':'INSTRUCTOR',
          'token':email
        },
        body:JSON.stringify({

        })
      }
    
    fetch(API, requestOptions)
    .then(res => res.json())
    .then(result => {
        if(result.status === 200){
            alert(result.message)           
            dispatch(setLoading(false))
        }else if(result.status > 200){
            alert(result.message)
            alert(result.message)
            dispatch(setLoading(false))
        }
    })
    .catch(error => {
        alert('Error: '+error)
        alert(error)
        dispatch(setLoading(false))
    })
  }

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
            dispatch(setUpcomingClassData(result.data))
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
  
  const CreateLC = () =>{
    console.log(GTData.startTime + GTData.scheduledDate, ' Check the format=========================')
    const datePart = moment(GTData.scheduledDate).format("YYYY-MM-DD")
    const mergedDateTime = moment(`${datePart} ${GTData.startTime}`)
    const formattedDateTime = mergedDateTime.toISOString()
    
    if(LCaption != ''){
      dispatch(setLoading(true))
      var myHeaders = new Headers();
      myHeaders.append("gmailUserType", "INSTRUCTOR");
      myHeaders.append("token", "fakiiyes@hi2.in");

      var formdata = new FormData();
      formdata.append("courseCode", SingleCD.courseCode);
      formdata.append("liveCaption", LCaption);
      // formdata.append("liveCourseResourse",{uri: FLink,name: RName,type:RType});
      formdata.append("startTime", GTData.startTime);
      formdata.append("endTime", GTData.endTime);
      formdata.append("weekDay", GTData.weekDay);
      formdata.append("scheduledDate", GTData.scheduledDate);
      formdata.append("liveClassOrder",Order)
      formdata.append("scheduledDateTime", formattedDateTime) // 

      if(Resource.length != 0){
        Resource.forEach((data, index) =>{
          let FName = data.resourceName
          formdata.append("liveCourseResourse",{uri: data.resourcePath,name:FName,type:'application/pdf'});
        })
      }
      // formdata.append("liveCourseResourse",FLink,RName);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body:formdata
      };
      console.log(requestOptions)
      fetch(BaseURL+"CreateLiveCourseClass", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if(result.status === 200){
            alert(result.message)
            GetUpcomingData()
            GetSCC()           
            dispatch(setLoading(false))
            navigation.goBack()
          }else{
            GetSCC()     
            console.log(result)      
            alert(result.message)
            dispatch(setLoading(false))
          }
        })
        .catch(error => {
          console.log(error)
          alert(error)
          dispatch(setLoading(false))
        });
    }else{
      setCaptionErr(true)
      captionRef.current.focus()
    }
  }

  const GetFile = async() => {
    let result = await DocumentPicker.pickSingle({allowMultiSelection: true});
    console.log(result)
    // alert(result.type)
    if(result){
        // result.map((i)=>{

        // })
      setFLink(result.uri)
      setRName(result.name)
      setRType(result.type)
      console.log(result.type)
      setRView('none')

      let RUp = {
        'resourceName': result.name,
        'resourcePath': result.uri
      }
      let newArr = [...Resource]
      newArr.push(RUp)
      setResource(newArr)
      // console.log(Resource)
    }
  }
  console.log(GTData, 'GTData')

  const StartLive = () => {
    let id
    SingleCD.liveCourseClassList.map((i)=>{
      if(i.weekDay === GTData.weekDay){
        id = i._id
      }
    })

    const API = BaseURL+"startLiveCourseClass"
    console.log('Whats inside body: ', id, 'and ', SingleCD.courseCode)

    var requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'gmailUserType':'INSTRUCTOR',
        'token':email
      },
      body: JSON.stringify({
        'liveClassId':id,
        'courseCode':SingleCD.courseCode
      }),
    };
    console.log(requestOptions)
    fetch(API, requestOptions)
      .then(response => response.json())
      .then(result => {
        if(result.status === 200){
          // alert(result.message)
          navigation.navigate('GoLive')
        }else{
          alert(result.message)
          console.log('Start live error: 1 ', result)
          // alert('Something went wrong!')
        }
      })
      .catch(error => {
        console.log('Start live error: 2 ', error)
        alert('Something went wrong')
      });
  }
 
  const AppBarContent = {
    title: 'Start Live',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  return (
      <View>
        <AppBar props={AppBarContent}/>

        {/* Modal for showing warning: not to recive calls during the class */}
        <Modal isOpen={showModal}>
          <Modal.Content maxWidth="700px">
            <Modal.Body>
              <VStack safeArea flex={1} p={2} w="90%" mx="auto" justifyContent="center" alignItems="center">
                <Image source={require('../../../assets/warning.png')} resizeMode="contain" size={40} alt="successful" />
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
                        navigation.navigate('GoLive')
                      }}
                      >
                    Continue
                  </Button>
                </HStack>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <ScrollView style={styles.TopContainer}>
         <VStack space={10} justifyContent='space-evenly'>
            <VStack space={2}>
              <FormControl>
                <FormControl.Label _text={{
                color: "primary.100",
                fontSize: "sm",
                fontWeight: 'bold',
                paddingBottom:2 
              }}
              >
                  Live Caption
                </FormControl.Label>
                <Input
                  ref={captionRef} 
                  variant="outline"
                  borderColor='primary.100'
                  value={LCaption} 
                  bg="#f3f3f3" 
                  placeholder="Live Caption"
                  onChangeText={(text) => 
                    {
                      setLCaption(text)
                      setCaptionErr(false)
                      console.log(text)
                  }
                  }
                />
                {captionErr ? <Text style={{color: '#FF0000', fontSize: 9}}>Please insert the live class caption.</Text> : null}
              </FormControl>

              <HStack space={3} ml={4}>
                <Text style={{fontSize:15, fontWeight:'bold'}}>Attachments</Text>
                <TouchableOpacity
                onPress={()=>GetFile()}
                >
                  <Text color='primary.100' style={{fontWeight:'bold',fontSize:13}} alignItems='center'>Upload Resource</Text>
                </TouchableOpacity>
              </HStack>
              { Resource ? <RRender/>: null}
            </VStack>
            <HStack mt={10} justifyContent='center' space={4}>
            <Button _text={{fontSize:14}}
            style={{width:width/2.5}}
            onPress={()=>{
              CreateLC()
            }}
            >
              Save
              </Button>
            <Button 
              isDisabled={SLBtn}
              _text={{fontSize:14}}
              onPress={()=> {
                handleStartLive()
              }}
              // p={2} pl={10} pr={10}
              style={{width:width/2.5}}
            >
              Start Live
            </Button>
            
            </HStack>
         </VStack>

        </ScrollView>
      </View>
  )
}

export default GTStart

const styles = StyleSheet.create({
    TopContainer:{
        margin:15
    }
})