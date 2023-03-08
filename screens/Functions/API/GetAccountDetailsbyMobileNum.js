/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetAccountDetailsbyMobileNum = async (num) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      userType: 'INSTRUCTOR',
    },
    body: JSON.stringify({
        mobileNumber: num,
        userType: 'INSTRUCTOR',
    }),
  };
  const response = await fetch(
    BaseURL + '/getAccountDetailsbyMobileNum',
    requestOptions,
  )
  return response.json();
};

export {GetAccountDetailsbyMobileNum};
