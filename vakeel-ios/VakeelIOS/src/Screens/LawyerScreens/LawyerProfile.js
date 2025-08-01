import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Dimensions,
  ScrollView,
  Image,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import AppHeader from '../../Components/AppHeader';
import {AppImages} from '../../Utils/ImagesUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getDataLocally, getFirebaseToken} from '../../helpers';
import {SafeAreaView} from 'react-native-safe-area-context';
import {enviroment} from '../../environment';
import {apiCall} from '../../services/apiCall';
import messaging from '@react-native-firebase/messaging';
import { useIsFocused } from '@react-navigation/native';

const {width} = Dimensions.get('window');

export default function LawyerProfile({navigation, route}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const isFocus = useIsFocused()
  const getDataLocal = async () => {
    const getLocalData = await getDataLocally();
    let obj = {
      user_id: getLocalData?._id,
      // user_id: '676a8e55af692db2397eae05',
    };
    try {
      setLoading(true)
      let result = await apiCall?.getProfile(obj);
      setData(result?.data);
      setLoading(false)
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
      console.log('error', error);
    } finally {
    }
  };
  useEffect(() => {
    getDataLocal();
  }, [isFocus]);
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  const logout = async () => {
    const firebaseToken = await getFirebaseToken();
    let obj = {
      fcm_token: firebaseToken,
    };
    try {
      setLoader(true)
      let result = await apiCall?.logout(obj);
      await messaging().deleteToken();
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoader(false)
      navigation.replace('Login', {userType: 'client'});
    }
  };
  const editProfile = () => {
    navigation.navigate('EditLawyerProfile');
  };
    if (loading) {
      return (
        <SafeAreaView
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#2669A9" />
        </SafeAreaView>
      );
    }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1, padding: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <AppHeader
          navigation={navigation}
          title="Profile"
          chat={'Edit'}
          onPress={editProfile}
        />

        <ScrollView style={{flex: 1}}>
          <View
            style={{
              alignItems: 'center',
              paddingVertical: 30,
            }}>
            <View style={styles.profileView}>
              {data?.userDetails?.picture ? (
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: enviroment?.API_URL + data?.userDetails?.picture,
                  }}
                />
              ) : (
                <Ionicons name="person" size={60} color="white" />
              )}
            </View>
            <Text
              style={
                styles.textStyle1
              }>{`${data?.userDetails?.first_name} ${data?.userDetails?.last_name}`}</Text>
            <Text style={styles.textStyle2}>
              {data?.userDetails?.lawyer_details?.designation}
            </Text>
            <Text style={styles.textStyle}>
              {data?.userDetails?.lawyer_details?.qualifications}
            </Text>
          {data?.userDetails?.lawyer_details?.station&&
           <View style={styles?.stationView}>
              <Text style={styles.station}>
                {data?.userDetails?.lawyer_details?.station}
              </Text>
            </View>}
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '80%',
              }}>
              <View style={styles?.LawyerDetailView}>
                <Text
                  style={[styles.lawyerDetailViewTxtCount, {color: '#5491C9'}]}>
                  {data?.matterCount ? data?.matterCount : '0'}
                </Text>
                <Text style={styles.lawyerDetailViewTxt}>
                  Matters Responded
                </Text>
              </View>
              <View
                style={[
                  styles?.LawyerDetailView,
                  {backgroundColor: '#FFF2E1'},
                ]}>
                <Text
                  style={[styles.lawyerDetailViewTxtCount, {color: '#EAA141'}]}>
                  {data?.userDetails?.lawyer_details?.years_of_experience
                    ? data?.userDetails?.lawyer_details?.years_of_experience
                    : '0'}
                  +
                </Text>
                <Text style={styles.lawyerDetailViewTxt}>Total Experience</Text>
              </View>
              <View
                style={[
                  styles?.LawyerDetailView,
                  {backgroundColor: '#D1D3D475'},
                ]}>
                <Text
                  style={[styles.lawyerDetailViewTxtCount, {color: '#404B53'}]}>
                  {data?.casesCount ? data?.casesCount : '0'}
                </Text>
                <Text style={styles.lawyerDetailViewTxt}>Cases {' '} Covered</Text>
              </View>
            </View>
           {data?.userDetails?.lawyer_details?.area_of_expertise&&
           <View style={styles.lawyerExperienceView}>
              <Text style={[styles.lawyerExperienceViewTxt]}>
                Area of Experience
              </Text>
              <Text style={styles.lawyerExperienceViewTxt1}>
                {data?.userDetails?.lawyer_details?.area_of_expertise}
              </Text>
            </View>}
           {data?.userDetails?.lawyer_details?.office_address&&
            <View style={styles.lawyerExperienceView}>
              <Text style={[styles.lawyerExperienceViewTxt]}>
                Office Address
              </Text>
              <Text style={styles.lawyerExperienceViewTxt1}>
                {data?.userDetails?.lawyer_details?.office_address}
              </Text>
            </View>}

            {/* <TouchableOpacity
              style={styles.submitButton}
              onPress={() => navigation.navigate('ChangePassword')}>
              <Text style={styles.submitButtonText}>Change Password</Text>
            </TouchableOpacity>
 */}
            <TouchableOpacity
             disabled={loader?true:false}
              style={[styles.submitButton, {backgroundColor: '#1C5A9A'}]}
              onPress={() => {
                logout();
              }}>
              <Text style={styles.submitButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    color: '#404B53',
    fontFamily: 'Poppins-SemiBold',
    top: -8,
  },
  station: {
    fontFamily: 'Poppins-Regular',
    color: '#5491C9',
  },
  textStyle1: {
    fontFamily: 'Poppins-Bold',
    color: '#404B53',
    fontSize: width * 0.055,
  },
  textStyle2: {
    fontFamily: 'Poppins-SemiBold',
    color: '#EAA141',
    top: -4,
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
    fontFamily: 'Poppins-Regular',
  },
  uploadContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '90%',
    marginTop: 30,
    flexWrap:"wrap",
    gap:4
  },
  uploadBox1: {
    width: '32%',
    height: width * 0.32,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: width * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cnicImage: {
    width: width * 0.25,
    height: width * 0.3,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileView: {
    marginBottom: 20,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#c2c2c2',
    overflow: 'hidden',
  },
  stationView: {
    paddingHorizontal: width * 0.04,
    height: width * 0.09,
    backgroundColor: '#5491C926',
    borderRadius: width * 0.1,
    borderColor: '#5491C9',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LawyerDetailView: {
    width: width*0.25,
    height: width*0.3,
    backgroundColor: '#5491C926',
    borderRadius: width * 0.06,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    textAlign: 'center',
  },
  lawyerDetailViewTxt: {
    color: '#404B53',
    fontFamily: 'Poppins-Regular',
    fontSize: width * 0.032,
    textAlign: 'center',
  },
  lawyerDetailViewTxtCount: {
    fontFamily: 'Poppins-Bold',
    top: width * 0.015,
    fontSize: width * 0.04,
    textAlign: 'center',
  },
  lawyerExperienceViewTxt: {
    fontFamily: 'Poppins-Regular',
    fontSize: width * 0.028,
    color: '#A4A9AE',
  },
  lawyerExperienceViewTxt1: {
    fontFamily: 'Poppins-Regular',
    fontSize: width * 0.036,
    color: '#404B53',
    top: -3,
  },
  lawyerExperienceView: {
    width: '80%',
    height: width * 0.25,
    marginTop: 20,
    borderRadius: width * 0.04,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: width * 0.06,
  },
});
