import { StyleSheet, View,Dimensions,ScrollView,TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {VStack,Text,Image,HStack,Modal,Box,Button,FormControl,Input, Select,Heading,Center} from 'native-base';
import AppBar from '../components/Navbar';
import { useState } from 'react';

const WithdrawFund = ({navigation}) => {


    const [PaymentMethod, setPaymentMethod] = useState('1');
    const [Withdrawal, setWithdrawal] = useState(false);
    
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
                <FormControl>
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
                    </FormControl>

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
                                    placeholder="Enter Account Name"
                                    borderColor='primary.100'
                                    borderRadius={7}
                                />
                        </FormControl>
                        <Text color="primary.100" fontWeight='bold' fontSize={11} alignSelf='flex-end' m={2} >
                            Available Balance:  $506.00
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
            onPress={() => setWithdrawal(true)}
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