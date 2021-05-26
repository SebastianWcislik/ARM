import React, { useEffect, useState } from "react";
import { vh } from "react-native-viewport-units-fix";
import { getToken } from "../API/token";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";

const serwerAdress = "https://arm-dev.herokuapp.com"; // API

const dismissKeyboard = () => {
  if (Platform.OS != "web") {
    Keyboard.dismiss();
  }
};

export default function ARMChangePassword({ navigation }) {
  const [loggedUser, setLoggedUser] = useState("");

  const [userEmail, setUserEmail] = useState("");

  const [shouldShow, setShouldShow] = useState(true);
  const [errMessage, setErrMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const GetLoggedUser = () => {
    getToken().then((res) => {
      setLoggedUser(res);
      fetch(serwerAdress + "/getUserInfo/" + "'" + res + "'")
        .then((response) => response.json())
        .then((json) => {
          setUserEmail(json.Email);
        });
    });
  };

  const GetUserPassword = () => {
    setErrMessage("");

    fetch(
      serwerAdress +
        "/getPassword/" +
        "'" +
        userEmail +
        "'" +
        "/" +
        "'" +
        oldPassword +
        "'"
    )
      .then((response) => response.json())
      .then((json) => {
        if (json[0].result == 0) {
          setErrMessage("Podano złe hasło");
          setOldPassword("");
        }

        if (json[0].result == 1) {
          setShouldShow(!shouldShow);
        }
      });
  };

  const SetUserPassword = () => {
    setErrMessage("");

    fetch(
      serwerAdress +
        "/setPassword/" +
        "'" +
        userEmail +
        "'" +
        "/" +
        "'" +
        newPassword +
        "'"
    )
      .then((response) => response.json())
      .then((json) => {
        if (json[0].result == 0) {
          setErrMessage("Coś poszło nie tak, spróbuj ponownie");
        }

        if (json[0].result == 1) {
          setShouldShow(!shouldShow);
          setNewPassword("");
          setOldPassword("");
          setErrMessage("Udało się zmienić hasło");
        }
      });
  };

  useEffect(() => {
    GetLoggedUser();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
      <SafeAreaView style={styles.body}>
        <Text style={styles.loggedUserStyle}>
          Zalogowany jako, {loggedUser ? loggedUser : null}
        </Text>
        <View>
          <Text style={styles.title}>Zmiana hasła</Text>
          <View>
            {shouldShow ? (
              <View>
                <TextInput
                  secureTextEntry={true}
                  style={myProfile.newPasswordText}
                  placeholder="Podaj stare hasło"
                  value={oldPassword}
                  onChangeText={(val) => setOldPassword(val)}
                />
                <TouchableOpacity
                  style={navigationStyle.navigationButton}
                  onPress={GetUserPassword}
                >
                  <Text style={navigationStyle.navigationButtonText}>
                    Zmień hasło
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TextInput
                  secureTextEntry={true}
                  style={myProfile.newPasswordText}
                  placeholder="Podaj nowe hasło"
                  value={newPassword}
                  onChangeText={(val) => setNewPassword(val)}
                />
                <TouchableOpacity
                  style={navigationStyle.navigationButton}
                  onPress={SetUserPassword}
                >
                  <Text style={navigationStyle.navigationButtonText}>
                    Zmień hasło
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {errMessage ? (
              <View style={styles.errMessageStyle}>
                <Text style={styles.errMessageColor}>{errMessage}</Text>
              </View>
            ) : null}
            <TouchableOpacity
              style={navigationStyle.navigationButton}
              onPress={() =>
                navigation.navigate("Mój profil", { name: "Mój profil" })
              }
            >
              <Text style={navigationStyle.navigationButtonText}>
                Powrót do mojego profilu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "dodgerblue",
  },
  title: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 2.5 * vh,
    fontWeight: "bold",
    marginBottom: "5%",
    marginTop: "5%",
  },
  users: {
    alignItems: "center",
    fontSize: 2.3 * vh,
    marginTop: 20,
  },
  errMessageStyle: {
    padding: 10,
    position: "relative",
    width: 200,
  },
  errMessageColor: {
    color: "orange",
  },
  loggedUserStyle: {
    position: "absolute",
    top: 20,
    left: 0,
    fontSize: 1.5 * vh,
  },
});

const navigationStyle = StyleSheet.create({
  navigationButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 1 * vh,
    backgroundColor: "#0064C8",
    marginTop: 10,
    borderRadius: 5,
  },
  navigationButtonText: {
    alignItems: "center",
    fontSize: 2 * vh,
    color: "white",
  },
});

const myProfile = StyleSheet.create({
  newPasswordText: {
    height: 5 * vh,
    width: "95%",
    margin: 5,
    marginTop: 15,
    marginBottom: 5,
  },
});
