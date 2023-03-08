import {View, Dimensions, ScrollView, StyleSheet,TouchableOpacity,PermissionsAndroid} from 'react-native';
import {useState,useEffect,React, useCallback, useRef} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import {VStack,Icon,HStack, ZStack, Linking, Image,Container,Text,Input, IconButton} from 'native-base';
import {
	ScreenCapturePickerView,
	RTCPeerConnection,
	RTCIceCandidate,
	RTCSessionDescription,
	RTCView,
	MediaStream,
	MediaStreamTrack,
	mediaDevices,
	registerGlobals
} from 'react-native-webrtc';
// import { Camera } from 'expo-camera';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';


const { width, height } = Dimensions.get('window')

const LiveClass = ({navigation}) => {

  const [hasPermission, setHasPermission] = useState(null);
  // const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [microphonePermission, setMicrophonePermission] = useState(null);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState('not-determined');
  const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState('not-determined');

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
    Camera.getMicrophonePermissionStatus().then(setMicrophonePermission);
  }, []);

  useEffect(()=>{
    requestMicrophonePermission()
    requestCameraPermission()
  },[])

  console.log(`Re-rendering Navigator. Camera: ${cameraPermission} | Microphone: ${microphonePermission}`);

  const requestMicrophonePermission = useCallback(async () => {
    console.log('Requesting microphone permission...');
    const permission = await Camera.requestMicrophonePermission();
    console.log(`Microphone permission status: ${permission}`);

    if (permission === 'denied') await Linking.openSettings();
    setMicrophonePermissionStatus(permission);
  }, []);

  const requestCameraPermission = useCallback(async () => {
    console.log('Requesting camera permission...');
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission === 'denied') await Linking.openSettings();
    setCameraPermissionStatus(permission);
  }, []);
  
  const email = useSelector(state => state.Login.email);
  const [ChatList, setChatList] = useState([]);
  const [ChatText, setChatText] = useState();
  const SingleCD = useSelector(state => state.UserData.SingleCD);
  
  const cameraRef = useRef();
  const [Mic, setMic] = useState(false);
  const [Video, setVideo] = useState(true);
  const LiveClassData = useSelector(state => state.Course.LiveClassData);
  const CourseCode = SingleCD.courseCode;
  // console.log(LiveClassData)
  const BaseURL = useSelector(state => state.UserData.BaseURL)


  useEffect(() =>{
    // getCameraPermission()
    // GetCameraCount()
  },[]);

  const CameraToggle = async() =>{
    if(Video === true){
      await cameraRef.current.pausePreview()
    }else if(Video === false){
      await cameraRef.current.resumePreview()
    }
  }

  const GetCameraCount = async() => {
    let cameraCount = 0;
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 640,
          height: 480,
          frameRate: 30,
          facingMode: (isFront ? "user" : "environment"),
          deviceId: videoSourceId
        }
      });   
      const devices = await mediaDevices.enumerateDevices();
      alert(devices.length)

      devices.map( device => {
        if ( device.kind != 'videoinput' ) { return; };

        cameraCount = cameraCount + 1;
        console.log('Camera count: ' + cameraCount)
        alert('Camera count: ' + cameraCount)
      } );
    } catch( err ) {
      // Handle Error
      console.log(err)
      // alert(err)
    };
  }

  const getCameraPermission = async() =>{
    const { status } = await Camera.requestCameraPermissionsAsync();
    await Camera.requestMicrophonePermissionsAsync()
    setHasPermission(status === 'granted');
  }

  const AppBarContent = {
    title: 'Live Class',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }


  const RenderChat = () => {
    return ChatList.map((data,index)=>{
        return(
                <VStack space={1} key={index} alignSelf='flex-end' mt={1}>
                    <HStack space={1}>
                    <Text style={{fontSize: 9,color: '#8C8C8C'}}>10:30 PM</Text>
                    <Text style={{fontSize: 12,color: '#000000',fontWeight: 'bold'}}>Me</Text>
                    </HStack>

                    <Text style={{fontSize: 12,color: '#000000'}} alignSelf='flex-end'>
                        {data} 
                    </Text>
                </VStack> 
        )
    })
  }

  const EndClass = () =>{
    const API = BaseURL+"endLiveClass";
    if(LiveClassData.liveUUID === ''){
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
            liveClassOrder:LiveClassData.liveClassOrder,
            liveUUID:LiveClassData.liveUUID
          })
      }
      fetch(API, requestOptions)
        .then((res) => res.json())
        .then((result) => {
          if(result.status === 200){
          //  navigation.navigate('LiveVideos')
            navigation.goBack()
            console.log('Live Ended')
          }else{
            alert('something went wrong, please try again later');
          }
        })
    }
  }

  



  return (
    <View style={styles.TopContainer}>
      <ScrollView style={{flex:1}}>
        <SafeAreaView>
          <AppBar props={AppBarContent}/>
          <VStack ml={2} mr={2} mt={4}>
           <VStack alignItems="center" justifyContent="center" >
              {/* <Camera style={styles.CameraBorder} type={type}  ref={cameraRef}> */}
                <HStack alignItems="center" justifyContent="space-between" ml={2} mr={2} mt={2} mb={20}>
                  <HStack alignItems="center" space={1}>
                    <Image 
                      source={require('../../../assets/live.png')}
                      alt="live"
                      size={9}
                    />
                    <Text style={{fontSize:15, color:'#395061', fontWeight:'bold'}}>Live</Text>
                  </HStack>
                  <TouchableOpacity
                    onPress={() => {
                      setType(
                        type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back
                      );
                    }}>
                    <Icon size="lg" as={Ionicons} name="camera-reverse-outline" color="#FFFFFF" m={2}/>
                  </TouchableOpacity>
                </HStack>
                <HStack alignItems="center" space={2} pt={135} justifyContent="center">
                  {/* <Image
                  source={require('../../assets/cameraon.png')}
                  alt='cameraon'
                  size={12}
                  /> */}
                  <IconButton 
                    icon={<Icon as={Feather} name={Video ? 'video':'video-off'}/>}
                    onPress={()=>{ 
                      setVideo(!Video)
                      CameraToggle()
                    }}
                    style={styles.video}
                  />
                  {/* <Image
                  source={require('../../assets/Microphone.png')}
                  alt='cameraon'
                  size={12}
                  /> */}

                  <IconButton 
                    icon={<Icon as={Ionicons} name={Mic ? 'mic-outline':'mic-off-outline'}/>}
                    onPress={()=> setMic(!Mic)}
                    style={styles.MicOn}
                  />

                  {/* <Image
                  source={require('../../assets/screenshare.png')}
                  alt='cameraon'
                  size={12}
                  /> */}
                  <TouchableOpacity
                    onPress={() => EndClass()}
                  >
                  <Image
                  source={require('../../../assets/Hangup.png')}
                  alt='cameraon'
                  size={10}
                  onPress={() => EndClass()}
                  />
                  </TouchableOpacity>
                </HStack>
              {/* </Camera> */}
           </VStack>

          <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold',maxWidth:width/1.3}} ml={2} mr={2} mt={6}>{SingleCD.courseName}</Text>
          <Container ml={2} mr={2} mt={6}>
            <Text style={{color:'#FFFFFF',backgroundColor:'#395061', width:width/1.1, fontSize:20, fontWeight: 'bold', borderTopLeftRadius:10, borderTopRightRadius:10}} p={4}>
              Chat
            </Text>  
          </Container>

          <ScrollView 
            showsHorizontalScrollIndicator={false} 
            style={{height:height/4.5}}
            ref={ref => { scrollView = ref }}
            onContentSizeChange={() => scrollView.scrollToEnd({ animated: true })}
          >          
          <VStack ml={2} mr={2} mt={6} space={4}>
            {/* <VStack space={1}>
              <HStack space={2}>
              <Text style={{fontSize: 20,color: '#000000',fontWeight: 'bold'}}>Nahid</Text>
              <Text style={{fontSize: 15,color: '#8C8C8C'}}>10:30 PM</Text>
              </HStack>

              <Text style={{fontSize: 14,color: '#000000'}}>
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled. 
              </Text>
            </VStack>  */}

            <VStack space={1}>
              <HStack space={2}>
              <Text style={{fontSize:12 ,color: '#000000',fontWeight: 'bold'}}>Ragul</Text>
              <Text style={{fontSize: 9,color: '#8C8C8C'}}>10:30 PM</Text>
              </HStack>

              <Text style={{fontSize: 12,color: '#000000'}}>
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled. 
              </Text>
            </VStack> 
            {ChatList && <RenderChat/>}

          </VStack>
          </ScrollView>          
          <Input 
            variant="filled" 
            bg="#f3f3f3"
            value={ChatText} 
            placeholder="Write a message"
            InputRightElement={
            <IconButton
            onPress={()=>{
                ChatList.push(ChatText)
                setChatText('')
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
          </VStack>
        </SafeAreaView>
      </ScrollView>
    </View>
  )
}

export default LiveClass

const styles = StyleSheet.create({
  TopContainer:{
    flex: 1,
    top: 0,
    backgroundColor:'#fCfCfC',
    height:height,
    width:width,
},
CameraBorder:{
  width:width/1.1,
  height:height/2.5,
},
MicOn:{
  color:'#395061',
  backgroundColor:'#fCfCfC',
  borderRadius:50
},
video:{
  color:'#395061',
  backgroundColor:'#fCfCfC',
  borderRadius:50
}
})