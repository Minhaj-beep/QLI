/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const RaiseWithdrawRequest = async (email, requestedAmount ) => {
  const requestOptions = {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        gmailUserType: 'INSTRUCTOR',
        token: email,
    },
    body: JSON.stringify({
        requestedAmount: requestedAmount,
    }),
  };
  const response = await fetch(
    BaseURL + '/v1/withdraw/raiseWithdrawRequest',
    requestOptions,
  );
  return response.json();
};

export {RaiseWithdrawRequest};
