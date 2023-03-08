import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import React,{useEffect, useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '../components/Navbar';
import {useDispatch,useSelector} from 'react-redux';
import { Icon,Modal,Text, Box,VStack,HStack,Input,FormControl,Button,Link,Heading,Image,Center, Select } from 'native-base';
import { setLoading, setBankData } from '../Redux/Features/userDataSlice';
import { Dropdown } from 'react-native-element-dropdown';

const { width, height } = Dimensions.get('window')

const PayoutInfo = ({navigation}) => {

  const dispatch = useDispatch();

  const BankList = [
        { value: "Bank of Baroda", label: "Bank of Baroda" },
        { value: "Bank of India", label: "Bank of India" },
        { value: "Bank of Maharashtra", label: "Bank of Maharashtra" },
        { value: "Canara Bank", label: "Canara Bank" },
        { value: "Central Bank of India", label: "Central Bank of India" },
        { value: "Indian Bank", label: "Indian Bank" },
        { value: "Indian Overseas Bank", label: "Indian Overseas Bank" },
        { value: "Punjab & Sind Bank", label: "Punjab & Sind Bank" },
        { value: "Punjab National Bank", label: "Punjab National Bank" },
        { value: "State Bank of India", label: "State Bank of India" },
        { value: "UCO Bank", label: "UCO Bank" },
        { value: "Union Bank of India", label: "Union Bank of India" },
        { value: "Axis Bank Ltd", label: "Axis Bank Ltd" },
        { value: "Bandhan Bank Ltd", label: "Bandhan Bank Ltd" },
        { value: "CSB Bank Ltd", label: "CSB Bank Ltd" },
        { value: "City Union Bank Ltd", label: "City Union Bank Ltd" },
        { value: "DCB Bank Ltd", label: "DCB Bank Ltd" },
        { value: "Dhanlaxmi Bank Ltd", label: "Dhanlaxmi Bank Ltd" },
        { value: "Federal Bank Ltd", label: "Federal Bank Ltd" },
        { value: "HDFC Bank Ltd", label: "HDFC Bank Ltd" },
        { value: "ICICI Bank Ltd", label: "ICICI Bank Ltd" },
        { value: "Induslnd Bank Ltd", label: "Induslnd Bank Ltd" },
        { value: "IDFC First Bank Ltd", label: "IDFC First Bank Ltd" },
        { value: "Jammu & Kashmir Bank Ltd", label: "Jammu & Kashmir Bank Ltd" },
        { value: "Karnataka Bank Ltd", label: "Karnataka Bank Ltd" },
        { value: "Karur Vysya Bank Ltd", label: "Karur Vysya Bank Ltd" },
        { value: "Kotak Mahindra Bank Ltd", label: "Kotak Mahindra Bank Ltd" },
        { value: "Nainital Bank Ltd", label: "Nainital Bank Ltd" },
        { value: "RBL Bank Ltd", label: "RBL Bank Ltd" },
        { value: "South Indian Bank Ltd", label: "South Indian Bank Ltd" },
        { value: "Tamilnad Mercantile Bank Ltd", label: "Tamilnad Mercantile Bank Ltd" },
        { value: "YES Bank Ltd", label: "YES Bank Ltd" },
        { value: "IDBI Bank Ltd", label: "IDBI Bank Ltd" },
        { value: "AB Bank Ltd", label: "AB Bank Ltd" },
        { value: "Abu Dhabi Commercial Bank Ltd", label: "Abu Dhabi Commercial Bank Ltd" },
        { value: "American Express Banking Corporation", label: "American Express Banking Corporation" },
        { value: "Australia and New Zealand Banking Group Ltd", label: "Australia and New Zealand Banking Group Ltd" },
        { value: "Barclays Bank Plc", label: "Barclays Bank Plc" },
        { value: "Bank of America", label: "Bank of America" },
        { value: "Bank of Bahrain & Kuwait BSC", label: "Bank of Bahrain & Kuwait BSC" },
        { value: "Bank of Ceylon", label: "Bank of Ceylon" },
        { value: "Bank of China", label: "Bank of China" },
        { value: "Bank of Nova Scotia", label: "Bank of Nova Scotia" },
        { value: "BNP Paribas", label: "BNP Paribas" },
        { value: "Citibank N.A", label: "Citibank N.A" },
        { value: "Cooperatieve Rabobank U.A", label: "Cooperatieve Rabobank U.A" },
        { value: "Credit Agricole Corporate & Investment Bank", label: "Credit Agricole Corporate & Investment Bank" },
        { value: "Credit Suisse A.G", label: "Credit Suisse A.G" },
        { value: "CTBC Bank Co., Ltd", label: "CTBC Bank Co., Ltd" },
        { value: "DBS Bank India Limited*", label: "DBS Bank India Limited*" },
        { value: "Deutsche Bank", label: "Deutsche Bank" },
        { value: "Doha Bank Q.P.S.C", label: "Doha Bank Q.P.S.C" },
        { value: "Emirates Bank NBD", label: "Emirates Bank NBD" },
        { value: "First Abu Dhabi Bank PJSC", label: "First Abu Dhabi Bank PJSC" },
        { value: "FirstRand Bank Ltd", label: "FirstRand Bank Ltd" },
        { value: "HSBC Ltd", label: "HSBC Ltd" },
        { value: "Industrial & Commercial Bank of China Ltd", label: "Industrial & Commercial Bank of China Ltd" },
        { value: "Industrial Bank of Korea", label: "Industrial Bank of Korea" },
        { value: "J.P. Morgan Chase Bank N.A", label: "J.P. Morgan Chase Bank N.A" },
        { value: "JSC VTB Bank", label: "JSC VTB Bank" },
        { value: "KEB Hana Bank", label: "KEB Hana Bank" },
        { value: "Kookmin Bank", label: "Kookmin Bank" },
        { value: "Krung Thai Bank Public Co. Ltd", label: "Krung Thai Bank Public Co. Ltd" },
        { value: "Mashreq Bank PSC", label: "Mashreq Bank PSC" },
        { value: "Mizuho  Bank Ltd", label: "Mizuho  Bank Ltd" },
        { value: "MUFG Bank, Ltd", label: "MUFG Bank, Ltd" },
        { value: "NatWest Markets Plc", label: "NatWest Markets Plc" },
        { value: "PT Bank Maybank Indonesia TBK", label: "PT Bank Maybank Indonesia TBK" },
        { value: "Qatar National Bank (Q.P.S.C.)", label: "Qatar National Bank (Q.P.S.C.)" },
        { value: "Sberbank", label: "Sberbank" },
        { value: "SBM Bank (India) Limited*", label: "SBM Bank (India) Limited*" },
        { value: "Shinhan Bank", label: "Shinhan Bank" },
        { value: "Societe Generale", label: "Societe Generale" },
        { value: "Sonali Bank Ltd", label: "Sonali Bank Ltd" },
        { value: "Standard Chartered Bank", label: "Standard Chartered Bank" },
        { value: "Sumitomo Mitsui Banking Corporation", label: "Sumitomo Mitsui Banking Corporation" },
        { value: "United Overseas Bank Ltd", label: "United Overseas Bank Ltd" },
        { value: "Woori Bank", label: "Woori Bank" },
  ]

  const email = useSelector(state => state.Login.email);
  const SingleBD = useSelector(state => state.UserData.SingleBD);
  const BaseURL = useSelector(state => state.UserData.BaseURL)
  console.log(SingleBD)

  const [AccountName, setAccountName] = useState();
  const [BankName, setBankName] = useState();
  const [BNFocus, setBNFocus] = useState();
  const [AccountNo, setAccountNo] = useState();
  const [IFSCNo, setIFSCNo] = useState();
  const [BDID, setBDID] = useState();
  const [ErrAC, setErrAC] = useState(false);
  const [ErrIFSC, setErrIFSC] = useState(false);
  const [ErrAN, setErrAN] = useState(false);
  const [ErrBN, setErrBN] = useState(false);

  const AppBarContent = {
    title: Object.keys(SingleBD).length > 0 ? 'Payout Update' : 'Payout Create',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1:'notifications-outline',
    RightIcon2:'person',
  } 

  useEffect(()=>{
   if(SingleBD){
    setAccountName(SingleBD.accountHolderName)
    setBankName(SingleBD.bankName)
    setAccountNo(SingleBD.accountNumber)
    setIFSCNo(SingleBD.IFSCcode)
    setBDID(SingleBD._id)
   }
  },[])

  const varifyUpdate = () => {
    if(AccountName === SingleBD.accountHolderName &&
      BankName === SingleBD.bankName &&
      AccountNo === SingleBD.accountNumber &&
      IFSCNo === SingleBD.IFSCcode
      ) {
        alert('Please make any change and update!')
      } else {
        UpdateInfo()
      }
  }


  const SelectBank = () => {
    return BankList.map((Data,index)=>{
      return (<Select.Item label={Data.label} value={Data.value} key={index}/>)
    })
  }

  const DeleteInfo = () =>{
    dispatch(setLoading(true))
        const API = BaseURL+'deletePaymentInfo'
        var requestOptions = {
          method:'POST',
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'gmailUserType':'INSTRUCTOR',
            'token':email
          },
          body: JSON.stringify({
            paymentInfoId: SingleBD._id
          })
        }
        console.log(requestOptions)
        fetch(API, requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.status === 200)
          {
            alert('Payout Info Deleted Successfully!')
            GetAccountInfo()
            navigation.goBack()
            dispatch(setLoading(false))
          }else if(result.status > 200){
            dispatch(setLoading(false))
            alert('Error DeleteInfo1: ' + result.message);
            console.log(result.message);
          }
        }).catch(error =>{
          dispatch(setLoading(false))
          console.log(error)
          alert('Error DeleteInfo2: ' + error);
        })
      // }
  }

  const UpdateInfo = () =>{
    dispatch(setLoading(true))
    if(ErrAC === true || ErrIFSC === true || ErrBN === true || ErrAN === true){
      alert('Please enter the details correctly!')
      dispatch(setLoading(false))
      }else{
        const API = BaseURL+'updatePaymentInfo'
        var requestOptions = {
          method:'POST',
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'gmailUserType':'INSTRUCTOR',
            'token':email
          },
          body: JSON.stringify({
            accountHolderName:AccountName,
            accountNumber:AccountNo,
            bankName:BankName,
            IFSCcode:IFSCNo,
            paymentInfoId:SingleBD._id
          })
        }
        console.log(requestOptions)
        fetch(API, requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.status === 200)
          {
            alert('Payout Info Updated Successfully!')
            GetAccountInfo()
            navigation.goBack()
            dispatch(setLoading(false))
          }else if(result.status > 200){
            dispatch(setLoading(false))
            alert('ErrorUpdateInfo1: ' + result.message);
            console.log(result.message);
          }
        }).catch(error =>{
          dispatch(setLoading(false))
          console.log(error)
          alert('Error UpdateInfo2: ' + error);
        })
      }
  }

  const createBankAcInfo = () =>{
    dispatch(setLoading(true))
    if(ErrAC === true || ErrIFSC === true || ErrBN === true || ErrAN === true){
      alert('Please enter the details correctly!')
      dispatch(setLoading(false))
      }else{
        const API = BaseURL+'createupdatePaymentInfo'
        var requestOptions = {
          method:'POST',
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'gmailUserType':'INSTRUCTOR',
            'token':email
          },
          body: JSON.stringify({
            accountHolderName:AccountName,
            accountNumber:AccountNo,
            bankName:BankName,
            IFSCcode:IFSCNo,
          })
        }
        console.log(requestOptions)
        fetch(API, requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.status === 200)
          {
            alert('Payout Info Created Successfully!')
            GetAccountInfo()
            navigation.goBack()
            dispatch(setLoading(false))
          }else if(result.status > 200){
            dispatch(setLoading(false))
            alert('ErrorUpdateInfo1: ' + result.message);
            console.log(result.message);
          }
        }).catch(error =>{
          dispatch(setLoading(false))
          console.log(error)
          alert('Error UpdateInfo2: ' + error);
        })
      }
  }

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
        // console.log(result.data)
        let arr = result.data
        // let LastElement = arr.length - 1
        // var LArr = result.data[LastElement]
        // console.log(LArr)
        dispatch(setBankData(arr))
        dispatch(setLoading(false))
      }else if(result.status > 200){
        dispatch(setLoading(false))
        alert('Error GetAccountInfo1: ' + result.message);
        console.log(result.message);
      }
    }).catch(error =>{
      dispatch(setLoading(false))
      console.log(error)
      alert('Error GetAccountInfo2: ' + error);
    })
  }

  const VIFSC = (ifsc) => {
    if(ifsc.length === 11){
      setIFSCNo(ifsc)
      setErrIFSC(false)
    }else{
      setErrIFSC(true)
      setIFSCNo(ifsc)
    }
  }

  const VACNO = (acno) => {
    if(acno.length >= 11 && acno.length <= 16){
      setErrAC(false)
      setAccountNo(acno)
    }else{
      setErrAC(true)
      setAccountNo(acno)
    }
  }

  return (
  <SafeAreaView style={styles.TopContainer}>
    <AppBar props={AppBarContent}/>
    <ScrollView>
      <VStack ml={10} mr={10} mt={10}>
        <FormControl  style={styles.cinput}>
          <FormControl.Label _text={{
          color: "primary.100",
          fontSize: "sm",
          fontWeight: 'bold' 
          }}
          >
             Account Name
          </FormControl.Label>
          <Input
            size={12}
            variant="filled"
            value={AccountName} 
            bg="#fcfcfc" 
            placeholder="Enter Account Name"
            borderColor='#395061'
            borderRadius={7}
            onChangeText={(text)=> {
              if(text != ''){
                setErrAN(false)
                setAccountName(text)
              }else{
                setAccountName('')
                setErrAN(true)
              }
            }}
          />
        </FormControl>


        {ErrAN ?  <Text style={{color:'#FF0000', fontSize:9}}> * Please enter your account name</Text> : null}
        <FormControl  style={styles.cinput}>
          <FormControl.Label _text={{
          color: "primary.100",
          fontSize: "sm",
          fontWeight: 'bold' 
          }}
          >
              Bank Name
          </FormControl.Label>
          {/* <Input 
            variant="filled" 
            bg="#fcfcfc"
            value={BankName} 
            placeholder="Enter the Bank Name"
            borderColor='#395061'
            borderRadius={7}
            onChangeText={(text)=> {
              if(text != ''){
                setErrBN(false)
                setBankName(text)
              }else{
                setBankName('')
                setErrBN(true)
              }
            }}
          /> */}

      <Dropdown
        itemTextStyle={{fontSize: 12, color:"black" }}
        style={{height: 50, borderRadius: 7, padding: 12, borderColor:'#3e5160', borderWidth:1, color:"back",}}
        placeholderStyle={{fontSize: 12, color:"black" }}
        selectedTextStyle={{fontSize: 12, color:"black" }}
        inputSearchStyle={{fontSize: 12, color:"black" }}
        data={BankList}
        keyboardAvoiding={true}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={BankName}
        onChange={item => {
          setBankName(item.value);
        }}
        // renderLeftIcon={() => (
        //   <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        // )}
      />



        </FormControl>
        {ErrBN ?  <Text style={{color:'#FF0000', fontSize:9}}> * Please enter your bank name</Text> : null}



        <FormControl  style={styles.cinput}>
          <FormControl.Label _text={{
          color: "primary.100",
          fontSize: "sm",
          fontWeight: 'bold' 
          }}
          >
              Account No. 
          </FormControl.Label>
          <Input 
            variant="filled" 
            bg="#fcfcfc"
            value={AccountNo} 
            placeholder="Enter Account No."
            borderColor='#395061'
            borderRadius={7}
            size={12}
            keyboardType="numeric"
            onChangeText={(text)=> {
                VACNO(text)
            }} 
          />
        </FormControl>
        {ErrAC ?  <Text style={{color:'#FF0000', fontSize:9}}> * Please enter the valid account number</Text> : null}


        <FormControl  style={styles.cinput}>
          <FormControl.Label _text={{
          color: "primary.100",
          fontSize: "sm",
          fontWeight: 'bold' 
          }}
          >
              IFSC No.
          </FormControl.Label>
          <Input 
            variant="filled" 
            bg="#fcfcfc"
            value={IFSCNo}
            size={12} 
            placeholder="Enter IFSC No."
            borderColor='#395061'
            borderRadius={7}
            onChangeText={(text)=> {
                VIFSC(text)
            }} 
          />
        </FormControl>
        {ErrIFSC ?  <Text style={{color:'#FF0000', fontSize:9}}> * Please enter the valid IFSC Code </Text> : null}
        <Button
         bg="#3e5160"
         colorScheme="blueGray"
         style={styles.cbutton}
         _pressed={{bg: "#fcfcfc",
           _text:{color: "#3e5160"}
           }}
           mt={5}
           onPress={()=>{
            Object.keys(SingleBD).length > 0 ? varifyUpdate() : createBankAcInfo()
          }}
        >
          {Object.keys(SingleBD).length > 0 ? 'Update' : 'Save'}
        </Button>
        {
          Object.keys(SingleBD).length > 0 ?
            <Button
            bg="#F65656"
            colorScheme="blueGray"
            style={styles.cbutton}
            _pressed={{bg: "#fcfcfc",
              _text:{color: "#3e5160"}
              }}
              mt={3}
              onPress={()=>{
                DeleteInfo()
              }}
            >
              Delete
            </Button>
          : null
        }

      </VStack>
    </ScrollView>
  </SafeAreaView>
  )
}

export default PayoutInfo

const styles = StyleSheet.create({
  TopContainer: {
    backgroundColor:'#FFFFFF',
    height:height,
    width:width
},
placeholderStyle: {
  fontSize: 12,
  color:"black"
},
selectedTextStyle: {
  fontSize: 12,
  color:"black"
},
inputSearchStyle: {
  height: 40,
  fontSize: 12,
},
dropdown: {
  height: 50,
  borderRadius: 7,
  padding: 12,
  borderColor:'#3e5160',
  borderWidth:1,
  color:"back", 
},
containerStyle:{
  borderWidth:2,
  borderColor:'#3e5160',
}
})