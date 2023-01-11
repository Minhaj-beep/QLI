import React,{useState,useEffect}from 'react';
import {View,Dimensions, ScrollView, TouchableWithoutFeedback, StyleSheet,TouchableOpacity,Text} from 'react-native';
import {Image,Button,IconButton,Icon,VStack,HStack,Container,Center,ZStack,Box} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../components/Navbar';
import ProfileImg from './DashImg';
import ProfileSettings from './ProfileSettings';
import {useDispatch,useSelector} from 'react-redux';
import {setLoading, setLoggedIn} from '../Redux/Features/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';

const { width, height } = Dimensions.get('window')

const ProfileDash = ({navigation}) => {

    const dispatch = useDispatch();
    const ProfileD = useSelector(state => state.UserData.profileData);
    const email = useSelector(state => state.Login.email) 
    const name = useSelector(state => state.Login.Name)
    console.log('This is the profi;e data: m ', ProfileD)

//   useEffect(()=>{
//     GetAccountInfo()
//   },[])

//   const GetAccountInfo = () =>{
//     dispatch(setLoading(true))
//     const API = BaseURL+'getPaymentInfoByEmail'
//     var requestOptions = {
//       method:'GET',
//       headers:{
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'gmailUserType':'INSTRUCTOR',
//         'token':email
//       },
//     }
//     fetch(API, requestOptions)
//     .then(response => response.json())
//     .then(result => {
//       if(result.status === 200)
//       {
//         let arr = result.data
//         let LastElement = arr.length - 1
//         var LArr = result.data[LastElement]
//         // console.log(LArr)
//         dispatch(setBankData(LArr))
//         dispatch(setLoading(false))
//       }else if(result.status > 200){
//         dispatch(setLoading(false))
//         alert('Error: ' + result.message);
//         console.log(result.message);
//       }
//     }).catch(error =>{
//       dispatch(setLoading(false))
//       console.log(error)
//       alert('Error: ' + error);
//     })
//   }

  const AppBarContent = {
    title: '',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  const ClearLocalStorage = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      alert('Local storage error: ' + e);
    }
  };

  const GSignOut = async () => {
    try {
      await GoogleSignin.signOut()
        .then(() => console.log('Google logged out'))
        .catch(error => {
          console.log('Error:' + error);
        });

      auth()
        .signOut()
        .then(() => console.log('Google logged out'))
        .catch(error => {
          console.log('Error:' + error);
        });
    } catch (error) {
      console.log('Error:' + error);
    }
  };

  const LogOut = () => {
    dispatch(setLoading(true));
    dispatch(setLoggedIn(false));
    ClearLocalStorage();
    GSignOut();
    dispatch(setLoading(false));
  };

  return (
  <ScrollView style={styles.Container}>
    <AppBar props={AppBarContent}/>

      <View style={styles.profileImg}>
            <ProfileImg props={ProfileD.profileImgPath}/>     
      </View>
     <Center mt={2} mb={3}>
      <Text style={{fontWeight: 'bold', color: '#364b5b', fontSize:25}}> {ProfileD ? ProfileD.fullName : name} </Text>
      <Text style={{fontSize:13, color: '#364b5b',fontWeight: 'bold'}}>
      {ProfileD ? ProfileD.email : email}
      </Text>
     </Center>

      <ProfileSettings navigation={navigation}/>
    <TouchableOpacity>
    <Button 
        bg='primary.100' 
        ml={10} mr={10} mt={4} mb={4} p={3} 
        borderRadius={6}
        onPress={() =>{ LogOut() }}>
        Logout
      </Button>
    </TouchableOpacity>
         
  </ScrollView>
  )}

export default ProfileDash

const styles = StyleSheet.create({
  Container: {
    height:height,
    width:width,
    backgroundColor:"#FFFFFF"
  },
  profileImg:{
    height:height/3.5,
    // width:width,
    marginRight:60,
    alignItems:"center"
  },
 
})