import React, {useState, useEffect} from 'react';
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
  BackHandler,
} from 'react-native';
import AppHeader from '../../Components/AppHeader';
import {AppImages} from '../../Utils/ImagesUrl';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiCall} from '../../services/apiCall';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';

const {width} = Dimensions.get('window');

export default function LawyerPostedMatter({navigation}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([{_id: 'all', name: 'All'}]);
  const fucus = useIsFocused();
  // const categories = [
  //   'All',
  //   'Family',
  //   'Civil',
  //   'Employment',
  //   'Criminal',
  //   'Corporate',
  //   'Banking',
  //   'Taxation',
  // ];
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
  }, [fucus]);
  const getCategories = async () => {
    let obj = {
      limit: 1000,
      only_parent: true,
    };
    try {
      let result = await apiCall?.getMatterCategories(obj);
      setCategories([{_id: 'all', name: 'All'}, ...result.data.categories]);
    } catch (error) {
      console.log('error', error);
    } finally {
    }
  };
  useEffect(() => {
    getCategories();
    fetchCardData(null);
  }, [fucus]);

  const fetchCardData = async id => {
    setCardData([]);
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (id) {
        var response = await fetch(
          `https://vakeelserver.barrana.io/api/client/matters?category_id=${
            id === 'all' ? '' : id
          }&limit=1000`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        var response = await fetch(
          `https://vakeelserver.barrana.io/api/client/matters?limit=1000`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }
      const result = await response.json();
      if (result?.responseCode == 200) {
        setCardData(result.data?.matters); // Assuming the API returns data in `result.data`
      } else {
        console.error('Failed to fetch data:', result.message);
      }
    } catch (error) {
      console.error('Error fetching card data:', error);
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
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1, padding: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <AppHeader navigation={navigation} title="Posted Matters" />

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
                    selectedCategory?._id === category?._id &&
                      styles.chipSelected,
                  ]}
                  onPress={() => {
                    setSelectedCategory(category);
                    fetchCardData(category._id);
                  }}>
                  <Text
                    style={[
                      styles.chipText,
                      selectedCategory?._id === category?._id &&
                        styles.chipTextSelected,
                    ]}>
                    {category?.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{paddingVertical: 10}}>
            {cardData.length === 0 ? (
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
              cardData?.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('MyMatters2', {
                      MatterDetails: item,
                      type: 'Lawyer',
                    });
                  }}
                  key={index}
                  style={[
                    styles.card,
                    {backgroundColor: item?.respond ? '#EBEAE8' : '#FFFFFF'},
                  ]}>
                  {item?.respond && (
                    <View style={styles?.dateView}>
                      <Text
                        style={{
                          color: '#fff',
                          textAlign: 'center',
                          fontSize: 12,
                        }}>
                        {'Responded'}
                      </Text>
                    </View>
                  )}
                  <View style={[styles.cardHeader, {flexDirection: 'row'}]}>
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
                    <View style={{width: '75%'}}>
                      <Text style={styles.cardTitle}>{item?.title}</Text>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          overflow: 'hidden',
                        }}>
                        <Text style={styles.cardCategory}>
                          {item?.category?.name + '/' + item?.subcategory?.name}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text
                    style={styles.cardDescription}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {item?.description}
                  </Text>
                  <View style={styles.cardFooter}>
                    <View style={{flexDirection: 'row'}}>
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#A9A9A9"
                      />
                      <Text style={styles.cardDate}>
                        {formatDate(item?.created_at)}
                      </Text>
                    </View>
                    <Text style={styles.cardResponses}>
                      {`${
                        item?.responded_lawyer ? item?.responded_lawyer : 0
                      } Lawyers Responded`}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          {/* <TouchableOpacity
            style={styles.submitButton}
            onPress={() => navigation.navigate('CreateMatter1')}>
            <Text style={styles.submitButtonText}>Post Your Matter</Text>
          </TouchableOpacity> */}
        </View>
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
    marginVertical: 15,
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
  },
  cardResponses: {
    fontSize: 12,
    color: '#5491C9',
  },
  submitButton: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    padding: 15,
    // width: '50%',
    height: 50,
    backgroundColor: '#0F5189',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    // marginTop: 20,
    marginBottom: 20,
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
});
