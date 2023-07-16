import { ScrollView, Text, View, HStack, VStack, Button, Container, Image, Divider } from "native-base"
import { Dimensions, TouchableOpacity, StyleSheet } from "react-native"
import React from "react"
import { useSelector, useDispatch } from "react-redux"
import AppBar from "../../components/Navbar"
import { useNavigation } from "@react-navigation/native"
import VideoPlayer from 'react-native-video-controls';
import { useState } from "react"
import { GetCourseByCode } from "../../Functions/API/GetCourseByCode"
import { setLoading } from "../../Redux/Features/authSlice"
import { useEffect } from "react"
import Icon from 'react-native-vector-icons/Ionicons';
import Accordion from 'react-native-collapsible/Accordion';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
const {width, height} = Dimensions.get('window')
import RenderHTML from "react-native-render-html"
import { GetInstructorCourses } from "../../Functions/API/GetInstructorCourses"
import FAQ from "./components/FAQ"
import Review from "./components/Review"
import ClassTimes from './components/ClassTime'
import { GetLiveClass } from "../../Functions/API/GetLiveClass"
import { AirbnbRating } from 'react-native-ratings';
import { GetInstructor } from "../../Functions/API/GetInstructor"
import CountDownTimer from 'react-native-countdown-timer-hooks'

