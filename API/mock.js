import { useEffect, useState } from "react";

const serwerAdress = "http://192.168.0.27:3000";

const mockSuccess = (value) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), 100);
  });
};

const mockFailure = (value) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(value), 100);
  });
};

export function login(username, password, resUser) {
  //console.log(username, password, resUser);
  // do zrobienia zamienić na wywoływanie procedury porównującej hasła w bazie
  var result = fetch(
    serwerAdress + "/userToLogin?username=" + '"' + username + '"'
  )
    .then((response) => response.json())
    .then((json) => {
      if (username == json[0].Name.toString()) {
        return mockFailure({
          error: 500,
          message: "Wpisano złe hasło, spróbuj ponownie",
        });
      }
      if (username != json[0].Name.toString()) {
        return mockSuccess({
          id: resUser[0].Id,
          auth_token: "successful_fake_token",
        });
      }
    });

  return result;
}

export const createAccount = (email, password, shouldSucceed = true) => {
  console.log(email, password);

  if (!shouldSucceed) {
    return mockFailure({ error: 500, message: "Something went wrong!" });
  }

  return mockSuccess({ auth_token: "successful_fake_token" });
};
