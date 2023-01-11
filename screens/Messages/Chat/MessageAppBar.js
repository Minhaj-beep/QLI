import React,{ Component } from 'react';
import { IconButton,Icon,Text,HStack,Image } from 'native-base';
import {View, Dimensions,StyleSheet,TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window')

const MessageAppBar = (props) => {
  const AppBarData = JSON.parse(JSON.stringify(props));
  // console.log(props.props.navigation);
  const navigation = props.props.navigation;
  return (
    <SafeAreaView>
      <View style={{overflow: 'hidden', paddingBottom: 5 }}>
      <HStack style={styles.container} mt={1} space={2}>
          { 
            AppBarData.props.ArrowVisibility && 
            <IconButton
              onPress={() => navigation.goBack()} 
              style={styles.backbtn} 
              icon={<Icon size="lg" as={Ionicons} name="arrow-back" color="primary.50"/> }
            /> 
          }
          <Image source={require('../../../assets/chat_person.png')} alt='person1' style={{ width:60, height:60}}/>
          <Text style={styles.Name} color="#000000" >{AppBarData.props.Name}</Text>
        </HStack>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    // shadowColor: '#000',
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.4,
    // shadowRadius: 3,
    // elevation: 4,
  },
  backbtn:{
    fontWeight:'bold',
  },
  acbtn:{
    borderRadius:35,
  },
  Name: {
    fontSize: 17,
    fontWeight: 'bold',
  }
})

export default MessageAppBar