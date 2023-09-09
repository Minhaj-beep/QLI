import { View, ActivityIndicator, StyleSheet,Dimensions,ScrollView, TouchableOpacity,KeyboardAvoidingView,Platform,Linking, Pressable } from 'react-native';
import React,{useState,useEffect,useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Image, Text, HStack,VStack,IconButton,Icon,Divider,Modal, Badge, Container, Input,FormControl} from 'native-base';
import AppBar from '../../components/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import CollapsibleView from '@eliav2/react-native-collapsible-view';
import RenderHtml from 'react-native-render-html';
import Video from 'react-native-video';
import {useDispatch,useSelector} from 'react-redux';
import FAQContent from './components/FAQContent';
import { setAssessment } from '../../Redux/Features/CourseSlice';
import moment from 'moment';
import { socket } from '../../StaticData/SocketContext';
import DocumentPicker, { types } from 'react-native-document-picker'
import { EnableDemoClass } from '../../Functions/API/EnableDemoClass';
import VideoPlayer from 'react-native-video-controls';
const { width, height } = Dimensions.get('window');
import RNFetchBlob from 'rn-fetch-blob';
import { GetLearnersList } from '../../Functions/API/GetLearnersList';
import { GetReview } from '../../Functions/API/GetReview';
import { useNavigation } from '@react-navigation/native';
import { AirbnbRating } from 'react-native-ratings';

