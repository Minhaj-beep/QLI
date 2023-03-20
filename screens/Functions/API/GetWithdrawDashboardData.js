/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetWithdrawDashboardData = async (email) => {
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
    BaseURL + 'v1/withdraw/withdrawDashboardData',
    requestOptions,
  )
  return response.json();
};

export {GetWithdrawDashboardData};
