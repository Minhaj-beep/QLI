import {View, Dimensions, ScrollView, ActivityIndicator, StyleSheet,TouchableOpacity,PermissionsAndroid} from 'react-native';
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
	registerGlobals,
  getUserMedia
} from 'react-native-webrtc';
import { Camera, CameraPermissionStatus, useCameraDevices } from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { PeerServer } from 'peer';
import { io } from 'socket.io-client';


const { width, height } = Dimensions.get('window')

const LiveClassScreen = ({navigation}) => {

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  const email = useSelector(state => state.Login.email);
  const SingleCD = useSelector(state => state.UserData.SingleCD);
  const LiveClassData = useSelector(state => state.Course.LiveClassD);
  const BaseURL = useSelector(state => state.UserData.BaseURL)

  const [ChatList, setChatList] = useState([]);
  const [ChatText, setChatText] = useState();
  const [cameraType, setCameraType] = useState('front')
  const [isActive, setIsActive] = useState(true)
  
  const cameraRef = useRef();
  const [Mic, setMic] = useState(false);
  const [Video, setVideo] = useState(true);
  // console.log(LiveClassData)
  const CourseCode = SingleCD.courseCode;
  // console.log(LiveClassData)

  const devices = useCameraDevices();
  const device = devices[cameraType]


  useEffect(() => {
    // Create a peer connection
    const pc = new RTCPeerConnection({});

    // Set the peer connection in state
    setPeerConnection(pc);

    // Add a stream to the peer connection
    mediaDevices.getUserMedia({ audio: true, video: true })
      .then(stream => {
        console.log('stream -------------------------', stream)
        setLocalStream(stream);
        pc.addStream(stream);
      });

    // Handle incoming ICE candidates
    pc.onicecandidate = event => {
      if (event.candidate) {
        // Send the ICE candidate to the other peer
        // ...
      }
    };

    // Handle incoming streams
    pc.ontrack = event => {
      setRemoteStream(event.streams[0]);
    };

    return () => {
      // Clean up the peer connection
      pc.close();
    };
  }, []);

  const createOffer = async () => {
    try {
      // Create an offer
      const offer = await peerConnection.createOffer();

      // Set the local description
      await peerConnection.setLocalDescription(offer);

      // Send the offer to the other peer
      // ...
    } catch (error) {
      console.error(error);
    }
  };

  const createAnswer = async () => {
    try {
      // Create an answer
      const answer = await peerConnection.createAnswer();

      // Set the local description
      await peerConnection.setLocalDescription(answer);

      // Send the answer to the other peer
      // ...
    } catch (error) {
      console.error(error);
    }
  };


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

  

  if (device == null) {
    return <ActivityIndicator size={20} color={'red'} />;
  }

  return (
            <VStack ml={2} mr={2} mt={4}>
           <VStack alignItems="center" justifyContent="center" >
              {/* <Camera style={styles.CameraBorder} type={type}  ref={cameraRef}> */}
              {
                isActive ? 
                <View style={{width:width/1.1, height:height/2.5}} >
                    {localStream ? <RTCView style={styles.CameraBorder} zOrder={20} objectFit={"cover"} mirror={true} stream={localStream.toURL()} /> : null}
                  {/* <Camera
                    style={styles.CameraBorder}
                    device={device}
                    isActive={isActive}
                    video={true}
                    audio={true}
                  /> */}
                </View>
                :
                <View style={{width:width/1.1, height:height/2.5, alignItems:"center", justifyContent:"center", backgroundColor:"#8C8C8C"}} >
                  <Image source={require('../../../assets/personIcon.png')} alt='cameraon' size={120} />
                </View>
              }
                <View style={{position:"absolute", width:"90%"}}>
                <HStack  alignItems="center" justifyContent="space-between" ml={2} mr={2} mt={2} mb={20}>
                  <HStack alignItems="center" space={1}>
                    <Image 
                      source={require('../../../assets/live.png')}
                      alt="live"
                      size={9}
                    />
                    <Text style={{fontSize:15, color:'#395061', fontWeight:'bold'}}>Live</Text>
                  </HStack>
                  <TouchableOpacity
                  style={{elevation:1000, zIndex:1000}}
                    onPress={() => {
                      setCameraType(
                        cameraType === 'front'
                          ? 'back'
                          : 'front'
                      );
                    }}>
                    <Icon style={{elevation:1000, zIndex:1000}} size="lg" as={Ionicons} name="camera-reverse-outline" color="#FFFFFF" m={2}/>
                  </TouchableOpacity>
                </HStack>
                <HStack style={{elevation:1000, zIndex:1000}} alignItems="center" space={2} pt={135} justifyContent="center">
                  {/* <Image
                  source={require('../../assets/cameraon.png')}
                  alt='cameraon'
                  size={12}
                  /> */}
                  <IconButton 
                    icon={<Icon as={Feather} name={Video ? 'video':'video-off'}/>}
                    onPress={()=>{ 
                      setVideo(!Video)
                      setIsActive(!isActive)
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
                </View>
           </VStack>

          <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold',maxWidth:width/1.3}} numberOfLines={2} ml={2} mr={2} mt={6}>{SingleCD.courseName}</Text>
          <View>
            {/* <Text>Local stream:</Text>
            {console.log(localStream.toURL(), 'localStream.toURL')}
            {localStream ? <RTCView style={{width:width, height:100, backgroundColor: 'transparent'}} zOrder={0} objectFit={"cover"} mirror={true} stream={localStream} /> : null} */}

            <Text>Remote stream:</Text>
            {remoteStream ? <RTCView stream={remoteStream} /> : null}

            <TouchableOpacity onPress={createOffer}>
              <Text>Create offer</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={createAnswer}>
              <Text>Create answer</Text>
            </TouchableOpacity>
          </View>
          <Container ml={2} mr={2} mt={6}>
            <Text style={{color:'#FFFFFF',backgroundColor:'#395061', width:width/1.1, fontSize:20, fontWeight: 'bold', borderTopLeftRadius:10, borderTopRightRadius:10}} p={4}>
              Chat
            </Text>  
          </Container>

          <ScrollView 
            showsHorizontalScrollIndicator={false} 
            style={{height:height/4.5}}
            // ref={ref => { scrollView = ref }}
            // onContentSizeChange={() => scrollView.scrollToEnd({ animated: true })}
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
  )
}

export default LiveClassScreen

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
  backgroundColor:"transparent"
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