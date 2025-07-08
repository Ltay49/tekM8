import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import PieChartComponent from './PieChart';

export default function Dashboard() {
  const [projectName, setProjectName] = useState('Ancoats St');
  const [showAllInductees, setShowAllInductees] = useState(false);
  const [showAllHandovers, setShowAllHandovers] = useState(false);
  const [showAllReports, setShowAllReports] = useState(false);

  const totalOps = 42;
  const projectEndDate = '30 Aug 2025';
  const weeksRemaining = 7;
  const totalHandoversRemaining = 15;
  const projectCode = 'PA-001';
  const postCode = 'M3 3LE'

  const inductees = [
    { name: 'John Thompson', date: '1 Jul' },
    { name: 'Ayesha Khan', date: '3 Jul' },
    { name: 'Leonard Grant', date: '5 Jul' },
    { name: 'Samuel Rivers', date: '6 Jul' },
    { name: 'Lana Silva', date: '7 Jul' },
  ];

  const upcomingHandovers = [
    { section: 'Block A - Roof', date: '8 Jul' },
    { section: 'Block B - Plumbing', date: '10 Jul' },
    { section: 'External Works', date: '12 Jul' },
    { section: 'Block C - Final Fix', date: '15 Jul' },
    { section: 'Snagging Zone 1', date: '18 Jul' },
  ];

  const siteReports = [
    { title: 'Daily Report - 1 Jul', date: '1 Jul' },
    { title: 'Inspection Notes - 3 Jul', date: '3 Jul' },
    { title: 'Weather Delay Log', date: '4 Jul' },
    { title: 'Concrete Pour Checklist', date: '5 Jul' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Project Header Card */}
      <View style={styles.cardHeader}>
        <View style={styles.projectRow}>
          <View>
            <Text style={styles.projectName}>{projectName}</Text>
            <Text style={styles.projectCode}>{projectCode}</Text>
            <Text style={styles.projectCode}>{postCode}</Text>
          </View>
          <TouchableOpacity style={styles.switchButton} onPress={() => {}}>
            <Text style={styles.switchText}>Switch Project</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Project Stats Grid 2x2 */}
      <View style={styles.gridContainer}>
        {/* <View style={styles.gridItem}><Text style={styles.statLabel}>Project End</Text><Text style={styles.statValueSmallHighlight}>{projectEndDate}</Text></View> */}
        <View style={styles.gridItem}><Text style={styles.statLabel}>Weeks Left</Text><Text style={styles.statValueHighlight}>{weeksRemaining}</Text></View>
        <View style={styles.gridItem}><Text style={styles.statLabel}>Total Ops</Text><Text style={styles.statValueSmall}>{totalOps}</Text></View>
        <View style={styles.gridItem}><Text style={styles.statLabel}>Hand - overs</Text><Text style={styles.statValueSmallHighlight}>{totalHandoversRemaining}</Text></View>
      </View>

    <PieChartComponent />
      {/* Upcoming Handovers */}
      <View style={styles.cardSection}>
        <View style={styles.inductionsHeader}>
          <Text style={styles.statLabel}>Upcoming Handovers({upcomingHandovers.length})</Text>
          <TouchableOpacity onPress={() => setShowAllHandovers(!showAllHandovers)}>
            <Text style={styles.link}>{showAllHandovers ? 'Show Less' : 'See All'}</Text>
          </TouchableOpacity>
        </View>
        {(showAllHandovers ? upcomingHandovers : upcomingHandovers.slice(0, 3)).map((item, index, arr) => (
          <View key={index}>
            <View style={styles.inducteeRow}>
              <Text style={styles.inducteeName}>{item.section}</Text>
              <Text style={styles.inducteeDate}>{item.date}</Text>
            </View>
            {index < arr.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Inductees List */}
      <View style={styles.cardSection}>
        <View style={styles.inductionsHeader}>
          <Text style={styles.statLabel}>Inductees</Text>
          <TouchableOpacity onPress={() => setShowAllInductees(!showAllInductees)}>
            <Text style={styles.link}>{showAllInductees ? 'Show Less' : 'See All'}</Text>
          </TouchableOpacity>
        </View>
        {(showAllInductees ? inductees : inductees.slice(0, 3)).map((item, index, arr) => (
          <View key={index}>
            <View style={styles.inducteeRow}>
              <Text style={styles.inducteeName}>{item.name}</Text>
              <Text style={styles.inducteeDate}>{item.date}</Text>
            </View>
            {index < arr.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Site Reports Section */}
      <View style={styles.cardSection}>
        <View style={styles.inductionsHeader}>
          <Text style={styles.statLabel}>Site Reports</Text>
          <TouchableOpacity onPress={() => setShowAllReports(!showAllReports)}>
            <Text style={styles.link}>{showAllReports ? 'Show Less' : 'See All'}</Text>
          </TouchableOpacity>
        </View>
        {(showAllReports ? siteReports : siteReports.slice(0, 3)).map((item, index, arr) => (
          <View key={index}>
            <View style={styles.inducteeRow}>
              <Text style={styles.inducteeName}>{item.title}</Text>
              <Text style={styles.inducteeDate}>{item.date}</Text>
            </View>
            {index < arr.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: '#0B1A2F',
  },
  projectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectName: {
    fontSize: 26,
    fontWeight: '800',
    color: 'black',
  },
  projectCode: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginTop: 2,
  },
  switchButton: {
    marginTop:30,
    backgroundColor: '#1C1C1E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2F2F31',
  },
  switchText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00B0FF',
  },
  cardHeader: {
    backgroundColor: '#D84343',
    borderRadius: 4,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    width: '30%',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ffffff33',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  cardSection: {
    backgroundColor: '#1F3B60',
    borderRadius: 4,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffffff33',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  statLabel: {
    fontSize: 18,
    color: '#90CAF9',
    textTransform: 'uppercase',
    marginBottom: 6,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statValueHighlight: {
    textAlign:'center',
    fontSize: 32,
    fontWeight: '800',
    color: '#00E676',
  },
  statValueSmall: {
    textAlign:'center',
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statValueSmallHighlight: {
    textAlign:'center',
    fontSize: 32,
    fontWeight: '700',
    color: '#FF9800',
  },
  inductionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  link: {
    color: '#00B0FF',
    textDecorationLine:'underline',
    fontSize: 16,
    fontWeight: '600',
  },
  inducteeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  inducteeName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  inducteeDate: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '500',
    textAlign: 'right',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 6,
  },
});
