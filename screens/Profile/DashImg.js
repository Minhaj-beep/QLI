import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  Dimensions,
  Platform
} from 'react-native';
import {
  Image,
  ZStack,
  VStack,
  HStack,
  Button,
  Center,
  Box,
  IconButton,
  Modal,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { BaseURL } from '../StaticData/Variables';
import {
  setLoading,
  setProfileData,
} from '../Redux/Features/authSlice';
import { setUserImage, setProfileImg } from '../Redux/Features/loginSlice';
const { width, height } = Dimensions.get('window')

export default function DashImg() {
  const dispatch = useDispatch();
  const Email = useSelector(state => state.Login.email);
  const ProfileImg = useSelector(state => state.Login.UserImage);
  const ProfileD = useSelector(state => state.Auth.ProfileData);
  const [PImage, setPImage] = useState();
  const [upImage, setUpImage] = useState(null);
  const [DImage, setDImage] = useState(null);
  const [ShowImgUp, setShowImgUp] = useState(false);
  const [imageStyle, setImageStyle] = useState({})

  console.log(ProfileImg, ' is the profile image');
  console.log( width, height , ' _________________________________WIDTH_AND_HEIGHT___________________________');

  useEffect(() => {
    upImage !== null ? console.log(upImage, 'THIS') : setPImage(ProfileImg)
  }, [PImage, upImage, ProfileImg]);

  useEffect(()=> {
    if(Platform.OS == 'ios' && width > 700 && height > 1100) {
      setImageStyle({
        size: 250,
        rounded: 150,
        iconMt: "230",
        iconMl: "250"
      })
    } 
    // else if (Platform.OS == 'ios' && width == 1024 && height == 1366) {
    //   setImageStyle({
    //     size: 250,
    //     rounded: 150,
    //     iconMt: "230",
    //     iconMl: "250"
    //   })
    // } else if (Platform.OS == 'ios' && width == 744 && height == 1133) {
    //   setImageStyle({
    //     size: 250,
    //     rounded: 150,
    //     iconMt: "230",
    //     iconMl: "250"
    //   })
    // }  
    else {
      setImageStyle({
        size: 150,
        rounded: 100,
        iocnMt: "150",
        iconMl: "150"
      })
    }
  },[])

  const getProfile = (email) => {
    dispatch(setLoading(true))
    if( email ===''){
      alert('Something is wrong, please login again');
    }else{
      const requestOptions = {
        method: 'GET',
        // headers:{
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/json',
        //   'x-auth-token':UserD.JWT,
        // },
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'gmailUserType':'INSTRUCTOR',
          'token':Email
        },
      }
      // console.log(requestOptions);
      fetch(BaseURL+'getInstructorByEmail?instructorEmail='+email, requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.status === 200)
          {
            dispatch(setProfileData(result.data));
            if(result.data.profileImgPath != null && result.data.profileImgPath !== ''){
              console.log('Profile image retrieved')
              console.log(result.data.profileImgPath + 'image');
              dispatch(setUserImage(result.data.profileImgPath))
              dispatch(setProfileImg(true));
            }else{
              console.log('No profile image')
              dispatch(setProfileImg(false));
            }
            dispatch(setUserImage(result.data.profileImgPath))
            dispatch(setLoading(false));
          }else if(result.status > 200){
            dispatch(setLoading(false))
            alert(result.message);
            console.log(result.message);
          }
          // console.log(result);
        }).catch(error =>{
          dispatch(setLoading(false))
          console.log(error)
          alert(error);
        })
    }
  };

  const uploadImage = async image => {
    const formData = new FormData();
    // var myHeaders = new Headers();
    // myHeaders.append('x-auth-token',Jwt_Token)
    console.log(image);
    let match = /\.(\w+)$/.exec(image);
    let type = match ? `image/${match[1]}` : 'image';
    let filename = image.split('/').pop();
    formData.append('image', {uri: image, name: filename, type});
    // formData.append('image',image[0])

    if (image === '') {
      alert('Something is wrong, please try again');
    } else {
      const requestOptions = {
        method: 'POST',
        // headers:myHeaders,
        headers: {
          // 'Accept': 'application/json',
          // 'Content-Type': 'application/json',
          gmailusertype: 'STUDENT',
          token: Email,
        },
        body: formData,
      };
      console.log(requestOptions);
      await fetch(BaseURL + 'uploadProfileImage', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 200) {
            setShowImgUp(false);
            dispatch(setProfileImg(true));
            getProfile()
            alert('Uploaded Successfully !');
            console.log(result);
          } else if (result.status > 200) {
            setShowImgUp(false);
            alert('Failed: ' + result.message);
            console.log(result);
          }
          console.log("Result ====================> ",result);
        })
        .catch(error => {
          setShowImgUp(false);
          console.log('Error:' + error);
          alert(error);
        });
    }
  };

  const OpenPhotoLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      enableRotationGesture: true,
    })
      .then(image => {
        setDImage(image.path);
        setShowImgUp(true);
        console.log(image);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View>
      <Modal isOpen={ShowImgUp} onClose={() => setShowImgUp(false)} size="lg">
        <Modal.Content maxWidth="600">
          <Modal.CloseButton />
          {/* <Modal.Header>Verificaton</Modal.Header> */}
          <Modal.Body>
            <VStack>
              <Box
                flex={1}
                p={2}
                w="90%"
                mx="auto"
                justifyContent="center"
                alignContent="center">
                {DImage && (
                  <Image
                    alignSelf={'center'}
                    rounded={imageStyle.rounded}
                    size={imageStyle.size}
                    source={{uri: DImage}}
                    alt=" "
                    mt="50"
                    ml="50"
                    mb="10"
                  />
                )}

                <HStack
                  space={5}
                  mt={4}
                  mb={4}
                  justifyContent="center"
                  alignContent="center">
                  <Button
                    bg="#3e5160"
                    pt={5}
                    pb={5}
                    pl={10}
                    pr={10}
                    onPress={() => {
                      dispatch(setLoading(true));
                      setUpImage(DImage);
                      uploadImage(DImage);
                      dispatch(setLoading(false));
                    }}>
                    Upload
                  </Button>

                  <Button
                    bg="#3e5160"
                    pt={5}
                    pb={5}
                    pl={10}
                    pr={10}
                    onPress={() => {
                      dispatch(setLoading(false));
                      setShowImgUp(false);
                    }}>
                    Cancel
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <ZStack>
        {upImage === null && (
          <Image
            rounded={imageStyle.rounded}
            size={imageStyle.size}
            source={{uri: PImage}}
            alt=" "
            mt="50"
            ml="50"
          />
        )}
        {upImage && (
          <Image
            rounded={imageStyle.rounded}
            size={imageStyle.size}
            source={{uri: upImage}}
            alt=" "
            mt="50"
            ml="50"
          />
        )}
        {console.log('Profile Image is this one : ', ProfileImg)}
        {!ProfileImg && (
          <Image
            rounded={imageStyle.rounded}
            size={imageStyle.size}
            source={require('../../assets/personIcon.png')}
            alt=" "
            mt="50"
            ml="50"
          />
        )}
        <TouchableOpacity onPress={() => OpenPhotoLibrary()}>
          <Image
            size={50}
            resizeMode={'contain'}
            source={require('../../assets/CameraImg.png')}
            alt="cameraImg"
            mt={imageStyle.iconMt}
            ml={imageStyle.iconMl}
          />
        </TouchableOpacity>
      </ZStack>
    </View>
  );
}

const styles = StyleSheet.create({});
