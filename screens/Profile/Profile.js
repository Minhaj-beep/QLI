import React, { useEffect, useState, useRef, } from 'react';
import {View, Dimensions, ScrollView, StyleSheet,TouchableOpacity, FlatList,Text,Platform} from 'react-native';
import { Select,Container, Spinner, Box,VStack,HStack,Input,FormControl,Button,Heading,Image,Modal,TextArea,Icon,IconButton } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppBar from '../components/Navbar';
import { setUserImage, setProfileImg } from '../Redux/Features/loginSlice';
import {useDispatch,useSelector} from 'react-redux';
import { setProfileData, setLoading } from '../Redux/Features/userDataSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import PhoneInput from "react-native-phone-number-input";
// import PhoneInput from 'react-phone-number-input'

const { width, height } = Dimensions.get('window')

const Profile = ({navigation}) => {
  
  const dispatch = useDispatch();

  // const UserD = useSelector(state => state.login);
  // const [fromDate, setFromDate] = useState(new Date(1598051730000));
  // const [toTime, settoTime] =useState(new Date(1598051730000));
  const BaseURL = useSelector(state => state.UserData.BaseURL)
  const firstNameRef = useRef();
  const LastNameRef = useRef();
  const mobileRef = useRef();
  const aboutRef = useRef();
  const experienceRef = useRef();
  const expertiseRef = useRef();
  const availabilityRef = useRef();

  const [errorMessage, setErrorMessage] = useState({
    inputField: '',
    error:''
  })

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const [DFromTime, setDFromTime] = useState('');
  const [DToTime, setDToTime] = useState('');

  const Jwt_Token = useSelector(state => state.Login.JWT);
  const email = useSelector(state => state.Login.email);
  // const email = 'sushmitha.maneesh08@gmail.com';
  const name = useSelector(state => state.Login.Name);

  const userData = useSelector(state => state.UserData.profileData); 

  const [ProfileD, setProfileD] = useState('');
  const [showSaved, setSaved ] = useState(false);

  const [showFTP, setShowFTP] = useState(false);
  const [showTTP, setShowTTP] = useState(false);

  const [FDate, setFData] = useState( new Date(1598051730000));
  const [TDate, setTData] = useState( new Date(1598051730000));

  const [loader, setLoader] = useState(true)
  const [numberFocus, setNumverFocus] = useState(false)
  const [firstName, setfirstName] = useState('');
  const [About, setAbout] = useState('');
  const [Exp, setExp] = useState('');
  const [cat, setCat] = useState(userData.categories);
  const [catD, setcatD] = useState('');
  const [Ahours, setAhours] = useState('');

  const [LastName, setLastName] = useState('')
  const [MiddleName, setMiddleName] = useState('')
  const [MobileN, setMobileN] = useState('')
  const [contryCode, setCountryCode] = useState('')

  const [ErrMN, setErrMN] = useState(false)

  const [facebook, setfacebook] = useState('');
  const [instagram, setinstagram] = useState('');
  const [linkedin, setlinkedin] = useState('');
  const [twitter, settwitter] = useState('');

  const [fromTime, setfromTime] = useState(new Date(1598051730000));
  const [toTime, settoTime] = useState(new Date(1598051730000));

  const [ErrAbout, setErrAbout] = useState(false);
 
  const [LimitAError, setLimitAError] = useState(false);
  const Pmode = 'time'

  // const [UfromTime, setUfromTime] = useState('');
  // const [UtoTime, setUtoTime] = useState('');

  const [RChip, setRChip] = useState(false)
  const numCol = 2
  const chipSize = width/numCol;

  useEffect(() =>{
    getProfile(email)
    if(cat.length != 0){
      setRChip(true)
    }  
  }, [])

    const onChangeFrom = (event, selectedDate) => {
    setShowFromPicker(Platform.OS === 'ios')
    if (event?.type === 'dismissed') {
      setfromTime(DFromTime);
    }else{
      setfromTime(selectedDate);
      console.log(selectedDate);
      let time = selectedDate.toLocaleTimeString()
      console.log(time)
      // setDFromTime(time.slice(0,4))
      setDFromTime(time)
    }
    setShowFromPicker(false);
  }

  const onChangeTo = (event, selectedDate) => {
    setShowToPicker(Platform.OS === 'ios')

    if (event?.type === 'dismissed') {
      settoTime(DToTime)
    }else{
      settoTime(selectedDate);
      let time = selectedDate.toLocaleTimeString()
      // setDToTime(time.slice(0,4))
      setDToTime(time)
    }
    setShowToPicker(false);
}

  const updateProfileData = (PData) =>{
      console.log(PData)
      setfirstName(PData.firstName)
      setAbout(PData.aboutYou)
      setExp(PData.yearsOfExperience)
      setCat(PData.categories)
      if(PData.availablePerHours != undefined){
        var AhoursText = PData.availablePerHours
        setAhours(AhoursText.toString())
      }
      console.log(PData.availablePerHours)
      setfacebook(PData.facebook)
      setinstagram(PData.instagram)
      setlinkedin(PData.linkedin)
      settwitter(PData.twitter)
      setLastName(PData.lastName)
      setMiddleName(PData.middleName)
      ///////////////////////////////////////////////
      // 'AF9113918441'.match(/\W/) ? console.log("===>",true) : console.log('===>',false);
      if(PData.mobileNumber.match(/\W/)){
        const splitted = PData.mobileNumber.split("+")
        setMobileN(splitted[1])
        setCountryCode(splitted[0])
      } else {
        setMobileN(PData.mobileNumber) 
      }
      
      if(PData.fromTime === ""){
        let ftime = '00:00'
        setfromTime(ftime)
      }else{
        console.log(PData.fromTime)
        setfromTime(PData.fromTime)
        setDFromTime(PData.fromTime)
      }

      if(PData.toTime === ""){
        let ttime = '00:00'
        settoTime(ttime)
      }else{
        console.log(PData.fromTime)
        settoTime(PData.toTime)
        setDToTime(PData.toTime)
      }
      setLoader(false)
  }

  const getProfile = (email) => {
    // console.log(ProfileD, '===========')
    dispatch(setLoading(true))
    if( email ===''){
      alert('Something is wrong, please login again');
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
      console.log(requestOptions);
      fetch(BaseURL+'getInstructorByEmail?instructorEmail='+email, requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.status === 200)
          {
            setProfileD(result.data);
            console.log(result.data);
            console.log('hello')
            updateProfileData(result.data);
          
            dispatch(setProfileData(result.data));
            dispatch(setUserImage(result.data.profileImgPath))
            if(result.data.profileImgPath != null){
              console.log('Profile image retrieved')
              dispatch(setProfileImg(true));
            }else{
              console.log('No profile image')
              dispatch(setProfileImg(false));
            }
            dispatch(setLoading(false));
          }else if(result.status > 200){
            dispatch(setLoading(false))
            alert(result.message);
            console.log(result.message);
          }
          // console.log(result);
        }).catch(error =>{
          dispatch(setLoading(false))
          console.log( error)
          alert(error);
        })
    }
  };


  const AppBarContent = {
    title: 'Profile',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  const UpdateCat = () =>{
    if(catD === ''){
      alert('Please enter a category to proceed!')
    }else {
      // console.log(catD.trim(),  'This is cat D')
      let match = catD.trim()
      let arr = cat.map(v => v.toLowerCase())
      match = arr.includes(match.toLowerCase())
      console.log('Match == ', match)
      if ( match != true){
        const newArr = [...cat];
        var Data = catD
        newArr.push(Data);
        console.log('Add cat working');
        setCat(newArr);
        setRChip(true);
        setcatD('')
      }else{
        alert("Duplicate categories are not allowed!")
      }
    }
  }

  // const checkDupCat = (text) =>{
  //   let match = cat.includes(text)
  //   console.log('This a duplicate:'+match)
  // }

  const RenderChip = () =>{
    console.log('yyet chip')
    console.log('What is cat : ',cat)
    return(
              <FlatList
                data={cat}
                numColumns={numCol}
                keyExtractor={(item,index) => index}
                renderItem={({item,index}) => 
                  <HStack 
                    bg="primary.50" 
                    maxWidth={chipSize} 
                    alignItems='center' 
                    justifyContent='space-between'
                    borderRadius={20}
                    paddingLeft={3}
                    paddingRight={3}
                    style={{margin:5}}
                  >
                    <Text style={{color:'#FFFFFF'}}>
                      {item}
                    </Text>
                    <IconButton 
                      icon={
                        <Icon size="lg" as={Ionicons} name="close-outline" color="#FFFFFF"/>
                      }
                      onPress={() => {
                        // console.log(item.cat)
                       setCat((cat) =>{
                          const id = cat.indexOf(item)
                          const newArr = [...cat]
                          if(index > -1){
                            newArr.splice(id,1)
                          }
                          // const requiredIndex = newArr.findIndex(el => {
                          //   return el.id === String(id);
                          // });
                          // if(requiredIndex === -1){
                          //   // 
                          //   alert('Categories of expertise if empty')
                          // };
                          // !!newArr.splice(requiredIndex, 1);
                          if(newArr.length === 0){
                            setRChip(false);
                          }
                          return newArr
                       })
                       }}
                    />
                  </HStack>
              }              
              />
    )}

    // console.log(errorMessage.inputField, ' and ', errorMessage.error)
    const handleFocus = () => {
      PhoneInput.current.focus()
    }

  const convertTo24Hour = (time) => {
    if (time.indexOf(' ') !== -1) {
      let timeArr = time.split(":");
      let hours = parseInt(timeArr[0]);
      let minutes = timeArr[1];
      let secondsMeridian = timeArr[2].split(" ");
      let seconds = secondsMeridian[0];
      let meridian = secondsMeridian[1].toUpperCase();
  
      if (meridian === "PM" && hours < 12) {
        hours += 12;
      } else if (meridian === "AM" && hours === 12) {
        hours -= 12;
      }
  
      let formattedHours = hours < 10 ? "0" + hours : hours;
  
      return formattedHours + ":" + minutes;
    } else {
      return time
    }
  }    

  const updateProfile = () => {
    // console.log('saving changes', DToTime, DFromTime, )
    let CLength = cat.length
    if( ErrAbout === true || Exp === '' || Ahours === '' || firstName === '' || LastName === '' || ErrMN === true || CLength === 0){
      // alert('Please fill the details properly!');
      if(firstName === ''){
        firstNameRef.current.focus()
        setErrorMessage({inputField: 'First Name', error: 'Please insert this input'})
      } else if ( LastName === ''){
        LastNameRef.current.focus()
        setErrorMessage({inputField: 'Last Name', error: 'Please insert this input'})
      } else if (ErrMN === true) {
        mobileRef.current.focus()
        setNumverFocus(true)
        setErrorMessage({inputField: 'Mobile', error: 'Please insert this input'})
      } else if (ErrAbout === true){
        aboutRef.current.focus()
        setErrorMessage({inputField: 'About', error: 'Please insert this input'})
      } else if (Exp === '') {
        experienceRef.current.focus()
        setErrorMessage({inputField: 'Experience', error: 'Please insert this input'})
      } else if (CLength === 0) {
        expertiseRef.current.focus()
        setErrorMessage({inputField: 'Expertise', error: 'Please insert this input'})
      } else if (Ahours === '') {
        availabilityRef.current.focus()
        setErrorMessage({inputField: 'Availability', error: 'Please insert this input'})
      }
      // inputRef.current.focus()
    }else{
      const requestOptions = {
        method: 'POST',
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'x-auth-token':Jwt_Token,
        // },
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'gmailUserType':'INSTRUCTOR',
          'token':email
        },
        body: JSON.stringify({
          firstName:firstName,
          yearsOfExperience:Exp,
          availablePerHours:Ahours,
          aboutYou:About,
          fromTime:convertTo24Hour(DFromTime),
          toTime:convertTo24Hour(DToTime),
          categories:cat,
          facebook:facebook,
          instagram:instagram,
          linkedin:linkedin,
          twitter:twitter,
          middleName:MiddleName,
          lastName:LastName,
          mobileNumber:contryCode + '+' + MobileN,
          // contryCode: 'IN'
        })
      }
      console.log(requestOptions);
      fetch(BaseURL+'createInstructor', requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.status === 200)
          {
            getProfile(email);
            setSaved(true);
            // alert('Profile Update Success')
            console.log(result.data)
          }else if(result.status > 200){
            alert(result.message);
            console.log('Update profile error: ',result.message);
          }
          // console.log(result);
        }).catch(error =>{
          console.log('CError:'+error)
          alert(error);
        })
    }
  };

  return (
  <View>
    {loader ? 
    <View style={{width:width, height:height, alignItems:"center", justifyContent:"center"}}>
      <Spinner size="lg" />
    </View> :
      <View>
        <View style={{backgroundColor: '#fcfcfc'}}>
      <AppBar props={AppBarContent} />
    </View>
    <SafeAreaView style={styles.container}>
      <ScrollView style={{marginBottom: 40}}>

        {showFromPicker && (
          <DateTimePicker
            // is24Hour={true}
            testID="dateTimePicker"
            value={FDate}
            mode={Pmode}
            onChange={onChangeFrom}
          />
        )}

      {showToPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            // is24Hour={true}
            value={TDate}
            mode={Pmode}
            onChange={onChangeTo}
          />
        )}

        <Modal isOpen={showSaved} onClose={() => setSaved(false)} size="lg">
          <Modal.Content maxWidth="900"  maxheight="300" borderRadius={20}>
            <Modal.CloseButton />
            <Modal.Body>
              <VStack>
                
                <Box safeArea w="100%" mx="auto">
                
                  <VStack space={2} flex={1} alignItems="center">
                  <Image
                    resizeMode='contain'
                    source={require('../../assets/success_tick02.png')}
                    alt="Success"
                    style={{height: 150, width: 150}}
                  />
                  <Heading size="lg"
                  fontSize="lg"
                  >
                
                  <Text>Change Saved</Text>
                    </Heading>
                  <Button 
                    bg="#3e5160"
                    colorScheme="blueGray"
                    style={styles.cbutton}
                    _pressed={{bg: "#fcfcfc",
                      _text:{color: "#3e5160"}
                      }}
                    onPress={() => {
                      // getProfile(email)
                      setSaved(false)
                    }}
                    >
              Done
              </Button>
                  </VStack> 
                
                </Box>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>
          <VStack style={styles.form} space={2} mt={2} mb={10}>
            <FormControl  style={styles.cinput}>
                <FormControl.Label _text={{
                color: "#000000",
                fontSize: "sm",
                fontWeight: 'bold',
                paddingBottom:"2"
              }}
                style={styles.cinputlabel}
              >
                  First Name <Text style={{color:'#FF0000'}}>*</Text>
                </FormControl.Label>
                <Input 
                variant="filled" 
                ref={firstNameRef}
                bg="#f3f3f3"
                value={firstName} 
                placeholder="Enter Full Name"
                onChangeText={(text) => {
                  setErrorMessage({name: ''})
                  setfirstName(text)
                }}
                borderRadius={5}
                p={2}
                />
                {errorMessage.inputField === 'First Name' ? <Text style={{color:'red', fontSize:11}}>{errorMessage.error}</Text> : <></> }
            </FormControl>
            <FormControl  style={styles.cinput}>
                <FormControl.Label _text={{
                color: "#000000",
                fontSize: "sm",
                fontWeight: 'bold',
                paddingBottom:"2"
              }}
                style={styles.cinputlabel}
              >
                  Middle Name
                </FormControl.Label>
                <Input 
                variant="filled" 
                bg="#f3f3f3"
                value={MiddleName} 
                placeholder="Enter Middle Name"
                onChangeText={(text) => {
                  
                  setMiddleName(text); 
                }}
                borderRadius={5}
                p={2}
                />
            </FormControl>
            <FormControl  style={styles.cinput}>
                <FormControl.Label _text={{
                color: "#000000",
                fontSize: "sm",
                fontWeight: 'bold',
                paddingBottom:"2"
              }}
                style={styles.cinputlabel}
              >
                  Last Name <Text style={{color:'#FF0000'}}>*</Text>
                </FormControl.Label>
                <Input 
                variant="filled" 
                bg="#f3f3f3"
                ref={LastNameRef}
                value={LastName} 
                placeholder="Enter Last Name"
                onChangeText={(text) => {
                  setErrorMessage({name: ''})
                  setLastName(text)
                }}
                borderRadius={5}
                p={2}
                />
                {errorMessage.inputField === 'Last Name' ? <Text style={{color:'red', fontSize:11}}>{errorMessage.error}</Text> : <></> }
            </FormControl>
            <FormControl  style={styles.cinput}>
                <FormControl.Label _text={{
                color: "#000000",
                fontSize: "sm",
                fontWeight: 'bold',
                paddingBottom:"2"
              }}
              // ref={mobileRef}
                style={styles.cinputlabel}
              >
                  Mobile No. <Text style={{color:'#FF0000'}}>*</Text>
                </FormControl.Label>
                <View style={{width:'100%',}}>
                <PhoneInput
                  withDarkTheme={true}
                  defaultCode={`${contryCode}`}
                  layout="first"
                  onChangeCountry={(res)=>setCountryCode(res.cca2)}
                  textContainerStyle={{ height:50,  backgroundColor:"#f3f3f3",}}
                  codeTextStyle={{height:"175%", marginTop:5, alignSelf:"center"}}
                  containerStyle={{width:"100%", backgroundColor:"#f3f3f3", color:"black",  }}
                />
                <View style={{width:"100%",  flexDirection:"row", position:"absolute"}}>
                <View style={{width:"65%",  marginLeft:'35%'}}>
                <Input 
                variant="filled" 
                width={"100%"}
                height={50}
                justifyContent={"flex-end"}
                bg="#f3f3f3"
                value={MobileN} 
                ref={mobileRef}
                placeholder="Enter Mobile No."
                onChangeText={(text) => {
                  if(text.length != 10){
                    setMobileN(text)
                    setErrMN(true)
                    setErrorMessage({name: ''})
                  }else{
                    setMobileN(text)
                    setErrMN(false)
                    setErrorMessage({name: ''})
                  }
                }}
                borderRadius={5}
                keyboardType="numeric" 
                p={2}
                style={{justifyContent:"flex-end", }}
                />
                </View>
                </View>
                </View>
            </FormControl>
            {errorMessage.inputField === 'Mobile' ? <Text style={{color:'red', fontSize:11}}>{errorMessage.error}</Text> : <></> }
            {ErrMN ? <Text style={{color:'#FF0000', fontSize:9}}> * Please enter the Mobile no. properly</Text> : null}

            <FormControl >
              <FormControl.Label 
                _text={{
                  color: "#000000",
                  fontSize: "sm",
                  fontWeight: 'bold',
                  paddingBottom:"2"
                  }}
              >
                About You <Text style={{color:'#FF0000'}}>*</Text>
              </FormControl.Label>
              <TextArea 
                variant="filled"
                bg="#f3f3f3"
                borderRadius={5}
                ref={aboutRef}
                p={2}
                h={150} 
                onChangeText={(text) =>{ 
                  let regA = /\s{3,}/g;
                  let Apass = regA.test(text);
                  if(text != '' && text != ' ' && text != '  ' && Apass === false ){ 
                    setErrorMessage({name: ''})
                    setAbout(text) 
                    setErrAbout(false) 
                  }
                  else{
                    setErrorMessage({name: ''})
                    setAbout(text)  
                    setErrAbout(true) 
                  }
                }} 
                placeholder="Tell something About You"
                value={About} 
                />
                {errorMessage.inputField === 'About' ? <Text style={{color:'red', fontSize:11}}>{errorMessage.error}</Text> : <></> }
            </FormControl>
            
            <FormControl >
          <FormControl.Label
          _text={{
            color: "#000000",
            fontSize: "sm",
            fontWeight: 'bold',
            }}
          >
            Experience <Text style={{color:'#FF0000'}}>*</Text>
          </FormControl.Label>
              <Input 
                variant="filled" 
                bg="#f3f3f3"
                ref={experienceRef}
                value={Exp} 
                placeholder="Experience"
                onChangeText={(text) => {
                  setErrorMessage({name: ''})
                  setExp(text)
                }}
                borderRadius={5}
                p={2}
              />
              {errorMessage.inputField === 'Experience' ? <Text style={{color:'red', fontSize:11}}>{errorMessage.error}</Text> : <></> }
              
        </FormControl>

        <FormControl  style={styles.cinput}>
                <FormControl.Label _text={{
                color: "#000000",
                fontSize: "sm",
                fontWeight: 'bold',
                paddingBottom:"2"
              }}
                style={styles.cinputlabel}
              >
                  Categories of expertise <Text style={{color:'#FF0000'}}>*</Text>
                </FormControl.Label>
                <Input 
                variant="filled" 
                bg="#f3f3f3"
                ref={expertiseRef}
                placeholder="Eg. UI/UX"
                value={catD}
                onChangeText={(text) => {
                  setErrorMessage({name: ''})
                  setcatD(text)
                }}
                borderRadius={5}
                p={2}
                InputRightElement={
                    <IconButton 
                    icon={
                      <Icon size="lg" as={Ionicons} name="add-outline" color="primary.50"/>
                    }
                    _pressed={{bg: "#eddee8"}}
                    onPress={()=> {
                      UpdateCat()
                    }}  
                  />
                }
                />   
                {errorMessage.inputField === 'Expertise' ? <Text style={{color:'red', fontSize:11}}>{errorMessage.error}</Text> : <></> }  
            </FormControl>

                <VStack>
                  <ScrollView horizontal={true}>
                    <SafeAreaView style={styles.flatContainer}>
                      <View style={styles.FlatRender}>
                        { RChip && <RenderChip/>}
                      </View>
                    </SafeAreaView>
                  </ScrollView>
                </VStack>


          <FormControl style={styles.Avweek}>
          <FormControl.Label
          _text={{
            color: "#000000",
            fontSize: "sm",
            fontWeight: 'bold',
            }}
          >
            Available In Week <Text style={{color:'#FF0000'}}>*</Text>
          </FormControl.Label>
          <Input 
            InputRightElement={<Text style={styles.AvText}>Hrs  </Text>}
            placeholder="10" 
            variant="filled"
            bg="#f3f3f3"
            ref={availabilityRef}
            value={Ahours}
            keyboardType="numeric" 
            onChangeText={(text) =>{
              if(text.length > 2) {
                setLimitAError(true)
                setErrorMessage({name: ''})
              }else{
                setLimitAError(false)
                setAhours(text.toString())
                setErrorMessage({name: ''})
              }
            
            }}
            borderRadius={5}
            p={2}
            mt={2}
            />
            {errorMessage.inputField === 'Availability' ? <Text style={{color:'red', fontSize:11}}>{errorMessage.error}</Text> : <></> }  
            {/* <FormControl.ErrorMessage>
          Available hours must br within 2 digits!
        </FormControl.ErrorMessage> */}
          </FormControl>
          { LimitAError && <Text style={{color:"#FF0000", fontSize:11}}>Available hours must be within 2 digits!</Text>}

            <Text
            style={styles.AVText}
            //  _text={{
            //   color: "#000000",
            //   fontSize: "sm",
            //   fontWeight: 'bold',
            //   }}
            >
              Available Time
            </Text>
          <HStack justifyContent='space-between' alignItems='center'>

            <Text style={{color: "#000000", fontSize: 14,fontWeight: 'bold'}}>
              From
            </Text>
          <View 
            style={{width: "30%", height: "100%",}}
            >
            <Input 
            InputRightElement={<IconButton 
              icon={<Icon size="md" as={Ionicons} name="time-outline" color="#395061"/>}
              onPress={() => setShowFromPicker(true)}
              />} 
            placeholder="HH:MM"
              variant="filled" 
              bg="#f3f3f3"
              value={DFromTime} 
              onChangeText={(text) => 
                  setfromTime(text)
              }
              borderRadius={5}
              pt={2}
              pb={2}
              pl={2}
              pr={2}
              mt={2}
            />
            </View>
            <Text style={{color: "#000000", fontSize: 14,fontWeight: 'bold' }}>
              To
            </Text>
          <View 
            style={{width: "30%", height: "100%",}}
            >
              {/* <Text>
                From
              </Text> */}
            {/* <Select
              variant='filled'
              bg="#f3f3f3"
              borderColor="#f3f3f3" 
              accessibilityLabel="ftime" 
              placeholder="To"
              selectedValue={toTime}   
              _selectedItem={{
              endIcon: <Ionicons size={5} />
              }}
              onValueChange={itemValue => settoTime(itemValue)} 
              mt="1"
              style={styles.AVSelect}
            >
            <Select.Item label="01:00 AM" value="1" />
            <Select.Item label="02:00 AM" value="2" />
            <Select.Item label="03:00 AM" value="3" />
            <Select.Item label="04:00 AM" value="4" />
            <Select.Item label="05:00 AM" value="5" />
            <Select.Item label="06:00 AM" value="6" />
            <Select.Item label="07:00 AM" value="7" />
            <Select.Item label="08:00 AM" value="8" />
            <Select.Item label="09:00 AM" value="9" />
            <Select.Item label="10:00 AM" value="10" />
            <Select.Item label="11:00 AM" value="11" />
            <Select.Item label="12:01 PM" value="12" />
            <Select.Item label="01:00 PM" value="13" />
            <Select.Item label="02:00 PM" value="14" />
            <Select.Item label="03:00 PM" value="15" />
            <Select.Item label="04:00 PM" value="16" />
            <Select.Item label="05:00 PM" value="17" />
            <Select.Item label="06:00 PM" value="18" />
            <Select.Item label="07:00 PM" value="19" />
            <Select.Item label="08:00 PM" value="20" />
            <Select.Item label="09:00 PM" value="21" />
            <Select.Item label="10:00 PM" value="22" />
            <Select.Item label="11:00 PM" value="23" />
            <Select.Item label="12:01 AM" value="24" />
            </Select> */}
              <Input 
            // InputRightElement={<Icon as={Ionicons} name="caret-down-outline" color="primary.50" mr={2}/>} 
            InputRightElement={<IconButton 
              icon={<Icon size="md" as={Ionicons} name="time-outline" color="#395061"/>}
              onPress={() => setShowToPicker(true)}
              />} 
            placeholder="HH:MM" 
            variant="filled"
            bg="#f3f3f3"
            value={DToTime} 
            onChangeText={(text) =>{
                settoTime(text)
            }}
            borderRadius={5}
            pt={2}
            pb={2}
            pl={2}
            pr={2}
            mt={2}
            />
            </View>
          </HStack>

          {/* <Text style={{color:"#000000",fontSize:14,fontWeight:'bold',marginTop:5}}>
            Languages
          </Text>
          <Select
            variant='filled'
            bg="#f3f3f3"
            borderColor="#f3f3f3" 
            accessibilityLabel="Language" 
            placeholder="Language"
            onValueChange={itemValue => setLang(itemValue)}
            selectedValue={userData.language}
            // onChangeText= {(text) => setLang(text)}
            _selectedItem={{
            endIcon: <Ionicons size={5} />
            }} 
            mt="1"
          >
            <Select.Item label='Tamil' value="Tamil"/>
            <Select.Item label='English' value="English"/>
          </Select> */}
          
            <View style={styles.social}>
            <Text style={{color:"#000000",fontSize:14,fontWeight:'bold',marginTop:5}}>
            Social Link
          </Text>
            <HStack space={4} mt={2}>
              <Image 
                source={require('../../assets/facebook.png')} 
                alt="facebook"
                style={styles.socialImg}
                />
              <FormControl>
              <Input 
                variant="filled" 
                bg="#f3f3f3" 
                placeholder="Facebook Link"
                value={facebook}
                onChangeText={(text) => setfacebook(text)}
                borderRadius={5}
                w='85%'
                />
              </FormControl>
            </HStack>
            <HStack space={4} mt={2}>
              <Image 
                source={require('../../assets/instagram.png')} 
                alt="facebook"
                style={styles.socialImg}
                />
              <FormControl>
              <Input 
                variant="filled" 
                bg="#f3f3f3" 
                placeholder="Instagram Link"
                onChangeText={(text) => setinstagram(text)}
                borderRadius={5}
                value={instagram}
                w='85%'
                />
              </FormControl>
            </HStack>

            <HStack space={4} mt={2}>
              <Image 
                source={require('../../assets/linkedin.png')} 
                alt="facebook"
                style={styles.socialImg}
                />
              <FormControl>
              <Input 
                variant="filled" 
                bg="#f3f3f3" 
                placeholder="linkedin Link"
                onChangeText={(text) => setlinkedin(text)}
                borderRadius={5}
                value={linkedin}
                w='85%'
                />
              </FormControl>
            </HStack>
            <HStack space={4} mt={2}>
              <Image 
                source={require('../../assets/Twitter.png')} 
                alt="facebook"
                style={styles.socialImg}
                />
              <FormControl>
              <Input 
                variant="filled" 
                bg="#f3f3f3" 
                placeholder="Twitter Link"
                onChangeText={(text) => settwitter(text)}
                borderRadius={5}
                value={twitter}
                w='85%'
                />
              </FormControl>
            </HStack>
            </View>
            <TouchableOpacity
            
            >
            <Button 
            bg='primary.100'
            m={5}
            onPress={() => {
              updateProfile()
              // setSaved(true)
            }}
            >
              Save Changes
            </Button>
            </TouchableOpacity>
          </VStack>
      </ScrollView>
    </SafeAreaView>
      </View>
    }
  </View>

  )
}

export default Profile

const styles = StyleSheet.create({
  container:{
    height:height,
    width:width,
    backgroundColor:'#fcfcfc',
    
  },
  flatContainer:{
    flex:1,
    alignItems:"center",
    justifyContent:"center"
  },
  FlatRender:{
    width:width
  },  
  cinput:{
 
  },
  form:{
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  COEContainer:{
  },
  AvText:{
    color:'#364b5b',
    fontWeight:'bold',
    paddingLeft:5
  },
  AVText:{
    color:'#000000',
    fontSize:14,
    fontWeight:'bold',
    marginTop:5
  },
  socialImg:{
    width:30,
    height:30
  },
  // chiplaceholder:{
  //   fontSize:5,
  // }
  ChipInput: {
  }
})