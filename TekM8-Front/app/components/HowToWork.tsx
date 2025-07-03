import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HowToWork() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleLinkPress = () => {
    // Open a URL or navigate to a licensing/documentation page
    Linking.openURL('https://your-documentation-link.com'); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Text style={styles.title}>How it Works</Text>
        <AntDesign name={expanded ? 'up' : 'down'} size={20} color="#007AFF" />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <Text style={styles.step}>
            <Text style={styles.stepNumber}>1. </Text>
            Configure your project settings, add your project details, this will aid the automation of the induction process.
          </Text>

          <Text style={styles.step}>
            <Text style={styles.stepNumber}>2. </Text>
            Upload your onboarding documentation.{'\n'}
            <Text style={styles.stepDetail}>e.g. Induction checklist and PPE sheet.</Text>
          </Text>

          <Text style={styles.step}>
            <Text style={styles.stepNumber}>3. </Text>
            Use the camera or upload photos of your CITB construction cards.
          </Text>

          <Text style={styles.step}>
            <Text style={styles.stepNumber}>4. </Text>
            We'll extract your details using Google Vision API.
          </Text>

          <Text style={styles.note}>
            ⚠️ Make sure your documents are clear and well-lit for best results.
          </Text>

          <TouchableOpacity onPress={handleLinkPress} style={styles.linkContainer}>
            <Text style={styles.linkText}>
              For licensing and documentation click here.
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    margin: 8,
    backgroundColor: '#F4F7FA',
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Montserrat_800ExtraBold',
    color: '#1A1A1A',
  },
  content: {
    marginTop: 16,
  },
  step: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  stepNumber: {
    fontFamily: 'Montserrat_700Bold',
    color: '#007AFF',
  },
  stepDetail: {
    fontStyle: 'italic',
    fontFamily: 'Montserrat_400Regular',
    color: '#555',
    fontSize: 15,
  },
  note: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 10,
  },
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    color: '#007AFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
