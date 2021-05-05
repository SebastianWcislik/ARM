import { useEffect, useState } from "react";

const serwerAdress = "http://arm-dev.herokuapp.com";

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

export function login(email, password) {
  var result = fetch(
    serwerAdress +
      "/getPassword?email=" +
      '"' +
      email +
      '"' +
      "&password=" +
      '"' +
      password +
      '"'
  )
    .then((response) => response.json())
    .then((json) => {
      if (json[0].result == 1)
        return mockSuccess({
          loggedUser: email,
          result: json[0],
          message: "Success",
        });
      else if (json[0].result == 0)
        return mockFailure({ message: "Wpisano złe hasło, spróbuj ponownie" });
      else return mockFailure({ message: "Błąd serwera" });
    });

  return result;
}

export function createAccount(email, password, shouldSucceed = true) {
  console.log(email, password);

  if (!shouldSucceed) {
    return mockFailure({ error: 500, message: "Something went wrong!" });
  }

  return mockSuccess({ auth_token: "successful_fake_token" });
}
