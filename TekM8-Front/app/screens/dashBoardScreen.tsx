import { FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import DirectorySection from '../components/DirectorySection';
import Dashboard from '../components/Dashboard';

export default function DashBoardScreen() {
  const [showDirectory, setShowDirectory] = useState(true);

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      ListHeaderComponent={
        <>
          {/* Labour Reporting Section */}
         
            {/* <Text style={styles.sectionTitle}>Angel Gardens</Text> */}
            <Dashboard />
         

          {/* Directory Section (collapsible) */}
          <View style={styles.sectionContainer}>
            <Pressable
              onPress={() => setShowDirectory(!showDirectory)}
              style={({ pressed }) => [
                styles.toggleHeader,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.toggleRow}>
                <Text style={styles.sectionTitle}>Directory</Text>
                <AntDesign
                  name={showDirectory ? 'up' : 'down'}
                  size={20}
                  color="#007AFF"
                  style={styles.icon}
                />
              </View>
            </Pressable>

            {showDirectory && (
              <View style={styles.directoryWrapper}>
                <DirectorySection />
              </View>
            )}
          </View>
        </>
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
    // paddingHorizontal: 16,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
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
  toggleHeader: {
    paddingBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginLeft: 8,
  },
  directoryWrapper: {
    marginTop: 12,
  },
});
