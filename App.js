import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { render } from "react-dom";
import { login } from "./API/mock";
import { setToken } from "./API/token";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";

// Deklaracja zmiennych globalnych

const serwerAdress = "http://192.168.0.27:3000"; // baza danych

// APP

export default function App() {
  // Deklaracja zmiennych

  const Stack = createStackNavigator(); // menu nawigacyjne

  // Menu nawigacyjne

  return (
    <NavigationContainer style={navigationStyle.navigationMenu}>
      <Stack.Navigator>
        <Stack.Screen
          name="Logowanie"
          component={ARMLogin}
          options={({ title: "Logowanie" }, { headerShown: false })}
        />
        <Stack.Screen
          name="ARM"
          component={ARMUsersList}
          options={({ title: "ARM" }, { headerShown: false })}
        />
        <Stack.Screen
          name="Mój profil"
          component={ARMMyProfile}
          options={({ title: "Mój profil" }, { headerShown: false })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Widoki aplikacji

// Login

export function ARMLogin({ navigation }) {
  // Zmienne do logowania
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [resUser, setResUser] = useState([]);

  // odpowiedź z API - errorHandler
  const [errMessage, setErrMessage] = useState("");

  // Pokazywanie/ukrywanie przycisków do logowania
  const [shouldShow, setShouldShow] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(true);

  const loginUser = () => {
    setErrMessage("");

    login(username, password, resUser)
      .then(async (res) => {
        await setToken(res.auth_token);
        navigation.navigate("ARM", { name: "ARM" });
      })
      .catch((err) => setErrMessage(err.message));
    setShouldShow(!shouldShow);
    setShouldDisable(!shouldDisable);
  };

  const getLoginUser = () => {
    setErrMessage("");

    fetch(serwerAdress + "/userToLogin?username=" + '"' + username + '"')
      .then((response) => response.json())
      .then((json) => {
        if (json[0] == undefined || json[0] == "undefined") {
          setErrMessage("Podany użytkownik nie istnieje");
        }

        if (json[0] != undefined) {
          setResUser(json);
          setShouldShow(!shouldShow);
          setShouldDisable(!shouldDisable);
        }
      });
  };

  return (
    <SafeAreaView style={styles.body} onTouchStart={Keyboard.dismiss}>
      <View>
        <Text style={styles.title}>Logowanie</Text>
        <TextInput
          editable={shouldDisable}
          style={styles.textInputStyle}
          placeholder="Nazwa użytkownika"
          value={username}
          onChangeText={(val) => setUsername(val)}
        />
        {shouldShow ? (
          <View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Hasło"
              value={password}
              onChangeText={(val) => setPassword(val)}
            />
            <TouchableOpacity
              style={navigationStyle.navigationButton}
              onPress={loginUser}
            >
              <Text style={navigationStyle.navigationButtonText}>Zaloguj</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={navigationStyle.navigationButton}
            onPress={getLoginUser}
          >
            <Text style={navigationStyle.navigationButtonText}>Zaloguj</Text>
          </TouchableOpacity>
        )}
        {errMessage ? (
          <View style={styles.errMessageStyle}>
            <Text>{errMessage}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

// Lista użytkowników

export function ARMUsersList({ navigation }) {
  const [Users, setUsers] = useState([]); // lista użytkowników

  const GetList = () => {
    fetch(serwerAdress + "/users")
      .then((response) => response.json())
      .then((json) => {
        setUsers(json);
      });
  };

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.container}>
        <Text style={styles.title}>Aplikacja Ratowników Mazowsza</Text>
        <View style={styles.usersList}>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={Users}
            renderItem={({ item }) => (
              <View>
                {item.State == 1 ? (
                  <Text style={styles.users}>
                    {item.Name} -{" "}
                    <Text style={states.unavailable}>Niedostępny</Text>
                  </Text>
                ) : item.State == 2 ? (
                  <Text style={styles.users}>
                    {item.Name} - {""}
                    <Text style={states.available}>Dostępny</Text>
                  </Text>
                ) : item.State == 3 ? (
                  <Text style={styles.users}>
                    {item.Name} - {""}
                    <Text style={states.busy}>Na akcji</Text>
                  </Text>
                ) : (
                  <Text style={styles.users}>
                    Błąd wczytywania użytkowników
                  </Text>
                )}
              </View>
            )}
          />
        </View>
        <View style={styles.refreshbutton}>
          <TouchableOpacity
            style={navigationStyle.navigationButton}
            onPress={GetList}
          >
            <Text style={navigationStyle.navigationButtonText}>
              Wyświetl/Odśwież listę
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={navigationStyle.navigationButton}
            onPress={() =>
              navigation.navigate("Mój profil", { name: "Mój profil" })
            }
          >
            <Text style={navigationStyle.navigationButtonText}>Mój profil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={navigationStyle.navigationButton}
            onPress={() =>
              navigation.navigate("Logowanie", { name: "Logowanie" })
            }
          >
            <Text style={navigationStyle.navigationButtonText}>Wyloguj</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Mój profil

export function ARMMyProfile({ navigation }) {
  return (
    <SafeAreaView style={styles.body}>
      <View>
        <Text style={styles.title}>Mój profil</Text>
        <TouchableOpacity
          style={navigationStyle.navigationButton}
          onPress={() => navigation.navigate("ARM", { name: "ARM" })}
        >
          <Text style={navigationStyle.navigationButtonText}>
            Powrót do listy
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Style kaskadowe do listy użytkowników

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "dodgerblue",
  },
  container: {
    height: "80%",
  },
  title: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: "5%",
    marginTop: "5%",
  },
  usersList: {
    marginTop: "5%",
    marginBottom: 5,
    height: "68.9%",
    alignItems: "center",
  },
  users: {
    alignItems: "center",
    fontSize: 18,
    marginTop: 20,
  },
  refreshbutton: {
    marginTop: "5%",
  },
  button: {
    alignItems: "center",
    fontSize: 15,
    backgroundColor: "lightblue",
    padding: 10,
    minWidth: 100,
  },
  textInputStyle: {
    height: "10%",
    width: "95%",
    margin: 5,
    marginBottom: 15,
  },
  errMessageStyle: {
    padding: 10,
    position: "relative",
    width: 200,
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
  navigationMenu: {
    display: "none",
    alignContent: "flex-end",
    justifyContent: "center",
  },
  navigationButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#0064C8",
    width: 200,
  },
  navigationButtonText: {
    alignItems: "center",
    fontSize: 15,
    color: "white",
  },
});
