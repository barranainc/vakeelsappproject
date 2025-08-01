import React, {useEffect, useMemo, useRef, useState} from 'react';
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppImages} from '../../../Utils/ImagesUrl';
import {apiCall} from '../../../services/apiCall';
import {getDataLocally, showToast} from '../../../helpers';
import AppHeader from '../../../Components/AppHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import TeamProfileCard from './components/TeamProfileCard';

const {width} = Dimensions.get('window');

const Teams = ({navigation}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState([]);
  const [filteredTeam, setFilteredTeam] = useState([]);  
  const animatedWidth = useRef(new Animated.Value(width * 0.5)).current;
  const categories = ['All', 'Associate', 'Paralegal', 'Student'];
  const handlePress = item => {
    navigation.navigate('TeamMemberDetails', {details: item});
  };
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
  useEffect(() => {
    getTeam();
  }, []);

  const getTeam = async () => {
    const test = await getDataLocally();
    let obj = {
      limit: 1000,
    };
    try {
      let result = await apiCall?.getAllTeams(obj);
      console.log('result', result);
      setTeam(result?.data?.users);
      //   setCategories(result?.data?.categories);
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
      console.log('error', error);
    } finally {
    }
  };
  useMemo(() => {
    if (selectedCategory === 'All') {
      setFilteredTeam(team);  // Reset to original data
    } else {
      const filtered = team.filter((item) => 
        item.user_type === selectedCategory.toLowerCase()
      );
      setFilteredTeam(filtered);
    }
  }, [selectedCategory, team]);
  if (loading) {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#2669A9" />
      </SafeAreaView>
    );
  }
    useEffect(() => {
      const backAction = () => {
        navigation?.navigate("Home");
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1, padding: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <AppHeader screen={"Home"} navigation={navigation} title="Team Management" />

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

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{paddingVertical: 10}}>
            {team.length === 0 ? (
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
              filteredTeam?.map((item, index) => (
                <TeamProfileCard onPress={handlePress} item={item} />
              ))
            )}
          </ScrollView>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => navigation.navigate('AddTeam1')}>
            <Text style={styles.submitButtonText}>Add New User</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default Teams;
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
    color: '#2669A9',
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
    height: 50,
    backgroundColor: '#EAA141',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.05,
    marginBottom: 20,
    paddingHorizontal: width * 0.1,
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