const StudentPreview = ({route}) => {
    const data = route.params.type
    const navigation = useNavigation()
    const name = useSelector(state => state.Login.Name)
    const email = useSelector(state => state.Login.email);
    const ProfileD = useSelector(state => state.UserData.profileData);
    const User_ID = useSelector(state => state.Login.JWT);
    const [allData, setAllData] = useState({})
    const [instructorData, setInstructorData] = useState({})
    const [instructor, setInstructor] = useState({})
    const [liveClassData, setLiveClassData] = useState([])
    const [ActiveSessions, setActiveSessions] = useState([]);
    const courseData = data === 'live' ? useSelector(state => state.Course.SingleLiveCourse) : useSelector(state => state.UserData.SingleCD)
    const [VideoPath, setVideoPath] = useState(courseData.introVideoPath);
    console.log("courseData.instructorId", ProfileD)

    useEffect(()=>{
        getCourseByCode()
        getInstructorById()
    },[])

    const getLiveClassData = async(id) => {
        setLoading(true)
        try {
            const result = await GetLiveClass(email, id)
            if(result.status === 200){
                // setLiveClassData(result.data.liveClassList)
                console.log('LiveClassData data: ', result.data)
                result.data.map((i)=>{setLiveClassData(i.liveClassList)})
            } else{
                alert('Something went wrong!')
                console.log('getInstructorData error: 1', result)
            }
        } catch (e) {
            console.log('getInstructorData error: 2', e)
        }
        setLoading(false)
    }

    const getInstructorById = async () => {
        try {
            const result = await GetInstructor(email, User_ID)
            // console.log('+++++++++++++++FOUND IT+++++++', result)
            setInstructor(result.data)
        } catch (e) {
            console.log('WHAT the hack', e)
        }
    }

    const getInstructorData = async(id) => {
        setLoading(true)
        try {
            const result = await GetInstructorCourses(email, id)
            if(result.status === 200){
                setInstructorData(result.data)
                // console.log('Instructir data: ', result.data)
            } else{
                alert('Something went wrong!')
                console.log('getInstructorData error: 1', result)
            }
        } catch (e) {
            console.log('getInstructorData error: 2', e)
        }
        setLoading(false)
    }

    const getCourseByCode = async () => {
        setLoading(true)
        try {
            const result = await GetCourseByCode(email, courseData.courseCode)
            if(result.status === 200) {
                setAllData(result.data)
                getInstructorData(result.data.instructorId)
                getLiveClassData(courseData.courseCode)
                console.log('All Data: ', result.data)
            } else {
                alert('Something went wrong!')
                console.log('getCourseByCode error: 1', result)
            }
        } catch (e) {
            console.log('getCourseByCode error: 2', e)
        }
        setLoading(false)
    } 

    const AppBarContent = {
        title: 'Student Preview',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
    }

    const CollapsibleChange = active => {
        setActiveSessions(active);
    };

    const CHeader = (section, index) => {
        // console.log('Sectionnnnnnnnnnnnnnnnnnnnnn: ', section)
        return (
          <VStack space={1} mt={2}>
            {
                section.hasOwnProperty('chapterName') ?
                <VStack>
                    <HStack alignItems={'center'} justifyContent={'space-between'}>
                    <Text color={'#000'} fontSize={14} fontWeight={'bold'}  maxW={width / 1.5}>
                        Chapter {index + 1}: {section.chapterName}
                    </Text>
                    <Icon
                        name={
                        index === ActiveSessions[0]
                            ? 'chevron-up-outline'
                            : 'chevron-down-outline'
                        }
                        size={20}
                        color="#000"
                    />
                    </HStack>
                    {section.chapterDuration ? 
                    <Text color={'greyScale.800'} fontSize={12} fontWeight={'bold'}>
                    {new Date(section.chapterDuration*1000).toISOString().substr(11, 8)}
                    </Text>
                    :
                    <Text color={'greyScale.800'} fontSize={12} fontWeight={'bold'}>
                    00:00:00
                    </Text>
                    }
                    
                    {allData.chapterList.length !== index + 1 && index !== ActiveSessions[0] ? (
                    <Divider mt={1} bg={'greyScale.800'} thickness={1} />
                    ) : null}
                </VStack>
                :
                <VStack>
                    <HStack alignItems={'center'} justifyContent={'space-between'}>
                    <Text color={'#000'} fontSize={14} fontWeight={'bold'}  maxW={width / 1.5}>
                        Assessments
                    </Text>
                    <Icon
                        name={
                        index === ActiveSessions[0]
                            ? 'chevron-up-outline'
                            : 'chevron-down-outline'
                        }
                        size={20}
                        color="#000"
                    />
                    </HStack>
                    {allData.assesmentList.length !== index + 1 && index !== ActiveSessions[0] ? (
                    <Divider mt={1} bg={'greyScale.800'} thickness={1} />
                    ) : null}
                </VStack>
            }
          </VStack>
        );
    };

    const CBody = (dat, index) => {
        const LessonData = dat.lessonList;
        // console.log('This is dat: ', dat);
        return (
          <View style={{marginTop: 5, marginBottom: 5}}>
            {
                LessonData.map((data, index) => {
                    return (
                        <TouchableOpacity key={index}
                        onPress={()=> {
                            if (data.isAssesment === false) {
                                setVideoPath(data.lessonVideoPath);
                            } else if (data.isAssesment === true) {
                                navigation.navigate('AssessmentsStudentPreview', {assessment: data});
                            }
                        }}
                        >
                            <HStack justifyContent={'space-between'} alignItems={'center'} mt={2}>
                                <HStack space={2} alignItems="center">
                                <View>
                                    {data.isCompleted === false && data.isAssesment === false ? (
                                    <Icon name="play" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 20,}} size={15}/>
                                    ) : null}
                                    {data.isCompleted === false && data.isAssesment === true ? (
                                    <Icon name="clipboard" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 20, }} size={15}/>
                                    ) : null}
                                    {data.isCompleted === true ? (
                                    <Image
                                        source={require('../../../assets/CompletedTick.png')}
                                        alt="completed"
                                        size={7}
                                    />
                                    ) : null}
                                </View>
                                <VStack>
                                    <Text color={'#000'} maxWidth={width*0.6} fontSize={14} fontWeight={'bold'}>
                                    {data.lessonName}
                                    </Text>
                                    { data.isAssesment !== true ?
                                    <Text
                                    color={'greyScale.800'}
                                    fontSize={12}
                                    fontWeight={'bold'}>
                                    {new Date(data.lessonDuration*1000).toISOString().substr(11, 8)}
                                    </Text> : null}
                                </VStack>
                                </HStack>
                                <Icon
                                name={"lock-closed"}
                                size={17}
                                style={{padding: 5}}
                                color="#364b5b"
                                />
                            </HStack>
                        </TouchableOpacity>
                    );
                })
            }
          </View>
        );
    };

    const CBodyLive = (dat, index) => {
        // console.log('This is dat: ', dat);
        return (
          <View style={{marginTop: 5, marginBottom: 5}}>
            {
                allData.assesmentList.map((data, index) => {
                    return (
                        <TouchableOpacity key={index}
                        onPress={()=> {
                                navigation.navigate('AssessmentsStudentPreview', {assessment: data});
                        }}
                        >
                            <HStack justifyContent={'space-between'} alignItems={'center'} mt={2}>
                                <HStack space={2} alignItems="center">
                                <View>
                                    {data.isCompleted === false && data.isAssesment === false ? (
                                    <Icon name="play" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 20,}} size={15}/>
                                    ) : null}
                                    {data.isCompleted === false && data.isAssesment === true ? (
                                    <Icon name="clipboard" color="#364b5b" style={{ backgroundColor: '#F0E1EB', padding: 5, borderRadius: 20, }} size={15}/>
                                    ) : null}
                                    {data.isCompleted === true ? (
                                    <Image
                                        source={require('../../../assets/CompletedTick.png')}
                                        alt="completed"
                                        size={7}
                                    />
                                    ) : null}
                                </View>
                                <VStack>
                                    <Text color={'#000'} maxWidth={width*0.6} fontSize={14} fontWeight={'bold'}>
                                    {data.assessmentTitle}
                                    </Text>
                                </VStack>
                                </HStack>
                                <Icon
                                name={"lock-closed"}
                                size={17}
                                style={{padding: 5}}
                                color="#364b5b"
                                />
                            </HStack>
                        </TouchableOpacity>
                    );
                })
            }
          </View>
        );
    };

    const OverviewSource = {
        html: `<head>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body{color:black; background-color: yellow}
              </style>
              </head> 
              <body>${allData.courseOverview}</body>`,
    };

    const OverTest = () => {
        return (
          <View width={width*0.85} alignSelf={'center'}>
            <RenderHTML
              contentWidth={width / 3}
              source={OverviewSource}
              baseStyle={{color:"#8C8C8C"}}
            //   renderersProps={renderersProps}
            />
          </View>
        );
    };

    const RevieW = () => {
        return <Review type={data} />
    }

    const Faq = () => {
        return <FAQ type={data} />
    }

    const ClassTime = () => {
        return <ClassTimes type={data} />
    }

    const RenderTabs01 = () => {
        let [index, setIndex] = React.useState(0);
        let [routes] = React.useState([
            {key: 'first', title: 'Overview'},
            {key: 'second', title: 'Review'},
            {key: 'third', title: 'Class Time'},
            {key: 'fourth', title: 'FAQ'},
        ]);
        let renderScene = SceneMap({
            first: OverTest,
            second: RevieW,
            third: ClassTime,
            fourth: Faq,
        });
        
        let renderTabBar = props => {
            return (
                <TabBar
                    {...props}
                    indicatorStyle={{backgroundColor: '#364b5b'}}
                    style={{backgroundColor: '#FFF'}}
                    labelStyle={{color: '#8C8C8C'}}
                    activeColor="#364b5b"
                    scrollEnabled={true}
                    tabStyle={{width: width / 4}}
                />
            );
        };
        return (
            <TabView
            renderTabBar={renderTabBar}
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
                initialLayout={{width: width}}
                swipeEnabled={true}
                pagerStyle={{
                minHeight: height / 2,
                maxHeight: height * 4,
                backgroundColor: '#FFF',
                }}
            />
        );
    };
    
    const RenderTabs02 = () => {
        let [index, setIndex] = React.useState(0);
        let [routes] = React.useState([
            {key: 'first', title: 'Overview'},
            {key: 'second', title: 'Review'},
            {key: 'third', title: 'FAQ'},
        ]);
        let renderScene = SceneMap({
        first: OverTest,
        second: RevieW,
        third: Faq,
        });
    
        let renderTabBar = props => {
            return (
                <TabBar
                    {...props}
                    indicatorStyle={{backgroundColor: '#364b5b'}}
                    style={{backgroundColor: '#FFF'}}
                    labelStyle={{color: '#8C8C8C'}}
                    activeColor="#364b5b"
                    scrollEnabled={true}
                    tabStyle={{width: width / 3.2}}
                />
            );
        };
        return (
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{width: width}}
                swipeEnabled={true}
                pagerStyle={{
                minHeight: height / 2,
                maxHeight: height * 4,
                backgroundColor: '#FFF',
                // color:"#000"
                }}
            />
        );
    };

    const RenderLiveVideos = () => {
        const [isStart, setIsStart] = useState(false) 
        
        return (
            liveClassData.map((data, i) =>{

                const time = Date.parse(data.date) - Date.now();
                const CDsec = Math.floor((time) / 1000);
                const CDSeconds = CDsec

                var date = data.date.split('T')
                var utc = new Date().toJSON().slice(0,10).replace(/-/g,'-');
    
                //Finding the date in 'Tue, Apr 25, 2023, 10:28 AM' format based on time Zone
                const istOptions = { timeZone: 'Asia/Kolkata', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
                const utcDate = new Date(data.date);
                const istDateTime = utcDate.toLocaleString('en-US', istOptions);
                console.log(istDateTime, data)
    
                //Find out the secondes left for the live class
                const remainingTime = Date.parse(data.date) - Date.now();
                const sec = Math.floor((remainingTime) / 1000)
    
                //Find out start time, end time and current time
                let now = new Date()
                const startDate = new Date(data.date)
                const endDate = new Date(data.toDate)
                return (
                    <View key={i}>
                        { date[0] === utc || CDSeconds > 0 ?
                        <>
                        <HStack justifyContent="space-between" alignItems="center">
                        <VStack  space={2} width={width / 1.5}>
                            <Text style={{fontWeight:'bold', color: '#395061'}}>{data.topicName}</Text>
                            <View style={{backgroundColor:'#F0E1EB', marginTop:5, borderRadius:10, alignSelf:'flex-start'}}>
                                <Text style={{fontSize: 11,color: '#395061', paddingLeft:7,paddingRight:7,paddingTop:5,paddingBottom:5}} >{istDateTime}</Text>
                            </View>
                        </VStack>
                        {
                            date[0] === utc  ?
                            <>
                            {
                                now >= startDate && now <endDate ?
                                <TouchableOpacity
                                style={{borderWidth:1,borderColor:'#395061',borderRadius:10}}
                                onPress={() => {
                                    // startClass();
                                }}
                                >
                                <Text style={{fontSize:10, color:"black", paddingLeft:10,paddingRight:10,paddingTop:3,paddingBottom:3}}>
                                    Start Live
                                </Text>
                                </TouchableOpacity>
                                :
                                <>
                                {
                                    isStart ?
                                    <TouchableOpacity
                                    style={{borderWidth:1,borderColor:'#395061',borderRadius:10}}
                                    onPress={() => {
                                        // startClass();
                                    }}
                                    >
                                    <Text style={{fontSize:10, color:"black", paddingLeft:10,paddingRight:10,paddingTop:3,paddingBottom:3}}>
                                        Start Live
                                    </Text>
                                    </TouchableOpacity>
                                    :
                                    <CountDownTimer
                                    containerStyle={styles.count}
                                    timestamp={sec}
                                    timerCallback={() => {
                                        setIsStart(true)
                                    }}
                                    textStyle={{backgroundColor: 'White', color: '#8C8C8C',  fontWeight:"bold", fontSize: 12, borderWidth: 0,  }}
                                    /> 
    
                                }
                                </>
    
                            }
                            </>
                            : 
                            <>
                            { CDSeconds > 0 ?
                                <CountDownTimer
                                containerStyle={styles.count}
                                timestamp={CDSeconds}
                                onFinish={() => {
                                setLStarted(true)
                                }}
                                textStyle={{backgroundColor: 'White', color: '#8C8C8C', fontSize: 12, borderWidth: 0,  }}
                                /> 
                                :
                                // <Text style={{fontSize:12, color:"red", paddingLeft:10,paddingRight:10,paddingTop:3,paddingBottom:3}}>
                                // Date Expired
                                // </Text>
                                null
                            }
                            </>
                        }
                        </HStack>
                        <Divider mx={1} ml={0} mt={3} bg="primary.50"/>
                        </>
                        : null }
                    </View>
                );
            })
        )
    }

    return (
        <View style={{flex:1}}>
            <AppBar props={AppBarContent}/>
            <View style={{flex:1, width:width*0.95, alignSelf:"center"}}>
                {
                    Object.keys(allData).length > 0 ?
                    <ScrollView>
                        <VideoPlayer
                            source={{uri: VideoPath}}
                            style={{maxWidth: width / 1, height: height / 4}}
                            onError={()=>{
                                console.log('Something went wrong...');
                            }}
                            pictureInPicture={true}
                            navigator={navigation}
                            isFullscreen={false}
                            tapAnywhereToPause = {false}
                            onPlay = {() => {}}
                            paused={true}
                        />
                        <Text mt={1} style={{ fontSize: 15, color: '#000000', fontWeight: 'bold', maxWidth: width / 1,}}>{courseData.courseName}</Text>
                        <HStack space={2}>
                            <Text style={{fontSize: 12, fontWeight: 'bold'}} color={'greyScale.800'}>By</Text>
                            <Text style={{fontSize: 13, fontWeight: 'bold'}} color="primary.100">{name}</Text>
                        </HStack>
                        {
                            Object.keys(allData).length > 0 ?
                            <VStack>
                                <Text style={{fontSize: 10, fontWeight: 'bold'}} color={'greyScale.800'}>Fee</Text>
                                <Text style={{fontSize: 16, fontWeight: 'bold'}} color={'#000'}>{allData.currency === 'INR' ? '₹' : '$'} {allData.fee}</Text>
                            </VStack>
                            : null
                        }
                        
                        <VStack bg="white.100" mt={2} mb={3}>
                            <HStack justifyContent={'space-between'} bg={'primary.100'} p={4} borderTopRadius={8}>
                                <Text fontSize={16} color={'secondary.50'}>Course Curriculum</Text>
                                <HStack alignItems={'center'}>
                                    <Icon name="time" size={20} color="#F0E1EB" />
                                    <Text fontSize={14} color={'secondary.50'}>{allData.totalCourseDuration ? new Date(allData.totalCourseDuration*1000).toISOString().substr(11, 8) : '00.00:00'}</Text>
                                </HStack>
                            </HStack>
                            {
                                allData.isLive ?
                                <VStack m={3}>
                                    {Object.keys(allData.assesmentList).length ? (
                                        <Accordion
                                        sections={allData.assesmentList}
                                        activeSections={ActiveSessions}
                                        renderHeader={CHeader}
                                        renderContent={CBodyLive}
                                        onChange={CollapsibleChange}
                                        underlayColor={'#FFF'}
                                        />
                                    ) : <Text color={'greyScale.800'} fontSize={12} alignSelf={'center'}> No Chapter to show yet!</Text>}
                                </VStack>
                                :
                                <VStack m={3}>
                                    {Object.keys(allData.chapterList).length ? (
                                        <Accordion
                                        sections={allData.chapterList}
                                        activeSections={ActiveSessions}
                                        renderHeader={CHeader}
                                        renderContent={CBody}
                                        onChange={CollapsibleChange}
                                        underlayColor={'#FFF'}
                                        />
                                    ) : <Text color={'greyScale.800'} fontSize={12} alignSelf={'center'}> No Chapter to show yet!</Text>}
                                </VStack>
                            }
                        </VStack>

                        <VStack bg="white.100" mt={2} mb={3}>
                            <HStack justifyContent={'space-between'} bg={'primary.100'} p={4} borderTopRadius={8}>
                                <Text fontSize={16} color={'secondary.50'}>Live Videos</Text>
                                <HStack alignItems={'center'}>
                                    <Image source={require('../../../assets/streaming_pink.png')} alt="Stream" size={7} />
                                </HStack>
                            </HStack>
                            <VStack m={3}>
                                {Object.keys(liveClassData).length > 0 ? <RenderLiveVideos /> : <Text color={'greyScale.800'} fontSize={12} alignSelf={'center'}>No Live Videos to show yet!</Text>}
                            </VStack>
                        </VStack>

                        { allData.isLive  ? <RenderTabs01/> : <RenderTabs02/>}

                        {
                            Object.keys(instructor).length > 0 ?
                                <VStack bg={'white.100'} mb={5} mt={5} p={7} space={4}>
                                    {console.log('Instructor data------------------------->', instructorData)}
                                    <HStack maxW={width / 1.3} space={4} alignItems={'center'}>
                                        <Container>
                                        { ProfileD.profileImgPath !== null ?
                                            <Image source={{ uri: ProfileD.profileImgPath }} alt="profile" size={'md'} rounded={20}/>
                                        :   <Image source={require('../../../assets/personIcon.png')} alt="profile" size={'md'} rounded={20}/>
                                        }
                                        </Container>
                                        <VStack space={1}>
                                            <Text color={'#000'} fontSize={16} fontWeight={'bold'}>{name}</Text>
                                            <HStack space={1}>
                                                {
                                                    instructor.hasOwnProperty('rating') ?
                                                    <>
                                                    <AirbnbRating
                                                        count={5}
                                                        isDisabled={true}
                                                        showRating={false}
                                                        defaultRating={`${instructor.rating}`}
                                                        size={15}
                                                        value={`${instructor.rating}`}
                                                    />
                                                        {
                                                            !Number.isInteger(instructor.rating) ?
                                                            <Text style={{fontSize: 14, color: '#364b5b'}}>{instructor.rating.toFixed(1)} ({instructor.ratingCount})</Text>
                                                            :
                                                            <Text style={{fontSize: 14, color: '#364b5b'}}>{instructor.rating} ({instructor.ratingCount})</Text>
                                                        }
                                                    </>
                                                    : 
                                                    <>
                                                    <AirbnbRating
                                                    count={5}
                                                    isDisabled={true}
                                                    showRating={false}
                                                    defaultRating={0}
                                                    size={15}
                                                    value={0}
                                                    />
                                                    <Text style={{fontSize: 14, color: '#364b5b'}}>0 (0)</Text>
                                                    </>
                                                }
                                            </HStack>
                                        </VStack>
                                    </HStack>
                                    <HStack justifyContent={'space-between'} alignItems={'center'}>
                                        <HStack space={2} alignItems={'center'}>
                                        <Image source={require('../../../assets/courses.png')} alt="courses" size={8}/>
                                        <Text color={'#000'} fontSize={14}>Total Courses</Text>
                                        </HStack>
                                        <Text color={'#000'} fontSize={14}>{instructorData !== null ? instructorData.totalCourses : 0}</Text>
                                    </HStack>
                                    <HStack justifyContent={'space-between'} alignItems={'center'}>
                                        <HStack space={3} alignItems={'center'}>
                                        <Image source={require('../../../assets/graduate_student.png')} alt="courses" size={7}/>
                                        <Text color={'#000'} fontSize={14}>Total Learners</Text>
                                        </HStack>
                                        <Text color={'#000'} fontSize={14}>{instructorData !== null ? instructorData.totalLearners : 0}</Text>
                                    </HStack>

                                    <Button mt={2} bg={'secondary.50'} _text={{ color:'#364b5b', fontSize:14, fontWeight:'bold' }} _pressed={{backgroundColor:'#F0E1EB', opacity:'0.5' }} isDisabled={true}>
                                        View Profile
                                    </Button>
                                </VStack>
                            : null
                        }

                    </ScrollView>
                    : null
                }
            </View>
        </View>
    )
}

export default StudentPreview

const styles = StyleSheet.create({})