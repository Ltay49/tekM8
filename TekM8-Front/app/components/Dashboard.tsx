import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// Import your PieChart component
import PieChartComponent from './PieChart';

// Type definitions
type StatusType = 'completed' | 'in-progress' | 'pending';
type PriorityType = 'high' | 'medium' | 'low';
type ReportType = 'daily' | 'inspection' | 'delay' | 'checklist';

interface Inductee {
  name: string;
  date: string;
}

interface Handover {
  section: string;
  date: string;
  actions: number;
  comments: number;
  reports: number; // new field
}



interface SiteReport {
  title: string;
  date: string;
  type: ReportType;
}

interface Snag {
  description: string;
  level: string;
  date: string;
  priority: PriorityType;
  progress: number;
  status: StatusType;
}

export default function Dashboard() {
  const [projectName, setProjectName] = useState('Ancoats St');
  const [showAllInductees, setShowAllInductees] = useState(false);
  const [showAllHandovers, setShowAllHandovers] = useState(false);
  const [showAllReports, setShowAllReports] = useState(false);
  const [showAllSnags, setShowAllSnags] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnims = useRef(Array(6).fill(0).map(() => new Animated.Value(0.9))).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.stagger(100,
        scaleAnims.map(anim =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, []);

  const totalOps = 42;
  const projectEndDate = '30 Aug 2025';
  const weeksRemaining = 7;
  const totalHandoversRemaining = 15;
  const openSnags = 69;
  const closedSnags = 124;
  const compSnags = 30;
  const projectCode = 'PA-001';
  const postCode = 'M3 3LE';

  const inductees: Inductee[] = [
    { name: 'John Thompson', date: '1 Jul' },
    { name: 'Ayesha Khan', date: '3 Jul' },
    { name: 'Leonard Grant', date: '5 Jul' },
    { name: 'Samuel Rivers', date: '6 Jul' },
    { name: 'Lana Silva', date: '7 Jul' },
  ];

  const upcomingHandovers: Handover[] = [
    {
      section: 'Block A - Level 10 - 2nd Fix',
      date: '8 Jul',
      actions: 10,
      comments: 6,
      reports: 2,
    },
    {
      section: 'Block B - Level 06 - 2nd Fix',
      date: '10 Jul',
      actions: 7,
      comments: 3,
      reports: 1,
    },
    {
      section: 'External Works',
      date: '18 Jul',
      actions: 12,
      comments: 9,
      reports: 4,
    },
    {
      section: 'Block C - Final Fix',
      date: '15 Jul',
      actions: 9,
      comments: 2,
      reports: 3,
    },
    {
      section: 'Snagging Zone 1',
      date: '18 Jul',
      actions: 5,
      comments: 1,
      reports: 0,
    },
  ];



  const siteReports: SiteReport[] = [
    { title: 'Daily Report - 1 Jul', date: '1 Jul', type: 'daily' },
    { title: 'Inspection Notes - 3 Jul', date: '3 Jul', type: 'inspection' },
    { title: 'Weather Delay Log', date: '4 Jul', type: 'delay' },
    { title: 'Concrete Pour Checklist', date: '5 Jul', type: 'checklist' },
  ];

  const snags = [
    { level: 'Level 01', closed: 10, open: 100, complete: 20 },
    { level: 'Level 02', closed: 5, open: 80, complete: 15 },
    { level: 'Level 03', closed: 12, open: 70, complete: 25 },
    { level: 'Level 04', closed: 20, open: 50, complete: 30 },
    { level: 'Level 05', closed: 8, open: 90, complete: 10 },
  ];


  const getStatusColor = (status: StatusType): string => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      case 'pending': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getPriorityColor = (priority: PriorityType): string => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getReportIcon = (type: ReportType): keyof typeof MaterialIcons.glyphMap => {
    switch (type) {
      case 'daily': return 'today';
      case 'inspection': return 'search';
      case 'delay': return 'schedule';
      case 'checklist': return 'checklist';
      default: return 'description';
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Animated Project Header Card */}
      <Animated.View
        style={[
          styles.cardHeader,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.projectRow}>
          <View>
            <Text style={styles.projectName}>{projectName}</Text>
            <View style={styles.codeRow}>
              <View style={styles.codeBadge}>
                <Text style={styles.projectCode}>{projectCode}</Text>
              </View>
              <View style={styles.codeBadge}>
                <Text style={styles.projectCode}>{postCode}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.switchButton} onPress={() => { }}>
            <MaterialIcons name="swap-horiz" size={20} color="#00B0FF" />
            <Text style={styles.switchText}>Switch</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Animated Project Stats Grid */}
      <View style={styles.gridContainer}>
        <Animated.View style={[styles.gridItem, styles.weeksLeftCard, { transform: [{ scale: scaleAnims[0] }] }]}>
          <MaterialIcons name="schedule" size={24} color="#00E676" />
          <Text style={styles.statLabel}>Weeks Left</Text>
          <Text style={styles.statValueHighlight}>{weeksRemaining}</Text>
        </Animated.View>

        <Animated.View style={[styles.gridItem, { transform: [{ scale: scaleAnims[1] }] }]}>
          <MaterialIcons name="people" size={24} color="#90CAF9" />
          <Text style={styles.statLabel}>Total Ops</Text>
          <Text style={styles.statValueSmall}>{totalOps}</Text>
        </Animated.View>

        <Animated.View style={[styles.gridItem, { transform: [{ scale: scaleAnims[2] }] }]}>
          <MaterialIcons name="handshake" size={24} color="#FF9800" />
          <Text style={styles.statLabel}>H/O(s) TBC</Text>
          <Text style={styles.statValueSmallHighlight}>{totalHandoversRemaining}</Text>
        </Animated.View>

        <Animated.View style={[styles.gridItem, styles.snagOpen, { transform: [{ scale: scaleAnims[3] }] }]}>
          <MaterialIcons name="error" size={24} color="#FFB5A7" />
          <Text style={styles.statLabel}>Open Snags</Text>
          <Text style={styles.statValueSmallHighlightOpen}>{openSnags}</Text>
        </Animated.View>

        <Animated.View style={[styles.gridItem, styles.snagClosed, { transform: [{ scale: scaleAnims[4] }] }]}>
          <MaterialIcons name="check-circle" size={24} color="lightgreen" />
          <Text style={styles.statLabel}>Closed</Text>
          <Text style={styles.statValueSmallHighlightClosed}>{closedSnags}</Text>
        </Animated.View>

        <Animated.View style={[styles.gridItem, { transform: [{ scale: scaleAnims[5] }] }]}>
          <MaterialIcons name="done-all" size={24} color="#FFD6BA" />
          <Text style={styles.statLabel}>Complete</Text>
          <Text style={styles.statValueSmallHighlightComp}>{compSnags}</Text>
        </Animated.View>
      </View>

      {/* PieChart Component */}
      <PieChartComponent />

      {/* Enhanced Upcoming Handovers */}
      <View style={styles.cardSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.headerWithIcon}>
            <MaterialIcons name="assignment" size={24} color="#90CAF9" />
            <Text style={styles.sectionTitle}>Upcoming H/O(s) ({upcomingHandovers.length})</Text>
          </View>
          <TouchableOpacity onPress={() => setShowAllHandovers(!showAllHandovers)}>
            <Text style={styles.link}>{showAllHandovers ? 'Show Less' : 'See All'}</Text>
          </TouchableOpacity>
        </View>
        {(showAllHandovers ? upcomingHandovers : upcomingHandovers.slice(0, 3)).map((item, index, arr) => (
          <View key={index}>
            <Link
              href={{
                pathname: '/components/handovers/[id]',
                params: {
                  id: index.toString(),
                  section: item.section,
                  date: item.date,
                },
              }}
              asChild
            >
              <TouchableOpacity style={styles.enhancedRow}>
                <View style={styles.rowContent}>
                  {/* Top row: Section title */}
                  <View style={styles.rowHeader}>
                    <Text style={styles.itemTitle}>{item.section}</Text>
                  </View>

                  {/* Stacked actions/comments */}
                  <View style={styles.stackedInfo}>
                    <View style={styles.metaRow}>
                      <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                      <Text style={styles.metaText}>{item.actions} tasks</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <MaterialIcons name="chat-bubble-outline" size={16} color="#90CAF9" />
                      <Text style={styles.metaText}>{item.comments} comments</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <MaterialIcons name="description" size={16} color="#FFD54F" />
                      <Text style={styles.metaText}>{item.reports} reports</Text>
                    </View>
                  </View>
                </View>

                {/* Right meta */}
                <View style={styles.rowMeta}>
                  <Text style={styles.itemDate}>{item.date}</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#90CAF9" />
                </View>
              </TouchableOpacity>
            </Link>
            {index < arr.length - 1 && <View style={styles.divider} />}
          </View>
        ))}

      </View>

      {/* Enhanced Inductees List */}
      <View style={styles.cardSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.headerWithIcon}>
            <MaterialIcons name="school" size={24} color="#90CAF9" />
            <Text style={styles.sectionTitle}>Inductees ({inductees.length})</Text>
          </View>
          <TouchableOpacity onPress={() => setShowAllInductees(!showAllInductees)}>
            <Text style={styles.link}>{showAllInductees ? 'Show Less' : 'See All'}</Text>
          </TouchableOpacity>
        </View>
        {(showAllInductees ? inductees : inductees.slice(0, 3)).map((item, index, arr) => (
          <View key={index}>
            <View style={styles.enhancedRow}>
              <View style={styles.rowContent}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{item.name.split(' ').map(n => n[0]).join('')}</Text>
                </View>
                <Text style={styles.itemTitle}>{item.name}</Text>
              </View>
              <View style={styles.rowMeta}>
                <Text style={styles.itemDate}>{item.date}</Text>
              </View>
            </View>
            {index < arr.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Enhanced Site Reports Section */}
      <View style={styles.cardSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.headerWithIcon}>
            <MaterialIcons name="description" size={24} color="#90CAF9" />
            <Text style={styles.sectionTitle}>Site Reports ({siteReports.length})</Text>
          </View>
          <TouchableOpacity onPress={() => setShowAllReports(!showAllReports)}>
            <Text style={styles.link}>{showAllReports ? 'Show Less' : 'See All'}</Text>
          </TouchableOpacity>
        </View>
        {(showAllReports ? siteReports : siteReports.slice(0, 3)).map((item, index, arr) => (
          <View key={index}>
            <TouchableOpacity style={styles.enhancedRow}>
              <View style={styles.rowContent}>
                <View style={styles.reportIconContainer}>
                  <MaterialIcons name={getReportIcon(item.type)} size={20} color="#90CAF9" />
                </View>
                <Text style={styles.itemTitle}>{item.title}</Text>
              </View>
              <View style={styles.rowMeta}>
                <Text style={styles.itemDate}>{item.date}</Text>
                <MaterialIcons name="chevron-right" size={20} color="#90CAF9" />
              </View>
            </TouchableOpacity>
            {index < arr.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Enhanced Snags Section */}
      <View style={styles.cardSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.headerWithIcon}>
            <MaterialIcons name="construction" size={24} color="#90CAF9" />
            <Text style={styles.sectionTitle}>Snags ({snags.length})</Text>
          </View>
          <TouchableOpacity onPress={() => setShowAllSnags(!showAllSnags)}>
            <Text style={styles.link}>{showAllSnags ? 'Show Less' : 'See All'}</Text>
          </TouchableOpacity>
        </View>
        {(showAllSnags ? snags : snags.slice(0, 3)).map((item, index, arr) => (
          <View key={index}>
            <TouchableOpacity style={styles.enhancedRow}>
              <View style={styles.rowContent}>
                {/* Header with Level */}
                <View style={styles.rowHeader}>
                  <Text style={styles.itemTitle}>{item.level}</Text>
                </View>

                {/* Stacked numbers and labels */}
                <View style={styles.stackedSnagStats}>
                  <View style={styles.statItem}>
                    <View style={styles.circleRow}>
                      <View style={[styles.statCircle, { backgroundColor: '#4CAF50' }]} />
                      <Text style={styles.statValue}>{item.closed}</Text>
                    </View>
                    <Text style={styles.statLabel}>CLOSED</Text>
                  </View>

                  <View style={styles.statItem}>
                    <View style={styles.circleRow}>
                      <View style={[styles.statCircle, { backgroundColor: '#F44336' }]} />
                      <Text style={styles.statValue}>{item.open}</Text>
                    </View>
                    <Text style={styles.statLabel}>OPEN</Text>
                  </View>

                  <View style={styles.statItem}>
                    <View style={styles.circleRow}>
                      <View style={[styles.statCircle, { backgroundColor: '#FF9800' }]} />
                      <Text style={styles.statValue}>{item.complete}</Text>
                    </View>
                    <Text style={styles.statLabel}>COMPLETE</Text>
                  </View>
                </View>

              </View>

              {/* Arrow icon */}
              <View style={styles.rowMeta}>
                <MaterialIcons name="chevron-right" size={20} color="#90CAF9" />
              </View>
            </TouchableOpacity>

            {index < arr.length - 1 && <View style={styles.divider} />}
          </View>
        ))}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 55,
    paddingHorizontal: 16,
    backgroundColor: '#0B1A2F',
    paddingBottom: 20, // Extra space for footer
  },
  cardHeader: {
    backgroundColor: '#D84343',
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    shadowColor: '#D84343',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  projectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  projectName: {
    fontSize: 28,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  codeRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  codeBadge: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  projectCode: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  switchButton: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 28,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00B0FF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
  },
  gridItem: {
    width: '30%',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffffff33',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    alignItems: 'center',
    gap: 6,
  },
  weeksLeftCard: {
    backgroundColor: '#1B5E20',
    borderColor: '#4CAF50',
  },
  snagOpen: {
    backgroundColor: '#4A2C2A',
    borderColor: '#F44336',
  },
  snagClosed: {
    backgroundColor: '#2E4A2E',
    borderColor: '#4CAF50',
  },
  statValueHighlight: {
    fontSize: 24,
    fontWeight: '800',
    color: '#00E676',
    textAlign: 'center',
  },
  statValueSmall: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  statValueSmallHighlight: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF9800',
    textAlign: 'center',
  },
  statValueSmallHighlightOpen: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFB5A7',
    textAlign: 'center',
  },
  statValueSmallHighlightClosed: {
    fontSize: 24,
    fontWeight: '700',
    color: 'lightgreen',
    textAlign: 'center',
  },
  statValueSmallHighlightComp: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD6BA',
    textAlign: 'center',
  },
  cardSection: {
    backgroundColor: '#1F3B60',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffffff33',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#90CAF9',
    fontWeight: '700',
  },
  link: {
    color: '#00B0FF',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  enhancedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#90CAF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B1A2F',
  },
  reportIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(144, 202, 249, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  itemDate: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '500',
    marginLeft: 10
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  levelText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
    marginTop: 2,
  },
  stackedInfo: {
    marginTop: 8,
    gap: 4,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  metaText: {
    fontSize: 13,
    color: '#E0E0E0',
    fontWeight: '500',
  },
  inlineMetaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stackedSnagStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  statItem: {
    alignItems: 'center',
    minWidth: 70,
  },

  circleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  statCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },

  statLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
    textAlign: 'center',
  },
});