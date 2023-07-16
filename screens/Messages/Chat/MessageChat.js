import { StyleSheet, Dimensions,ScrollView } from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import { Icon, Text, Input, View, HStack, VStack, IconButton, Avatar} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import MessageAppBar from './MessageAppBar';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { messageSocket } from '../../StaticData/MessageSocket';


const { width, height } = Dimensions.get('window')

const MessageChat = ({navigation, route}) => {
  const instructor = route.params.instructor
  const scrollViewRef = useRef();
  const ProfileD = useSelector(state => state.UserData.profileData);
  const User_ID = useSelector(state => state.Login.JWT);
  const name = ProfileD.hasOwnProperty('firstName') && ProfileD.firstName !== '' ? ProfileD.firstName + ' ' + ProfileD.middleName + ' ' + ProfileD.lastName : useSelector(state => state.Auth.TempName)
  const instructorId = instructor.id
  console.log(ProfileD, '------------------------------->HERE IS THE DATA<------------------------------', name)

  const [msgList, setMsgList] = useState([])
  const [ChatText, setChatText] = useState('');
  // console.log(instructor)

  const AppBarContent = {
    Name: instructor.fullName,
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2: instructor.hasOwnProperty('profileImgPath') ? instructor.profileImgPath : null          
  }

  useEffect(()=>{
    console.log('Message list : ', Object.keys(msgList).length)
    console.log("studentId: ", User_ID,  'instructorId: ', instructorId)
  },[msgList])

  useEffect(()=>{
    // setChatLoading(true)
    messageSocket.connect()
    messageSocket.open()
    messageSocket.on("connection-success", async(response) => {
        console.log(`Socket connected ${response.socketId}`);
    })
    messageSocket.emit('join', { studentId: instructorId,  instructorId: User_ID }, async res => {
        console.log(`Has user Joined: ${res}`);
        // res.map(i => console.log(i))
    })
    messageSocket.emit("getPreviousMessage", { studentId: instructorId,  instructorId: User_ID }, (response) => {
        console.log("getPreviousMessage", response)
        if(response.hasOwnProperty('messages')) {
            setMsgList(chatMessages => ([
            ...response.messages
            ]));
        }
        // setChatLoading(false)
    })
    messageSocket.on("message", receiveMessages)
    return () => {
        messageSocket.off("message", receiveMessages)
        messageSocket.disconnect()
        messageSocket.close();
        messageSocket.on("disconnect", async () => {
            console.log("client disconnected from server");
        })
    }
  },[])

  const receiveMessages = useCallback((response) => {
    console.log("recev live chat-------->");
    console.log(response);
        // setMsgList(chatMessages => ([
        //     ...chatMessages,
        //     {
        //         userName: response.userName,
        //         time: response.createdAt,
        //         message: response.message,
        //         type: response.type,
        //     }
        // ]));
  }, [])

  const sendMsg = (Message) => {
    // setChatLoading(true)
    console.log('Send Message: ', Message)
    messageSocket.emit("sendMessage", {
        studentId: instructorId,
        instructorId: User_ID,
        message: Message,
        userName: name,
        senderId: User_ID,
    }, () => {
        console.log("sendMessage callback!")
        setMsgList(chatMessages => ([
            ...chatMessages,
            {
                userName: name,
                dt: new Date(),
                message: Message,
                senderId: User_ID
            }
        ]))
        setChatText('')
        // setChatLoading(false)
    })
  }

  const RenderChat = () => {
    return msgList.map((data, index) => {
        const date = new Date(data.dt).toLocaleString()
        return (
            <VStack key={index} mt={4} alignSelf='flex-start'>
            <HStack alignSelf={'flex-start'} space={2}>                    
                {
                data.senderId === User_ID ?
                <>
                    {
                    ProfileD.hasOwnProperty("profileImgPath") && ProfileD.profileImgPath !== '' ?
                    <Avatar bg="green.500" size={'sm'} source={{ uri: ProfileD.profileImgPath}}>{name}</Avatar>
                    :
                    <Avatar bg="green.500" size={'sm'} source={require('../../../assets/personIcon.png')}>{name}</Avatar>
                    }
                </>
                :
                <>
                    {
                    instructor.hasOwnProperty('profileImgPath') && instructor.profileImgPath !== '' ?
                    <Avatar bg="green.500" size={'sm'} source={{ uri: instructor.profileImgPath}}>{instructor.fullName}</Avatar>
                    :
                    <Avatar bg="green.500" size={'sm'} source={require('../../../assets/personIcon.png')}>{instructor.fullName}</Avatar>
                    }
                </>
                }
                <VStack>
                <HStack alignItems="center" alignSelf={'flex-start'} space={2}>
                    {/* <Text color={'primary.900'} style={{fontSize:12,fontWeight:'bold',  }}>{data.userName === ProfileD.fullName ? ProfileD.fullName : data.userName}</Text> */}
                    {
                        data.senderId === User_ID ?
                        <Text color={'primary.900'} style={{fontSize:12,fontWeight:'bold',  }}>{name}</Text>
                        :
                        <Text color={'primary.900'} style={{fontSize:12,fontWeight:'bold',  }}>{instructor.fullName}</Text>
                    }
                    <Text style={{fontSize:8, color:'#8C8C8C' }}>{date}</Text>
                </HStack>
                {/* {
                    data.type === 'TEXT' ? */}
                    <Text style={{fontSize:12, color:'#000000', maxWidth:width*0.85, alignSelf:'flex-start'}}>{data.message}</Text>
                    {/* :
                    <HStack alignItems={"center"} bg={'#b5b5b5'} borderRadius={10} padding={2} width={'100%'}>
                        <IconButton
                            onPress={()=>{
                            // OpenDoc(data.message)
                            }}
                            icon={<Icon size='lg' as={MaterialCommunityIcons} name='download-circle' color='#395061'/>}
                        />
                        <View>
                            <Text numberOfLines={2} style={{fontSize:11, color:'#000000', maxWidth:width/3, marginLeft:5, alignSelf:'flex-end'}}>{data.message.replace('https://ql-files.s3.ap-south-1.amazonaws.com/ticket-files/', '').slice(14).split('%20').join(' ')}</Text>
                        </View>
                    </HStack>
                } */}
                </VStack>
            </HStack>
            </VStack>
        )
    })
  }

  

  return (
    <View style={{ flex:1, width:"100%", height:"100%"}}>
      <MessageAppBar props={AppBarContent}/>
      <ScrollView showsHorizontalScrollIndicator={false} 
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        <View style={{flex:1, width:"95%", alignSelf:"center"}}>
          {Object.keys(msgList).length > 0 ? <RenderChat/> : <Text style={{fontSize:12, alignSelf:"center", marginTop:"1%", color:'#8C8C8C'}}>This chat is empty.</Text>}
        </View>
      </ScrollView>
      <View style={{bottom:0, width:"100%", }}>
        <View >
          <Input onChangeText={setChatText} value={ChatText} placeholder="Got any new thought.." marginBottom={2} width="95%" alignSelf={"center"} borderRadius="4" py="1" px="1" fontSize="11" fontWeight={"500"} 
            InputRightElement={<Icon onPress={()=>sendMsg(ChatText)} m="2" ml="3" size="6" color="primary.900" 
            as={<MaterialIcons name="send" />} />} 
          />
        </View>
      </View>
    </View>
  )
}

export default MessageChat
