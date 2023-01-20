import { View, StyleSheet,Dimensions,ScrollView, TouchableOpacity,Platform,Linking } from 'react-native';
import React,{useState,useEffect,useRef, useMemo} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Text,Image,HStack,VStack,IconButton,Icon,Divider, Container,Select,Input,Modal,Box, Heading, Button,FormControl} from 'native-base';
import AppBar from '../../components/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CollapsibleView from '@eliav2/react-native-collapsible-view';
import RenderHtml from 'react-native-render-html';
import Video from 'react-native-video';
import {useDispatch,useSelector} from 'react-redux';
import { setLiveAssessmentList } from '../../Redux/Features/CourseSlice';
import FAQContent from './components/FAQContent';
import DateTimePicker from '@react-native-community/datetimepicker';
import ClassTime from './components/ClassTime';
import { setLoading } from '../../Redux/Features/userDataSlice';
import moment from 'moment';
// import * as WebBrowser from 'expo-web-browser';


const { width, height } = Dimensions.get('window');

const LCourseDetails = ({navigation}) => {

  const dispatch = useDispatch();
  const scrollViewRef = useRef();

  const [ShowStudList, setStudList] = useState(false);
  const [LearnerList, setLearnerList] = useState();
  const [ShowRChat, setRChat] = useState(false);
  const [ChatArray, setChatArray] = useState([]); 
  const [ChatText, setChatText] = useState();
  const [currencyType, setCurrencyType] = useState();
  const [fromDate, setFromDate] = useState(new Date(1598051730000));
  const [toDate, setToDate] =useState(new Date(1598051730000));
  const [DateMode, setDateMode] = useState('date');
  const NewDate = new Date(1598051730000);
  const SNewDate = NewDate.toString()
  const [DFromTime, setDFromTime] = useState('');
  const [DToTime, setDToTime] = useState('');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const BaseURL = useSelector(state => state.UserData.BaseURL)

  let tagsStyles = {
    a: {
      color: 'green'
    }
  }

  const onChangeFrom = (event, selectedDate) => {
    setShowFromPicker(Platform.OS === 'ios')
    if (event?.type === 'dismissed') {
      setFromDate(DFromTime);
    }else{
      setFromDate(selectedDate);
      // console.log(selectedDate);
      let date = selectedDate.toLocaleDateString()
      setDFromTime(date)
    }
    setShowFromPicker(false);
  }

  const onChangeTo = (event, selectedDate) => {
    setShowToPicker(Platform.OS === 'ios')

    if (event?.type === 'dismissed') {
      setToDate(DToTime)
    }else{
      setToDate(selectedDate);
      let date = selectedDate.toLocaleDateString()
      setDToTime(date)
    }
    setShowToPicker(false);
}


  const SingleCD = useSelector(state => state.Course.SingleLiveCourse);
  const email = useSelector(state => state.Login.email);
  const [FaqData, setFaqData] = useState()
  const CTime = SingleCD.classTime;
  // console.log(SingleCD.courseCode)

  const OverC = SingleCD.courseOverview

//   const renderersProps = {a:{onPress: onPress}}

//   function onPress(event, href){
//     OpenLink(href)
//   }

//   const OpenLink = async(props) =>{
//     await WebBrowser.openBrowserAsync(props);
// }


  useEffect(()=>{
    dispatch(setLoading(true));
    if(SingleCD.currency === 'USD'){
        setCurrencyType('$')
      }else{
        setCurrencyType('₹')
      }
      GetAssessment()
      // getStudentList()
      getTicket()
      GetFAQ()
      dispatch(setLoading(false));
  },[])

  const GetFAQ = () => {
    const API = BaseURL+'getLiveFAQCoursebyCourseCode?courseCode='+SingleCD.courseCode
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
          // console.log(result.data[0].faqList)
          setFaqData(result.data[0].faqList)
        }else{
          console.log( result.message)
        }
      })
      .catch(err => {
        console.log(err)
        console.log( err)
      })
  }

  const getTicket= () =>{
    const API= BaseURL+'v1/ticket/getOpenTicketBycourseCode?courseCode='+SingleCD.courseCode
    let requestOptions ={
      method:'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'gmailUserType':'INSTRUCTOR',
        'token':email
      }
    }
    // console.log(requestOptions)
    fetch(API, requestOptions)
    .then(res => res.json())
    .then(result => {
      // console.log(result)
      if(result.status === 200){
        let data = result.data
        if(data.length != 0){
          // console.log(data)
          setChatArray(data[0].messages)
        }
        // console.log(SingleCD.courseCode)
      }else{
        console.log( result.message)
        // console.log('Error code'+result.status)
      }
    })
    .catch(err => {
      console.log(err)
      console.log( err)
    })
  }

  const UpdateChat = () =>{
    const API = BaseURL+'v1/ticket/raiseLiveCourseTicket'
    var CDate = new Date()

    var myHeaders = new Headers();
    myHeaders.append("gmailUserType", "INSTRUCTOR");
    myHeaders.append("token", email);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "courseCode": SingleCD.courseCode,
      "messages": [
        {
          "message": ChatText,
          "messageTime": CDate
        }
      ]
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    fetch(API, requestOptions)
      .then(response => response.text())
      .then(result => {
        if(result.status > 200){
          console.log(result.message)
        }
        // console.log(result)
      })
      .catch(error => {
        console.log('Error: ' +error)  
        console.log('Error:', error)
      });

  }

  const getStudentList = () =>{
    const API = BaseURL+'eachCourseLearnersList/?courseCode=CO100003'
    const requestOptions ={
      method:'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'gmailUserType':'INSTRUCTOR',
        'token':email
      }
    };
    // console.log(requestOptions)
    // console.log(API)
    fetch(API, requestOptions)
    .then(res => res.json())
    .then(result => {
      if(result.status === 200){
        // console.log(result.data)
        setLearnerList(result.data)
      }else{
        console.log(result.status)
        console.log(result)
      }
      // console.log(result)
    })
    .catch(error=> {
      console.log(error)
      console.log('Error: ' + error);
    })
  }

  const GetAssessment = () =>{
    const API = BaseURL+"getAssessmentBycourseCode?courseCode="+SingleCD.courseCode; 
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
      if(result.status === 200){
        console.log('Hellooooooooooooooooooooooooooooooooooooooooooooooo')
        dispatch(setLiveAssessmentList(result.data))
     }else if(result.status != 200) {
      console.log(result.message)
      console.log('GetAssessment:'+result.message)
     }
    })
    .catch(error => console.log('error', error));
  }

  // const OverviewSource ={
  //   html:SingleCD.courseOverview
  // };

  const OverviewSource ={
    html:`<head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          </head> 
          <body>${OverC}</body>`
  };

  const AppBarContent = {
    title: 'Courses',
    navigation: navigation,
    ArrowVisibility: false,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  const FaqRender = () =>{
    return FaqData.map((data,index) =>{
      const faqD = {
          question:data.question,
          answer:data.answer,
          navigation:navigation
      }
      return(
        <View key={index}>
          <FAQContent props={faqD}/>
        </View>
      )
    })
  }

  const CTRender = () =>{
    return CTime.map((data,index) =>{
      // console.log(data)
      return(
        <View key={index}>
          <ClassTime props={data}/>
        </View>
      )
    })
  }

  const RenderChat = () => {
    return ChatArray.map((data,index) =>{
      const TimeD = moment(data.messageTime).format('DD MMM, YYYY hh:mm')
      return(
        <VStack key={index} mt={4} alignSelf='flex-end'>
          <HStack alignItems="center" space={2}>
            <Text style={{fontSize:8, color:'#8C8C8C' }}>{TimeD}</Text>
            <Text style={{fontSize:10,fontWeight:'bold', color:"#000000" }}>ME</Text>
          </HStack>
          <Text style={{fontSize:11, color:'#000000', maxWidth:width/3,alignSelf:'flex-end'}}>{data.message}</Text>
        </VStack>
      )
    })
  }


  const StudRender = () => {
    return LearnerList.map((data, index) => {
     let imgPath = data.learnerImgPath
     let Spatch = imgPath.slice(1)
     // console.log(Spatch)
     const imageURI = 'https://api.dev.qlearning.academy'+Spatch
     // console.log(imageURI)
     return (
       <VStack key={index} mt={2}>
       <HStack space={2} style={styles.chatTile}>
         <HStack space={2}>
           <Image 
             source={{uri: imageURI}}
             alt="learner"
             style={styles.learner_img}
             rounded={50}
             size='sm'
             resizeMode='cover'
           />
           <VStack style={{ justifyContent: 'center'}}>
             <Text style={{color:'#000000',fontWeight:'bold',fontSize:12}}>{data.learnerEmail}</Text>
             <Text style={{color:'#8C8C8C',fontSize:10}}>{data.learnerName}</Text>
            <HStack alignItems="center" space={1}>
            <Icon as={<MaterialCommunityIcons name="cash-multiple" />} size={4} color="#364b5b" />
            <Text style={{color:'#364b5b',fontWeight:'bold',fontSize:11}}>{data.coursePrice}</Text>
            </HStack>
           </VStack>
         </HStack>
         <View style={{ justifyContent: 'center'}}>
           <Image 
               source={require('../../../assets/chatting.png')}
               alt="learner"
               style={styles.learner_chat}
               rounded={5}
           />
         </View>
         </HStack>
       </VStack>
     )
    })
   }

  return (
      <SafeAreaView keyboardShouldPersistTaps={'always'}>
        <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
        <AppBar props={AppBarContent}/>
      
      <Modal isOpen={ShowStudList} onClose={() => setStudList(false)} size="full" padding={2}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Body>
            {/* <Input 
                variant="filled"
                mt={10}
                mb={4} 
                bg="#EEEEEE" 
                placeholder="Search"
                onChangeText={(text) => {
                  console.log(text);
                }}
                borderRadius={7}
                InputLeftElement={<Icon as={<Ionicons name="search" />} size={5} ml="3" color="#364b5b" />}
            /> */}

            <VStack space={2}>
           {LearnerList ? <StudRender/> : null}
            </VStack>

          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Modal isOpen={ShowRChat} onClose={() => setRChat(false)} size="full" padding={5} avoidKeyboard justifyContent="flex-start" style={{marginTop:100}}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Body>
            <VStack space={2} >
            <Text color='primary.50' style={{fontWeight:'bold', fontSize:16}}>
              Ticket
            </Text>
            
            <ScrollView showsHorizontalScrollIndicator={false} 
              style={{height:height/3.5}} 
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
              keyboardShouldPersistTaps={'always'}
            >
            <VStack space={2} mt={3}>
              <VStack>
                <HStack alignItems="center" space={2}>
                <Text style={{fontSize:10,fontWeight:'bold', color:"#000000" }}>Moderator</Text>
                <Text style={{fontSize:8, color:'#8C8C8C' }}>15, Feb, 2022 10:00 AM</Text>
                </HStack>
                <Text style={{fontSize:11, color:'#000000'}}>Any Queries ?</Text>
              </VStack>

            {ChatArray ? <RenderChat/> : null}

            </VStack>
            </ScrollView>

            <FormControl>
            <Input 
            variant="filled" 
            bg="#f3f3f3"
            value={ChatText} 
            placeholder="Write a message"
            InputRightElement={
            <IconButton
            onPress={()=>{
                if(ChatText != '' && ChatText != " "){
                  let CDate = new Date()
                  var message = {
                      "message":ChatText,
                      "messageTime":CDate
                    }
                    // console.log(message)
                  ChatArray.push(message)
                  UpdateChat();
                  setChatText('');
                }
            }}
            icon={<Icon size='lg' as={Ionicons} name='send' color='#395061'/>}
            />
        
        }
            style={{maxWidth:width/1.2}}
            onChangeText={(text)=>{
                setChatText(text)
            }}
            mt={2}
            rounded={20}  
            />
            </FormControl>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      {showFromPicker ? (
        <DateTimePicker
          testID="dateTimePicker"
          value={fromDate}
          mode={DateMode}
          onChange={onChangeFrom}
        />
      ) : null}

      {showToPicker ? (
              <DateTimePicker
                testID="dateTimePicker"
                value={toDate}
                mode={DateMode}
                onChange={onChangeTo}
              />
            ):null}

      <View style={styles.TopContainer}>
          <Image 
            style={styles.courseImg} 
            source={{uri: SingleCD.thumbNailImagePath}}
            alt='courseImg'
            mb={2}
            resizeMode='cover'
          />
          {/* {console.log('find title: ', SingleCD)} */}
          <Text style={{fontSize: 15,color: '#000',fontWeight: 'bold'}}>{SingleCD.courseName}</Text>
          <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>{currencyType} {SingleCD.fee}</Text>
          <HStack space={2} mt="2" alignItems="center">
            <HStack space={2} alignItems="center">
                <HStack space={1}>
                <Image
                    source={require('../../../assets/star.png')}
                    alt="rating"
                    size="3"
                />
                  <Image
                    source={require('../../../assets/star.png')}
                    alt="rating"
                    size="3"
                />
                  <Image
                    source={require('../../../assets/star.png')}
                    alt="rating"
                    size="3"
                />
                  <Image
                    source={require('../../../assets/unstar.png')}
                    alt="rating"
                    size="3"
                />
                  <Image
                    source={require('../../../assets/unstar.png')}
                    alt="rating"
                    size="3"
                />
                </HStack>
            <Text style={{fontSize: 14,color: '#364b5b'}}>
              5.0(150)
            </Text>
            <Text style={{fontSize: 15,color: '#364b5b',fontWeight: 'bold',paddingLeft:15}}>
              View Reviews
            </Text>
            </HStack>
          </HStack>

        <HStack mt={2} mb={2} alignItems="center" space={2}>
          
         {/* {SingleCD.liveCourseStatus != 'INREVIEW' ? <TouchableOpacity
          onPress={()=>setStudList(true)}
          >
          <HStack space={2}> 
              <Image
              alt="graduate icon"
              source={require('../../assets/graduate_student.png')}
              size="4" 
              />
                <Text style={{fontSize: 13,color:"#091B12",fontWeight: '900'}}>
                    7 Learners
                </Text>
            </HStack>
          </TouchableOpacity> : null} */}

          {SingleCD.liveCourseStatus === 'INREVIEW' ? 
          <TouchableOpacity
              onPress={()=>setRChat(true)}
             >
              <HStack alignItems="center">
              <Icon size='md' as={Ionicons} name='information-circle-outline' color='#8C8C8C'/>
                <Button
                  colorScheme='primary'
                  _text={{fontSize:11}}
                  variant="Ghost"
                  onPress={()=>setRChat(true)}
                  >
                    Raise Ticket
                  </Button>
              </HStack>
             </TouchableOpacity>:null}
        </HStack>
          
          <CollapsibleView 
            title={
              <HStack 
                style={{
                  flex:1,    
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  paddingTop:10,
                  paddingLeft:15,
                  paddingRight:15,
                  paddingBottom:10,
                  position: 'relative'
                }}
              >
              <VStack>
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>
                  Overview
                </Text>
                
              </VStack>
            </HStack>  
            }
            style={{
              borderRadius: 5,
              backgroundColor: "#FFFFFF",
              shadowColor: "rgba(0, 0, 0, 0.03)",
              shadowOffset: {
                width: 0,
                height: 0.5
              },
              shadowRadius: 22,
              shadowOpacity: 1,
              borderWidth: 0,
            }}
            // collapsibleContainerStyle={}
            arrowStyling={{ size: 20,thickness: 3, color: "#364b5b"}}
            isRTL={true}
            collapsibleContainerStyle={{
              paddingTop: 5,
              paddingBottom:10,
              paddingLeft:15,
              paddingRight:15
            }}
          >
      
            <Divider my={1}/>
            {console.log('====================SingleCD===========', SingleCD)}
            <VStack space={2}>
              <Text style={{fontSize: 12,color: '#8C8C8C'}}>Course Title</Text>
              <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold',maxWidth:width/1.4}}>{SingleCD.courseName}</Text>
              <HStack space={2} mt={2}>
                <Text style={{fontSize: 12,color: '#8C8C8C'}}>Category</Text>
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold', maxWidth:width/2}}>{SingleCD.catogory}</Text>
              </HStack>
              <HStack space={2}>
                <Text style={{fontSize: 12,color: '#8C8C8C'}}>Sub-Category</Text>
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold',maxWidth:width/1.8}}>{SingleCD.subCategory}</Text>
              </HStack>

              <Text style={{fontSize: 12,color: '#8C8C8C'}}>Course Overview</Text>
              {console.log(SingleCD.courseOverview)}
              {/* <RenderHtml enableExperimentalMarginCollapsing={true} tagsStyles={tagsStyles} contentWidth={width} source={{html: SingleCD.courseOverview}} /> */}
              <Text>{SingleCD.courseOverview.replace(/<\/?[^>]+(>|$)/g, "")}</Text>
            </VStack>
            {/* <ScrollView
                style={{height: height/3}} 
                nestedScrollEnabled={true}
                showsHorizontalScrollIndicator={true}
                > */}
            {/* <Text style={{fontSize: 13,color: '#000000'}}> */}
              {/* {Overview.courseOverview}                 */}
             
              {/* <View style={{zIndex:5}}>
              <RenderHtml
                contentWidth={width/3}
                source={{html: SingleCD.courseOverview}}
                tagsStyles={tagsStyles} 
                // renderersProps={renderersProps}
                // onLinkPress={(evt, href) => { Linking.openURL(href) }}
                />
                </View> */}
             
                {/* <WebView 
                  originWhitelist={['*']}
                  source={OverviewSource}
                  style={{minHeight:height/5, zIndex:5}}
                /> */}
               

              {/* {"\n"} */}
              {/* </Text> */}
            {/* </ScrollView> */}
          </CollapsibleView>

          <CollapsibleView 
            title={
              <HStack 
                style={{
                  flex:1,    
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  paddingTop:10,
                  paddingLeft:15,
                  paddingRight:15,
                  paddingBottom:10,
                }}
              >
              <View>
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>
                Pricing & Intro 
                </Text>
                {/* <Text style={{fontSize: 12,color: '#8C8C8C'}}>
                You can reupload Thumbnail & Intro                 </Text> */}
              </View>
            </HStack>  
            }
            style={{
              borderRadius: 5,
              backgroundColor: "#FFFFFF",
              shadowColor: "rgba(0, 0, 0, 0.03)",
              shadowOffset: {
                width: 0,
                height: 0.5
              },
              shadowRadius: 22,
              shadowOpacity: 1,
              borderWidth: 0,
            }}
            arrowStyling={{ size: 20,thickness: 3, color: "#364b5b"}}
            isRTL={true}
            collapsibleContainerStyle={{
              paddingTop: 5,
              paddingBottom:10,
              paddingLeft:15,
              paddingRight:15
            }}
          >
            <Divider my={1}/>
            
            <VStack mt={1} space={2}>
              <Text style={{color:'#000000', fontSize: 12,fontWeight:'bold'}}>Currency</Text>
              <Text style={{backgroundColor:'#f3f3f3', padding:10, color:'#8C8C8C'}}>
                {currencyType}
              </Text>
              <Text style={{backgroundColor:'#f3f3f3', padding:10,color:'#8C8C8C'}}>
                {SingleCD.fee}
              </Text>
              

            </VStack>

            <VStack mt={3} space={2}>
              <VStack space={1}>
                <Text style={{color:'#000000', fontSize: 12,fontWeight:'bold'}}>Thumbnail</Text>
                <Text style={{fontSize: 11,color: '#8C8C8C'}}>Width 600 px, Height 350px. Format will be JPG, PNG, JPEG</Text>
                <Image 
                  style={styles.Thumbnail} 
                  source={{uri:SingleCD.thumbNailImagePath}}
                  alt='courseImg'
                  mb={2}
                  mt={2}
                  resizeMode="contain"
                />
              </VStack>

              <VStack space={1}>
                <Text style={{color:'#000000', fontSize: 12,fontWeight:'bold'}}>Intro Video</Text>
                <Text style={{fontSize: 11,color: '#8C8C8C'}}>Width 600 px, Height 350px. Format will be MP4</Text>
                <Video 
                // source={{uri:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}}
                source={{uri:SingleCD.introVideoPath}}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                // shouldPlay
                isLooping
                style={{ width: 360, height: 220, alignSelf: 'center',borderRadius: 10 }}
                useNativeControls
                />
              </VStack>
            </VStack>
          </CollapsibleView>

          <CollapsibleView 
            title={
              <HStack 
                style={{
                  flex:1,    
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  paddingTop:10,
                  paddingLeft:15,
                  paddingRight:15,
                  paddingBottom:10,
                  position: 'relative'
                }}
              >
              <VStack>
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>
                Time Duration 
                </Text>

              </VStack>
            </HStack>  
            }
            style={{
              borderRadius: 5,
              backgroundColor: "#FFFFFF",
              shadowColor: "rgba(0, 0, 0, 0.03)",
              shadowOffset: {
                width: 0,
                height: 0.5
              },
              shadowRadius: 22,
              shadowOpacity: 1,
              borderWidth: 0,
            }}
            // collapsibleContainerStyle={}
            arrowStyling={{ size: 20,thickness: 3, color: "#364b5b"}}
            isRTL={true}
            collapsibleContainerStyle={{
              paddingTop: 5,
              paddingBottom:10,
              paddingLeft:15,
              paddingRight:15
            }}
          >
            <Divider my={2}/>

            {/* <Text mt={4} style={{color:'#000000', fontSize: 13,fontWeight:'bold'}} >Course Duration</Text> */}

          {/* <Select 
            accessibilityLabel="Course Duration" 
            placeholder="select months" 
            mt={2}
            selectedValue={SingleCD.courseDuration}
            bg="#f3f3f3"
            variant="filled"
            >
          <Select.Item label="1 month" value="1month" />
          <Select.Item label="2 months" value="2month" />
          <Select.Item label="3 months" value="3month" />
          <Select.Item label="4 months" value="4month" />
          <Select.Item label="5 months" value="5month" />
          <Select.Item label="6 months" value="6month" />
          </Select> */}

        <FormControl mt={4}>
            <FormControl.Label _text={{
            color: "#000000",
            fontSize: 13,
            fontWeight: "bold",
            paddingBottom:1
          }}
          >
              Course Duration 
            </FormControl.Label>
            <Input
              isDisabled
              value={SingleCD.courseDuration} 
              variant="filled" 
              bg="#f3f3f3"
              placeholder="From"
              // style={{color:}}
              // InputRightElement={<IconButton 
              //   icon={<Icon as={Ionicons} name='calendar-outline' color='primary.50'/>}
                // onPress={() =>{
                //   setShowFromPicker(true)
                // }}
                // />}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormControl.Label _text={{
            color: "#000000",
            fontSize: 13,
            fontWeight: "bold",
            paddingBottom:1
          }}
          >
              From 
            </FormControl.Label>
            <Input
              isDisabled
              value={SingleCD.fromTime} 
              variant="filled" 
              bg="#f3f3f3"
              placeholder="From"
              // style={{color:}}
              // InputRightElement={<IconButton 
              //   icon={<Icon as={Ionicons} name='calendar-outline' color='primary.50'/>}
                // onPress={() =>{
                //   setShowFromPicker(true)
                // }}
                // />}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormControl.Label _text={{
            color: "#000000",
            fontSize: 13,
            fontWeight: "bold",
            paddingBottom:1
          }}
          >
              To 
            </FormControl.Label>
            <Input
              isDisabled
              value={SingleCD.toTime}  
              variant="filled" 
              bg="#f3f3f3" 
              placeholder="To"
              // InputRightElement={<IconButton 
              //   icon={<Icon as={Ionicons} name='calendar-outline' color='primary.50'/>}
                // onPress={()=> {
                //   setShowToPicker(true)
                // }}
                // />}
            />
          </FormControl>

          <Text mt={4} style={{color:'#000000', fontSize: 13,fontWeight:'bold'}} >Class Time</Text>

              <VStack space={2} mt={2}>
                { CTime ? <CTRender/> : null}
              </VStack>
          
          </CollapsibleView>

          <CollapsibleView 
            title={
              <HStack 
                style={{
                  flex:1,    
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  paddingTop:10,
                  paddingLeft:15,
                  paddingRight:15,
                  paddingBottom:10,
                }}
                space={2}
              >
              <View>
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>
                Live 
                </Text>
                   {/* <Text style={{fontSize: 12,color: '#8C8C8C'}} mt={2}>
                 Schedule Live Class
                </Text> */}
              </View>
            </HStack>  
            }
            style={{
              borderRadius: 5,
              backgroundColor: "#FFFFFF",
              shadowColor: "rgba(0, 0, 0, 0.03)",
              shadowOffset: {
                width: 0,
                height: 0.5
              },
              shadowRadius: 22,
              shadowOpacity: 1,
              borderWidth: 0,
            }}
            arrowStyling={{ size: 20,thickness: 3, color: "#364b5b"}}
            isRTL={true}
            collapsibleContainerStyle={{
              paddingTop: 5,
              paddingBottom:10,
              paddingLeft:15,
              paddingRight:15
            }}
          >
            {/* <Divider my={1}/> */}
            <VStack mt={1} space={2}>
           <TouchableOpacity
            style={{
            backgroundColor:"#F0E1EB",
            paddingTop:7,
            paddingBottom:7,
            paddingLeft:15,
            paddingRight:15,
            borderRadius:7
            }}
            onPress={()=> navigation.navigate('GTList')}
            >
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space={2} alignItems="center">
                <Image
                source={require('../../../assets/live.png')}
                alt="live"
                resizeMode={"contain"}
                style={{width:35,height:35, maxHeight:35,maxWidth:35}}
                />
                <Text style={{fontSize:14}}>Go to Live</Text>
              </HStack>
              <Image
              source={require('../../../assets/arrow-right.png')}
              alt="arrow right"
              resizeMode={"contain"}
              style={{width:25,height:25, maxHeight:35,maxWidth:35}}
              />
            </HStack>
           </TouchableOpacity>

           <TouchableOpacity
           style={{
           backgroundColor:"#F0E1EB",
           paddingTop:10,
           paddingBottom:10,
           paddingLeft:17,
           paddingRight:17,
           borderRadius:7
           }}
           onPress={() =>navigation.navigate('LiveAssessmentList')}
          >
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space={4} alignItems="center">
                <Image
                source={require('../../../assets/checkpad.png')}
                alt="live"
                resizeMode={"contain"}
                style={{width:25,height:25, maxHeight:30,maxWidth:30}}
                />
                {/* <Icon as={Ionicons} name="clipboard" size="5"/> */}
                <Text style={{fontSize:14}}>Assessments</Text>
              </HStack>
              <Image
              source={require('../../../assets/arrow-right.png')}
              alt="arrow right"
              resizeMode={"contain"}
              style={{width:25,height:25, maxHeight:35,maxWidth:35}}
              />
            </HStack>
           </TouchableOpacity>
            </VStack>
          </CollapsibleView>

          
          
          <CollapsibleView 
            title={
              <HStack 
                style={{
                  flex:1,    
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  paddingTop:10,
                  paddingLeft:15,
                  paddingRight:15,
                  paddingBottom:10,
                }}
              >
              <View>
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>
                FAQ
                </Text>
                
              </View>
            </HStack>  
            }
            style={{
              borderRadius: 5,
              backgroundColor: "#FFFFFF",
              shadowColor: "rgba(0, 0, 0, 0.03)",
              shadowOffset: {
                width: 0,
                height: 0.5
              },
              shadowRadius: 22,
              shadowOpacity: 1,
              borderWidth: 0,
            }}
            arrowStyling={{ size: 20,thickness: 3, color: "#364b5b"}}
            isRTL={true}
            collapsibleContainerStyle={{
              // paddingTop: 5,
              // paddingBottom:10,
              // paddingLeft:15,
              // paddingRight:15
            }}
          >
          <Divider my={2}/>
          <VStack mt={1} space={2}>

          { FaqData ? FaqRender() : null}
          
          {/* <HStack>
              <HStack style={{ flex:1,justifyContent:'flex-end',alignItems:'center'}}>
                <Text style={{color:'#000000', fontWeight: 'bold',fontSize:15,padding:10}}>Create New</Text>
              </HStack>
              </HStack> */}
          </VStack>
          </CollapsibleView>

        </View>
        </ScrollView>
      </SafeAreaView>
  )
}

export default LCourseDetails

const styles = StyleSheet.create({
  container: {
    // width: width,
    height: height,
    backgroundColor: '#F3F3F3'
  },
  TopContainer: {
    marginTop:30,
    marginLeft:10,
    marginRight:10,
    marginBottom:30
  },
  courseImg:{
    height: height/4,
    borderRadius:5
  },
  Thumbnail:{
    height: height/4,
    borderRadius:5,
  },
  learner_chat:{
    width:45,
    height:45,
  },
  chatTile:{
    padding:10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    shadowColor: "rgba(0, 0, 0, 0.03)",
    shadowOffset: {
      width: 0,
      height: 0.376085489988327
    },
    shadowRadius: 21.951963424682617,
    shadowOpacity: 1001,
    justifyContent:"space-between"
  }
})