import {BaseURL} from '../../StaticData/Variables';

const GetAllMessagesFromStudent = async (GUser, email, JWT, User_ID) => {
    const requestOptions = {
        method: 'GET',
        headers: !GUser ? {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-auth-token': JWT,
        } : {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          gmailUserType: 'INSTRUCTOR',
          token: email,
        }
    };
    const response = await fetch('https://api-uat.qlearning.academy/api/v1/messaging/getAllMessages?userType=INSTRUCTOR&userId=' + User_ID, requestOptions)
    return response.json();
}

export default GetAllMessagesFromStudent;