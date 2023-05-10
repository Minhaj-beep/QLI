import React,{useState,useEffect,useRef, useCallback } from 'react';
import LiveCourseDetails from './LiveCourseDetails';
import { useIsFocused } from '@react-navigation/native';
import { socket } from '../../StaticData/SocketContext';

const LCourseDetails = ({navigation}) => {
  const isFocused = useIsFocused();
  const [timerId, setTimerId] = useState(null);
  const [messageCountArray, setMessageCountArray] = useState([])

  useEffect(()=>{
    if(isFocused) {
      console.log('_______________________MOUNTED__________________________')
      onFocus()
    } else {
      console.log('_______________________UNMOUNTED__________________________')
      onBlur()
    }
  },[isFocused])

  useEffect(()=>{
    if(timerId !== null){
      return ()=> {
        console.log('_______________________UNMOUNTED__________________________')
        onBlur()
      }
    }
  },[timerId])

  const onFocus = () => {
    socket.open()
    socket.on("connection-success", async(response) => {
        console.log(`Socket connected ${response.socketId}`);
    })

    const intervalId = setInterval(() => {
      console.log('Game on________________________________________________');
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

  const newMessageCount = (data) => {
    socket.emit("newMessageCount", { ticketType: "COURSE" }, async (response) => {
      console.log("newMessageCount response===>", response)
      setMessageCountArray(response)
    });
  }

  return <LiveCourseDetails props={messageCountArray} />
}

export default LCourseDetails

// const isFocused = useIsFocused();
//   useEffect(()=>{
//     if(isFocused) {
//       console.log('_______________________MOUNTED__________________________')
//     } else {
//       console.log('_______________________UNMOUNTED__________________________')
//     }
//   },[isFocused])
//   useEffect(()=>{
//     return ()=> {
//       console.log('_______________________UNMOUNTED__________________________')
//     }
//   },[])