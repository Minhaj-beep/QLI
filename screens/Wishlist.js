/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View,SafeAreaView,ScrollView,Dimensions} from 'react-native';
import React,{useEffect, useState} from 'react';
import Navbar from './components/Navbar';
import { VStack, HStack, Center, Image, Button,useToast} from 'native-base';
import { GetWishList } from './Functions/API/GetWishList';
import {useSelector, useDispatch} from 'react-redux';
import {AddToCart} from './Functions/API/AddToCart';
import {RemoveFromWL} from './Functions/API/RemoveFromWL';

const {width, height} = Dimensions.get('window');

const Wishlist = ({navigation}) => {

  const toast = useToast();
  const email = useSelector(state => state.Auth.Mail);
  const [WishData, setWishData] = useState('');

  useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
      GetWList();
    });
    return unsubscribe;
  },[navigation]);

  const AppBarContent = {
    title: ' ',
    navigation: navigation,
    ArrowVisibility: true,
    RightIcon1: 'notifications-outline',
    RightIcon2: 'person',
  };

  const GetWList = async() => {
    try {
      let response = await GetWishList(email);
      // console.log(response.data.length);
      if (response.status === 200) {
        console.log(response.message);
        if (response.data.length !== 0){
          setWishData(response.data);
        } else {
          setWishData('');
        }
      }
    }
    catch (e) {
      console.log(e.message);
    }
  };

  const AddTC = async (code) => {
    try {
      let cart = await AddToCart(email, code);
      if (cart.status === 200) {
        toast.show({
          description: cart.message,
        });
        GetWList();
      } else {
        toast.show({
          description: cart.message,
        });
        console.log(cart.message);
      }
      // console.log(cart);
    } catch (e) {

    }
  };

  const RemoveWish = async (code) => {
    try {
      let response = await RemoveFromWL(email, code);
      if (response.status === 200) {
        toast.show({
          description: response.message,
        });
        GetWList();
      } else {
        toast.show({
          description: response.message,
        });
        console.log(response.message);
      }
      console.log(response);
    } catch (e) {

    }
  };

  const WishCard = ({props}) => {
    return (
      <View>
        <VStack style={styles.CourseCard}>
          <HStack space={3}>
            <Center>
              <Image
                style={styles.cardImg}
                source={require('../assets/Home/coursecard.png')}
                alt="courseimg"
                resizeMode="cover"
              />
            </Center>
            <VStack style={styles.CardContent}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#000000',
                  maxWidth: width / 2.5,
                }}>
                {props.courseName}
              </Text>

              <HStack alignItems={'center'} justifyContent={'space-between'}>
                <HStack space={1}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      maxWidth: width / 4,
                    }}
                    color={'greyScale.800'}>
                    By
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      maxWidth: width / 4,
                    }}
                    color={'primary.100'}>
                    {props.instructorName}
                  </Text>
                </HStack>
                <View>
                  <Text
                    color={'greyScale.800'}
                    style={{fontSize: 10, fontWeight: 'bold'}}>
                    Fee
                  </Text>
                </View>
              </HStack>

              <HStack alignItems={'center'} justifyContent={'space-between'}>
                <HStack space={2} alignItems={'center'}>
                  <HStack space={1}>
                    <Image
                      source={require('../assets/Home/star.png')}
                      alt="rating"
                      size="3"
                    />
                    <Image
                      source={require('../assets/Home/star.png')}
                      alt="rating"
                      size="3"
                    />
                    <Image
                      source={require('../assets/Home/star.png')}
                      alt="rating"
                      size="3"
                    />
                    <Image
                      source={require('../assets/Home/star.png')}
                      alt="rating"
                      size="3"
                    />
                    <Image
                      source={require('../assets/Home/star.png')}
                      alt="rating"
                      size="3"
                    />
                  </HStack>

                  <Text
                    style={{fontSize: 8, fontWeight: '600'}}
                    color={'greyScale.800'}>
                    5.0 (150)
                  </Text>

                  {/* <HStack space={1} alignItems={'center'}>
                         <Image
                         alt="graduate icon"
                         source={require('../../../../assets/Home/graduate_student.png')}
                         size="3"
                         />
                         <Text style={{fontSize: 10,fontWeight: '600'}} color={'greyScale.800'}>
                             7 Learners
                         </Text>
                     </HStack> */}
                </HStack>
                <View>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      color: '#000000',
                    }}>
                    ${props.fee}
                  </Text>
                </View>
              </HStack>
            </VStack>
          </HStack>
         <HStack space={5} m={2} justifyContent={'center'}>
          <Button
            _text={{color: '#364b5b', fontSize: 12, fontWeight: 'bold'}}
            style={{backgroundColor: 'rgba(54, 75, 91, 0.5)', width:width / 2.6}}
            _pressed={{backgroundColor: '#FFFFFF', opacity: 0.3}}
            p={2}
            onPress={() => {
              RemoveWish(props.courseCode);
            }}>
            Remove from Wishlist
          </Button>
          <Button
            _text={{color: '#FFF', fontSize: 12}}
            bg={'primary.100'}
            style={{ width:width / 2.6}}
            _pressed={{backgroundColor: '#FFFFFF', opacity: 0.5}}
            p={2}
            onPress={() => {
              AddTC(props.courseCode);
            }}>
           Add to Cart
          </Button>
         </HStack>
        </VStack>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
    <Navbar props={AppBarContent} />
    <ScrollView
      contentContainerStyle={styles.TopContainer}
      nestedScrollEnabled={true}>

      {WishData !== '' ?
        <VStack m={5} space={3}>
          {
            WishData.map((data, index)=>{
              return (
                <View key={index}>
                  <WishCard props={data}/>
                </View>
              );
            })
          }
        </VStack>
      : 
      <View style={{alignItems:'center'}}>
        <Text color={'greyScale.800'} fontSize={10}>No items to show yet!</Text>
      </View>
      }

    </ScrollView>
    </SafeAreaView>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F1F1',
    height: height,
    width: width,
    flex: 1,
    // margin:15,
  },
  TopContainer: {
    flexGrow: 1,
    // flexShrink: 1,
    // flexBasis: 1,
    paddingBottom: 70,
    marginTop: 20,
  },
  CourseCard: {
    alignItems: 'center',
    maxHeight: height / 6,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.03)',
    shadowOffset: {
      width: 0,
      height: 0.376085489988327,
    },
    shadowRadius: 22,
    shadowOpacity: 1,
    padding: 10,
  },
  cardImg: {
    height: height / 11,
    width: width / 5,
    borderRadius: 5,
  },
  CardContent: {
    minWidth: width / 1.7,
  },
});
