import React, { useState, useRef } from 'react';
import { SafeAreaView, StatusBar, ScrollView, TouchableOpacity, StyleSheet, Text, View, Dimensions, Image, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppImages } from '../../Utils/ImagesUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const { width, height } = Dimensions.get('window');
// console.log("width--->", width)

export default function Onboarding() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef(null);  // Create a ref for the ScrollView
    const navigation = useNavigation(); // Initialize navigation
    const images = [
        AppImages?.onBoarding1,
        AppImages?.onBoarding2,
        AppImages?.onBoarding3
    ];

    const handleScroll = event => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(scrollPosition / width);
        setCurrentIndex(currentIndex);
    };

    // Function to move to the next image when "Go" is pressed
    const handleGoPress = () => {
        let newIndex = currentIndex + 1;

        // If we've reached the last image, navigate to the login page
        if (newIndex >= images.length) {
            navigation.navigate('ContinueAs');  // Assuming 'Login' is the route to the login screen
            return;
        }

        // Loop back to the first image if we reach the last one
        setCurrentIndex(newIndex);
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: width * newIndex, animated: true });
        }
    };

    // Function to move to the previous image when "Back" is pressed
    const handleBackPress = () => {
        let newIndex = currentIndex - 1;

        // Ensure index doesn't go below 0
        if (newIndex < 0) {
            return;
        }

        setCurrentIndex(newIndex);
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: width * newIndex, animated: true });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor="transparent" />

            <ScrollView
                ref={scrollViewRef}  // Attach the ref to the ScrollView
                horizontal
                pagingEnabled
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}>
                {images.map((image, index) => (
                    <ImageBackground
                        key={index}
                        style={[{ flex: 1, width: width, height: '100%' }]}
                        source={image}
                        resizeMode={'cover'}>
                        <LinearGradient
                            colors={['rgba(0, 0, 0, 0)', '#0F4F88']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 0.8 }}
                            style={{
                                opacity: 0.7,
                                width: '100%',
                                height: '100%'
                            }}></LinearGradient>

                        <View style={{
                            width: '100%', flexDirection: 'row', justifyContent: currentIndex !== 0 ? 'space-between' : 'flex-end', paddingHorizontal: width * 0.083, position: 'absolute', top: width * 0.138
                        }}>

                            {currentIndex !== 0 ? (
                                <View>
                                    <TouchableOpacity onPress={handleBackPress}>
                                        <Ionicons
                                            name="chevron-back-outline"
                                            size={20}
                                            color={'white'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                            <TouchableOpacity onPress={() => { navigation.navigate('ContinueAs'); }}>
                                <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>Skip</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            opacity: 1,
                            width: '100%',
                            position: 'absolute',
                            bottom: 0,
                        }}>

                            <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
                                <View style={{ paddingVertical: 10, paddingHorizontal: 20 }}>

                                    {currentIndex === 0 && (
                                        <>
                                            <View>
                                                <Text style={{ fontFamily: 'Marathon-Serial Bold', color: 'rgba(234, 161, 65, 1)', fontSize: width * 0.072, }}>Legal Matters</Text>
                                            </View>
                                            <View style={{ marginTop: width * 0.027 }}>
                                                <Text style={{ fontSize: width * 0.033, color: 'white', fontFamily: 'Poppins-Regular' }}>
                                                    Access a wide range of legal services, from contract review and document drafting to business formation and intellectual property protection, all through our user-friendly platform
                                                </Text>
                                            </View>
                                        </>
                                    )}

                                    {currentIndex === 1 && (
                                        <>
                                            <View>
                                                <Text style={{ fontFamily: 'Marathon-Serial Bold', color: 'rgba(234, 161, 65, 1)', fontSize: width * 0.072, }}>Case Management</Text>
                                            </View>
                                            <View style={{ marginTop: width * 0.027 }}>
                                                <Text style={{ fontSize: width * 0.033, color: 'white', fontFamily: 'Poppins-Regular' }}>
                                                    One platform to house all your cases, tasks, documents, and communications. Get a clear picture of every step, deadline, and milestone with an intuitive timeline feature. No more missed details.
                                                </Text>
                                            </View>
                                        </>
                                    )}

                                    {currentIndex === 2 && (
                                        <>
                                            <View>
                                                <Text style={{ fontFamily: 'Marathon-Serial Bold', color: 'rgba(234, 161, 65, 1)', fontSize: width * 0.072, }}>Paralegal Assistance</Text>
                                            </View>
                                            <View style={{ marginTop: width * 0.027 }}>
                                                <Text style={{ fontSize: width * 0.033, color: 'white', fontFamily: 'Poppins-Regular' }}>
                                                    Our platform seamlessly integrates with your existing legal software, making collaboration effortless. Stay connected with your paralegal partner through instant messaging, video conferencing, and secure file sharing.
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                </View>

                                <View style={{
                                    marginTop: 20,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: width * 0.055,
                                    paddingVertical: width * 0.0720,
                                }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        {images.map((_, index) => (
                                            <View
                                                key={index}
                                                style={{
                                                    height: 6,
                                                    width: currentIndex === index ? width * 0.0920 : width * 0.020,
                                                    backgroundColor: currentIndex === index ? '#EAA141' : 'white',
                                                    marginHorizontal: width * 0.011,
                                                    borderRadius: width * 0.011,
                                                }}
                                            />
                                        ))}
                                    </View>

                                    <TouchableOpacity
                                        style={{ backgroundColor: 'orange', borderRadius: width * 0.138, padding: width * 0.015 }}
                                        onPress={handleGoPress}>
                                        <Ionicons
                                            name="chevron-forward-outline"
                                            size={20}
                                            color={'white'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#0a0302',
    },
    signUpBtn: {
        fontSize: width * 0.0364,
        fontFamily: 'sora',
        fontWeight: '700',
    },
    alreadyAccount: {
        fontSize: width * 0.0364,
        color: 'white',
    },
    linearGradiend: {
        backgroundColor: '#4B4B4B',
        height: width * 0.140,
        marginHorizontal: width * 0.0390,
        borderRadius: width * 0.0156,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
