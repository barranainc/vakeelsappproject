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
  ScrollView,
  Dimensions,
} from 'react-native';
import {AppImages} from '../../Utils/ImagesUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {apiCall} from '../../services/apiCall';
import {getFirebaseToken, showToast} from '../../helpers';
import InputField from '../../Components/textInputs/InputField';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import {Apis} from '../../services/Endpoints';
import {enviroment} from '../../environment';
const {width, height} = Dimensions.get('window');
export default function ForgetPassword({navigation, route}) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isOtp, setIsOtp] = useState(false);
  const [loader, setLoader] = useState(false);
  const [token, setToken] = useState(null);
  const {data} = route?.params;
  const otpRefs = useRef([]);
  const {control, handleSubmit, watch} = useForm({
    defaultValues: {
      email: null,
      password: null,
    },
  });
  const emailValidation = value => {
    const trimmedValue = value.trim();
    return (
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(trimmedValue) ||
      'Invalid email address'
    );
  };

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
  //   const onSubmit = async () => {
  //     const firebaseToken = await getFirebaseToken();
  //     const otpCode = otp.join('');
  //     let params = {
  //       first_name: data?.firstName,
  //       last_name: data?.lastName,
  //       council_id: data?.barCouncilId,
  //       password: data?.password,
  //       email: data?.email,
  //       phone: data?.phone,
  //       cnic_number: data?.cnic,
  //       cnic_front: data?.cnicFront,
  //       cnic_back: data?.cnicBack,
  //       user_type: data?.userType === 'Paralegal' ? 'paralegal' : 'lawyer',
  //       otp: otpCode,
  //       council_documents: data?.barDocs,
  //       fcm_token: firebaseToken,
  //     };
  //     try {
  //       setLoader(true);
  //       let result = await apiCall?.otpVerification(params);
  //     //   registrationApiCall(params, result?.data?.otp_token);
  //       // navigation.replace('Login');
  //     } catch (error) {
  //       console.log('error', error);
  //       showToast('error', error ? error : 'Something went wrong');
  //     } finally {
  //       setLoader(false);
  //     }
  //   };
  const onSubmit = data => {
    const otpCode = otp.join('');
    const _j = 1234;
    let config = {
      headers: {
        deviceuid: _j,
      },
    };
    const obj = {
      email: data?.email?.toLowerCase(),
      otp: otpCode === '' ? null : otpCode,
      password: data?.password,
      otp_token: token,
    };
    try {
      setLoader(true);
      if (!token) {
        console.log("hello")
        axios
          .post(enviroment.API_URL + Apis.forgetPwd, obj, config)
          .then(async res => {
            console.log("res",res)
            if (res?.data?.responseCode === 200) {
              navigation.navigate('Login');
            }
            if (
              res?.data?.responseCode === 206 &&
              res?.data?.message !== 'OTP verified'
            ) {
              setIsOtp(!isOtp);
            } else if (
              res?.data?.responseCode === 206 &&
              res?.data?.message === 'OTP verified'
            ) {
              setToken(res?.data?.data?.otp_token);
              // setIsOtp(!isOtp);
            }
            showToast('success', res?.data?.message);
            setLoader(false);
          }) .catch(err => {
            showToast('error', 'Wrong OTP');
            setLoader(false);
          });;
      } else {
      
        axios
          .post(enviroment.API_URL + Apis.forgetPwd, obj, config)
          .then(async res => {
            console.log("res",res)
            if (res?.data?.responseCode === 200) {
              navigation.navigate('Login');
            }
            if (
              res?.data?.responseCode === 206 &&
              res?.data?.message !== 'OTP verified'
            ) {
              setIsOtp(!isOtp);
            } else if (
              res?.data?.responseCode === 206 &&
              res?.data?.message === 'OTP verified'
            ) {
              setToken(res?.data?.data?.otp_token);
              // setIsOtp(!isOtp);
            }
            showToast('success', res?.data?.message);
            setLaoding(false);
          })
          .catch(err => {
            console.log('🚀 ~ handleSubmit ~ err:', err);
            setLoader(false);
          });
      }
    } catch (e) {
    } finally {
      setLoader(false);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1}}
        imageStyle={{resizeMode: 'cover'}}>
            <ScrollView
                        keyboardShouldPersistTaps="handled">
        <View style={[styles.container, {paddingBottom: 20}]}>
          {/* <View style={{width: '100%'}}>
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
          </View> */}

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
            <Text style={styles.title}>Enter {!isOtp?"Email":token?"New Password":'OTP'}</Text>
            {token ? (
              <>
                <InputField
                  name={'password'}
                  control={control}
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long',
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])/,
                      message:
                        'Password must contain at least one uppercase letter',
                    },
                  }}
                  placeholder={'New Password'}
                />
              </>
            ) : !isOtp ? (
              <InputField
                name={'email'}
                control={control}
                rules={{
                  required: 'Email is required',
                  validate: emailValidation,
                }}
                placeholder={'Email'}
              />
            ) : (
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
            )}

            <TouchableOpacity
              style={styles.submitButton}
              disabled={loader?true:false}
              onPress={handleSubmit(onSubmit)}>
              {loader ? (
                <ActivityIndicator color={'#0F5189'} />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
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
});
