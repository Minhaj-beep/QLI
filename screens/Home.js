import {useState,useEffect,React} from 'react';
import {View, Dimensions, ScrollView, StyleSheet,TouchableOpacity, Linking, PermissionsAndroid} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon,Text,VStack,HStack,Button,Image,Center,IconButton, Modal} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppBar from './components/Navbar';
import { SetCourseData,setLoading,setProfileData,setTHistory, setTransactionHistory, setLoggedIn } from './Redux/Features/userDataSlice';
import { setIsLoggedInWithMobile, setUser_ID, setTempName } from './Redux/Features/authSlice';
import { setLogin_Status, setProfileImg,setUserImage,setName,setEmail,setJWT,setNCount, setIsNotificationReady } from './Redux/Features/loginSlice';
import {useDispatch,useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setLiveCourses} from './Redux/Features/CourseSlice';
import { GetWithdrawDashboardData } from './Functions/API/GetWithdrawDashboardData';
import { LearnerList } from './Functions/API/LearnersList';
import PushNotification from 'react-native-push-notification';
import { PushNotificationRegister } from './Functions/API/PushNotificationRegister';
// import { getApiHeader } from './Functions/GetApiHeader';

const { width, height } = Dimensions.get('window')


const Home = ({navigation}) => {
  
  // const header = getApiHeader()
  // console.log('______________API Header_____________________', header)
  const dispatch = useDispatch();
  const GUser = useSelector(state => state.Auth.GUser);
  const User_ID = useSelector(state => state.Auth.User_ID);
  const email = useSelector(state => state.Auth.Mail);
  const BaseURL = useSelector(state => state.UserData.BaseURL);
  const Name = useSelector(state => state.UserData.profileData);
  const transactionData = useSelector(state => state.UserData.TransactionHistory);
  const [NMCount, setNMCount] = useState();
  const [DashData, setDashData] = useState();
  const [setToken, isSetToken] = useState(false)
  const [appBarLoaded, setAppBarLoaded] = useState(false);
  const JWT = useSelector(state => state.Login.JWT);

  const [showModal, setShowModal] = useState(false)

  // const screenProps = {
  //   action: 'Assessment',
  //   assessmentCode: '83b33b7f-da43-4ecd-91de-7f74f067c1a9'
  // };
  // const screenProps = {
  //   action: 'Transaction',
  //   _id: '64269ce19851101bf973d8f7'
  // };
  const screenProps = {
    action: 'Discount',
    _id: '640c1c051d90bfd2f07bb5cf'
  };
  // const screenProps = {
  //   action: 'Message',
  //   fullName: "Minhaj null Ahmed",
  //   id: "63cfc0c466ea84b9fc87e7ee",
  //   lastActive: "",
  //   message: "",
  //   profileImgPath: 'https://ql-files.s3.ap-south-1.amazonaws.com/images/image-1676614291325.jpg'
  // };
  // const screenProps = {
  //   liveScreenMessage: 'CourseRecorded',
  //   courseCode: "39522e00-02c8-4558-8c06-67624c64aa7e",
  // };
  // const screenProps = {
  //   liveScreenMessage: 'CourseLive',
  //   courseCode: "1403b434-c281-4620-a5ff-fa0c67df52fa",
  // };

  PushNotification.configure({
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
      // navigation.navigate('ViewCourse', {screenProps: screenProps})
      navigation.navigate('CourseDiscount', {screenProps: screenProps})
      // navigation.navigate('Tabs', {screen: 'Courses', params: { initialTab: 'AssessmentTab', screenProps: screenProps }})
      // let data = JSON.parse(notification.data.app)
      // console.log(data.courseCode, data.type)
      // notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    onAction: function (notification) {
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATION:", notification);
    },

    onRegistrationError: function(err) {
      console.error(err.message, err);
    },

    // permissions: {
    //   alert: true,
    //   badge: true,
    //   sound: true,
    // },
    // popInitialNotification: true,
    // requestPermissions: true,
  });

  // if(JWT !== '' && !setToken){
  //   PushNotification.configure({
  //     onRegister: function (token) {
  //       console.log("TOKEN:", token);
  //       RegisterPushNotificationToken(token)
  //     },
  //     onNotification: function (notification) {
  //       console.log("NOTIFICATION:", notification);
  //       // notification.finish(PushNotificationIOS.FetchResult.NoData);
  //     },
  
  //     onAction: function (notification) {
  //       console.log("ACTION:", notification.action);
  //       console.log("NOTIFICATION:", notification);
  //     },
  
  //     onRegistrationError: function(err) {
  //       console.error(err.message, err);
  //     },
  
  //     permissions: {
  //       alert: true,
  //       badge: true,
  //       sound: true,
  //     },
  //     popInitialNotification: true,
  //     requestPermissions: true,
  //   });
  // }

  // const RegisterPushNotificationToken = async(token) => {
  //   console.log('_________________PUSH NOTIFICATION REGISTRATION STARTS______________________')
  //   if(JWT !== '') {
  //     try {
  //       const result = await PushNotificationRegister(token, JWT)
  //       console.log(result)
  //       isSetToken(true)
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }
  //   console.log('_________________PUSH NOTIFICATION REGISTRATION STARTS______________________')
  // }

  
  useEffect(()=>{
    CheckLogin()
    getData()
    // Permissions()
    // getWithdrawDashboardData(header)
  },[])

  const Permissions = async () => {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      ]).then(res => {
        console.log(res, 'This is what is going on');
        if(res['android.permission.RECEIVE_SMS'] === 'never_ask_again'){
          setShowModal(true)
        }
      });
    } catch (e) {
      console.log('Error:' + e.message);
    }
  };
  
  const GetProfileD = async email => {

    if (email === '') {
      alert('Something is wrong, please login again');
    } else {
      const requestOptions = {
        method: 'GET',
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'x-auth-token':UserD.JWT,
        // },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          gmailUserType: 'INSTRUCTOR',
          token: email,
        },
      };
      await fetch(BaseURL + 'getInstructorByEmail?instructorEmail=' + email, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            // console.log(result.data.profileImgPath);
            dispatch(setProfileData(result.data));
            if (result.data.profileImgPath != null) {
              console.log('Profile image retrieved');
              dispatch(setProfileImg(true));
            } else {
              console.log('No profile image');
              dispatch(setProfileImg(false));
            }
            dispatch(setLoading(false));
            console.log('Helooooooo')
            // Permissions();
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            // alert('GetProfileD error 1 : ' + result.message);
            console.log('GetProfileD error 1 : ' + result.message);
          }
          // console.log(result);
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('GetProfileD error 2 : ' + error);
          // alert('GetProfileD error 2 : ' + error);
        });
    }
  };

  const CheckLogin = async () => {
    // let jwt = await AsyncStorage.getItem('JWT')
    // if(jwt !== null) dispatch(setJWT(jwt.substring(1, jwt.length-1)))
    // let userID = await AsyncStorage.getItem('setUser_ID')
    // if(userID !== null) dispatch(setUser_ID(jwt.substring(1, jwt.length-1)))
    // console.log('HoWdYYYYYYYYYYYYYYYYYYY : ', jwt, userID)
    let TempName = await AsyncStorage.getItem('TempName')
    if(TempName !== null) dispatch(setTempName(JSON.parse(TempName)))
    console.log('The temorary anme has been saved!!!!!!!!!!!!!!!!!!', TempName)
    dispatch(setLoading(true));
    await AsyncStorage.getItem('Email')
    .then(email => {
      if (email) {
        let mail = JSON.parse(email);
        GetProfileD(mail);
        dispatch(setLoading(false));
        dispatch(setLoggedIn(true));
        console.log('Emaillllllllllll')
        } else {
          dispatch(setLoading(false));
          dispatch(setLoggedIn(false));
          console.log('Something went wrong with the local storage!');
        }
      })
      .catch(error => {
        console.log(error);
        // alert('Error CheckLogin : ' + error);
      });
  };

  const GetNotification = (email) =>{
    dispatch(setLoading(true))
    const API = BaseURL+'v1/notifications/getNotifications'
    var requestOptions = {
      method:'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'gmailUserType':'INSTRUCTOR',
        'token':email
      }
    }
    // console.log(requestOptions)
    fetch(API, requestOptions)
    .then(response => response.json())
    .then(result => {
      if(result.status === 200)
      {
        console.log('Is app bar loaded: ', result.data)
        let re = result.data;
        let res = re.count
        dispatch(setNCount(res))
        setNMCount(res)
        dispatch(setLoading(false))
        setAppBarLoaded(true)
        // console.log(NData)
      }else if(result.status > 200){
        dispatch(setLoading(false))
        // alert('Error: ' + result.message);
        console.log(result.message);
      }
    }).catch(error =>{
      dispatch(setLoading(false))
      console.log(error)
      // alert('Error: ' + error);
    })
  }
  const getData = async () => {
    dispatch(setLoading(true));
    try {
      const LEmail = await AsyncStorage.getItem('Email')
      const LName = await AsyncStorage.getItem('Name')
      console.log(LEmail, LName)
      if(GUser === true){
        const LJWT = await AsyncStorage.getItem('JWT')
        const RJWT = LJWT != null ? JSON.parse(LJWT) : null;
        const REmail = LEmail != null ? JSON.parse(LEmail) : null;
        const RName = LName != null ? JSON.parse(LName) : null;
        
        dispatch(setName(RName));
        dispatch(setEmail(REmail));
        
        dispatch(setJWT(RJWT));
        
        console.log('++++++++++++++++++++++', REmail)
        getCourseCodes(REmail);
        getProfile(REmail);
        getLiveCourse(REmail);
        GetNotification(REmail);
        GetDData(REmail);
        getWithdrawDashboardData(REmail)
        
        dispatch(setLoading(false));
      }else{
        const LJWT = await AsyncStorage.getItem('JWT')
        const user_ID = await AsyncStorage.getItem('setUser_ID')
        let isLoggedInWithMobile = await AsyncStorage.getItem('IsLoggedInWithMobile')
        
        const REmail = LEmail != null ? JSON.parse(LEmail) : null;
        const RName = LName != null ? JSON.parse(LName) : null;
        const RJWT = LJWT != null ? JSON.parse(LJWT) : null;
        const User_ID = user_ID != null ? JSON.parse(user_ID) : null;
        const IsLoggedInWithMobile = isLoggedInWithMobile != null ? JSON.parse(isLoggedInWithMobile) : false;

        dispatch(setIsLoggedInWithMobile(IsLoggedInWithMobile))
        console.log('---------------------Borokhi babo najana-----------------------', RJWT)
        // console.log('----------------------', User_ID)
        dispatch(setName(RName));
        console.log('Hello')
        dispatch(setEmail(REmail));
        
        dispatch(setJWT(RJWT));
        dispatch(setUser_ID(User_ID));
        // dispatch(setIsNotificationReady(true));
        
        getCourseCodes(RJWT);
        getProfile(REmail);
        getLiveCourse(REmail);
        GetNotification(REmail);
        GetDData(REmail);
        getWithdrawDashboardData(REmail)
        dispatch(setLoading(false));
      }      
    } catch(e) {
      dispatch(setLoading(false));
      console.log('Something went wrong with the local storage', e)
    }
  }

  const getWithdrawDashboardData = async (header) => {
    try {
      const result = await GetWithdrawDashboardData(header)
      if(result.status === 200){
        dispatch(setTransactionHistory(result.data))
        console.log('getWithdrawDashboardData: ',result)
      } else {
        console.log('getWithdrawDashboardData failed!', result)
      }
    } catch (e) {
      console.log('getWithdrawDashboardData failed2 :', e)
    }
  }

  const GetDData = (email) =>{
    console.log('asdfghjk')
    const API = BaseURL+'instructorDashboard'
    var requestOptions ={
      method:'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'gmailUserType':'INSTRUCTOR',
        'token':email
      }
    }

    fetch(API, requestOptions)
    .then(response => response.json())
    .then(result => {
      if(result.status === 200){
        setDashData(result.data)
        dispatch(setTHistory(result.data[4].data))
      }else{
        console.log('GetDData 1 : ', result.message)
      }
    }).catch(error => {
      console.log(error)
      // alert('GetDData :'+error)
    })
  }

  const getLiveCourse = (email) =>{
    // console.log("This is the data ========> ")
    const API = BaseURL+'getLiveCoursebyInstructor';

    if(email === ''){
      console.log('Something went wrong, please try again later');
    }else{
      var requestOptions = {
        method:'GET',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'gmailUserType':'INSTRUCTOR',
          'token':email
        },
      }
      fetch(API, requestOptions)
        .then(response => response.json())
        .then(result => {
          // console.log("This is the data ========> ", result.data)
          dispatch(setLiveCourses(result.data))
          // console.log(result)
        }).catch(error => {
          console.log(error)
          // alert('getLiveCourse :'+error)
        })
    }

  }
  
  const getProfile = (email) => {
    dispatch(setLoading(true))
    if( email ===''){
      console.log('Something is wrong, please login again');
    }else{
      const requestOptions = {
        method: 'GET',
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'x-auth-token':UserD.JWT,
        // },
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'gmailUserType':'INSTRUCTOR',
          'token':email
        },
      }
      // console.log(requestOptions);
      fetch(BaseURL+'getInstructorByEmail?instructorEmail='+email, requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.status === 200)
          {
            dispatch(setProfileData(result.data));
            if(result.data.profileImgPath != null && result.data.profileImgPath !== ''){
              console.log('Profile image retrieved')
              console.log(result.data.profileImgPath + 'image');
              dispatch(setUserImage(result.data.profileImgPath))
              dispatch(setProfileImg(true));
            }else{
              console.log('No profile image')
              dispatch(setProfileImg(false));
            }
            dispatch(setUserImage(result.data.profileImgPath))
            dispatch(setLoading(false));
          }else if(result.status > 200){
            dispatch(setLoading(false))
            // alert('Error: ' + result.message);
            console.log(result.message);
          }
          // console.log(result);
        }).catch(error =>{
          dispatch(setLoading(false))
          console.log(error)
          // alert('Error: ' + error);
        })
    }
  };


  const getCourseCodes = (JWT) => { 
    // if( email === ''){
    //   console.log('Home: Something went wrong, please Login again');
    // }else{
      console.log(GUser, 'IS GURSE TRUEEEEEEEEEEEEEEEEEEEEEEE')
      const header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        gmailUserType: 'INSTRUCTOR',
        token: email,
      }
      const requestOptions = {
        method: 'GET',
        headers:header
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'gmailUserType':'INSTRUCTOR',
        //   'token':email
        // },
      }
      // console.log(requestOptions);
      fetch(BaseURL+'getCoursebyInstructor', requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.status === 200)
          {
            dispatch(SetCourseData(result.data));
            console.log(result.data, '________________Get Courses By Instructor_______________')
          }else if(result.status > 200){
            alert('Error: getCourseCodes 1 ' + result.message);
            console.log(result);
          }
          // console.log(result);
        }).catch(error =>{
          console.log(error)
          alert('Error: getCourseCodes 2' + error);
        })
    // }
  };

    const AppBarContent = {
      title: 'Dashboard',
      navigation: navigation,
      ArrowVisibility: false,
      RightIcon1:'notifications-outline',
      RightIcon2:'person',
      BellCount:NMCount
    }


  return (
    <View style={styles.tcontainer}>
        <SafeAreaView>
        {appBarLoaded ? <AppBar props={AppBarContent}/> : null}

        {/* Modal for asking the user to access push notification */}
        <Modal isOpen={showModal}>
          <Modal.Content maxWidth="700px">
            <Modal.Body>
              <VStack safeArea flex={1} p={2} w="90%" mx="auto" justifyContent="center" alignItems="center">
                <Image source={require('../assets/warning.png')} resizeMode="contain" size="155" alt="successful" />
                <Text fontWeight="bold" textAlign={'center'} style={{color:"#000"}} fontSize="14">You have not given access to receive latest messages from your learners. Kindly allow permission for push notification.</Text> 
                <HStack space={2} mt={5}>
                  <Button bg={'orange.400'} colorScheme="blueGray" style={{paddingTop:10,paddingBottom:10,paddingLeft:35, paddingRight:35}}
                    _pressed={{bg: "#fcfcfc",  _text:{color: "#3e5160"}}} onPress={()=> setShowModal(false)}>
                    Cancel 
                  </Button>
                  <Button bg={'primary.900'} colorScheme="blueGray" style={{paddingTop:10,paddingBottom:10,paddingLeft:40, paddingRight:40}}
                    _pressed={{bg: "#fcfcfc",  _text:{color: "#3e5160"}}} onPress={()=> {
                      Linking.openSettings()
                      setShowModal(false)
                    }}>
                    Okay 
                  </Button>
                </HStack>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>
        
          <ScrollView>
          <Center mt={5} mb={20}>
           <VStack space={3}>
            <VStack style={styles.DCard} p={5} space={1}>
              <Text fontSize="sm" style={{fontWeight:'bold'}}>Current Balance</Text>
              <Text fontSize="lg" style={{fontWeight:'bold'}}>₹{transactionData.currentBalance}</Text>
              <Button bg="primary.50" rounded={6} mt={3} 
              _pressed={{bg: "#fcfcfc",
                _text:{color: "#3e5160"}
                }}
                onPress={() => navigation.navigate('WithdrawFund')}
              >
                <Text color="white.100">Withdraw</Text>
              </Button>
            </VStack>

            <VStack style={styles.DCard} p={5} space={1}>
              <Text fontSize="sm" style={{fontWeight:'bold'}}>Total Revenue</Text>
              <Text fontSize="lg" style={{fontWeight:'bold'}}>₹{transactionData.TotalRevenue}</Text>
              <HStack justifyContent='space-between' mt={2}>
                <Text fontWeight='500' color="#8C8C8C">This Month</Text>
                <Text fontWeight='500' color="#8C8C8C">₹{transactionData.currentMonthRevenue}</Text>
              </HStack>
              <HStack justifyContent='space-between' mt={1}>
                <Text color="#8C8C8C">Last Month</Text>
                <Text color="#8C8C8C">₹{transactionData.lastMonthRevenue}</Text>
              </HStack> 
            </VStack>
            
            <VStack style={styles.DCard} p={5} space={1}>
              <Text fontSize="sm" style={{fontWeight:'bold'}}>Total Enrollments</Text>
              <Text fontSize="lg" style={{fontWeight:'bold'}}>{transactionData.totalEnrollment}</Text>
              <HStack justifyContent='space-between' mt={2}>
                <Text fontWeight='500' color="#8C8C8C">This Month</Text>
                <Text fontWeight='500' color="#8C8C8C">{transactionData.currentMonthEnrollment}</Text>
              </HStack>
              <HStack justifyContent='space-between' mt={1}>
                <Text color="#8C8C8C">Last Month</Text>
                <Text color="#8C8C8C">{transactionData.lastMonthEnrollment}</Text>
              </HStack> 
            </VStack>

            <VStack style={styles.DCard} p={5} space={1}>
              <Text fontSize="sm" style={{fontWeight:'bold'}}>Total Learners</Text>
              <Text fontSize="lg" style={{fontWeight:'bold'}}>{transactionData.totalEnrollment}</Text>
              <HStack justifyContent='space-between' mt={2}>
                <Text fontWeight='500' color="#8C8C8C">This Month</Text>
                <Text fontWeight='500' color="#8C8C8C">{transactionData.currentMonthEnrollment}</Text>
              </HStack>
              <HStack justifyContent='space-between' mt={1}>
                <Text color="#8C8C8C">Last Month</Text>
                <Text color="#8C8C8C">{transactionData.lastMonthEnrollment}</Text>
              </HStack> 
            </VStack>
            
            {/* Transaction History */}
            <TouchableOpacity
            onPress={()=>navigation.navigate('TransactionHistory')}
            >
            <VStack style={styles.THCard} p={5} mt={1} mb={1}>
              <HStack style={{flex: 1,alignItems: 'center'}} justifyContent='space-between'>
                <HStack style={{flex: 1,alignItems: 'center'}} space={2}>
                <Image source={require('../assets/THDollar.png')} alt="THDollar" style={styles.ThImg} />
                <Text fontSize="md" style={{fontWeight:'bold'}}>Transaction History</Text>
                </HStack>
                <IconButton onPress={()=>navigation.navigate('TransactionHistory')} style={styles.backbtn} icon={<Icon size="lg" as={Ionicons} name="chevron-forward-outline" color="primary.50"/> } />
              </HStack>
            </VStack>
            </TouchableOpacity>

            {/* Purchaged history */} 
            <TouchableOpacity
            onPress={()=>navigation.navigate('PurchaseList')}
            >
            <VStack style={styles.THCard} p={5}mb={4}>
              <HStack style={{flex: 1,alignItems: 'center'}} justifyContent='space-between'>
                <HStack style={{flex: 1,alignItems: 'center'}} space={4}>
                <Image source={require('../assets/checkpad.png')} alt="Purchaged history" style={{height:60, width:50}} />
                <Text fontSize="md" style={{fontWeight:'bold'}}>Purchase List</Text>
                </HStack>
                <IconButton onPress={()=>navigation.navigate('PurchaseList')} style={styles.backbtn} icon={<Icon size="lg" as={Ionicons} name="chevron-forward-outline" color="primary.50"/> } />
              </HStack>
            </VStack>
            </TouchableOpacity>

            {/* <Button bg="primary.50" rounded={6} mt={3} 
              _pressed={{bg: "#fcfcfc",
                _text:{color: "#3e5160"}
                }}
                onPress={() => {navigation.navigate('ViewCourse', {screenProps: screenProps})}}
              >
                <Text color="white.100">Withdraw</Text>
            </Button> */}

           </VStack>
          </Center>
          </ScrollView>
        </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
    tcontainer: {
        flex: 1,
        top: 0,
        backgroundColor:'#f5f5f5',
        height:height,
        width:width,
    },
    ThImg:{
      // flex: 1,
      width:60,
      height:60,
    },
    DCard: {
      // width:width/1.2,
      // height:height/4,
      width: width/1.1,
      height: height/4.5,
      borderRadius:15,
      backgroundColor: "#FFFFFF",
      shadowColor: "rgba(0, 0, 0, 0.03)",
      shadowOffset: {
        width: 0,
        height: 0.376085489988327
      },
      shadowRadius: 21.951963424682617,
      shadowOpacity: 1
    },
    THCard:{
      height: height/10,
      width: width/1.1,
      borderRadius:15,
      backgroundColor: "#FFFFFF",
      shadowColor: "rgba(0, 0, 0, 0.03)",
      shadowOffset: {
        width: 0,
        height: 0.376085489988327
      },
      shadowRadius: 21.951963424682617,
      shadowOpacity: 1
    }

})

export default Home