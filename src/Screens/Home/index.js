import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import readPokemon from '../../NfcUtils/readPokemon';
import Image from '../../Components/Image';

function HomeScreen(props) {
  const {navigation} = props;

  const [hasNfc, setHasNfc] = React.useState(null);
  const [enabled, setEnabled] = React.useState(null);

  React.useEffect(() => {
    async function checkNfc() {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
        setEnabled(await NfcManager.isEnabled());
      }
      setHasNfc(supported);
    }

    checkNfc();
  }, []);

  function renderNfcButtons() {
    if (hasNfc === null) {
      return null;
    } else if (!hasNfc) {
      return <Text>You device doesn't support NFC</Text>;
    } else if (!enabled) {
      return (
        <>
          <Text>Your NFC is not enabled!</Text>

          <TouchableOpacity
            onPress={() => {
              NfcManager.goToNfcSetting();
            }}>
            <Text>GO TO NFC SETTINGS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              setEnabled(await NfcManager.isEnabled());
            }}>
            <Text>CHECK AGAIN</Text>
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <>
          <Button
            mode="contained"
            style={styles.btn}
            onPress={() => {
              navigation.navigate('List');
            }}>
            Create Pokemon
          </Button>
          <Button
            mode="contained"
            style={styles.btn}
            onPress={async () => {
              try {
                await NfcManager.requestTechnology(NfcTech.NfcA);
                const pokemon = await readPokemon();
                navigation.navigate('Detail', {
                  pokemon,
                });
              } catch (ex) {
                console.warn(ex);
              } finally {
                NfcManager.cancelTechnologyRequest();
              }
            }}>
            Identify Pokemon
          </Button>
        </>
      );
    }
  }

  return (
    <View style={[styles.wrapper, styles.center]}>
      <Image
        source={require('../../../images/pokeball.png')}
        style={styles.banner}
        resizeMode="contain"
      />
      {renderNfcButtons()}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: 240,
    marginBottom: 20,
  },
  banner: {
    width: 240,
    height: 240,
    marginBottom: 60,
  },
});

export default HomeScreen;
