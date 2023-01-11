import { StyleSheet, View,Dimensions,ScrollView,TouchableOpacity } from 'react-native';
import React,{useState,useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon,Modal,Text, Box,VStack,HStack,Input,FormControl,Button,Link,Heading,Image,Container,Spinner,Spacer,IconButton} from 'native-base';
import { setLoading } from '../Redux/Features/userDataSlice';
import { setLogin_Status, setEmail } from '../Redux/Features/loginSlice';
import {useDispatch,useSelector} from 'react-redux';
import CountDown from 'react-native-countdown-component';
import AppBar from '../components/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window')

const AccountSettings = ({navigation}) => {

  const GUser = useSelector(state => state.Login.GUser);

  const dispatch = useDispatch();
  // const JWT = useSelector(state => state.login.JWT);
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
    getLogingWithGoogle()
  }, [])
  const getLogingWithGoogle = async() => {
    const data = await AsyncStorage.getItem('loginWithGoogle')
    console.log('Is login with google : =========', data)
    isloginWithGoogle(data)
    isLoading(false)
  }

  const ClearLocalStorage = async() => {
    try{
      // await AsyncStorage.removeItem('Email');
      // await AsyncStorage.removeItem('JWT');
      // await AsyncStorage.removeItem('Name');
      await AsyncStorage.clear()
    } catch(e){
      alert('Something went wrong with Local Storage')
    }
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

  const emailAbstract = (mail) => {
    let email = mail;
    let email_sub = email.substring(0,3);
    let email_abstract = email_sub + '***' + email.substring(email.length-4,email.length);
    setemailAbs(email_abstract);
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
         }else if(result.status > 200){
          dispatch(setLoading(false));
           alert('Error: ' + result.message);
           console.log(result);
         }
       }).catch(error =>{
         dispatch(setLoading(false));
         console.log(error);
         alert('Error: ' + error);
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
            ClearLocalStorage();
            dispatch(setLogin_Status(false))
            dispatch(setLoading(false));
            console.log(result);
         }else if(result.status > 200){
          dispatch(setLoading(false));
           alert('Error: ' + result.message);
           console.log(result);
         }
       }).catch(error =>{
         dispatch(setLoading(false));
         console.log(error);
         alert('Error: ' + error);
       })
    }
    dispatch(setLoading(false));
  }

  const ChangePassword = () => {
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
            dispatch(setLoading(false))
            console.log(result)
         }else if(result.status > 200){
          dispatch(setLoading(false))
           alert('Error: ' + result.message);
           console.log(result);
         }
       }).catch(error =>{
         dispatch(setLoading(false))
         console.log(error)
         alert('Error: ' + error);
       })
    }
    dispatch(setLoading(false));
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
           alert('Error: ' + result.message);
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
            ClearLocalStorage()
            setVerifyDA(false)
            setSuccessDA(true)
            dispatch(setLoading(false))
            console.log(result)
         }else if(result.status > 200){
          dispatch(setLoading(false))
           alert('Error: ' + result.message);
           console.log(result);
         }
       }).catch(error =>{
         dispatch(setLoading(false))
         console.log('Error verifyDA:'+error)
         alert('Error verifyDA: ' + error);
       })
    }
    dispatch(setLoading(false));
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
                        <Text fontSize={13} color="#8C8C8C">We sent a 6 Digit OTP {emailAbs}</Text>
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
                            <CountDown
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
                            />
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
                            <Text
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
                                onPress={()=>
                                  DeleteAccount()}
                                >
                            Yes, Delete Account
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
                        <Text fontSize={13} color="#8C8C8C">We send 6 Digit OTP to </Text>
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
                            <CountDown
                            style={styles.count}
                            until={60}
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
                            />
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
                            <Text
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

             <Modal isOpen={SuccessDA} onClose={() => {
              setSuccessDA(false)
              dispatch(setLogin_Status(false))
              }} size="lg">
              <Modal.Content maxWidth="700" borderRadius={20}>
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

                        <Text fontWeight="bold" fontSize="17">Account Successfully Deleted!</Text>
                          
                        <Button 
                          bg="#3e5160"
                          colorScheme="blueGray"
                          style={{paddingTop:10,paddingBottom:10,paddingLeft:40, paddingRight:40}}
                          _pressed={{bg: "#fcfcfc",
                            _text:{color: "#3e5160"}
                            }}
                            onPress={()=>{
                              dispatch(setLogin_Status(false))
                              setSuccessDA(false)
                            }}
                            >
                        Create New Account
                      </Button>
                      
                      {/* </VStack> */}
                    </VStack>
                  </Modal.Body>
              </Modal.Content>
            </Modal>                

          <VStack pl={4} pr={4} pt={8}>
              <VStack space={10}>
                
               { loginWithGoogle === null && <VStack space={10}>
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
                      <Text fontSize="md" style={{fontWeight:'bold'}}>Delete Account</Text>
                      <Text fontWeight='500' color="#8C8C8C" style={{maxWidth:width/2.5}}>Permanently</Text>
                    </VStack>
                  </HStack>

                  <Button
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={{width:width/5}}
                  _pressed={{bg: "#fcfcfc",
                    _text:{color: "#3e5160"}
                    }}
                    onPress={()=> setShowDA(true)}
                  >
                    Delete
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