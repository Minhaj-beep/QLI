import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, Dimensions, ScrollView, ActivityIndicator, StyleSheet,TouchableOpacity,PermissionsAndroid} from 'react-native';
import { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, RTCView, MediaStream, MediaStreamTrack, mediaDevices, registerGlobals } from 'react-native-webrtc';
import io from 'socket.io-client'
import {useDispatch,useSelector} from 'react-redux';
import {VStack,Icon,HStack, ZStack, Linking, Image,Container,Text,Input, IconButton} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Peer from 'react-native-peerjs'
import { PeerServer } from 'peer';
import WebView from 'react-native-webview';
const {width, height} = Dimensions.get('window')

const LiveClassScreen = ({navigation}) => {
    const email = useSelector(state => state.Login.email);
    const name = useSelector(state => state.Login.Name);
    const SingleCD = useSelector(state => state.UserData.SingleCD);
    const LiveClassData = useSelector(state => state.Course.LiveClassD);
    const BaseURL = useSelector(state => state.UserData.BaseURL)
    const [roomId, setRoomId] = useState([])
    const [url, setUrl] = useState(null)
    console.log(LiveClassData.liveUUID)
    
    useEffect(()=>{
        var token = LiveClassData.joinLiveLink.split('?')
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
                    setUrl(`https://dev.qlearning.academy/live-room-app/${id}?${token[1]}`)
                });
            })
    }, [])

    return (    
        <>
            {
                url !== null ?
                <View style={{flex: 1 }}>
                    {console.log(url)}
                    <WebView style={{flex:1}} source={{ uri: 'https://stackoverflow.com/questions/35451139/react-native-webview-not-loading-any-url-react-native-web-view-not-working' }} />
                </View>
                : null
            }
        </>
    );
}

const styles = StyleSheet.create({
    rtcView: {
        width:width/1.1,
        height:height/2.5
    },
});

export default LiveClassScreen