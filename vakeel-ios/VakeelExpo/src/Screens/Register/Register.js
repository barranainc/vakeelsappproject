import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    Platform,
    ImageBackground,
    SafeAreaView,
    KeyboardAvoidingView,
    Keyboard,
    ScrollView,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import { AppImages } from '../../Utils/ImagesUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function Register({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [cnic, setCnic] = useState('');
    const [barCouncilId, setBarCouncilId] = useState('');
    const [cnicFront, setCnicFront] = useState(null);
    const [cnicBack, setCnicBack] = useState(null);
    const [barDocs, setBarDocs] = useState([null, null, null]); // Placeholder for multiple documents

    const handleUpload = (type, index = null) => {
        console.log(`Upload button clicked for ${type}${index !== null ? ` - ${index}` : ''}`);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                >
                    <ImageBackground
                        source={AppImages?.Login_Bg}
                        style={{ flex: 1 }}
                        imageStyle={{ resizeMode: 'cover' }}
                    >
                        <ScrollView
                            contentContainerStyle={[styles.container, { paddingBottom: 20 }]}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                                <Image
                                    resizeMode="contain"
                                    source={AppImages?.VakeelLogoWithoutName}
                                    style={{ height: 80, width: 80 }}
                                />
                                <Text style={{color:'#0F5189', fontSize:22,fontFamily:'Marathon-Serial Bold',marginTop:3}}>VAKEEL'S</Text>
                                <Text style={{color:'#0F5189', fontSize:6,fontFamily:'Marathon-Serial Bold'}}>A LEGAL CONSULTANCY</Text>

                            </View>

                            <View style={{ marginTop: 40 }}>
                                <Text style={styles.title}>Register</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="First Name"
                                    placeholderTextColor="#888"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Last Name"
                                    placeholderTextColor="#888"
                                    value={lastName}
                                    onChangeText={setLastName}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#888"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone"
                                    placeholderTextColor="#888"
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="CNIC"
                                    placeholderTextColor="#888"
                                    value={cnic}
                                    onChangeText={setCnic}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Bar Council ID"
                                    placeholderTextColor="#888"
                                    value={barCouncilId}
                                    onChangeText={setBarCouncilId}
                                />

                                <Text style={styles.sectionTitle}>Upload CNIC</Text>
                                <View style={styles.uploadContainer}>
                                    <TouchableOpacity
                                        style={styles.uploadBox}
                                        onPress={() => handleUpload('CNIC Front')}
                                    >
                                        <Ionicons
                                            name="add"
                                            size={40}
                                            color={'#EAA141'}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.uploadBox}
                                        onPress={() => handleUpload('CNIC Back')}
                                    >
                                        <Ionicons
                                            name="add"
                                            size={40}
                                            color={'#EAA141'}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.sectionTitle}>Upload Bar Council Documents</Text>
                                <View style={styles.uploadContainer1}>
                                    {barDocs.map((_, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.uploadBox1}
                                            onPress={() => handleUpload('Bar Doc', index)}
                                        >
                                            <Ionicons
                                                name="add"
                                                size={40}
                                                color={'#D1D3D4'}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TouchableOpacity style={styles.submitButton}>
                                    <Text style={styles.submitButtonText}>Submit</Text>
                                </TouchableOpacity>

                                <View style={{ alignItems: 'center' }}>
                                    <Text style={styles.orText}>OR</Text>

                                    <Text style={styles.footer}>
                                    Already have an account?{' '}
                                        <Text
                                            style={styles.loginText}
                                            onPress={() => navigation.goBack('Login')}
                                        >
                                            Login
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                    </ImageBackground>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
    },
    container: {
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 36,
        fontFamily: 'Marathon-Serial Bold',
        color: 'black',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 55,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 18,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 14,
        backgroundColor: '#FFF',
        fontFamily: 'Poppins-Regular',
    },
    sectionTitle: {
        fontSize: 28,
        fontFamily: 'Marathon-Serial Regular',
        marginBottom: 20,
        color: '#A4A9AE',
    },
    uploadContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    uploadBox: {
        width: '48%',
        height: 80,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadContainer1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        flexWrap:"wrap",
        gap:4
    },
    uploadBox1: {
        width: '30%',
        height: 100,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFA500',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    orText: {
        fontSize: 16,
        color: '#888',
        marginVertical: 20,
    },
    footer: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    loginText: {
        color: '#003366',
        fontWeight: 'bold',
    },
});
