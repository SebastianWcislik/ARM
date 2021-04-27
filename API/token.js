import AsyncStorage from "@react-native-community/async-storage";

export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem("@auth_token");
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return null;
  }
};

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem("@auth_token", token);
  } catch (e) {
    return null;
  }
};

export const getRoleToken = async () => {
  try {
    const value = await AsyncStorage.getItem("@role_token");
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return null;
  }
};

export const setRoleToken = async (token) => {
  try {
    await AsyncStorage.setItem("@role_token", token);
  } catch (e) {
    return null;
  }
};

export const getEmailToken = async () => {
  try {
    const value = await AsyncStorage.getItem("@email_token");
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return null;
  }
};

export const setEmailToken = async (token) => {
  try {
    await AsyncStorage.setItem("@email_token", token);
  } catch (e) {
    return null;
  }
};

export const getEventToken = async () => {
  try {
    const value = await AsyncStorage.getItem("@event_token");
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return null;
  }
};

export const setEventToken = async (token) => {
  try {
    await AsyncStorage.setItem("@event_token", token.toString());
  } catch (e) {
    return null;
  }
};
