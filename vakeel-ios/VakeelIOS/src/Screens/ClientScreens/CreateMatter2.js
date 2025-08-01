import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ImageBackground,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import AppHeader from '../../Components/AppHeader';
import { AppImages } from '../../Utils/ImagesUrl';
import { endpoints, urls } from '../../services/Endpionts';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateMatter2({ navigation, route }) {
    const { subcategories } = route.params || {};
    console.log('subcategories--->', subcategories);

    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    `${urls.LiveBaseUrl}${endpoints.create_matter_type}?parent_id=${subcategories}`
                );
                const json = await response.json();
                if (json.status && json.responseCode === 200) {
                    const categories = json.data.categories.map((item) => ({
                        child_id: item._id,
                        label: item.name,
                        icon: item.icon,
                        parent_id: item.parent,
                    }));
                    setOptions(categories);
                } else {
                    console.error('Error fetching categories:', json.message);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [subcategories]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ImageBackground
                source={AppImages?.Login_Bg}
                style={{ flex: 1, padding: 1 }}
                imageStyle={{ resizeMode: 'cover' }}
            >
                <AppHeader navigation={navigation} title="Create Matter" progress="2/3" />

                <View style={styles.container}>
                    <Text style={styles.title}>Select Services</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.optionsContainer}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#FFA500" />
                            ) : options.length > 0 ? (
                                options.map((option, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.option,
                                            selectedOption === index && styles.selectedOption,
                                        ]}
                                        onPress={() => setSelectedOption(index)}
                                    >
                                        <View
                                            style={[
                                                styles.radioCircle,
                                                selectedOption === index && styles.selectedCircle,
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                styles.optionLabel,
                                                selectedOption === index && styles.selectedLabel,
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={styles.noDataText}>No data found</Text>
                            )}
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (loading || options.length === 0 || selectedOption === null) && { backgroundColor: '#D3D3D3' }, // Gray out when inactive
                        ]}
                        onPress={() => {
                            const selectedChild = options[selectedOption]?.child_id;
                            const selectedParent = options[selectedOption]?.parent_id;

                            if (selectedChild && selectedParent) {
                                navigation.navigate('CreateMatter3', {
                                    child_id: selectedChild,
                                    parent_id: selectedParent,
                                });
                            } else {
                                console.error('No option selected or invalid data');
                            }
                        }}
                        disabled={loading || options.length === 0 || selectedOption === null} // Disable when loading, no options, or nothing selected
                    >
                        <Text style={styles.submitButtonText}>Next</Text>
                    </TouchableOpacity>

                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Marathon-Serial Bold',
        color: '#A4A9AE',
        marginBottom: 20,
        textAlign: 'left',
    },
    optionsContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#D1D3D4',
        borderRadius: 12,
        marginBottom: 15,
        backgroundColor: 'white',
    },
    selectedOption: {
        backgroundColor: '#FFA500',
        borderColor: '#FFA500',
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D3D4',
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedCircle: {
        borderColor: '#FFF',
        backgroundColor: '#FFF',
    },
    optionLabel: {
        fontSize: 16,
        color: '#555',
        textAlign: 'left',
        flex: 1,
    },
    selectedLabel: {
        color: '#FFF',
        fontWeight: '600',
    },
    submitButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFA500',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    noDataText: {
        fontSize: 16,
        color: '#A4A9AE',
        textAlign: 'center',
        marginVertical: 20,
    },
});

