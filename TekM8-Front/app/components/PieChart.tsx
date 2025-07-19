import React, { useState } from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const workforceData = [
    { name: 'Plasterer', population: 8, color: '#f39c12', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Fixer', population: 6, color: '#e74c3c', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Labourer', population: 18, color: '#2ecc71', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Management', population: 10, color: '#3498db', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];
  
  const skillsData = [
    { name: 'IPAF', population: 12, color: '#9b59b6', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'PASMA', population: 10, color: '#1abc9c', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'First Aid', population: 8, color: '#e67e22', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'SSSTS', population: 7, color: '#34495e', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'SMSTS', population: 5, color: '#95a5a6', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];
  
  const areaData = [
    { name: 'GF', population: 10, color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Level 01', population: 9, color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Level 02', population: 8, color: '#FFCE56', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Level 03', population: 5, color: '#4BC0C0', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Roof', population: 4, color: '#9966FF', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Site Wide', population: 6, color: '#C9CBCF', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];
  
  const taskData = [
    { name: '1st Fixing', population: 10, color: '#f1c40f', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: '2nd Fixing', population: 9, color: '#2ecc71', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Plastering', population: 8, color: '#3498db', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Snagging', population: 5, color: '#9b59b6', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'M&E Install', population: 6, color: '#34495e', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Decorating', population: 4, color: '#e67e22', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];
  

const PieChartComponent = () => {
  const [selectedChart, setSelectedChart] = useState<'workforce' | 'skills' | 'area' | 'task'>('workforce');

  const chartMap = {
    workforce: workforceData,
    skills: skillsData,
    area: areaData,
    task: taskData,
  };

  const chartTitleMap = {
    workforce: 'Workforce Split',
    skills: 'Skills Split',
    area: 'Most Active Areas',
    task: 'Tasks Breakdown',
  };

  return (
    <View style={styles.container}>
      {/* Toggle Buttons */}
      <View style={styles.toggleRow}>
        {(['workforce', 'skills', 'area', 'task'] as const).map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.toggleButton, selectedChart === type && styles.activeButton]}
            onPress={() => setSelectedChart(type)}
          >
            <Text style={[styles.toggleText, selectedChart === type && styles.activeText]}>
              {chartTitleMap[type]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart Title */}
      <Text style={styles.title}>{chartTitleMap[selectedChart]}</Text>

      {/* Pie Chart */}
      <PieChart
        data={chartMap[selectedChart]}
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
    paddingBottom: 20,
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
    flexWrap: 'wrap',
    padding: 10,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    margin: 5,
  },
  activeButton: {
    backgroundColor: 'white',
  },
  toggleText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 13,
  },
  activeText: {
    color: '#0B1A2F',
  },
});

export default PieChartComponent;
