import React, { useState, useEffect } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import CurrentDocs from '../components/CurrentDocs';
import WhyToConfig from '../components/WhyToConfig';
import EnterDetails from '../components/EnterProjectDetails';
import ProjectDetails from '../components/ProjectDetails';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ConfigurationScreen() {
    const navigation = useNavigation();
    const [detailsExpanded, setDetailsExpanded] = useState(false);
    const [projectDetailsExpanded, setProjectDetailsExpanded] = useState(false);
    const [hasUserDetails, setHasUserDetails] = useState(false);

    useEffect(() => {
        navigation.setOptions({ title: 'Configuration' });

        const checkUserDetails = async () => {
            try {
                const userDetailsJSON = await AsyncStorage.getItem('userDetails');
                if (userDetailsJSON) {
                    setHasUserDetails(true);
                } else {
                    setHasUserDetails(false);
                }
            } catch (error) {
                console.error('Failed to check user details:', error);
                setHasUserDetails(false);
            }
        };

        checkUserDetails();
    }, [navigation]);

    const toggleDetails = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDetailsExpanded(prev => !prev);
    };

    const toggleProjectDetails = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setProjectDetailsExpanded(prev => !prev);
    };

    return (
        <FlatList
            data={[]}
            renderItem={() => null}
            ListHeaderComponent={
                <>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Information</Text>
                        <WhyToConfig />
                    </View>

                    <View style={styles.sectionContainer}>
                        <TouchableOpacity onPress={toggleDetails} style={styles.collapsibleHeader}>
                            <Text style={styles.sectionTitle}>Details Section</Text>
                            <AntDesign
                                name={detailsExpanded ? 'up' : 'down'}
                                size={20}
                                color="#007AFF"
                            />
                        </TouchableOpacity>
                        {detailsExpanded && <EnterDetails />}
                    </View>
                </>
            }
            ListFooterComponent={
                <View style={styles.sectionContainer}>
                    <TouchableOpacity onPress={toggleProjectDetails} style={styles.collapsibleHeader}>
                        <Text style={styles.sectionTitle}>Your Project Details</Text>
                        <AntDesign
                            name={projectDetailsExpanded ? 'up' : 'down'}
                            size={20}
                            color="#007AFF"
                        />
                    </TouchableOpacity>

                    <Text style={hasUserDetails ? styles.savedProjectsSubtitle : styles.noSavedProjects}>
  {hasUserDetails
    ? 'Saved Projects (1)'
    : 'No saved projects yet'}
</Text>

                    {projectDetailsExpanded && <ProjectDetails />}
                </View>
            }
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    sectionContainer: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
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
    collapsibleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    savedProjectsSubtitle: {
        color: '#000',
        fontSize: 14,
        marginTop: 6,
        fontWeight: '700',       // bold
        fontFamily: 'Montserrat_700Bold',  // match your bold font
    },
    noSavedProjects: {
        color: '#000',
        fontSize: 14,
        marginTop: 6,
        fontStyle: 'italic',
    },
});
