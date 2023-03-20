import {BaseURL} from '../../StaticData/Variables';

const SubmitForApproval = async (email, discountId) => {
  const requestOptions = {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        gmailUserType: 'INSTRUCTOR',
        token: email,
    },
    body: JSON.stringify({
        discountId: discountId,
    }),
  };
  console.log(requestOptions);
  const response = await fetch(
    BaseURL + '/v1/courseDiscount/submitForApproval',
    requestOptions,
  );
  return response.json();
};

export {SubmitForApproval};
