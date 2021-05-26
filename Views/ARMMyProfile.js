import React, { useEffect, useState } from "react";
import { vh } from "react-native-viewport-units-fix";
import { getToken, getRoleToken } from "../API/token";
import DropDownPicker from "react-native-dropdown-picker";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

const serwerAdress = "https://arm-dev.herokuapp.com"; // API

export default function ARMMyProfile({ navigation }) {
  const [loggedUser, setLoggedUser] = useState("");

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  const [currentState, setCurrentState] = useState("");
  const [selectedState, setSelectedState] = useState(1);

  const GetLoggedUser = () => {
    getToken().then((res) => {
      setLoggedUser(res);
      fetch(serwerAdress + "/getUserInfo/" + "'" + res + "'")
        .then((response) => response.json())
        .then((json) => {
          setUserName(json.Name);
          setUserEmail(json.Email);
          setCurrentState(json.State);
        });
    });
  };

  const SetUserState = () => {
    fetch(
      serwerAdress +
        "/getUserState/" +
        "'" +
        userEmail +
        "'" +
        "/" +
        "'" +
        selectedState +
        "'"
    ).then(GetLoggedUser);
  };

  const GetUserRole = () => {
    getRoleToken().then((res) => setUserRole(res));
  };

  useEffect(() => {
    GetLoggedUser();
    GetUserRole();
  }, []);

  return (
    <SafeAreaView style={styles.body}>
      <Text style={styles.loggedUserStyle}>
        Zalogowany jako, {loggedUser ? loggedUser : null}
      </Text>
      <View>
        <Text style={styles.title}>Mój profil</Text>
        <View>
          <Text style={myProfile.myData}>
            Imię: {userName ? userName : null}
          </Text>
          <Text style={myProfile.myData}>
            Email: {userEmail ? userEmail : null}
          </Text>
          <Text style={myProfile.myData}>
            Rola: {userRole ? userRole : null}
          </Text>
          <Text style={myProfile.myState}>
            Twój obecny status to:{" "}
            {currentState == 1 ? (
              <Text style={states.available}>Dostępny</Text>
            ) : currentState == 2 ? (
              <Text style={states.unavailable}>Niedostępny</Text>
            ) : currentState == 3 ? (
              <Text style={states.busy}>Na akcji</Text>
            ) : null}
          </Text>
          <Text style={myProfile.myData}>Zmień swój obecny status na: </Text>
          <DropDownPicker
            items={[
              { label: "Dostępny", value: 1 },
              { label: "Niedostępny", value: 2 },
              { label: "Na akcji", value: 3 },
            ]}
            containerStyle={{ height: 6 * vh }}
            defaultValue={selectedState}
            style={myProfile.statePicker}
            dropDownStyle={{ backgroundColor: "dodgerblue" }}
            onChangeItem={(itemValue) => setSelectedState(itemValue.value)}
          />
          <TouchableOpacity
            style={navigationStyle.navigationButton}
            onPress={SetUserState}
          >
            <Text style={navigationStyle.navigationButtonText}>
              Zmień status
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={navigationStyle.navigationButton}
            onPress={() =>
              navigation.navigate("Zmiana hasła", { name: "Zmiana hasła" })
            }
          >
            <Text style={navigationStyle.navigationButtonText}>
              Zmiana hasła
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              userRole == "Admin"
                ? navigationStyle.navigationButton
                : { display: "none" }
            }
            onPress={() =>
              navigation.navigate("Rejestracja", { name: "Rejestracja" })
            }
          >
            <Text style={navigationStyle.navigationButtonText}>
              Zarejestruj użytkownika
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={navigationStyle.navigationButton}
            onPress={() => navigation.navigate("ARM", { name: "ARM" })}
          >
            <Text style={navigationStyle.navigationButtonText}>
              Powrót do listy
            </Text>
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
  container: {
    height: 70 * vh,
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
  myState: {
    marginTop: 20,
    fontSize: 2 * vh,
    fontWeight: "bold",
  },
  statePicker: {
    backgroundColor: "dodgerblue",
  },
});
