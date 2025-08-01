import React, {useState, useEffect, useMemo} from 'react';
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
import {SafeAreaView} from 'react-native-safe-area-context';
import {enviroment} from '../../environment';
import {Apis} from '../../services/Endpoints';

const {width} = Dimensions.get('window');

export default function MyRequest1({navigation}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Judicial', 'Non-Judicial'];

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(
          `${enviroment?.API_URL}${Apis?.getRequest}?page=1&limit=10&request_type`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const result = await response.json();
        console.log('result---->', result?.data);
        if (result?.responseCode == 200) {
          setApiData(result?.data?.requests);
        } else {
          console.error('Failed to fetch data:', result.message);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching API:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation?.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
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
        <AppHeader navigation={navigation} title="My Requests" />

        <View style={styles.container}>
          <View style={{paddingVertical: 10, marginBottom: 10}}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryContainer}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.chip,
                    selectedCategory === category && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedCategory(category)}>
                  <Text
                    style={[
                      styles.chipText,
                      selectedCategory === category && styles.chipTextSelected,
                    ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#1C5A9A" />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{paddingVertical: 10}}>
              {apiData
                ?.filter(item =>
                  selectedCategory === 'All'
                    ? true
                    : item?.request_type ===
                      selectedCategory?.replace('-', '_')?.toLowerCase(),
                )
                .map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('MyRequest2', {MatterDetails: item});
                    }}
                    key={index}
                    style={styles.card}>
                    <View style={[styles.cardHeader, {flexDirection: 'row'}]}>
                      <View
                        style={{
                          width: '20%',
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
                            style={{height: 30, width: 30}}
                          />
                        </View>
                      </View>

                      <View style={{width: '80%', marginLeft: 3}}>
                        <Text style={styles.cardTitle}>{item?.title}</Text>
                        <Text style={styles.cardCategory}>
                          {item?.request_type
                            ?.replace('_', ' ')
                            ?.split(' ') // Split the string into an array of words
                            ?.map(
                              word =>
                                word?.charAt(0)?.toUpperCase() +
                                word?.slice(1)?.toLowerCase(),
                            ) // Capitalize the first letter and make the rest lowercase
                            ?.join(' ')}
                        </Text>
                      </View>
                    </View>

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
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="ellipse" size={8} color="#2ECD53" />
                        <Text style={styles.cardResponses}>
                          {'In Progress'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => navigation.navigate('AddRequest1')}>
            <Text style={styles.submitButtonText}>Create Request</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#1C5A9A',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#1C5A9A',
  },
  cardCategory: {
    fontSize: 11,
    color: '#EAA141',
    fontFamily: 'Poppins-Regular',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#1C5A9A',
    borderTopWidth: 0.3,
    paddingTop: 5,
    marginTop: 10,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 3,
  },
  cardResponses: {
    fontSize: 12,
    color: '#5491C9',
    marginLeft: 3,
  },
  submitButton: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    padding: 15,
    height: 50,
    backgroundColor: '#0F5189',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});
