import React, {useRef, useState} from 'react';
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
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {AppImages} from '../../Utils/ImagesUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import {endpoints, urls} from '../../services/Endpionts';
import {showToast} from '../../helpers';
import {apiCall} from '../../services/apiCall';

export default function ClientOTP({navigation, route}) {
  const {userData} = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otptoken, setOtp_token] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef([]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      otpRefs.current[index - 1].focus();
    }
  };

  // Function to handle the API call
  const registerUser = async (payload, otp_token) => {
    try {
      setIsLoading(true); // Show loader
      const {_j} = DeviceInfo.getUniqueId(); // Get the device unique ID

      // Prepare headers, including custom header with deviceuid
      const headers = {
        'Content-Type': 'application/json',
        deviceuid: _j, // Add deviceuid to headers
      };

      // Add otp_token to the payload if available
      const updatedPayload = {
        ...payload, // Spread the existing payload
        otp_token: otp_token, // Add otp_token here if it's available
      };

      // Perform the API call using fetch
      const response = await fetch(urls.LiveBaseUrl + endpoints.register_api, {
        method: 'POST',
        headers: headers, // Pass the headers directly
        body: JSON.stringify(updatedPayload), // Send the updated payload with otp_token
      });

      const data = await response.json();
      console.log('final result--->:', data);
      setIsLoading(false); // Hide loader

      if (response.ok) {
        if (data.responseCode === 200) {
          showToast('success', 'Registration successful!');
          navigation.replace('Login', {userType: 'client'});
        }
      } else {
        showToast('error', data.message || 'Something went wrong.');
      }
    } catch (error) {
      setIsLoading(false); // Hide loader
      Alert.alert('Error', 'Failed to connect to the server.');
      console.error(error);
    }
  };
  const handleSubmit = async () => {
    const otpCode = otp.join('');
    console.log('Submitted OTP:', otpCode);
    // navigation.replace('Login', { userType: 'client' })

    const {_j} = DeviceInfo.getUniqueId(); // Get the device unique ID

    // Prepare headers, including custom header with deviceuid
    const headers = {
      'Content-Type': 'application/json',
      deviceuid: _j, // Add deviceuid to headers
    };

    const payload = {
      first_name: userData?.first_name,
      last_name: userData?.last_name,
      email: userData?.email,
      phone: userData?.phone,
      password: userData?.password,
      picture: 'media/profile_picture.jpg',
      user_type: userData?.user_type,
      otp: otpCode,
      // otp_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Example token
    };

    try {
      setIsLoading(true); // Show loader
      const response = await fetch(urls.LiveBaseUrl + endpoints.register_api, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Before token Response data--->:', data);
      setIsLoading(false); // Hide loader

      if (response.ok) {
        if (data.responseCode == 206) {
          console.log('Before token Response data--->:', data);

          // setOtp_token(data?.otp_token)
          // navigation.navigate('ClientOTP',{userData: payload}); // Navigate to the OTP screen
          // Call the registerUser function
          await registerUser(payload, data?.data?.otp_token);
        }
        // Alert.alert('Success', 'Registration successful!');
        // navigation.replace('Login', { userType: 'client' })
      } else {
        Alert.alert('Error', data.message || 'Something went wrong.');
      }
    } catch (error) {
      setIsLoading(false); // Hide loader
      Alert.alert('Error', 'Failed to connect to the server.');
      console.error(error);
    }
  };
  const resendOtp = async () => {
    let params = {
      email: userData?.email,
    };
    try {
      // setLoader(true);
      let result = await apiCall?.otpVerification(params);
      showToast('success', 'OTP resend succcessfully!');
    } catch (error) {
      console.log('error', error);
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      // setLoader(false);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
      {/* <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                > */}
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <View style={[styles.container, {paddingBottom: 20}]}>
          <View style={{width: '100%'}}>
            <TouchableOpacity
              onPress={() => {
                navigation?.goBack();
              }}
              style={{
                backgroundColor: '#1C5A9A',
                padding: 5,
                width: '10%',
                borderRadius: 10,
              }}>
              <Ionicons name="chevron-back-outline" size={20} color={'white'} />
            </TouchableOpacity>
          </View>

          <View style={{alignItems: 'center', paddingVertical: 10}}>
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

          <View style={{marginTop: 60}}>
            <Text style={styles.title}>Enter OTP</Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  maxLength={1}
                  keyboardType="numeric"
                  value={digit}
                  onChangeText={text => handleOtpChange(text, index)}
                  ref={ref => (otpRefs.current[index] = ref)}
                  onKeyPress={e => handleOtpKeyPress(e, index)}
                />
              ))}
            </View>
            <Text style={styles.resend}>
              haven't received OTP?{' '}
              <Text
                onPress={() => resendOtp()}
                style={[
                  styles.resend,
                  {color: '#FFA500', textDecorationLine: 'underline'},
                ]}>
                Resend
              </Text>
            </Text>
            <TouchableOpacity
              disabled={isLoading ? true : false}
              style={styles.submitButton}
              onPress={handleSubmit}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      {/* </KeyboardAvoidingView> */}
      {/* </TouchableWithoutFeedback> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Marathon-Serial Bold',
    color: 'black',
    marginBottom: 30,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#FFF',
    fontFamily: 'Poppins-Regular',
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
  resend: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});
