import { StyleSheet, Text, View,TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import {VStack,HStack,Divider,Icon,IconButton,Link } from 'native-base';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import {useDispatch,useSelector} from 'react-redux';
import { setLData } from '../../Redux/Features/userDataSlice';
import { useEffect,useState } from 'react';
import { setAssessmentData } from '../../Redux/Features/CourseSlice';

const { width, height } = Dimensions.get('window')

const LCard = ({props}) => {

    const dispatch = useDispatch();

    // console.log(props.data)
    const navigation = props.navigation
    const data = props.data
    console.log(data)
    const [isAssesment, setIsAssesment] = useState();
    const [isAssessmentPage, setIsAssessmentPage] = useState();

    const LessonData = useSelector(state => state.UserData.LessonData);
    const Assessment = useSelector(state => state.Course.Assessment);

    useEffect(() =>{
        // if(data.isAssesment === true){
        //     setIsAssesment(true)
        //     setDetailsView('Assessments')
        // }else{
        //     setIsAssesment(false)
        //     setDetailsView('LessonDetails')
        // }

        if(Assessment === true){
            setIsAssessmentPage(true)
        }else{
            setIsAssessmentPage(false)
        }
        
        if(data.isAssesment === true){
            setIsAssesment(true)
        }else{
            setIsAssesment(false)
        }

    },[])

    const LessonRender = () =>{
        return (
            <View>
                {isAssesment != true && 
                <TouchableOpacity 
                onPress={() => {
                    const LData = {
                        ChapOrder: LessonData.order,
                        courseCode: LessonData.courseCode,
                        LessonOrder: data.lessonOrder,
                        ResourceDetails: data.resourceDetails,
                    }
                    dispatch(setLData(LData))
                    navigation.navigate('LessonDetails')
                    }}
                >
                    <VStack mt={3}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <HStack  space={3} justifyContent="center" alignItems="center">
                            <IconButton 
                            icon={<Icon as={Ionicons} name="play"/>} 
                            borderRadius='full'
                            bg='#F0E1EB'
                            alignItems='center' 
                            _icon={{color: "#395061",}}
                            />
                            {/* <IconButton 
                                icon={<Icon as={Ionicons} name="clipboard"/>} 
                                borderRadius='full'
                                bg='#F0E1EB' 
                                _icon={{color: "#395061",size: "lg"}}
                            /> */}
                                <Text style={{fontWeight:'bold', color:"#364b5b", maxWidth:width/1.5}}>{data.lessonName}</Text>
                            </HStack>
                            <Ionicons  as={Ionicons} name="chevron-forward-outline" color="#000000"/>
                        </HStack>
                    </VStack>
                </TouchableOpacity>}
            </View>
        )
    }

    const AssessmentRender = () =>{
        return (
            <View>
               { isAssesment && 
               <TouchableOpacity 
                onPress={() => {
                    // const LData = {
                    //     ChapOrder: LessonData.order,
                    //     courseCode: LessonData.courseCode,
                    //     LessonOrder: data.lessonOrder,
                    //     ResourceDetails: data.resourceDetails,
                    // }
                    // dispatch(setLData(LData))
                    dispatch(setAssessmentData(data.assessmentDetails))
                    navigation.navigate('Assessments')
                    }}
                >
                    <VStack mt={3}>
                        <HStack justifyContent="space-between" alignItems="center">
                            <HStack  space={3} justifyContent="center" alignItems="center">
                            {/* <IconButton 
                            icon={<Icon as={Ionicons} name="play"/>} 
                            borderRadius='full'
                            bg='#F0E1EB'
                            alignItems='center' 
                            _icon={{color: "#395061",size: "lg"}}
                            /> */}
                            <IconButton 
                                icon={<Icon as={Ionicons} name="clipboard"/>} 
                                borderRadius='full'
                                bg='#F0E1EB' 
                                _icon={{color: "#395061",}}
                            />
                                <Text style={{fontWeight:'bold', color:"#364b5b", maxWidth:width/1.5}}>{data.lessonName}</Text>
                            </HStack>
                            <Icon  as={Ionicons} name="chevron-forward-outline" color="#000000"/>
                        </HStack>
                    </VStack>
                </TouchableOpacity>
                }
            </View>
        )
    }

  return (
    <View>
       { isAssessmentPage === true ? <AssessmentRender/> : <LessonRender/>}
    </View>
  )
}

export default LCard

const styles = StyleSheet.create({})