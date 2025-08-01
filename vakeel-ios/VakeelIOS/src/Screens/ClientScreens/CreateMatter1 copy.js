import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    SafeAreaView,
    ImageBackground,
    Dimensions,
    ScrollView,
    BackHandler
} from 'react-native';
import AppHeader from '../../Components/AppHeader';
import { AppImages } from '../../Utils/ImagesUrl';

const { width } = Dimensions.get('window');

export default function CreateMatter1({ navigation }) {
    const [selectedBox, setSelectedBox] = useState(null);

    const boxData = [
        { label: 'Family', icon: AppImages?.Criminal_Icon },
        { label: 'Civil', icon: AppImages?.Criminal_Icon },
        { label: 'Corporate', icon: AppImages?.Criminal_Icon },
        { label: 'Employment', icon: AppImages?.Criminal_Icon },
        { label: 'Criminal', icon: AppImages?.Criminal_Icon },
        { label: 'Banking', icon: AppImages?.Criminal_Icon },
        { label: 'Consumer', icon: AppImages?.Criminal_Icon },
        { label: 'Taxation', icon: AppImages?.Criminal_Icon },
        { label: 'Intellectual Property', icon: AppImages?.Criminal_Icon },
        { label: 'Others', icon: AppImages?.Criminal_Icon },
    ];
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
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ImageBackground
                source={AppImages?.Login_Bg}
                style={{ flex: 1, padding: 1 }}
                imageStyle={{ resizeMode: 'cover' }}
            >
                <AppHeader navigation={navigation} title="Create Matter" progress="1/3" />

                <View style={styles.container}>
                    <View style={{ alignItems: 'flex-start' }}>
                        <Text style={styles.title}>Select Type</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.grid}>
                            {boxData.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.box,
                                        selectedBox === index && styles.selectedBox,
                                    ]}
                                    onPress={() => setSelectedBox(index)}
                                >
                                    <Image source={item.icon} style={styles.icon} />
                                    <Text
                                        style={[
                                            styles.boxText,
                                            selectedBox === index && styles.selectedBoxText,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => navigation.navigate('CreateMatter2')}
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    box: {
        width: width * 0.27,
        height: width * 0.30,
        borderWidth: 1,
        borderColor: '#D1D3D4',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    selectedBox: {
        backgroundColor: '#FFA500',
        borderColor: '#FFA500',
    },
    icon: {
        width: 40,
        height: 40,
        marginBottom: 8,
        resizeMode: 'contain',
    },
    boxText: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
    },
    selectedBoxText: {
        color: '#FFF',
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
});