const RecordedCorseDetails = ({props}) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const scrollViewRef = useRef()
  const [ChatArray, setChatArray] = useState([]); 
  const [msgList, setMsgList] = useState([])
  const [currentMessage, setCurrentMessage] = useState(null)
  const [readyFile, setReadyFile] = useState(false)
  const [uploadFile, setUploadFile] = useState({})
  const [isChatOpen, setIsChatOpen] = useState (false)
  const [chatLoading, setChatLoading] = useState(false)
  const [fileToBinary, setFileToBinary] = useState(null);
  const [ChatText, setChatText] = useState();
  const [ShowRChat, setRChat] = useState(false);
  const [ShowStudList, setStudList] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  const [currencyType, setCurrencyType] = useState()
  const ThumbnailImgPath = useSelector(state => state.UserData.CCThumbImg);
  const IntroVideoPath = useSelector(state => state.UserData.CCIntroVideo);
  const Overview = useSelector(state => state.UserData.CCOverview);
  const FaqData = useSelector(state => state.UserData.CCFAQ);
  const SingleCD = useSelector(state => state.UserData.SingleCD);
  const Name = useSelector(state => state.UserData.profileData.fullName);
  const CFee = SingleCD.fee;  
  const CourseCode = SingleCD.courseCode;  
  console.log(  `
    Course code = ${CourseCode}
  `)
  const ThumbnailImg = ThumbnailImgPath
  const IntroVideo = IntroVideoPath
  const email = useSelector(state => state.Login.email)
  const BaseURL = useSelector(state => state.UserData.BaseURL)
  const JWT_token = useSelector(state => state.Login.JWT)
  console.log('_____________________________________________JWT__________________________________________', JWT_token)
  const [isDemoActive, setIsDemoActive] = useState(SingleCD.isDemo)
  const OverC = Overview.courseOverview 
  // console.log(SingleCD)
  const OverviewSource ={
    html:`<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    </head> 
    <body>${OverC}</body>`
  }

  const OpenDoc = async(props) =>{
    await Linking.openURL(props)
  }

  useEffect(()=>{
    setIsChatOpen(ShowRChat)
  },[ShowRChat])
  
  useEffect(()=>{
    if(isChatOpen){
      setChatLoading(true)
      // socket.connect()
      socket.open()
      socket.on("connection-success", async(response) => {
        console.log(`Socket connected ${response.socketId}`);
      })
      // console.log('courseCode:', CourseCode,  'userId:', JWT_token, 'userName:', Name)
      socket.emit('join-instructor', { courseCode: CourseCode,  userId: JWT_token, userName: Name }, async res => {
        console.log(`join-instructor ${res}`);
        console.log(res)
      })
      socket.emit("resetMessageCount", { courseCode: CourseCode, userType: JWT_token }, (response) => {
        console.log("Reset Message Count Ran!!!!!!!!!!!!!!!!!!!!!", response)
      });
      socket.emit("getPreviousMessage", { courseCode: CourseCode, ticketType: "COURSE" }, (response) => {
        console.log("getPreviousMessage", response)
        setMsgList(chatMessages => ([
          ...response
        ]));
        setChatLoading(false)
      })
      socket.on("message", receiveMessages)
    } else {
      socket.off("message", receiveMessages)
      socket.disconnect()
      socket.close();
      socket.on("disconnect", async () => {
          console.log("client disconnected from server");
      })
    }
  },[isChatOpen])

  const receiveMessages = useCallback((response) => {
    console.log("recev live chat-------->");
    console.log(response);
    if (response.type == "FILE") {
        setMsgList(chatMessages => ([
            ...chatMessages,
            {
                userName: response.userName,
                time: response.createdAt,
                message: response.message,
                type: response.type,
                fileName: response.fileName,
            }
        ]));
    } else {
        setMsgList(chatMessages => ([
            ...chatMessages,
            {
                userName: response.userName,
                time: response.createdAt,
                message: response.message,
                type: response.type,
            }
        ]));
    }
  }, [])

  const GetFile = async() => {
    let result = await DocumentPicker.pickSingle({allowMultiSelection: false, type:[types.pdf, types.doc, types.zip, types.docx, types.plainText, DocumentPicker.types.images], copyTo:"documentDirectory"});
    console.log(result)
    // console.log(RNFetchBlob.wrap(result.fileCopyUri))
    let fileLocation = result.uri.replace("content://", "file://")
    // fileLocation = "file://"+fileLocation
    RNFetchBlob.fs.readFile(result.uri, 'base64')
    .then((data) => {
      const binaryData = RNFetchBlob.wrap(`data:${result.type};base64,${data}`);
      // use binaryData in any method that requires binary data
      let binaryDataReplace = binaryData.replace("RNFetchBlob-file://", "")
      setFileToBinary(binaryDataReplace)
      console.log('Binary data: ', binaryData)
    })
    .catch((error) => {
      console.log('Error reading file:', error);
    });
    if(result){
      // onConfrimUpload(result)
      setUploadFile(result)
      console.log(result)
    }
}

  // For text msg
  const sendMsg = (Message) => {
    setChatLoading(true)
    console.log('Send Message: ', Message)
        socket.emit("sendMessage", {
            message: Message,
            courseCode: CourseCode,
            userName: Name,
            ticketType: "COURSE",
            courseType: "RECORDED",
            userId: JWT_token,
            type: "TEXT"
        }, () => {
            console.log("sendMessage callback!")
            setMsgList(chatMessages => ([
                ...chatMessages,
                {
                    userName: Name,
                    dt: new Date(),
                    message: Message,
                    type: "TEXT"
                }
            ]))
            setChatLoading(false)
        })
}
// For file upload
const sendFiles = (e) => {

    if (e.target.files) {
        let files = e.target.files;
        setFile({
            fileData: files[0],
            fileName: files[0].name
        });
    }
}
const onConfrimUpload = (data) => {
  setChatLoading(true)
  console.log('Upload file')
  socket.emit("upload", {
    file: fileToBinary,
    fileName: data?.name,
    courseCode: CourseCode,
    roomName: CourseCode,
    userName: Name,// localstorage
    userId: JWT_token,// localstorage
    ticketType: "COURSE",
    courseType: "RECORDED",
    type: "FILE",
    app: true
  }, (res) => {
      console.log('Upload file')
        console.log(res)
        setMsgList(chatMessages => ([
            ...chatMessages,
            {
                userName: Name,
                dt: new Date(),
                type: "FILE",
                fileName: res.fileName,
                message: res.message
            }
        ]))
        setChatLoading(false)
    });
}


