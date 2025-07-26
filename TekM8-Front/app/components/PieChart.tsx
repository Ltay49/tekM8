import React, { useState } from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

interface ChartData {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

const workforceData: ChartData[] = [
    { name: 'Plasterer', population: 8, color: '#00E676', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'Fixer', population: 6, color: '#FF6B6B', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'Labourer', population: 18, color: '#4CAF50', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'Management', population: 10, color: '#90CAF9', legendFontColor: '#90CAF9', legendFontSize: 13 },
];

const skillsData: ChartData[] = [
    { name: 'IPAF', population: 12, color: '#FF9800', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'PASMA', population: 10, color: '#00B0FF', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'First Aid', population: 8, color: '#FFD700', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'SSSTS', population: 7, color: '#E91E63', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'SMSTS', population: 5, color: '#9C27B0', legendFontColor: '#90CAF9', legendFontSize: 13 },
];

const areaData: ChartData[] = [
    { name: 'GF', population: 10, color: '#FF6384', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'Level 01', population: 9, color: '#36A2EB', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'Level 02', population: 8, color: '#FFCE56', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'Level 03', population: 5, color: '#4BC0C0', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'Roof', population: 4, color: '#9966FF', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'Site Wide', population: 6, color: '#FF9F40', legendFontColor: '#90CAF9', legendFontSize: 13 },
];

const taskData: ChartData[] = [
    { name: '1st Fixing', population: 10, color: '#FFD54F', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: '2nd Fixing', population: 9, color: '#81C784', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'Plastering', population: 8, color: '#64B5F6', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'Snagging', population: 5, color: '#BA68C8', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'M&E Install', population: 6, color: '#78909C', legendFontColor: '#90CAF9', legendFontSize: 13 },
    { name: 'Decorating', population: 4, color: '#FFB74D', legendFontColor: '#90CAF9', legendFontSize: 13 },
];

type ChartType = 'workforce' | 'skills' | 'area' | 'task';

const PieChartComponent: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<ChartType>('workforce');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [visibleCharts, setVisibleCharts] = useState<ChartType[]>(['workforce', 'skills', 'area', 'task']);

  const chartMap: Record<ChartType, ChartData[]> = {
    workforce: workforceData,
    skills: skillsData,
    area: areaData,
    task: taskData,
  };

