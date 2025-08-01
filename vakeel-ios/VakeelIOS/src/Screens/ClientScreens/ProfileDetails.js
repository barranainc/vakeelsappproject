import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    ImageBackground,
    Dimensions,
    ScrollView,
    Image
} from 'react-native';
import AppHeader from '../../Components/AppHeader';
import { AppImages } from '../../Utils/ImagesUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDataLocally, getFirebaseToken } from '../../helpers';
import { apiCall } from '../../services/apiCall';

const { width } = Dimensions.get('window');

export default function ProfileDetails({ navigation, route }) {
    const { MatterDetails } = route.params || {};
    console.log("MatterDetails--->", MatterDetails)
    const [data, setData] = useState(null);
    const [loader, setLoader] = useState(false);

    const cardData = [
        {
            title: 'Elder Son Support ',
            category: 'Child Maintenance/Support djhfjkdfh hghjgjhjghjgj hg',
            description: 'Child maintenance/support is a legal obligation for parents to financially support Child maintenance/support is a legal obligation for parents to financially support...',
            date: '15-01-2024',
            responses: '40 Lawyers Responded',
        }
    ];
const getDataLocal=async()=>{
const getLocalData = await getDataLocally()
setData(getLocalData)
}
useEffect(()=>{
    getDataLocal()
},[])
const logout = async () =>{
    const firebaseToken = await getFirebaseToken()
    let obj = {
      fcm_token: firebaseToken,
    }; console.log("obj",obj)
    try { 
        setLoader(true)
      let result = await apiCall?.logout(obj);
      console.log("logout",result)
    } catch (error) {
      console.log( "error",error);
    } finally {
        setLoader(false)
        navigation.replace('Login', { userType: 'client' })
    }
}
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', }}>
            <ImageBackground
                source={AppImages?.Login_Bg}
                style={{ flex: 1, padding: 1, }}
                imageStyle={{ resizeMode: 'cover', }}
            >
                <AppHeader navigation={navigation} title="Profile" />

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 20,
                        padding: 16,
                        marginBottom: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 5,
                        borderWidth: 1,
                        borderColor: '#E5E5E5',

                        width: '80%', alignItems: 'center', paddingVertical: 30
                    }}>

                        <View style={{marginBottom:20, width: 100, height: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 50, backgroundColor: '#1C5A9A', padding: 10 }}>

                            <Ionicons name="person" size={60} color="white" />
                        </View>

                        <View style={{ paddingVertical: 20 }}>
                            <View style={styles.textStyle}>
                                <Text style={styles.textStyle1}>Full Name: </Text>
                                <Text style={styles.textStyle2}>{data?.first_name +' '+ data?.last_name}</Text>
                            </View>
                            <View style={styles.textStyle}>
                                <Text style={styles.textStyle1}>Email: </Text>
                                <Text style={styles.textStyle2}>{data?.email}</Text>
                            </View>
                            <View style={styles.textStyle}>
                                <Text style={styles.textStyle1}>Phone: </Text>
                                <Text style={styles.textStyle2}>{data?.phone}</Text>
                            </View>

                        </View>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={() => navigation.navigate('ChangePassword')
                            }
                        >
                            <Text style={styles.submitButtonText}>Change Password</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                         disabled={loader?true:false}
                            style={[styles.submitButton, { backgroundColor: '#1C5A9A' }]}
                            onPress={() => {logout()}
                            }
                        >
                            <Text style={styles.submitButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
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
    textStyle: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    textStyle1: {
        fontFamily: 'Poppins-SemiBold',
        color: '#1C5A9A'
    },
    textStyle2: {
        fontFamily: 'Poppins-Regular'
    },
    submitButton: {
        width: '80%',
        height: 50,
        backgroundColor: '#FFA500',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 15,
        // marginBottom: 20,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins-Regular'
    },


});
