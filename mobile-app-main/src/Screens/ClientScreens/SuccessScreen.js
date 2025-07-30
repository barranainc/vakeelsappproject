import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import {AppImages} from '../../Utils/ImagesUrl';
import FastImage from 'react-native-fast-image';

const {width, height} = Dimensions.get('window');

export default function SuccessScreen({navigation, route}) {
  const {SuccessMessage} = route.params || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('1 minute has passed!');
      if(SuccessMessage?.scrrenName){
        navigation.navigate(SuccessMessage?.scrrenName);
      }else{
      navigation.navigate('ClientHome');
      }
    }, 1500); // 60000ms = 1 minute

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#0F5189'}}>
      <ImageBackground
        source={AppImages?.Success_BG}
        style={{flex: 1, padding: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <View
          style={{
            height: '100%',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingVertical: 70,
          }}>
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Image
              resizeMode="contain"
              source={AppImages?.VakeelLogoWithoutName}
              style={{height: 80, width: 80}}
            />
            <Text
              style={{
                color: '#0F5189',
                fontSize: 22,
                fontFamily: 'Marathon-Serial Bold',
                marginTop: 3,
              }}>
              VAKEEL'S
            </Text>
            <Text
              style={{
                color: '#0F5189',
                fontSize: 6,
                fontFamily: 'Marathon-Serial Bold',
              }}>
              A LEGAL CONSULTANCY
            </Text>
          </View>

          <View style={{marginTop: 80}}>
            {/* <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontFamily: 'Marathon-Serial Bold',
              }}>
              Data submitting .....
            </Text> */}
            {/* <ActivityIndicator
              style={{marginTop: 20}}
              size="large"
              color={'white'}
            /> */}
            <FastImage
              style={{
                width: 100,
                height: 100,
              }}
              source={require('../../assets/Images/gif/checkmark1.gif')} // Local GIF path
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <View
            style={{width: '100%', paddingHorizontal: 20, paddingBottom: 20}}>
            <View style={{paddingHorizontal: 20}}>
              {SuccessMessage?.successTitle && (
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 28,
                    fontFamily: 'Marathon-Serial Regular',
                    marginTop: 3,
                    textAlign: 'center',
                  }}>
                  {SuccessMessage?.successTitle}
                </Text>
              )}
              {SuccessMessage?.successMsg && (
                <Text
                  style={{
                    marginTop: 4,
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'Poppins-Regular',
                    textAlign:"center"
                  }}>
                  {SuccessMessage?.successMsg}
                </Text>
              )}
              {/* <Text style={{ color: 'white', fontSize: 28, fontFamily: 'Marathon-Serial Regular', marginTop: 3 }}>Your matter has been posted successfully</Text>
                            <Text style={{ marginTop: 20, color: 'white', fontSize: 14, fontFamily: 'Poppins-Regular' }}>We recommend you to login with your account to save your data for later use</Text> */}
            </View>
            {/* 
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={() => {
                                navigation.navigate('ClientHome');
                            }}
                        >
                            <Text style={styles.submitButtonText}>OK</Text>
                        </TouchableOpacity> */}
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
    marginTop: 20,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
    // marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
