import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ImageBackground,
    ScrollView,
    Dimensions,
    Alert
} from 'react-native';
import AppHeader from '../../Components/AppHeader';
import { AppImages } from '../../Utils/ImagesUrl';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function CreateMatter3({ navigation, route }) {
    const { MatterDetails } = route.params || {};
    const { child_id } = route.params || {};
    const { parent_id } = route.params || {};

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitActive, setIsSubmitActive] = useState(false);

    useEffect(() => {
        if (MatterDetails) {
            setTitle(MatterDetails?.title);
            setDescription(MatterDetails?.description);
        }
    }, [MatterDetails]);

    useEffect(() => {
        setIsSubmitActive(title.trim() !== '' && description.trim() !== '');
    }, [title, description]);

    const handleSubmit = async () => {
        const token = await AsyncStorage.getItem('token');
        const { _j } = DeviceInfo.getUniqueId();  // Get the device unique ID
        const headers = {
            'Content-Type': 'application/json',
            'deviceuid': _j,  // Add deviceuid to headers
            'Authorization': `Bearer ${token}`,
        };
        const payload = {
            category_id: parent_id,
            subcategory_id: child_id,
            title: title,
            description: description,
        };

        try {
            const response = await fetch('https://vakeelserver.barrana.io/api/client/matters/add', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });


            const data = await response.json();
            console.log('data--->', data)
            if (response.ok) {
                navigation.navigate('SuccessScreen', {
                    SuccessMessage: {
                        successTitle: 'Your matter has been posted successfully',
                        successMsg: null,
                        scrrenName: 'ClientHome',
                    },
                });
            } else {
                console.error('Failed to create matter:', data);
                Alert.alert('Failed to create matter. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('An error occurred. Please try again.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ImageBackground
                source={AppImages?.Login_Bg}
                style={{ flex: 1, padding: 1 }}
                imageStyle={{ resizeMode: 'cover' }}
            >
                <AppHeader navigation={navigation} title="Create Matter" progress="3/3" />

                <View style={styles.container}>
                    <Text style={styles.title}>Describe Your Matter</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            placeholderTextColor="#A4A9AE"
                            value={title}
                            onChangeText={(text) => setTitle(text)}
                        />
                        <TextInput
                            style={styles.textArea}
                            placeholder="Describe your matter (Follow sample case description below)"
                            placeholderTextColor="#A4A9AE"
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                            multiline
                            numberOfLines={50}
                        />
                        <View style={styles.sampleCaseContainer}>
                            <Text style={styles.sampleCaseTitle}>Sample Case Description</Text>
                            <Text style={styles.sampleCaseText}>- Case Type</Text>
                            <Text style={styles.sampleCaseText}>- Who are you?</Text>
                            <Text style={styles.sampleCaseText}>  Petitioner/Applicant/Respondent</Text>
                            <Text style={styles.sampleCaseText}>- Court/Judge Name (In progress case)</Text>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            { backgroundColor: isSubmitActive ? '#FFA500' : '#D3D3D3' },
                        ]}
                        disabled={!isSubmitActive}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>Submit</Text>
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
        fontSize: 22,
        fontFamily: 'Marathon-Serial Regular',
        color: '#A4A9AE',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#D1D3D4',
        borderRadius: 15,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    textArea: {
        height: height / 2, // Adjust based on screen size
        borderWidth: 1,
        borderColor: '#D1D3D4',
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        backgroundColor: 'white',
        textAlignVertical: 'top',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sampleCaseContainer: {
        // borderWidth: 1,
        // borderColor: '#D1D3D4',
        borderRadius: 20,
        padding: 15,
        backgroundColor: '#F4F6F8',
        marginBottom: 20,

    },
    sampleCaseTitle: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#A4A9AE',
        marginBottom: 5,
    },
    sampleCaseText: {
        fontSize: 10,
        fontFamily: 'Poppins-Regular',
        color: '#A4A9AE',
        marginBottom: 5,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
