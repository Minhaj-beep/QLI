import {BaseURL} from '../../StaticData/Variables';

const LearnerList = async (email) => {
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
    BaseURL + 'v1/withdraw/myLearners',
    requestOptions,
  )
  return response.json();
};

export {LearnerList};
