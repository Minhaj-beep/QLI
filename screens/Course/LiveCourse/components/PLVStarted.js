import {View, Dimensions, ScrollView, TouchableWithoutFeedback, StyleSheet,TouchableOpacity,Text} from 'react-native';
import {useState,useEffect,React} from 'react';
import {Image,VStack, HStack,Icon,Divider,Button } from 'native-base';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

const PLVStarted = ({props}) => {

  console.log(props)
  const status = props.liveClassStatus
  const liveClassStartedTime = props.liveClassStartedTime
  const liveClassEndedTime = props.liveClassEndedTime

  const [Duration,setDuration] = useState();
  const [SDate, setDate] = useState();

  useEffect(()=>{
    let startTime = moment(liveClassStartedTime, "HH:mm");
    let endTime = moment(liveClassEndedTime, "HH:mm");
    let duration = moment.duration(endTime.diff(startTime));
    let hours = parseInt(duration.asHours());
    let minutes = parseInt(duration.asMinutes()) - hours * 60;
    let result = hours + ' hour and ' + minutes + ' minutes.';
    
    let SDate = props.scheduledDate
    let SD = SDate.slice(0,10)
    let SD0 = SD.split('-')
    let SD1 = SD0.reverse().join('-')
    setDate(SD1)
    setDuration(result)
  },[])

  return (
   <View>
    { status != 'INPROGRESS' ? 
   
    <VStack>
      <HStack justifyContent="space-between" alignItems="center" mt={4}>
        <VStack  space={2}>
            <Text style={{fontWeight:'bold', fontSize:12, maxWidth:width/1.5}}>{props.liveCaption}</Text>
            <Text style={{fontSize:10,color:'#8C8C8C' }}>{Duration}</Text>
            <Text style={{fontSize:10,color:'#8C8C8C' }}>{SDate}{', '}{props.startTime}{' to '}{props.endTime}</Text>
            {/* <View style={{backgroundColor:'#F0E1EB',borderRadius:10, alignSelf:'flex-start'}}>
          
            
            <Text style={{fontSize: 9,color: '#395061', paddingLeft:7,paddingRight:7,paddingTop:5,paddingBottom:5}} >Scheduled</Text>
            </View> */}
        </VStack>
        
          {/* <CountDown
            style={styles.count}
            until={CDSeconds}
            // until={10}
            size={10}
            onFinish={() => {
              setLStarted(true)
            }}
            digitStyle={{backgroundColor: 'White', borderWidth: 0, width: 20, height: 20}}
            digitTxtStyle={{color: '#8C8C8C', fontSize: 12}}
            timeToShow={['D','H','M']}
            // timeLabels={{d:'D',h:'H',m:'M',s:'S'}}
            timeLabels={{d:null,h:null,m:null,s:null}}
            timeLabelStyle={{color:'#8C8C8C', fontSize:11}}
            showSeparator
            />  */}
            {/* <Text>D : H : M : S</Text> */}
        </HStack>
        <Divider mt={2}/>
      </VStack> : null}
   </View>
  )
}

export default PLVStarted

const styles = StyleSheet.create({})