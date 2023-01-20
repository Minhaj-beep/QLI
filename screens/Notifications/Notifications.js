import { StyleSheet, View,Dimensions,ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {VStack,Text,HStack,Icon} from 'native-base';
import AppBar from '../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { setLoading } from '../Redux/Features/authSlice';
import {setNCount} from '../Redux/Features/loginSlice';
import { useEffect } from 'react';
import { useState } from 'react';
import moment from 'moment';
// import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window')

const Notifications = ({navigation}) => {
  
  const dispatch = useDispatch();

  const email = useSelector(state => state.Login.email);
  console.log('Email : ',email)
  const BaseURL = useSelector(state => state.UserData.BaseURL)
  console.log(BaseURL)
  const [NData, setNData] = useState();
  
  const AppBarContent = {
    title: 'Notification',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  useEffect(()=>{
    GetNotification()
  },[])

  const GetNotification = () =>{
    dispatch(setLoading(true))
    const API = BaseURL+'v1/notifications/getNotifications'
    // const API = 'https://api.dev.qlearning.academy/v1/notifications/getNotifications'
    var requestOptions = {
      method:'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'gmailUserType':'INSTRUCTOR',
        'token':email
      }
    }
    // console.log()
    fetch(API, requestOptions)
    .then(response => response.json())
    .then(result => {
      if(result.status === 200)
      {
        console.log(result.data.result.notificationList)
        console.log('Heloooooooooo ....')
        let re = result.data;
        let res = re.result
        dispatch(setNCount(re.count))
        // console.log(re.count)
        // console.log(res.notificationList)
        setNData(res.notificationList)
        dispatch(setLoading(false))
        // console.log(NData)
      }else if(result.status > 200){
        dispatch(setLoading(false))
        // alert('Error1: ' + result.message);
        console.log(result.message);
      }
    }).catch(error =>{
      dispatch(setLoading(false))
      console.log(error)
      // alert('Error2: ' + error);
    })
  }

  const Render = () =>{
    return NData.map((data, index)=>{
      const TimeD = moment(data.notificationDate).format('DD MMM, YYYY hh:mm a')
      return(
        <View key={index} style={{marginTop:10}}>
          <HStack style={styles.card} space={3} maxWidth={width/0.5}>
            <View>
              <View style={{backgroundColor:"#F0E1EB", padding:10, borderRadius:10}}>
                <Icon as={<MaterialIcons name="notifications-active"/>} size={7}/>
              </View>
            </View>
            <VStack style={{maxWidth:width/1.2}} justifyContent="center">
                <Text style={{color:"#395061", fontWeight:'bold', fontSize:16, maxWidth:width/1.5}}>{data.subject}</Text>
                {/* <Text style={{color:"#395061", fontSize:13,maxWidth:width/1.45}}>{data.content}</Text> */}
                {/* <Text style={{color:"#8C8C8C", fontSize:11}}>22 February, 2022</Text> */}
                <Text style={{color:"#8C8C8C", fontSize:10}}>{TimeD}</Text>
            </VStack>
          </HStack>
        </View>
      )
    })
  }
  return (
    <SafeAreaView>
      <AppBar props={AppBarContent}/>
      <ScrollView nestedScrollEnabled={true} style={{marginBottom:100}}>
      <VStack space={3} style={styles.Container}>
      {NData && <Render/>}
      </VStack>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Notifications

const styles = StyleSheet.create({
  Container:{
   margin:15
  },
  card:{
    backgroundColor:"#F8F8F8",
    padding:10,
    shadowColor: "rgba(0, 0, 0, 0.03)",
    shadowOffset: {
      width: 0,
      height: 0.38
    },
    borderRadius:6,
  }
})