import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProjectDetails() {
    const [details, setDetails] = useState<null | {
        firstName: string;
        surname: string;
        title: string;
        projectName: string;
        projectCode: string;
        email: string;
        signature: string;  // base64 PNG string with data URI prefix or raw base64
    }>(null);

    useEffect(() => {
        if (details) {
            const { signature, ...rest } = details;
            console.log('Details:', rest);
            console.log('Signature base64 preview:', signature.slice(0, 30) + '...');
        }
    }, [details]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const json = await AsyncStorage.getItem('userDetails');
                if (json) {
                    const parsed = JSON.parse(json);
                    setDetails(parsed);
                }
            } catch (error) {
                console.error('Failed to load user details:', error);
            }
        };

        fetchDetails();
    }, []);

    if (!details) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading details...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>First Name:</Text>
            <Text style={styles.value}>{details.firstName}</Text>

            <Text style={styles.label}>Surname:</Text>
            <Text style={styles.value}>{details.surname}</Text>

            <Text style={styles.label}>Title:</Text>
            <Text style={styles.value}>{details.title}</Text>

            <Text style={styles.label}>Project Name:</Text>
            <Text style={styles.value}>{details.projectName}</Text>

            <Text style={styles.label}>Project Code:</Text>
            <Text style={styles.value}>{details.projectCode}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{details.email}</Text>

            <Text style={styles.label}>Signature:</Text>
            {details.signature ? (
                <Image
                    style={styles.signatureImage}
                    source={{ uri: details.signature.startsWith('data:') ? details.signature : `data:image/png;base64,${details.signature}` }}
                    resizeMode="contain"
                />
            ) : (
                <Text style={styles.noSignature}>No signature available</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    label: {
        fontWeight: '700',
        fontSize: 16,
        marginTop: 12,
        color: '#333',
    },
    value: {
        fontSize: 16,
        marginTop: 4,
        color: '#555',
    },
    signatureImage: {
        marginTop: 10,
        width: '100%',
        height: 150,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    noSignature: {
        marginTop: 10,
        fontStyle: 'italic',
        color: '#999',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#777',
    },
});
