import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

import UploadDocument from '../components/UploadDocument';
import CurrentDocs from '../components/CurrentDocs';
import HowToUpload from '../components/HowToUpload';
import WhyToConfig from '../components/WhyToConfig';
import EnterDetails from '../components/EnterProjectDetails';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ConfigurationScreen() {
  const navigation = useNavigation();
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: 'Document Control' });

    const logStoredDocs = async () => {
      try {
        const stored = await AsyncStorage.getItem('uploadedDocs');
        console.log('Stored uploadedDocs:', stored ? JSON.parse(stored) : 'No documents found');
      } catch (e) {
        console.error('Failed to read uploadedDocs from AsyncStorage:', e);
      }
    };

    logStoredDocs();
  }, [navigation]);

  const toggleDetails = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDetailsExpanded(prev => !prev);
  };

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      ListHeaderComponent={
        <>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Information</Text>
            <WhyToConfig />
          </View>

          <View style={styles.sectionContainer}>
            <TouchableOpacity onPress={toggleDetails} style={styles.collapsibleHeader}>
              <Text style={styles.sectionTitle}>Details Section</Text>
              <AntDesign
                name={detailsExpanded ? 'up' : 'down'}
                size={20}
                color="#007AFF"
              />
            </TouchableOpacity>
            {detailsExpanded && <EnterDetails />}
          </View>
        </>
      }
      ListFooterComponent={
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Project Details</Text>
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
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    color: '#0072CE',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
