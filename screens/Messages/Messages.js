import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react"
import { View, Text, Input, Icon, ScrollView } from "native-base"
import AppBar from '../components/Navbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MessageCard from './MessageCard';
import GetAllMessagesFromStudent from '../Functions/API/GetAllMessagesFromStudent';
import { useSelector } from "react-redux";
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('window')

const Learners = ({navigation, route}) => {
  const isFocused = useIsFocused()
  const JWT = useSelector(state => state.Login.JWT);
  const User_ID = useSelector(state => state.Auth.User_ID);
  const GUser = useSelector(state => state.Auth.GUser);
  const email = useSelector(state => state.Auth.Mail);

  const [allInstructors, setAllInstructors] = useState([])
  const [currentInstructors, setCurrentInstructors] = useState([])
  const [query, setQuery] = useState('')
  // console.log('Query:::::::::::::::::', query, route.params)

  // useEffect(() => {
  //   setQuery(route.params ? route.params.studentName : '')
  // },[])

  useEffect(()=>{
    getAllMessagesFromStudent()
  },[isFocused])

  useEffect(()=> {
    if(query.trim() === '') {
        setCurrentInstructors(allInstructors)
    } else {
        const filteredNames = allInstructors.filter(i => i.fullName.toLowerCase().includes(query.toLowerCase()))
        setCurrentInstructors(filteredNames)
    }
  },[query])

  const getAllMessagesFromStudent = async () => {
    console.log('JWT: ', User_ID, ' User id: ', JWT)
    try {
        const result = await GetAllMessagesFromStudent(GUser, email, User_ID, JWT) 
        if(result.status === 200) {
            setAllInstructors(result.data)
            setCurrentInstructors(result.data)
            console.log(result, "Message list discovered")
        } else {
            console.log('getAllMessagesFromStudent error 1 : ', result)
        }
    } catch (e) {
        console('getAllMessagesFromStudent error 2 : ', e)
    }
  }

  const AppBarContent = {
    title: 'Messages',
    navigation: navigation,
    ArrowVisibility: false,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  return (
      <View style={{flex:1}}>
        <AppBar props={AppBarContent}/>
        <Input onChangeText={setQuery} value={query} placeholder="Search" width="95%" alignSelf={"center"} marginTop={1} borderRadius="4" py="0" px="1" fontSize="11" fontWeight={"500"} InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />} />
        <ScrollView>
          {
            Object.keys(currentInstructors).length > 0 ?
              currentInstructors.map((data, index) => {
                return (
                  <View key={index}>
                    <MessageCard props={data} />
                  </View>
                )
              }) 
            : <Text style={{fontSize:12, alignSelf:"center", marginTop:"1%", color:'#8C8C8C'}}>Your inbox is empty!</Text>
          }
        </ScrollView>
      </View>
  )
}

export default Learners

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    top: 0,
    backgroundColor:'#FFFFFF',
    height:height,
    width:width,
    // padding:20
  },
  TopContainer: {
    padding:10
  },

 
})