import { View, Text, StyleSheet,Dimensions,TouchableOpacity} from 'react-native';
import React,{useState,useEffect} from 'react';
import {HStack, VStack, Image,Center} from 'native-base';
import {useDispatch,useSelector} from 'react-redux';

const { width, height } = Dimensions.get('window')

const LcCard = ({props}) => {
  const navigation = props.navigation;
  const data = props.data;
  // console.log(data)
  // console.log(data.toTime)
  var cName = data.courseName;
  

  const [courseTitle, setCourseTitle] = useState()
  const [currencyType, setCurrencyType] = useState()

  const fTime = data.fromTime
  const fromTime = fTime.slice(0,10)

  const TTime = data.toTime
  const toTime = TTime.slice(0,10)

  const courseT = cName.slice(0,25)
  useEffect(() => {
    if(cName.length > 25){
      setCourseTitle(courseT + '...')
    }else {
      setCourseTitle(cName)
    }
  
    if(data.currency === 'USD'){
      setCurrencyType('$')
    }else{
      setCurrencyType('₹')
  
    }
  },[])
  
    return (
      <View>
      <HStack style={styles.CourseCard} space={2}>
        <Center>
          <Image 
            style={styles.cardImg}
            // source={require('../assets/coursecard.png')} 
            source={{uri: data.thumbNailImagePath}}
            alt='courseimg'
            resizeMode='cover'
          />
        </Center>
        <VStack style={styles.CardContent}>
         <HStack justifyContent='space-between' alignItems='center' space={2}>
         <Text style={{fontSize:14, fontWeight: 'bold',color: '#000000', maxWidth: width/2.5}}>
          {/* {data.courseTitle} */}
          {courseTitle}
          </Text>
          { data.liveCourseStatus === 'INREVIEW' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ffc107',padding:3, borderRadius:3, marginBottom:10}}>In Review</Text> : null }
          { data.liveCourseStatus === 'REJECTED' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ff0000',padding:3, borderRadius:3, marginBottom:10}}>Rejected</Text> : null }
          {/* { data.liveCourseStatus === 'BANNED' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ff0000',padding:3, borderRadius:3, marginBottom:10}}>Banned</Text> : null }
          { data.liveCourseStatus === 'DELETED' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ff0000',padding:3, borderRadius:3, marginBottom:10}}>Deleted</Text> : null } */}
         </HStack>

          <HStack space={4} alignItems="center"> 
          <Text style={{fontSize:12, fontWeight: 'bold',color: '#000000'}}>{currencyType} {data.fee}</Text>
          <Text style={{fontSize:9, fontWeight: 'bold',color: '#fcbc40'}}>502 Learners Requested For Demo Class</Text>
          </HStack>

          <HStack space={2} mt="2">
            <Text style={{fontSize: 10,color: '#091B12',fontWeight: 'bold'}}> {fromTime} To {toTime}</Text>
            {/* {data.liveCourseStatus != 'INREVIEW' ? 
            <HStack space={1}> 
                <Image
                alt="graduate icon"
                source={require('../assets/graduate_student.png')}
                size="3" 
                />
                <Text style={{fontSize: 10,color:"#091B12",fontWeight: 'bold'}}>
                    7 Learners
                </Text>
          </HStack> : null} */}
        </HStack>
        </VStack>
      </HStack>
      </View>
    )
     }
export default LcCard

const styles = StyleSheet.create({
  CourseCard: {
    height: height/8.5,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "rgba(0, 0, 0, 0.03)",
    shadowOffset: {
      width: 0,
      height: 0.376085489988327
    },
    shadowRadius: 22,
    shadowOpacity: 1,
    padding:10,
  },
  cardImg: {
    height:height/11.5,
    width: width/5,
    borderRadius: 5,
  },
  CardContent:{
    maxWidth: width/1.5
  }
})