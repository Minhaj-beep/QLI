import React, {useEffect, useState, useCallback} from 'react';
import { View, Text, TextInput, Button } from "react-native"
import { io } from 'socket.io-client';

const DemoChat = () => {
    let socket = io("wss://api.dev.qlearning.academy/ticket")
    const [message, setMessage] = useState('')

    useEffect(()=>{
        socket.connect()
        // socket.open()
        socket.on("connection-success", async(response) => {
          console.log(`Socket connected ${response.socketId}`);
        })
        socket.emit('join-instructor', { courseCode: '651a9d7a-47c8-43cc-bd18-c8fb32da91c6',  userId: '75454b82-cdde-4e34-9f64-c59e6a26ce2d', userName: 'Jibo  Ram' }, async (res) => {
          console.log(`join-instructor ${res}`);
          console.log(res)
        })
        socket.emit("getPreviousMessage", { courseCode: '651a9d7a-47c8-43cc-bd18-c8fb32da91c6', ticketType: "COURSE" }, (response) => {
            console.log("getPreviousMessage", response)
          })
          //courseCode: 651a9d7a-47c8-43cc-bd18-c8fb32da91c6 userId: 75454b82-cdde-4e34-9f64-c59e6a26ce2d userName: Jibo  Ram
      },[])
      
      const receiveMessages = useCallback((response) => {
        console.log("recev live chat-------->");
        console.log(response);
      }, [])
    
      const sendMsg = (Message) => {
        console.log('Send Message: ', Message)
          socket.emit("sendMessage", {
              message: Message,
              courseCode: '651a9d7a-47c8-43cc-bd18-c8fb32da91c6',
              userName: 'Jibo  Ram',
              ticketType: "COURSE",
              courseType: "RECORDED",
              userId: '75454b82-cdde-4e34-9f64-c59e6a26ce2d',
              type: "TEXT"
          }, () => {
              console.log("sendMessage callback!")
          })
      }

    return (
        <View>
            <Text>Hello Demo</Text>
            <TextInput placeholder="Akhilesh" onChangeText={text => setMessage(text)} style={{width:"100%", borderBottomWidth:1, borderBottomColor:"red"}} />
            <Button title='Send' onPress={()=>sendMsg(message)} />
        </View>
    )
}

export default DemoChat