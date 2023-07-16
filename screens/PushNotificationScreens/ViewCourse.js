import { StyleSheet, View, Dimensions, ScrollView, Linking, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Text, HStack, Icon, Badge, VStack, Divider, Image, IconButton, Modal, FormControl, Input } from 'native-base'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { GetCourseByCode } from '../Functions/API/GetCourseByCode'
import { useSelector, useDispatch } from 'react-redux'
import AppBar from '../components/Navbar'
import VideoPlayer from 'react-native-video-controls'
import { AirbnbRating } from 'react-native-ratings'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import CollapsibleView from '@eliav2/react-native-collapsible-view'
import RenderHtml from 'react-native-render-html'
import { setAssessment } from '../Redux/Features/CourseSlice'
import FAQContent from '../Course/CourseDetails/components/FAQContent'
import ClassTime from '../Course/LiveCourse/components/ClassTime'
import { setCCFAQ } from '../Redux/Features/userDataSlice'
import { GetReview } from '../Functions/API/GetReview'
import { socket } from '../StaticData/SocketContext'
import DocumentPicker, { types } from 'react-native-document-picker'
import RNFetchBlob from 'rn-fetch-blob'

const {width, height} = Dimensions.get('window')

const ViewCourse = ({navigation, route}) => {
    const dispatch = useDispatch()
    const courseCode = route.params.screenProps.courseCode
    const email = useSelector(state => state.Login.email)
    const BaseURL = useSelector(state => state.UserData.BaseURL)

    const [allData, setAllData] = useState(null)
    const [overView, setOverView] = useState({})
    const [ShowStudList, setStudList] = useState(false)
    const [reviewList, setReviewList] = useState([])

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
    const [ShowRChat, setRChat] = useState(true);
    const Name = useSelector(state => state.UserData.profileData.fullName);
    const JWT_token = useSelector(state => state.Login.JWT)

    let FaqData = useSelector(state => state.UserData.CCFAQ)
    
    const AppBarContent = {
        title: '',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
    }

    useEffect(()=> {
        getCourseByCode()
        getCourseOverview()
        getCourseFAQ()
        getAllReviews()
    },[])

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
            socket.emit('join-instructor', { courseCode: courseCode,  userId: JWT_token, userName: Name }, async res => {
                console.log(`join-instructor ${res}`);
                console.log(res)
            })
            socket.emit("resetMessageCount", { courseCode: courseCode, userType: JWT_token }, (response) => {
                console.log("Reset Message Count Ran!!!!!!!!!!!!!!!!!!!!!", response)
            });
            socket.emit("getPreviousMessage", { courseCode: courseCode, ticketType: "COURSE" }, (response) => {
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
                courseCode: courseCode,
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
        courseCode: courseCode,
        roomName: courseCode,
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
            const result = await GetReview(email, courseCode)
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

    const getCourseByCode = async () => {
        // setLoading(true)
        try {
            const result = await GetCourseByCode(email, courseCode)
            if(result.status === 200) {
                setAllData(result.data)
                // getInstructorData(result.data.instructorId)
                // getLiveClassData(courseData.courseCode)
                console.log('All Data: ', result.data)
            } else {
                alert('Something went wrong!')
                console.log('getCourseByCode error: 1', result)
            }
        } catch (e) {
            console.log('getCourseByCode error: 2', e)
        }
        // setLoading(false)
    } 

    const getCourseOverview = () =>{
        const API = BaseURL+'getCourseOverview/?courseCode='+courseCode;
        if( courseCode ===''){
          console.log('Something went wrong, please Login again');
        }else{
          const requestOptions = {
            method: 'GET',
            headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'gmailUserType':'INSTRUCTOR',
              'token':email
            },
          }
          // console.log(requestOptions);
          fetch(API, requestOptions)
            .then(response => response.json())
            .then(result => {
              if(result.status === 200)
              {
                const over = result.data[0]
                // console.log('over ======================>', over);
                setOverView(over)
              }else if(result.status > 200){
                // alert('Error: ' + result.message);
                console.log(result.message);
              }
            }).catch(error =>{
              console.log(error)
              // alert('Error: ' + error);
            })
        }
        
    };

    const getCourseFAQ =() => {
        const API = BaseURL+'getAllFaq/?courseCode='+courseCode
        if(courseCode === ''){
            console.log('Something went wrong');
        } else {
            const requestOptions = {
                method:'GET',
                headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'gmailUserType':'INSTRUCTOR',
                'token':email
                },
            }
            fetch(BaseURL+'getAllFaq/?courseCode='+courseCode, requestOptions)
            .then(response => response.json())
            .then(result => {
                if(result.status === 200){
                        const f = result.data[0]
                        const faq = f.faqList
                        dispatch(setCCFAQ(faq))
                        console.log('update FAQ')
                    }else if(result.status > 200){
                        console.log(result.message)
                    } 
            })
            .catch(error => {
                console.log('error', error)
                // alert('Error:' + error);
            });
        }
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
                    <Image source={require('../../assets/personIcon.png')} alt="profile" size={10} rounded={20}/>
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
                             source={require('../../assets/star.png')}
                             alt="rating"
                             size="3"
                           />
                         );
                       }
                     )
                   }
                 </HStack>
                 <Text color={'greyScale.800'} fontSize={12} fontWeight={500} maxW={width / 1.3}>
                 " {RD.reviewContent} "
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

    const getDate = (date) => {
        const parts = date.split('-');
        const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        return formattedDate
    }

    const CTRender = () =>{
        return allData.classTime.map((data,index) =>{
          // console.log(data)
          return(
            <View key={index}>
              <ClassTime props={data}/>
            </View>
          )
        })
    }

    return (
        <View style={{flex:1}}>
            <AppBar props={AppBarContent}/>

            <Modal isOpen={ShowStudList} onClose={() => setStudList(false)} size="full" padding={2}>
                <Modal.Content>
                <Modal.CloseButton />
                <Modal.Body>
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
                        <Text color='primary.50' style={{fontWeight:'bold', fontSize:16}}>Ticket</Text>
                        
                        <ScrollView showsHorizontalScrollIndicator={false} 
                        style={{height:height/3.5}} 
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                        >
                            <VStack space={2} mt={3}> 
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

            {
                allData && (
                    <View style={{flex:1, width:width*0.95, alignSelf:"center"}}>
                        <ScrollView>
                            <VideoPlayer
                                source={{uri: allData.introVideoPath}}
                                style={{maxWidth: width / 1, height: height / 4}}
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
                            <Text mt={1} style={{ fontSize: 15, color: '#000000', fontWeight: 'bold', maxWidth: width / 1,}}>{allData.courseName}</Text>
                            <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>{allData.currency === 'USD' ? '$' : '₹'} {allData.fee}</Text>

                            <HStack space={2} justifyContent={'space-between'} mt="2" alignItems="center">
                                <HStack space={2} alignItems="center">
                                    <AirbnbRating
                                        count={5}
                                        isDisabled={true}
                                        showRating={false}
                                        defaultRating={`${allData.rating}`}
                                        size={15}
                                        value={`${allData.rating}`}
                                    />
                                    <Text style={{fontSize: 15,color: '#364b5b'}}>{allData.rating === parseInt(allData.rating) ? allData.rating : allData.rating.toFixed(1)} ({allData.ratingCount})</Text>
                                    <Text onPress={()=>{setStudList(true)}} style={{fontSize: 15,color: '#364b5b',fontWeight: 'bold',paddingLeft:1}}>View Reviews</Text>
                                </HStack>
                            </HStack>

                            {/* Button = Raise a ticket and Student preview */}
                            <HStack space={2} mt='3' mb='4' alignItems="center">
                                <View style={{flexDirection:"row", width:width*0.95, alignItems:"center", justifyContent:"space-between"}}>
                                    {
                                        allData.courseStatus === 'INREVIEW' || allData.courseStatus === 'ACTIVE' || allData.courseStatus === 'BANNED' ? (
                                            <TouchableOpacity >
                                                <HStack>
                                                    <HStack bg={'gray.300'} space={1} padding={2} borderRadius={5} alignItems="center">
                                                        <Icon size='sm' as={FontAwesome5} name='envelope' color='primary.50'/>
                                                        <Text color={'primary.50'} bold onPress={()=> setRChat(true)} style={{fontSize:11, borderRadius:3}}>Raise a Ticket</Text>
                                                    </HStack>
                                                    {/* <Badge  bg={'amber.500'} rounded={'lg'} right={4} top={-6} zIndex={1} variant="solid"
                                                        alignSelf="flex-start"  _text={{ fontSize: 7,}}>2</Badge> */}
                                                </HStack>
                                            </TouchableOpacity>
                                        ) : null
                                    }
                                    <TouchableOpacity onPress={()=>{navigation.navigate('StudentPreview', {type: allData.isLive ? 'live' : 'recorded'})}}>
                                        <HStack bg={'gray.300'} space={1} padding={2} borderRadius={5} alignItems="center">
                                            <Text color={'primary.50'} bold onPress={()=>{navigation.navigate('StudentPreview', {type: allData.isLive ? 'live' : 'recorded'})}} style={{fontSize:11, borderRadius:3}}>Student Preview</Text>
                                        </HStack>
                                    </TouchableOpacity>
                                </View>
                            </HStack>

                            {
                                allData.courseStatus === 'BANNED' || allData.courseStatus === 'REJECTED' ?
                                <CollapsibleView
                                    title={
                                        <HStack style={{ flex:1, flexDirection: 'row', alignItems: 'flex-start', paddingTop:10, paddingLeft:15, paddingRight:15, paddingBottom:10, position: 'relative' }}>
                                        <VStack>
                                        <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>Rejected</Text>
                                        </VStack>
                                    </HStack>  
                                    }
                                    style={{ borderRadius: 5, backgroundColor: "#FFFFFF", shadowColor: "rgba(0, 0, 0, 0.03)",
                                        shadowOffset: {
                                        width: 0,
                                        height: 0.5
                                        }, shadowRadius: 22, shadowOpacity: 1, borderWidth: 0,
                                    }}
                                    arrowStyling={{ size: 20,thickness: 3, color: "#364b5b"}}
                                    isRTL={true}
                                    collapsibleContainerStyle={{ paddingTop: 5, paddingBottom:10,  paddingLeft:15, paddingRight:15 }}
                                >
                                    <Divider my={1}/>
                                    <VStack space={2}>
                                    <Text style={{fontSize: 12,color: '#ff0000'}}>Reason for rejection</Text>
                                    {
                                        allData.rejectionComments.map((data, index)=> {
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
                                    <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold',maxWidth:width/1.4}}>{overView.courseName}</Text>
                                    <HStack space={2} mt={2}>
                                        <Text style={{fontSize: 12,color: '#8C8C8C'}}>Category</Text>
                                        <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold', maxWidth:width/2}}>{overView.categoryName}</Text>
                                    </HStack>
                                    <HStack space={2}>
                                        <Text style={{fontSize: 12,color: '#8C8C8C'}}>Sub-Category</Text>
                                        <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold', maxWidth:width/1.8}}>{overView.subCategoryName}</Text>
                                    </HStack>

                                    <Text style={{fontSize: 12,color: '#8C8C8C'}}>Course Overview</Text>
                                </VStack>
                                <TouchableOpacity style={styles.RenderH}>
                                    <RenderHtml
                                        contentWidth={width/3}
                                        source={{html: overView.courseOverview}}
                                        baseStyle={{color:'#000'}}
                                    />
                                </TouchableOpacity>
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
                                        {allData.currency === 'USD' ? '$' : '₹'}
                                    </Text>
                                    <Text style={{backgroundColor:'#f3f3f3', padding:10,borderRadius:3, color:'#8C8C8C'}} borderWidth={1} >
                                        {allData.fee}
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
                                    source={{uri: allData.thumbNailImagePath}}
                                    alt='courseImg'
                                    mb={2}
                                    mt={2}
                                    resizeMode="contain"
                                    />
                                </VStack>
                                    <Text style={{color:'#000000', fontSize: 12,fontWeight:'bold'}}>Intro Video</Text>
                                    <Text style={{fontSize: 11,color: '#8C8C8C'}}>Width 600 px, Height 350px. Format will be MP4</Text>
                                    <View style={{width: '100%', height: 220,}}>
                                        <VideoPlayer
                                            source={{uri: allData.introVideoPath}}
                                            style={{ width: 360, height: 220, zIndex:1000, elevation:1000, alignSelf: 'center',borderRadius: 10 }}
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
                                </VStack>
                            </CollapsibleView>

                            {
                                allData.isLive && (
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
                                        value={allData.courseDuration} 
                                        variant="filled" 
                                        bg="#f3f3f3"
                                        placeholder="From"
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
                                        value={getDate(allData.fromTime)} 
                                        variant="filled" 
                                        bg="#f3f3f3"
                                        placeholder="From"
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
                                        value={getDate(allData.toTime)}  
                                        variant="filled" 
                                        bg="#f3f3f3" 
                                        placeholder="To"
                                        />
                                    </FormControl>

                                    <Text mt={4} style={{color:'#000000', fontSize: 13,fontWeight:'bold'}} >Class Time</Text>

                                        <VStack space={2} mt={2}>
                                            <CTRender/>
                                        </VStack>
                                    
                                    </CollapsibleView>
                                )
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
                                    }}
                                    space={2}
                                >
                                <View>
                                    <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>Videos</Text>
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
                                    {
                                        allData.isLive ?
                                        <TouchableOpacity
                                        style={{
                                        backgroundColor:"#F0E1EB",
                                        paddingTop:7,
                                        paddingBottom:7,
                                        paddingLeft:15,
                                        paddingRight:15,
                                        borderRadius:7
                                        }}
                                        onPress={()=>navigation.navigate('GTList')}
                                        >
                                            <HStack justifyContent="space-between" alignItems="center">
                                            <HStack space={2} alignItems="center">
                                                <Image
                                                source={require('../../assets/live.png')}
                                                alt="live"
                                                resizeMode={"contain"}
                                                style={{width:35,height:35, maxHeight:35,maxWidth:35}}
                                                />
                                                <Text style={{fontSize:14}}>Go to Live</Text>
                                            </HStack>
                                            <Image
                                            source={require('../../assets/arrow-right.png')}
                                            alt="arrow right"
                                            resizeMode={"contain"}
                                            style={{width:25,height:25, maxHeight:35,maxWidth:35}}
                                            />
                                            </HStack>
                                        </TouchableOpacity>
                                        :
                                        <>
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
                                                    source={require('../../assets/live.png')}
                                                    alt="live"
                                                    resizeMode={"contain"}
                                                    style={{width:35,height:35, maxHeight:35,maxWidth:35}}
                                                    />
                                                    <Text style={{fontSize:14}}>Live Videos</Text>
                                                </HStack>
                                                <Image
                                                source={require('../../assets/arrow-right.png')}
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
                                                    source={require('../../assets/upload.png')}
                                                    alt="live"
                                                    resizeMode={"contain"}
                                                    style={{width:25,height:25, maxHeight:30,maxWidth:30}}
                                                    />
                                                    <Text style={{fontSize:14}}>Uploaded Videos</Text>
                                                </HStack>
                                                <Image
                                                source={require('../../assets/arrow-right.png')}
                                                alt="arrow right"
                                                resizeMode={"contain"}
                                                style={{width:25,height:25, maxHeight:35,maxWidth:35}}
                                                />
                                                </HStack>
                                            </TouchableOpacity>
                                        </>
                                        
                                    }

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
                                            <IconButton 
                                                icon={<Icon as={Ionicons} name="clipboard"/>} 
                                                borderRadius='full'
                                                bg='#F0E1EB' 
                                                _icon={{color: "#395061",size: "lg"}}
                                            />
                                            <Text style={{fontSize:14}}>Assessments</Text>
                                        </HStack>
                                        <Image
                                        source={require('../../assets/arrow-right.png')}
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
                                collapsibleContainerStyle={{}}
                            >
                                <Divider my={2}/>
                                <VStack mt={1} space={2}>{ FaqData ? FaqRender() : null}</VStack>
                            </CollapsibleView>
                        </ScrollView>
                    </View>
                )
            }
        </View>
    )
}

export default ViewCourse

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