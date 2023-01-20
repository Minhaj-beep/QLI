import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import React,{useState,useEffect} from 'react';
import {HStack, VStack, Text, Icon, Divider, Container,Image} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch,useSelector} from 'react-redux';
import {setAssessmentData} from '../Redux/Features/CourseSlice'
import {setLoading} from '../Redux/Features/userDataSlice'

const AssessmentTab = ({navigation}) => {

  const email = useSelector(state => state.Login.email);
  const BaseURL = useSelector(state => state.UserData.BaseURL);
  console.log(email, ' + ', BaseURL)
  const dispatch = useDispatch()
  const [AssessmentList, setAssessmentList] = useState()

  useEffect(()=>{
    GetIAssessment();
  },[])

  const GetIAssessment = () =>{
    dispatch(setLoading(true));
    const API = BaseURL+'getAssessmentbyEmail'
    var requestOptions = {
      method:'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'gmailUserType':'INSTRUCTOR',
        'token':email
      }
    }

    fetch(API, requestOptions)
    .then(response => response.json())
    .then(result => {
      if(result.status === 200){
        // dispatch(setIAssessmentList(result.data))
        console.log(result.data)
        dispatch(setLoading(false));
        let AssessmentL = result.data
        if(AssessmentL.length != 0){
          setAssessmentList(AssessmentL)
        }else if(AssessmentL.length === 0){
          setAssessmentList(null)
        }
      }else{
        // alert(result.message)
        dispatch(setLoading(false));
      }
    }).catch(error => {
      dispatch(setLoading(false));
      console.log(error)
      // alert('CError:'+error)
    })
  }

  const Render = () =>{
    return AssessmentList.map((data, index)=>{
        const price = data.currency === 'USD' ? '$' : '₹';
        const fee = price +' '+data.fee
        {console.log(data.assessmentDetails)}
        return(
            <TouchableOpacity 
                key={index} 
                style={styles.card}
                onPress={()=> {
                    dispatch(setAssessmentData(data.assessmentDetails))
                    navigation.navigate('Assessments')
                }}>
                <HStack alignItems="center" space={3}>
                    <Container bg='#F0E1EB' p={2} borderRadius={50}>
                      <Icon size="lg" as={Ionicons} name="clipboard-outline" color="primary.100" />
                    </Container>
                      <VStack>
                      <Text style={{fontWeight:'bold',maxWidth:240,fontSize: 13}}>{data.assessmentTitle}</Text>
                      <Text style={{fontWeight:'bold',maxWidth:200,fontSize: 9}}>{fee}</Text>
                      {/* <HStack space={3} alignItems='center'>
                        <Image
                        alt="graduate icon"
                        source={require('../../assets/graduate_student.png')}
                        size="2" 
                        />
                        <Text style={{fontSize: 9,color:"#091B12",fontWeight: '900'}}>
                            7 Learners
                        </Text>
                      </HStack> */}
                      {/* <Text style={{maxWidth:300,fontSize: 10}}>{data.catogory}  {'>'}  {data.subCategory}</Text> */}
                      <Text style={{maxWidth:300,fontSize: 10}}>{Object.keys(data.assessmentDetails).length} Questions</Text>
                      </VStack>
                </HStack>
            </TouchableOpacity>
        )
    })
}
return (
  <View style={styles.container}>
    <SafeAreaView>
      <ScrollView nestedScrollEnabled={true} style={{marginBottom:150}}>
         { AssessmentList ? <Render /> : <Text style={{fontSize:12, marginTop:"5%", color:'#8C8C8C', alignSelf:'center'}}>Currently you don't have any Assessments</Text>}
      </ScrollView>
    </SafeAreaView>
    </View>
  )
}

export default AssessmentTab

const styles = StyleSheet.create({
  container:{
      marginLeft:15,
      marginRight:15,
  },
  card:{
      borderRadius: 5,
      backgroundColor: "#F8F8F8",
      padding:12,
      marginTop:10
  }
})