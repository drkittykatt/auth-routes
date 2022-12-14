import "react-native-gesture-handler";
import * as React from "react";
import { Button, Text, TextInput, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
//import { createStackNavigator } from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  HomeScreen,
  SplashScreen,
  SignInScreen,
  RegisterScreen,
  SettingsScreen,
  DetailScreen,
} from "./src";
import { AuthContext } from "./src/utils";
import * as SecureStore from "expo-secure-store";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const StackHome = createNativeStackNavigator();

function HomeStack() {
  return (
    <StackHome.Navigator initialRouteName="Home">
      <StackHome.Screen name="Home" component={HomeScreen} />
      <StackHome.Screen name="Detail" component={DetailScreen} />
    </StackHome.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function HomeTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const StackAuth = createNativeStackNavigator();

function AuthStack() {
  return (
    <StackAuth.Navigator initialRouteName="SignIn">
      <StackAuth.Screen name="SignIn" component={SignInScreen} />
      <StackAuth.Screen name="Register" component={RegisterScreen} />
    </StackAuth.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          if (action.token) {
            SecureStore.setItemAsync("userToken", action.token);
          }
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          SecureStore.deleteItemAsync("userToken");
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={AuthStack}
              options={{
                title: "Sign in",
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? "pop" : "push",
              }}
            />
          ) : (
            // User is signed in
            <Stack.Screen name="Home" component={HomeTab} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
