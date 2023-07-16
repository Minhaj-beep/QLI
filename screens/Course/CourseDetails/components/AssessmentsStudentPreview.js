import { ScrollView, Text, VStack, Button, Radio, HStack, View } from "native-base"
import React from "react"
import AppBar from "../../../components/Navbar"
import { Dimensions } from "react-native"

const {width, height} = Dimensions.get('window')

const AssessmentsStudentPreview = ({navigation, route}) => {
    const assessment = route.params.assessment
    console.log('Is it here: =====================>', assessment)

    const AppBarContent = {
        title: 'Assessment',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person',
    };

    const RenderR = ({props}) => {
        let Choice = props.assessmentChoice;
        return (
          <VStack space={2}>
            <Text style={{fontSize: 15,color: '#000000',fontWeight: 'bold',maxWidth:width / 1}}>
              {props.assessmentOrder}. {' '} {props.assessmentQuestion}
            </Text>
            <HStack space={6} m={2} justifyContent="space-between">
              <View style={{maxWidth:width / 1}}>
                <Radio.Group size="sm" name="Radio01" colorScheme={'primary'} onChange={(value)=>{}}>
                {
                  Choice.map((data, index)=> {
                    return (
                      <Radio value={index} my={1} key={index} size="sm">
                        <Text maxWidth={width*0.68}>{data}</Text>
                      </Radio>
                    );
                  })
                  }
                </Radio.Group>
              </View>
              <View>
                <Text style={{fontSize:13,borderRadius:5,fontWeight:'bold'}} color={'primary.100'}>{props.point} Points</Text>
              </View>
            </HStack>
          </VStack>
        );
    }

    return (
        <VStack flex={1}>
            <AppBar props={AppBarContent} />
            <ScrollView>
                <VStack flex={1} width={'95%'} alignSelf={'center'}>
                    <Text mt={1} mb={4} style={{fontSize: 17,color: '#000000',fontWeight: 'bold'}}>{assessment.hasOwnProperty('lessonName') ? assessment.lessonName : assessment.assessmentTitle}</Text>
                    {
                        assessment.assessmentDetails.map((data, index) => {
                            return (
                                <VStack key={index}>
                                    <RenderR props={data}/>
                                </VStack>
                            )
                        })
                    }
                </VStack>
            </ScrollView>
            <Button bottom={0} isDisabled={true}>Submit</Button>
        </VStack>
    )
}

export default AssessmentsStudentPreview