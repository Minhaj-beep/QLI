import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {HStack, IconButton, VStack} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
// import {setLoading,setBankData} from '../redux-toolkit/features/userDataSlice';

const ProfileSettings = props => {
  const dispatch = useDispatch();
  const navigation = props.navigation;

  return (
    <VStack ml={3}>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Profile</Text>
          <IconButton
            onPress={() => navigation.navigate('Profile')}
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('MyCourses')}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>My Courses</Text>
          <IconButton
            onPress={() => navigation.navigate('Tabs', {screen: 'Courses'})}
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('DemoClass')}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Demo Class</Text>
          <IconButton
            onPress={() => navigation.navigate('DemoClass')}
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('CourseDiscount')}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Coupon</Text>
          <IconButton
            onPress={() => navigation.navigate('CourseDiscount')}
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity
        // onPress={() => navigation.navigate('MyAssessment')}>
        onPress={() => navigation.navigate('Tabs', {screen: 'Courses', params: { initialTab: 'AssessmentTab', screenProps: {} }})}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>My Assessments</Text>
          <IconButton
            onPress={() => navigation.navigate('Tabs', {screen: 'Home'})}
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Tabs', {screen: 'Messages'})}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Messages</Text>
          <IconButton
            onPress={() => navigation.navigate('Tabs', {screen: 'Messages'})}
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('NotificationsManagement')}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Notification</Text>
          <IconButton
            onPress={() => navigation.navigate('NotificationsManagement')}
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('AccountSettings')}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Account Settings</Text>
          <IconButton
            onPress={() => navigation.navigate('AccountSettings')}
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>
{/* 
      <TouchableOpacity
        onPress={() => {
          // GetAccountInfo()
          navigation.navigate('Tabs', {screen: 'Home'});
        }}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Payment Methods</Text>
          <IconButton
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => {
          // GetAccountInfo()
          navigation.navigate('PayoutList');
        }}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Payment Info</Text>
          <IconButton
            onPress={()=>navigation.navigate('PayoutList')}
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => navigation.navigate('Tabs', {screen: 'Home'})}>
        <HStack style={styles.ProfileSettings}>
          <Text style={styles.ProfileText}>Help & Support</Text>
          <IconButton
            onPress={() => navigation.navigate('Tabs', {screen: 'Home'})}
            icon={
              <Icon size={20} name="chevron-forward-outline" color="#395061" />
            }
          />
        </HStack>
      </TouchableOpacity> */}
    </VStack>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  ProfileSettings: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ProfileText: {
    color: '#395061',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
