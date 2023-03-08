import React from "react"
import { View, Text } from "native-base"
import AppBar from "../components/Navbar"

const CourseDiscount = ({navigation}) => {
    const AppBarContent = {
        title: 'Course Discount',
        navigation: navigation,
        ArrowVisibility: true,
        RightIcon1:'notifications-outline',
        RightIcon2:'person'                  
    }

    return (
        <View>
            <AppBar props={AppBarContent} />
            <Text>Course Discount</Text>
        </View>
    )
}

export default CourseDiscount