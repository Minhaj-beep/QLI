import { View, Text, StyleSheet,Dimensions,ScrollView, TouchableOpacity,KeyboardAvoidingView,Platform,Linking } from 'react-native';
import React,{useState,useEffect,useRef,useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Image,HStack,VStack,IconButton,Icon,Divider,Modal,Button, Input,FormControl} from 'native-base';
import AppBar from '../../components/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CollapsibleView from '@eliav2/react-native-collapsible-view';
import RenderHtml from 'react-native-render-html';
import Video from 'react-native-video';
import {useDispatch,useSelector} from 'react-redux';
import FAQContent from './components/FAQContent';
import { setAssessment } from '../../Redux/Features/CourseSlice';
import moment from 'moment';
// import * as WebBrowser from 'react-native-webbrowser';


const { width, height } = Dimensions.get('window');

const CourseDetails = ({navigation}) => {
  
  const dispatch = useDispatch();
  const scrollViewRef = useRef();

  const [ChatArray, setChatArray] = useState([]); 
  const [ChatText, setChatText] = useState();
  const [ShowRChat, setRChat] = useState(false);
  const [ShowStudList, setStudList] = useState(false);
  const [LearnerList, setLearnerList] = useState();
  const [currencyType, setCurrencyType] = useState()
  const ThumbnailImgPath = useSelector(state => state.UserData.CCThumbImg);
  const IntroVideoPath = useSelector(state => state.UserData.CCIntroVideo);
  const Overview = useSelector(state => state.UserData.CCOverview);
  const FaqData = useSelector(state => state.UserData.CCFAQ);
  const SingleCD = useSelector(state => state.UserData.SingleCD);
  const CFee = SingleCD.fee;  
  const ThumbnailImg = ThumbnailImgPath;
  const IntroVideo = IntroVideoPath;
  const email = useSelector(state => state.Login.email);
  const BaseURL = useSelector(state => state.UserData.BaseURL)

  const JWL_token = useSelector(state => state.Login.JWT)

//   const renderersProps = {a:{onPress: onPress}}

//   function onPress(event, href){
//     OpenLink(href)
//   }

//   const OpenLink = async(props) =>{
//     await WebBrowser.openBrowserAsync(props);
// }
  const OverC = Overview.courseOverview 
  const OverviewSource ={
    html:`<head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          </head> 
          <body>${OverC}</body>`
  };

  useEffect(()=>{
    if(SingleCD.currency === 'USD'){
        setCurrencyType('$')
      }else{
        setCurrencyType('₹')
      }
      // getStudentList()
      getTicket()
  },[])

  const getTicket= () =>{
    const API= BaseURL+'v1/ticket/getOpenTicketByCourseCode?courseCode='+SingleCD.courseCode
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
        // console.log(result)
        let data = result.data
        if(data.length != 0){
        setChatArray(data[0].messages)
        }
      }else{
        console.log(result.message)
      }
    })
    .catch(err => {
      console.log(err)
      // alert(err)
    })
  }

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
    ArrowVisibility: false,
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

  const RenderChat = () => {
    return ChatArray.map((data,index) =>{
      const TimeD = moment(data.messageTime).format('DD MMM, YYYY hh:mm')
      return(
        <VStack key={index} mt={4} alignSelf='flex-end'>
          <HStack alignItems="center" space={2}>
            <Text style={{fontSize:8, color:'#8C8C8C' }}>{TimeD}</Text>
            <Text style={{fontSize:10,fontWeight:'bold', color:"#000000" }}>ME</Text>
          </HStack>
          <Text style={{fontSize:11, color:'#000000', maxWidth:width/3, alignSelf:'flex-end'}}>{data.message}</Text>
        </VStack>
      )
    })
  }
  return (
      <SafeAreaView keyboardShouldPersistTaps={'always'}>
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
                let message = {
                      "message":ChatText,
                      "messageTime":CDate
                    }
                  console.log(message)
                ChatArray.push(message)
                UpdateChat()
                setChatText('')
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
          <HStack space={2} mt="2" alignItems="center">
            <HStack space={2} alignItems="center">
                <HStack space={1}>
                <Image
                    source={require('../../../assets/star.png')}
                    alt="rating"
                    size="4"
                />
                  <Image
                    source={require('../../../assets/star.png')}
                    alt="rating"
                    size="4"
                />
                  <Image
                    source={require('../../../assets/star.png')}
                    alt="rating"
                    size="4"
                />
                  <Image
                    source={require('../../../assets/unstar.png')}
                    alt="rating"
                    size="4"
                />
                  <Image
                    source={require('../../../assets/unstar.png')}
                    alt="rating"
                    size="4"
                />
                </HStack>
            <Text style={{fontSize: 15,color: '#364b5b'}}>
              5.0(150)
            </Text>
            <Text style={{fontSize: 15,color: '#364b5b',fontWeight: 'bold',paddingLeft:15}}>
              View Reviews
            </Text>
            </HStack>
          </HStack>

       
        <HStack space={2} mt='3' mb='4' alignItems="center"> 
          
          {/* {SingleCD.courseStatus != 'INREVIEW' ? <TouchableOpacity
          onPress={()=>setStudList(true)}
          >
            <HStack space={3}>
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

            { SingleCD.courseStatus === 'INREVIEW' ?
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
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold', maxWidth:width/2}}>{Overview.catogory}</Text>
              </HStack>
              <HStack space={2}>
                <Text style={{fontSize: 12,color: '#8C8C8C'}}>Sub-Category</Text>
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold', maxWidth:width/1.8}}>{Overview.subCategory}</Text>
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

              <VStack space={1}>
                <Text style={{color:'#000000', fontSize: 12,fontWeight:'bold'}}>Intro Video</Text>
                <Text style={{fontSize: 11,color: '#8C8C8C'}}>Width 600 px, Height 350px. Format will be MP4</Text>
                <Video 
                // source={{uri:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}}
                source={{uri:IntroVideo}}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                // shouldPlay
                isLooping
                style={{ width: 360, height: 220, alignSelf: 'center',borderRadius: 10  }}
                useNativeControls
                />
              </VStack>
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
           style={{
           backgroundColor:"#F0E1EB",
           paddingTop:10,
           paddingBottom:10,
           paddingLeft:17,
           paddingRight:17,
           borderRadius:7
           }}
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
    </SafeAreaView>
  )
}

export default CourseDetails

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