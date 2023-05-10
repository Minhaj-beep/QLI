const PushNotificationRegister = async (token, userId) => {
  // console.log(email + ' ' + code);
  const requestOptions = {
    method: 'POST',
    // headers:{
    //   'Accept': 'application/json',
    //   'Content-Type': 'application/json',
    //   'x-auth-token':UserD.JWT,
    // },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        token: token,
        tokenType: "APP",
        userId: userId
    }),
  };
  console.log(requestOptions);
  const response = await fetch(
    'https://lb-dev.qlearning.academy/notification/register/fcm',
    requestOptions,
  );
  return response.json();
};

export {PushNotificationRegister};
