import { StyleSheet, View,Dimensions } from 'react-native';
import React from 'react';
import { VStack,HStack,FormControl,Text } from 'native-base';
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window')

const AssessmentRadio = ({props}) => {
    const [Answer, setAnswer] = React.useState('1'); 
    
    const data = props.assessmentChoice
 
    useEffect(() => {
      let ans = props.assessmentAnswer
      console.log(ans)
      const ansIndex = data.indexOf(ans)
      let AlphaAns = ToAlphabet(ansIndex)
      setAnswer(AlphaAns)
    },[])

    const ToAlphabet= (index) => {
      const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      return alphabet[index]
    }

    const RenderOptions = () =>{
      return data.map((data,index) =>{
        return(
          <View key={index}>
            <HStack style={{maxWidth:width/1.5}} space={2} mt={1}>
              <Text  colorScheme='blueGray' ml={3}>{ToAlphabet(index)}{'.'}</Text>
              <Text colorScheme='blueGray'>{data}</Text>
            </HStack>
          </View>
        )
      })
    }

  return (
    <VStack space={2}>
        <FormControl m={1}>
         
          <Text style={{fontSize: 17,color: '#000000',fontWeight: 'bold',maxWidth:width/1}}>
            {props.assessmentOrder}. {props.assessmentQuestion}
          </Text>
            <RenderOptions/>
      </FormControl>

      <HStack space={6} m={2} justifyContent="space-between" alignItems='center'>
        <HStack space={2} alignItems='center'>
          <Text style={{fontSize:17,fontWeight:'bold'}}>Answer :</Text>
          <Text style={{fontSize:15,color:'#4C4C4C',backgroundColor:'#d7dcdf', borderRadius:5,maxWidth:width/2.5,paddingLeft:6,paddingRight:6,paddingTop:3,paddingBottom:3}}>{Answer}</Text>
        </HStack>
        <HStack space={2} alignItems='center'>
            <Text style={{fontSize:17,fontWeight:'bold'}}>Points :</Text>
            <Text style={{fontSize:16,color:'#4C4C4C',borderRadius:5}}>{props.point}</Text>
          </HStack>
      </HStack>
    </VStack>
  )
}

export default AssessmentRadio

const styles = StyleSheet.create({})