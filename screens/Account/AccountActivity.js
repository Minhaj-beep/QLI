import { StyleSheet, View,Dimensions,ScrollView,TouchableOpacity } from 'react-native';
import React,{useState,useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon,Modal,Text, Box,VStack,HStack,Input,FormControl,Button,Link,Heading,Image,Container,Center,Spacer,IconButton} from 'native-base';
import { setLoading } from '../Redux/Features/userDataSlice';
import {useDispatch,useSelector} from 'react-redux';
import AppBar from '../components/Navbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window')

const AccountActivity = ({navigation}) => {

    const Email = useSelector(state => state.Login.email);
    const [activity, setActivity] = useState();
    const BaseURL = useSelector(state => state.UserData.BaseURL)

    const dispatch = useDispatch();

    useEffect(()=>{
        getActivity()
    },[])

    const getActivity = () =>{
        dispatch(setLoading(true))
        if(Email === '' ){
        console.log('Something went wrong, please login again and try');
        }else{
        const requestOptions = {
            method: 'GET',
            headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token':Email,
            'gmailusertype':'INSTRUCTOR',
        },
        }
        console.log(requestOptions)
        fetch(BaseURL+'userAccountActivity', requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.status === 200)
            {
                setActivity(result.data);
                console.log(result.data);
                dispatch(setLoading(false));
            }else if(result.status > 200){
                dispatch(setLoading(false));
                // alert('Error: ' + result.message);
                console.log(result);
            }
        }).catch(error =>{
                dispatch(setLoading(false));
                console.log(error);
                // alert('Error: ' + error);
        })
        }
    }

    const AppBarContent = {
        title: 'Account Activity',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
      }

    const RenderNotification = () => {
        // const data = props.data
        return activity.map((act, index) => {
        return(
            <View key={index}>
                <HStack space={3}  maxWidth={width/0.5} mt={3}>
                <View>
                    <View style={{backgroundColor:"#F0E1EB", padding:10, borderRadius:10}}>
                        <Icon as={<MaterialIcons name="history"/>} size={7}/>
                    </View>
                </View>
                <VStack maxWidth={width*0.76}>
                    <Text style={{color:"#000000", fontWeight:'bold', fontSize:16}}>{act.header}</Text>
                    <Text style={{color:"#395061", fontSize:13}}>{act.data}</Text>
                    {/* <Text style={{color:"#8C8C8C", fontSize:10}}>04 Oct 2021 at 5:01 PM</Text> */}
                </VStack>
            </HStack>
            </View>
            )
        })
    };

  return (
    <SafeAreaView style={styles.topContainer}>
    <ScrollView style={styles.Container}>
            <AppBar props={AppBarContent}/>
            <View style={styles.Container}>
                <VStack mt={5} >
                   {activity && <RenderNotification/>}
                </VStack>
            </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default AccountActivity

const styles = StyleSheet.create({
    topContainer:{
        flex: 1,
        top: 0,
        backgroundColor:'#f5f5f5',
        height:height,
        width:width,
      },
      Container:{
        paddingLeft:10,
        paddingRight:10
      }
})