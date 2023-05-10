import { Text, VStack, View, HStack, ScrollView } from "native-base"
import { Dimensions, TouchableOpacity, StyleSheet } from "react-native"
import React, {useEffect, useState} from "react"
import AppBar from "../components/Navbar"
import { useSelector, useDispatch } from "react-redux"
import { setLoading } from '../Redux/Features/authSlice';
import { GetTransactionDetails } from '../Functions/API/GetTransactionDetails';
const { width, height } = Dimensions.get('window')

const PurchaseList = ({navigation}) => {
    const dispatch = useDispatch()
    const email = useSelector(state => state.Login.email);
    const [allItems, setAllItems] = useState([])

    const AppBarContent = {
        title: 'Purchase List',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
    }

    useEffect(()=>{
        getTransactionDetails()
    },[])

    // Get all the purchased list
    const getTransactionDetails = async () => {
        dispatch(setLoading(true))
        try {
            const result = await GetTransactionDetails(email)
            if(result.status === 200) {
              console.log(Object.keys(result.data).length)
              setAllItems(result.data)
            } else {
              console.log('getTransactionDetails failed 1', result)
            }
            dispatch(setLoading(false))
        } catch (e) {
            console.log('getTransactionDetails failed 2', e)
            dispatch(setLoading(false))
        }
    }

    const RenderPurchasedList = () => {
        return (
            allItems.map((data, index) => {
                const date = new Date(data.createdTime)
                return(
                    <View key={index} width={width} style={{marginTop:10}}> 
                        <HStack style={styles.card} space={1} alignItems={'center'} alignSelf={'center'} justifyContent='space-between'>
                            <VStack>
                                <Text style={{color:"#395061", fontWeight:'bold', fontSize:13}}>{data.courseName}</Text>
                                <Text style={{color:"#395061", fontSize:11, fontWeight:'bold'}}>{data.studentEmail}</Text>
                                <Text style={{color:"#8C8C8C", fontSize:11, fontWeight:'bold'}}>₹{data.charge}</Text>
                                <Text style={{color:"#8C8C8C", fontSize:9}}>{date.toLocaleString()}</Text>
                            </VStack>
                        </HStack>
                    </View>
                )
            })
        )
    }

    return (
        <VStack style={{flex:1}}>
            <AppBar props={AppBarContent} />
            <View style={{flex:1}}>
                {
                    Object.keys(allItems).length > 0 ? null :
                    <Text style={{fontSize: 15,color: '#364b5b', marginTop:20, fontWeight: 'bold', alignSelf:"center"}}>Nobody has purchased your courses yet!</Text>
                }
                <ScrollView width={width*9.5}>
                { Object.keys(allItems).length > 0 ? <RenderPurchasedList /> : null }
                </ScrollView>
            </View>
        </VStack>
    )
}

export default PurchaseList

const styles = StyleSheet.create({
    Container:{
     marginLeft:15,
     marginRight:15,
     marginTop:15,
     paddingBottom:120
    },
    card:{
        width:width*0.95,
      backgroundColor:"#F8F8F8",
      padding:12,
      shadowColor: "rgba(0, 0, 0, 0.03)",
      shadowOffset: {
        width: 0,
        height: 0.38
      },
      borderRadius:6,
    }
  })