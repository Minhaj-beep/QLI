import { StyleSheet, View,Dimensions,ScrollView,TouchableOpacity } from 'react-native';
import React,{useState,useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {VStack,Text,HStack,Icon,Image,Container,IconButton} from 'native-base';
// import AppBar from '../components/AppBar';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window')

const DemoCard = () => {
  return (
    <View>
       <VStack style={styles.DemoCard} space={2}>
            <HStack alignItems='center' space={2} p={2}>
              <Image
                source={require('../../assets/course_cdetails.png')}
                alt='image'
                resizeMode='cover'
                borderRadius={6}
                size='sm'
              />

              <VStack style={styles.CardContent}>
                <Text style={{fontSize: 15,color:"#000000",fontWeight: 'bold'}}>Foundation of UI/UX</Text>
                <Text style={{fontSize: 11,color:"#FFBE40",fontWeight: '900'}}>45 slots Booked</Text>
                
                <HStack space={2}>
                  <HStack space={1} alignItems='center'> 
                    <Image
                    alt="graduate icon"
                    source={require('../../assets/graduate_student.png')}
                    size="3" 
                    />
                    <Text style={{fontSize: 11,color:"#000000",fontWeight: '900'}}>
                        8 Learners
                    </Text>
                  </HStack>

                  <HStack space={1} alignItems='center'> 
                  <Icon as={Ionicons} name='time-outline' />
                    <Text style={{fontSize: 11,color:"#000000",fontWeight: '900'}}>
                    Friday  12:00 AM
                    </Text>
                  </HStack>
                </HStack>

              </VStack>
            </HStack>
              {/* <VStack alignItems="center" style={{backgroundColor:'#395061',borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                <Text style={{fontSize: 13,color:"#FFFFFF",fontWeight:'bold'}} pt={2} pb={2}>
                  View
                </Text>
              </VStack> */}
          </VStack>
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