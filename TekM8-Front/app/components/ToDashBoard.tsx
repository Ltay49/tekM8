import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from 'expo-router';

export default function ToDashboard() {

    const router = useRouter();


    return (
        <>
          <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push('/screens/dashBoardScreen')}
        style={styles.button}
        activeOpacity={0.7}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
          <Text style={styles.title}>Dashboard</Text>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      width: '100%',
    },
    button: {
      width: '100%',
      backgroundColor: '#007AFF',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 5,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 18,
      fontFamily: 'Montserrat_700Bold',
      color: '#fff',
    },
  });