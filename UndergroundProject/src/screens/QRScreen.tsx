import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRScanner from '../components/QRScanner';
import {useNavigation} from '@react-navigation/native';
const dWidth = Dimensions.get('window').width;

const clr1 = 'mediumseagreen';

const ScanQRPage = () => {
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const navigation = useNavigation();

  const openQRscanner = () => {
    setShowQR(true);
  };

  const onQrRead = (qrtext: string) => {
    setQrCode(qrtext);
    setShowQR(false);

    // We expect a format like "cemetery/3"
    if (qrtext?.startsWith('cemetery/')) {
      const cemeteryId = qrtext.replace('cemetery/', '');
      // Now navigate to "Search" screen, passing the ID
      navigation.navigate('Search', {scannedCemeteryId: cemeteryId});
    } else {
      // If it's not a valid code, handle accordingly
      console.warn('Invalid QR format:', qrtext);
    }
  };

  return (
    <View style={styles.page}>
      {qrCode ? (
        <Text style={{fontSize: 16, color: 'black'}}>
          {'QR Value \n' + qrCode}
        </Text>
      ) : null}
      <Ionicons
        name={'scan-circle-outline'}
        size={qrCode ? dWidth * 0.4 : dWidth * 0.75}
        color={clr1}
      />
      <TouchableOpacity onPress={() => openQRscanner()} style={styles.btn}>
        <Text style={{color: clr1}}>Scan QR</Text>
      </TouchableOpacity>
      {showQR ? <QRScanner onRead={onQrRead} /> : null}
    </View>
  );
};

export default ScanQRPage;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  btn: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: '3%',
    width: '50%',
    borderWidth: 2,
    borderColor: clr1,
  },
  btnText: {
    color: clr1,
  },
});