  const chartTitleMap: Record<ChartType, string> = {
    workforce: 'Workforce Split',
    skills: 'Skills Split',
    area: 'Most Active Areas',
    task: 'Tasks Breakdown',
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDisplayText = (): string => {
    if (!startDate && !endDate) return 'Select Date Range';
    if (startDate && !endDate) return `${formatDate(startDate)} - Select end`;
    if (startDate && endDate) return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    return 'Select Date Range';
  };

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateInRange = (date: Date | null): boolean => {
    if (!startDate || !endDate || !date) return false;
    return date >= startDate && date <= endDate;
  };

  const handleDateClick = (date: Date): void => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date >= startDate) {
        setEndDate(date);
      } else {
        setStartDate(date);
        setEndDate(startDate);
      }
    }
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const clearDates = (): void => {
    setStartDate(null);
    setEndDate(null);
  };

  const toggleChartVisibility = (chartType: ChartType): void => {
    setVisibleCharts(prev => {
      if (prev.includes(chartType)) {
        // Don't allow removing if it's the only visible chart
        if (prev.length === 1) return prev;
        const newVisible = prev.filter(chart => chart !== chartType);
        // If the currently selected chart is being hidden, switch to the first visible one
        if (selectedChart === chartType && newVisible.length > 0) {
          setSelectedChart(newVisible[0]);
        }
        return newVisible;
      } else {
        return [...prev, chartType];
      }
    });
  };

  const applyChartSelection = (): void => {
    setShowAddModal(false);
  };

  const applyDateRange = (): void => {
    console.log('Date range applied:', { startDate, endDate });
    setShowDatePicker(false);
  };

  const renderCalendarDay = (date: Date | null, index: number): React.ReactElement => {
    if (!date) {
      return <View key={index} style={styles.emptyDay} />;
    }

    const isSelected = (startDate && date.getTime() === startDate.getTime()) ||
                     (endDate && date.getTime() === endDate.getTime());
    const isInRange = isDateInRange(date);
    const isToday = date.toDateString() === new Date().toDateString();

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleDateClick(date)}
        style={[
          styles.calendarDay,
          isSelected && styles.selectedDay,
          isInRange && !isSelected && styles.rangeDay,
          isToday && !isSelected && styles.todayDay,
        ]}
      >
        <Text style={[
          styles.calendarDayText,
          isSelected && styles.selectedDayText,
          isInRange && !isSelected && styles.rangeDayText,
        ]}>
          {date.getDate()}
        </Text>
      </TouchableOpacity>
    );
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <View style={styles.container}>
      {/* Header with Icon */}
      <View style={styles.headerWithIcon}>
        <MaterialIcons name="pie-chart" size={24} color="#90CAF9" />
        <Text style={styles.sectionTitle}>Analytics</Text>
      </View>

      {/* Date Range Picker and Add Button Row */}
      <View style={styles.topButtonRow}>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <MaterialIcons name="calendar-today" size={20} color="#90CAF9" />
          <Text style={styles.datePickerLabel}>{getDisplayText()}</Text>
          {(startDate || endDate) && (
            <TouchableOpacity
              onPress={clearDates}
              style={styles.clearButton}
            >
              <MaterialIcons name="close" size={16} color="#90CAF9" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <MaterialIcons name="add" size={18} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Toggle Buttons */}
      <View style={styles.toggleRow}>
        {visibleCharts.map((type: ChartType) => (
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
      <Text style={styles.chartTitle}>{chartTitleMap[selectedChart]}</Text>

      {/* Pie Chart */}
      <View style={styles.chartContainer}>
        <PieChart
          data={chartMap[selectedChart]}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            color: () => '#90CAF9',
            backgroundColor: 'transparent',
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
        />
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                onPress={() => navigateMonth(-1)}
                style={styles.navButton}
              >
                <MaterialIcons name="chevron-left" size={24} color="#90CAF9" />
              </TouchableOpacity>
              <Text style={styles.monthTitle}>{monthYear}</Text>
              <TouchableOpacity
                onPress={() => navigateMonth(1)}
                style={styles.navButton}
              >
                <MaterialIcons name="chevron-right" size={24} color="#90CAF9" />
              </TouchableOpacity>
            </View>

            {/* Days of Week */}
            <View style={styles.weekRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day: string) => (
                <View key={day} style={styles.weekDay}>
                  <Text style={styles.weekDayText}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {Array.from({ length: Math.ceil(days.length / 7) }, (_: unknown, weekIndex: number) => (
                <View key={weekIndex} style={styles.weekRow}>
                  {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((date: Date | null, dayIndex: number) =>
                    renderCalendarDay(date, weekIndex * 7 + dayIndex)
                  )}
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={clearDates}
                style={styles.clearActionButton}
              >
                <Text style={styles.clearActionText}>Clear</Text>
              </TouchableOpacity>
              <View style={styles.actionButtonsRight}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={applyDateRange}
                  disabled={!startDate || !endDate}
                  style={[
                    styles.applyButton,
                    (!startDate || !endDate) && styles.applyButtonDisabled
                  ]}
                >
                  <Text style={[
                    styles.applyButtonText,
                    (!startDate || !endDate) && styles.applyButtonTextDisabled
                  ]}>
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Data Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addModalContent}>
            <View style={styles.modalHeaderWithIcon}>
              <MaterialIcons name="settings" size={24} color="#90CAF9" />
              <Text style={styles.addModalTitle}>Select Data to Display</Text>
            </View>
            <Text style={styles.addModalSubtitle}>Choose which charts you want to show</Text>
            
            <View style={styles.chartOptionsContainer}>
              {(['workforce', 'skills', 'area', 'task'] as const).map((chartType: ChartType) => (
                <TouchableOpacity
                  key={chartType}
                  style={styles.chartOption}
                  onPress={() => toggleChartVisibility(chartType)}
                >
                  <View style={styles.chartOptionLeft}>
                    <View style={[
                      styles.checkbox,
                      visibleCharts.includes(chartType) && styles.checkboxChecked
                    ]}>
                      {visibleCharts.includes(chartType) && (
                        <MaterialIcons name="check" size={12} color="white" />
                      )}
                    </View>
                    <Text style={styles.chartOptionText}>{chartTitleMap[chartType]}</Text>
                  </View>
                  <Text style={styles.chartItemCount}>
                    {chartMap[chartType].length} items
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.addModalActions}>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.addModalCancelButton}
              >
                <Text style={styles.addModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyChartSelection}
                style={styles.addModalApplyButton}
              >
                <Text style={styles.addModalApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#1F3B60',
    borderRadius: 5,
    padding: 0,
    marginBottom: 20,
    // borderWidth: 1,
    borderColor: '#ffffff33',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  headerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#90CAF9',
    fontWeight: '700',
  },
  topButtonRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  datePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#ffffff33',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  addButton: {
    backgroundColor: '#00B0FF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  datePickerLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  clearButton: {
    padding: 4,
  },
  chartTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  chartContainer: {
    // alignItems: 'center',
    backgroundColor: 'rgba(144, 202, 249, 0.05)',
    borderRadius: 12,
    padding: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ffffff33',
    borderRadius: 8,
    backgroundColor: '#1C1C1E',
  },
  activeButton: {
    backgroundColor: '#90CAF9',
    borderColor: '#90CAF9',
  },
  toggleText: {
    color: '#90CAF9',
    fontWeight: '600',
    fontSize: 12,
  },
  activeText: {
    color: '#0B1A2F',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1F3B60',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    borderWidth: 1,
    borderColor: '#ffffff33',
    maxWidth: 350,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#1C1C1E',
  },
  monthTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weekDay: {
    width: 40,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    color: '#90CAF9',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarGrid: {
    marginBottom: 20,
  },
  calendarDay: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  emptyDay: {
    width: 40,
    height: 40,
  },
  selectedDay: {
    backgroundColor: '#00B0FF',
  },
  rangeDay: {
    backgroundColor: 'rgba(0, 176, 255, 0.3)',
  },
  todayDay: {
    borderWidth: 1,
    borderColor: '#00B0FF',
  },
  calendarDayText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedDayText: {
    color: 'white',
  },
  rangeDayText: {
    color: '#00B0FF',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ffffff33',
    paddingTop: 15,
  },
  clearActionButton: {
    padding: 10,
  },
  clearActionText: {
    color: '#90CAF9',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtonsRight: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: '#90CAF9',
    fontSize: 14,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#00B0FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonDisabled: {
    backgroundColor: '#1C1C1E',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  applyButtonTextDisabled: {
    color: '#90CAF9',
  },
  // Add Modal Styles
  addModalContent: {
    backgroundColor: '#1F3B60',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    borderWidth: 1,
    borderColor: '#ffffff33',
    maxWidth: 400,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  modalHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  addModalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  addModalSubtitle: {
    color: '#90CAF9',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  chartOptionsContainer: {
    marginBottom: 20,
  },
  chartOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  chartOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#90CAF9',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00B0FF',
    borderColor: '#00B0FF',
  },
  chartOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  chartItemCount: {
    color: '#90CAF9',
    fontSize: 12,
    fontWeight: '500',
  },
  addModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ffffff33',
    paddingTop: 15,
  },
  addModalCancelButton: {
    padding: 10,
  },
  addModalCancelText: {
    color: '#90CAF9',
    fontSize: 16,
    fontWeight: '500',
  },
  addModalApplyButton: {
    backgroundColor: '#00B0FF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addModalApplyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PieChartComponent;