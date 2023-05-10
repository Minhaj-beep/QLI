// import { StyleSheet, View,Dimensions,ScrollView,TouchableOpacity } from 'react-native';
// import {useState,React, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
// import {VStack,Text,HStack,Modal, Button,useToast} from 'native-base';
import React, { useEffect, useRef, useState, useCallback } from "react"
import { View, Text, HStack, VStack, Icon, useToast, Image, ScrollView, Button, Modal, IconButton, Badge, FormControl, Input, Select } from "native-base"
import { Dimensions, StyleSheet, Linking, TouchableOpacity, ActivityIndicator } from "react-native"
import AppBar from '../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import { GetTransactionDetails } from '../Functions/API/GetTransactionDetails';
import { GetAllWithdrawRequest } from '../Functions/API/GetAllWithdrawRequest';
import { setLoading } from '../Redux/Features/authSlice';
import { GetWithdrawRequest } from '../Functions/API/GetWithdrawRequest';
// socket io components
import { socket } from "../StaticData/SocketContext";
// import { setLoading } from "../Redux/Features/userDataSlice";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import DocumentPicker, { types } from 'react-native-document-picker'
import RNFetchBlob from 'rn-fetch-blob';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window')

const TransactionHistoryInterceptor = ({props}) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false);
  const [ModalData, setModalData] =useState();
  const [allData, setAllData] = useState([])
  const THistory = useSelector(state => state.UserData.THistory)
  const email = useSelector(state => state.Login.email);
  console.log(THistory)
  const toast = useToast();
  // socket io hooks and variables
  const [ChatArray, setChatArray] = useState([]); 
  const [msgList, setMsgList] = useState([])
  const [currentMessage, setCurrentMessage] = useState(null)
  const [readyFile, setReadyFile] = useState(false)
  const [uploadFile, setUploadFile] = useState({})
  const [chatLoading, setChatLoading] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState (false)
  const [ChatText, setChatText] = useState();
  const [ShowRChat, setRChat] = useState(false);
  const [fileToBinary, setFileToBinary] = useState(null);
  const scrollViewRef = useRef();
  const JWT_token = useSelector(state => state.Login.JWT)
  const Name = useSelector(state => state.UserData.profileData.fullName)
  const [CourseCode, setCourseCode] = useState(null)

  useEffect(()=>{
    getAllWithdrawRequest()
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
      socket.emit("getPreviousMessage", { courseCode: CourseCode, ticketType: "TRANSACTION" }, (response) => {
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

  const sendMsg = (Message) => {
      setChatLoading(true)
      console.log('Send Message: ', Message)
          socket.emit("sendMessage", {
              message: Message,
              courseCode: CourseCode,
              roomName: CourseCode,
              userName: Name,
              ticketType: "TRANSACTION",
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
      ticketType: "TRANSACTION",
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

  const getNewMessageCount = (courseCode) => {
    const course = props.find(c => c.courseCode === courseCode);
    return course && course.newMessageCount !== 0 ? course.newMessageCount : null;
  }

  const OpenDoc = async(link) =>{
    console.log(link);
    const supported = await Linking.canOpenURL(link);
    if (supported) {
      await Linking.openURL(link);
    } else {
        toast.show({
            description: 'Unable to open URL, Please try again later!',
        });
    }
  };
  // Socket code ends

  const getAllWithdrawRequest = async () => {
    dispatch(setLoading(true))
    try {
      const result = await GetWithdrawRequest(email)
      if(result.status === 200) {
        console.log(result.data)
        setAllData(result.data)
      } else {
        console.log('getTransactionDetails failed 1', result)
      }
      dispatch(setLoading(false))
    } catch (e) {
      console.log('getTransactionDetails failed 2', e)
      dispatch(setLoading(false))
    }
  }
  
  const AppBarContent = {
    title: 'Transaction History',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  const copyToClipboard = (data) => {
    let cData = "Transaction "+data.charge+" "+data.status
    console.log(cData)
    Clipboard.setString(cData);
  };

  const RenderTH = () =>{
    allData.map((i)=>{console.log(i)})
    return THistory.map((data, index)=>{

      const [SColor, setSColor] = useState();
      const [BgColor, setBgColor] = useState();
      // console.log(data)

      useEffect(() =>{ 
        if(data.status === 'Confirmed'){
          setSColor('#29d363')
         setBgColor('#d2f4de')
        }else if(data.status === 'Cancelled'){
          setSColor('#f65656')
          setBgColor('#fbdbdb')
        }else{
          setSColor('#ffbe40')
          setBgColor('#fdf0d7')
        }
      },[])

      const InvoiceData = {
        data:data,
        SColor:SColor,
        BgColor:BgColor
      }

      return(
        <View key={index} style={{marginTop:10}}> 
          <TouchableOpacity 
         onPress={() => {
          setShowModal(true)
          setModalData(InvoiceData)
        }}
         >
          <HStack style={styles.card} space={1} maxWidth={width/0.5} justifyContent='space-between'>
              {/* <View>
                <View style={{backgroundColor:"#F0E1EB", padding:10, borderRadius:10}}>
                  <Icon as={<MaterialIcons name="notifications-active"/>} size={7}/>
                </View>
              </View> */}
              <VStack style={{maxWidth:width/1.5}}>
                  <Text style={{color:"#395061", fontWeight:'bold', fontSize:13}}>{data.transactionDetails}</Text>
                  <Text style={{color:"#395061", fontSize:11, fontWeight:'bold'}}>{data.charge}</Text>
                  <Text style={{color:"#8C8C8C", fontSize:9}}>{data.timestamp}</Text>
                  {/* <Text style={{color:"#8C8C8C", fontSize:10}}>04 Oct 2021 at 5:01 PM</Text> */}
              </VStack>
              <View>
                <Text color={SColor} bg={BgColor} style={{fontSize:11, paddingLeft:15,paddingRight:15,paddingBottom:7, paddingTop:7,borderRadius:20, minWidth:85}}>{data.status}</Text>
              </View>
            </HStack>
            </TouchableOpacity>
        </View>
      )
    })
  }

  const RenderTransactionHistory = () =>{
    return allData.map((data, index)=>{

      const [SColor, setSColor] = useState();
      const [BgColor, setBgColor] = useState();
      const date = data.requestedDate.split('T')

      useEffect(() =>{ 
        if(data.requestedstatus === 'PAID'){
          setSColor('#29d363')
         setBgColor('#d2f4de')
        }else if(data.requestedstatus === 'Cancelled'){
          setSColor('#f65656')
          setBgColor('#fbdbdb')
        }else{
          setSColor('#ffbe40')
          setBgColor('#fdf0d7')
        }
      },[])

      const InvoiceData = {
        data:data,
        SColor:SColor,
        BgColor:BgColor
      }

      return(
        <View key={index} style={{marginTop:10}}> 
          <TouchableOpacity 
         onPress={() => {
          // setShowModal(true)
          // setModalData(InvoiceData)
        }}
         >
          <HStack style={styles.card} space={1} alignItems={'center'} maxWidth={width/0.5} justifyContent='space-between'>
              <VStack style={{maxWidth:width/1.5}}>
                  <Text style={{color:"#395061", fontWeight:'bold', fontSize:13}}>{data.instructorEmail}</Text>
                  <Text style={{color:"#395061", fontSize:11, fontWeight:'bold'}}>₹{data.requestedAmount}</Text>
                  <Text style={{color:"#8C8C8C", fontSize:9}}>{date[0]}</Text>
                  {/* <Text style={{color:"#8C8C8C", fontSize:10}}>04 Oct 2021 at 5:01 PM</Text> */}
              </VStack>
              {
                  data.requestedstatus === 'REQUESTED' ?
                  <VStack space={2} alignItems="center">
                    <Text color={SColor} bg={BgColor} style={{fontSize:11, paddingLeft:15,paddingRight:15,paddingBottom:7, paddingTop:7,borderRadius:20, minWidth:85}}>{data.requestedstatus}</Text>
                    <HStack mr={5}>
                      {
                        getNewMessageCount(data._id) !== null ?
                        <Badge  bg={'amber.500'} rounded={'lg'} right={-width*0.18} top={-6} zIndex={1} variant="solid"
                            alignSelf="flex-start"  _text={{ fontSize: 7,}}>
                            {getNewMessageCount(data._id)}
                        </Badge>
                        : <View width={5}></View>
                      }
                      <Text bg="primary.50" onPress={()=>{
                        setRChat(true)
                        setCourseCode(data._id)
                      }} style={{fontSize:11,color: '#FFFFFF', padding:5, borderRadius:3}}>Raise a ticket</Text>
                    </HStack>
                  </VStack>
              : null
              }
              {
                  data.requestedstatus === 'PAID' ?
                  <VStack space={2} alignItems="center" minWidth={85}>
                    <Text color={SColor} bg={BgColor} style={{fontSize:11, paddingLeft:15,paddingRight:15,paddingBottom:7, paddingTop:7,borderRadius:20}}>{data.requestedstatus}</Text>
                    <HStack mr={5}>
                      {
                        getNewMessageCount(data._id) !== null ?
                        <Badge  bg={'amber.500'} rounded={'lg'} right={-width*0.18} top={-6} zIndex={1} variant="solid"
                            alignSelf="flex-start"  _text={{ fontSize: 7,}}>
                            {getNewMessageCount(data._id)}
                        </Badge>
                        : <View width={5}></View>
                      }
                      <Text bg="primary.50" onPress={()=>{
                        setRChat(true)
                        setCourseCode(data._id)
                      }} style={{fontSize:11,color: '#FFFFFF', padding:5, borderRadius:3}}>Raise a ticket</Text>
                    </HStack>
                  </VStack>
              : null
              }
            </HStack>
            </TouchableOpacity>
        </View>
      )
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

  return (
    <SafeAreaView>
      <AppBar props={AppBarContent}/>

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
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="500px">
          <Modal.CloseButton />
          <Modal.Body>
           {ModalData && 
           <VStack space={8}>
            <VStack space={5}>
              <Text color="primary.100" style={{fontWeight:'bold', fontSize:17}}>Invoice</Text>
              
              <VStack>
              <Text color="greyScale.800" style={{fontSize:13}}>Course Name</Text>
              <Text color="primary.100" style={{fontSize:15, fontWeight:'bold'}}>{ModalData.data.transactionDetails}</Text>
              </VStack>
              
              <HStack justifyContent="space-between">
              <Text color="greyScale.800" style={{fontSize:13}}>Fee</Text>
              <Text color="primary.100" style={{fontWeight:'bold', fontSize:15}}>{ModalData.data.charge}</Text>
              </HStack>
              
              <HStack justifyContent="space-between">
              <Text color="greyScale.800" style={{fontSize:13}}>Time</Text>
              <Text color="primary.100" style={{fontWeight:'bold', fontSize:15}}>{ModalData.data.timestamp}</Text>
              </HStack>

              <HStack justifyContent="space-between">
              <Text color="greyScale.800" style={{fontSize:13}}>Status</Text>
              <Text color={ModalData.SColor} bg={ModalData.BgColor} style={{fontSize:13,paddingLeft:15,paddingRight:15,paddingBottom:7, paddingTop:7,borderRadius:20}}>{ModalData.data.status}</Text>
              </HStack>
            </VStack>

            <Button
              bg="#3e5160"
              colorScheme="blueGray"
              style={styles.cbutton}
              _pressed={{bg: "#fcfcfc",
                _text:{color: "#3e5160"}
                }}
              onPress={()=>{
                copyToClipboard(ModalData.data)
                setShowModal(false)
                toast.show({
                  description: "Copied to Clipboard",
                })
              }}
            >
              Copy invoice details
            </Button>            
            </VStack>
            }
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <ScrollView> 
      <VStack style={styles.Container}>
       {Object.keys(allData).length > 0 ? <RenderTransactionHistory/> : 
        <Text style={{fontSize:12, alignSelf:"center", marginTop:"1%", color:'#8C8C8C'}}>Currently you don't have any transaction history</Text>
       }     
       {/* {THistory && <RenderTH/> }      */}
      </VStack>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TransactionHistoryInterceptor

const styles = StyleSheet.create({
  Container:{
   marginLeft:15,
   marginRight:15,
   marginTop:15,
   paddingBottom:120
  },
  card:{
    backgroundColor:"#F8F8F8",
    padding:12,
    shadowColor: "rgba(0, 0, 0, 0.03)",
    shadowOffset: {
      width: 0,
      height: 0.38
    },
    borderRadius:6,
  }
})