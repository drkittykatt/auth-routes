import * as React from "react";
import { Button, View, TextInput, StyleSheet } from "react-native";
//import { AuthContext } from "./utils";

export function RegisterScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  //const { signIn } = React.useContext(AuthContext);
  const { container, txtInput } = styles;

  const register = (username, password) => {
    console.log("you can handle api register here");
  };

  return (
    <View style={container}>
      <TextInput
        style={txtInput}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={txtInput}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Register"
        onPress={() => register({ username, password })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  txtInput: {
    height: 50,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 5,
  },
});
