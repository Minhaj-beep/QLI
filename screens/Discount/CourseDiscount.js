import React, { useEffect, useRef, useState, useCallback } from "react"
import CourseDiscountInterceptor from "./CourseDiscountInterceptor"
import { useIsFocused } from "@react-navigation/native";
import { socket } from "../StaticData/SocketContext";

const CourseDiscount = ({navigation}) => {
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
        socket.emit("newMessageCount", { ticketType: "DISCOUNT" }, async (response) => {
        console.log("newMessageCount response===>", response)
        setMessageCountArray(response)
        });
    }
    
    return <CourseDiscountInterceptor props={messageCountArray} />
}

export default CourseDiscount

  