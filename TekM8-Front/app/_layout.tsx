import { Slot } from 'expo-router';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { Text, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Footer from './Footer'; // ensure this path is correct

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.root}>
        <View style={styles.content}>
          <Slot />
        </View>
        <Footer />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B1A2F',
  },
  content: {
    flex: 1,
    paddingBottom: 60, // space for footer
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B1A2F',
  },
});
