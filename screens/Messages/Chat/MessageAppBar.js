import React,{ Component } from 'react';
import { IconButton,Icon,Text,HStack,Image, StatusBar } from 'native-base';
import {View, Dimensions,StyleSheet,TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getStatusBarHeight } from 'react-native-status-bar-height'

const { width, height } = Dimensions.get('window')

const MessageAppBar = (props) => {
  const AppBarData = JSON.parse(JSON.stringify(props));
  // console.log(props.props.navigation);
  const navigation = props.props.navigation;
  return (
      <View style={{overflow: 'hidden', }}>
        <StatusBar animated={true} backgroundColor="#FFFFFF" barStyle="dark-content" />
      <HStack style={styles.container} paddingY={3} space={2}>
          { 
            AppBarData.props.ArrowVisibility && 
            <IconButton
              onPress={() => navigation.goBack()} 
              style={styles.backbtn} 
              icon={<Icon size="lg" as={Ionicons} name="arrow-back" color="primary.50"/> }
            /> 
          }
          {
          AppBarData.props.RightIcon2 !== null ?
            <Image 
              source={{uri: AppBarData.props.RightIcon2}}
              alt="learner"
              style={styles.learner_img}
              rounded={50}
              size={'xs'}
            />
          :
            <Image 
              source={require('../../../assets/personIcon.png')}
              alt="learner"
              style={styles.learner_img}
              rounded={5}
              size='xs'
            />
        }
          <Text style={styles.Name} color="#000000" >{AppBarData.props.Name}</Text>
        </HStack>
      </View>
  )
}

const styles = StyleSheet.create({
  container:{
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    paddingTop:getStatusBarHeight()
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