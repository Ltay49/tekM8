import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DocumentControl() {
  const router = useRouter();

  return (
    <View style={styles.container}>
  <TouchableOpacity onPress={() => router.push('/screens/documentControlScreen')}>
        <Text style={styles.title}>Document Control</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f7',
    borderRadius: 10,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#007AFF',
  },
});


