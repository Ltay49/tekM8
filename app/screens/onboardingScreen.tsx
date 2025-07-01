import React from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import HowToOnBoard from '../components/HowToInduct';
import UploadConstructionCard from '../components/UploadConstructionCard';

export default function OnboardingScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Onboarding',
    });
  }, [navigation]);

  const sections = [
    {
      title: 'Steps',
      data: ['dummy1'], // single dummy item, content rendered via section header
      renderContent: () => <HowToOnBoard />,
    },
    {
      title: 'Upload Cards',
      data: ['dummy2'],
      renderContent: () => <UploadConstructionCard />,
    },
    {
      title: 'Review Cards',
      data: ['dummy3'],
      renderContent: () => <Text style={{ color: '#666' }}>No content yet</Text>,
    },
    {
      title: 'Compose',
      data: ['dummy3'],
      renderContent: () => <Text style={{ color: '#666' }}>No content yet</Text>,
      
    },
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item + index}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.container}
      renderSectionHeader={({ section }) => (
        <View style={styles.section}>
          <Text style={styles.title}>{section.title}</Text>
          {section.renderContent()}
        </View>
      )}
      renderItem={() => null} // we render all content inside section header, so no items
      // optional: add some spacing between sections if needed
      SectionSeparatorComponent={() => <View style={{ height: 20 }} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f7',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    // subtle shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    // elevation for Android
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0072CE',
    marginBottom: 12,
  },
});
