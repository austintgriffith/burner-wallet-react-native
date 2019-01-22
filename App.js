import React, { Component } from "react";
import { Platform, View, Button, Text, StyleSheet, AsyncStorage } from "react-native";
import { WebView } from "react-native-webview-messaging/WebView";


let customBurnerConfig = {
  isReactNative: true,
  title: "Cold Wallet",
  extraHeadroom: 50,
}




export default class App extends Component {
  constructor() {
    super();
  }

  _refWebView = webview => {
    this.webview = webview;
  };

  componentDidMount() {
    const { messagesChannel } = this.webview;
    messagesChannel.on("json", json =>
      console.log("RECEIVED JSON",json)
    );

    messagesChannel.on("text", async (text) => {
      if(text=="qr"){
        console.log("please open up the qr reader")
      }else if(text=="burn"){
        console.log("please burn private key")
        await AsyncStorage.setItem('privatekey',"")
        this.sendJsonToWebView()
      }
    });
  }
  async sendJsonToWebView() {
    let privatekey
    console.log("Loading private key...")
    try {
      privatekey = await AsyncStorage.getItem('privatekey');
    } catch (error) {
     // Error retrieving data
    }
    if(!privatekey){
      console.log("generating private key...")
      privatekey = makePrivatekey()
      AsyncStorage.setItem('privatekey',privatekey);
    }
    console.log("PK:",privatekey)
    customBurnerConfig.possibleNewPrivateKey = privatekey
    this.webview.sendJSON(customBurnerConfig);
  };

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
          source={{ uri: "http://localhost:3000" }}
          style={{ flex: 1 }}
          ref={this._refWebView}
          onLoadEnd={()=>{
            this.sendJsonToWebView()
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
