import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProjectDetails() {
    const [userDetails, setUserDetails] = useState<any[]>([]);  // State to store user details

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const savedDetailsJSON = await AsyncStorage.getItem('userDetails');
                if (savedDetailsJSON) {
                    const parsedDetails = JSON.parse(savedDetailsJSON);
                    setUserDetails(parsedDetails);  // Set userDetails from AsyncStorage
                }
            } catch (error) {
                console.error('Failed to fetch user details from AsyncStorage:', error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleDelete = async (index: number) => {
        Alert.alert(
            'Delete',
            'Are you sure you want to delete these details?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            // Create a new array by filtering out the item to delete
                            const updatedDetails = userDetails.filter((_, idx) => idx !== index);

                            // Save the updated array to AsyncStorage
                            await AsyncStorage.setItem('userDetails', JSON.stringify(updatedDetails));

                            // Update the state to remove the deleted item
                            setUserDetails(updatedDetails);

                            Alert.alert('Success', 'Details deleted!');
                        } catch (error) {
                            console.error('Error deleting user details:', error);
                            Alert.alert('Error', 'Failed to delete details.');
                        }
                    },
                },
            ]
        );
    };

    const renderUserItem = ({ item, index }: { item: any, index: number }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>First Name: {item.firstName}</Text>
            <Text style={styles.itemTitle}>Surname: {item.surname}</Text>
            <Text style={styles.itemTitle}>Title: {item.title}</Text>
            <Text style={styles.itemTitle}>Project Name: {item.projectName}</Text>
            <Text style={styles.itemTitle}>Project Code: {item.projectCode}</Text>
            <Text style={styles.itemTitle}>Email: {item.email}</Text>
            <Text style={styles.itemTitle}>Signature:</Text>
            {item.signature ? (
                <Image
                    style={styles.signatureImage}
                    source={{ uri: item.signature.startsWith('data:') ? item.signature : `data:image/png;base64,${item.signature}` }}
                    resizeMode="contain"
                />
            ) : (
                <Text style={styles.noSignature}>No signature available</Text>
            )}

            {/* Delete Button */}
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(index)}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    if (userDetails.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>No saved user details available.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={userDetails}
            renderItem={renderUserItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
    },
    listContainer: {
        paddingVertical: 10,
    },
    itemContainer: {
        backgroundColor: '#fff',
        marginTop: 20,
        padding: 16,
        marginBottom: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
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
    deleteButton: {
        backgroundColor: '#FF0000',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    deleteButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
    },
});
