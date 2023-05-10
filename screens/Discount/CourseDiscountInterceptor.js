import React, { useEffect, useRef, useState, useCallback } from "react"
import { View, Text, HStack, VStack, Icon, Image, ScrollView, Button, Modal, IconButton, Heading, FormControl, Input, Select, Center, Badge } from "native-base"
import { Dimensions, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from "react-native"
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useSelector, useDispatch } from "react-redux"
import AppBar from "../components/Navbar"
import { GetAllDiscountRequest } from "../Functions/API/GetAllDiscountRequest"
import { GetDiscountRequest } from "../Functions/API/GetDiscountRequest";
import { SubmitForApproval } from "../Functions/API/SubmitForApproval";
import { RequestForDiscount } from "../Functions/API/RequestForDiscount";
import { GetActiveCoursebyInstructor } from "../Functions/API/GetActiveCoursebyInstructor";
import { EnbleDiscountToCourse } from "../Functions/API/EnableDiscountToCourse";
const { width, height } = Dimensions.get('window');
import DatePicker from 'react-native-date-picker'
import CheckBox from '@react-native-community/checkbox';
// socket io components
import { socket } from "../StaticData/SocketContext";
import { setLoading } from "../Redux/Features/authSlice";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import DocumentPicker, { types } from 'react-native-document-picker'
import RNFetchBlob from 'rn-fetch-blob';
import { useNavigation } from "@react-navigation/native";

