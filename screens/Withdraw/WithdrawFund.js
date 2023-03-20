import { StyleSheet, View,Dimensions,ScrollView,TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {VStack,Text,Image,HStack,Modal,Box,Button,FormControl,Input, Select,Heading,Center} from 'native-base';
import AppBar from '../components/Navbar';
import { useState } from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { RaiseWithdrawRequest } from '../Functions/API/RaiseWithdrawRequest';

const WithdrawFund = ({navigation}) => {
    const transactionData = useSelector(state => state.UserData.TransactionHistory);
    const email = useSelector(state => state.Login.email);
    const [PaymentMethod, setPaymentMethod] = useState('1');
    const [Withdrawal, setWithdrawal] = useState(false);
    const [amount, setAmount] = useState(0)

    const raiseWithdrawRequest = async () => {
      try {
        console.log('hello')
        const result = await RaiseWithdrawRequest(email, amount)
        if(result.status === 200) {
          setWithdrawal(true)
        } else {
          console.log('raiseWithdrawRequest failed 1', result)
          alert(result.message)
        }
      } catch (e) {
        console.log('raiseWithdrawRequest failed 2', e)
      }
    }

    const processWithdraw = () => {
      if(amount > 0){
        if(amount > transactionData.TotalRevenue){
          alert(`You don't have ₹${amount} in your account.`)
        } else {
          raiseWithdrawRequest()
        }
      } else {
        alert('Please enter a valid amount to withdraw.')
      }
    }
    
    const AppBarContent = {
        title: 'Withdraw Fund',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
    }


  return (
    <SafeAreaView>
        <AppBar props={AppBarContent}/>
        <ScrollView>
        <Modal isOpen={Withdrawal} onClose={() => setWithdrawal(false)} size="lg">
        <Modal.Content maxWidth="900" Width="800">
          <Modal.CloseButton />
          <Modal.Body>
            <VStack space={3} >
                 
              <Box safeArea flex={1} p={2} w="90%" mx="auto">
                <VStack space={2} alignItems="center">
                <Center>
                  <Image source={require('../../assets/success_tick.png')} alt="success" style={{height:80,width:80}}/>
                  </Center>
                <Heading size="lg"
                fontSize="lg"
                >
                <Text>Your Fund is in way</Text>
                  </Heading>

                <Button 
                  bg="#3e5160"
                  colorScheme="blueGray"
                  style={styles.pdone}
                  _pressed={{bg: "#fcfcfc",
                    _text:{color: "#3e5160"}
                    }}
                  onPress={() => setWithdrawal(false)}
                  mt={3}
                  >
              Great
            </Button>
                 </VStack> 
               
              </Box>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>

            <VStack m={7} space={10}>
                <VStack space={6}>
                {/* <FormControl>
                        <FormControl.Label
                            _text={{
                                color: "muted.700",
                                fontSize: "sm",
                                fontWeight: 'bold',
                                paddingBottom:2
                                }}
                        >
                            Select Payment Method
                        </FormControl.Label>
                        <Select 
                            selectedValue={PaymentMethod} 
                            minWidth="200" 
                            accessibilityLabel="Choose Service" 
                            placeholder="Choose Service"
                            borderColor='primary.100'
                            onValueChange={itemValue => setPaymentMethod(itemValue)}
                        >
                        <Select.Item value='1' label="Paypal"/>
                        <Select.Item value='2' label="Payoneer"/>
                        <Select.Item value='3' label="Bank Account"/>
                        <Select.Item value='4' label="Gift Voucher"/>
                        </Select> 
                    </FormControl> */}

                    <VStack>
                        <FormControl>
                            <FormControl.Label
                                _text={{
                                    color: "muted.700",
                                    fontSize: "sm",
                                    fontWeight: 'bold',
                                    paddingBottom:2
                                    }}
                            >
                                Enter Amount to Withdraw
                            </FormControl.Label>
                                <Input 
                                    variant="filled" 
                                    bg="#f3f3f3" 
                                    keyboardType='numeric'
                                    placeholder="i.e 5000"
                                    borderColor='primary.100'
                                    borderRadius={7}
                                    onChangeText={(num)=>{
                                      setAmount(num)
                                    }}
                                />
                        </FormControl>
                        <Text color="primary.100" fontWeight='bold' fontSize={11} alignSelf='flex-end' m={2} >
                            Available Balance:  ₹{transactionData.TotalRevenue}
                        </Text>
                    </VStack>
                </VStack>
            <Button
             bg="#3e5160"
             colorScheme="blueGray"
             style={styles.cbutton}
             _pressed={{bg: "#fcfcfc",
               _text:{color: "#3e5160", fontSize:'13'}
               }}
            onPress={() => processWithdraw()}
            >
                Withdraw
            </Button>
            </VStack>

        </ScrollView>
    </SafeAreaView>
  )
}

export default WithdrawFund

const styles = StyleSheet.create({})