import {View, Dimensions, ScrollView, TouchableWithoutFeedback, StyleSheet,TouchableOpacity} from 'react-native';
import {useState,useEffect,React} from 'react';
import {FormControl,Input,Icon,Text,HStack, VStack,Button} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import DocumentPicker from 'react-native-document-picker'
import { setLoading } from '../../Redux/Features/userDataSlice';
import ResoucreFile from './components/ResoucreFile';
import { setLiveClassDetails } from '../../Redux/Features/CourseSlice';


const { width, height } = Dimensions.get('window')

const GTStart = ({navigation}) => {

  const dispatch = useDispatch()

  const [LCaption, setLCaption] = useState('');
  const [Resource, setResource] = useState([]);
  const [updateResource, setUpdateResource] = useState();
  const [RView, setRView] = useState('auto');

  const BaseURL = useSelector(state => state.UserData.BaseURL);
  const SingleCD = useSelector(state => state.Course.SingleLiveCourse);
  const email = useSelector(state => state.Login.email);
  const GTD = useSelector(state => state.Course.LiveClassDetails);
  const [GTData, setGTData] = useState(GTD);

  const [RName, setRName] = useState();
  const [FLink, setFLink] = useState();
  const [RType,setRType] = useState();
  const [Order, setOrder] = useState();

  const [CurrentDate,setCurrentDate] = useState();
  const [CurrentTime,setCurrentTime] = useState();

  const [SLBtn, setSLBtn] = useState(true);

  console.log('yet')
  console.log(GTData)
  // console.log(SingleCD.courseCode)

  useEffect(()=>{
    // console.log(GTData)
    if(GTData.resourceDetails && GTData.resourceDetails.length !=0){
      let RDetails = GTData.resourceDetails
      setResource(RDetails)
      setRName(RDetails[0].resourceName)
      setFLink(RDetails[0].resourcePath)
    }
    if(GTData.liveCaption){
      setLCaption(GTData.liveCaption)
    }
    if(GTData.liveClassOrder){
      setOrder(GTData.liveClassOrder)
    }
    let NDate = new Date();
    let DD = NDate.toLocaleTimeString([],{ hour12: false, 
      hour: "numeric", 
      minute: "numeric"});
    
    let CDate = NDate.getFullYear()+'-'+(NDate.getMonth()+1)+'-'+NDate.getDate()
    // let SDD = DD.slice(0,5)

    let GS = GTData.scheduledDate
    let GSD = GS.slice(0,10)
    // console.log(typeof GSD)
    // console.log(typeof CDate)

    let CD = DD.split(':')
    let CDJ = CD[0]+CD[1]
    let CurrentDateN = Number(CDJ)
    console.log(CurrentDateN)

    let STime = GTData.startTime
    let STJ = STime.split(':').join('')
    let StartD = Number(STJ)
    console.log(StartD)

    if(CurrentDateN >= StartD  && GSD === CDate){
      console.log('Start true')
      setSLBtn(false)
    }

  },[])

  const GetSCC = () =>{
    dispatch(setLoading(true))
    const API = BaseURL+'getScheduledLiveCourseClass?courseCode='+SingleCD.courseCode;
    let requestOptions ={
        method:'GET',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'gmailUserType':'INSTRUCTOR',
          'token':email
        }
      }
    
    fetch(API, requestOptions)
    .then(res => res.json())
    .then(result => {
        if(result.status === 200){
            // console.log(result.data)
            let data = result.data
            data.map((data, index)=>{
              if(data.liveClassOrder === GTData.liveClassOrder){
                setGTData(data)
                dispatch(setLiveClassDetails(data))
              }
            })
            dispatch(setLoading(false))
        }else if(result.status > 200){
            alert(result.message)
            alert(result.message)
            dispatch(setLoading(false))
        }
    })
    .catch(error => {
        alert('Error: '+error)
        alert(error)
        dispatch(setLoading(false))
    })
  } 

  const RRender = () =>{
    return Resource.map((data,index)=>{

      // let data = {
      //   resourceName:RName,
      //   resourcePath:FLink
      // }

      const RData = {
        data:data,
        navigation:navigation
      }
      return(
        <View pointerEvents={RView} key={index}>
         {Resource ? <ResoucreFile props={RData}/> : null}
        </View>
      )

    })
  }

  // const GetData = () =>{
  //   dispatch(setLoading(true))
  //   const API = BaseURL+'getGotoLiveCourse?courseCode='+SingleCD.courseCode;
  //   let requestOptions ={
  //       method:'GET',
  //       headers:{
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //         'gmailUserType':'INSTRUCTOR',
  //         'token':email
  //       }
  //     }
    
  //   fetch(API, requestOptions)
  //   .then(res => res.json())
  //   .then(result => {
  //       if(result.status === 200){
  //           // console.log(result.data)
  //           let DD = result.data
  //           let RR =  DD[0].resourceDetails
  //           // console.log(RR)
  //           setLCaption(DD[0].liveCaption)
  //           setResource(DD[0].resourceDetails)
  //           setUpdateResource(RR[0].resourcePath)
  //           // console.log(RR[0].resourcePath)
  //           dispatch(setLoading(false))
  //       }else if(result.status > 200){
  //           alert(result.message)
  //           alert(result.message)
  //           dispatch(setLoading(false))
  //       }
  //   })
  //   .catch(error => {
  //       alert('Error: '+error)
  //       alert(error)
  //       dispatch(setLoading(false))
  //   })
  // } 

  const UpdateData = () =>{
    dispatch(setLoading(true))
    const API = BaseURL+'GotoLiveCourse';
    let requestOptions ={
        method:'POST',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'gmailUserType':'INSTRUCTOR',
          'token':email
        },
        body:JSON.stringify({

        })
      }
    
    fetch(API, requestOptions)
    .then(res => res.json())
    .then(result => {
        if(result.status === 200){
            alert(result.message)           
            dispatch(setLoading(false))
        }else if(result.status > 200){
            alert(result.message)
            alert(result.message)
            dispatch(setLoading(false))
        }
    })
    .catch(error => {
        alert('Error: '+error)
        alert(error)
        dispatch(setLoading(false))
    })
  }
  
  const CreateLC = () =>{
    if(LCaption != ''){
      dispatch(setLoading(true))
      var myHeaders = new Headers();
      myHeaders.append("gmailUserType", "INSTRUCTOR");
      myHeaders.append("token", "fakiiyes@hi2.in");

      var formdata = new FormData();
      formdata.append("courseCode", SingleCD.courseCode);
      formdata.append("liveCaption", LCaption);
      // formdata.append("liveCourseResourse",{uri: FLink,name: RName,type:RType});
      formdata.append("startTime", GTData.startTime);
      formdata.append("endTime", GTData.endTime);
      formdata.append("weekDay", GTData.weekDay);
      formdata.append("scheduledDate", GTData.scheduledDate);
      formdata.append("liveClassOrder",Order)

      if(Resource.length != 0){
        Resource.forEach((data, index) =>{
          let FName = data.resourceName
          formdata.append("liveCourseResourse",{uri: data.resourcePath,name:FName,type:'application/pdf'});
        })
      }
      // formdata.append("liveCourseResourse",FLink,RName);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body:formdata
      };
      console.log(requestOptions)
      fetch(BaseURL+"CreateLiveCourseClass", requestOptions)
        .then(response => response.json())
        .then(result => {
          // console.log(result)
          if(result.status === 200){
            alert(result.message)
            GetSCC()           
            dispatch(setLoading(false))
          }else{
            GetSCC()           
            alert(result.message)
            dispatch(setLoading(false))
          }
        })
        .catch(error => {
          console.log(error)
          alert(error)
          dispatch(setLoading(false))
        });
    }else{
      alert('Please provide all the information needed to proceed.')
    }
  }

  const GetFile = async() => {
    let result = await DocumentPicker.pickSingle({allowMultiSelection: true});
    console.log(result)
    // alert(result.type)
    if(result){
        // result.map((i)=>{

        // })
      setFLink(result.uri)
      setRName(result.name)
      setRType(result.type)
      console.log(result.type)
      setRView('none')

      let RUp = {
        'resourceName': result.name,
        'resourcePath': result.uri
      }
      let newArr = [...Resource]
      newArr.push(RUp)
      setResource(newArr)
      // console.log(Resource)
    }
  }

  const StartLive = () => {
    const API = BaseURL+"startLiveCourseClass"

    var requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'gmailUserType':'INSTRUCTOR',
        'token':email
      },
      body: JSON.stringify({
        'liveClassId':GTData._id,
        'courseCode':SingleCD.courseCode
      }),
    };
    console.log(requestOptions)
    fetch(API, requestOptions)
      .then(response => response.json())
      .then(result => {
        if(result.status === 200){
          // alert(result.message)
          navigation.navigate('LLiveClass')
        }else{
          alert(result.message)
          // alert('Something went wrong!')
        }
      })
      .catch(error => {
        console.log('error', error)
        alert('Something went wrong')
      });
  }
 
  const AppBarContent = {
    title: 'Start Live',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  return (
      <SafeAreaView>
        <AppBar props={AppBarContent}/>
        <ScrollView style={styles.TopContainer}>
         <VStack space={10} justifyContent='space-evenly'>
            <VStack space={2}>
              <FormControl>
                <FormControl.Label _text={{
                color: "primary.100",
                fontSize: "sm",
                fontWeight: 'bold',
                paddingBottom:2 
              }}
              >
                  Live Caption
                </FormControl.Label>
                <Input 
                  variant="outline"
                  borderColor='primary.100'
                  value={LCaption} 
                  bg="#f3f3f3" 
                  placeholder="Live Caption"
                  onChangeText={(text) => 
                    {
                      setLCaption(text)
                      console.log(text)
                  }
                  }
                />
              </FormControl>

              <HStack space={3} ml={4}>
                <Text style={{fontSize:15, fontWeight:'bold'}}>Attachments</Text>
                <TouchableOpacity
                onPress={()=>GetFile()}
                >
                  <Text color='primary.100' style={{fontWeight:'bold',fontSize:13}} alignItems='center'>Upload Resource</Text>
                </TouchableOpacity>
              </HStack>
              { Resource ? <RRender/>: null}
            </VStack>
            <HStack mt={10} justifyContent='center' space={4}>
            <Button _text={{fontSize:14}}
            style={{width:width/2.5}}
            onPress={()=>{
              CreateLC()
              // setSLBtn(false)
            }}
            >
              Save
              </Button>
            <Button 
              isDisabled={SLBtn}
              _text={{fontSize:14}}
              onPress={()=> {
                StartLive()
              }}
              // p={2} pl={10} pr={10}
              style={{width:width/2.5}}
            >
              Start Live
            </Button>
            
            </HStack>
         </VStack>

        </ScrollView>
      </SafeAreaView>
  )
}

export default GTStart

const styles = StyleSheet.create({
    TopContainer:{
        margin:15
    }
})