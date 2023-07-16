import { StyleSheet, View,Dimensions, Linking, TouchableOpacity } from 'react-native';
import React from 'react';
import { Icon,Modal,Text, Box,VStack,HStack,Input,FormControl,Button,Link,Heading,Image,Container,Center,Spacer,FlatList,IconButton} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const LearnerCard = ({data}) => {
  const navigation = useNavigation()
  const sendMailToStudent = async () => {
    // await Linking.openURL(`mailto:${data.studentEmail}`)
    navigation.navigate('Messages', {studentName: data.studentName})
    // console.lo/g(data)
  } 

  return (
    <View>
    <HStack space={2} style={styles.chatTile}>
      <HStack space={2}>
        {
          data.hasOwnProperty('studentImagePath') ?
          <Image 
            source={{uri: data.studentImagePath}}
            alt="learner"
            style={styles.learner_img}
            rounded={50}
            size='sm'
          />
          :
          <Image 
            source={require('../../assets/personIcon.png')}
            alt="learner"
            style={styles.learner_img}
            rounded={5}
            size='sm'
          />
        }
        <VStack style={{ justifyContent: 'center'}}>
          <Text style={{color:'#000000',fontWeight:'bold',fontSize:12}}>{data.studentName}</Text>
          <Text style={{color:'#8C8C8C',fontSize:10}}>{data.studentEmail}</Text>
        </VStack>
      </HStack>
      <TouchableOpacity onPress={sendMailToStudent} style={{ justifyContent: 'center'}}>
        <Image 
            source={require('../../assets/chatting.png')}
            alt="learner"
            style={styles.learner_chat}
            rounded={5}
        />
      </TouchableOpacity>
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