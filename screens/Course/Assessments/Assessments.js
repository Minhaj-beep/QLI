import { StyleSheet, Text, View,ScrollView,Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack,Icon, IconButton,Radio,FormControl } from 'native-base';
import {useDispatch,useSelector} from 'react-redux';

import AppBar from '../../components/Navbar';
import AssessmentRadio from './components/AssessmentRadio';

const { width, height } = Dimensions.get('window')

const Assessments = ({navigation}) => {

  const AssessmentData = useSelector(state => state.Course.AssessmentData);

  const AppBarContent = {
    title: 'Assessment',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  const RenderAssessment = () => {
    return AssessmentData.map((data,index) =>{
      return(
        <View key={index}>
          <AssessmentRadio props={data}/>
        </View>
      )
    })
  }
 

  return (
    <View>
      <AppBar props={AppBarContent}/>
      <ScrollView style={styles.container}>
        <VStack style={{marginBottom:150}}>
          <RenderAssessment/>
        </VStack>
      </ScrollView>
    </View>
  )
}

export default Assessments

const styles = StyleSheet.create({
  container:{
    paddingHorizontal:20
  }
})