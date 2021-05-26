import React, { useState } from "react";
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
import { setToken } from "../API/token";
import { vh } from "react-native-viewport-units-fix";
import { login } from "../API/mock";

const dismissKeyboard = () => {
  if (Platform.OS != "web") {
    Keyboard.dismiss();
  }
};

export default function ARMLogin({ navigation }) {
  // Zmienne do logowania
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Odpowiedź z API - errorHandler
  const [errMessage, setErrMessage] = useState("");

  const loginUser = () => {
    setErrMessage("");

    if (email == null || email == "") {
      setErrMessage("Wpisz adres email");
      return;
    }

    if (password == null || password == "") {
      setErrMessage("Wpisz hasło");
      return;
    }

    login(email, password)
      .then(async (res) => {
        await setToken(res.loggedUser);
        navigation.navigate("ARM", { name: "ARM" });
      })
      .catch((err) => setErrMessage(err.message));
  };

  return (
    <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
      <SafeAreaView style={styles.body}>
        <View>
          <Text style={styles.title}>Logowanie</Text>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Nazwa użytkownika"
            value={email}
            onChangeText={(val) => setEmail(val)}
          />
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
          {errMessage ? (
            <View style={styles.errMessageStyle}>
              <Text style={styles.errMessageColor}>{errMessage}</Text>
            </View>
          ) : null}
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
  errMessageColor: {
    color: "orange",
  },
});

const navigationStyle = StyleSheet.create({
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
