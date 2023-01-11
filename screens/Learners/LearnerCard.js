import { StyleSheet, View,Dimensions,ScrollView } from 'react-native';
import React from 'react';
import { Icon,Modal,Text, Box,VStack,HStack,Input,FormControl,Button,Link,Heading,Image,Container,Center,Spacer,FlatList,IconButton} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";

const LearnerCard = () => {
  return (
    <View>
    <HStack space={2} style={styles.chatTile}>
      <HStack space={2}>
        <Image 
          source={require('../../assets/learner_img.png')}
          alt="learner"
          style={styles.learner_img}
          rounded={5}
          size='sm'
        />
        <VStack style={{ justifyContent: 'center'}}>
          <Text style={{color:'#000000',fontWeight:'bold',fontSize:12}}>MN Nahid</Text>
          <Text style={{color:'#8C8C8C',fontSize:10}}>mnnahid32584@gmail.com</Text>
        </VStack>
      </HStack>
      <View style={{ justifyContent: 'center'}}>
        <Image 
            source={require('../../assets/chatting.png')}
            alt="learner"
            style={styles.learner_chat}
            rounded={5}
        />
      </View>
      </HStack>
    </View>
  )
}

export default LearnerCard

const styles = StyleSheet.create({
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
      }
})