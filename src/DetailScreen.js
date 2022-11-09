import * as React from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";

export function DetailScreen() {
  const { container } = styles;

  return (
    <SafeAreaView style={container}>
      <Text>Detail screen!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
