import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import {HStack, VStack, Text, Icon, Divider, Container} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../../components/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch,useSelector} from 'react-redux';
import { setAssessmentData } from '../../Redux/Features/CourseSlice';

const LiveAssessmentList = ({navigation}) => {

    const AssessmentList = useSelector(state => state.Course.LiveAssessmentList)
    console.log('What is this: ', AssessmentList)

    const dispatch = useDispatch()

    const AppBarContent = {
        title: 'Assessment',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
      }

    const Render = () =>{
        return AssessmentList.map((data, index)=>{
            return(
                <TouchableOpacity 
                    key={index} 
                    style={styles.card}
                    onPress={()=> {
                        dispatch(setAssessmentData(data.assessmentDetails))
                        navigation.navigate('Assessments')
                    }}
                >
                    <HStack justifyContent="space-between" alignItems="center">
                        <Text style={{fontWeight:'bold',maxWidth:250}}>{data.assessmentTitle}</Text>
                        <Container bg='#F0E1EB' p={1} borderRadius={2}>
                        <Icon size="lg" as={Ionicons} name="chevron-forward-outline" color="#000000" />
                        </Container>
                    </HStack>
                </TouchableOpacity>
            )
        })
        // return null
    }

  return (
    <SafeAreaView>
        <AppBar props={AppBarContent}/>
        <ScrollView style={styles.container}>
            <VStack mt={2}>
                {Object.keys(AssessmentList).length > 0 ? <Render/> : <Text style={{fontSize:12, color:'#8C8C8C', alignSelf:"center"}}>No Assessment available for this course!</Text>}
            </VStack>
       </ScrollView>
    </SafeAreaView>
  )
}

export default LiveAssessmentList

const styles = StyleSheet.create({
    container:{
        margin:15
    },
    card:{
        borderRadius: 5,
        backgroundColor: "#F8F8F8",
        // shadowColor: "rgba(0, 0, 0, 0.03)",
        // shadowOffset: {
        //     width: 0,
        //     height: 0.376085489988327
        // },
        // shadowRadius: 21.951963424682617,
        // shadowOpacity: 1,
        marginTop:10,
        padding:12
    }
})