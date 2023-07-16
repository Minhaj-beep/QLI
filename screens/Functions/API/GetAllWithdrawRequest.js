import {BaseURL} from '../../StaticData/Variables';

const GetAllWithdrawRequest = async (email) => {
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
    BaseURL + 'v1/withdraw/getAllWithdrawRequest',
    requestOptions,
  )
  return response.json();
};

export {GetAllWithdrawRequest};
