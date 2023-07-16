import { StyleSheet, View,Dimensions,ScrollView } from 'react-native';
import React, {useState, useEffect} from 'react';
import { Icon,Modal,Text, Box,VStack,HStack,Input,FormControl,Button,Link,Heading,Image,Container,Center,Spacer,FlatList,IconButton} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../components/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LearnerCard from './LearnerCard';
import { LearnerList } from '../Functions/API/LearnersList';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window')

const Learners = ({navigation}) => {
  const [allLearaners, setALlLearners] = useState([])
  const [learaners, setLearners] = useState([])
  const [query, setQuery] = useState('')
  const email = useSelector(state => state.Login.email);

  const AppBarContent = {
    title: 'Learners',
    navigation: navigation,
    ArrowVisibility: false,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  useEffect(()=>{
    getLearnersList()
  },[])

  useEffect(()=>{
    query.trim() !== '' ? setLearners(getObjectsByStudentEmail(allLearaners, query)) : setLearners(allLearaners)
  },[query])

  function getObjectsByStudentEmail(objArray, email) {
    const resultArray = [];
    const lowerCaseEmail = email.toLowerCase();
    for (let i = 0; i < objArray.length; i++) {
      const lowerCaseStudentEmail = objArray[i].studentEmail ? objArray[i].studentEmail.toLowerCase() : null;
      if (lowerCaseStudentEmail && lowerCaseStudentEmail.includes(lowerCaseEmail)) {
        resultArray.push(objArray[i]);
      }
    }
    return resultArray;
  }

  const getLearnersList = async () => {
    try {
      const result = await LearnerList(email)
      if(result.status === 200) {
        console.log('************************LEARNERS LIST*************************', result)
        setALlLearners(result.data)
        setLearners(result.data)
      } else {
        console.log('************************getLearnersList error 1*************************', result)
      }
    } catch (e) {
      console.log('************************getLearnersList error 2*************************', e)
    }
  }

  const getList = () => {
    allLearaners.map((data, index)=>{
      return (
        <View key={index}>
          <Text>Hello</Text>
          {/* <LearnerCard /> */}
        </View>
      )
    })
  }

  return (
      <View style={styles.Container}>
        <AppBar props={AppBarContent}/>
        <View style={{flex:1, width:"95%", alignSelf:"center"}}>
          {
            Object.keys(allLearaners).length > 0 ?
            <>
              <Input 
                variant="filled"
                mt={2}
                mb={0.5} 
                bg="#EEEEEE" 
                placeholder="Search"
                onChangeText={(text) => {
                  setQuery(text);
                }}
                borderRadius={7}
                InputLeftElement={<Icon as={<Ionicons name="search" />} size={5} ml="3" color="#364b5b" />}
              />
              <ScrollView>
              {
                learaners.map((data, index)=>{
                  return (
                    <View key={index} style={{marginTop:5, marginBottom:5}}>
                      <LearnerCard data={data}/>
                    </View>
                  )
                })
              }
              </ScrollView>
            </>
            : <Text style={{fontSize:12, alignSelf:"center", marginTop:"10%", color:'#8C8C8C'}}>Currently you don't have any learners</Text>
          }
        </View>
      </View>
  )
}

export default Learners

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    top: 0,
    backgroundColor:'#f5f5f5',
    height:height,
    width:width,
    // padding:20
  },
  TopContainer: {
    padding:10
  },
  demoRequest: {
    backgroundColor: "#FFBE40",
    borderRadius:29,
    padding:8
  },
  demoText:{
    paddingLeft:15,
    paddingRight:5,
    color:'#FFFFFF',
    fontSize: 12
  },
 
})