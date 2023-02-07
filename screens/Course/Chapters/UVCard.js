import { StyleSheet, Text, View,TouchableOpacity,Dimensions } from 'react-native';
import React, { useState } from 'react';
import {VStack,HStack,Divider,Icon, IconButton} from 'native-base';
import { Ionicons } from 'react-native-vector-icons/Ionicons';
import {useDispatch,useSelector} from 'react-redux';
import { setLessonData } from '../../Redux/Features/userDataSlice';

const { width, height } = Dimensions.get('window')

const UVCard = ({props}) => {
    // console.log(props.data)
    const dispatch = useDispatch();


    const navigation = props.navigation;
    const email = useSelector(state => state.Login.email);
    const SingleCD = useSelector(state => state.UserData.SingleCD);
    const courseCode = SingleCD.courseCode;
    const data = props.data;
    const order = data.chapterOrder;
    const tData =data.updatedTime;
    const time = tData.slice(11,19);
    const Assessment = useSelector(state => state.Course.Assessment);
    console.log(data.chapterName)

//  const SaveLData = () => {

//  }

  return (
    <TouchableOpacity 
    onPress={() => {
        navigation.navigate('Lessons')
        const LData ={
            courseCode: courseCode,
            order: order,
            lessonList: data.lessonList,
            ChapterName:data.chapterName
        }
        dispatch(setLessonData(LData))
    }}
    >
        <VStack mt={3}>

            <HStack justifyContent="space-between" alignItems="center">
          
                <VStack  space={1}>
                    <Text style={{fontWeight:'bold', color:"#364b5b", maxWidth:width/1.5}}>{data.chapterName}</Text>
                   {/* {Assessment != true && <Text style={{fontSize: 13,color: '#8C8C8C'}} >{time}</Text>} */}
                </VStack>
                <Icon size="lg" as={Ionicons} name="chevron-forward-outline" color="#000000"/>
        </HStack>
            <Divider mx={1} ml={0} mt={4} bg="primary.50"/>
        </VStack>
    </TouchableOpacity>
  
  )
}

export default UVCard

const styles = StyleSheet.create({})
