import {View, Dimensions, ScrollView, TouchableWithoutFeedback, StyleSheet,TouchableOpacity,Text} from 'react-native';
import {useState,useEffect,React} from 'react';
import {Image,VStack, HStack,Icon,Divider,Button } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useDispatch,useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CountDown from 'react-native-countdown-component';
import { setLiveClassDetails } from '../../../Redux/Features/CourseSlice';
import moment from 'moment';
import { setLiveCourseLiveObject } from '../../../Redux/Features/CourseSlice';

const { width, height } = Dimensions.get('window');

const LVStarted = ({props}) => {

  const dispatch = useDispatch();      

  console.log(props, 'Is it here?')
  const data = props.data

  const [Title, setTitle] = useState();
  const [Date,setDate] = useState();

  useEffect(()=>{
    if(data.liveCaption){
      setTitle(data.liveCaption)
    }else{
      setTitle(data.weekDay+' Class')
    }

    let SDate = data.scheduledDate
    // const Date = SDate.split('-').reverse().join('-')
    const Date = moment(SDate).format('DD-MM-YYYY')
    setDate(Date)
  },[])
    
        //   const USCard = () =>{
        //     return(
        //       <VStack>
        //           <HStack justifyContent="space-between" alignItems="center">
        //                   <VStack  space={1}>
        //                       <Text style={{fontWeight:'bold'}}>{data.topicName}</Text>
        //                       {/* <Text style={{fontSize: 13,color: '#395061',padding:1}} >{SDdate}</Text> */}
                              
        //                   </VStack>
        //                   {/* <Icon size="lg" as={Ionicons} name="chevron-forward-outline" color="#000000"/> */}
        //                   <View style={{backgroundColor:'#F0E1EB',borderRadius:10, alignSelf:'flex-start'}}>
        //                         <Text style={{fontSize: 11,color: '#395061', paddingLeft:7,paddingRight:7,paddingTop:5,paddingBottom:5}} >Completed on {SDdate}</Text>
        //                       </View>
        //           </HStack>
        //           <Divider mx={1} ml={0} mt={4} bg="primary.50"/>
        //       </VStack>
        //     )
        //   }
      

  return (
        <TouchableOpacity
          onPress={()=>{
              dispatch(setLiveCourseLiveObject(props))
              props.navigation.navigate('GTStart')
              dispatch(setLiveClassDetails(data))
            }}
          >
        <HStack justifyContent="space-between" alignItems="center" mt={4}>
            <VStack  space={2}>
                {/* <Text style={{fontWeight:'bold', color:"black", fontSize:12, maxWidth:width/1.5}}>{Title}</Text> */}
                <Text style={{fontWeight:'bold', color:"black", fontSize:12, maxWidth:width/1.5}}>{data.weekDay}: {Date}{', '}{data.startTime}{' to '}{data.endTime}</Text>
                {/* <View style={{backgroundColor:'#F0E1EB',borderRadius:10, alignSelf:'flex-start'}}>                      
                </View> */}
                {/* <Text style={{fontSize:10,color:'#8C8C8C' }}>{Date}{', '}{data.startTime}{' to '}{data.endTime}</Text> */}
                <Text style={{fontSize:10,color:'#8C8C8C' }}>{data.liveCaption}</Text>
            </VStack>
            {/* <TouchableOpacity
            style={{borderWidth:1,borderColor:'#395061',borderRadius:10}}
            //   onPress={() => {
            //     startClass();
            //   }}
            >
            <Text style={{fontSize:9,paddingLeft:10,paddingRight:10,paddingTop:3,paddingBottom:3}}>
                start Live
            </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
                onPress={() => {
                  dispatch(setLiveCourseLiveObject(props))
                  props.navigation.navigate('GTStart')
                  dispatch(setLiveClassDetails(data))
                }}
            >
            <Icon as={Ionicons} name='chevron-forward-outline' color='#000000' size={5}/>
            </TouchableOpacity>
      </HStack>
      <Divider mt={2}/>
      </TouchableOpacity>
  )
}

export default LVStarted

const styles = StyleSheet.create({})