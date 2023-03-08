import React, {useEffect, useState} from "react"
import AppBar from "../components/Navbar"
import { StyleSheet, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import {HStack, VStack, Image, Center, View, Text, Icon, Button, Divider, IconButton, Pressable } from 'native-base';
import {useDispatch,useSelector} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CollapsibleView from '@eliav2/react-native-collapsible-view';
import RenderHtml from "react-native-render-html";
import Feather from 'react-native-vector-icons/Feather';
const { width, height } = Dimensions.get('window')

const ViewDemoClass = ({navigation}) => {
    const AppBarContent = {
        title: 'Demo Class',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
    }

    const OverviewSource ={
        html:`<head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        </head> 
        <body></body>`
      }

    return (
        <View>
            <AppBar props={AppBarContent} />
            <ScrollView>
            <View style={styles.TopContainer}>
                <Image 
                    style={styles.courseImg} 
                    // source={{uri: SingleCD.thumbNailImagePath}}
                    source={require('../../assets/course_cdetails.png')}
                    alt='courseImg'
                    mb={2}
                    resizeMode='cover'
                />
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>{'SingleCD.courseName'}</Text>
                <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>{'currencyType'} {'SingleCD.fee'}</Text>
                <HStack space={2} mt="2" alignItems="center">
                    <HStack space={2} alignItems="center">
                        <HStack space={1}>
                        <Image
                            source={require('../../assets/star.png')}
                            alt="rating"
                            size="4"
                        />
                        <Image
                            source={require('../../assets/star.png')}
                            alt="rating"
                            size="4"
                        />
                        <Image
                            source={require('../../assets/star.png')}
                            alt="rating"
                            size="4"
                        />
                        <Image
                            source={require('../../assets/unstar.png')}
                            alt="rating"
                            size="4"
                        />
                        <Image
                            source={require('../../assets/unstar.png')}
                            alt="rating"
                            size="4"
                        />
                        </HStack>
                    <Text style={{fontSize: 15,color: '#364b5b'}}>
                    5.0(150)
                    </Text>
                    <Text style={{fontSize: 15,color: '#364b5b',fontWeight: 'bold',paddingLeft:15}}>
                    View Reviews
                    </Text>
                    </HStack>
                </HStack>

            
                <HStack space={2} mt='3' mb='4' alignItems="center">
                    <TouchableOpacity
                    onPress={()=>setRChat(true)}
                    >
                        <HStack alignItems="center">
                            <Image
                                alt="graduate icon"
                                source={require('../../assets/graduate_student.png')}
                                size="4"
                            />
                            <Text ml={2}>1002 Learners</Text>
                        </HStack>
                    </TouchableOpacity>
                </HStack>
                
                <CollapsibleView 
                    title={
                    <HStack 
                        style={{
                        flex:1,    
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        paddingTop:10,
                        paddingLeft:15,
                        paddingRight:15,
                        paddingBottom:10,
                        position: 'relative'
                        }}
                    >
                    <VStack>
                        <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>Timing</Text>
                    </VStack>
                    </HStack>  
                    }
                    style={{
                    borderRadius: 5,
                    backgroundColor: "#FFFFFF",
                    shadowColor: "rgba(0, 0, 0, 0.03)",
                    shadowOffset: {
                        width: 0,
                        height: 0.5
                    },
                    shadowRadius: 22,
                    shadowOpacity: 1,
                    borderWidth: 0,
                    }}
                    // collapsibleContainerStyle={}
                    arrowStyling={{ size: 20,thickness: 3, color: "#364b5b"}}
                    isRTL={true}
                    collapsibleContainerStyle={{
                    paddingTop: 5,
                    paddingBottom:10,
                    paddingLeft:15,
                    paddingRight:15
                    }}
                >
            
                    <Divider my={1}/>
                    <VStack width={'90%'} alignSelf={'center'} space={2}>
                        <Text style={{fontWeight:"bold", fontSize:13}}>Date</Text>
                        <Pressable mb={3} alignSelf={'center'} style={{width:'100%', padding:10, borderRadius:5, backgroundColor:"rgba(57,80,97,0.2)"}} >
                            <HStack justifyContent={'space-between'} alignItems={'center'}>
                                <Text noOfLines={1} style={{color:"#395061"}}>02-02-2023</Text>
                                <Icon as={<Feather name="calendar"/>} color={'#395061'} size={5}/>
                            </HStack>
                        </Pressable>
                        <Text style={{fontWeight:"bold", fontSize:13}}>Time</Text>
                        <Pressable mb={3} alignSelf={'center'} style={{width:'100%', padding:10, borderRadius:5, backgroundColor:"rgba(57,80,97,0.2)"}} >
                            <HStack justifyContent={'space-between'} alignItems={'center'}>
                                <Text noOfLines={1} style={{color:"#395061"}}>qlearning.com/liveClass/fbjng</Text>
                                <Icon bottom={1} as={<FontAwesome name="sort-down"/>} color={'#395061'} size={5}/>
                            </HStack>
                        </Pressable>
                        <Text style={{fontWeight:"bold", fontSize:13}}>Timezone</Text>
                        <Pressable alignSelf={'center'} style={{width:'100%', padding:10, borderRadius:5, backgroundColor:"rgba(57,80,97,0.2)"}} >
                            <HStack justifyContent={'space-between'} alignItems={'center'}>
                                <Text noOfLines={1} style={{color:"#395061"}}>qlearning.com/liveClass/fbjng</Text>
                                <Icon bottom={1} as={<FontAwesome name="sort-down"/>} color={'#395061'} size={5}/>
                            </HStack>
                        </Pressable>
                    </VStack>
                </CollapsibleView>
                <CollapsibleView 
                    title={
                    <HStack 
                        style={{
                        flex:1,    
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        paddingTop:10,
                        paddingLeft:15,
                        paddingRight:15,
                        paddingBottom:10,
                        position: 'relative'
                        }}
                    >
                    <VStack>
                        <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>
                        Demo Classes 
                        </Text>
                        {/* <Text style={{fontSize: 12,color: '#8C8C8C'}}>
                        You can edit course Pricing
                        </Text> */}
                    </VStack>
                    </HStack>  
                    }
                    style={{
                    borderRadius: 5,
                    backgroundColor: "#FFFFFF",
                    shadowColor: "rgba(0, 0, 0, 0.03)",
                    shadowOffset: {
                        width: 0,
                        height: 0.5
                    },
                    shadowRadius: 22,
                    shadowOpacity: 1,
                    borderWidth: 0,
                    }}
                    // collapsibleContainerStyle={}
                    arrowStyling={{ size: 20,thickness: 3, color: "#364b5b"}}
                    isRTL={true}
                    collapsibleContainerStyle={{
                    paddingTop: 5,
                    paddingBottom:10,
                    paddingLeft:15,
                    paddingRight:15
                    }}
                >
                    <Divider my={2}/>
                    <VStack mt={1} space={2}>
                        <HStack width={'95%'} alignSelf={'center'} justifyContent={'space-between'} alignItems={'center'}>
                            <VStack>
                                <Text style={{fontSize:12, fontWeight:"bold"}}>14 February, 2022</Text>
                                <Text style={{fontSize:10, fontWeight:"bold"}}>10:00 PM</Text>
                            </VStack>
                            <VStack>
                                <Text style={{fontSize:10, color:"#8C8C8C", fontWeight:"bold"}}>No of Booked</Text>
                                <Text style={{fontSize:12, fontWeight:"bold"}}>50 Learners</Text>
                            </VStack>
                            <VStack>
                                <Text style={{fontSize:10, color:"#8C8C8C", fontWeight:"bold"}}>No. Of Attendees</Text>
                                <Text style={{fontSize:12, fontWeight:"bold"}}>48 Learners</Text>
                            </VStack>
                            <Icon as={<AntDesign name="rightcircleo"/>} color={'#395061'} size={5}/>
                        </HStack>
                        <Divider my={2}/>
                    </VStack>
                </CollapsibleView>

                <CollapsibleView 
                    title={
                    <HStack 
                        style={{
                        flex:1,    
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        paddingTop:10,
                        paddingLeft:15,
                        paddingRight:15,
                        paddingBottom:10,
                        }}
                    >
                    <View>
                        <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold'}}>
                        Go Live
                        </Text>
                    </View>
                    </HStack>  
                    }
                    style={{
                    borderRadius: 5,
                    backgroundColor: "#FFFFFF",
                    shadowColor: "rgba(0, 0, 0, 0.03)",
                    shadowOffset: {
                        width: 0,
                        height: 0.5
                    },
                    shadowRadius: 22,
                    shadowOpacity: 1,
                    borderWidth: 0,
                    marginBottom:30
                    }}
                    arrowStyling={{ size: 20,thickness: 3, color: "#364b5b"}}
                    isRTL={true}
                    collapsibleContainerStyle={{
                    paddingTop: 5,
                    paddingBottom:10,
                    paddingLeft:15,
                    paddingRight:15
                    }}
                >
                    <Divider my={1}/>
                    <VStack mt={1} space={2}>
                        <VStack space={1} alignItems={'center'} paddingTop={10}>
                            {/* <Text style={{backgroundColor:"#395061", marginBottom:15, paddingHorizontal:50, paddingVertical:8, color:"#fff", borderRadius:5}}>Start Class</Text> */}
                            <Text style={{fontSize: 20, marginBottom:15, color: '#000000', fontWeight: 'bold'}}>10:30:15:20</Text>
                            <Text style={{fontSize: 16, color: '#000000', fontWeight: 'bold'}}>Here’s the link to your demo class</Text>
                            <Text style={{fontSize: 13, color: '#8C8C8C'}}>Copy this link and send it to learners for join the class. Also Lerner will get link from their Transactions.  Save it for use Later. System saved it also on your Transactions. </Text>
                            <Pressable mt={5} style={{width:'80%', padding:10, borderRadius:5, backgroundColor:"rgba(57,80,97,0.2)"}} >
                                <HStack justifyContent={'space-between'} alignItems={'center'}>
                                    <Text noOfLines={1} style={{color:"#395061"}}>qlearning.com/liveClass/fbjng</Text>
                                    <Icon as={<Feather name="copy"/>} color={'#395061'} size={5}/>
                                </HStack>
                            </Pressable>
                        </VStack>
                    </VStack>
                </CollapsibleView>
            </View>
            </ScrollView>
        </View>
    )
}

export default ViewDemoClass

const styles = StyleSheet.create({
  CourseCard: {
    width:"95%",
    alignSelf:"center",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "rgba(0, 0, 0, 0.03)",
    shadowOffset: {
      width: 0,
      height: 0.376085489988327
    },
    shadowRadius: 22,
    shadowOpacity: 1,
    paddingTop:10,
    paddingHorizontal:10,
    marginTop:10,
  },
  cardImg: {
    height:width*0.17,
    width: width*0.27,
    borderRadius: 5,
  },
  CardContent:{
    // minWidth:width/1.7,
    marginLeft:10
  },
  TopContainer: {
    marginTop:20,
    marginLeft:10,
    marginRight:10,
    marginBottom:30
  },
  courseImg:{
    height:height/4,
    borderRadius:5
  },
  Thumbnail:{
    height: height/4,
    borderRadius:5,
  },
  learner_chat:{
    width:45,
    height:45,
  },
  chatTile:{
    padding:10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    shadowColor: "rgba(0, 0, 0, 0.03)",
    shadowOffset: {
      width: 0,
      height: 0.376085489988327
    },
    shadowRadius: 21.951963424682617,
    shadowOpacity: 1001,
    justifyContent:"space-between"
  },
  RenderP:{
    // position:"relative",
    // maxHeight: height*height,
    // minHeight: height/3
  },
  RenderH:{
    // position: "absolute",
    zIndex:1000,
  }
})