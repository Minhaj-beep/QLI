import { StyleSheet, ActivityIndicator, Dimensions, Linking, TouchableOpacity } from 'react-native';
import React,{useState,useEffect, useRef, useCallback} from 'react';
import { View, Text, HStack, VStack, Icon, Container, Image, ScrollView, Button, Modal, IconButton, Badge, FormControl, Input, Select } from "native-base"
import { SafeAreaView } from 'react-native-safe-area-context';
import {useDispatch,useSelector} from 'react-redux';
import {setAssessmentData} from '../../Redux/Features/CourseSlice'
const {width, height} = Dimensions.get('window')
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import DocumentPicker, { types } from 'react-native-document-picker'
import { socket } from '../../StaticData/SocketContext';
import { setLoading } from '../../Redux/Features/authSlice';
import RNFetchBlob from 'rn-fetch-blob';
import { useNavigation } from '@react-navigation/native';

const AssessmentCard = ({props, pushData}) => {
    const navigation = useNavigation()
    // console.log(pushData.hasOwnProperty('assessmentCode'), 'This is the data')

  const email = useSelector(state => state.Login.email);
  const BaseURL = useSelector(state => state.UserData.BaseURL);
  console.log(email, ' + ', BaseURL)
  const dispatch = useDispatch()
  const [AssessmentList, setAssessmentList] = useState()
  // socket io hooks and variables
  const [ChatArray, setChatArray] = useState([]); 
  const [msgList, setMsgList] = useState([])
  const [currentMessage, setCurrentMessage] = useState(null)
  const [readyFile, setReadyFile] = useState(false)
  const [uploadFile, setUploadFile] = useState({})
  const [chatLoading, setChatLoading] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState (pushData.hasOwnProperty('assessmentCode') ? true : false)
  const [ChatText, setChatText] = useState();
  const [ShowRChat, setRChat] = useState(pushData.hasOwnProperty('assessmentCode') ? true : false);
  const [fileToBinary, setFileToBinary] = useState(null);
  const scrollViewRef = useRef();
  const JWT_token = useSelector(state => state.Login.JWT)
  const Name = useSelector(state => state.UserData.profileData.fullName)
  const [CourseCode, setCourseCode] = useState(null)

  useEffect(()=>{
    GetIAssessment();
  },[])

  // Socket code starts
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
      socket.emit("getPreviousMessage", { courseCode: CourseCode, ticketType: "ASSESSMENT" }, (response) => {
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

  const OpenDoc = async(link) =>{
    console.log(link);
    const supported = await Linking.canOpenURL(link);
    if (supported) {
      await Linking.openURL(link);
    } else {
        alert('Unable to open URL, Please try again later!')
    }
  };

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

  const sendMsg = (Message) => {
      setChatLoading(true)
      console.log('Send Message: ', Message)
          socket.emit("sendMessage", {
              message: Message,
              courseCode: CourseCode,
              roomName: CourseCode,
              userName: Name,
              ticketType: "ASSESSMENT",
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
      ticketType: "ASSESSMENT",
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
  // Socket code ends

  const GetIAssessment = () =>{
    dispatch(setLoading(true));
    const API = BaseURL+'getAssessmentbyEmail'
    var requestOptions = {
      method:'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'gmailUserType':'INSTRUCTOR',
        'token':email
      }
    }

    fetch(API, requestOptions)
    .then(response => response.json())
    .then(result => {
      if(result.status === 200){
        // dispatch(setIAssessmentList(result.data))
        console.log(result.data)
        dispatch(setLoading(false));
        let AssessmentL = result.data
        if(AssessmentL.length != 0){
          setAssessmentList(AssessmentL)
        }else if(AssessmentL.length === 0){
          setAssessmentList(null)
        }
      }else{
        // alert(result.message)
        dispatch(setLoading(false));
      }
    }).catch(error => {
      dispatch(setLoading(false));
      console.log(error)
      // alert('CError:'+error)
    })
  }

  // socket UI component
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
  // socket UI component ends

  const getNewMessageCount = (courseCode) => {
    const course = props.find(c => c.courseCode === courseCode);
    return course && course.newMessageCount !== 0 ? course.newMessageCount : null;
  }

  const Render = () =>{
    return AssessmentList.map((data, index)=>{
        const price = data.currency === 'USD' ? '$' : '₹';
        const fee = price +' '+data.fee
        {console.log(data, 'Assessment data ___________________________')}
        return(
            <TouchableOpacity 
                key={index} 
                style={styles.card}
                onPress={()=> {
                    dispatch(setAssessmentData(data.assessmentDetails))
                    navigation.navigate('Assessments')
                }}>
                <HStack alignItems="center" space={3}>
                    <Container bg='#F0E1EB'  p={2} borderRadius={50}>
                      <Icon size="lg" as={Ionicons} name="clipboard-outline" color="primary.100" />
                    </Container>
                      <VStack>
                      <HStack alignItems="center" width={'80%'} justifyContent={'space-between'}>
                        <Text noOfLines={4} width={'70%'} style={{fontWeight:'bold', fontSize: 13}}>{data.assessmentTitle}</Text>
                        { data.assessmentStatus === 'INREVIEW' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ffc107',padding:5, borderRadius:3}}>In Review</Text> : null }
                        { data.assessmentStatus === 'REJECTED' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ff0000',padding:5, borderRadius:3}}>Rejected</Text> : null }
                        { data.assessmentStatus === 'ACTIVE' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#29d363',padding:5, borderRadius:3}}>Active</Text> : null }
                        { data.assessmentStatus === 'BANNED' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ff0000',padding:3, borderRadius:3, marginBottom:10}}>Rejected</Text> : null }
                      </HStack>
                      <Text style={{fontWeight:'bold',maxWidth:200,fontSize: 9}}>{fee}</Text>
                      {/* <HStack space={3} alignItems='center'>
                        <Image
                        alt="graduate icon"
                        source={require('../../assets/graduate_student.png')}
                        size="2" 
                        />
                        <Text style={{fontSize: 9,color:"#091B12",fontWeight: '900'}}>
                            7 Learners
                        </Text>
                      </HStack> */}
                      {/* <Text style={{maxWidth:300,fontSize: 10}}>{data.catogory}  {'>'}  {data.subCategory}</Text> */}
                        <HStack alignItems="center"  b width={'80%'} justifyContent={'space-between'}>
                          <Text style={{maxWidth:300,fontSize: 10}}>{Object.keys(data.assessmentDetails).length} Questions</Text>
                          {
                            data.assessmentStatus === 'INREVIEW' || data.assessmentStatus === 'REJECTED' || data.assessmentStatus === 'ACTIVE' || data.assessmentStatus === 'BANNED' ?
                            <HStack>
                              {
                                getNewMessageCount(data.assessmentCode) !== null ?
                                <Badge  bg={'amber.500'} rounded={'lg'} right={-width*0.18} top={-6} zIndex={1} variant="solid"
                                    alignSelf="flex-start"  _text={{ fontSize: 7,}}>
                                    {getNewMessageCount(data.assessmentCode)}
                                </Badge>
                                : null
                              }
                              <Text bg="primary.50" onPress={()=>{
                                setRChat(true)
                                setCourseCode(data.assessmentCode)
                              }} style={{fontSize:11,color: '#FFFFFF', padding:5, borderRadius:3}}>Raise a ticket</Text>
                            </HStack>
                            : null
                          }
                        </HStack>
                      </VStack>
                </HStack>
            </TouchableOpacity>
        )
    })
}
  return (
    <View style={styles.container}>
      {/* socket modal */}
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

      <ScrollView nestedScrollEnabled={true} style={{marginBottom:100}}>
          { AssessmentList ? <Render /> : <Text style={{fontSize:12, marginTop:"5%", color:'#8C8C8C', alignSelf:'center'}}>Currently you don't have any Assessments</Text>}
      </ScrollView>
    </View>
  )
}

export default AssessmentCard

const styles = StyleSheet.create({
  container:{
      marginLeft:15,
      marginRight:15,
  },
  card:{
      borderRadius: 5,
      backgroundColor: "#F8F8F8",
      padding:12,
      marginTop:10
  }
})