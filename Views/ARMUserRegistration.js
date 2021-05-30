import React, { useEffect, useState } from "react";
import { vh } from "react-native-viewport-units-fix";
import { getToken } from "../API/token";
import { Picker } from "@react-native-picker/picker";
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

export default function ARMUserRegistration({ navigation }) {
  const [loggedUser, setLoggedUser] = useState("");

  const [shouldShow, setShouldShow] = useState(true);
  const [shouldDisable, setShouldDisable] = useState(true);
  const [errMessage, setErrMessage] = useState("");
  const [emailErrMessage, setEmailErrMessage] = useState("");
  const [phoneErrMessage, setPhoneErrMessage] = useState("");

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState(1);
  const [phone, setPhone] = useState("");

  const GetLoggedUser = () => {
    getToken().then((res) => {
      setLoggedUser(res);
    });
  };

  const validateEmail = (email) => {
    setEmailErrMessage("");
    setEmail(email);
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

  const validatePhone = (phone) => {
    setPhoneErrMessage("");
    setPhone(phone);
    var re = /\(?([0-9]{3})\)?([ ]?)([0-9]{3})\2([0-9]{3})/;
    var result = re.test(phone);
    if (result == false) {
      setPhoneErrMessage("Wpisano niepoprawny numer telefonu");
    }

    if (result == true) {
      setPhoneErrMessage("");
      setErrMessage("");
    }
  };

  const IsThereUser = () => {
    fetch(serwerAdress + "/isThereUser/" + "'" + email + "'")
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
    setErrMessage("");

    if (phoneErrMessage != "") {
      setErrMessage("Popraw błędy w polu numer telefonu");
      return;
    }

    if (password == "" || name == "" || phone == "") {
      setErrMessage("Uzupełnij wszystkie pola");
      return;
    }

    fetch(
      serwerAdress +
        "/createUser/" +
        "'" +
        email +
        "'" +
        "/" +
        "'" +
        name.replace(/\s/g, "") +
        "'" +
        "/" +
        "'" +
        password +
        "'" +
        "/" +
        "'" +
        role +
        "'" +
        "/" +
        "'" +
        phone +
        "'"
    )
      .then((response) => response.json())
      .then((json) => {
        if (json[0].result == 0)
          setErrMessage(
            "Wystąpił błąd w trakcie tworzenia użytkownika, spróbuj ponownie"
          );

        if (json[0].result == 1) {
          setErrMessage("Udało się utworzyć nowego użytkownika");
          setPassword("");
          setEmail("");
          setName("");
          setRole(1);
          setPhone("");
          setShouldDisable(!shouldDisable);
          setShouldShow(!shouldShow);
          sendRegistrationEmail();
        }
      });
  };

  const sendRegistrationEmail = () => {
    fetch(serwerAdress + "/sendMail/" + password + "/" + email);
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
          <Text style={styles.title}>Rejestracja nowego użytkownika</Text>
          <View>
            {shouldShow ? (
              <View>
                <TextInput
                  style={myProfile.registrationText}
                  placeholder="Podaj email"
                  editable={true}
                  value={email}
                  onChangeText={(val) => validateEmail(val)}
                />
                {emailErrMessage ? (
                  <View style={styles.errMessageStyle}>
                    <Text style={styles.errMessageColor}>
                      {emailErrMessage}
                    </Text>
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
                  placeholder="Podaj Numer telefonu użytkownika"
                  value={phone}
                  onChangeText={(val) => validatePhone(val)}
                />
                {phoneErrMessage ? (
                  <View style={styles.errMessageStyle}>
                    <Text style={styles.errMessageColor}>
                      {phoneErrMessage}
                    </Text>
                  </View>
                ) : null}
                <TextInput
                  style={myProfile.registrationText}
                  placeholder="Podaj Imię użytkownika"
                  value={name}
                  onChangeText={(val) => {
                    setName(val), setErrMessage("");
                  }}
                />
                <TextInput
                  secureTextEntry={true}
                  style={myProfile.registrationText}
                  placeholder="Podaj tymczasowe hasło"
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val), setErrMessage("");
                  }}
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
  statePicker: {
    backgroundColor: "dodgerblue",
  },
  registrationText: {
    width: "95%",
    marginTop: 10,
    marginBottom: 5,
  },
});
