import React, { Component } from "react";
import { Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default class App extends Component {
  render() {
    return (
      <WebView
        source={{ uri: "https://xdai.io" }}
        style={Platform.OS === "ios" ? styles.iosOnly : styles.androidOnly}
        onLoadProgress={e => console.log(e.nativeEvent.progress)}
        useWebKit={true}
        ref={r => (this.webview = r)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        mixedContentMode={"compatibility"}
        allowUniversalAccessFromFileURLs={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  iosOnly: {
    marginTop: 20
  },
  androidOnly: {
    marginTop: 0
  }
});
