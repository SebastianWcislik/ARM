import React, { useState } from "react";
import { vh } from "react-native-viewport-units-fix";
import { useFocusEffect } from "@react-navigation/native";
import { getToken, setRoleToken, setEmailToken } from "../API/token";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";

const serwerAdress = "https://arm-dev.herokuapp.com"; // API

export default function ARMUsersList({ navigation }) {
  const [Users, setUsers] = useState([]); // lista użytkowników
  const [loggedUser, setLoggedUser] = useState("");

  const GetList = () => {
    fetch(serwerAdress + "/users")
      .then((response) => response.json())
      .then((json) => {
        setUsers(json);
      });
  };

  const GetLoggedUser = () => {
    getToken().then((res) => setLoggedUser(res));
  };

  const GetRoles = () => {
    getToken().then((res) => {
      fetch(serwerAdress + "/getRoles/" + "'" + res + "'")
        .then((response) => response.json())
        .then((json) => {
          setRoleToken(json[0].Name);
        });
    });
  };

  const GetUserDetails = (email) => {
    setEmailToken(email);
    navigation.navigate("Informacje o Użytkowniku", { name: "Informacje" });
  };

  useFocusEffect(
    React.useCallback(() => {
      GetLoggedUser();
      GetList();
      GetRoles();
    }, [])
  );

  return (
    <SafeAreaView style={styles.body}>
      <Text style={styles.loggedUserStyle}>
        Zalogowany jako, {loggedUser ? loggedUser : null}
      </Text>
      <View style={styles.container}>
        <Text style={styles.ARMtitle}>Aplikacja Ratowników Mazowsza</Text>
        <View style={styles.usersList}>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={Users}
            renderItem={({ item }) => (
              <View>
                {item.State == 1 ? (
                  <TouchableOpacity>
                    <Text
                      style={styles.users}
                      onPress={() => GetUserDetails(item.Email)}
                    >
                      {item.Name} -{" "}
                      <Text style={states.available}>Dostępny</Text>
                    </Text>
                  </TouchableOpacity>
                ) : item.State == 2 ? (
                  <Text
                    style={styles.users}
                    onPress={() => GetUserDetails(item.Email)}
                  >
                    {item.Name} - {""}
                    <Text style={states.unavailable}>Niedostępny</Text>
                  </Text>
                ) : item.State == 3 ? (
                  <Text
                    style={styles.users}
                    onPress={() => GetUserDetails(item.Email)}
                  >
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
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={styles.refreshbutton}>
          <TouchableOpacity
            style={navigationStyle.navigationButton}
            onPress={GetList}
          >
            <Text style={navigationStyle.navigationButtonText}>
              Odśwież listę
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={navigationStyle.navigationButton}
            onPress={() =>
              navigation.navigate("Wydarzenia", { name: "Wydarzenia" })
            }
          >
            <Text style={navigationStyle.navigationButtonText}>Wydarzenia</Text>
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
  ARMtitle: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 2.5 * vh,
    fontWeight: "bold",
    marginBottom: "5%",
    marginTop: "-5%",
  },
  usersList: {
    height: 40 * vh,
    alignItems: "center",
  },
  users: {
    alignItems: "center",
    fontSize: 2.3 * vh,
    marginTop: 20,
  },
  refreshbutton: {
    marginTop: "5%",
    borderRadius: 5,
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
