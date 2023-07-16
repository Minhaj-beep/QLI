import { StyleSheet, View,Dimensions,ScrollView,TouchableOpacity } from 'react-native';
import React,{useState,useEffect, useRef} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon,Modal,Text, Box,VStack,HStack,Input,FormControl,Button,Link,Heading,Image,Container,Spinner,Spacer,IconButton} from 'native-base';
import { setLoading } from '../Redux/Features/userDataSlice';
import { setLoggedIn, setIsLoggedInBefore, setHasAccountDeleted } from '../Redux/Features/authSlice';
import { setLogin_Status, setEmail, setIsNotificationReady } from '../Redux/Features/loginSlice';
import {useDispatch,useSelector} from 'react-redux';
import CountDown from 'react-native-countdown-component';
import CountDownTimer from 'react-native-countdown-timer-hooks'
import AppBar from '../components/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import PhoneInput from 'react-native-phone-number-input'
import auth from '@react-native-firebase/auth'
import { setProfileData } from '../Redux/Features/userDataSlice';
import { DeactivateAccount } from '../Functions/API/DeactiveAccount';
import { GetInstructorByEmail } from '../Functions/API/GetInstructorByEmail';
import moment from 'moment';

const { width, height } = Dimensions.get('window')

const AccountSettings = ({navigation}) => {

  const GUser = useSelector(state => state.Login.GUser);
  const ProfileD = useSelector(state => state.UserData.profileData);
  const IsLoggedInWithMobile = useSelector(state => state.Auth.IsLoggedInWithMobile);
  // console.log(ProfileD, '______________Profile Data______________')
  const dispatch = useDispatch();
  const JWT = useSelector(state => state.Login.JWT);
  const OEmail = useSelector(state => state.Login.email);
  const BaseURL = useSelector(state => state.UserData.BaseURL)
  const [loginWithGoogle, isloginWithGoogle] = useState(null)
  const [loading, isLoading] = useState(true)
  const AppBarContent = {
    title: 'Account Settings',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  useEffect(()=> {
    CheckDeactivate()
    getLogingWithGoogle()

    if(ProfileD.mobileNumber.match(/\W/)){
      const splitted = ProfileD.mobileNumber.split("+")
      setPhNo(splitted[1])
      setCountryCode(splitted[0])
    } else {
      setPhNo(ProfileD.mobileNumber) 
    }
  }, [])
  useEffect(()=>{
    console.log('Hollla')
    if(newPhNo !== ''){
      newPhNo.length !== 10 ? setErrNewPhNo(true) : setErrNewPhNo(false)
    }
  },[newPhNo])
  const getLogingWithGoogle = async() => {
    const data = await AsyncStorage.getItem('loginWithGoogle')
    console.log('Is login with google : =========', data)
    isloginWithGoogle(data)
    isLoading(false)
  }

  const [CEmail, setCEmail] = useState(OEmail); 

  const [showCE, setShowCE] = useState(false);
  const [verifyEC, setVerifyEC] = useState(false);
  const [SuccessEC, setSuccessEC] = useState(false);
  const [ErrorEC, setErrorEC] = useState(false);

  const [showCP, setShowCP] = useState(false);
  const [SuccessCP, setSuccessCP] = useState(false);

  const [showDA, setShowDA] = useState(false);
  const [verifyDA, setVerifyDA] = useState(false);
  const [SuccessDA, setSuccessDA] = useState(false);
  const [deactivated, setDeactivated] = useState(false)
  const [remainingDays, setRemaingDay] = useState('')

  const [NEmail, setNEmail] = useState('');
  const [VCECode, setVCECode] = useState('');
  
  const [ErrNEmail, setErrNEmail] = useState(false);
  const [ErrVCECode, setErrVCECode] = useState(false);

  const [CPass, setCPass] = useState('');
  const [NPass, setNPass] = useState('');
  const [CNPass, setCNPass] = useState('');

  const [ErrCPass, setErrCPass] = useState('');
  const [ErrNPass, setErrNPass] = useState('');
  const [ErrCNPass, setErrCNPass] = useState('');

  const [CPmatch, setCPmatch] = useState(false);

  const [VDACode,setVDACode] = useState('');
  const [ErrVDACode, setErrVDACode] =useState('');

  const [resend, setresend] = useState(true);
  // const [DResend, setDResend] = useState(true);

  const [VerifyAuth, setVerifyAuth] = useState(false);

  const [showCPass, setShowCPass] = useState(false);
  const [showNPass, setShowNPass] = useState(false);
  const [showCNPass, setShowCNPass] = useState(false);
  const [emailAbs, setemailAbs] = useState('');

  const [changePhNo, setChangePhNo] = useState(false)
  const [confirmChangePhNo, setConfirmChangePhNo] = useState(false)
  const [successChangePhNo, setSuccessChangePhNo] = useState(false)
  const [verificationId, setVerificationId] = useState('')
  const [otp, setOtp] = useState('')
  const mobileNumberRef = useRef()
  const [errNewPhNo, setErrNewPhNo] = useState(false)
  const [phNo, setPhNo] = useState(null)
  const [newPhNo, setNewPhNo] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [time, setTime] = useState(60);
  const currentPassRef = useRef()
  const newPassRef = useRef()
  const confirmPassRef = useRef()

  const emailAbstract = (mail) => {
    let email = mail;
    let email_sub = email.substring(0,3);
    let email_abstract = email_sub + '***' + email.substring(email.length-4,email.length);
    setemailAbs(mail);
  }

  const ValidatePassword = (pass) => {
    const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16}$)/;
    if(pass ===''){
      return true
    }else if (passReg.test(pass)) {
      return false
      }else{
        return true
      }
  }
  
  const ValidateEmail = (email) => {
    const reg =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/; 
    if(email ===''){
      return true
    }else if (reg.test(email)) {
      return false
    }else{
      return true
    }
  }
  
  function isNumeric(val) {
    return /^-?\d+$/.test(val);
}

