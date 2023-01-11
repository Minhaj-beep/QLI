import { StyleSheet, View,Dimensions,ScrollView,TouchableOpacity } from 'react-native';
import {useState,React, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {VStack,Text,HStack,Modal, Button,useToast} from 'native-base';
import AppBar from '../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
// import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window')

const PaymentHistory = ({navigation}) => {

  const [showModal, setShowModal] = useState(false);
  const [ModalData, setModalData] =useState();
  const THistory = useSelector(state => state.UserData.THistory)
  console.log(THistory)
  const toast = useToast();


  // console.log(THistory)
  
  const AppBarContent = {
    title: 'Transaction History',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person'                  
  }

  const copyToClipboard = (data) => {
    let cData = "Transaction "+data.charge+" "+data.status
    console.log(cData)
    Clipboard.setString(cData);
  };

  const RenderTH = () =>{
    return THistory.map((data, index)=>{

      const [SColor, setSColor] = useState();
      const [BgColor, setBgColor] = useState();
      // console.log(data)

      useEffect(() =>{ 
        if(data.status === 'Confirmed'){
          setSColor('#29d363')
         setBgColor('#d2f4de')
        }else if(data.status === 'Cancelled'){
          setSColor('#f65656')
          setBgColor('#fbdbdb')
        }else{
          setSColor('#ffbe40')
          setBgColor('#fdf0d7')
        }
      },[])

      const InvoiceData = {
        data:data,
        SColor:SColor,
        BgColor:BgColor
      }

      return(
        <View key={index} style={{marginTop:10}}> 
          <TouchableOpacity 
         onPress={() => {
          setShowModal(true)
          setModalData(InvoiceData)
        }}
         >
          <HStack style={styles.card} space={1} maxWidth={width/0.5} justifyContent='space-between'>
              {/* <View>
                <View style={{backgroundColor:"#F0E1EB", padding:10, borderRadius:10}}>
                  <Icon as={<MaterialIcons name="notifications-active"/>} size={7}/>
                </View>
              </View> */}
              <VStack style={{maxWidth:width/1.5}}>
                  <Text style={{color:"#395061", fontWeight:'bold', fontSize:13}}>{data.transactionDetails}</Text>
                  <Text style={{color:"#395061", fontSize:11, fontWeight:'bold'}}>{data.charge}</Text>
                  <Text style={{color:"#8C8C8C", fontSize:9}}>{data.timestamp}</Text>
                  {/* <Text style={{color:"#8C8C8C", fontSize:10}}>04 Oct 2021 at 5:01 PM</Text> */}
              </VStack>
              <View>
                <Text color={SColor} bg={BgColor} style={{fontSize:11, paddingLeft:15,paddingRight:15,paddingBottom:7, paddingTop:7,borderRadius:20, minWidth:85}}>{data.status}</Text>
              </View>
            </HStack>
            </TouchableOpacity>
        </View>
      )
    })
  }

  return (
    <SafeAreaView>
      <AppBar props={AppBarContent}/>
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="500px">
          <Modal.CloseButton />
          <Modal.Body>
           {ModalData && 
           <VStack space={8}>
            <VStack space={5}>
              <Text color="primary.100" style={{fontWeight:'bold', fontSize:17}}>Invoice</Text>
              
              <VStack>
              <Text color="greyScale.800" style={{fontSize:13}}>Course Name</Text>
              <Text color="primary.100" style={{fontSize:15, fontWeight:'bold'}}>{ModalData.data.transactionDetails}</Text>
              </VStack>
              
              <HStack justifyContent="space-between">
              <Text color="greyScale.800" style={{fontSize:13}}>Fee</Text>
              <Text color="primary.100" style={{fontWeight:'bold', fontSize:15}}>{ModalData.data.charge}</Text>
              </HStack>
              
              <HStack justifyContent="space-between">
              <Text color="greyScale.800" style={{fontSize:13}}>Time</Text>
              <Text color="primary.100" style={{fontWeight:'bold', fontSize:15}}>{ModalData.data.timestamp}</Text>
              </HStack>

              <HStack justifyContent="space-between">
              <Text color="greyScale.800" style={{fontSize:13}}>Status</Text>
              <Text color={ModalData.SColor} bg={ModalData.BgColor} style={{fontSize:13,paddingLeft:15,paddingRight:15,paddingBottom:7, paddingTop:7,borderRadius:20}}>{ModalData.data.status}</Text>
              </HStack>
            </VStack>

            <Button
              bg="#3e5160"
              colorScheme="blueGray"
              style={styles.cbutton}
              _pressed={{bg: "#fcfcfc",
                _text:{color: "#3e5160"}
                }}
              onPress={()=>{
                copyToClipboard(ModalData.data)
                setShowModal(false)
                toast.show({
                  description: "Copied to Clipboard",
                })
              }}
            >
              Copy invoice details
            </Button>            
            </VStack>
            }
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <ScrollView> 
      <VStack style={styles.Container}>
       {THistory && <RenderTH/> }     
      </VStack>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PaymentHistory

const styles = StyleSheet.create({
  Container:{
   marginLeft:15,
   marginRight:15,
   marginTop:15,
   paddingBottom:120
  },
  card:{
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