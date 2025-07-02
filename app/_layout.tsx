import { Stack, useSegments } from 'expo-router';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { Text, View } from 'react-native';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const segments = useSegments() as string[];
  const isIndex = segments.length === 0;

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        title: 'Home',
        headerBackTitle: '',
        headerTitleAlign: isIndex ? 'left' : 'left',
        headerStyle: {
          backgroundColor: '#00AEEF',
        },
        headerTintColor: 'black',
        headerTitleStyle: {
          fontFamily: 'Montserrat_700Bold',
          fontSize: 18,
        },
      }}
    >
      {children}
    </Stack>
  );
}
