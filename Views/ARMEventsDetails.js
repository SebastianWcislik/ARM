import React, { useEffect, useState } from "react";
import Moment from "moment";
import "moment/min/locales";
import { vh } from "react-native-viewport-units-fix";
import {
  getToken,
  getRoleToken,
  setEmailToken,
  getEventToken,
} from "../API/token";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";

const serwerAdress = "https://arm-dev.herokuapp.com"; // API

export default function ARMEventDetails({ navigation }) {
  const [loggedUser, setLoggedUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [eventId, setEventId] = useState(0);
  const [errMessage, setErrMessage] = useState("");

  const [UsersInEvents, setUsersInEvents] = useState([]);

  const [shouldShow, setShouldShow] = useState(true);

  const [eventName, setEventName] = useState("");
  const [eventLocalization, setEventLokalization] = useState("");
  const [eventFrom, setEventFrom] = useState("");
  const [eventTo, setEventTo] = useState("");

  const GetLoggedUser = () => {
    getToken().then((res) => {
      setLoggedUser(res);
    });
  };

  const GetUserRole = () => {
    getRoleToken().then((res) => {
      setUserRole(res);
    });
  };

  const GetUserDetails = (email) => {
    setEmailToken(email);
    navigation.navigate("Informacje o Użytkowniku", { name: "Informacje" });
  };

  const GetEventInfo = () => {
    getEventToken().then((res) =>
      fetch(serwerAdress + "/getEventById/" + res)
        .then((response) => response.json())
        .then((json) => {
          setEventId(json.Id);
          setEventName(json.Name);
          setEventLokalization(json.Localization);
          setEventFrom(json.DateFrom);
          setEventTo(json.DateTo);
        })
    );
  };

  const GetUsersInEvent = () => {
    getEventToken().then((res) => {
      fetch(serwerAdress + "/getUsersInEvents/" + res)
        .then((res) => res.json())
        .then((json) => {
          if (json.result == 0) {
            setUsersInEvents([]);
            return;
          }
          setUsersInEvents(json);
          getToken().then((res) => {
            for (var i = 0; i < json.length; i++) {
              if (json[i].Email == res) {
                setShouldShow(!shouldShow);
                return;
              }
            }
          });
        });
    });
  };

  const AddToEvent = () => {
    fetch(serwerAdress + "/getUserInfo/" + "'" + loggedUser + "'")
      .then((res) => res.json())
      .then((json) => {
        fetch(serwerAdress + "/addToEvent/" + json.Id + "/" + eventId)
          .then((json) => json.json())
          .then((response) => {
            if (response[0].result == 0)
              setErrMessage(
                "Wystąpił błąd w trakcie dołączania do wydarzenia, spróbuj ponownie"
              );
            if (response[0].result == 1) {
              setErrMessage("Udało się dołączyć do wydarzenia");
              GetUsersInEvent();
              setShouldShow(!shouldShow);
            }
          });
      });
  };

  const QuitEvent = () => {
    fetch(serwerAdress + "/getUserInfo/" + "'" + loggedUser + "'")
      .then((res) => res.json())
      .then((json) => {
        fetch(
          serwerAdress + "/deleteFromEvent/" + json.Id + "/" + eventId
        ).then((response) =>
          response.json().then((json) => {
            if (json[0].result == 0)
              setErrMessage(
                "Wystąpił błąd w trakcie opuszczania wydarzenia, spróbuj ponownie"
              );
            if (json[0].result == 1) {
              setErrMessage("Udało się opuścić wydarzenie");
              GetUsersInEvent();
              setShouldShow(!shouldShow);
            }
          })
        );
      });
  };

  const DeleteEvent = () => {
    fetch(serwerAdress + "/deleteEvent/" + eventId).then(() => {
      navigation.navigate("Wydarzenia", { name: "Wydarzenia" });
    });
  };

  useEffect(() => {
    GetLoggedUser();
    GetEventInfo();
    GetUsersInEvent();
    GetUserRole();
  }, []);

  return (
    <SafeAreaView style={styles.body}>
      <Text style={styles.loggedUserStyle}>
        Zalogowany jako, {loggedUser ? loggedUser : null}
      </Text>
      <View>
        <Text style={styles.title}>Informacje o wydarzeniu</Text>
        <View>
          <Text style={myProfile.myData}>
            Nazwa: {eventName ? eventName : null}
          </Text>
          <Text style={myProfile.myData}>
            Lokalizacja: {eventLocalization ? eventLocalization : null}
          </Text>
          <Text style={myProfile.myData}>
            Data rozpoczęcia:{" "}
            {eventFrom ? Moment(eventFrom).format("DD-MM-yyyy HH:mm") : null}
          </Text>
          <Text style={myProfile.myData}>
            Data zakończenia:{" "}
            {eventTo ? Moment(eventTo).format("DD-MM-yyyy HH:mm") : null}
          </Text>
          <Text style={styles.title}>Osoby biorące udział w wydarzeniu: </Text>
          <View style={styles.usersInEventList}>
            {UsersInEvents.length != 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={UsersInEvents}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.marginTop15}>
                    <Text
                      style={styles.events}
                      onPress={() => GetUserDetails(item.Email)}
                    >
                      {item.UserName} - {item.Email}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <Text style={styles.events}>
                Brak użytkowników biorących udział
              </Text>
            )}
          </View>
          {shouldShow ? (
            <TouchableOpacity
              style={navigationStyle.navigationButton}
              onPress={AddToEvent}
            >
              <Text style={navigationStyle.navigationButtonText}>
                Dołącz do wydarzenia
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={navigationStyle.navigationButton}
              onPress={QuitEvent}
            >
              <Text style={navigationStyle.navigationButtonText}>
                Opuść wydarzenie
              </Text>
            </TouchableOpacity>
          )}
          {errMessage ? (
            <View style={styles.eventErrMessageStyle}>
              <Text style={styles.errMessageColor}>{errMessage}</Text>
            </View>
          ) : null}
          {userRole == "Admin" || userRole == "Koordynator" ? (
            <TouchableOpacity
              style={navigationStyle.navigationButton}
              onPress={DeleteEvent}
            >
              <Text style={navigationStyle.navigationButtonText}>
                Usuń wydarzenie
              </Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={navigationStyle.navigationButton}
            onPress={() =>
              navigation.navigate("Wydarzenia", { name: "Wydarzenia" })
            }
          >
            <Text style={navigationStyle.navigationButtonText}>
              Powrót do wydarzeń
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
  title: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 2.5 * vh,
    fontWeight: "bold",
    marginBottom: "5%",
    marginTop: "5%",
  },
  usersInEventList: {
    height: 26 * vh,
    alignItems: "center",
  },
  users: {
    alignItems: "center",
    fontSize: 2.3 * vh,
    marginTop: 20,
  },
  events: {
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 2 * vh,
    marginTop: 5,
  },
  eventErrMessageStyle: {
    padding: 10,
    position: "relative",
    width: "auto",
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

const myProfile = StyleSheet.create({
  myData: {
    fontSize: 2 * vh,
    padding: 2,
    marginTop: 5,
    fontWeight: "bold",
  },
});
