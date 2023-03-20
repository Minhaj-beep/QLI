import { StyleSheet, View,Dimensions,ScrollView,TouchableOpacity } from 'react-native';
import React,{useState,useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {VStack,Text,HStack,Icon,Image,Container,IconButton} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Demo from '../DemoClass/components/Demo';

const { width, height } = Dimensions.get('window')

const DemoCard = () => {
  const navigation = useNavigation()
  return (
    <View style={{flex:1}}>
        <Demo navigation={navigation} />
    </View>
  )
}

export default DemoCard

const styles = StyleSheet.create({
  DemoCard:{
    // maxWidth:width/1.5,
    width:width/1.1,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "rgba(0, 0, 0, 0.03)",
    shadowOffset: {
      width: 0,
      height: 0.376085489988327
    },
    shadowRadius: 21.951963424682617,
    shadowOpacity: 1,
  },
  CardContent:{
    maxWidth: width/1.5
  }
})