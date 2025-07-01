import { Stack, useSegments } from 'expo-router';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const segments = useSegments() as string[];
  
  const isIndex = segments.length === 0;

  return (
    <Stack
      screenOptions={{
        title: 'Home',
        headerBackTitle: '',
        headerTitleAlign: isIndex ? 'left' : 'left',
        headerStyle: {
          backgroundColor: '#00AEEF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      {children}
    </Stack>
  );
}



