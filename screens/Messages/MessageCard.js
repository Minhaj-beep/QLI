import { StyleSheet, View,Dimensions,ScrollView } from 'react-native';
import React from 'react';
import { Divider,Icon,Modal,Text, Box,VStack,HStack,Input,FormControl,Button,Link,Heading,Image,Container,Center,Spacer,FlatList,IconButton} from 'native-base';


const MessageCard = () => {
  return (
    <View>
      <HStack space={2} style={styles.chatTile}>
        <Image 
        source={require('../../assets/learner_img.png')}
        alt="learner"
        style={styles.learner_img}
        rounded={5}
        size='sm'
        />
        <VStack space={2}>
        <HStack justifyContent='space-between' space={2} width='75%'>
            <Text style={{color:'#000000',fontWeight:'bold',fontSize:15}}>Naresh Kumar</Text>
            <Text style={{color:'#8C8C8C',fontSize:15}}>3d</Text>
        </HStack>
        <Text style={{color:'#8C8C8C',fontSize:14}}>Me: how are you ?</Text>
        </VStack>
    </HStack>
    <Divider mx={1} color='#8C8C8C'/>
    </View>
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