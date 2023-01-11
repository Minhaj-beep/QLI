import { View, Text, StyleSheet,Dimensions,TouchableOpacity} from 'react-native';
import React from 'react';
import {HStack, VStack, Image,Center,Divider} from 'native-base';
import CollapsibleView from '@eliav2/react-native-collapsible-view';

const FAQContent = ({props}) => {
    // console.log(props.question);
  return (
    <View>
      <CollapsibleView 
            title={
              <HStack 
                style={{
                  flex:1,    
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                }}
              >
              <View>
                <Text style={{fontSize: 13,color: '#000000',fontWeight: '900'}}>
                {props.question} 
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
              }}
              arrowStyling={{ size: 15,thickness: 2, color: "#364b5b"}}
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
              <Text style={{fontSize: 12,color: '#8C8C8C'}}>
                {props.answer}
              </Text>
            </VStack>
          </CollapsibleView>  
    </View>
  )
}

export default FAQContent