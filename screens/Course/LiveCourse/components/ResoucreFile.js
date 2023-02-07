import { StyleSheet, View,TouchableOpacity} from 'react-native';
import React,{ useCallback } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HStack,IconButton,Icon,Link,Text,VStack } from 'native-base';
// import { TouchableOpacity } from 'react-native-gesture-handler';

const ResoucreFile = ({props}) => {
    // console.log(props);
    const data = props.data;
    const url = props.data.resourcePath;
    const navigation = props.navigation;
    // console.log(url)

    // const OpenDoc = async(props) => {
    //     // console.log(props);
    //      const supports = await Linking.canOpenURL(props);
    //      if(supports){
    //         Linking.openURL(props);
    //      }else{
    //         alert('Unable to open the link:'+props)
    //      }   
    //     };

    // const OpenDoc = async(props) =>{
    //     await Linking.openURL(props);
    // }

    // const OpenDoc = async(props) =>{
    //     await WebBrowser.openBrowserAsync(props);
    //     console.log(props);
    // }
  return (
    <View>
        <VStack 
            // href={data.resourcePath}
            // isUnderlined={false}
            ml={5} mt={5} 
        >
        <TouchableOpacity>
            <HStack space={3}>
                <IconButton 
                    icon={<Icon as={Ionicons} name="cloud-download-outline"/>} 
                    borderRadius='full'
                    bg='#F0E1EB'
                    _pressed={{
                        bg: "#fcfcfc",
                        _text:{color: "#3e5160"}
                    }} 
                    _icon={{color: "#8C8C8C",size: "lg"}}
                    alignSelf='center'
                    onPress={() => OpenDoc(url)}
                />
                <Text 
                    alignSelf='center'
                    onPress={() => OpenDoc(url)}
                >{data.resourceName}</Text>
            </HStack>
        </TouchableOpacity>
        </VStack>
    </View>
  )
}

export default ResoucreFile

const styles = StyleSheet.create({})