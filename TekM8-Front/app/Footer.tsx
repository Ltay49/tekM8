import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Footer() {
    const router = useRouter();

    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/')}>
                <MaterialIcons name="home" size={24} color="#ffffff" />
                <Text style={styles.iconLabel}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/components/DirectorySection')}>
                <Feather name="users" size={24} color="#ffffff" />
                <Text style={styles.iconLabel}>Directory</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push('/onboardingScreen')}
            >
                <MaterialIcons name="how-to-reg" size={24} color="#ffffff" />
                <Text style={styles.iconLabel}>Induct</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.iconButton} 
                onPress={() => router.push('/components/SiteReport')}
                >
                <Ionicons name="document-text-outline" size={24} color="#ffffff" />
                <Text style={styles.iconLabel}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settingsScreen')}>
                <Feather name="settings" size={24} color="#ffffff" />
                <Text style={styles.iconLabel}>Settings</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#1C1C1E',
        paddingVertical: 9,
        borderTopColor: '#ffffff33',
        borderTopWidth: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 1,
    },
    iconButton: {
        alignItems: 'center',
    },
    iconLabel: {
        fontSize: 12,
        color: '#ffffff',
        marginTop: 2,
    },
});
