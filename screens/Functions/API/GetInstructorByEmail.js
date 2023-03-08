/* eslint-disable no-alert */
import {BaseURL} from '../../StaticData/Variables';

const GetInstructorByEmail = async (email) => {
  const requestOptions = {
    method: 'GET',
    // headers:{
    //   'Accept': 'application/json',
    //   'Content-Type': 'application/json',
    //   'x-auth-token':UserD.JWT,
    // },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      gmailUserType: 'INSTRUCTOR',
      token: email,
    },
  };
  const response = await fetch(
    BaseURL + 'getInstructorByEmail?email=' + email,
    requestOptions,
  );
  return response.json();
};

export {GetInstructorByEmail};
