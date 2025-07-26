import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, PanResponder } from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Fixed heights - increased expanded height to fit all three rows
const ORIGINAL_HEIGHT = 80;
const EXPANDED_HEIGHT = ORIGINAL_HEIGHT + 230; // Increased to fit all content

export default function Footer() {
    const router = useRouter();
    const animatedHeight = useRef(new Animated.Value(ORIGINAL_HEIGHT)).current;
    const dragY = useRef(new Animated.Value(0)).current;
    const [activeIcon, setActiveIcon] = useState<string | null>('home');
    
    // Simulate counts
    const unsyncedCount = 20;
    const tasksCount = 15;
    const leaderboardPosition = 3;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,
            onPanResponderMove: (_, gesture) => {
                if (gesture.dy < 0) {
                    dragY.setValue(Math.max(gesture.dy, -180)); // Updated to match new expansion
                }
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dy < -30) {
                    Animated.spring(animatedHeight, {
                        toValue: EXPANDED_HEIGHT,
                        useNativeDriver: false,
                        tension: 80,
                        friction: 6,
                    }).start();
                } else {
                    Animated.spring(animatedHeight, {
                        toValue: ORIGINAL_HEIGHT,
                        useNativeDriver: false,
                        tension: 80,
                        friction: 6,
                    }).start();
                }
                dragY.setValue(0);
            },
        })
    ).current;

    const showSecondRow = animatedHeight.interpolate({
        inputRange: [ORIGINAL_HEIGHT, EXPANDED_HEIGHT],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const handleIconPress = (iconName: string, onPress?: () => void) => {
        setActiveIcon(iconName);
        if (onPress) onPress();
    };

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[styles.footer, { height: animatedHeight }]}
        >
            {/* Subtle drag indicator */}
            <View style={styles.dragIndicator} />
            
            <View style={styles.content}>
                {/* Row 1: Always visible */}
                <View style={styles.iconRow}>
                    <TouchableOpacity 
                        style={[
                            styles.iconButton,
                        ]} 
                        onPress={() => handleIconPress('home', () => router.push('/'))}
                        activeOpacity={0.8}
                    >
                        <View style={[
                            styles.iconContainer,
                            activeIcon === 'home' && styles.activeIconContainer
                        ]}>
                            <MaterialIcons 
                                name="home" 
                                size={24} 
                                color={activeIcon === 'home' ? "#000000" : "#ffffff"} 
                            />
                        </View>
                        <Text style={[
                            styles.iconLabel,
                            activeIcon === 'home' && styles.activeIconLabel
                        ]}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.iconButton,
                        ]} 
                        onPress={() => handleIconPress('directory', () => router.push('/components/DirectorySection'))}
                        activeOpacity={0.8}
                    >
                        <View style={[
                            styles.iconContainer,
                            activeIcon === 'directory' && styles.activeIconContainer
                        ]}>
                            <Feather 
                                name="users" 
                                size={24} 
                                color={activeIcon === 'directory' ? "#000000" : "#ffffff"} 
                            />
                        </View>
                        <Text style={[
                            styles.iconLabel,
                            activeIcon === 'directory' && styles.activeIconLabel
                        ]}>Directory</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.iconButton,
                        ]} 
                        onPress={() => handleIconPress('induct', () => router.push('/onboardingScreen'))}
                        activeOpacity={0.8}
                    >
                        <View style={[
                            styles.iconContainer,
                            activeIcon === 'induct' && styles.activeIconContainer
                        ]}>
                            <MaterialIcons 
                                name="how-to-reg" 
                                size={24} 
                                color={activeIcon === 'induct' ? "#000000" : "#ffffff"} 
                            />
                        </View>
                        <Text style={[
                            styles.iconLabel,
                            activeIcon === 'induct' && styles.activeIconLabel
                        ]}>Induct</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.iconButton,
                        ]} 
                        onPress={() => handleIconPress('reports', () => router.push('/components/SiteReport'))}
                        activeOpacity={0.8}
                    >
                        <View style={[
                            styles.iconContainer,
                            activeIcon === 'reports' && styles.activeIconContainer
                        ]}>
                            <Ionicons 
                                name="document-text-outline" 
                                size={24} 
                                color={activeIcon === 'reports' ? "#000000" : "#ffffff"} 
                            />
                        </View>
                        <Text style={[
                            styles.iconLabel,
                            activeIcon === 'reports' && styles.activeIconLabel
                        ]}>Reports</Text>
                    </TouchableOpacity>
                </View>

                {/* Row 2: Hidden until expanded */}
                <Animated.View style={[styles.iconRow, { opacity: showSecondRow }]}>
                    <TouchableOpacity 
                        style={[
                            styles.iconButton,
                        ]} 
                        onPress={() => handleIconPress('settings', () => router.push('/settingsScreen'))}
                        activeOpacity={0.8}
                    >
                        <View style={[
                            styles.iconContainer,
                            activeIcon === 'settings' && styles.activeIconContainer
                        ]}>
                            <Feather 
                                name="settings" 
                                size={24} 
                                color={activeIcon === 'settings' ? "#000000" : "#ffffff"} 
                            />
                        </View>
                        <Text style={[
                            styles.iconLabel,
                            activeIcon === 'settings' && styles.activeIconLabel
                        ]}>Settings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.iconButton,
                        ]} 
                        onPress={() => handleIconPress('leaderboard')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.badgeContainer}>
                            <View style={[
                                styles.iconContainer,
                                activeIcon === 'leaderboard' && styles.activeIconContainer
                            ]}>
                                <Ionicons 
                                    name="podium-outline" 
                                    size={24} 
                                    color={activeIcon === 'leaderboard' ? "#000000" : "#ffffff"} 
                                />
                            </View>
                            {leaderboardPosition && (
                                <View style={styles.positionBadge}>
                                    <Text style={styles.badgeText}>{leaderboardPosition}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[
                            styles.iconLabel,
                            activeIcon === 'leaderboard' && styles.activeIconLabel
                        ]}>Leaderboard</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.iconButton,
                        ]} 
                        onPress={() => handleIconPress('unsynced')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.badgeContainer}>
                            <View style={[
                                styles.iconContainer,
                                activeIcon === 'unsynced' && styles.activeIconContainer
                            ]}>
                                <MaterialIcons 
                                    name="sync-problem" 
                                    size={24} 
                                    color={activeIcon === 'unsynced' ? "#000000" : "#ffffff"} 
                                />
                            </View>
                            {unsyncedCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{unsyncedCount}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[
                            styles.iconLabel,
                            activeIcon === 'unsynced' && styles.activeIconLabel
                        ]}>Unsynced</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.iconButton,
                        ]} 
                        onPress={() => handleIconPress('help')}
                        activeOpacity={0.8}
                    >
                        <View style={[
                            styles.iconContainer,
                            activeIcon === 'help' && styles.activeIconContainer
                        ]}>
                            <Ionicons 
                                name="help-circle-outline" 
                                size={24} 
                                color={activeIcon === 'help' ? "#000000" : "#ffffff"} 
                            />
                        </View>
                        <Text style={[
                            styles.iconLabel,
                            activeIcon === 'help' && styles.activeIconLabel
                        ]}>Help</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Row 3: Third row with additional icons */}
                <Animated.View style={[styles.iconRow, { opacity: showSecondRow }]}>
                    <TouchableOpacity 
                        style={[
                            styles.iconButton,
                        ]} 
                        onPress={() => handleIconPress('tasks')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.badgeContainer}>
                            <View style={[
                                styles.iconContainer,
                                activeIcon === 'tasks' && styles.activeIconContainer
                            ]}>
                                <MaterialIcons 
                                    name="assignment" 
                                    size={25} 
                                    color={activeIcon === 'tasks' ? "#000000" : "#ffffff"} 
                                />
                            </View>
                            {tasksCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{tasksCount}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[
                            styles.iconLabel,
                            activeIcon === 'tasks' && styles.activeIconLabel
                        ]}>Tasks</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.iconButton,
                        ]} 
                        onPress={() => handleIconPress('notifications')}
                        activeOpacity={0.8}
                    >
                        <View style={[
                            styles.iconContainer,
                            activeIcon === 'notifications' && styles.activeIconContainer
                        ]}>
                            <MaterialIcons 
                                name="notifications-none" 
                                size={24} 
                                color={activeIcon === 'notifications' ? "#000000" : "#ffffff"} 
                            />
                        </View>
                        <Text style={[
                            styles.iconLabel,
                            activeIcon === 'notifications' && styles.activeIconLabel
                        ]}>Notifications</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.iconButton,
                        ]} 
                        onPress={() => handleIconPress('analytics')}
                        activeOpacity={0.8}
                    >
                        <View style={[
                            styles.iconContainer,
                            activeIcon === 'analytics' && styles.activeIconContainer
                        ]}>
                            <Ionicons 
                                name="analytics-outline" 
                                size={24} 
                                color={activeIcon === 'analytics' ? "#000000" : "#ffffff"} 
                            />
                        </View>
                        <Text style={[
                            styles.iconLabel,
                            activeIcon === 'analytics' && styles.activeIconLabel
                        ]}>Analytics</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.iconButton,
                        ]} 
                        onPress={() => handleIconPress('sync')}
                        activeOpacity={0.8}
                    >
                        <View style={[
                            styles.iconContainer,
                            activeIcon === 'sync' && styles.activeIconContainer
                        ]}>
                            <MaterialIcons 
                                name="cloud-sync" 
                                size={24} 
                                color={activeIcon === 'sync' ? "#000000" : "#ffffff"} 
                            />
                        </View>
                        <Text style={[
                            styles.iconLabel,
                            activeIcon === 'sync' && styles.activeIconLabel
                        ]}>Sync</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Last Synced Text - now visible when expanded */}
                <Animated.View style={{ opacity: showSecondRow }}>
                    <Text style={styles.syncText}>Last synced: 2 minutes ago</Text>
                </Animated.View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#1C1C1E',
        borderTopColor: '#ffffff33',
        borderTopWidth: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
        paddingTop:0
    },
    dragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 0,
    },
    content: {
        paddingVertical: 0,
        paddingHorizontal: 16,
        flex: 1,
        justifyContent: 'space-between',
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 0,
    },
    iconButton: {
        alignItems: 'center',
        flex: 1,
        paddingVertical: 0,
        borderRadius: 12,
        marginHorizontal: 2,
        marginBottom:1
    },
    // activeIconButton: {
    //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // },
    iconContainer: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    activeIconContainer: {
        backgroundColor: '#ffffff',
        shadowColor: '#ffffff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    badgeContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: -8,
        right: -12,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 4,
    },
    positionBadge: {
        position: 'absolute',
        top: -8,
        right: -12,
        backgroundColor: '#34C759',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        shadowColor: '#34C759',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 4,
    },
    badgeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    iconLabel: {
        fontSize: 12,
        color: '#ffffff',
        marginTop: 4,
        textAlign: 'center',
    },
    activeIconLabel: {
        color: '#ffffff',
        fontWeight: '600',
    },
    syncText: {
        fontSize: 20,
        color: 'lightblue',
        textAlign: 'center',
        paddingBottom: 20,
        marginTop: -20,
    },
});