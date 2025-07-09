import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HowToOnBoard from './components/HowToInduct';
import UploadConstructionCard from './components/UploadConstructionCard';
import ReviewCards from './components/ReviewCards';
import DocumentPreviewWithCSCS from './components/DocumentPreviewWithCSCS';

export default function OnboardingScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hides default header if you're using your own
    });
  }, [navigation]);

  const sections = [
    {
      title: 'Upload Cards',
      data: ['dummy2'],
      renderContent: () => <UploadConstructionCard />,
    },
    {
      title: 'Review Cards',
      data: ['dummy3'],
      renderContent: () => <ReviewCards />,
    },
    {
      title: 'Export / Print',
      data: ['dummy4'],
      renderContent: () => <DocumentPreviewWithCSCS />,
    },
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item + index}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.container}
      renderSectionHeader={({ section }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{section.title}</Text>
          {section.renderContent()}
        </View>
      )}
      renderItem={() => null}
      SectionSeparatorComponent={() => <View style={{ height: 20 }} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop:70,
    backgroundColor: '#0B1A2F', // Match full app dark background
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
  },
  title: {
    padding:5,
    paddingLeft:10,
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  placeholder: {
    fontSize: 14,
    color: '#ccc',
    fontStyle: 'italic',
  },
});
