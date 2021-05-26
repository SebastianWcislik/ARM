import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Moment from "moment";
import "moment/min/locales";
import { vh } from "react-native-viewport-units-fix";
import { getToken, getRoleToken, setEventToken } from "../API/token";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";

const serwerAdress = "https://arm-dev.herokuapp.com"; // API

export default function ARMEvents({ navigation }) {
  const [Events, setEvents] = useState([]); // lista wydarzeń
  const [loggedUser, setLoggedUser] = useState("");
  const [userRole, setUserRole] = useState("");

  const GetEvents = () => {
    fetch(serwerAdress + "/events")
      .then((response) => response.json())
      .then((json) => {
        setEvents(json);
      });
  };

  const GetLoggedUser = () => {
    getToken().then((res) => setLoggedUser(res));
  };

  const GetUserRole = () => {
    getRoleToken().then((res) => setUserRole(res));
  };

  const GetEventDetails = (Id) => {
    setEventToken(Id);
    navigation.navigate("Informacje o Wydarzeniu", {
      name: "Informacja o Wydarzeniu",
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      GetLoggedUser();
      GetEvents();
      Moment.locale("pl");
      GetUserRole();
    }, [])
  );

  return (
    <SafeAreaView style={styles.body}>
      <Text style={styles.loggedUserStyle}>
        Zalogowany jako, {loggedUser ? loggedUser : null}
      </Text>
      <View style={styles.container}>
        <Text style={styles.title}>Lista wydarzeń</Text>
        <View style={styles.eventsList}>
          {Events.length != 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={Events}
              renderItem={({ item }) => (
                <View style={styles.marginTop15}>
                  <TouchableOpacity>
                    <Text
                      style={styles.events}
                      onPress={() => GetEventDetails(item.Id)}
                    >
                      {item.Name}
                      {"\n"}
                      {Moment(item.DateFrom).format("DD-MM-yyyy HH:mm")}
                      {"\n"}
                      {item.DateTo == null || item.DateTo == ""
                        ? "-"
                        : Moment(item.DateTo).format("DD-MM-yyyy HH:mm")}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <Text style={styles.events}>Brak wydarzeń</Text>
          )}
        </View>
        <View style={styles.refreshbutton}>
          <TouchableOpacity
            style={navigationStyle.navigationButton}
            onPress={GetEvents}
          >
            <Text style={navigationStyle.navigationButtonText}>
              Odśwież listę wydarzeń
            </Text>
          </TouchableOpacity>
          {userRole == "Admin" || userRole == "Koordynator" ? (
            <TouchableOpacity
              style={navigationStyle.navigationButton}
              onPress={() =>
                navigation.navigate("Dodaj wydarzenie", {
                  name: "Dodaj wydarzenie",
                })
              }
            >
              <Text style={navigationStyle.navigationButtonText}>
                Dodaj wydarzenie
              </Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={navigationStyle.navigationButton}
            onPress={() => navigation.navigate("ARM", { name: "ARM" })}
          >
            <Text style={navigationStyle.navigationButtonText}>
              Powrót do listy użytkowników
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
  eventsList: {
    height: 40 * vh,
    alignItems: "center",
  },
  events: {
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 2 * vh,
    marginTop: 5,
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
  marginTop15: {
    marginTop: 15,
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
