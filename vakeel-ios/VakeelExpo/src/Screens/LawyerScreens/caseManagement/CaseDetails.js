import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppImages} from '../../../Utils/ImagesUrl';
import {apiCall} from '../../../services/apiCall';
import {showToast} from '../../../helpers';
import AppHeader from '../../../Components/AppHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {enviroment} from '../../../environment';
import moment from 'moment';

const {width} = Dimensions.get('window');

const CaseDetails = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);
  const {details} = route.params || '';
  const [proceedingDetails, setPrceedingDetail] = useState(
    details?.proceedings[0] || null,
  );
  const allProceedingAttachments = [].concat(
    ...details?.proceedings.map(p => p.attachments),
  );
  const animatedWidth = useRef(new Animated.Value(width * 0.5)).current;
  const animatedRadious = useRef(new Animated.Value(width * 0.8)).current;
  const handlePress = () => {
    // Animated.timing(animatedRadious, {
    //   toValue: width * 0.04, // Increase the width slightly
    //   duration: 1500, // Duration of the animation
    //   useNativeDriver: false, // Width cannot use native driver
    // }).start(() => {
    navigation.navigate('CaseProceeding', {details: details});
    // });
    // Start the animation
    // Animated.timing(animatedWidth, {
    //   toValue: width * 0.9, // Increase the width slightly
    //   duration: 1500, // Duration of the animation
    //   useNativeDriver: false, // Width cannot use native driver
    // }).start(() => {
    //   //   navigation.navigate('PostCase1');
    // });
  };
  // const screenRoute = () => {
  //   Animated.timing(animatedRadious, {
  //     toValue: width * 0.04,
  //     duration: 1500,
  //     useNativeDriver: false,
  //   }).start(() => {});
  //   // Start the animation
  //   Animated.timing(animatedWidth, {
  //     toValue: width * 0.9,
  //     duration: 1500,
  //     useNativeDriver: false,
  //   }).start(() => {});
  // };
  // useFocusEffect(
  //   React.useCallback(() => {
  //     animatedWidth.setValue(width * 0.5);
  //   }, [animatedWidth]),
  // );
  // useEffect(() => {
  //   screenRoute();
  // }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#2669A9" />
      </SafeAreaView>
    );
  }
  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1, padding: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <AppHeader navigation={navigation} title="Case Details" />

        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{paddingVertical: 10}}
            contentContainerStyle={{paddingBottom: 80}}>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('MyMatters2', {MatterDetails: item});
              }}
              style={styles.card}>
              <View
                style={[
                  styles.cardHeader,
                  {flexDirection: 'row', marginTop: 16},
                ]}>
                <View
                  style={{
                    width: '25%',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#2669A9',
                      borderRadius: 50,
                      alignItems: 'center',
                      padding: 10,
                    }}>
                    <Image
                      resizeMode="contain"
                      source={AppImages?.Post_Matter}
                      style={{height: 40, width: 40}}
                    />
                  </View>
                </View>

                <View style={{width: '80%'}}>
                  <Text numberOfLines={1} style={styles.cardTitle}>
                    {details?.title}
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <Text style={styles.cardCategory}>
                      {details?.category?.name +
                        '/' +
                        details?.subcategory?.name}
                    </Text>
                  </View>
                </View>
              </View>
              <Text
                style={styles.cardDescription}
                numberOfLines={isReadMore ? 80 : 2}
                ellipsizeMode="tail">
                {details?.case_description}
              </Text>
              <Text
                onPress={() => {
                  setIsReadMore(!isReadMore);
                }}
                style={[styles.cardCategory, {marginBottom: 10}]}>
                Read {!isReadMore ? 'More' : 'Less'}
              </Text>
              <View style={styles.cardFooter}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {/* <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#A9A9A9"
                      /> */}
                  <View style={styles?.dot} />
                  <Text style={styles.cardDate}>{details?.case_status}</Text>
                </View>
                <Text style={styles.cardResponses}>{details?.client_name}</Text>
              </View>
            </TouchableOpacity>

            <Text style={[styles?.heading, {marginVertical: 8}]}>
              Linked Case
            </Text>
            <View style={styles.titleView}>
              <Text style={[styles?.title, {flex: 1}]}>Case No.</Text>
              <Text style={[styles?.title, {flex: 1}]}>Title</Text>
            </View>
            <View style={styles.titleView}>
              <Text style={[styles?.titleBold, {flex: 1}]}>
                {details?.case_number}
              </Text>
              <Text style={[styles?.titleBold, {flex: 1, color: '#5491C9'}]}>
                {details?.title}
              </Text>
            </View>

            <View style={{height: 8}} />

            <Text style={[styles?.heading, {marginVertical: 8}]}>
              Case Details
            </Text>
            <View style={styles.titleView}>
              <Text style={[styles?.title, {flex: 1}]}>Case No.</Text>
              <Text style={[styles?.title, {flex: 1}]}>
                Institution No. & Date
              </Text>
            </View>
            <View style={styles.titleView}>
              <Text style={[styles?.titleBold, {flex: 1}]}>
                {details?.case_number}
              </Text>
              <Text style={[styles?.titleBold, {flex: 1}]}>
                {formatDate(details?.hearing_date)}
              </Text>
            </View>

            <View style={{height: 8}} />
            <Text style={[styles?.title, {flex: 1}]}>Case Category</Text>
            <Text style={[styles?.titleBold, {flex: 1}]}>
              {details?.case_category}
            </Text>

            <View style={{height: 8}} />

            <View style={styles.titleView}>
              <Text style={[styles?.title, {flex: 1}]}>FIR No.</Text>
              <Text style={[styles?.title, {flex: 1}]}>FIR Year.</Text>
            </View>
            <View style={styles.titleView}>
              <Text style={[styles?.titleBold, {flex: 1}]}>
                {details?.FIR_number}
              </Text>
              <Text style={[styles?.titleBold, {flex: 1}]}>
                {details?.FIR_year}
              </Text>
            </View>
            <View style={{height: 8}} />
            <View style={styles.titleView}>
              <Text style={[styles?.title, {flex: 1}]}>Police Station</Text>
              <Text style={[styles?.title, {flex: 1}]}>Offence</Text>
            </View>
            <View style={styles.titleView}>
              <Text style={[styles?.titleBold, {flex: 1}]}>
                {details?.police_station}
              </Text>
              <Text style={[styles?.titleBold, {flex: 1}]}>
                {details?.offense}
              </Text>
            </View>
            <View style={{height: 14}} />

            <Text style={[styles?.heading, {marginVertical: 12}]}>
              Proceeding History
            </Text>
            <View style={{flexDirection: 'row', gap: width * 0.02}}>
              {details?.proceedings?.map((item, index) => (
                <TouchableOpacity
                  onPress={() => setPrceedingDetail(item)}
                  style={[
                    styles?.proceed,
                    {
                      backgroundColor:
                        item?._id === proceedingDetails?._id
                          ? '#EAA141'
                          : '#D9DBDD',
                    },
                  ]}>
                  <Text style={styles.proceedTxt}>
                    {moment(item?.date).format('DD')}
                  </Text>
                  <Text style={styles.proceedTxt1}>
                    {moment(item?.date).format('MMM')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{height: 24}} />
            <Text style={styles.sectionTitle}>Order Of The Day</Text>
            <View style={{height: 4}} />
            <Text style={[styles?.titleBold, {}]}>
              {/* {details?.proceedings[details?.proceedings?.length - 1]?.order} */}
              {proceedingDetails?.order}
            </Text>

            <View style={{height: 24}} />

            <Text style={styles.sectionTitle}>Case Proceeding</Text>

            <View style={styles.uploadContainer1}>
              {/* {allProceedingAttachments?.map((item, index) => (
                <View key={index} style={styles.uploadBox1}>
                  <Image
                    style={[styles.cnicImage]}
                    source={{
                      uri: enviroment?.API_URL + item,
                    }}
                  />
                </View>
              ))} */}
              {proceedingDetails?.attachments?.map((item, index) => (
                <View key={index} style={styles.uploadBox1}>
                  <Image
                    style={[styles.cnicImage]}
                    source={{
                      uri: enviroment?.API_URL + item,
                    }}
                  />
                </View>
              ))}
            </View>

            <View style={{height: 24}} />

            <Text style={styles.sectionTitle}>Attachments</Text>

            <View style={styles.uploadContainer1}>
              {details?.case_documents?.map((item, index) => (
                <View key={index} style={styles.uploadBox1}>
                  <Image
                    style={[styles.cnicImage]}
                    source={{
                      uri: enviroment?.API_URL + item,
                    }}
                  />
                </View>
              ))}
            </View>

            <View style={{height: 8}} />

            <Text style={[styles?.heading, {marginVertical: 8}]}>
              Disposal Details
            </Text>

            <Text style={[styles?.title, {flex: 1}]}>Decided By</Text>
            <Text style={[styles?.titleBold, {flex: 1}]}>
              {details?.disposal_decided_by}
            </Text>
            <View style={{height: 8}} />
            <View style={styles.titleView}>
              <Text style={[styles?.title, {flex: 1}]}>Decision Date</Text>
              <Text style={[styles?.title, {flex: 1}]}>Decision Type</Text>
            </View>
            <View style={styles.titleView}>
              <Text style={[styles?.titleBold, {flex: 1}]}>
                {' '}
                {formatDate(details?.decision_date)}
              </Text>
              <Text style={[styles?.titleBold, {flex: 1}]}>
                {details?.decision_type}
              </Text>
            </View>

            <View style={{height: 8}} />
            <Text style={[styles?.title, {flex: 1}]}>Acquitted/ Convicted</Text>
            <Text style={[styles?.titleBold, {flex: 1}]}>
              {details?.acquitted_convicted
                ? details?.acquitted_convicted
                : '-------'}
            </Text>

            <View style={{height: 8}} />
            <Text style={[styles?.title, {flex: 1}]}>Short Order</Text>
            <Text style={[styles?.titleBold, {flex: 1}]}>
              {details?.short_order ? details?.short_order : '-------'}
            </Text>
          </ScrollView>
          <Animated.View
            style={[
              styles.submitButton,
              // {width: animatedWidth, borderRadius: animatedRadious}, // Bind the animated width to the style
            ]}>
            <TouchableOpacity
              style={styles.innerTouchable}
              onPress={handlePress}
              // onPress={() => navigation.navigate('PostCase1')}
            >
              <Text style={styles.submitButtonText}>Case Proceeding</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default CaseDetails;
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cardHeader: {
    marginBottom: 5,
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1C5A9A',
    // marginBottom: 4,
  },
  cardCategory: {
    fontSize: 12,
    color: '#EAA141',
    fontFamily: 'Poppins-Regular',
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
    paddingTop: 5,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 3,
    bottom: 1,
  },
  dot: {width: 8, height: 8, backgroundColor: '#2ECD53', borderRadius: 8},
  cardResponses: {
    fontSize: 12,
    color: '#5491C9',
  },
  submitButton: {
    position: 'absolute',
    bottom: 0,
    padding: width * 0.03,
    height: 50,
    backgroundColor: '#EAA141',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center',
    width: '95%',
    borderRadius: width * 0.04,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#EAA14180',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    // fontWeight: '600',
  },
  heading: {
    fontSize: width * 0.05,
    fontFamily: 'Marathon-Serial Bold',
    color: '#1C5A9A',
  },
  title: {
    fontSize: width * 0.03,
    fontFamily: 'Poppins-Regular',
    color: '#58595A',
  },
  titleBold: {
    fontSize: width * 0.028,
    fontFamily: 'Poppins-SemiBold',
    color: '#58595A',
    marginTop: -width * 0.02,
  },
  titleView: {flexDirection: 'row', marginTop: 4},
  sectionTitle: {
    fontSize: width * 0.07,
    fontFamily: 'Marathon-Serial Regular',
    color: '#A4A9AE',
  },
  uploadBox1: {
    width: '30%',
    height: width * 0.35,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: width * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cnicImage: {
    width: width * 0.28,
    height: width * 0.29,
  },
  uploadContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    flexWrap: 'wrap',
    gap: 4,
  },
  proceed: {
    width: 60,
    height: 60,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedTxt: {
    fontSize: 18,
    // fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  proceedTxt1: {
    fontSize: 16,
    marginTop: -width * 0.02,
    color: '#ffffff',
    fontWeight: '500',
  },
});
