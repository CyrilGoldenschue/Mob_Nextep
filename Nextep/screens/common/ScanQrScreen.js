import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import StorageKit from "../../components/Storage";
import { TouchableHighlight } from "react-native-gesture-handler";

export default function ScanQrScreen(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  Back = () => {
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'EditProfile'}], 
    })
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    if (data.substring(0, 2) === "0x"){ 
      StorageKit.set("qr_scan", data)
      props.navigation.reset({
          index: 0,
          routes: [{ name: 'EditProfile'}], 
      })
    }else if (data.replace("ethereum:", "").substring(0, 2) === "0x") {
      StorageKit.set("qr_scan", data.replace("ethereum:", ""));
      props.navigation.reset({
          index: 0,
          routes: [{ name: 'EditProfile'}], 
      })
    }else alert("Ceci n'est pas une adresse de compte porte-monnaie")
    
  }   

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.button}>
      <TouchableHighlight 
        style={styles.littleButton}
        onPress={() => Back()}>
        <Image style={styles.littleButton} source={require("../../assets/back-arrow.png") } />
      </TouchableHighlight>
      </View>
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  littleButton: {
    height: 50,
    width: 58
  },  
  button: {
    flexDirection: "row",
    marginRight: 10,
    marginTop: 30,
    justifyContent: "flex-end"
  }
});