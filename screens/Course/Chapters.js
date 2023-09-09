import { StyleSheet, Text, View,ScrollView,Dimensions,TouchableOpacity } from 'react-native';
import React from 'react';
import AppBar from '../components/Navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from 'native-base';
import UVCard from './Chapters/UVCard';
import {useDispatch,useSelector} from 'react-redux';
import { useEffect,useState } from 'react';

const { width, height } = Dimensions.get('window')

const Chapters = ({navigation}) => {

    const SingleCD = useSelector(state => state.UserData.SingleCD);
    const email = useSelector(state => state.Login.email);
    const courseCode = SingleCD.courseCode;
    const BaseURL = useSelector(state => state.UserData.BaseURL)
    const Assessment = useSelector(state => state.Course.Assessment);
    const [CapData, setCapData] = useState();

    useEffect(() => {
        if(courseCode != ''){
            const API = BaseURL+'getAllChapter?courseCode='+courseCode;
            const requestOptions ={
                method:'GET',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'gmailUserType':'INSTRUCTOR',
                    'token':email
                  },
            }

            fetch(API, requestOptions)
            .then(response => response.json())
            .then(result => {
                if(result.status === 200){
                    // console.log(result.data[0].chapterList)
                    let data = result.data[0]
                    console.log(data)
                    setCapData(data.chapterList)
                }else if(result.status > 200){
                    console.log(result)
                    alert(result.message)
                }
            }).catch(error =>{
                console.log(error)
                alert('Error: ' + error)
            })
        }
    },[])
   

    const AppBarContent = {
        title: 'Chapters',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
      }

      const UVItem = () => {
        return CapData.map((data, index) =>{
            const CData = {
                data:data,
                navigation: navigation,
            }
            return(
                <TouchableOpacity 
                    key={index}
                >
                    <UVCard props={CData}/>
                </TouchableOpacity>
            )

        })
      }

  return (
    <View style={styles.TopContainer}>
        <ScrollView>
            <View>
                <AppBar props={AppBarContent}/>
                <VStack style={styles.Container} m={5}>
              {  Assessment ? <Text style={styles.Notice} >Open each chapter to view the list of Assessments!</Text>
                : <Text style={styles.Notice} >Open each chapter to view the list of Lessons!</Text> }

                    {CapData && UVItem()}
                </VStack>    
            </View>
        </ScrollView>
    </View>
  )
}

export default Chapters

const styles = StyleSheet.create({
    TopContainer:{
        flex: 1,
        top: 0,
        backgroundColor:'#f5f5f5',
        height:height,
        width:width,
    },
    Container:{
        // margin:10
        // paddingLeft:20,
        // paddingRight:20,
        // paddingTop:30,
        // paddingBottom:20
    },
    Notice:{
        fontSize:11,
        alignSelf:'center', 
        backgroundColor:'#f0e1eb', 
        padding:10, 
        color:"#364b5b",
        borderRadius:4,
        width:width/1.1,
        marginBottom:15
    }
})