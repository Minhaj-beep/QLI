import { StyleSheet, View,Dimensions,ScrollView } from 'react-native';
import React from 'react';
import { Icon,Modal,Text, Box,VStack,HStack,Input,FormControl,Button,Link,Heading,Image,Container,Center,Spacer,FlatList,IconButton} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import MessageAppBar from './MessageAppBar';


const { width, height } = Dimensions.get('window')

const MessageChat = ({navigation}) => {
  const AppBarContent = {
    Name: 'Naresh Kumar',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }
  return (
    <View style={styles.Container}>
        <SafeAreaView>
            <ScrollView>
              <MessageAppBar  props={AppBarContent}/>
            <View style={styles.TopContainer}>
              <Text>Chat</Text>
            </View>
            </ScrollView>
        </SafeAreaView>
    </View>

  )
}

export default MessageChat

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        top: 0,
        backgroundColor:'#FCFCFC',
        height:height,
        width:width,
        // padding:20
      },
      TopContainer: {
        padding:10
      },
})
