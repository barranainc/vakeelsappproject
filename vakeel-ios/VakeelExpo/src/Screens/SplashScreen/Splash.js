import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { AppImages } from '../../Utils/ImagesUrl';
import { getDataLocally } from '../../helpers';

export default function Splash({ navigation }) {


    const routeToScreen = async () => {
        const getLocalData = await getDataLocally()  
        setTimeout(() => {
            if (getLocalData?.user_type == 'client') {
                navigation.navigate('ClientHome');
              } else if (getLocalData?.user_type == 'lawyer') {
                navigation.navigate('Home');
              } else if (getLocalData?.user_type == 'paralegal') {
                navigation.navigate('Home');
              } else {
                navigation.navigate('Onboarding');
              }
        }, 3000);
    };

    useEffect(() => {
        const fetchData = async () => {
            await routeToScreen();
        };


        fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SafeAreaView style={styles.container} >
            <StatusBar
                backgroundColor="transparent"
                translucent={true}
            />
            <View >
                <Image
                    resizeMode="contain"
                    source={AppImages?.logo}
                    style={{
                        height: 300,
                        width: 300
                    }}
                />
                {/* <Text style={styles.text}>Welcome to the Splash screen!</Text> */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4081bb',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});
