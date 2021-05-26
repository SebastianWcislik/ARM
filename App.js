import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import ARMLogin from "./Views/ARMLogin";
import ARMUsersList from "./Views/ARMUsersList";
import ARMMyProfile from "./Views/ARMMyProfile";
import ARMChangePassword from "./Views/ARMChangePassword";
import ARMUserRegistration from "./Views/ARMUserRegistration";
import ARMUserDetails from "./Views/ARMUserDetails";
import ARMEvents from "./Views/ARMEvents";
import ARMEventDetails from "./Views/ARMEventsDetails";
import ARMAddEvent from "./Views/ARMAddEvent";

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

// Css Styles

const navigationStyle = StyleSheet.create({
  navigationMenu: {
    display: "none",
    alignContent: "flex-end",
    justifyContent: "center",
  },
});