const MatchPassword = (mail) =>{
    if(mail === NPass){
      setCNPass(mail);
      setCPmatch(false);
    }else{
      setCPmatch(true);
    }
}

  const sendOtp = async (phoneNumber) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setVerificationId(confirmation.verificationId);
    } catch (error) {
      console.log('Error sending OTP:', error);
      // Alert.alert('Error', 'Could not send OTP. Please try again later.');
    }
  };

  const verifyOtp = async () => {
    let result = {}
    try {
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        otp
      );
      result = await auth().signInWithCredential(credential);
      console.log(result)
      if (result && result.user) {
        console.log("OTP verification successful");
        // Perform actions for correct OTP
        ChangePhoneNumber();
      } else {
        alert("Wrong OTP entered");
        // Perform actions for wrong OTP
      }
    } catch (error) {
      alert(error);
    }
  };

  function waitToCloseDropdown() {
    setTimeout(function() {
      setVerifyAuth(false)
      submitPhNo();
    }, 100);
  }

  const CheckDeactivate = async () => {
    try {
      const result = await GetInstructorByEmail(OEmail)
      if(result.status === 200) {
        let UserInfo = result.data;
        setDeactivated(UserInfo.deactivateReqRaised);
        let CompletionDate = moment(UserInfo.deactivateCompletionDate).format('DD/MM/YYYY, hh:mm a');
        setRemaingDay(CompletionDate);
      } else {
        alert(result)
        console.log(result)
      }
    } catch (e) {
      alert(e)
    }
  }

  const GetProfileD = async email => {
    if (email === '') {
      alert('Something is wrong, please login again');
    } else {
      const requestOptions = {
        method: 'GET',
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
            dispatch(setLoading(false));
            console.log('Has the number got updated? =>', result)
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            console.log('GetProfileD error 1 : ' + result.message);
          }
        })
        .catch(error => {
          dispatch(setLoading(false));
          console.log('GetProfileD error 2 : ' + error);
        });
    }
  };

  function getLastTenCharacters(str) {
    if (typeof str !== 'string') {
      return 'Invalid input. Please provide a string.';
    }
  
    if (str.length <= 10) {
      return str;
    }
  
    return str.slice(-10);
  }


  const ChangePhoneNumber = async () => {
    let oldNumber = '+91' + getLastTenCharacters(phNo)
    let newNumber = '+91' + getLastTenCharacters(newPhNo)
    dispatch(setLoading(true));
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: CEmail,
          gmailusertype: 'INSTRUCTOR',
        },
        body: JSON.stringify({
          oldMobileNumber: oldNumber,
          newMobileNumber: newNumber,
        }),
      };
      await fetch(BaseURL + 'changeMobileNumber', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            setShowCP(false);
            setSuccessCP(true)
            setConfirmChangePhNo(false)
            GetProfileD(OEmail)
            dispatch(setLoading(false));
            console.log(result);
          } else if (result.status > 200) {
            dispatch(setLoading(false));
            alert('Error ChangePassword: ' + result.message);
            console.log('Error ChangePassword: 1' + result);
          }
        })
        .catch(error => {
          ChangePhoneNumber()
          // dispatch(setLoading(false));
          console.log('Error ChangePassword: 2' + error);
          // alert('Error ChangePassword: ' + error);
        });
    dispatch(setLoading(false));
  };

  const submitPhNo = () => {
    if(newPhNo !== null && newPhNo.length === 10){
      // if(phNo === newPhNo){
      //   alert('Please insert a new phone number')
      // } else {
        setresend(true)
        sendOtp('+91'+newPhNo)
        setConfirmChangePhNo(true)
        setChangePhNo(false)
      // }
    } else {
        mobileNumberRef.current.focus()
    }
  }

  const ChangeEmail = () => {
    dispatch(setLoading(true))
    if(NEmail === '' || OEmail === '' || ErrNEmail != false){
      alert('Please enter the New email properly');
    }else{
      setresend(true)
      const requestOptions = {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'token':OEmail,
          'gmailusertype':'INSTRUCTOR',
      },
      body: JSON.stringify({
       'email':OEmail,
       'newemail':NEmail
      })
       }
       console.log(requestOptions)
       fetch(BaseURL+'changeInstructorEmail', requestOptions)
       .then(response => response.json())
       .then(result => {
         if(result.status === 200)
         {
            emailAbstract(NEmail);
            setShowCE(false);  
            setVerifyEC(true);
            dispatch(setLoading(false));
            // console.log('Change email result: ', result)

         }else if(result.status > 200){
          dispatch(setLoading(false));
          //  alert('Error: ' + result.message);
           console.log(result);
         }
       }).catch(error =>{
         dispatch(setLoading(false));
         console.log(error);
        //  alert('Error: ' + error);
       })
    }
    dispatch(setLoading(false));
  }

  const VerifyCodeCE = () => {
    dispatch(setLoading(true))
    if(VCECode === ''){
      alert('Please enter the OTP properly');
    }else{
      const requestOptions = {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'token':OEmail,
          'gmailusertype':'INSTRUCTOR',
      },
      body: JSON.stringify({
        'code':VCECode,
        'oldEmail':OEmail,
        'newEmail':NEmail
      })
       }
       console.log(requestOptions)
       fetch(BaseURL+'changeInstructorEmailVerifyCode', requestOptions)
       .then(response => response.json())
       .then(result => {
         if(result.status === 200)
         {
            setVerifyEC(false);
            setCEmail(NEmail);
            setSuccessEC(true);
            dispatch(setEmail(NEmail));
            // ClearLocalStorage();
            dispatch(setLogin_Status(false))
            // dispatch(setLoading(false));
            alert('Kindly login with your new credentials.')
            try {
              LogOut()
            } catch (e) {
              console.log('What is happening', e)
            }
            console.log(result);
         }else if(result.status > 200){
          dispatch(setLoading(false));
          //  alert('Error: ' + result.message);
           console.log(result);
         }
       }).catch(error =>{
         dispatch(setLoading(false));
         console.log(error);
        //  alert('Error: ' + error);
       })
    }
    dispatch(setLoading(false));
  }

  const ClearLocalStorage = async () => {
    try {
      await AsyncStorage.clear();
      await AsyncStorage.setItem('isLoggedInBefore', 'true')
    } catch (e) {
      alert('Local storage error: ' + e);
    }
  };

  const logOutFromCurrentDevice = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': JWT,
        type: 'text',
      },
      body: JSON.stringify({
        email: OEmail,
        userType: 'INSTRUCTOR',
      }),
    };

    await fetch(BaseURL + 'logout', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log('Has the user logged out ??????? ', result)
    })
  }

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
    // dispatch(setIsNotificationReady(false))
    dispatch(setLoading(true));
    dispatch(setLoggedIn(false));
    dispatch(setIsLoggedInBefore(true));
    ClearLocalStorage();
    GSignOut();
    dispatch(setLoading(false));
    logOutFromCurrentDevice()
  };
  const deleteLogOut = () => {
    // dispatch(setIsNotificationReady(false))
    ClearLocalStorage();
    dispatch(setIsLoggedInBefore(false))
    dispatch(setHasAccountDeleted(true))
    dispatch(setLoading(true));
    dispatch(setLoggedIn(false));
    GSignOut();
    dispatch(setLoading(false));
    logOutFromCurrentDevice()
  };

  const ChangePassword = () => {
    if(CPass === '' || NPass === '' || CNPass === '') {
      if(CPass === '') currentPassRef.current.focus()
      else if(NPass === '') newPassRef.current.focus()
      else if(CNPass === '') confirmPassRef.current.focus()
    } else {
      dispatch(setLoading(true))
      if(CPmatch === true || ErrNPass === true || ErrCNPass === true || CPass === ''){
        alert('Please enter the details properly');
      }else{
        const requestOptions = {
          method: 'POST',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token':CEmail,
            'gmailusertype':'INSTRUCTOR',
        },
        body: JSON.stringify({
          'currentPassword':CPass,
          'newPassword':NPass,
          'confirmPassword':CNPass
        })
        }
        fetch(BaseURL+'resetInstructorPassword', requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.status === 200)
          {
              setShowCP(false)
              setSuccessCP(true)
              // dispatch(setLoading(false))
              console.log(result)
              alert('Kindly login with your new credentials.')
              try {
                LogOut()
              } catch (e) {
                console.log('What is happening', e)
              }
              
          }else if(result.status > 200){
            if(result.message === 'Current Password entered is invalid.'){
              currentPassRef.current.focus()
              alert(result.message)
            }
            dispatch(setLoading(false))
            //  alert('Error: ' + result.message);
            console.log(result);
          }
        }).catch(error =>{
          dispatch(setLoading(false))
          console.log(error)
          //  alert('Error: ' + error);
        })
      }
      dispatch(setLoading(false));
    }
  }

  const DeleteAccount = () => {
    dispatch(setLoading(true))
    if(CEmail === ''){
      alert('Something went wrong, please login again and try!');
    }else{
      setresend(true)
      const requestOptions = {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'token':CEmail,
          'gmailusertype':'INSTRUCTOR',
      },
      body: JSON.stringify({
        'email':CEmail,
      })
       }
       fetch(BaseURL+'deleteInstructor', requestOptions)
       .then(response => response.json())
       .then(result => {
         if(result.status === 200)
         {
            setShowDA(false)
            setVerifyDA(true)
            dispatch(setLoading(false))
            console.log(result)
         }else if(result.status > 200){
          dispatch(setLoading(false))
          //  alert('Error: ' + result.message);
           console.log(result);
         }
       }).catch(error =>{
         dispatch(setLoading(false))
         console.log('Error DA:'+error)
        //  alert('Error DA: ' + error);
       })
    }
    dispatch(setLoading(false));
  }

  const VerifyDelete = () => {
    dispatch(setLoading(true))
    if(CEmail === ''){
      alert('Something went wrong, please login again and try!');
    }else{
      const requestOptions = {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'token':CEmail,
          'gmailusertype':'INSTRUCTOR',
      },
      body: JSON.stringify({
        'code':VDACode,
      })
       }
       console.log(requestOptions)
       fetch(BaseURL+'deleteInstructorVerifyCode', requestOptions)
       .then(response => response.json())
       .then(result => {
         if(result.status === 200)
         {
            setVerifyDA(false)
            deactiveAccount()
            console.log(result)
         }else if(result.status > 200){
          dispatch(setLoading(false))
           alert(result.message);
           console.log(result);
         }
       }).catch(error =>{
         dispatch(setLoading(false))
         console.log('Error verifyDA:'+error)
        //  alert('Error verifyDA: ' + error);
       })
    }
    dispatch(setLoading(false));
  }

  const deactiveAccount = async () => {
    try {
      const result = await DeactivateAccount(OEmail)
      if(result.status === 200) {
        // setSuccessDA(true)
        CheckDeactivate()
      } else {
        alert(result.message)
      }
    } catch (e) {
      alert(e)
    }
  }

  return (
    <>
    {loading ? 
      <View style={{width:width, height:height, alignItems:"center", justifyContent:"center"}}>
          <Spinner size="lg" />
      </View>
      :
    <ScrollView style={styles.topContainer}>
      <SafeAreaView>
        <AppBar props={AppBarContent}/>

            <Modal isOpen={showCE} onClose={() => setShowCE(false)} size="lg">
              <Modal.Content maxWidth="700" borderRadius={20}>
                <Modal.CloseButton />
                  <Modal.Body>
                    {/* <VStack> */}

                      <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5}>
                        
                        <Heading size="md">
                          <Text>Change Email</Text>
                        </Heading>

                          <FormControl  style={{Width:width/1}}>
                            <Input 
                            variant="filled" 
                            bg="#f3f3f3" 
                            placeholder="Type New Email"
                            onChangeText={(text) =>{
                              const Err = ValidateEmail(text)
                              console.log(Err)
                              if(Err != true){
                                let email = text.toLowerCase();
                                setErrNEmail(false);
                                setNEmail(email);
                              }else{
                                setErrNEmail(true);
                                console.log(ErrNEmail)
                              }
                            }}
                            />
                          </FormControl>
                          { 
                            ErrNEmail === true ? 
                            <Text style={{color:'#FF0000', fontSize:9}}> * Please enter your email properly</Text> : <Text style={{fontSize:1}}> </Text>
                          }
                        <Button 
                          bg="#3e5160"
                          colorScheme="blueGray"
                          style={{paddingTop:10,paddingBottom:10,}}
                          _pressed={{bg: "#fcfcfc",
                            _text:{color: "#3e5160"}
                            }}
                            onPress={()=>
                              ChangeEmail()
                            }
                            >
                        Change Email
                      </Button>
                      
                      {/* </VStack> */}
                    </VStack>
                  </Modal.Body>
              </Modal.Content>
            </Modal>

            <Modal isOpen={verifyEC} onClose={() => setVerifyEC(false)} size="lg">
              <Modal.Content maxWidth="700" borderRadius={20}>
                <Modal.CloseButton />
                  <Modal.Body>
                    {/* <VStack> */}

                      <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5}>
                        
                        <VStack>
                        <Text fontSize="md" style={{fontWeight:'bold'}}>Verify it's You</Text>
                        <Text fontSize={13} color="#8C8C8C">We sent a 6 Digit OTP to</Text>
                        <Text fontSize={13} noOfLines={1} color="#8C8C8C">{emailAbs}</Text>
                        </VStack>
                          <FormControl  style={{Width:width/1}}>
                            <Input 
                            variant="filled" 
                            bg="#f3f3f3" 
                            placeholder="Enter 6 Digit OTP"
                            onChangeText={(text) => {
                              let Err = isNumeric(text)
                              if(text.length < 6 || Err === false){
                                setErrVCECode(true)
                              }else{
                                setErrVCECode(false)
                                setVCECode(text)
                              }
                            }}
                            />
                          </FormControl>
                          { 
                            ErrVCECode === true ? 
                            <Text style={{color:'#FF0000', fontSize:9}}> * Please enter the OTP properly.</Text> : <Text style={{fontSize:1}}> </Text>
                          }

                          <HStack style={styles.otpcount} space={2}>
                            <CountDownTimer
                              timestamp={60}
                              timerCallback={()=>{
                                setresend(false)
                                setVerifyAuth(true)
                              }}
                              containerStyle={{backgroundColor: 'White', borderWidth: 0,  height: 20}}
                              textStyle={{color: '#3e5160', fontSize: 12}}
                            />
                            {/* <CountDown
                            style={styles.count}
                            until={60}
                            size={10}
                            onFinish={() => 
                             {
                              setresend(false)
                              setVerifyAuth(true)
                            }
                            }
                            digitStyle={{backgroundColor: 'White', borderWidth: 0, width: 20, height: 20}}
                            digitTxtStyle={{color: '#3e5160', fontSize: 12}}
                            timeToShow={['M', 'S']}
                            timeLabels={{m: null, s: null}}
                            showSeparator
                            /> */}
                            <View style={styles.resendbtn}>
                            <TouchableOpacity
                            onPress={()=> 
                             { 
                              setVerifyEC(false)
                              setVerifyAuth(false)            
                              ChangeEmail()
                              }
                            }
                            disabled={resend}
                            >
                            <Text bottom={1}
                            style={resend === true ? styles.resendtext : styles.resendtextActive}
                            // style={[styles.Verifybtn, {opacity: resend ? 1 : 0.7}]}
                            >
                              Resend
                            </Text>
                            </TouchableOpacity>
                            </View>
                          </HStack>

                        <Button 
                          bg="#3e5160"
                          colorScheme="blueGray"
                          style={[styles.Verifybtn, {opacity: resend ? 1 : 0.7}]}
                          _pressed={{bg: "#fcfcfc",
                            _text:{color: "#3e5160"}
                            }}
                          onPress={() =>
                            VerifyCodeCE()
                          }
                          disabled={VerifyAuth}
                          >
                        Verify
                      </Button>
                      
                      {/* </VStack> */}
                    </VStack>
                  </Modal.Body>
              </Modal.Content>
            </Modal>

            <Modal isOpen={SuccessEC} onClose={() => setSuccessEC(false)} size="lg">
              <Modal.Content maxWidth="700" borderRadius={20}>
                <Modal.CloseButton />
                  <Modal.Body>
                    {/* <VStack> */}

                      <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5} justifyContent="center" alignItems="center">
                        
                        <Image
                        source={require('../../assets/success_tick.png')}
                        resizeMode="contain"
                        size="md"
                        alt="successful"
                        />

                        <Text fontWeight="bold" fontSize="17">Verification Successfull</Text>
                          
                        <Button 
                          bg="#3e5160"
                          colorScheme="blueGray"
                          style={{paddingTop:10,paddingBottom:10,paddingLeft:40, paddingRight:40}}
                          _pressed={{bg: "#fcfcfc",
                            _text:{color: "#3e5160"}
                            }}
                            onPress={()=>
                              setSuccessEC(false)
                            }
                            >
                        Done
                      </Button>
                      
                      {/* </VStack> */}
                    </VStack>
                  </Modal.Body>
              </Modal.Content>
            </Modal>

            <Modal isOpen={ErrorEC} onClose={() => setErrorEC(false)} size="lg">
              <Modal.Content maxWidth="700" borderRadius={20}>
                <Modal.CloseButton />
                  <Modal.Body>
                    {/* <VStack> */}

                      <VStack safeArea flex={1} p={2} w="100%" mx="auto" space={4} justifyContent="center" alignItems="center">
                        
                        <Image
                        source={require('../../assets/ErrorPNG.png')}
                        resizeMode="contain"
                        width={200}
                        height={200}
                        alt="successful"
                        />

                        <Text fontWeight="bold" fontSize="17">An Error Occured! Try Again</Text>
                          
                        <Button 
                          bg="#3e5160"
                          colorScheme="blueGray"
                          style={{paddingTop:10,paddingBottom:10,paddingLeft:40, paddingRight:40}}
                          _pressed={{bg: "#fcfcfc",
                            _text:{color: "#3e5160"}
                            }}
                            onPress={()=>{
                              setErrorEC(false)
                              setShowCE(true)
                            }}
                            >
                        Try Again
                      </Button>
                      
                      {/* </VStack> */}
                    </VStack>
                  </Modal.Body>
              </Modal.Content>
            </Modal>

            <Modal isOpen={showCP} onClose={() => setShowCP(false)} size="lg">
              <Modal.Content maxWidth="700" borderRadius={20}>
                <Modal.CloseButton />
                  <Modal.Body>
                    {/* <VStack> */}

                      <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={1}>
                        
                        <Heading size="md" mb={4}>
                          <Text>Change Password</Text>
                        </Heading>

                          <FormControl  style={{Width:width/1}}>
                            <Input 
                            ref={currentPassRef}
                            variant="filled" 
                            bg="#f3f3f3"
                            type= {showCPass ? "text":"password"}
                            placeholder="Current Password"
                            onChangeText={(text) => {
                              let Err = ValidatePassword(text)
                              if(Err === true){
                                setErrCPass(true)
                              }else{
                                setErrCPass(false)
                                setCPass(text)
                              }
                            }}
                            InputRightElement={<Icon as={<Ionicons name={showCPass ? "eye" : "eye-off"} />} size={6} mr="2" color="muted.400" onPress={() => setShowCPass(!showCPass)} />}
                            />
                          </FormControl>
                          { 
                            ErrCPass === true ? 
                            <Text style={{color:'#FF0000', fontSize:9}}> * Your Password must have 8-16 characters,small letters, capital letter, number, and a special character @ # $ % ^ & *</Text> : <Text style={{fontSize:1}}> </Text>
                          }
                          <FormControl  style={{Width:width/1}}>
                            <Input 
                            ref={newPassRef}
                            variant="filled" 
                            bg="#f3f3f3"
                            type= {showNPass ? "text":"password"} 
                            placeholder="New Password"
                            onChangeText={(text) => {
                              let Err = ValidatePassword(text)
                              if(Err === true){
                                setErrNPass(true)
                              }else{
                                setErrNPass(false)
                                setNPass(text)
                              }
                            }}
                            InputRightElement={<Icon as={<Ionicons name={showNPass ? "eye" : "eye-off"} />} size={6} mr="2" color="muted.400" onPress={() => setShowNPass(!showNPass)} />}
                            />
                          </FormControl>
                          { 
                            ErrNPass === true ? 
                            <Text style={{color:'#FF0000', fontSize:9}}> * Your Password must have 8-16 characters,small letters, capital letter, number, and a special character @ # $ % ^ & *</Text> : <Text style={{fontSize:1}}> </Text>
                          }
                          <FormControl  style={{Width:width/1}}>
                            <Input 
                            ref={confirmPassRef}
                            variant="filled" 
                            bg="#f3f3f3"
                            type= {showCNPass ? "text":"password"}   
                            placeholder="Confirm New Password"
                            onChangeText={(text) => {
                              let Err = ValidatePassword(text)
                              if(Err === true){
                                setErrCNPass(true);
                                MatchPassword(text);
                              }else{
                                MatchPassword(text);
                                setErrCNPass(false);
                              }
                            }}
                            InputRightElement={<Icon as={<Ionicons name={showCNPass ? "eye" : "eye-off"} />} size={6} mr="2" color="muted.400" onPress={() => setShowCNPass(!showCNPass)} />}
                            // InputRightElement={<Icon as={<Ionicons name={showCNPass ? "eye" : "eye-off"} />} size={6} mr="2" bg="muted.400" onPress={() => setShowCNPass(!showCNPass)} />}
                            />
                          </FormControl>
                          { 
                            ErrCNPass === true ? 
                            <Text style={{color:'#FF0000', fontSize:9}}> * Your Password must have 8-16 characters,small letters, capital letter, number, and a special character @ # $ % ^ & *</Text> : <Text style={{fontSize:1}}> </Text>
                          }
                          { 
                            CPmatch === true ? 
                            <Text style={{color:'#FF0000', fontSize:9}}>*Passwords does not match</Text> : <Text style={{fontSize:1}}> </Text>
                          }
                        <Button 
                          bg="#3e5160"
                          colorScheme="blueGray"
                          style={{paddingTop:10,paddingBottom:10,}}
                          _pressed={{bg: "#fcfcfc",
                            _text:{color: "#3e5160"}
                            }}
                            onPress={()=>
                              // setShowCP(false);
                              // setSuccessCP(true);
                              ChangePassword()
                            }
                            >
                        Change Password
                      </Button>
                      
                      {/* </VStack> */}
                    </VStack>
                  </Modal.Body>
              </Modal.Content>
            </Modal>

            <Modal isOpen={SuccessCP} onClose={() => setSuccessCP(false)} size="lg">
              <Modal.Content maxWidth="700" borderRadius={20}>
                <Modal.CloseButton />
                  <Modal.Body>
                    {/* <VStack> */}

                      <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5} justifyContent="center" alignItems="center">
                        
                        <Image
                        source={require('../../assets/success_tick.png')}
                        resizeMode="contain"
                        size="md"
                        alt="successful"
                        />

                        <Text fontWeight="bold" fontSize="17">Verification Successfull</Text>
                          
                        <Button 
                          bg="#3e5160"
                          colorScheme="blueGray"
                          style={{paddingTop:10,paddingBottom:10,paddingLeft:40, paddingRight:40}}
                          _pressed={{bg: "#fcfcfc",
                            _text:{color: "#3e5160"}
                            }}
                            onPress={()=>
                              setSuccessCP(false)
                            }
                            >
                        Done
                      </Button>
                      
                      {/* </VStack> */}
                    </VStack>
                  </Modal.Body>
              </Modal.Content>
            </Modal>

            
            <Modal isOpen={showDA} onClose={() => setShowDA(false)} size="lg">
              <Modal.Content maxWidth="1000" borderRadius={20}>
                <Modal.CloseButton />
                  <Modal.Body>
                    {/* <VStack> */}

                      <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={6} justifyContent="center" alignItems="center">
                        
                        <Image
                        source={require('../../assets/delete-user.png')}
                        resizeMode="contain"
                        size="md"
                        alt="successful"
                        />

                        <Text fontWeight="bold" fontSize="17">Are you sure you want to delete 
                        this account?</Text>
                          
                        <HStack space={3}mb={2}>
                          <Button 
                              bg="#ebebeb"
                              _text={{color:"#8C8C8C"}}
                              style={{paddingLeft:40,paddingRight:40}}
                              _pressed={{bg: "#fcfcfc",
                                _text:{color: "#3e5160"}
                                }}
                                onPress={()=>
                                  setShowDA(false)}
                                >
                            Cancel
                            </Button>

                            <Button 
                              bg="#3e5160"
                              colorScheme="blueGray"
                              // style={{paddingTop:10,paddingBottom:10,paddingLeft:40, paddingRight:40}}
                              _pressed={{bg: "#fcfcfc",
                                _text:{color: "#3e5160"}
                                }}
                                onPress={()=>{
                                  setShowDA(false);
                                  deactiveAccount()
                                }}
                                >
                            Yes, Deactivate
                            </Button>
                      
                        </HStack>
                      {/* </VStack> */}
                    </VStack>
                  </Modal.Body>
              </Modal.Content>
            </Modal>

            <Modal isOpen={verifyDA} onClose={() => setVerifyDA(false)} size="lg">
              <Modal.Content maxWidth="700" borderRadius={20}>
                <Modal.CloseButton />
                  <Modal.Body>
                    {/* <VStack> */}

                      <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5}>
                        
                        <VStack>
                        <Text fontSize="md" style={{fontWeight:'bold'}}>Verify it's You</Text>
                        <Text fontSize={13} color="#8C8C8C">We send 6 Digit OTP to {CEmail}</Text>
                        </VStack>
                          <FormControl  style={{Width:width/1}}>
                            <Input 
                            variant="filled" 
                            bg="#f3f3f3" 
                            placeholder="Enter 6 Digit OTP"
                            onChangeText={(text) => {
                              let Err = isNumeric(text)
                              if(text.length < 6 || Err === false){
                                setErrVDACode(true)
                              }else{
                                setErrVDACode(false)
                                setVDACode(text)
                              }
                            }}
                            />
                          </FormControl>
                          { 
                            ErrVDACode === true ? 
                            <Text style={{color:'#FF0000', fontSize:9}}> * Please enter the OTP properly.</Text> : <Text style={{fontSize:1}}> </Text>
                          }

                          <HStack style={styles.otpcount} space={2}>
                          <CountDownTimer
                              timestamp={60}
                              timerCallback={()=>{
                                setresend(false)
                                setVerifyAuth(true)
                              }}
                              containerStyle={{backgroundColor: 'White', borderWidth: 0,  height: 20}}
                              textStyle={{color: '#3e5160', fontSize: 12}}
                            />
                            {/* <CountDown
                            style={styles.count}
                            until={20}
                            size={10}
                            onFinish={() => {
                              setresend(false)
                              setVerifyAuth(true)
                            }}
                            digitStyle={{backgroundColor: 'White', borderWidth: 0, width: 20, height: 20}}
                            digitTxtStyle={{color: '#3e5160', fontSize: 12}}
                            timeToShow={['M', 'S']}
                            timeLabels={{m: null, s: null}}
                            showSeparator
                            /> */}
                            <Link style={styles.resendbtn}>
                            <TouchableOpacity
                            onPress={()=>   
                             { 
                              setVerifyDA(false)
                              DeleteAccount()
                              setVerifyAuth(false)
                            }
                            }
                            disabled={resend}
                            >
                            <Text bottom={1}
                            // style={styles.resendtext}
                            style={resend === true ? styles.resendtext : styles.resendtextActive}
                            >
                              Resend
                            </Text>
                            </TouchableOpacity>
                            </Link>
                          </HStack>

                        <Button 
                          bg="#3e5160"
                          colorScheme="blueGray"
                          style={[styles.Verifybtn, {opacity: resend ? 1 : 0.7}]}
                          _pressed={{bg: "#fcfcfc",
                            _text:{color: "#3e5160"}
                            }}
                          onPress={() =>
                            VerifyDelete()
                          }
                          disabled={VerifyAuth}
                          >
                        Verify
                      </Button>
                      
                      {/* </VStack> */}
                    </VStack>
                  </Modal.Body>
              </Modal.Content>
            </Modal>  

            <Modal
              isOpen={SuccessDA}
              onClose={() => {
                setSuccessDA(false);
                // dispatch(setLoggedIn(false));
              }}
              size="lg">
              <Modal.Content maxWidth="700" borderRadius={20}>
                <Modal.CloseButton />
                <Modal.Body>
                  {/* <VStack> */}

                  <VStack
                    safeArea
                    flex={1}
                    p={2}
                    w="90%"
                    mx="auto"
                    space={6}
                    justifyContent="center"
                    alignItems="center">
                    <Image
                      source={require('../../assets/delete-user.png')}
                      resizeMode="contain"
                      size="md"
                      alt="successful"
                    />

                    <Text fontWeight="bold" fontSize="17" textAlign={'center'}>
                      Account Successfully Deleted! If you wish to Re-activate, please raise a ticket in the Help & support!
                    </Text>

                    <Button
                      bg="#3e5160"
                      colorScheme="blueGray"
                      style={{
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingLeft: 40,
                        paddingRight: 40,
                      }}
                      _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                      onPress={() => {
                        // dispatch(setLoggedIn(false));
                        setSuccessDA(false);
                      }}>
                    Done
                    </Button>

                    {/* </VStack> */}
                  </VStack>
                </Modal.Body>
              </Modal.Content>
            </Modal>    