const requestDemoClass = async () => {
  try{
    const result = await EnableDemoClass(email, CourseCode)
    if(result.message === 'Successfully demo class enabled'){
      setIsDemoActive(true)
    } else {
      alert('Please try again!')
      console.log('requestDemoClass 1 :', result)
    }
  } catch (e) {
    alert('Please try again!')
    console.log('requestDemoClass 2 :', e)
  }
}

  const getNewMessageCount = (courseCode) => {
    const course = props.find(c => c.courseCode === courseCode);
    return course && course.newMessageCount !== 0 ? course.newMessageCount : null;
  }

  useEffect(()=>{
    getAllReviews()
    if(SingleCD.currency === 'USD'){
        setCurrencyType('$')
      }else{
        setCurrencyType('₹')
      }
  },[])

  const UpdateChat = () => {
    var myHeaders = new Headers();
    myHeaders.append("gmailUserType", "INSTRUCTOR");
    myHeaders.append("token", email);
    myHeaders.append("Content-Type", "application/json");

    var CDate = new Date()
    // var timeS = CDate.getDate()+'/'+CDate.getMonth()+'/'+CDate.getFullYear()+', '+CDate.getHours()+':'+CDate.getMinutes()
    console.log(CDate)
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

    fetch(BaseURL+'v1/ticket/raiseCourseTicket', requestOptions)
      .then(response => response.json())
      .then(result => {
        if(result.status > 200){
          console.log(result.message)
        }
      })
      .catch(error => {
        // alert('Error: ' +error)  
        console.log('Error:', error)
      });

  }

  const AppBarContent = {
    title: 'Courses',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  const FaqRender = () =>{
    return FaqData.map((data, index) =>{
      // console.log(data._id);
      const faqD = {
          question:data.question,
          answer:data.answer,
          navigation:navigation
      }
      // console.log(faqD)
      return(
        <View key={index}>
          <FAQContent props={faqD}/>
        </View>
      )
    })
  }

  const getAllReviews = async () => {
    try {
      const result = await GetReview(email, CourseCode)
      if(result.status === 200) {
        console.log('--------------ALL REVIWES------------------', result)
        setReviewList(result.data)
        // setLearnerList(result.data)
      } else {
        console.log('--------------getAllReviews error 1------------------', result)
        alert('Server down! Kindly check afetr sometime.')
      }
    } catch (e) {
      console.log('--------------getAllReviews error 2------------------', e)
      alert('Server down! Kindly check afetr sometime.')
    }
  }

  const getStudentList = () =>{
    const API = BaseURL+'eachCourseLearnersList/?courseCode='+SingleCD.courseCode
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
        let learner = result.data
        console.log(learner.length)
        setLearnerList(result.data)
      }else{
        // alert(result.message)
        console.log(result)
      }
      // console.log(result)
    })
    .catch(error=> {
      console.log(error)
      // alert('Error: ' + error);
    })
  }

  const StudRender = () => {
   return reviewList.map((RD, index) => {
    const date = new Date(RD.createdTime)
    return (
      <VStack key={index} mt={4}>
        <HStack space={2} style={styles.chatTile}>
          <Container>
            {
              RD.hasOwnProperty('studentImage') ? 
              <Image source={{uri: RD.studentImage}} alt="profile" size={10} rounded={20}/>
              :
              <Image source={require('../../../assets/personIcon.png')} alt="profile" size={10} rounded={20}/>
            }
          </Container>
          <VStack space={1}>
            <HStack justifyContent={'space-between'} width={width / 1.4}>
              <Text color={'#000'} fontSize={14} fontWeight={'bold'} maxWidth={width / 3}>{RD.studentName}</Text>
              <Text color={'#000'} fontSize={9} fontWeight={'bold'} alignSelf={'flex-end'}>{date.toLocaleDateString('en-US')}</Text>
            </HStack>
            <HStack space={1} alignSelf={"flex-start"}>
              {
                [...Array(RD.rating)].map((e, i) =>{
                    return (
                      <Image
                        key={i}
                        source={require('../../../assets/star.png')}
                        alt="rating"
                        size="3"
                      />
                    );
                  }
                )
              }
            </HStack>
            <Text color={'greyScale.800'} fontSize={12} fontWeight={500} maxW={width / 1.3}>
            “ {RD.reviewContent} "
            </Text>
          </VStack>
        </HStack>
      </VStack>
    )
   })
  }

  const RenderChat = () => {
    return msgList.map((data,index) =>{
      const date = new Date(data.dt).toLocaleString()
      var alignment = data.userName === Name ? "flex-end" : "flex-start"

      return(
        <>
        {
          data.userName === Name ?
            <VStack key={index} mt={4} alignSelf='flex-end'>
              <HStack alignItems="center" alignSelf={'flex-end'} space={2}>
                <Text style={{fontSize:8, color:'#8C8C8C' }}>{date}</Text>
                <Text style={{fontSize:10,fontWeight:'bold', color:"#000000",  }}>ME</Text>
              </HStack>
              {
                data.type === 'TEXT' ?
                <Text style={{fontSize:11, color:'#000000', maxWidth:width/3, alignSelf:'flex-end'}}>{data.message}</Text>
                :
                <HStack alignItems={"center"} bg={'#b5b5b5'} borderRadius={10} padding={2} width={'100%'}>
                  <IconButton
                    onPress={()=>{
                      OpenDoc(data.message)
                    }}
                    icon={<Icon size='lg' as={MaterialCommunityIcons} name='download-circle' color='#395061'/>}
                  />
                  <View>
                    <Text numberOfLines={2} style={{fontSize:11, color:'#000000', maxWidth:width/3, marginLeft:5, alignSelf:'flex-end'}}>{data.message.replace('https://ql-files.s3.ap-south-1.amazonaws.com/ticket-files/', '').slice(14).split('%20').join(' ')}</Text>
                  </View>
                </HStack>
              }
            </VStack>
          :
            <VStack key={index} mt={4} alignSelf='flex-start'>
              <HStack alignItems="center" alignSelf={'flex-start'} space={2}>
                <Text style={{fontSize:10,fontWeight:'bold', color:"#000000",  }}>{data.userName}</Text>
                <Text style={{fontSize:8, color:'#8C8C8C' }}>{date}</Text>
              </HStack>
              {
                data.type === 'TEXT' ?
                <Text style={{fontSize:11, color:'#000000', maxWidth:width/3, alignSelf:'flex-start'}}>{data.message}</Text>
                :
                <HStack alignItems={"center"} bg={'#b5b5b5'} borderRadius={10} padding={2} width={'100%'}>
                  <IconButton
                    onPress={()=>{
                      OpenDoc(data.message)
                    }}
                    icon={<Icon size='lg' as={MaterialCommunityIcons} name='download-circle' color='#395061'/>}
                  />
                  <View>
                    <Text numberOfLines={2} style={{fontSize:11, color:'#000000', maxWidth:width/3, marginLeft:5, alignSelf:'flex-end'}}>{data.message.replace('https://ql-files.s3.ap-south-1.amazonaws.com/ticket-files/', '').slice(14).split('%20').join(' ')}</Text>
                  </View>
                </HStack>
              }
            </VStack>
        }
        </>
      )
    })
  }
  return (
      <View keyboardShouldPersistTaps={'always'}>
          <ScrollView style={styles.container} nestedScrollEnabled={true} keyboardShouldPersistTaps={'always'}>
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
           {Object.keys(reviewList).length > 0 ? <StudRender/> : <Text>No review found!</Text>}
      
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
            >
            <VStack space={2} mt={3}>
              {/* <VStack>
                <HStack alignItems="center" space={2}>
                <Text style={{fontSize:10,fontWeight:'bold', color:"#000000" }}>Moderator</Text>
                <Text style={{fontSize:8, color:'#8C8C8C' }}>15, Feb, 2022 10:00 AM</Text>
                </HStack>
                <Text style={{fontSize:11, color:'#000000'}}>Any Queries ?</Text>
              </VStack> */}

            {msgList ? <RenderChat/> : null}

            </VStack>
            </ScrollView>

            <FormControl>
            <Input 
              variant="filled" bg="#f3f3f3" value={ChatText} placeholder="Write a message"
              InputRightElement={
              <><IconButton
                onPress={()=>{
                  GetFile()
                  setReadyFile(true)
                }}
                icon={<Icon size='lg' as={Entypo} name='attachment' color='#395061'/>}
              />
              <IconButton
                onPress={()=>{
                  if(ChatText != '' && ChatText != " "){  
                    let CDate = new Date()
                    let message = {
                          "message":ChatText,
                          "messageTime":CDate
                        }
                      console.log(message)
                    ChatArray.push(message)
                    // UpdateChat()
                    setChatText('')
                    setCurrentMessage(ChatText)
                    sendMsg(ChatText)
                  }
                }}
                icon={<Icon size='lg' as={Ionicons} name='send' color='#395061'/>}
              /></>
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
            {
              readyFile && Object.keys(uploadFile).length ? 
              <VStack width={'100%'} bottom={0} position={'absolute'} backgroundColor={'blue.300'}>
                <IconButton
                    onPress={()=>{
                      setUploadFile({})
                      setReadyFile(false)
                    }}
                    style={{alignSelf:"flex-start", }}
                    marginLeft={1}
                    icon={<Icon size='lg' as={Ionicons} name='close-circle' color='#395061'/>}
                  />
                <HStack justifyContent={'space-between'} paddingBottom={5} paddingRight={2} paddingLeft={5} width={'100%'} >
                  <Text numberOfLines={4} style={{fontSize:11, color:'#000000', maxWidth:width/2, alignSelf:'center'}}>{uploadFile.name}</Text>
                  <IconButton
                    onPress={()=>{
                      onConfrimUpload(uploadFile)
                      setUploadFile({})
                      setReadyFile(false)
                    }}
                    style={{alignSelf:"flex-end", }}
                    icon={<Icon size='lg' as={Ionicons} name='send' color='#395061'/>}
                  />
                </HStack>
              </VStack>
              : null
            }
            {
              chatLoading ? 
              <View style={{width:"100%", position:"absolute", backgroundColor:"white", height:"100%", alignItems:"center", justifyContent:"center"}}>
                <ActivityIndicator animating color={'#395061'} size={"large"} />
              </View> : null
            }
        </Modal.Content>
      </Modal>


        <View style={styles.TopContainer}>
          <Image 
            style={styles.courseImg} 
            source={{uri: SingleCD.thumbNailImagePath}}
            alt='courseImg'
            mb={2}
            resizeMode='cover'
          />
          <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>{SingleCD.courseName}</Text>
          <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>{currencyType} {SingleCD.fee}</Text>
          <HStack space={2} justifyContent={'space-between'} mt="2" alignItems="center">
            <HStack space={2} alignItems="center">
              {
                  SingleCD.hasOwnProperty('rating') ?
                  <>
                  <AirbnbRating
                      count={5}
                      isDisabled={true}
                      showRating={false}
                      defaultRating={`${SingleCD.rating}`}
                      size={15}
                      value={`${SingleCD.rating}`}
                  />
                      {
                          !Number.isInteger(SingleCD.rating) ?
                          <Text style={{fontSize: 14, color: '#364b5b'}}>{SingleCD.rating.toFixed(1)} ({SingleCD.ratingCount})</Text>
                          :
                          <Text style={{fontSize: 14, color: '#364b5b'}}>{SingleCD.rating} ({SingleCD.ratingCount})</Text>
                      }
                  </>
                  : 
                  <>
                  <AirbnbRating
                  count={5}
                  isDisabled={true}
                  showRating={false}
                  defaultRating={0}
                  size={10}
                  value={0}
                  />
                  <Text style={{fontSize: 14, color: '#364b5b'}}>0 (0)</Text>
                  </>
              }
              <Text onPress={()=>setStudList(true)} style={{fontSize: 15,color: '#364b5b',fontWeight: 'bold',paddingLeft:1}}>
                View Reviews
              </Text>
            </HStack>
            {/* {SingleCD.courseStatus === 'ACTIVE' ? <TouchableOpacity
            onPress={()=>setStudList(true)}
            >
            <HStack space={2}> 
                <Image
                alt="graduate icon"
                source={require('../../../assets/graduate_student.png')}
                size="4" 
                />
                  <Text style={{fontSize: 15,color: '#364b5b',fontWeight: 'bold',}}>
                      {SingleCD.learnersCount} Learners
                  </Text>
              </HStack>
            </TouchableOpacity> : null} */}
          </HStack>

       
        <HStack space={2} mt='3' mb='4' alignItems="center">
              <View style={{flexDirection:"row", width:width*0.95, alignItems:"center", justifyContent:"space-between"}}>
                {SingleCD.courseStatus === 'INREVIEW' || SingleCD.courseStatus === 'ACTIVE' || SingleCD.courseStatus === 'BANNED' ? 
                <>
                  <TouchableOpacity
                    onPress={()=>setRChat(true)}
                  >
                    <HStack>
                      <HStack bg={'gray.300'} space={1} padding={2} borderRadius={5} alignItems="center">
                      <Icon size='sm' as={FontAwesome5} name='envelope' color='primary.50'/>
                      <Text color={'primary.50'} bold onPress={()=>{
                        setRChat(true)
                      }} style={{fontSize:11, borderRadius:3}}>Raise a Ticket</Text>
                    </HStack>
                      {
                        getNewMessageCount(CourseCode) !== null ?
                        <Badge  bg={'amber.500'} rounded={'lg'} right={4} top={-6} zIndex={1} variant="solid"
                            alignSelf="flex-start"  _text={{ fontSize: 7,}}>
                            {getNewMessageCount(CourseCode)}
                        </Badge>
                        : null
                      }
                    </HStack>
                  </TouchableOpacity>
                </>
                :null}
                <>
                  <TouchableOpacity
                    onPress={()=>{
                      if(SingleCD.courseStatus === 'BANNED' || SingleCD.courseStatus === 'REJECTED') {
                        return null
                      } else {
                        navigation.navigate('StudentPreview', {type: 'recorded'})
                      }
                    }}
                  >
                  <HStack bg={'gray.300'} space={1} padding={2} borderRadius={5} alignItems="center">
                    {/* <Icon size='sm' as={FontAwesome5} name='envelope' color='primary.50'/> */}
                    <Text color={SingleCD.courseStatus === 'BANNED' || SingleCD.courseStatus === 'REJECTED' ? 'gray.50' : 'primary.50'} bold onPress={()=>{
                        if(SingleCD.courseStatus === 'BANNED' || SingleCD.courseStatus === 'REJECTED') {
                          return null
                        } else {
                          navigation.navigate('StudentPreview', {type: 'recorded'})
                        }
                    }} style={{fontSize:11, borderRadius:3}}>Student Preview</Text>
                  </HStack>
                  </TouchableOpacity>
                </>
             </View>
          </HStack>

          {
            SingleCD.courseStatus === 'BANNED' || SingleCD.courseStatus === 'REJECTED' ?
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
                      Rejected
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
                <VStack space={2}>
                  <Text style={{fontSize: 12,color: '#ff0000'}}>Reason for rejection</Text>
                  {
                    SingleCD.rejectionComments.map((data, index)=> {
                      console.log(index)
                      return(
                        <Text style={{fontSize: 15,color: '#000000', maxWidth:width/2}}>{index + 1}. {data.comment}</Text>
                      )
                    })
                  }
                </VStack>
              </CollapsibleView>
            : null
          }
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
                {/* <Text style={{fontSize: 12,color: '#8C8C8C'}}>
                  You can edit course overview
                </Text> */}
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
            <VStack space={2}>
              <Text style={{fontSize: 12,color: '#8C8C8C'}}>Course Title</Text>
              <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold',maxWidth:width/1.4}}>{Overview.courseName}</Text>
              <HStack space={2} mt={2}>
                <Text style={{fontSize: 12,color: '#8C8C8C'}}>Category</Text>
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold', maxWidth:width/2}}>{Overview.categoryName}</Text>
              </HStack>
              <HStack space={2}>
                <Text style={{fontSize: 12,color: '#8C8C8C'}}>Sub-Category</Text>
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold', maxWidth:width/1.8}}>{Overview.subCategoryName}</Text>
              </HStack>

              <Text style={{fontSize: 12,color: '#8C8C8C'}}>Course Overview</Text>
              {/* {Overview.courseOverview}                 */}
              {/* {"\n"} */}
            </VStack>
            {/* <TouchableOpacity style={styles.RenderP}> */}
              <TouchableOpacity style={styles.RenderH}>
                <RenderHtml
                  contentWidth={width/3}
                  source={OverviewSource}
                  baseStyle={{color:'#000'}}
                //   renderersProps={renderersProps}
                  // onLinkPress={(evt, href) => { Linking.openURL(href) }}
                />
              </TouchableOpacity>
            {/* </TouchableOpacity> */}
                {/* <WebView 
                  originWhitelist={['*']}
                  source={OverviewSource}
                  style={{minHeight:height/5,zIndex:100}}
                /> */}
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
                  Pricing 
                </Text>
                {/* <Text style={{fontSize: 12,color: '#8C8C8C'}}>
                  You can edit course Pricing
                </Text> */}
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
            <VStack mt={1} space={2}>
              <Text style={{color:'#000000', fontSize: 12,fontWeight:'bold'}}>Currency</Text>
              <Text style={{backgroundColor:'#f3f3f3', padding:10,borderRadius:3, color:'#8C8C8C'}} borderWidth={1} >
                {currencyType}
              </Text>
              <Text style={{backgroundColor:'#f3f3f3', padding:10,borderRadius:3, color:'#8C8C8C'}} borderWidth={1} >
                {CFee}
              </Text>
              

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
                Thumbnail & Intro 
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
              <VStack space={1}>
                <Text style={{color:'#000000', fontSize: 12,fontWeight:'bold'}}>Thumbnail</Text>
                <Text style={{fontSize: 11,color: '#8C8C8C'}}>Width 600 px, Height 350px. Format will be JPG, PNG, JPEG</Text>
                <Image 
                  style={styles.Thumbnail} 
                  source={{uri:ThumbnailImg}}
                  alt='courseImg'
                  mb={2}
                  mt={2}
                  resizeMode="contain"
                />
              </VStack>

              {/* <Pressable space={1} zIndex={1000}> */}
                <Text style={{color:'#000000', fontSize: 12,fontWeight:'bold'}}>Intro Video</Text>
                <Text style={{fontSize: 11,color: '#8C8C8C'}}>Width 600 px, Height 350px. Format will be MP4</Text>
                {/* <Video 
                // source={{uri:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}}
                source={{uri:IntroVideo}}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                controls={true}
                paused={true}
                // shouldPlay
                isLooping
                style={{ width: 360, height: 220, alignSelf: 'center',borderRadius: 10 }}
                useNativeControls
                /> */}
                <View style={{width: '100%', height: 220, }}>
                  <VideoPlayer
                    source={{uri: IntroVideo}}
                    style={{ width: '100%', zIndex:1000, elevation:1000, alignSelf: 'center' }}
                    onError={()=>{
                      console.log('Something went wrong...');
                    }}
                    pictureInPicture={true}
                    navigator={navigation}
                    isFullscreen={false}
                    tapAnywhereToPause = {false}
                    onPlay = {() => {}}
                    paused={true}
                  />
                </View>
              {/* </Pressable> */}
              {/* <HStack>
              <HStack style={{ flex:1,justifyContent:'flex-end',alignItems:'center'}}>
                <Text style={{color:'#000000', fontWeight: 'bold',fontSize:15,padding:10}}>Save Changes</Text>
              </HStack>
              </HStack> */}

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
                Videos 
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
           onPress={()=>navigation.navigate('LiveVideos')}
          >
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space={2} alignItems="center">
                <Image
                source={require('../../../assets/live.png')}
                alt="live"
                resizeMode={"contain"}
                style={{width:35,height:35, maxHeight:35,maxWidth:35}}
                />
                <Text style={{fontSize:14}}>Live Videos</Text>
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
           style={{ backgroundColor:"#F0E1EB", paddingTop:10, paddingBottom:10, paddingLeft:17, paddingRight:17, borderRadius:7 }}
           onPress={()=>{
            dispatch(setAssessment(false))
            navigation.navigate('Chapters')
          }}
          >
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space={4} alignItems="center">
                <Image
                source={require('../../../assets/upload.png')}
                alt="live"
                resizeMode={"contain"}
                style={{width:25,height:25, maxHeight:30,maxWidth:30}}
                />
                <Text style={{fontSize:14}}>Uploaded Videos</Text>
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
           paddingTop:3,
           paddingBottom:3,
           paddingLeft:12,
           paddingRight:17,
           borderRadius:7
           }}
           onPress={()=>{
            dispatch(setAssessment(true))
            navigation.navigate('Chapters')
          }}
          >
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space={1} alignItems="center">
                {/* <Image
                source={require('../../assets/upload.png')}
                alt="live"
                resizeMode={"contain"}
                style={{width:25,height:25, maxHeight:30,maxWidth:30}}
                /> */}
                <IconButton 
                    icon={<Icon as={Ionicons} name="clipboard"/>} 
                    borderRadius='full'
                    bg='#F0E1EB' 
                    _icon={{color: "#395061",size: "lg"}}
                />
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
    </View>
  )
}

export default RecordedCorseDetails

const styles = StyleSheet.create({
  container: {
    // width: width,
    height: height,
    backgroundColor: '#F3F3F3',
  },
  TopContainer: {
    marginTop:30,
    marginLeft:10,
    marginRight:10,
    marginBottom:30
  },
  courseImg:{
    height:height/4,
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
  },
  RenderP:{
    // position:"relative",
    // maxHeight: height*height,
    // minHeight: height/3
  },
  RenderH:{
    // position: "absolute",
    zIndex:1000,
  }
})