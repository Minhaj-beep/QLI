import { View, Text, StyleSheet,Dimensions,TouchableOpacity} from 'react-native';
import React,{useState,useEffect} from 'react';
import {HStack, VStack, Image,Center} from 'native-base';
import {useDispatch,useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import { AirbnbRating } from 'react-native-ratings';

const { width, height } = Dimensions.get('window')

const LcCard = ({props}) => {
  const navigation = props.navigation;
  const data = props.data;
  console.log('=======<', data)
  // console.log(data.toTime)
  var cName = data.courseName;
  var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
  let fromDate = new Date(data.fromTime)
  let toDate = new Date(data.toTime)
  console.log(`{
    What is this: ${fromDate}
    What is this: ${data.fromTime}
  }`)
  

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
          {
            data.isExpired ?
            <HStack bg={'rgba(41,211,99, 0.2)'} alignItems={'center'} paddingX={1} borderRadius={3}>
              <Icon size={13} name="checkcircle" color="#29d363" />
              <Text style={{fontSize:9,color: '#29d363', fontWeight:"bold", padding:5, borderRadius:3}}>Completed</Text>
            </HStack>
            :
            <>
              { data.courseStatus === 'INREVIEW' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ffc107',padding:5, borderRadius:3}}>In Review</Text> : null }
              { data.courseStatus === 'REJECTED' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ff0000',padding:5, borderRadius:3}}>Rejected</Text> : null }
              { data.courseStatus === 'ACTIVE' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#29d363',padding:5, borderRadius:3}}>Active</Text> : null }
              { data.courseStatus === 'BANNED' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ff0000',padding:3, borderRadius:3, marginBottom:10}}>Rejected</Text> : null } 
            </>
          }
          {/* { data.liveCourseStatus === 'DELETED' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ff0000',padding:3, borderRadius:3, marginBottom:10}}>Deleted</Text> : null } */}
         </HStack>
         {console.log(`{
          ${data.courseStatus}
         }`)}

          <HStack space={3} alignItems="center"> 
            <Text style={{fontSize:12, fontWeight: 'bold',color: '#000000'}}>{currencyType} {data.fee}</Text>
            {/* <Text style={{fontSize:9, fontWeight: 'bold',color: '#fcbc40'}}>502 Learners Requested For Demo Class</Text> */}
            <HStack space={1}> 
                  <Image
                  alt="graduate icon"
                  source={require('../../assets/graduate_student.png')}
                  size="3" 
                  />
                  <Text style={{fontSize: 10,color:"#091B12",fontWeight: 'bold'}}>
                      {data.learnersCount} Learners
                  </Text>
            </HStack>
          </HStack>

          <HStack justifyContent={'space-between'} alignItems={'center'}>
              <HStack space={2} mt="2">
                {
                    data.hasOwnProperty('rating') ?
                    <>
                    <AirbnbRating
                        count={5}
                        isDisabled={true}
                        showRating={false}
                        defaultRating={`${data.rating}`}
                        size={10}
                        value={`${data.rating}`}
                    />
                        {
                            !Number.isInteger(data.rating) ?
                            <Text style={{fontSize: 11,color: '#000000',fontWeight: '900'}}>{data.rating.toFixed(1)} ({data.ratingCount})</Text>
                            :
                            <Text style={{fontSize: 11,color: '#000000',fontWeight: '900'}}>{data.rating} ({data.ratingCount})</Text>
                        }
                    </>
                    : 
                    <>
                    <AirbnbRating
                    count={5}
                    isDisabled={true}
                    showRating={false}
                    defaultRating={0}
                    size={10}
                    value={0}
                    />
                    <Text style={{fontSize: 11, color: '#000000',fontWeight: '900'}}>0 (0)</Text>
                    </>
                }
              </HStack>
              {
                data.isDemo ?
                  <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'grey',padding:5, borderRadius:3}}>Demo enabled</Text>
                : null
              }
            </HStack>

          <HStack justifyContent={'space-between'} alignItems={'center'}>
            <HStack space={2} mt="2">
              <Text style={{fontSize: 10,color: '#091B12',fontWeight: 'bold'}}> {fromTime} To {toTime} ({data.courseDuration})</Text>
              {/* <Text style={{fontSize: 10,color: '#091B12',fontWeight: 'bold'}}> {fromDate.toDateString()} To {toDate.toLocaleDateString("en-US", options)} ({data.courseDuration})</Text> */}
                {/* {data.liveCourseStatus != 'INREVIEW' ?  */}
                
            </HStack>
              {/* {
                data.isDemo ?
                <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'grey',padding:5, borderRadius:3}}>Demo enabled</Text>
                : null
              } */}
          </HStack>
          
        </VStack>
      </HStack>
      </View>
    )
     }
export default LcCard

const styles = StyleSheet.create({
  CourseCard: {
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
    height:height/11,
    width: width/5,
    borderRadius: 5,
  },
  CardContent:{
    minWidth:width/1.7
  }
})