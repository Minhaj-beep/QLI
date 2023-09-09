import { StyleSheet, View,ScrollView,Dimensions,TouchableOpacity } from 'react-native';
import React,{useEffect, useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import { Icon,Modal,Text, Box,VStack,HStack,Input,FormControl,Button,Link,Heading,Image,Center, IconButton } from 'native-base';
import { setLoading, setSingleBD, setBankData } from '../Redux/Features/userDataSlice';
import { Ionicons } from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window')

const PayoutList = ({navigation}) => {

    const dispatch = useDispatch();
    const email = useSelector(state => state.Login.email);
    const BaseURL = useSelector(state => state.UserData.BaseURL)
    // const [BData, setBData] = useState([]);
    const BData = useSelector(state => state.UserData.BankData)
    const [Dac, setDac] = useState();

    const [UPIID, setUPIID] = useState('payprabakaran@dbs');
   

    const AppBarContent = {
        title: 'Payout Info',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person',
      }
      
      useEffect(()=>{
        GetAccountInfo()
      },[])

      const GetAccountInfo = () =>{
        dispatch(setLoading(true))
        const API = BaseURL+'getPaymentInfoByEmail'
        var requestOptions = {
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
          if(result.status === 200)
          {
            console.log(Object.keys(result.data).length)
            let arr = result.data
            // let LastElement = arr.length - 1
            // var LArr = result.data[LastElement]
            console.log(arr)
            if(arr.length != 0){
              // setBData(arr)
              dispatch(setBankData(arr))
              let acno = arr[0].accountNumber
              let Lac = acno.length
              let dac = acno.slice(Lac-3, Lac)
              setDac(dac)
            }
            
            dispatch(setLoading(false))
          }else if(result.status > 200){
            dispatch(setLoading(false))
            alert('Error: ' + result.message);
            console.log(result.message);
          }
        }).catch(error =>{
          dispatch(setLoading(false))
          console.log(error)
          alert('Error: ' + error);
        })
      }

    const RenderBDetails = () => {
        return BData.map((data, index) =>{
          console.log('Hello', index)
          let acno = data.accountNumber
          let Lac = acno.length
          let dac = acno.slice(Lac-3, Lac)
          // console.log(dac)
            return (
                <TouchableOpacity key={index} 
                  onPress={()=>{ 
                    dispatch(setSingleBD(data))
                    navigation.navigate('PayoutInfo')
                  }}
                >
                  <VStack style={styles.BCard} p={4} space={1} mt={3}>
                    <HStack justifyContent="space-between">
                        <Text style={styles.BText}>Account name</Text>
                        <Text style={styles.BText2}>{data.accountHolderName}</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                        <Text style={styles.BText}>Account no.</Text>
                        <Text style={styles.BText2}>*******{dac}</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                        <Text style={styles.BText}>Bank name</Text>
                        <Text style={styles.BText2}>{data.bankName}</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                        <Text style={styles.BText}>IFSC</Text>
                        <Text style={styles.BText2}>*****</Text>
                    </HStack>
                </VStack>
                </TouchableOpacity>
            )
        })
    }

  return (
    <View style={styles.TopContainer}>
    <AppBar props={AppBarContent}/>
    <ScrollView contentContainerStyle={styles.container}>
        <VStack style={{marginBottom:100}}>
            {BData && <RenderBDetails/>}

                <Button bg="primary.50" rounded={6} mt={3} 
                _pressed={{bg: "#fcfcfc",
                  _text:{color: "#3e5160"}
                  }}
                  onPress={() => {
                    dispatch(setSingleBD([]))
                    navigation.navigate('PayoutInfo')
                  }}
                >
                  {
                    Object.keys(BData).length > 0 ?
                    <Text color="white.100">+ Add Another Payment Info</Text>
                    :
                    <Text color="white.100">+ Add Payment Info</Text>
                  }
                </Button>
        </VStack>
    </ScrollView>
    </View>
  )
}

export default PayoutList

const styles = StyleSheet.create({
    TopContainer: {
        backgroundColor:'#F3F3F3',
        height:height,
        width:width
    },
    container:{
        alignItems:'center',
        marginTop:15,
    },
    BCard:{
        width: width/1.1,
      borderRadius:10,
      backgroundColor: "#FFFFFF",
      shadowColor: "rgba(0, 0, 0, 0.03)",
      shadowOffset: {
        width: 0,
        height: 0.376085489988327
      },
      shadowRadius: 21.951963424682617,
      shadowOpacity: 1
    },
    BText:{
        color:'#000000',
        fontSize:12,
        fontWeight:'bold'
    },
    BText2:{
        color:'#8C8C8C',
        fontSize:12,
        fontWeight:'bold'
    }
})