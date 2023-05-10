import {View, Dimensions, ScrollView, TouchableWithoutFeedback, StyleSheet,TouchableOpacity} from 'react-native';
import {useState,useEffect,React} from 'react';
import {Button,VStack,useToast,Text } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import LVideoCard from './components/LVideoCard';

const { width, height } = Dimensions.get('window')

const LiveVideos = ({navigation}) => {

    const CourseCode = useSelector(state => state.UserData.SingleCD.courseCode);
    const email = useSelector(state => state.Login.email);
    const BaseURL = useSelector(state => state.UserData.BaseURL)

    const [LCData, setLCData] = useState();
    
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            getLiveClass(CourseCode)
        });
        return unsubscribe;
    },[navigation])

    const getLiveClass = (code) =>{
        const API = BaseURL+'getAllLiveClassByCourseCode?courseCode='+CourseCode;
        if( code === '' ){
            // toast.show({
            //     title: "Something went wrong!",
            //     placement: "Please try logging in again"
            //   })
            alert('Something went wrong, please try login again')
        }else{
            const requestOptions ={
                method:'GET',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'gmailUserType':'INSTRUCTOR',
                    'token':email
                  },
            }

            fetch(API, requestOptions)
                .then(res => res.json())
                .then(result =>{
                    if(result.status === 200){
                        // console.log(result.data[0])
                        let LClass= result.data[0].liveClassList
                        if(LClass.length > 0) {
                            setLCData(result.data[0].liveClassList)
                        }
                    }else if(result.status > 200){
                        alert(result.message)
                        console.log(result)
                    }
                }).catch(error =>{
                    console.log(error)
                    alert('Error: ' + error);
                  })
        }
    };
  
    const AppBarContent = {
        title: 'Live Videos',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
      }

    const LVItem = () =>{
        return LCData.map((data, index) => {
            const LCD = {
                data:data,
                navigation:navigation,
            }
            // console.log(LCD)
            return(
                <View key={index} style={styles.Container}>
                    <LVideoCard props={LCD}/>
                </View>
            )
        })
    };
    
  return (
    <View style={styles.TopContainer}>
        <ScrollView>
            <SafeAreaView>
                <AppBar props={AppBarContent}/>
                <VStack justifyContent="center" space={20}>
                    <VStack style={{marginTop:25}}>
                    {LCData ? LVItem() : <Text color={'greyScale.800'} alignSelf={'center'} fontSize={12}>You don't have any Live Videos</Text>}
                    
                    </VStack>
                </VStack>
            </SafeAreaView>
        </ScrollView>
    </View>
  )
}

export default LiveVideos

const styles = StyleSheet.create({
    Container:{
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:20
        
    },
    TopContainer:{
        flex: 1,
        top: 0,
        backgroundColor:'#f5f5f5',
        height:height,
        width:width,
    }
})