import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { login } from "./API/mock";
import Moment from "moment";
import "moment/min/locales";
import { vw, vh } from "react-native-viewport-units-fix";
import {
  getToken,
  setToken,
  getRoleToken,
  setRoleToken,
  getEmailToken,
  setEmailToken,
  getEventToken,
  setEventToken,
} from "./API/token";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
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

const serwerAdress = "https://arm-dev.herokuapp.com"; // baza danych

// APP

export default function App() {
  // Deklaracja zmiennych

  const Stack = createStackNavigator();

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
        <Stack.Screen
          name="Zmiana hasła"
          component={ARMChangePassword}
          options={({ title: "Zmiana hasła" }, { headerShown: false })}
        />
        <Stack.Screen
          name="Rejestracja"
          component={ARMUserRegistration}
          options={({ title: "Rejestracja" }, { headerShown: false })}
        />
        <Stack.Screen
          name="Informacje o Użytkowniku"
          component={ARMUserDetails}
          options={({ title: "Informacje" }, { headerShown: false })}
        />
        <Stack.Screen
          name="Wydarzenia"
          component={ARMEvents}
          options={({ title: "Wydarzenia" }, { headerShown: false })}
        />
        <Stack.Screen
          name="Informacje o Wydarzeniu"
          component={ARMEventDetails}
          options={
            ({ title: "Informacje o Wydarzeniu" }, { headerShown: false })
          }
        />
        <Stack.Screen
          name="Dodaj wydarzenie"
          component={ARMAddEvent}
          options={({ title: "Dodaj wydarzenie" }, { headerShown: false })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Widoki aplikacji

// Login

export function ARMLogin({ navigation }) {
  // Zmienne do logowania
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resUser, setResUser] = useState([]);

  // Odpowiedź z API - errorHandler
  const [errMessage, setErrMessage] = useState("");

  // Pokazywanie/ukrywanie przycisków do logowania
  const [shouldShow, setShouldShow] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(true);

  const loginUser = () => {
    setErrMessage("");

    login(email, password, resUser)
      .then(async (res) => {
        await setToken(res.loggedUser);
        navigation.navigate("ARM", { name: "ARM" });
      })
      .catch((err) => setErrMessage(err.message));
    setShouldShow(!shouldShow);
    setShouldDisable(!shouldDisable);
  };

  const getLoginUser = () => {
    setErrMessage("");

    fetch(serwerAdress + "/userToLogin?email=" + '"' + email + '"')
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
          value={email}
          onChangeText={(val) => setEmail(val)}
        />
        {shouldShow ? (
          <View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Hasło"
              value={password}
              secureTextEntry={true}
              onChangeText={(val) => setPassword(val)}
            />
            <TouchableOpacity
              style={navigationStyle.loginButton}
              onPress={loginUser}
            >
              <Text style={navigationStyle.navigationButtonText}>Zaloguj</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={navigationStyle.loginButton}
            onPress={getLoginUser}
          >
            <Text style={navigationStyle.navigationButtonText}>Zaloguj</Text>
          </TouchableOpacity>
        )}
        {errMessage ? (
          <View style={styles.errMessageStyle}>
            <Text style={styles.errMessageColor}>{errMessage}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

// Lista użytkowników

export function ARMUsersList({ navigation }) {
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
      fetch(serwerAdress + "/getRoles?email=" + '"' + res + '"')
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

  // onScreenLoad
  useEffect(() => {
    GetLoggedUser();
    GetList();
    GetRoles();
  }, []);

  return (
    <SafeAreaView style={styles.body} onTouchStart={Keyboard.dismiss}>
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

// Mój profil

export function ARMMyProfile({ navigation }) {
  const [loggedUser, setLoggedUser] = useState("");

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  const [currentState, setCurrentState] = useState("");
  const [selectedState, setSelectedState] = useState(1);

  const GetLoggedUser = () => {
    getToken().then((res) => {
      setLoggedUser(res);
      fetch(serwerAdress + "/getUserInfo?email=" + '"' + res + '"')
        .then((response) => response.json())
        .then((json) => {
          setUserName(json[0].Name);
          setUserEmail(json[0].Email);
          setCurrentState(json[0].State);
        });
    });
  };

  const SetUserState = () => {
    fetch(
      serwerAdress +
        "/getUserState?email=" +
        '"' +
        userEmail +
        '"' +
        "&state=" +
        '"' +
        selectedState +
        '"'
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
    <SafeAreaView style={styles.body} onTouchStart={Keyboard.dismiss}>
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

export function ARMChangePassword({ navigation }) {
  const [loggedUser, setLoggedUser] = useState("");

  const [userEmail, setUserEmail] = useState("");

  const [shouldShow, setShouldShow] = useState(true);
  const [errMessage, setErrMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const GetLoggedUser = () => {
    getToken().then((res) => {
      setLoggedUser(res);
      fetch(serwerAdress + "/getUserInfo?email=" + '"' + res + '"')
        .then((response) => response.json())
        .then((json) => {
          setUserEmail(json[0].Email);
        });
    });
  };

  const GetUserPassword = () => {
    setErrMessage("");

    fetch(
      serwerAdress +
        "/getPassword?email=" +
        '"' +
        userEmail +
        '"&password=' +
        '"' +
        oldPassword +
        '"'
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
        "/setPassword?email=" +
        '"' +
        userEmail +
        '"&password=' +
        '"' +
        newPassword +
        '"'
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
    <SafeAreaView style={styles.body} onTouchStart={Keyboard.dismiss}>
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
  );
}

export function ARMUserRegistration({ navigation }) {
  const [loggedUser, setLoggedUser] = useState("");

  const [shouldShow, setShouldShow] = useState(true);
  const [shouldDisable, setShouldDisable] = useState(true);
  const [errMessage, setErrMessage] = useState("");
  const [emailErrMessage, setEmailErrMessage] = useState("");

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState(1);

  const GetLoggedUser = () => {
    getToken().then((res) => {
      setLoggedUser(res);
    });
  };

  const validateEmail = (email) => {
    setEmailErrMessage("");
    setEmail(email);
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var result = re.test(email);
    if (result == false) {
      setEmailErrMessage("Wpisano niepoprawny email");
      setShouldDisable(true);
    }

    if (result == true) {
      setEmailErrMessage("");
      setErrMessage("");
      setShouldDisable(false);
    }
  };

  const IsThereUser = () => {
    fetch(serwerAdress + "/isThereUser?email=" + '"' + email + '"')
      .then((response) => response.json())
      .then((json) => {
        if (json[0].result == 1) setErrMessage("Podany email już istnieje");

        if (json[0].result == 0) {
          setErrMessage("");
          setShouldShow(!shouldShow);
        }
      });
  };

  const CreateUser = () => {
    fetch(
      serwerAdress +
        "/createUser?email=" +
        '"' +
        email +
        '"' +
        "&password=" +
        '"' +
        password +
        '"' +
        "&name=" +
        '"' +
        name +
        '"' +
        "&role=" +
        '"' +
        role +
        '"'
    )
      .then((response) => response.json())
      .then((json) => {
        if (json[0].result == 0)
          setErrMessage(
            "Wystąpił błąd w trakcie tworzenia użytkownika, spróbuj ponownie"
          );

        if (json[0].result == 1) {
          setErrMessage("Udało się utworzyć nowego użytkownika");
          sendRegistrationEmail();
        }
      });
  };

  const sendRegistrationEmail = () => {
    fetch(serwerAdress + "/sendMail?password=" + password + "&email=" + email);
  };

  useEffect(() => {
    GetLoggedUser();
  }, []);

  return (
    <SafeAreaView style={styles.body} onTouchStart={Keyboard.dismiss}>
      <Text style={styles.loggedUserStyle}>
        Zalogowany jako, {loggedUser ? loggedUser : null}
      </Text>
      <View>
        <Text style={styles.title}>Rejestracja nowego użytkownika</Text>
        <View>
          {shouldShow ? (
            <View>
              <TextInput
                style={myProfile.registrationText}
                placeholder="Podaj email"
                value={email}
                onChangeText={(val) => validateEmail(val)}
              />
              {emailErrMessage ? (
                <View style={styles.errMessageStyle}>
                  <Text style={styles.errMessageColor}>{emailErrMessage}</Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={navigationStyle.navigationButton}
                disabled={shouldDisable}
                onPress={IsThereUser}
              >
                <Text style={navigationStyle.navigationButtonText}>
                  Zarejestruj
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <TextInput
                style={myProfile.registrationText}
                placeholder="Podaj email"
                value={email}
                editable={shouldShow}
                onChangeText={(val) => setEmail(val)}
              />
              <TextInput
                style={myProfile.registrationText}
                placeholder="Podaj Imię użytkownika"
                value={name}
                onChangeText={(val) => setName(val)}
              />
              <TextInput
                secureTextEntry={true}
                style={myProfile.registrationText}
                placeholder="Podaj tymczasowe hasło"
                value={password}
                onChangeText={(val) => setPassword(val)}
              />
              <Picker
                selectedValue={role}
                style={myProfile.statePicker}
                onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
              >
                <Picker.Item label="Admin" value="1" />
                <Picker.Item label="Koordynator" value="2" />
                <Picker.Item label="Użytkownik" value="3" />
              </Picker>
              <TouchableOpacity
                style={navigationStyle.navigationButton}
                onPress={CreateUser}
              >
                <Text style={navigationStyle.navigationButtonText}>
                  Zarejestruj
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
  );
}

export function ARMUserDetails({ navigation }) {
  const [loggedUser, setLoggedUser] = useState("");

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [currentState, setCurrentState] = useState("");

  const GetLoggedUser = () => {
    getToken().then((res) => {
      setLoggedUser(res);
    });
  };

  const GetSelectedUserInfo = () => {
    getEmailToken().then((res) => {
      fetch(serwerAdress + "/getSelectedUserInfo?email=" + '"' + res + '"')
        .then((response) => response.json())
        .then((json) => {
          setUserName(json[0].Name);
          setUserEmail(json[0].Email);
          setCurrentState(json[0].State);
          setUserRole(json[0].RoleName);
        });
    });
  };

  useEffect(() => {
    GetLoggedUser();
    GetSelectedUserInfo();
  }, []);

  return (
    <SafeAreaView style={styles.body} onTouchStart={Keyboard.dismiss}>
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

// Wydarzenia

export function ARMEvents({ navigation }) {
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
    <SafeAreaView style={styles.body} onTouchStart={Keyboard.dismiss}>
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
                      {Moment(item.DateFrom).format("DD-MM-yyyy hh:mm")}
                      {"\n"}
                      {item.DateTo == null || item.DateTo == ""
                        ? "-"
                        : Moment(item.DateTo).format("DD-MM-yyyy hh:mm")}
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

export function ARMEventDetails({ navigation }) {
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

  const GetEventInfo = () => {
    getEventToken().then((res) =>
      fetch(serwerAdress + "/eventById?Id=" + res)
        .then((response) => response.json())
        .then((json) => {
          setEventId(json[0].Id);
          setEventName(json[0].Name);
          setEventLokalization(json[0].Localization);
          setEventFrom(json[0].DateFrom);
          setEventTo(json[0].DateTo);
        })
    );
  };

  const GetUsersInEvent = () => {
    getEventToken().then((res) => {
      fetch(serwerAdress + "/getUsersInEvent?eventId=" + res)
        .then((res) => res.json())
        .then((json) => {
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
    fetch(serwerAdress + "/getUserInfo?email=" + '"' + loggedUser + '"')
      .then((res) => res.json())
      .then((json) => {
        fetch(
          serwerAdress +
            "/addToEvent?userId=" +
            json[0].Id +
            "&eventId=" +
            eventId
        )
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
    fetch(serwerAdress + "/getUserInEvent?Email=" + '"' + loggedUser + '"')
      .then((res) => res.json())
      .then((json) =>
        fetch(serwerAdress + "/deleteFromEvent?Id=" + json[0].Id).then(
          (response) =>
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
        )
      );
  };

  const DeleteEvent = () => {
    fetch(serwerAdress + "/deleteEvent?eventId=" + eventId).then(() => {
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
    <SafeAreaView style={styles.body} onTouchStart={Keyboard.dismiss}>
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
            {eventFrom ? Moment(eventFrom).format("DD-MM-yyyy hh:mm") : null}
          </Text>
          <Text style={myProfile.myData}>
            Data zakończenia:{" "}
            {eventTo ? Moment(eventTo).format("DD-MM-yyyy hh:mm") : null}
          </Text>
          <Text style={styles.title}>Osoby biorące udział w wydarzeniu: </Text>
          <View style={styles.usersInEventList}>
            {UsersInEvents.length != 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={UsersInEvents}
                renderItem={({ item }) => (
                  <View style={styles.marginTop15}>
                    <Text style={styles.events}>
                      {item.UserName} - {item.Email}
                    </Text>
                  </View>
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

export function ARMAddEvent({ navigation }) {
  const [loggedUser, setLoggedUser] = useState("");

  const [errEventName, setErrEventName] = useState("");
  const [errEventLocalization, setErrEventLocalization] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [errFromMessage, setErrFromMessage] = useState("");
  const [errToMessage, setErrToMessage] = useState("");

  const [eventName, setEventName] = useState("");
  const [eventLocalization, setEventLocalization] = useState("");
  const [eventFrom, setEventFrom] = useState("");
  const [eventTo, setEventTo] = useState("");

  const GetLoggedUser = () => {
    getToken().then((res) => {
      setLoggedUser(res);
    });
  };

  const eventNameInput = (val) => {
    setErrEventName("");
    if (val == "") {
      setErrEventName("Uzupełnij nazwę wydarzenia");
    }
    setEventName(val);
  };

  const eventLocalizationInput = (val) => {
    setErrEventLocalization("");
    if (val == "") {
      setErrEventLocalization("Uzupełnij localizację wydarzenia");
    }
    setEventLocalization(val);
  };

  const validateFromDate = (date) => {
    setErrFromMessage("");
    setErrMessage("");
    setEventFrom(date);
    if (date == null || date == "") return;
    var re = /^([1-9]|([012][0-9])|(3[01]))-([0]{0,1}[1-9]|1[012])-\d\d\d\d\s([0-1]?[0-9]|2?[0-3]):([0-5]\d)$/;
    var result = re.test(date);
    if (result == false) {
      setErrFromMessage(
        "Wpisano niepoprawną datę rozpoczęcia \nData powinna mieć format dd-mm-yyyy hh:mm"
      );
    }

    if (result == true) {
      setErrMessage("");
      setErrFromMessage("");
    }
  };

  const validateToDate = (date) => {
    setErrToMessage("");
    setErrMessage("");
    setEventTo(date);
    if (date == null || date == "") return;
    var re = /^([1-9]|([012][0-9])|(3[01]))-([0]{0,1}[1-9]|1[012])-\d\d\d\d\s([0-1]?[0-9]|2?[0-3]):([0-5]\d)$/;
    var result = re.test(date);
    if (result == false) {
      setErrToMessage(
        "Wpisano niepoprawną datę zakończenia \nData powinna mieć format dd-mm-yyyy hh:mm"
      );
    }

    if (result == true) {
      setErrMessage("");
      setErrToMessage("");
    }
  };

  const AddEvent = () => {
    setErrMessage("");
    setErrEventName("");
    setErrEventLocalization("");

    if (eventName == "") {
      setErrEventName("Uzupełnij nazwę wydarzenia");
    }
    if (eventLocalization == "") {
      setErrEventLocalization("Uzupełnij lokalizację wydarzenia");
    }
    if (eventFrom == "") {
      setErrFromMessage("Uzupełnij datę rozpoczęcia");
    }
    if (eventTo != null || eventTo != "") {
      if (new Date(eventFrom) > new Date(eventTo)) {
        setErrMessage(
          "Data rozpoczęcia nie może być mniejsza od daty zakończenia"
        );
        return;
      }
    }

    if (eventName == "" || eventLocalization == "" || eventFrom == "") return;

    var dateFrom = Moment(eventFrom, "DD-MM-yyyy hh:mm").format(
      "yyyy-MM-DD hh:mm"
    );
    var dateTo = null;
    if (eventTo != "")
      dateTo =
        '"' +
        Moment(eventTo, "DD-MM-yyyy hh:mm").format("yyyy-MM-DD hh:mm") +
        '"';

    fetch(
      serwerAdress +
        "/addEvent?eventName=" +
        '"' +
        eventName +
        '"' +
        "&eventLocalization=" +
        '"' +
        eventLocalization +
        '"' +
        "&eventFrom=" +
        '"' +
        dateFrom +
        '"' +
        "&eventTo=" +
        dateTo
    )
      .then((res) => res.json())
      .then((json) => {
        if (json[0].result == 1) {
          setErrMessage("Udało się stworzyć nowe wydarzenie");
          navigation.navigate("Wydarzenia", { name: "Wydarzenia" });
        }

        if (json[0].result == 0)
          setErrMessage(
            "Nie udało się utworzyć nowego wydarzenia, spróbuj ponownie"
          );
      });
  };

  useEffect(() => {
    GetLoggedUser();
    Moment.locale("pl");
  }, []);

  return (
    <SafeAreaView style={styles.body} onTouchStart={Keyboard.dismiss}>
      <Text style={styles.loggedUserStyle}>
        Zalogowany jako, {loggedUser ? loggedUser : null}
      </Text>
      <View style={{ width: 300 }}>
        <Text style={styles.title}>Dodaj wydarzenie</Text>
        <View>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Nazwa wydarzenia"
            value={eventName}
            onChangeText={(val) => eventNameInput(val)}
          />
          {errEventName ? (
            <View style={styles.eventErrMessageStyle}>
              <Text style={styles.errMessageColor}>{errEventName}</Text>
            </View>
          ) : null}
          <TextInput
            style={styles.textInputStyle}
            placeholder="Podaj lokalizację"
            value={eventLocalization}
            onChangeText={(val) => eventLocalizationInput(val)}
          />
          {errEventLocalization ? (
            <View style={styles.eventErrMessageStyle}>
              <Text style={styles.errMessageColor}>{errEventLocalization}</Text>
            </View>
          ) : null}
          <TextInput
            style={styles.textInputStyle}
            placeholder="Podaj datę rozpoczęcia"
            value={eventFrom}
            onChangeText={(val) => validateFromDate(val)}
          />
          {errFromMessage ? (
            <View style={styles.eventErrMessageStyle}>
              <Text style={styles.errMessageColor}>{errFromMessage}</Text>
            </View>
          ) : null}
          <TextInput
            style={styles.textInputStyle}
            placeholder="Podaj datę zakończenia"
            value={eventTo}
            onChangeText={(val) => validateToDate(val)}
          />
          {errToMessage ? (
            <View style={styles.eventErrMessageStyle}>
              <Text style={styles.errMessageColor}>{errToMessage}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={navigationStyle.navigationButton}
            onPress={AddEvent}
          >
            <Text style={navigationStyle.navigationButtonText}>
              Dodaj wydarzenie
            </Text>
          </TouchableOpacity>
          {errMessage ? (
            <View style={styles.eventErrMessageStyle}>
              <Text style={styles.errMessageColor}>{errMessage}</Text>
            </View>
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

// Css Styles

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
  title: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 2.5 * vh,
    fontWeight: "bold",
    marginBottom: "5%",
    marginTop: "5%",
  },
  usersList: {
    height: 40 * vh,
    alignItems: "center",
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
  textInputStyle: {
    height: 5 * vh,
    width: "95%",
    margin: 5,
    marginBottom: 15,
  },
  errMessageStyle: {
    padding: 10,
    position: "relative",
    width: 200,
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
    padding: 1 * vh,
    backgroundColor: "#0064C8",
    marginTop: 10,
    borderRadius: 5,
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 1 * vh,
    backgroundColor: "#0064C8",
    width: 200,
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
  newPasswordText: {
    height: 5 * vh,
    width: "95%",
    margin: 5,
    marginTop: 15,
    marginBottom: 5,
  },
  registrationText: {
    width: "95%",
    marginTop: 10,
    marginBottom: 5,
  },
});