const CourseDiscountInterceptor = ({props}) => {
    const navigation = useNavigation()
    const [allDiscounts, setAllDiscounts] = useState([])
    const [viewAddCoupon, setViewAddCoupon] = useState(false)
    const [startOpen, setStartOpen] = useState(false)
    const [endOpen, setEndOpen] = useState(false)
    const email = useSelector(state => state.Login.email);
    const couponNameRef = useRef()
    const couponNumberRef = useRef()
    const [couponName, setCouponName] = useState('')
    const [couponNumbers, setCouponNumbers] = useState(0)
    const [discountPercentage, setDiscountPercentage] = useState('')
    const initialDate = new Date()
    const [startDate, setStartDate] = useState(initialDate)
    const [endDate, setEndDate] = useState(initialDate)
    const [errorName, setErrorName] = useState('') // 'coupon name' 'coupon discount' 'coupon numbers' 'date error'
    const [enabled, setEnabled] = useState(false)
    const [selectAll, setSelectAll] = useState(false)
    const [allCourses, setAllCourses] = useState([])
    const [discountId, setDiscountId] = useState(null)
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
    // console.log(useSelector(state => state.UserData.profileData))
    const [CourseCode, setCourseCode] = useState(null)

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
        })
        socket.emit("getPreviousMessage", { courseCode: CourseCode, ticketType: "DISCOUNT" }, (response) => {
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

    const sendMsg = (Message) => {
        setChatLoading(true)
        console.log('Send Message: ', Message)
            socket.emit("sendMessage", {
                message: Message,
                courseCode: CourseCode,
                roomName: CourseCode,
                userName: Name,
                ticketType: "DISCOUNT",
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
        ticketType: "DISCOUNT",
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
    // Socket code ends

    useEffect(()=>{
        getDiscountRequest()
        getActiveCoursebyInstructor()
    },[])

    const getActiveCoursebyInstructor = async (data) => {
        try{
            const result = await GetActiveCoursebyInstructor(email)
            if(result.status === 200){
                setAllCourses(result.data)
                console.log('Oi 00000===>', result.data)
            } else {
                console.log('GetActiveCoursebyInstructor error 2:', result)
            }
        } catch (e) {
            console.log('GetActiveCoursebyInstructor error 2:', e)
        }
    }

    const proccessDiscount = async () => {
        try {
            const result = await RequestForDiscount(email, couponNumbers, discountPercentage, couponName, startDate, endDate)
            if(result.status === 200) {
                alert(result.message)
                //clearing all the variable to initial state
                setCouponNumbers(0)
                setDiscountPercentage('')
                setCouponName('')
                setStartDate(initialDate)
                setEndDate(initialDate)

                //closing model and recalling all discount for updated result
                setViewAddCoupon(false)
                setAllDiscounts([])
                getDiscountRequest()
            } else {
                console.log('RequestForDiscount error :', result)
                alert('Request for discount get failed!')
            }
        } catch (e) {
            console.log('RequestForDiscount error 2 :', e)
            alert('Request failed due to server error. Please try again later!')
        }
    }

    const handleSubmit = () => {
        console.log(couponName, discountPercentage, couponNumbers, startDate, endDate)
        console.log(new Date(startDate).toJSON().slice(0, 10) === new Date(endDate).toJSON().slice(0, 10))
        if(couponName.trim() === '' || couponName.trim().length < 6 ){
            if(couponName.trim().length < 6) {
                alert('Coupon name must be contain at least 6 characters')
            } 
            couponNameRef.current.focus()
            setErrorName('coupon name')
        } else if (discountPercentage === '') {
            setErrorName('coupon discount')
        } else if (parseInt(couponNumbers) === couponNumbers || couponNumbers === 0) {
            couponNumberRef.current.focus()
            setErrorName('coupon numbers')
        }  else if(new Date(startDate).toJSON().slice(0, 10) > new Date(endDate).toJSON().slice(0, 10)){
            alert('Expiry date has to be later starting day!')
            setErrorName('date error')
        } else if(new Date(startDate).toJSON().slice(0, 10) < new Date(initialDate).toJSON().slice(0, 10)
            || new Date(initialDate).toJSON().slice(0, 10) > new Date(endDate).toJSON().slice(0, 10)
        ){
            alert('Dates must not be past!')
            setErrorName('date error')
        } else {
            setErrorName('')
            proccessDiscount()
        }
    }

    const getDiscountRequest = async () => {
        try {
            const result = await GetDiscountRequest(email)
            if(result.status === 200){
                setAllDiscounts(result.data)
                // result.data.map((i)=>console.log(i))
            } else {
                console.log('getAllDiscountRequest failed', result)
            }
        } catch (e) {
            console.log('getAllDiscountRequest failed 2 ', e)
        }
    }

    const AppBarContent = {
        title: 'Course Discount',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
    }

    const handleReview = async (id) => {
        try {
            const result = await SubmitForApproval(email, id)
            if(result.status === 200){
                alert(result.message)
                setAllDiscounts([])
                getDiscountRequest()
            } else {
                console.log('SubmitForApproval error :', result)
                alert('Submit for review failed!')
            }
        } catch (e) {
            console.log('SubmitForApproval error 2 :', e)
            alert('Request failed due to server error. Please try again later!')
        }
    }

    const renderButton = (data) => {
        if(data.requestedstatus === 'CREATED'){
            return (
                <HStack left={5} space={2}>
                    <Text left={5} bg="primary.50" onPress={()=>handleReview(data._id)} style={{fontSize:11,color: '#FFFFFF', padding:5, borderRadius:3}}>Submit for review</Text>
                    <HStack mr={5}>
                        {
                            getNewMessageCount(data._id) !== null ?
                            <Badge  bg={'amber.500'} rounded={'lg'} right={-width*0.18} top={-6} zIndex={1} variant="solid"
                                alignSelf="flex-start"  _text={{ fontSize: 7,}}>
                                {getNewMessageCount(data._id)}
                            </Badge>
                            : <View width={5}></View>
                        }
                        <Text bg="rgba(42,60,72, 0.2)"  style={{fontSize:11,color: '#FFFFFF', padding:5, borderRadius:3}}>Raise a ticket</Text>
                    </HStack>
                </HStack>
            )
        } else if (data.requestedstatus === 'REQUESTED') {
            return (
                <HStack left={5} mr={5}>
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
            )
        } else {
            return (
                <HStack left={5} space={2}>
                    <Text left={5} bg="primary.50" onPress={()=>{handleEnableDiscount(data)}} style={{fontSize:11,color: '#FFFFFF', padding:5, borderRadius:3}}>Enable Discount</Text>
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
                </HStack>
            )
        }
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

    const handleEnableDiscount = (data) => {
        setEnabled(true)
        setDiscountId(data._id)
    }

    const RenderCourses = () => {
        const [isCheckAll, setIsCheckAll] = useState(false)
        const [isCheck, setIsCheck] = useState([])

        const handleApply = async () => {
            if(Object.keys(isCheck).length > 0){
                try {
                    const result = await EnbleDiscountToCourse(email, isCheck, discountId)
                    if(result.status === 200) {
                        setEnabled(false)
                        alert('Discount has been applied succesfully!')
                        console.log(result)
                    } else {
                        console.log('EnbleDiscountToCourse error1: ', result)
                        alert('Something went wrong, please try again!')
                    }
                } catch (e) {
                    console.log('EnbleDiscountToCourse error2: ', result)
                    alert('Server is down, please try after sometime.')
                }
            } else {
                alert('Please select at least one course to apply discount.')
            }
        }

        const handleSelectAll = () => {
            setIsCheckAll(!isCheckAll)
            setIsCheck(allCourses.map(i => i.courseCode))
            if (isCheckAll) setIsCheck([])
        }

        const handleClick = (id, val) => {
            setIsCheck([...isCheck, id]);
            if (!val) {
              setIsCheck(isCheck.filter(item => item !== id));
            }
        };

        return (
            Object.keys(allCourses).length > 0 ?
                <>
                    <HStack>
                        <FormControl.Label _text={{ bold: true}}>Select All:</FormControl.Label>
                        <CheckBox
                            style={{bottom:3}}
                            tintColors={{ true: '#395061' , false: '#d4d4d4' }}
                            value={isCheckAll}
                            // defaultValue={data.isNotify}
                            onValueChange={handleSelectAll}
                            onCheckColor={ '#395061'}
                        />
                    </HStack>
                    {
                        allCourses.map((data, index)=> {
                            let currency
                            data.currency === 'USD' ? currency = '$' : currency = '₹'
                            return (
                                <HStack key={index} space={2} bg={'gray.200'} paddingX={2} paddingY={1} borderRadius={5}>
                                <Center>
                                    <Image 
                                        style={styles.cardImg}
                                        // source={require('../../assets/coursecard.png')} 
                                        source={{uri: data.thumbNailImagePath}}
                                        alt='courseimg'
                                        resizeMode='cover'
                                    />
                                </Center>
                                <VStack>
                                    <Text noOfLines={2} style={{fontSize:14, fontWeight: 'bold',color: '#000000', maxWidth: width*0.37}}>{data.courseName}</Text>
                                    <HStack justifyContent={'space-between'} width={width*0.37}>
                                        <Text style={{fontSize:12, fontWeight: 'bold',color: '#000000'}}>{currency} {data.fee}</Text>
                                        {data.isLive ? <Text pr={2} pl={2} borderRadius={20} mt={1} style={{fontSize:10, paddingHorizontal:5, paddingVertical:1, borderRadius:10, backgroundColor:'#F65656', color:'#FFF'}}>Live Course</Text> : null}
                                    </HStack>
                                    <HStack>
                                    <FormControl.Label _text={{ bold: true}}>Select:</FormControl.Label>
                                    <CheckBox
                                        key={data.courseCode}
                                        id={data.courseCode}
                                        style={{bottom:3}}
                                        tintColors={{ true: '#395061' , false: '#d4d4d4' }}
                                        value={isCheck.includes(data.courseCode)}
                                        // defaultValue={data.isNotify}
                                        onValueChange={text => handleClick(data.courseCode, text)}
                                        onCheckColor={ '#395061'}
                                    />
                                    </HStack>
                                </VStack>
                            </HStack>
                            )
                        })
                    }
                    <Button bg="#3e5160" colorScheme="blueGray" style={{paddingTop:10,paddingBottom:10,}}  _pressed={{bg: "#fcfcfc", _text:{color: "#3e5160"}}}
                        onPress={handleApply}
                    >Apply</Button>
                </>
            : null
        )
    }

    return (
        <View style={{flex:1}}>
            <AppBar props={AppBarContent} />
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
            <Modal isOpen={enabled} onClose={() => setEnabled(false)} size="xl">
              <Modal.Content maxWidth="700" borderRadius={20}>
                <Modal.CloseButton />
                  <Modal.Body>
                      <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5}>
                        
                        <Heading alignSelf={'center'} size="md">
                          <Text>Active Courses</Text>
                        </Heading>
                        
                        <RenderCourses />
                        
                    </VStack>
                  </Modal.Body>
              </Modal.Content>
            </Modal>

            <Modal isOpen={viewAddCoupon} onClose={() => setViewAddCoupon(false)} size="lg">
              <Modal.Content maxWidth="700" borderRadius={20}>
                <Modal.CloseButton />
                  <Modal.Body>
                      <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5}>
                        
                        <Heading alignSelf={'center'} size="md">
                          <Text>Create New Coupon</Text>
                        </Heading>

                          <FormControl  style={{Width:width/1}}>
                            <FormControl.Label _text={{ bold: true}}>Coupon name:</FormControl.Label>
                            <Input ref={couponNameRef} autoCapitalize="characters" style={{textTransform:"capitalize"}} marginY={1} variant="filled" bg="#f3f3f3" placeholder="WELCOME" onChangeText={text => setCouponName(text.toUpperCase())}/>
                            {errorName === 'coupon name' ? <Text style={{fontSize:9, color:"red"}}>Please enter the coupon name</Text> : null}
                            <FormControl.Label _text={{ bold: true}}>Discount percentage:</FormControl.Label>
                            <Select selectedValue={discountPercentage} minWidth="200" accessibilityLabel="Select percentage" placeholder="Discount percentage" _selectedItem={{
                                bg: "teal.600",
                            }} mt={1} onValueChange={itemValue => setDiscountPercentage(itemValue)}>
                                <Select.Item label="10%" value="10" />
                                <Select.Item label="20%" value="20" />
                                <Select.Item label="30%" value="30" />
                                <Select.Item label="40%" value="40" />
                                <Select.Item label="50%" value="50" />
                                <Select.Item label="60%" value="60" />
                                <Select.Item label="70%" value="70" />
                                <Select.Item label="80%" value="80" />
                                <Select.Item label="90%" value="90" />
                            </Select>
                            {errorName === 'coupon discount' ? <Text style={{fontSize:9, color:"red"}}>Please enter the discount percentage</Text> : null}
                            <DatePicker
                                modal
                                mode="date"
                                open={startOpen}
                                date={startDate}
                                onConfirm={(date) => {
                                    setStartOpen(false)
                                    setStartDate(date)
                                }}
                                onCancel={() => {
                                    setStartOpen(false)
                                }}
                            />
                            <DatePicker
                                modal
                                mode="date"
                                open={endOpen}
                                date={endDate}
                                onConfirm={(date) => {
                                    setEndOpen(false)
                                    setEndDate(date)
                                }}
                                onCancel={() => {
                                    setEndOpen(false)
                                }}
                            />
                            <FormControl.Label _text={{ bold: true}}>Number of coupon:</FormControl.Label>
                            <Input ref={couponNumberRef} keyboardType="numeric" marginY={1} variant="filled" bg="#f3f3f3" placeholder="100" onChangeText={setCouponNumbers}/>
                            {errorName === 'coupon numbers' ? <Text style={{fontSize:9, color:"red"}}>Please enter the number of coupons</Text> : null}
                            <FormControl.Label _text={{ bold: true}}>Start date:</FormControl.Label>
                            <TouchableOpacity onPress={()=>{setStartOpen(true)}}>
                                <Input marginY={1} isReadOnly={true} variant="filled" bg="#f3f3f3" placeholder={`${new Date(startDate).toJSON().slice(0, 10)}`} />
                            </TouchableOpacity>
                            {errorName === 'date error' ? <Text style={{fontSize:9, color:"red"}}>Please enter the start date properly!</Text> : null}
                            <FormControl.Label _text={{ bold: true}}>End date:</FormControl.Label>
                            <TouchableOpacity onPress={()=>{setEndOpen(true)}}>
                                <Input marginY={1} isReadOnly={true} variant="filled" bg="#f3f3f3" placeholder={`${new Date(endDate).toJSON().slice(0, 10)}`} />
                            </TouchableOpacity>
                            {errorName === 'date error' ? <Text style={{fontSize:9, color:"red"}}>Please enter the expiry date properly!</Text> : null}
                          </FormControl>
                          {/* { 
                            ErrNEmail === true ? 
                            <Text style={{color:'#FF0000', fontSize:9}}> * Please enter your email properly</Text> : <Text style={{fontSize:1}}> </Text>
                          } */}
                        <Button bg="#3e5160" colorScheme="blueGray" style={{paddingTop:10,paddingBottom:10,}}  _pressed={{bg: "#fcfcfc", _text:{color: "#3e5160"}}}
                            onPress={()=>{handleSubmit()}}
                        >Submit</Button>
                    </VStack>
                  </Modal.Body>
              </Modal.Content>
            </Modal>
            <View style={{flex:1}}>
                <ScrollView contentContainerStyle={{bottom:10}}>
                    {
                        Object.keys(allDiscounts).length > 0 ? 
                            allDiscounts.map((data, index)=>{
                                // console.log(new Date(data.startDate).toJSON().slice(0, 10) < new Date(data.expiryDate).toJSON().slice(0, 10))
                                return (
                                    <TouchableOpacity key={index} onPress={()=>{}} style={styles.CourseCard}>
                                        <HStack justifyContent={'space-between'} paddingBottom={3} alignItems={'center'}>
                                            <VStack style={styles.CardContent}>
                                                <HStack justifyContent='space-between' alignItems='center' space={2}>
                                                    <Text noOfLines={2} style={{fontSize:14, fontWeight: 'bold',color: '#000000', maxWidth: width*0.6}}>{data.couponName}</Text>
                                                    { data.requestedstatus === 'REQUESTED' ? <Text bg='#ffc107' style={styles.statusBadge}>In Review</Text> : null }
                                                    { data.requestedstatus === 'REJECTED' ? <Text bg='#ff0000' style={styles.statusBadge}>Rejected</Text> : null }
                                                    { data.requestedstatus === 'APPROVED' ? <Text bg='#29d363' style={styles.statusBadge}>Approved</Text> : null }
                                                </HStack>
                                                <Text style={{fontSize:12, fontWeight: 'bold', color: '#FFBE40'}}>{data.discountPercentage}% {'discount'}</Text>
                                                <HStack space={2} mt="0">
                                                    <HStack alignItems={'center'} justifyContent={'space-between'} style={{width:'100%'}} space={1}>
                                                        <Text style={{fontSize: 10,color: '#091B12',fontWeight: 'bold'}}> {new Date(data.startDate).toJSON().slice(0, 10)} To {new Date(data.expiryDate).toJSON().slice(0, 10)}</Text>
                                                            {/* <Image
                                                                alt="graduate icon"
                                                                source={require('../../assets/graduate_student.png')}
                                                                size="3"
                                                            />
                                                            <Text style={{fontSize: 10, color: '#000000', marginRight:5}}>{'data.learnersCount'} Learners</Text>
                                                            <Icon as={<Fontisto name="clock"/>} color={'#8C8C8C'} size={3}/>
                                                            <Text style={{fontSize: 10, color: '#000000'}}>Friday 12.00 AM</Text> */}
                                                            <HStack space={1}>
                                                                {renderButton(data)}
                                                            </HStack>
                                                    </HStack>
                                                </HStack>
                                            </VStack>
                                            {/* <Text color={'#29d363'} bg={'#d2f4de'} style={{fontSize:11, paddingLeft:15,paddingRight:15,paddingBottom:7, paddingTop:7,borderRadius:20, minWidth:85}}>{'data.status'}</Text> */}
                                        </HStack>
                                    </TouchableOpacity>
                                )
                            })
                        : 
                        <Text style={{fontSize: 15,color: '#364b5b', marginTop:20, fontWeight: 'bold', alignSelf:"center"}}>You don't have any coupon to show</Text>
                    }
                    <Button bg="primary.50" width={'60%'} alignSelf={'center'} rounded={6} mt={3} 
                        _pressed={{bg: "#fcfcfc",
                        _text:{color: "#3e5160"}
                        }}
                        onPress={() => {
                            setViewAddCoupon(true)
                        }}
                        >
                        {
                            Object.keys(allDiscounts).length > 0 ?
                            <Text color="white.100">+ Add Another Coupon</Text>
                            :
                            <Text color="white.100">+ Add New Coupon</Text>
                        }
                    </Button>
                </ScrollView>
            </View>
        </View>
    )
}

export default CourseDiscountInterceptor

const styles = StyleSheet.create({
    CourseCard: {
      width:"95%",
      alignSelf:"center",
      borderRadius: 10,
      backgroundColor: "#FFFFFF",
      shadowColor: "rgba(0, 0, 0, 0.03)",
      shadowOffset: {
        width: 0,
        height: 0.376085489988327
      },
      shadowRadius: 22,
      shadowOpacity: 1,
      paddingTop:10,
      paddingHorizontal:10,
      marginTop:10,
    },
    cardImg: {
      height:width*0.17,
      width: width*0.27,
      borderRadius: 5,
    },
    CardContent:{
      // minWidth:width/1.7,
      marginLeft:10
    },
    statusBadge: {
        fontSize:11, 
        paddingVertical:1,
        paddingHorizontal:7,
        borderRadius:20,
    }
  })

  