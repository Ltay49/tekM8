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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 0 }}>
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
        headerTintColor: 'white',
        headerShadowVisible: true, // Hide default shadow

        headerStyle: {
          backgroundColor: '#00AEEF',
        },

        headerBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: '#00AEEF',
              shadowColor: '#fff',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 6,
              elevation: 4, // Android
            }}
          />
        ),

        headerTitleStyle: {
          fontFamily: 'Montserrat_700Bold',
          fontSize: 20,
        },
      }}


    >
      {children}
    </Stack>
  );
}
