import { StyleSheet, View,Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView,VStack, Image,HStack,IconButton,Icon,Link,Text } from 'native-base';
import AppBar from '../components/Navbar';
import ResoucreFile from './Lessons/ResoucreFile';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import {useDispatch,useSelector} from 'react-redux';
import { useEffect,useState } from 'react';


const { width, height } = Dimensions.get('window')


const LessonDetails = ({navigation}) => {

    const LData = useSelector(state => state.UserData.LData);
    const email = useSelector(state => state.Login.email);
    const SingleCD = useSelector(state => state.UserData.SingleCD);
    const ResourceList = LData.ResourceDetails 
    console.log(ResourceList);
    const BaseURL = useSelector(state => state.UserData.BaseURL)

    const [LDData, setLDData] = useState();

    useEffect(() => {
        if(LData.courseCode != ''){
            const API = BaseURL+'getLessonbyLessonOrder?courseCode='+LData.courseCode+'&chapterOrder='+LData.ChapOrder+'&lessonOrder='+LData.LessonOrder;
            const requestOptions ={
                method:'GET',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'gmailUserType':'INSTRUCTOR',
                    'token':email
                  },
            }
            console.log(requestOptions)
            fetch(API, requestOptions)
            .then(response => response.json())
            .then(result => {
                if(result.status === 200){
                    // console.log(result.data)
                    setLDData(result.data)
                }else if(result.status > 200){
                    console.log(result)
                    alert(result.message)
                }
            }).catch(error =>{
                console.log(error)
                alert('Error: ' + error)
            })
        }
    },[])

    
    const AppBarContent = {
        title: 'Lessons',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
      }

        const LItem = () => { 
            return ResourceList.map((data, index) =>{
                const RData = {
                    data:data,
                    navigation: navigation,
                }
                return (
                    <View key={index}>
                        <ResoucreFile props={RData}/>
                    </View>
                )
            })
         }


  return (
    <View  style={styles.TopContainer}>
    <ScrollView>
        <SafeAreaView>
            <AppBar props={AppBarContent}/>
                <VStack mt={5}>
                {/* { LDData && <Video 
                // source={{uri:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}}
                source={{uri:LDData.lesson.lessonVideoPath}}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                isLooping
                style={{ width: 360, height: 220, alignSelf: 'center',borderRadius: 10 }}
                useNativeControls
                />} */}
                {
                    LDData && <VideoPlayer
                    source={{uri: LDData.lesson.lessonVideoPath}}
                    style={{ width: 360, height: 220, alignSelf: 'center',borderRadius: 10 }}
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
                }

                    <VStack justifyContent='center' space={2} ml={4} mt={6}>
                        <Text style={{fontSize: 12,color: '#8C8C8C',fontWeight: 'bold',maxWidth:width/1.5}}>{LDData && SingleCD.courseName}</Text>
                        <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold',maxWidth:width/1.5}}>{LDData && LDData.lesson.lessonName}</Text>
                    </VStack>
                    <VStack space={3}>
                        {LData && <LItem/>}
                    </VStack>
                </VStack>
        </SafeAreaView>
    </ScrollView>
    </View>
  )
}

export default LessonDetails

const styles = StyleSheet.create({
    TopContainer:{
        flex: 1,
        top: 0,
        backgroundColor:'#f5f5f5',
        height:height,
        width:width,
    },
})