import { View } from 'react-native';
import React,{useState,useEffect} from 'react';
import {Text,Image,HStack,VStack,IconButton,Icon,Divider, Container,Select,Input,Modal,Box, Heading, Button,FormControl} from 'native-base';

const ClassTime = ({props}) => {
  console.log(props)

    const [day, setDay] = useState();
    const [Render, setRenderT] = useState(true);

    function camelize(str) {
        return str.split(' ')
           .map(a => a.trim())
           .map(a => a[0].toUpperCase() + a.substring(1))
           .join("")
     }

     useEffect(()=>{
        let day = props.day
        let cday = camelize(day)
        setDay(cday)
        if(props.isAvailable === false){
          setRenderT(false)
        }else{
          setRenderT(true)
        }
     },[])

    // const [TimeCheck01, setTimeCheck01] = useState(false);
    // console.log(props)
  return (
    <View>
     { Render ? <HStack space={3} alignItems="center" m={1}>
        {/* <Checkbox value={TimeCheck01} onValueChange={setTimeCheck01}/> */}
        <Text style={{minWidth:80, fontSize:13}} >{day}</Text>
        <HStack alignItems='center' space={3}>
        <View 
        style={{width: "34%", height: "90%",}}
        >
        <FormControl>
            <Input
            value={props.startTime}
            placeholder="HH:MM"
            variant="filled" 
            bg="#f3f3f3"
            borderRadius={5}
            isDisabled
            />
        </FormControl>
        </View>
        <Text style={{color: "#000000", fontSize: 13 }}>
        To
        </Text>
        <View 
        style={{width: "34%", height: "90%",}}
        >
        <FormControl>
            <Input
            value={props.endTime} 
            placeholder="HH:MM" 
            variant="filled"
            bg="#f3f3f3"
            borderRadius={5}
            isDisabled
            />
        </FormControl>
        </View>
        </HStack>
    </HStack> : null}
    </View>
  )
}

export default ClassTime