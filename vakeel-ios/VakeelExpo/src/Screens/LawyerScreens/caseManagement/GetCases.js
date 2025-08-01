import React, {useCallback, useEffect, useRef, useState} from 'react';
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
  BackHandler,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppImages} from '../../../Utils/ImagesUrl';
import {apiCall} from '../../../services/apiCall';
import {getDataLocally, showToast} from '../../../helpers';
import AppHeader from '../../../Components/AppHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const GetCases = ({navigation}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const [categories, setCategories] = useState([{_id: 'all', name: 'All'}]);
 
  const [refreshing, setRefreshing] = React.useState(false);
  const focus = useIsFocused()
  const animatedWidth = useRef(new Animated.Value(width * 0.5)).current;

  const handlePress = item => {
    // Start the animation
    // Animated.timing(animatedWidth, {
    //   toValue: width * 0.8, // Increase the width slightly
    //   duration: 1500, // Duration of the animation
    //   useNativeDriver: false, // Width cannot use native driver
    // }).start(() => {
      navigation.navigate('CaseDetails', {details: item});
    // });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllCases()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    const backAction = () => {
      navigation?.navigate('Home')
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      animatedWidth.setValue(width * 0.5);
    }, [animatedWidth]),
  );
  useEffect(() => {
    getAllCases();
    getCasesCategories();
  }, [focus]);
  const getCasesCategories = async () => {
    let obj = {
      limit: 1000,
    };
    try {
      let result = await apiCall?.getCasesCategories(obj);
      setCategories([{_id: 'all', name: 'All'}, ...result.data.categories]);
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
      console.log('error', error);
    } finally {
    }
  };
  const getAllCases = async id => {
    setCases([]);
    let obj = {
      limit: 500,
      category_id: id === 'all'?null:id ? id : null,
    };
    try {
      setLoading(true);
      let result = await apiCall?.getAllCases(obj);
      // console.log(result?.data?.cases);
      setCases(result?.data?.cases);
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
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
        <AppHeader screen={'Home'} navigation={navigation} title="Cases Management" />

        <View style={styles.container}>
          <View style={{paddingVertical: 10, marginBottom: 10}}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryContainer}>
              {categories?.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.chip,
                    selectedCategory === category && styles.chipSelected,
                  ]}
                  onPress={() => {
                    getAllCases(category?._id);
                    setSelectedCategory(category);
                  }}>
                  <Text
                    style={[
                      styles.chipText,
                      selectedCategory === category && styles.chipTextSelected,
                    ]}>
                    {category?.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{paddingVertical: 10}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
            {cases.length === 0 ? (
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 20,
                  fontSize: 16,
                  color: '#999',
                }}>
                No Data Found
              </Text>
            ) : (
              cases?.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    handlePress(item);
                  }}
                  key={index}
                  style={styles.card}>
                  <View style={styles?.dateView}>
                    <Text
                      style={{
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: 12,
                      }}>
                      {formatDate(item?.hearing_date)}
                    </Text>
                  </View>
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
                        {item?.title}
                      </Text>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                        }}>
                        <Text style={styles.cardCategory}>
                          {item?.category?.name + '/'+item?.subcategory?.name}
                        </Text>
                     
                      </View>
                    </View>
                  </View>
                  <Text
                    style={styles.cardDescription}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {item?.case_description}
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
                      <Text style={styles.cardDate}>{item?.case_status?.charAt(0)?.toUpperCase() + item?.case_status?.slice(1)}</Text>
                    </View>
                    <Text style={styles.cardResponses}>
                      {item?.client_name?.charAt(0)?.toUpperCase() + item?.client_name?.slice(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
          <Animated.View
            style={[
              styles.submitButton,
              {width: animatedWidth}, // Bind the animated width to the style
            ]}>
            <TouchableOpacity
              style={styles.innerTouchable}
              onPress={() => navigation.navigate('PostCase1')}>
              <Text style={styles.submitButtonText}>Add New Case</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default GetCases;
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
  dot: {width: 8, height: 8, backgroundColor: 'green', borderRadius: 8},
  cardResponses: {
    fontSize: 12,
    color: '#5491C9',
  },
  submitButton: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    padding: width * 0.03,
    // width: '50%',
    height: 50,
    backgroundColor: '#0F5189',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    // marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: width * 0.08,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    // fontWeight: '600',
  },
  dateView: {
    width: width * 0.3,
    height: width * 0.08,
    backgroundColor: '#EAA141',
    position: 'absolute',
    right: 0,
    borderTopEndRadius: 20,
    borderBottomStartRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  innerTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
