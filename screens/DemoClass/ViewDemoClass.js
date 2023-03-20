import React, {useEffect, useState} from "react"
import AppBar from "../components/Navbar"
import { StyleSheet, Dimensions, TouchableOpacity, ScrollView, Linking} from 'react-native';
import {HStack, VStack, Image, Center, View, Text, Icon, Button, Divider, IconButton, Pressable } from 'native-base';
import {useDispatch,useSelector} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CollapsibleView from '@eliav2/react-native-collapsible-view';
import RenderHtml from "react-native-render-html";
import Feather from 'react-native-vector-icons/Feather';
const { width, height } = Dimensions.get('window')
import { GetDemoClassListbyCourseCode } from "../Functions/API/GetDemoClassListbyCourseCode";
import CountDownTimer from 'react-native-countdown-timer-hooks'
import { setGoLiveDemoObject } from "../Redux/Features/CourseSlice";

const ViewDemoClass = ({navigation}) => {
    const dispatch = useDispatch()
    const email = useSelector(state => state.Login.email);
    const [allData, setAllData] = useState([])
    const courseCode = useSelector(state => state.Course.CurrentDemoClassCourseCode);
    const courseData = useSelector(state => state.Course.CurrentDemoClassObject);

    useEffect(()=>{
        getDemoClassListbyCourseCode()
    },[])

    const ToSeconds = (time) =>{
        const sec = Math.floor((time) / 1000);
        // console.log('seconds:'+sec)
        return sec;
    }

    const getDemoClassListbyCourseCode = async () => {
        try {
            const result = await GetDemoClassListbyCourseCode(email, courseCode)
            if(result.status === 200) {
                setAllData(result.data)
            } else {
                console.log('Server error getDemoClassListbyCourseCode : ', result)
            }
        } catch (e) {
            console('Fetch error getDemoClassListbyCourseCode: ', e)
        }
    }

    const validateDate = (date, time) => {
        let dateToday = new Date().toJSON().slice(0, 10)
        dateToday = dateToday.split('-')
        const hour = new Date().getHours() 
        const minute = new Date().getMinutes() 
        let demoDate = date.split('T')
        demoDate = demoDate[0].split('-')
        let demoTime = time.split(':')
        // console.log(dateToday[0] === demoDate[0], dateToday[1] === demoDate[1], dateToday[2] === demoDate[2])
        if(dateToday[0] === demoDate[0] && dateToday[1] === demoDate[1] && dateToday[2] === demoDate[2] && hour === demoTime[0] || hour > demoTime[0]) {
            if(hour === demoTime[0]){
                if(minute === demoTime[1] || minute > demoTime[1]){
                    console.log('hello11111111111')
                    return true
                }
            } else if (parseInt(hour) > parseInt(demoTime[0])) {
                console.log('hello2' )
                return true
            } else {
                console.log('hello3')
                return false
            } 
        } else {
            console.log('hello4')
            return false
        }
    }

    const handleGoLive = (data) => {
        dispatch(setGoLiveDemoObject(data))
        navigation.navigate('GoDemoLive')
    }

    const AppBarContent = {
        title: 'Demo Class',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
    }

    return (
        <View>
            <AppBar props={AppBarContent} />
            <ScrollView>
            <View style={styles.TopContainer}>
                <Image 
                    style={styles.courseImg} 
                    source={{uri: courseData.thumbNailImagePath}}
                    // source={require('../../assets/course_cdetails.png')}
                    alt='courseImg'
                    mb={2}
                    resizeMode='cover'
                />
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>{courseData.courseName}</Text>
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>{'₹'} {courseData.fee}</Text>
                {/* <HStack space={2} mt="2" alignItems="center">
                    <HStack space={2} alignItems="center">
                        <HStack space={1}>
                        <Image
                            source={require('../../assets/star.png')}
                            alt="rating"
                            size="4"
                        />
                        <Image
                            source={require('../../assets/star.png')}
                            alt="rating"
                            size="4"
                        />
                        <Image
                            source={require('../../assets/star.png')}
                            alt="rating"
                            size="4"
                        />
                        <Image
                            source={require('../../assets/unstar.png')}
                            alt="rating"
                            size="4"
                        />
                        <Image
                            source={require('../../assets/unstar.png')}
                            alt="rating"
                            size="4"
                        />
                        </HStack>
                    <Text style={{fontSize: 15,color: '#364b5b'}}>
                    5.0(150)
                    </Text>
                    <Text style={{fontSize: 15,color: '#364b5b',fontWeight: 'bold',paddingLeft:15}}>
                    View Reviews
                    </Text>
                    </HStack>
                </HStack> */}

            
                <HStack space={2} mt='3' mb='4' alignItems="center">
                    <TouchableOpacity
                    onPress={()=>setRChat(true)}
                    >
                        <HStack alignItems="center">
                            <Image
                                alt="graduate icon"
                                source={require('../../assets/graduate_student.png')}
                                size="4"
                            />
                            <Text ml={2}>{courseData.learnersCount} Learners</Text>
                        </HStack>
                    </TouchableOpacity>
                </HStack>
                
                {
                    Object.keys(allData).length > 0 ?
                    <>
                        {/* <CollapsibleView 
                            title={
                            <HStack 
                                style={{
                                flex:1,    
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                paddingTop:10,
                                paddingLeft:15,
                                paddingRight:15,
                                paddingBottom:10,
                                position: 'relative'
                                }}
                            >
                            <VStack>
                                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>Timing</Text>
                            </VStack>
                            </HStack>  
                            }
                            style={{
                            borderRadius: 5,
                            backgroundColor: "#FFFFFF",
                            shadowColor: "rgba(0, 0, 0, 0.03)",
                            shadowOffset: {
                                width: 0,
                                height: 0.5
                            },
                            shadowRadius: 22,
                            shadowOpacity: 1,
                            borderWidth: 0,
                            }}
                            // collapsibleContainerStyle={}
                            arrowStyling={{ size: 20,thickness: 3, color: "#364b5b"}}
                            isRTL={true}
                            collapsibleContainerStyle={{
                            paddingTop: 5,
                            paddingBottom:10,
                            paddingLeft:15,
                            paddingRight:15
                            }}
                        >
                    
                            {
                                allData.map((data, index)=>{
                                    let date = data.demoDate.split('T')
                                    return (
                                        <View key={index} style={{marginBottom:10}}>
                                            <Divider my={1}/>
                                            <VStack width={'90%'} alignSelf={'center'} space={2}>
                                                <Text style={{fontWeight:"bold", fontSize:13}}>Date</Text>
                                                <Pressable mb={3} alignSelf={'center'} style={{width:'100%', padding:10, borderRadius:5, backgroundColor:"rgba(57,80,97,0.2)"}} >
                                                    <HStack justifyContent={'space-between'} alignItems={'center'}>
                                                        <Text noOfLines={1} style={{color:"#395061"}}>{date[0]}</Text>
                                                        <Icon as={<Feather name="calendar"/>} color={'#395061'} size={5}/>
                                                    </HStack>
                                                </Pressable>
                                                <Text style={{fontWeight:"bold", fontSize:13}}>Time</Text>
                                                <Pressable mb={3} alignSelf={'center'} style={{width:'100%', padding:10, borderRadius:5, backgroundColor:"rgba(57,80,97,0.2)"}} >
                                                    <HStack justifyContent={'space-between'} alignItems={'center'}>
                                                        <Text noOfLines={1} style={{color:"#395061"}}>{data.demoTime}</Text>
                                                        <Icon bottom={1} as={<FontAwesome name="sort-down"/>} color={'#395061'} size={5}/>
                                                    </HStack>
                                                </Pressable>
                                                <Text style={{fontWeight:"bold", fontSize:13}}>Timezone</Text>
                                                <Pressable alignSelf={'center'} style={{width:'100%', padding:10, borderRadius:5, backgroundColor:"rgba(57,80,97,0.2)"}} >
                                                    <HStack justifyContent={'space-between'} alignItems={'center'}>
                                                        <Text noOfLines={1} style={{color:"#395061"}}>{data.timeZone}</Text>
                                                        <Icon bottom={1} as={<FontAwesome name="sort-down"/>} color={'#395061'} size={5}/>
                                                    </HStack>
                                                </Pressable>
                                            </VStack>
                                        </View>
                                    )
                                })
                            }
                        </CollapsibleView> */}
                        <CollapsibleView 
                            title={
                            <HStack 
                                style={{
                                flex:1,    
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                paddingTop:10,
                                paddingLeft:15,
                                paddingRight:15,
                                paddingBottom:10,
                                position: 'relative'
                                }}
                            >
                            <VStack>
                                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>
                                Demo Classes 
                                </Text>
                            </VStack>
                            </HStack>  
                            }
                            style={{
                            borderRadius: 5,
                            backgroundColor: "#FFFFFF",
                            shadowColor: "rgba(0, 0, 0, 0.03)",
                            shadowOffset: {
                                width: 0,
                                height: 0.5
                            },
                            shadowRadius: 22,
                            shadowOpacity: 1,
                            borderWidth: 0,
                            }}
                            // collapsibleContainerStyle={}
                            arrowStyling={{ size: 20,thickness: 3, color: "#364b5b"}}
                            isRTL={true}
                            collapsibleContainerStyle={{
                            paddingTop: 5,
                            paddingBottom:10,
                            paddingLeft:15,
                            paddingRight:15
                            }}
                        >
                            <Divider my={2}/>
                            <VStack mt={1} space={2}>
                                {
                                    allData.map((data, index)=>{
                                        const val = validateDate(data.demoDate, data.demoTime)
                                        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
                                        var today  = new Date(data.demoDate)
                                        const time = data.demoTime.split(':')
                                        const timeToSec = Date.parse(data.demoDate) - Date.now();
                                        const sec = ToSeconds(timeToSec)
                                        let demoDate = data.demoDate.split('T')
                                        let dateToday = new Date().toJSON().slice(0, 10)
                                        return (                                            
                                            <View key={index}>
                                                <HStack width={'95%'} alignSelf={'center'} justifyContent={'space-between'} alignItems={'center'}>
                                                    <VStack>
                                                        <Text style={{fontSize:12, fontWeight:"bold"}}>{today.toLocaleDateString("en-US", options)}</Text>
                                                        {
                                                            parseInt(time) >= 12 ?
                                                            <Text style={{fontSize:10, fontWeight:"bold"}}>{data.demoTime} PM</Text>
                                                            :
                                                            <Text style={{fontSize:10, fontWeight:"bold"}}>{data.demoTime} AM</Text>
                                                        }
                                                    </VStack>
                                                    <VStack alignItems={'center'}>
                                                        <Text style={{fontSize:10, color:"#8C8C8C", fontWeight:"bold"}}>No of Booked</Text>
                                                        <Text style={{fontSize:12, fontWeight:"bold"}}>{courseData.learnersCount} Learners</Text>
                                                    </VStack>
                                                    <VStack  alignItems={'center'}>
                                                        <Text style={{fontSize:10, color:"#8C8C8C", fontWeight:"bold"}}>Status</Text>
                                                        <>
                                                            {
                                                                demoDate[0] === dateToday ?
                                                                <Text onPress={()=>alert('hello')} color={'primary.900'} style={{fontSize:12, fontWeight:"bold"}}>Start class</Text>
                                                                :
                                                                <>
                                                                    {
                                                                        sec > 0 ?
                                                                        <CountDownTimer
                                                                            containerStyle={styles.count}
                                                                            timestamp={sec}
                                                                            onFinish={() => {
                                                                                navigation.replace('ViewDemoClass')
                                                                            }}
                                                                            textStyle={{backgroundColor: 'White', fontSize:12, fontWeight:"bold", color:"#000"  }}
                                                                        /> 
                                                                        :
                                                                        <Text style={{fontSize:12, color:"red", fontWeight:"bold"}}>  Expired  </Text>
                                                                    }
                                                                </>
                                                            }
                                                        </>
                                                    </VStack>
                                                    {/* <Icon as={<AntDesign name="rightcircleo"/>} color={'#395061'} size={5}/> */}
                                                </HStack>
                                                <Divider my={2}/>
                                            </View>
                                        )
                                    })
                                }
                            </VStack>
                        </CollapsibleView>

                        <CollapsibleView 
                            title={
                            <HStack 
                                style={{
                                flex:1,    
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                paddingTop:10,
                                paddingLeft:15,
                                paddingRight:15,
                                paddingBottom:10,
                                }}
                            >
                            <View>
                                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>
                                Go Live
                                </Text>
                            </View>
                            </HStack>  
                            }
                            style={{
                            borderRadius: 5,
                            backgroundColor: "#FFFFFF",
                            shadowColor: "rgba(0, 0, 0, 0.03)",
                            shadowOffset: {
                                width: 0,
                                height: 0.5
                            },
                            shadowRadius: 22,
                            shadowOpacity: 1,
                            borderWidth: 0,
                            marginBottom:30
                            }}
                            arrowStyling={{ size: 20,thickness: 3, color: "#364b5b"}}
                            isRTL={true}
                            collapsibleContainerStyle={{
                            paddingTop: 5,
                            paddingBottom:10,
                            paddingLeft:15,
                            paddingRight:15
                            }}
                        >
                            <Divider my={1}/>
                            <VStack mt={1} space={2}>
                                {/* <VStack space={1} alignItems={'center'} paddingTop={10}>
                                    <Text style={{backgroundColor:"#395061", marginBottom:15, paddingHorizontal:50, paddingVertical:8, color:"#fff", borderRadius:5}}>Start Class</Text>
                                    <Text style={{fontSize: 20, marginBottom:15, color: '#000000', fontWeight: 'bold'}}>10:30:15:20</Text>
                                    <Text style={{fontSize: 16, color: '#000000', fontWeight: 'bold'}}>Here’s the link to your demo class</Text>
                                    <Text style={{fontSize: 13, color: '#8C8C8C'}}>Copy this link and send it to learners for join the class. Also Lerner will get link from their Transactions.  Save it for use Later. System saved it also on your Transactions. </Text>
                                    <Pressable mt={5} style={{width:'80%', padding:10, borderRadius:5, backgroundColor:"rgba(57,80,97,0.2)"}} >
                                        <HStack justifyContent={'space-between'} alignItems={'center'}>
                                            <Text noOfLines={1} style={{color:"#395061"}}>qlearning.com/liveClass/fbjng</Text>
                                            <Icon as={<Feather name="copy"/>} color={'#395061'} size={5}/>
                                        </HStack>
                                    </Pressable>
                                </VStack> */}
                                {
                                    allData.map((data, index)=>{
                                        const val = validateDate(data.demoDate, data.demoTime)
                                        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
                                        var today  = new Date(data.demoDate)
                                        let demoDate = data.demoDate.split('T')
                                        let dateToday = new Date().toJSON().slice(0, 10)
                                        const time = data.demoTime.split(':')
                                        const timeToSec = Date.parse(data.demoDate) - Date.now();
                                        const sec = ToSeconds(timeToSec)
                                        console.log(demoDate[0], dateToday)
                                        return (
                                            <TouchableOpacity onPress={()=>handleGoLive(data)}>
                                                {
                                                    demoDate[0] === dateToday ?
                                                    <>
                                                        <HStack key={index} alignItems={'center'} justifyContent={'space-between'} alignSelf={'center'} width={width*0.8}>
                                                            <Text numberOfLines={5} style={{fontSize: 16, color: '#000000', fontWeight: 'bold', maxWidth:width*0.58}}>{data.topicName}</Text>
                                                            <TouchableOpacity onPress={()=>alert('hello')}>
                                                                <Text style={{backgroundColor:"#395061", marginBottom:15, paddingVertical:5, paddingHorizontal:10, color:"#fff", borderRadius:5}}>Start Class</Text>
                                                            </TouchableOpacity>
                                                        </HStack>
                                                        <Divider my={1}/>
                                                    </>
                                                    :
                                                    <>
                                                        {
                                                            sec > 0 && demoDate[0] === dateToday ?
                                                            <>
                                                                <HStack key={index} alignItems={'center'} justifyContent={'space-between'} alignSelf={'center'} width={width*0.8}>
                                                                    <Text numberOfLines={5} style={{fontSize: 16, color: '#000000', fontWeight: 'bold', maxWidth:width*0.58}}>{data.topicName}</Text>
                                                                    <TouchableOpacity onPress={()=>alert('hello')}>
                                                                        <Text style={{backgroundColor:"#395061", marginBottom:15, paddingVertical:5, paddingHorizontal:10, color:"#fff", borderRadius:5}}>Start Class</Text>
                                                                    </TouchableOpacity>
                                                                </HStack>
                                                                <Divider my={1}/>
                                                            </>
                                                            : 
                                                            <>
                                                                <VStack key={index} alignSelf={'center'} width={width*0.8}>
                                                                    <Text numberOfLines={5} style={{fontSize: 16, color: '#000000', fontWeight: 'bold', }}>{data.topicName}</Text>
                                                                    <View style={{backgroundColor:'#F0E1EB', marginTop:5, borderRadius:10, alignSelf:'flex-start'}}>
                                                                        {
                                                                            parseInt(time) >= 12 ?
                                                                            <>
                                                                                {
                                                                                    sec > 0 ?
                                                                                    <Text style={{fontSize: 11,color: '#395061', paddingLeft:7,paddingRight:7,paddingTop:5,paddingBottom:5}} >Scheduled for {data.demoTime} PM {today.toLocaleDateString("en-US", options)}</Text>
                                                                                    :
                                                                                    <Text style={{fontSize: 11,color: '#395061', paddingLeft:7,paddingRight:7,paddingTop:5,paddingBottom:5}} >Scheduled on {data.demoTime} PM {today.toLocaleDateString("en-US", options)}</Text>
                                                                                }
                                                                            </>
                                                                            :
                                                                            <>
                                                                                {
                                                                                    sec > 0 ?
                                                                                    <Text style={{fontSize: 11,color: '#395061', paddingLeft:7,paddingRight:7,paddingTop:5,paddingBottom:5}} >Scheduled for {data.demoTime} AM {today.toLocaleDateString("en-US", options)}</Text>
                                                                                    :
                                                                                    <Text style={{fontSize: 11,color: '#395061', paddingLeft:7,paddingRight:7,paddingTop:5,paddingBottom:5}} >Scheduled on {data.demoTime} AM {today.toLocaleDateString("en-US", options)}</Text>
                                                                                }
                                                                            </>
                                                                        }
                                                                    </View>
                                                                </VStack>
                                                                <Divider my={1}/>
                                                            </>
                                                        }
                                                    </>
                                                }
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </VStack>
                        </CollapsibleView>
                    </>
                    : 
                    <Text onPress={()=>{Linking.openURL('https://dev.qlearning.academy/demo-class')}} style={{fontSize: 15,color: '#364b5b',fontWeight: 'bold', alignSelf:"center"}}>Kindly schedule the demo class in website</Text>
                }
            </View>
            </ScrollView>
        </View>
    )
}

export default ViewDemoClass

const styles = StyleSheet.create({
  CourseCard: {
    width:"95%",
    alignSelf:"center",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "rgba(0, 0, 0, 0.03)",
    shadowOffset: {
      width: 0,
      height: 0.376085489988327
    },
    shadowRadius: 22,
    shadowOpacity: 1,
    paddingTop:10,
    paddingHorizontal:10,
    marginTop:10,
  },
  cardImg: {
    height:width*0.17,
    width: width*0.27,
    borderRadius: 5,
  },
  CardContent:{
    // minWidth:width/1.7,
    marginLeft:10
  },
  TopContainer: {
    // marginTop:20,
    marginLeft:10,
    marginRight:10,
    marginBottom:30
  },
  courseImg:{
    height:height/4,
    borderRadius:5
  },
  Thumbnail:{
    height: height/4,
    borderRadius:5,
  },
  learner_chat:{
    width:45,
    height:45,
  },
  chatTile:{
    padding:10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    shadowColor: "rgba(0, 0, 0, 0.03)",
    shadowOffset: {
      width: 0,
      height: 0.376085489988327
    },
    shadowRadius: 21.951963424682617,
    shadowOpacity: 1001,
    justifyContent:"space-between"
  },
  RenderP:{
    // position:"relative",
    // maxHeight: height*height,
    // minHeight: height/3
  },
  RenderH:{
    // position: "absolute",
    zIndex:1000,
  }
})