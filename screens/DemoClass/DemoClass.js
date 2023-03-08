import React, {useEffect, useState} from "react"
import AppBar from "../components/Navbar"
import { StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {HStack, VStack, Image, Center, View, Text, Icon } from 'native-base';
import {useDispatch,useSelector} from 'react-redux';
import Fontisto from 'react-native-vector-icons/Fontisto';
const { width, height } = Dimensions.get('window')

const DemoClass = ({navigation}) => {
    const AppBarContent = {
        title: 'Demo Class',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
    }

    return (
        <View>
            <AppBar props={AppBarContent} />
            <TouchableOpacity onPress={()=>navigation.navigate('ViewDemoClass')} style={styles.CourseCard}>
                <HStack>
                    <Center>
                        <Image 
                        style={styles.cardImg}
                        source={require('../../assets/course_cdetails.png')}
                        // source={{uri: 'https://www.google.com/search?q=redmine&rlz=1C1VDKB_enIN1037IN1037&sxsrf=AJOqlzWqYG9yfIxqDVLHZiiNVZbekTy_Kw:1678087297726&source=lnms&tbm=isch&sa=X&ved=2ahUKEwiIuqGq4sb9AhUU2TgGHW78BCUQ_AUoAXoECAEQAw&biw=1366&bih=625&dpr=1#imgrc=zuU0MnXMoS4vNM'}}
                        alt='course img'
                        resizeMode='cover'
                        />
                    </Center>
                    <VStack style={styles.CardContent}>
                        <HStack justifyContent='space-between' alignItems='center' space={2}>
                            <Text style={{fontSize:14, fontWeight: 'bold',color: '#000000', maxWidth: width/2.5}}>
                                {'courseTitle'}
                            </Text>
                        </HStack>
                        <Text style={{fontSize:12, fontWeight: 'bold', color: '#FFBE40'}}>{'currencyType'} {'data.fee'}</Text>
                        <HStack space={2} mt="2">
                            <HStack alignItems={'center'} space={1}>
                                    <Image
                                        alt="graduate icon"
                                        source={require('../../assets/graduate_student.png')}
                                        size="3"
                                    />
                                    <Text style={{fontSize: 10, color: '#000000', marginRight:5}}>1003 Learners</Text>
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
        </View>
    )
}

export default DemoClass

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