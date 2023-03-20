import React, {useEffect, useState} from "react"
import { StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {HStack, VStack, Image, Center, View, Text, Icon, ScrollView } from 'native-base';
import {useDispatch,useSelector} from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
const { width, height } = Dimensions.get('window')
import { GetDemoEnabledCourses } from "../../Functions/API/GetDemoEnabledCourses";
import { setCurrentDemoClassCourseCode, setCurrentDemoClassObject } from "../../Redux/Features/CourseSlice";

const Demo = ({navigation}) => {
    const dispatch = useDispatch()
    const [allData, setAllData] = useState([])
    const email = useSelector(state => state.Login.email);

    useEffect(()=>{
        getDemoEnabledCourses()
    },[])

    const getDemoEnabledCourses = async () => {
        try {
            const result = await GetDemoEnabledCourses(email)
            if(result.status === 200) {
                setAllData(result.data)
            } else {
                console.log('getDemoEnabledCourses error1 :', result)
            }
        } catch (e) {
            console.log('getDemoEnabledCourses error2 :', e)
        }
    }

    const handlePress = (obj) => {
        dispatch(setCurrentDemoClassObject(obj))
        dispatch(setCurrentDemoClassCourseCode(obj.courseCode))
        navigation.navigate('ViewDemoClass')
    }

    const RenderCard = () => {
        return (
            allData.map((data, index)=>{
                return (
                    <TouchableOpacity key={index} onPress={()=>handlePress(data)} style={styles.CourseCard}>
                        <HStack>
                            <Center>
                                <Image 
                                style={styles.cardImg}
                                // source={require('../../assets/course_cdetails.png')}
                                source={{uri: data.thumbNailImagePath}}
                                alt='course img'
                                resizeMode='cover'
                                />
                            </Center>
                            <VStack style={styles.CardContent}>
                                <HStack justifyContent='space-between' alignItems='center' space={2}>
                                    <Text noOfLines={2} style={{fontSize:14, fontWeight: 'bold',color: '#000000', maxWidth: width*0.6}}>
                                        {data.courseName}
                                    </Text>
                                </HStack>
                                <Text style={{fontSize:12, fontWeight: 'bold', color: '#FFBE40'}}>{'₹'} {data.fee}</Text>
                                <HStack space={2} mt="2">
                                    <HStack alignItems={'center'} space={1}>
                                            <Image
                                                alt="graduate icon"
                                                source={require('../../../assets/graduate_student.png')}
                                                size="3"
                                            />
                                            <Text style={{fontSize: 10, color: '#000000', marginRight:5}}>{data.learnersCount} Learners</Text>
                                            <Icon as={<Fontisto name="clock"/>} color={'#8C8C8C'} size={3}/>
                                            <Text style={{fontSize: 10, color: '#000000'}}>Friday 12.00 AM</Text>
                                    </HStack>
                                </HStack>
                            </VStack>
                        </HStack>
                        <View style={{width:'105%', marginTop:10, alignSelf:"center", backgroundColor:"#395061", borderBottomRightRadius:10, borderBottomLeftRadius:10}}>
                            <Text style={{alignSelf:"center", padding:10, color:"#F0E1EB"}}>View</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        )
    }

    return (
        <View style={{flex:1}}>
            <ScrollView contentContainerStyle={{bottom:10}}>
            {
                Object.keys(allData).length > 0 ?
                    <>
                        <RenderCard />
                    </>
                : null
            }
            </ScrollView>
        </View>
    )
}

export default Demo

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
  }
})