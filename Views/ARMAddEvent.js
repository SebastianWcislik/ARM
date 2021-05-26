import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import Moment from "moment";
import "moment/min/locales";
import "intl";
import "intl/locale-data/jsonp/pl";
import { vh } from "react-native-viewport-units-fix";
import { getToken } from "../API/token";
import { DateTimePickerModal } from "react-native-paper-datetimepicker";
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

export default function ARMAddEvent({ navigation }) {
  const [loggedUser, setLoggedUser] = useState("");

  const [errEventName, setErrEventName] = useState("");
  const [errEventLocalization, setErrEventLocalization] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [errFromMessage, setErrFromMessage] = useState("");
  const [errToMessage, setErrToMessage] = useState("");

  const [eventName, setEventName] = useState("");
  const [eventLocalization, setEventLocalization] = useState("");
  const [eventFrom, setEventFrom] = useState(new Date());
  const [eventTo, setEventTo] = useState(new Date());

  const [visibleFrom, setVisibleFrom] = useState(false);
  const [visibleTo, setVisibleTo] = useState(false);

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

  const onDismissFrom = () => {
    setVisibleFrom(false);
  };

  const onDismissTo = () => {
    setVisibleTo(false);
  };

  const onChangeFrom = (date) => {
    setVisibleFrom(false);
    setEventFrom(date);
  };

  const onChangeTo = (date) => {
    setVisibleTo(false);
    setEventTo(date);
  };

  // const validateFromDate = (date) => {
  //   setErrFromMessage("");
  //   setErrMessage("");
  //   setEventFrom(date);
  //   if (date == null || date == "") return;
  //   var re =
  //     /^([1-9]|([012][0-9])|(3[01]))-([0]{0,1}[1-9]|1[012])-\d\d\d\d\s([0-1]?[0-9]|2?[0-3]):([0-5]\d)$/;
  //   var result = re.test(date);
  //   if (result == false) {
  //     setErrFromMessage(
  //       "Wpisano niepoprawną datę rozpoczęcia \nData powinna mieć format dd-mm-yyyy hh:mm"
  //     );
  //   }

  //   if (result == true) {
  //     setErrMessage("");
  //     setErrFromMessage("");
  //   }
  // };

  // const validateToDate = (date) => {
  //   setErrToMessage("");
  //   setErrMessage("");
  //   setEventTo(date);
  //   if (date == null || date == "") return;
  //   var re =
  //     /^([1-9]|([012][0-9])|(3[01]))-([0]{0,1}[1-9]|1[012])-\d\d\d\d\s([0-1]?[0-9]|2?[0-3]):([0-5]\d)$/;
  //   var result = re.test(date);
  //   if (result == false) {
  //     setErrToMessage(
  //       "Wpisano niepoprawną datę zakończenia \nData powinna mieć format dd-mm-yyyy hh:mm"
  //     );
  //   }

  //   if (result == true) {
  //     setErrMessage("");
  //     setErrToMessage("");
  //   }
  // };

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
          "Data rozpoczęcia nie może być wcześniejsza od daty zakończenia"
        );
        return;
      }
    }

    if (eventName == "" || eventLocalization == "" || eventFrom == "") return;

    var dateFrom = Moment(eventFrom, "DD-MM-yyyy HH:mm").format(
      "yyyy-MM-DD HH:mm"
    );
    var dateTo = null;
    if (eventTo != "")
      dateTo =
        "'" +
        Moment(eventTo, "DD-MM-yyyy HH:mm").format("yyyy-MM-DD HH:mm") +
        "'";

    fetch(
      serwerAdress +
        "/addEvent/" +
        "'" +
        eventName +
        "'" +
        "/" +
        "'" +
        eventLocalization +
        "'" +
        "/" +
        "'" +
        dateFrom +
        "'" +
        "/" +
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
    <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
      <SafeAreaView style={styles.body}>
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
                <Text style={styles.errMessageColor}>
                  {errEventLocalization}
                </Text>
              </View>
            ) : null}
            <DateTimePickerModal
              visible={visibleFrom}
              onDismiss={onDismissFrom}
              date={eventFrom}
              onConfirm={(val) => onChangeFrom(val)}
            />
            <TouchableOpacity onPress={() => setVisibleFrom(true)}>
              <Text>Wybierz datę rozpoczęcia</Text>
              <Text>{Moment(eventFrom).format("DD-MM-yyyy HH:mm")}</Text>
            </TouchableOpacity>
            {errFromMessage ? (
              <View style={styles.eventErrMessageStyle}>
                <Text style={styles.errMessageColor}>{errFromMessage}</Text>
              </View>
            ) : null}
            <DateTimePickerModal
              visible={visibleTo}
              onDismiss={onDismissTo}
              date={eventTo}
              onConfirm={(val) => onChangeTo(val)}
            />
            <TouchableOpacity onPress={() => setVisibleTo(true)}>
              <Text>Wybierz datę zakończenia</Text>
              <Text>{Moment(eventTo).format("DD-MM-yyyy HH:mm")}</Text>
            </TouchableOpacity>
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
  textInputStyle: {
    height: 5 * vh,
    width: "95%",
    margin: 5,
    marginBottom: 15,
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
