import React, { useEffect, useState } from "react";
import { vh } from "react-native-viewport-units-fix";
import { getToken, getEmailToken } from "../API/token";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from "react-native";

const serwerAdress = "https://arm-dev.herokuapp.com"; // API

export default function ARMUserDetails({ navigation }) {
  const [loggedUser, setLoggedUser] = useState("");

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [userPhone, setUserPhone] = useState("");

  const GetLoggedUser = () => {
    getToken().then((res) => {
      setLoggedUser(res);
    });
  };

  const GetSelectedUserInfo = () => {
    getEmailToken().then((res) => {
      fetch(serwerAdress + "/getSelectedUserInfo/" + "'" + res + "'")
        .then((response) => response.json())
        .then((json) => {
          setUserName(json.Name ? json.Name : json[0].Name);
          setUserEmail(json.Email ? json.Email : json[0].Email);
          setCurrentState(json.State ? json.State : json[0].State);
          setUserRole(json.RoleName ? json.RoleName : json[0].RoleName);
          setUserPhone(json.Phone ? json.Phone : json[0].Phone);
        });
    });
  };

  useEffect(() => {
    GetLoggedUser();
    GetSelectedUserInfo();
  }, []);

  return (
    <SafeAreaView style={styles.body}>
      <Text style={styles.loggedUserStyle}>
        Zalogowany jako, {loggedUser ? loggedUser : null}
      </Text>
      <View>
        <Text style={styles.title}>Informacje o użytkowniku</Text>
        <View>
          <Text style={myProfile.myData}>
            Imię: {userName ? userName : null}
          </Text>
          <Text style={myProfile.myData}>
            Email: {userEmail ? userEmail : null}
          </Text>
          <Text style={myProfile.myData}>
            Telefon:{" "}
            <Text
              onPress={() => {
                Linking.openURL("tel:" + userPhone);
              }}
            >
              {userPhone ? userPhone : null}
            </Text>
          </Text>
          <Text style={myProfile.myData}>
            Rola: {userRole ? userRole : null}
          </Text>
          <Text style={myProfile.myData}>
            Status:{" "}
            {currentState == 1 ? (
              <Text style={states.available}>Dostępny</Text>
            ) : currentState == 2 ? (
              <Text style={states.unavailable}>Niedostępny</Text>
            ) : currentState == 3 ? (
              <Text style={states.busy}>Na akcji</Text>
            ) : null}
          </Text>

          <TouchableOpacity
            style={navigationStyle.navigationButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={navigationStyle.navigationButtonText}>Powrót</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
  loggedUserStyle: {
    position: "absolute",
    top: 20,
    left: 0,
    fontSize: 1.5 * vh,
  },
});

const states = StyleSheet.create({
  available: {
    color: "darkgreen",
  },
  unavailable: {
    color: "darkred",
  },
  busy: {
    color: "orange",
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
  myData: {
    fontSize: 2 * vh,
    padding: 2,
    marginTop: 5,
    fontWeight: "bold",
  },
});
