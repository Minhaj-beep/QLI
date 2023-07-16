import {View, Dimensions, Text, ScrollView, ActivityIndicator, StyleSheet,TouchableOpacity,PermissionsAndroid} from 'react-native';
import {useState,useEffect,React, useCallback, useRef} from 'react';
import AppBar from '../../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import {mediaDevices,} from 'react-native-webrtc';
import Peer from 'react-native-peerjs'
import WebView from 'react-native-webview';
const { width, height } = Dimensions.get('window')

const GoLive = ({navigation}) => {
  const [endClass, setEndClass] = useState(null)
  const email = useSelector(state => state.Login.email);
  const name = useSelector(state => state.Login.Name);
  const SingleCD = useSelector(state => state.UserData.SingleCD);
  const LiveClassData = useSelector(state => state.Course.LiveCourseLiveObject);
  const courseCode = useSelector(state => state.Course.CurrentLiveCourseCode);
  const GTD = useSelector(state => state.Course.LiveClassDetails);
  console.log('This is the object: ', courseCode, )
  const BaseURL = useSelector(state => state.UserData.BaseURL)
  const [roomId, setRoomId] = useState([])
  const [url, setUrl] = useState(null)
  console.log(LiveClassData.liveUUID)

  useEffect(()=>{
    if(endClass !== null){
      navigation.navigate('Tabs', {screen: 'Courses'})
    }
  },[endClass])

  useEffect(()=>{
    var token = GTD.joinLiveLink.split('?')
    mediaDevices.getUserMedia({
            audio: true,
            video: true,
        })
        .then((stream) => {
            myVideoStream = stream;
            var peer = new Peer(undefined, {
                path: "/peerjs",
                host: "live.qlearning.academy",
                port: "", //443
                secure: true,  
            });
            console.log("Connected on default Port");
            peer.on("open", (id) => {
                console.log("join-room", id);
                setUrl(`https://uat.qlearning.academy/live-room-app/${courseCode}?${token[1]}`)
                console.log(`https://uat.qlearning.academy/live-room-app/${courseCode}?${token[1]}`)
            });
        })
  }, [])

  const AppBarContent = {
    title: 'Live Class',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  const onMessage = (data) => {
    console.log('End class date recived:', data)
    setEndClass(data.nativeEvent.data);
  }

  return (
    <View style={styles.TopContainer}>
          <AppBar props={AppBarContent}/>
          {/* <View style={{position:"absolute", width:"100%", height:500, backgroundColor:"blue", zIndex:1000, elevation:1000}}>
            <Text>Hellooooooooooooooooooooooooooooooooooooooooooooooo</Text>
          </View> */}
          {
            url !== null ?
                <WebView 
                  style={{height:'100%', width:'100%'}} 
                  source={{ uri: url }} 
                  allowsInlineMediaPlayback={true} 
                  mediaPlaybackRequiresUserAction={false}
                  mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
                  allowsProtectedMedia={true}
                  allowsAirPlayForMediaPlayback={true}
                  startInLoadingState
                  scalesPageToFit
                  onMessage={onMessage}
                  javaScriptEnabled={true}
                  userAgent={'Mozilla/5.0 (Linux; An33qdroid 10; Android SDK built for x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.185 Mobile Safari/537.36'}
                />
            : null
          }
    </View>
  )
}

export default GoLive

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