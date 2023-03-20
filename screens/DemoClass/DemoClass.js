import React, {useEffect, useState} from "react"
import AppBar from "../components/Navbar"
import { StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {HStack, VStack, Image, Center, View, Text, Icon, ScrollView } from 'native-base';
const { width, height } = Dimensions.get('window')
import Demo from "./components/Demo";

const DemoClass = ({navigation}) => {

    const AppBarContent = {
        title: 'Demo Class',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
    }

    return (
        <View style={{flex:1}}>
            <AppBar props={AppBarContent} />
            <Demo navigation={navigation} />
        </View>
    )
}

export default DemoClass