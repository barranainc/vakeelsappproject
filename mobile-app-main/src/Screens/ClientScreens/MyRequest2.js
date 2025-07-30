import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ImageBackground,
    Dimensions,
    ScrollView,
    Image
} from 'react-native';
import AppHeader from '../../Components/AppHeader';
import { AppImages } from '../../Utils/ImagesUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enviroment } from '../../environment';
import { Apis } from '../../services/Endpoints';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function MyRequest2({ navigation, route }) {
    const { MatterDetails } = route.params || {};
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
console.log("MatterDetails",apiData)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await fetch(
                    `${enviroment?.API_URL}${Apis ?.getRequestDetails}?id=${MatterDetails?._id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                const result = await response.json();
                if (result?.responseCode == 200) {
                    setApiData(result?.data?.request); 
                } else {
                    console.error('Failed to fetch data:', result.message);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching API:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ImageBackground
                source={AppImages?.Login_Bg}
                style={{ flex: 1, padding: 1 }}
                imageStyle={{ resizeMode: 'cover' }}
            >
                <AppHeader navigation={navigation} title="Request Details" />

                <View style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false}
                        style={{ paddingVertical: 10 }}
                    >
                        <View

                            style={styles.card}>
                            <View style={[styles.cardHeader, { flexDirection: 'row', }]}>
                                <View style={{ width: '20%', alignItems: 'flex-start', justifyContent: 'center' }}>

                                    <View style={{ backgroundColor: '#2669A9', borderRadius: 50, alignItems: 'center', padding: 10, }}>
                                        <Image
                                            resizeMode="contain"
                                            // source={{uri: enviroment?.API_URL + apiData?.service?.icon,}}
                                              source={AppImages?.Post_Matter}
                                            style={{ height: 30, width: 30 }}
                                        />
                                    </View>
                                </View>

                                <View style={{ width: '80%', marginLeft: 5 }}>
                                    <Text style={styles.cardTitle}>{apiData?.title}</Text>
                                    <Text style={styles.cardCategory}>{apiData?.service?.name}{apiData?.sub_service&& ` - ${apiData?.sub_service?.name}`}</Text>

                                </View>
                            </View>
                            <Text style={styles.cardDescription}

                            >{apiData?.description}</Text>
                            <View style={styles.cardFooter}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Ionicons name="calendar-outline" size={16} color="#A9A9A9" />
                                    <Text style={styles.cardDate}> {moment(apiData?.created_at).format('DD-MM-YYYY')}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="ellipse" size={8} color="#2ECD53" />
                                    <Text style={styles.cardResponses}>{'In Progress'}</Text>
                                </View>
                            </View>
                        </View>

                    </ScrollView>

                    {/* <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => navigation.navigate('AddRequest3', { MatterDetails: MatterDetails })
}
                    >
                        <Text style={styles.submitButtonText}>Edit</Text>
                    </TouchableOpacity> */}
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingVertical: 10,
    },
    chip: {
        borderWidth: 1,
        borderColor: '#1C5A9A',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 10,
        // backgroundColor: '#FFF',
    },
    chipSelected: {
        backgroundColor: '#1C5A9A',
    },
    chipText: {
        fontSize: 14,
        color: '#337DBD',
    },
    chipTextSelected: {
        color: '#FFF',
    },
    card: {
        // backgroundColor: '#FFFFFF',
        // borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 5,
        // borderWidth: 1,
        // borderColor: '#E5E5E5',
    },
    cardHeader: {
        marginBottom: 5,
        // backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
        color: '#1C5A9A',
        // marginBottom: 4,
    },
    cardCategory: {
        fontSize: 11,
        color: '#EAA141',
        fontFamily: 'Poppins-Regular'
    },
    cardDescription: {
        fontSize: 12,
        color: '#777',
        fontFamily: 'Poppins-Regular',
        marginVertical: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopColor: '#1C5A9A',
        borderTopWidth: 0.3,
        paddingTop: 5

    },
    cardDate: {
        fontSize: 12,
        color: '#999',
        marginLeft: 3
    },
    cardResponses: {
        fontSize: 12,
        color: '#5491C9',
        marginLeft: 3
    },
    submitButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFA500',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins-Regular'
    },
});
