import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    ImageBackground,
    BackHandler,
} from 'react-native';
import AppHeader from '../../Components/AppHeader';
import { AppImages } from '../../Utils/ImagesUrl';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AddRequest1({ navigation }) {
    const [selectedOption, setSelectedOption] = useState(null);
    useEffect(() => {
        const backAction = () => {
         navigation?.goBack()
          return true;
        };
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
        return () => backHandler.remove();
      }, []);
    const options = [
        {
            id: 'judicial',
            label: 'Judicial',
            description: 'e.g. Certified Copies, Court Case Follow-ups, Surety/Bail Bonds etc.',
            icon: AppImages?.Judicial_Icon, // Add the appropriate icon here
        },
        {
            id: 'non_judicial',
            label: 'Non-Judicial',
            description: 'e.g. Birth Certificate, Death Certificate, Power of Attorney etc.',
            icon: AppImages?.NonJudicial_Icone, // Add the appropriate icon here
        },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ImageBackground
                source={AppImages?.Login_Bg}
                style={{ flex: 1, padding: 1 }}
                imageStyle={{ resizeMode: 'cover' }}
            >
                <AppHeader navigation={navigation} title="Add Request" progress="1/3" />

                <View style={styles.container}>
                    <Text style={styles.title}>Select Type</Text>

                    <View style={styles.optionsContainer}>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.optionBox,
                                    selectedOption === option.id && styles.selectedOptionBox,
                                ]}
                                onPress={() => setSelectedOption(option.id)}
                            >
                                <View style={styles.iconWrapper}>
                                    <Image source={option.icon} style={styles.icon} />
                                </View>
                                <View style={styles.textWrapper}>
                                    <Text
                                        style={[
                                            styles.optionLabel,
                                            selectedOption === option.id && styles.selectedOptionLabel,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.optionDescription,
                                            selectedOption === option.id && styles.selectedOptionDescription,
                                        ]}
                                    >
                                        {option.description}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            !selectedOption && styles.disabledButton,
                        ]}
                        onPress={() => navigation.navigate('AddRequest2',{type:selectedOption})}
                        disabled={!selectedOption} // Disable button until an option is selected
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
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Marathon-Serial Bold',
        color: '#A4A9AE',
        marginBottom: 20,
        textAlign: 'left',
    },
    optionsContainer: {
        flex: 1,
       gap:width*0.02
    },
    optionBox: {
        height: width/2,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 25,
        borderWidth: 1,
        borderColor: '#D1D3D4',
        borderRadius: 20,
        // backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 15,
    },
    selectedOptionBox: {
        borderColor: '#FFA500',
        backgroundColor: '#FFA500',
    },
    iconWrapper: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    icon: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    textWrapper: {
        flex: 1,
        marginLeft:10
    },
    optionLabel: {
        fontSize: 18,
        fontFamily:'Poppins-SemiBold',
        // fontWeight: '600',
        color: '#404B53',
    },
    selectedOptionLabel: {
        color: 'white',
    },
    optionDescription: {
        fontSize: 14,
        fontFamily:'Poppins-Regular',
        color: '#7A7A7A',
        marginTop: 5,
    },
    selectedOptionDescription: {
        color: 'white',
    },
    submitButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFA500',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 20
    },
    disabledButton: {
        backgroundColor: '#D1D3D4',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
