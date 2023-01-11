import { StyleSheet, View,Dimensions,ScrollView } from 'react-native';
import React from 'react';
import { Icon,Modal,Text, Box,VStack,HStack,Input,FormControl,Button,Link,Heading,Image,Container,Center,Spacer,FlatList,IconButton} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../components/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LearnerCard from './LearnerCard';

const { width, height } = Dimensions.get('window')

const Learners = ({navigation}) => {
  const AppBarContent = {
    title: 'Learners',
    navigation: navigation,
    ArrowVisibility: false,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }
  return (
      <View style={styles.Container}>
        <SafeAreaView>
        <AppBar props={AppBarContent}/>
          <ScrollView>
            <View style={styles.TopContainer}>
              
              <View style={styles.demoRequest}>
                <Text style={styles.demoText}>1001 Requested For Demo Class</Text>
              </View>
              <Input 
                variant="filled"
                mt={2}
                mb={2} 
                bg="#EEEEEE" 
                placeholder="Search"
                onChangeText={(text) => {
                  console.log(text);
                }}
                borderRadius={7}
                InputLeftElement={<Icon as={<Ionicons name="search" />} size={5} ml="3" color="#364b5b" />}
              />

              <LearnerCard/>
            </View>
          </ScrollView>

      </SafeAreaView>
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