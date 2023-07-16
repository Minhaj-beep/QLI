import React,{useState,useEffect, useRef, useCallback} from 'react';
import AssessmentCard from './AssessmentTab/AssessmetCard';
import { socket } from '../StaticData/SocketContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const AssessmentTab = (props) => {
  const pushData = props.hasOwnProperty('screenProps') ? props.screenProps : null
  // console.log(pushData)
  const navigation = useNavigation()
  const isFocused = useIsFocused();
  const [timerId, setTimerId] = useState(null);
  const [messageCountArray, setMessageCountArray] = useState([])

  useEffect(() => {
    const onFocus = () => {
      console.log('Hello_________________________________________________');
      socket.open()
      socket.on("connection-success", async(response) => {
          console.log(`Socket connected ${response.socketId}`);
      })

      const intervalId = setInterval(() => {
        console.log('Game on________________________________________________111111111111');
        newMessageCount()
      }, 1000);
      setTimerId(intervalId);
    };

    const onBlur = () => {
      console.log('Bye__________________________________________________');
      // socket.off("message", receiveMessages)
      socket.disconnect()
      socket.close();
      socket.on("disconnect", async () => {
          console.log("client disconnected from server");
      })
      clearInterval(timerId);
    };

    // if (isFocused) {
    //   onFocus();
    // } else {
    //   onBlur();
    // }

    const unsubscribe = navigation.addListener('focus', onFocus);
    const unsubscribeBlur = navigation.addListener('blur', onBlur);

    return () => {
      unsubscribe();
      unsubscribeBlur();
      clearInterval(timerId);
    };
  }, [isFocused]);

  useEffect(()=>{
    if(timerId !== null && !isFocused){
      clearInterval(timerId)
      return ()=> {
        console.log('_______________________UNMOUNTED__________________________')
        clearInterval(timerId)
      }
    }
  },[timerId, isFocused])

  const newMessageCount = (data) => {
    socket.emit("newMessageCount", { ticketType: "ASSESSMENT" }, async (response) => {
      console.log("newMessageCount response===>", response)
      setMessageCountArray(response)
    });
  }

  return <AssessmentCard props={messageCountArray} pushData={pushData} />
}

export default AssessmentTab