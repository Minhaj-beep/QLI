import {BaseURL} from '../../StaticData/Variables';

const RequestForDiscount = async (email, numberOfCoupon, discountPercentage, couponName, startDate, expiryDate, discountId ) => {
  const requestOptions = {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        gmailUserType: 'INSTRUCTOR',
        token: email,
    },
    body: JSON.stringify({
        numberOfCoupon: numberOfCoupon,
        discountPercentage: discountPercentage,
        couponName: couponName,
        startDate: startDate,
        expiryDate: expiryDate,
        discountId: discountId,
    }),
  };
  console.log(requestOptions);
  const response = await fetch(
    BaseURL + '/v1/courseDiscount/requestForDiscount',
    requestOptions,
  );
  return response.json();
};

export {RequestForDiscount};
