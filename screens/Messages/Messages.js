import { StyleSheet, View,Dimensions,ScrollView,TouchableOpacity } from 'react-native';
import React from 'react';
import { Icon,Input} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../components/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MessageCard from './MessageCard';

const { width, height } = Dimensions.get('window')

const Learners = ({navigation}) => {
  const AppBarContent = {
    title: 'Messages',
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
            <TouchableOpacity onPress={() =>navigation.navigate('MessageChat')}>
              <MessageCard/>
            </TouchableOpacity>

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
    backgroundColor:'#FFFFFF',
    height:height,
    width:width,
    // padding:20
  },
  TopContainer: {
    padding:10
  },

 
})