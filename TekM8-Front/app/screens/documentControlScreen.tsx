import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect, useEffect } from 'react';
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
          {/* <View style={styles.card}>
            <Text style={styles.title}>Steps</Text>
            <HowToUpload />
          </View> */}

          <View style={styles.card}>
            <Text style={styles.title}>Upload a Document</Text>
            <UploadDocument />
          </View>
        </>
      }
      ListFooterComponent={
        <View style={styles.card}>
          <Text style={styles.title}>Your Documents</Text>
          <CurrentDocs />
        </View>
      }
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 70,
    backgroundColor: '#0B1A2F', // Dark background
  },
  card: {
    backgroundColor: '#D84343',
    borderRadius:6,
    paddingTop: 10,
    borderWidth: 1,
    // borderColor: '#ffffff33',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
    marginBottom:40
  },
  title: {
    padding: 10,
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
});