{/* Change mobile no popup */}
        <Modal isOpen={changePhNo} onClose={() => setChangePhNo(false)} size="lg">
          <Modal.Content maxWidth="700" borderRadius={20}>
            <Modal.CloseButton />
            <Modal.Body>
              {/* <VStack> */}

              <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5}>
                <Heading size="md">
                  <Text>Change Mobile Number</Text>
                </Heading>
                <Text>Enter the new mobile number</Text>

                <FormControl style={{Width: width / 1}}>
                <View>
                  <PhoneInput
                    defaultCode={`IN`}
                    layout="first"
                    textContainerStyle={{height:50, backgroundColor:"#f3f3f3",}}
                    codeTextStyle={{height:"150%",}}
                    containerStyle={{width:"100%", backgroundColor:"#f3f3f3", color:"black", height:50, }}
                    onChangeCountry={(country)=>console.log(country)}
                    disabled
                  />
                  <View style={{width:"100%",  flexDirection:"row", position:"absolute"}}>
                    <View style={{width:"40%",  marginLeft:'60%'}}>
                      <Input 
                      variant="filled" 
                      width={"100%"}
                      justifyContent={"flex-end"}
                      bg="#f3f3f3"
                      mt={0.5}
                      // value={MobileNo} 
                      ref={mobileNumberRef}
                      placeholder="Enter Mobile No."
                      onChangeText={text => {
                        setNewPhNo(text.trim())
                      }}
                      borderRadius={5}
                      keyboardType="numeric" 
                      p={2}
                      style={{justifyContent:"flex-end"}}
                      />
                    </View>
                  </View>
                </View>
                </FormControl>
                {errNewPhNo === true ? (
                  <Text style={{color: '#FF0000', fontSize: 9}}>
                    {' '}
                    * Please enter your mobile number properly
                  </Text>
                ) : null}
                <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={{paddingTop: 10, paddingBottom: 10}}
                  _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                  onPress={() => submitPhNo()}>
                  Submit
                </Button>

                {/* </VStack> */}
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>
{/* Change mobile no otp popup */}
        <Modal isOpen={confirmChangePhNo} onClose={() => setConfirmChangePhNo(false)} size="lg">
          <Modal.Content maxWidth="700" borderRadius={20}>
            <Modal.CloseButton />
            <Modal.Body>
              {/* <VStack> */}

              <VStack safeArea flex={1} p={2} w="90%" mx="auto" space={5}>
                <VStack>
                  <Text fontSize="md" style={{fontWeight: 'bold'}}>
                    Verify it's You
                  </Text>
                  <Text fontSize={13} color="#8C8C8C">
                    We sent a 6 Digit OTP to +91{newPhNo}
                  </Text>
                </VStack>
                <FormControl style={{Width: width / 1}}>
                  <Input
                    variant="filled"
                    bg="#f3f3f3"
                    keyboardType='numeric'
                    placeholder="Enter 6 Digit OTP"
                    onChangeText={text => {
                      var otp = text.trim()
                      if(otp.length === 6){
                        var v = parseFloat(otp)
                        if(Number.isInteger(v)){
                          setOtp(otp)
                        }
                      }
                    }}
                  />
                </FormControl>
                {ErrVCECode === true ? (
                  <Text style={{color: '#FF0000', fontSize: 9}}>
                    {' '}
                    * Please enter the OTP properly.
                  </Text>
                ) : (
                  <Text style={{fontSize: 1}}> </Text>
                )}

                <HStack style={styles.otpcount}  space={2}>
                  <View style={styles.count}>
                  <CountDownTimer
                    timestamp={60}
                    timerCallback={()=>{
                      setresend(false)
                      setVerifyAuth(true)
                    }}
                    containerStyle={{backgroundColor: 'White', borderWidth: 0,  height: 20}}
                    textStyle={{color: '#3e5160', fontSize: 12}}
                  />
                  </View>
                  <View style={styles.resendbtn}>
                    <TouchableOpacity
                      onPress={() => {
                        setConfirmChangePhNo(false)
                        waitToCloseDropdown()
                      }}
                      disabled={resend}>
                      <Text bottom={1}
                        style={resend === true ? styles.resendtext : styles.resendtextActive}
                        // style={[styles.Verifybtn, {opacity: resend ? 1 : 0.7}]}
                      >
                        Resend
                      </Text>
                    </TouchableOpacity>
                  </View>
                </HStack>

                <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={[styles.Verifybtn, {opacity: resend ? 1 : 0.7}]}
                  _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                  onPress={() => verifyOtp()}
                  disabled={VerifyAuth}>
                  Verify
                </Button>

                {/* </VStack> */}
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>
{/* Change mobile no success popup */}
        <Modal isOpen={successChangePhNo} onClose={() => setSuccessChangePhNo(false)} size="lg">
          <Modal.Content maxWidth="700" borderRadius={20}>
            <Modal.CloseButton />
            <Modal.Body>
              {/* <VStack> */}

              <VStack
                safeArea
                flex={1}
                p={2}
                w="90%"
                mx="auto"
                space={5}
                justifyContent="center"
                alignItems="center">
                <Image
                  source={require('../../assets/success_tick.png')}
                  resizeMode="contain"
                  size="md"
                  alt="successful"
                />

                <Text fontWeight="bold" fontSize="17">
                  Verification Successfull
                </Text>

                <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 40,
                    paddingRight: 40,
                  }}
                  _pressed={{bg: '#fcfcfc', _text: {color: '#3e5160'}}}
                  onPress={() => setSuccessEC(false)}>
                  Done
                </Button>

                {/* </VStack> */}
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>

          <VStack pl={4} pr={4} pt={8}>
              <VStack space={10}>
                
              { loginWithGoogle === null &&  
               <VStack space={10}>
                {
                  IsLoggedInWithMobile === false && 
                  <>
                    <HStack justifyContent='space-between' alignItems="center">
                      <HStack  justifyContent='space-between' alignItems="center" space={3}>
                        <Image
                          alt='EmailAddress'
                          source={require('../../assets/ACSettings/MailSettings.png')}
                          size={12}
                          resizeMode='contain'
                        />
                        <VStack>
                          <Text fontSize="md" style={{fontWeight:'bold'}}>Email Address</Text>
                          <Text fontWeight='500' color="#8C8C8C" style={{maxWidth:width/2.5}}>{OEmail}</Text>
                        </VStack>
                      </HStack>

                      <Button
                      bg="#3e5160"
                      colorScheme="blueGray"
                      style={{width:width/5}}
                      _pressed={{bg: "#fcfcfc",
                        _text:{color: "#3e5160"}
                        }}
                      onPress={()=>setShowCE(true)}
                      >
                        Change
                      </Button>
                    </HStack>
                    <HStack justifyContent='space-between' alignItems="center">
                      <HStack  justifyContent='space-between' alignItems="center" space={3}>
                        <Image
                          alt='EmailAddress'
                          source={require('../../assets/ACSettings/PasswordSettings.png')}
                          size={12}
                          resizeMode='contain'
                        />
                        <VStack>
                          <Text fontSize="md" style={{fontWeight:'bold'}}>Password</Text>
                          <Text fontWeight='500' color="#8C8C8C" style={{maxWidth:width/2.5}}>***********************</Text>
                        </VStack>
                      </HStack>

                      <Button
                      bg="#3e5160"
                      colorScheme="blueGray"
                      style={{width:width/5}}
                      _pressed={{bg: "#fcfcfc",
                        _text:{color: "#3e5160"}
                        }}
                        onPress={()=>setShowCP(true)}
                      >
                        Change
                      </Button>
                    </HStack>
                  </>
                }


                <HStack justifyContent='space-between' alignItems="center">
                  <HStack  justifyContent='space-between' alignItems="center" space={3}>
                    <Image
                      alt='EmailAddress'
                      source={require('../../assets/ACSettings/ChangeNumber.png')}
                      size={12}
                      resizeMode='contain'
                    />
                    <VStack>
                      <Text fontSize="md" style={{fontWeight:'bold'}}>Mobile Number</Text>
                      {
                        ProfileD.hasOwnProperty('mobileNumber') ?
                        <Text fontWeight='500' color="#8C8C8C" style={{maxWidth:width/2.5}}>{ProfileD.mobileNumber}</Text>
                        : null
                      }
                    </VStack>
                  </HStack>

                  <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={{width:width/5}}
                  _pressed={{bg: "#fcfcfc",
                    _text:{color: "#3e5160"}
                    }}
                    onPress={()=>setChangePhNo(true)}
                  >
                    Change
                  </Button>
                </HStack>
              </VStack>
              }

                <HStack justifyContent='space-between' alignItems="center">
                  <HStack  justifyContent='space-between' alignItems="center" space={3}>
                    <Image
                      alt='EmailAddress'
                      source={require('../../assets/ACSettings/AccountActivity.png')}
                      size={12}
                      resizeMode='contain'
                    />
                    <VStack>
                      <Text fontSize="md" style={{fontWeight:'bold'}}>Account Activity</Text>
                      <Text fontWeight='500' color="#8C8C8C" style={{maxWidth:width/2.5}}>Log in Alert</Text>
                    </VStack>
                  </HStack>

                  <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={{width:width/5}}
                  _pressed={{bg: "#fcfcfc",
                    _text:{color: "#3e5160"}
                    }}
                    onPress={()=> navigation.navigate('AccountActivity')}
                  >
                    View
                  </Button>
                </HStack>

                <HStack justifyContent='space-between' alignItems="center">
                  <HStack  justifyContent='space-between' alignItems="center" space={3}>
                    <Image
                      alt='EmailAddress'
                      source={require('../../assets/ACSettings/DeleteAccount.png')}
                      size={12}
                      resizeMode='contain'
                    />
                    <VStack>
                      <Text fontSize="md" style={{fontWeight:'bold'}}>Deactivate Account</Text>
                      <Text fontWeight='500' color="red.500" style={{maxWidth:width/2.5}}>
                      {deactivated ?  'Deactivating on ' + remainingDays : 'Permanently.'}
                      </Text>
                    </VStack>
                  </HStack>

                  <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={{}}
                  _pressed={{bg: "#fcfcfc",
                    _text:{color: "#3e5160"}
                    }}
                    onPress={()=> {
                      deactivated ? alert('Deactivation has already been requested!') : setShowDA(true)
                    }}
                  >
                    Deactivate
                  </Button>
                </HStack>
              </VStack>
          </VStack>
      </SafeAreaView>
    </ScrollView>
    }
    </>
  );
}

export default AccountSettings

const styles = StyleSheet.create({
  topContainer:{
    flex: 1,
    top: 0,
    backgroundColor:'#f5f5f5',
    height:height,
    width:width,
  },
  otpcount:{
    flex:1,
    alignSelf: 'flex-end',
  },
  count:{
    alignSelf: 'flex-end',
  },
  resendbtn:{
    alignSelf: 'flex-end',
  },
  resendtext:{
    fontSize:12,
    color:'#bdbdbd',
    fontWeight:'bold',
  },
  resendtextActive:{
    fontSize:12,
    color:'#3e5160',
    fontWeight:'bold',
  },
  Verifybtn:{
    paddingTop:10,
    paddingBottom:10
  }
})