import React from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import UploadDocument from '../components/UploadDocument';
import CurrentDocs from '../components/CurrentDocs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HowToUpload from '../components/HowToUpload';

export default function DocumentControlScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Document Control',
    });
  }, [navigation]);

  useEffect(() => {
    const logStoredDocs = async () => {
      try {
        const stored = await AsyncStorage.getItem('uploadedDocs');
        console.log('Stored uploadedDocs:', stored ? JSON.parse(stored) : 'No documents found');
      } catch (e) {
        console.error('Failed to read uploadedDocs from AsyncStorage:', e);
      }
    };
    logStoredDocs();
  }, []);

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      ListHeaderComponent={
        <>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Steps</Text>
            <HowToUpload />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Upload a Document</Text>
            <UploadDocument />
          </View>
        </>
      }
      ListFooterComponent={
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Documents</Text>
          <CurrentDocs />
        </View>
      }
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f9fafb',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    // subtle shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    // shadow for Android
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    color: '#0072CE',
    marginBottom: 12,
  },
});
