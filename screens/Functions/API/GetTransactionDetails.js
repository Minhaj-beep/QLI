/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetTransactionDetails = async (email) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'INSTRUCTOR',
      token: email,
    },
  };
  const response = await fetch(
    BaseURL + '/v1/withdraw/getTransactionDetails',
    requestOptions,
  );
  return response.json();
};

export {GetTransactionDetails};