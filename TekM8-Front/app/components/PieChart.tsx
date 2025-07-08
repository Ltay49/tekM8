import React, { useState } from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const workforceData = [
  { name: 'Plasterer', population: 20, color: '#f39c12', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Fixer', population: 15, color: '#e74c3c', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Labourer', population: 40, color: '#2ecc71', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Management', population: 25, color: '#3498db', legendFontColor: '#7F7F7F', legendFontSize: 15 },
];

const skillsData = [
  { name: 'IPAF', population: 30, color: '#9b59b6', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'PASMA', population: 25, color: '#1abc9c', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'First Aid', population: 20, color: '#e67e22', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'SSSTS', population: 15, color: '#34495e', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'SMSTS', population: 10, color: '#95a5a6', legendFontColor: '#7F7F7F', legendFontSize: 15 },
];

const PieChartComponent = () => {
  const [selectedChart, setSelectedChart] = useState<'workforce' | 'skills'>('workforce');

  const isWorkforce = selectedChart === 'workforce';
  const chartTitle = isWorkforce ? 'Workforce Split' : 'Skills Split';
  const chartData = isWorkforce ? workforceData : skillsData;

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, isWorkforce && styles.activeButton]}
          onPress={() => setSelectedChart('workforce')}
        >
          <Text style={styles.toggleText}>Workforce</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isWorkforce && styles.activeButton]}
          onPress={() => setSelectedChart('skills')}
        >
          <Text style={styles.toggleText}>Skills</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{chartTitle}</Text>

      <PieChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          color: () => '#000',
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="0"
        absolute
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: 'white',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    marginRight: 10,
  },
  activeButton: {
    backgroundColor: 'white',
  },
  toggleText: {
    color: 'grey',
    fontWeight: 'bold',
  },
});

export default PieChartComponent;

