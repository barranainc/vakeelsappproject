import React, { useState } from 'react';
import { SafeAreaView, StatusBar, ScrollView, TouchableOpacity, StyleSheet, Text, View, Dimensions, Image, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppImages } from '../../Utils/ImagesUrl';

const { width } = Dimensions.get('window');
export default function Onboarding() {
    const [currentIndex, setCurrentIndex] = useState(0);

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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor="transparent" />
            <ScrollView
                horizontal
                pagingEnabled
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, }}>
                {images.map((image, index) => (
                    <Image
                        key={index}
                        style={[{ flex: 1, width: width, height: '100%',backgroundColor:'red',padding:5 }]}
                        source={image}
                        resizeMode={'cover'}
                    />




                ))}
            </ScrollView>



            <LinearGradient
                // colors={['red', 'green']}
                colors={['#012040D9', '#0D0D0D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                    // height: 260,
                    // backgroundColor: '#373433',
                    opacity: 1,
                    width: '100%',
                    borderTopRightRadius: width * 0.0520,
                    borderTopLeftRadius: width * 0.0520,
                    position: 'absolute',
                    bottom: 0,
                    // backgroundColor:'red'
                }}>

                <View style={{ paddingVertical: 20, paddingHorizontal: 10, }}>

                    <View style={{ paddingVertical: 10, }}>
                        <View  >
                            <Text style={{ color: 'rgba(234, 161, 65, 1)', fontSize: 24, fontWeight: 'bold' }}>Legal Matters</Text>
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 15, fontWeight: '400', color: 'white' }}>Access a wide range of legal services, from contract review and document drafting to business formation and intellectual property protection, all through our user-friendly platform</Text>

                        </View>
                    </View>

                    <View style={{  flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: width * 0.0520 }}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={{
                                    height: 6,
                                    width: currentIndex === index ? width * 0.0720 : width * 0.030,
                                    backgroundColor: currentIndex === index ? 'rgba(234, 161, 65, 1)' : 'white',
                                    marginHorizontal: 4,
                                    borderRadius: 4,
                                }}
                            />
                        ))}
                    </View>

                    {/* <View style={{ flexGrow: 6, justifyContent: 'center', rowGap: 16, }}>
                        <TouchableOpacity
                            onPress={() => handleSubmit('business')}
                            style={{
                                backgroundColor: 'red',
                                height: width * 0.140,
                                marginHorizontal: width * 0.0390,
                                borderRadius: 6,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Text
                                style={{
                                    fontSize: width * 0.0364,
                                    fontWeight: '700',
                                    color: 'white',
                                }}>
                                {'signUpAsBusiness'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleSubmit('member')}>
                            <LinearGradient
                                colors={['#EC991C', '#EC1C1C']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.linearGradiend}>
                                <Text
                                    style={{
                                        fontSize: width * 0.0364,
                                        fontFamily: 'sora',
                                        fontWeight: '700',
                                        color: 'white',
                                        // backgroundColor:'red'
                                    }}>
                                    {'signUpAsMember'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View> */}


                    <View
                        style={{
                            // flexGrow: 2,
                            // flexDirection: 'row',
                            // justifyContent: 'space-between',
                            // marginHorizontal: 15,
                            // height: 50,
                            padding: 10,
                            alignItems: 'center',
                            // paddingBottom: 10,
                            // marginHorizontal: 15,
                            // backgroundColor: 'green'
                        }}>

                        <Pressable
                            style={{  width: '50%' }}
                            onPress={() => navigation.navigate('Login')}>
                            <LinearGradient
                                // colors={['red', 'green']}
                                colors={['#FFC77E', '#EAA141']}
                                // colors={['#EAA141', '#FFC77E']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 0 }}
                                style={{borderRadius: 5, padding: 15,}}
                                >


                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>Get Started ----</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>

                </View>

            </LinearGradient>

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