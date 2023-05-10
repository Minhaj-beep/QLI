import { View, Text, StyleSheet,Dimensions,TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import {HStack, VStack, Image,Center} from 'native-base';
import {useDispatch,useSelector} from 'react-redux';

const { width, height } = Dimensions.get('window')
const RcCard = ({props}) => {
  const [courseTitle, setCourseTitle] = useState()
  const [currencyType, setCurrencyType] = useState()
  const navigation = props.navigation;
  const data = props.data;
  var cName = data.courseName
  console.log('................', props)

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
        <HStack style={styles.CourseCard} space={4}>
        <Center>
          <Image 
            style={styles.cardImg}
            
            source={{uri: data.thumbNailImagePath}}
            alt='courseimg'
            resizeMode='cover'
          />
        </Center>
        <VStack style={styles.CardContent}>
          <HStack justifyContent='space-between' alignItems='center' space={2}>
            <Text style={{fontSize:14, fontWeight: 'bold',color: '#000000', maxWidth: width/2.5}}>
              {courseTitle}
              {/* {setSColor('#29d363')
         setBgColor('#d2f4de')} */}
            </Text>
            { data.courseStatus === 'INREVIEW' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ffc107',padding:5, borderRadius:3}}>In Review</Text> : null }
            { data.courseStatus === 'REJECTED' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ff0000',padding:5, borderRadius:3}}>Rejected</Text> : null }
            { data.courseStatus === 'ACTIVE' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#29d363',padding:5, borderRadius:3}}>Active</Text> : null }
            { data.courseStatus === 'BANNED' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ff0000',padding:3, borderRadius:3, marginBottom:10}}>Rejected</Text> : null } 
            {/* { data.courseStatus === 'BANNED' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ff0000',padding:5, borderRadius:3}}>Banned</Text> : null }
            { data.courseStatus === 'DELETED' ? <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'#ff0000',padding:5, borderRadius:3}}>Deleted</Text> : null } */}
          </HStack>
          <HStack space={3} alignItems="center">
            <Text style={{fontSize:12, fontWeight: 'bold',color: '#000000'}}>{currencyType} {data.fee}</Text>
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
                  <HStack space={1}>
                      <Image
                          source={require('../../assets/unstar.png')}
                          alt="rating"
                          size="3"
                      />
                        <Image
                          source={require('../../assets/unstar.png')}
                          alt="rating"
                          size="3"
                      />
                        <Image
                          source={require('../../assets/unstar.png')}
                          alt="rating"
                          size="3"
                      />
                        <Image
                          source={require('../../assets/unstar.png')}
                          alt="rating"
                          size="3"
                      />
                        <Image
                          source={require('../../assets/unstar.png')}
                          alt="rating"
                          size="3"
                      />
                  </HStack>

                  <Text style={{fontSize: 10,color: '#000000',fontWeight: '900'}}>
                    ({data.rating}/{data.ratingCount})
                  </Text>

                  {/* {data.courseStatus === 'ACTIVE' ? <HStack space={1}> 
                      <Image
                      alt="graduate icon"
                      source={require('../../assets/graduate_student.png')}
                      size="3" 
                      />
                      <Text style={{fontSize: 10,color:"#000000",fontWeight: '900'}}>
                          7 Learners
                      </Text>
                </HStack>:null} */}
              </HStack>
              {
                data.isDemo ?
                  <Text style={{fontSize:9,color: '#FFFFFF',backgroundColor:'grey',padding:5, borderRadius:3}}>Demo enabled</Text>
                : null
              }
            </HStack>
        </VStack>
      </HStack>
      </View>
    )
     }
export default RcCard

const styles = StyleSheet.create({
  CourseCard: {
    maxHeight: height/8.5,
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