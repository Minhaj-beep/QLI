import { StyleSheet, View,Dimensions, TouchableOpacity, } from 'react-native';
import React from 'react';
import { Divider,Icon,Stack,Text, Avatar,VStack,HStack,Input,FormControl,Button,Link,Heading,Image,Container,Center,Spacer,FlatList,IconButton} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
const {width, height} = Dimensions.get('window')


const MessageCard = ({props}) => {
  const navigation = useNavigation()
  const User_ID = useSelector(state => state.Login.JWT);
  console.log(props.senderId, User_ID)
  

  function calculateAge(givenTime) {
    const currentTime = new Date();
    const givenDateTime = new Date(givenTime);
    
    const elapsedMilliseconds = currentTime - givenDateTime;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);
    const elapsedMonths = Math.floor(elapsedDays / 30);
    const elapsedYears = Math.floor(elapsedMonths / 12);
    
    if (elapsedSeconds < 60) {
      return 'now';
    } else if (elapsedMinutes < 60) {
      return `${elapsedMinutes} minute ago`;
    } else if (elapsedHours < 24) {
      return `${elapsedHours} hour ago`;
    } else if (elapsedDays < 30) {
      return `${elapsedDays} day ago`;
    } else if (elapsedMonths < 12) {
      return `${elapsedMonths} month ago`;
    } else {
      return `${elapsedYears} year ago`;
    }
  }

  return (
    <TouchableOpacity onPress={()=>navigation.navigate('MessageChat', {instructor: props})}>
            <Stack p="4" marginBottom={-5} space={0}>
                <View style={{ flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                    <View style={{ flexDirection:"row"}}>
                        <View>
                            {
                                props.hasOwnProperty('profileImgPath') ?
                                <Avatar bg="green.500" source={{uri: props.profileImgPath }}>{props.fullName}</Avatar>
                                :
                                <Avatar bg="green.500" source={require('../../assets/personIcon.png')}>{props.fullName}</Avatar>
                            }
                        </View>
                        <View style={{marginLeft:10, maxWidth: width*0.6}}>
                            <Text noOfLines={1} maxW={'72'} style={{fontSize:14, fontWeight:"500"}}>{props.fullName}</Text>
                            {
                                props.senderId === User_ID ?
                                <Text noOfLines={1} maxW={'72'} style={{fontSize:11, fontWeight:"500"}}>{props.message !== '' ? 'Me: ' + props.message : ''}</Text>
                                :
                                <Text noOfLines={1} maxW={'72'} style={{fontSize:11, fontWeight:"500"}}>{props.message !== '' ? props.fullName + ': ' + props.message : ''}</Text>
                            }
                        </View>
                    </View>
                    <View bottom={1}>
                        <Text color={'gray.500'} style={{fontSize:11, fontWeight:"500"}}>{props.lastActive !== '' ? calculateAge(props.lastActive) : ''}</Text>
                    </View>
                </View>
                <Divider style={{marginTop:5}} />
            </Stack>
        </TouchableOpacity>
  )
}

export default MessageCard

const styles = StyleSheet.create({
    learner_chat:{
        width:40,
        height:40,
      },
      chatTile:{
        padding:10,
        borderRadius: 5,
        backgroundColor: "#FFFFFF",
      }
})