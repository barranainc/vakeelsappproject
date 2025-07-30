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
} from 'react-native';
import {AppImages} from '../../Utils/ImagesUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {apiCall} from '../../services/apiCall';
import {getFirebaseToken, showToast} from '../../helpers';

export default function LawyerOTP({navigation, route}) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loader, setLoader] = useState(false);
  const {data} = route?.params;
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
  const handleSubmit = async () => {
    const firebaseToken = await getFirebaseToken();
    const otpCode = otp.join('');
    let params = {
      first_name: data?.firstName,
      last_name: data?.lastName,
      council_id: data?.barCouncilId,
      password: data?.password,
      email: data?.email,
      phone: data?.phone,
      cnic_number: data?.cnic,
      cnic_front: data?.cnicFront,
      cnic_back: data?.cnicBack,
      user_type: data?.userType === 'Paralegal' ? 'paralegal' : 'lawyer',
      otp: otpCode,
      council_documents: data?.barDocs,
      fcm_token: firebaseToken,
    };
    try {
      setLoader(true);
      let result = await apiCall?.otpVerification(params);
      registrationApiCall(params, result?.data?.otp_token);
      // navigation.replace('Login');
    } catch (error) {
      console.log('error', error);
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };
  const resendOtp = async () => {
    let params = {
      email: data?.email,
    };
    try {
      // setLoader(true);
      let result = await apiCall?.otpVerification(params);
      showToast('success',  'OTP resend succcessfully!');
    } catch (error) {
      console.log('error', error);
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      // setLoader(false);
    }
  };

  const registrationApiCall = async (params, token) => {
    try {
      setLoader(true);
      let obj = {...params, otp_token: token};
      let result = await apiCall?.registration(obj);
      showToast('success', result?.message);
      navigation.navigate('Login');
    } catch (error) {
      // showToast('error', error ? error : 'Something went wrong');
    } finally {
      navigation.navigate('Login');
      setLoader(false);
    }
  };
  // const handleSubmit = () => {
  //     const otpCode = otp.join('');
  //     console.log('Submitted OTP:', otpCode);
  //     navigation.replace('Login');
  // };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
      {/* <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}> */}
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
              style={styles.submitButton}
              disabled={loader ? true : false}
              onPress={handleSubmit}>
              {loader ? (
                <ActivityIndicator color={'#0F5189'} />
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
    // backgroundColor:'red',
    paddingHorizontal: 5,
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
