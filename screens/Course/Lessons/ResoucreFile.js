import { StyleSheet, View,TouchableOpacity, Linking} from 'react-native';
import React,{ useCallback, useState } from 'react';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { HStack,IconButton,Icon,Link,Text,VStack } from 'native-base';
import WebView from 'react-native-webview';
import RNFetchBlob from "rn-fetch-blob";

const ResoucreFile = ({props}) => {
    // console.log(props);
    const data = props.data;
    const url = props.data.resourcePath;
    const [download, setDownload] = useState(null)
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

    const OpenDoc = async(props) =>{
        await Linking.openURL(props)


        // let dirs = RNFetchBlob.fs.dirs
        // console.log(props);
        // // setDownload(props)

        // RNFetchBlob.config({
        //     // add this option that makes response data to be stored as a file,
        //     // this is much more performant.
        //     path: dirs.DocumentDir + "/downloads",
        //     fileCache: true,
        // })
        // .fetch("GET", props, {
        //     //some headers ..
        // })
        // .then((res) => {
        //     // the temp file path
        //     console.log("The file saved to ", res.path());
        // });
    }
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
                    icon={<Ionicons as={Ionicons} name="cloud-download-outline"/>} 
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