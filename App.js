import React, { Component } from "react";
import {
  Platform,
  View,
  Button,
  Text,
  StyleSheet,
  AsyncStorage
} from "react-native";
import { WebView } from "react-native-webview-messaging/WebView";
import QRCodeScanner from "react-native-qrcode-scanner";

let customBurnerConfig = {
  title: "Cold Wallet",
  extraHeadroom: 50
};

export default class App extends Component {
  constructor() {
    super();
    this.onSuccess = this.onSuccess.bind(this);
  }

  _refWebView = webview => {
    this.webview = webview;
  };

  componentDidMount() {
    const { messagesChannel } = this.webview;
    messagesChannel.on("json", json => console.log("RECEIVED JSON", json));

    messagesChannel.on("text", text => {
      if (text == "qr") {
        this.renderQRCode();
      } else if (text == "burn") {
        console.log("please burn private key");
        AsyncStorage.clear();
        this.sendJsonToWebView();
      }
    });
  }

  onSuccess(e) {
    // Send data to web from here
    console.log(e)
  }

  async sendJsonToWebView() {
    let privatekey;
    console.log("Loading private key...");
    try {
      privatekey = await AsyncStorage.getItem("privatekey");
    } catch (error) {
      // Error retrieving data
    }
    if (!privatekey) {
      console.log("generating private key...");
      privatekey = makePrivatekey();
      AsyncStorage.setItem("privatekey", privatekey);
    }
    customBurnerConfig.possibleNewPrivateKey = privatekey;
    this.webview.sendJSON(customBurnerConfig);
  }

  renderQRCode() {
    return <QRCodeScanner onRead={this.onSuccess.bind(this)} />;
  }
  render() {
    return (
      // <WebView
      //   source={{ uri: "https://xdai.io" }}
      //   style={Platform.OS === "ios" ? styles.iosOnly : styles.androidOnly}
      //   onLoadProgress={e => console.warn('OnLoadProgress ',e.nativeEvent.progress)}
      //   useWebKit={true}
      //   ref={webview => {
      //     this.myWebView = webview;
      //   }}
      //   javaScriptEnabled={true}
      //   domStorageEnabled={true}
      //   startInLoadingState={true}
      //   mixedContentMode={"compatibility"}
      //   allowUniversalAccessFromFileURLs={true}
      // />

      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: "https://xdai.io" }}
          style={{ flex: 1 }}
          ref={this._refWebView}
          startInLoadingState={true}
          onLoadEnd={() => {
            this.sendJsonToWebView();
          }}
        />
      </View>
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

function makePrivatekey() {
  var text = "";
  var possible = "abcdef0123456789";

  for (var i = 0; i < 64; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
