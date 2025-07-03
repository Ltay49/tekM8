import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function MockCameraScreen({ onCapture }: { onCapture: (uri: string) => void }) {
  const mockImageUri = 'https://via.placeholder.com/300x400.png?text=Simulated+Camera';

  const simulateCapture = () => {
    console.log('Simulated capture:', mockImageUri);
    onCapture(mockImageUri);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: mockImageUri }} style={styles.cameraMock} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={simulateCapture}>
          <Text style={styles.text}>Simulate Capture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraMock: {
    flex: 1,
    backgroundColor: '#ccc', // fallback color if image not loaded
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    backgroundColor: '#00000090',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
