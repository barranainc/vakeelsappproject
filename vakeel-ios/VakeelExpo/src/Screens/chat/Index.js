import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  BackHandler,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppHeader from '../../Components/AppHeader';
import {AppImages} from '../../Utils/ImagesUrl';
import {apiCall} from '../../services/apiCall';
import SocketServices from '../../services/sockets/SocketServices';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getDataLocally} from '../../helpers';
import {useIsFocused} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
const {width} = Dimensions.get('window');

const Chat = ({navigation}) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [getLocalData, setGetLocalData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('client_matter');
  const [refreshing, setRefreshing] = useState(false);
  const focus = useIsFocused();
  const categories = [
    {label: 'Matters', value: 'client_matter'},
    {label: 'Paralegal Requests', value: 'client_request'},
  ];

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
  const getAllChats = async category => {
    // setChats([]);
    const localStorageData = await getDataLocally();
    setGetLocalData(localStorageData);
    let obj = {
      type: category,
    };
    try {
      setLoading(true);
      let result = await apiCall?.getAllChats(obj);
      setChats(result?.data?.chats);
    } catch (error) {
      console.log('error', error ? error : 'Something went wrong');
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllChats(selectedCategory);
  }, [focus]);
  const handlePress = async item => {
    const getLocalData = await getDataLocally();
    try {
      SocketServices.connect('connect', () => {});
      setTimeout(() => {
        navigation.navigate('IndividualChat', {
          id: item.room_details?._id,
          details: item,
          type:selectedCategory
        });
      }, 500);
    } catch (e) {}
  };
  //   // Handler for messages received while the app is in the foreground
  //   const foregroundNotification = messaging().onMessage(
  //     async remoteMessage => {
  //       getAllChats();
  //     },
  //   );

  //   // Handler for messages received while the app is in the background or killed
  //   messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     getAllChats();
  //   });

  //   // Handler for when a notification opens the app from the background
  //   const opened = messaging().onNotificationOpenedApp(async remoteMessage => {
  //     getAllChats();
  //   });

  //   // Clean up listeners on component unmount
  //   return () => {
  //     foregroundNotification();
  //     opened();
  //   };
  // }, []);
  const onRefresh = () => {
    getAllChats(selectedCategory);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }
    useEffect(() => {
      // Handler for messages received while the app is in the foreground
      const foregroundNotification = messaging().onMessage(async (remoteMessage) => {
        console.log('Message received in the foreground!', remoteMessage);
        getAllChats(selectedCategory);
      });
  
      // Cleanup listeners on component unmount
      return () => {
        foregroundNotification();
      };
    }, [navigation]);
    console.log("chats",getLocalData)
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={{flex: 1, padding: 1}}
        imageStyle={{resizeMode: 'cover'}}>
        <AppHeader navigation={navigation} title="Messages" />
        <View style={{height: width * 0.1}} />
        <ScrollView
         refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
         }
          style={{flex: 1}}
          contentContainerStyle={[
            styles?.contentContainer,
            {flex: chats.length === 0 && 1},
          ]}
          showsVerticalScrollIndicator={false}>
          <View style={{paddingVertical: 10, marginBottom: 10}}>
            {getLocalData?.user_type !== 'lawyer' && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryContainer}>
                {categories?.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.chip,
                      selectedCategory === category?.value &&
                        styles.chipSelected,
                    ]}
                    onPress={() => {
                      getAllChats(category?.value);
                      setSelectedCategory(category?.value);
                    }}>
                    <Text
                      style={[
                        styles.chipText,
                        selectedCategory === category?.value &&
                          styles.chipTextSelected,
                      ]}>
                      {category?.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {chats.length === 0 ? (
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
            chats?.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  handlePress(item);
                }}
                key={index}
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
                      <Ionicons
                        name="chatbubble-outline"
                        size={30}
                        color={'white'}
                      />
                      {/* <Image
                        resizeMode="contain"
                        // source={AppImages?.logo}
                        style={{height: 40, width: 40}}
                      /> */}
                    </View>
                  </View>

                  <View style={{width: '80%'}}>
                    <Text numberOfLines={1} style={styles.cardTitle}>
                      {/* {item?.client_details?.first_name +
                        ' ' +
                        item?.client_details?.last_name} */}
                      {getLocalData?.user_type === 'client'
                        ? item?.requester_details?.first_name +
                          ' ' +
                          item?.requester_details?.last_name
                        : item?.client_details?.first_name +
                          ' ' +
                          item?.client_details?.last_name}
                    </Text>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                      }}>
                      <Text style={styles.cardCategory}>
                        {item?.client_matter_details?.map(
                          matter => matter.title + ' ',
                        )}
                        {item?.client_request_details?.map(
                          request => request?.title + ' ',
                        )}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <>
                        <Text
                          style={[
                            styles.cardDescription,
                            {
                              fontFamily: (item?.last_chat?.is_seen||item?.last_chat?.sender_id==getLocalData?._id)
                                ? 'Poppins-Regular'
                                : 'Poppins-Bold',
                            },
                          ]}
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          {item?.last_chat?.message}
                        </Text>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 0.2,
                          }}>
                          {item?.unread_count > 0 && (
                            <View style={styles.countView}>
                              <Text
                                style={styles.count}
                                numberOfLines={2}
                                ellipsizeMode="tail">
                                {item?.unread_count}
                              </Text>
                            </View>
                          )}
                          <Text
                            style={[
                              styles.chatDate,
                              {
                                fontFamily: item?.last_chat?.is_seen
                                  ? 'Poppins-Regular'
                                  : 'Poppins-Bold',
                              },
                            ]}
                            numberOfLines={2}
                            ellipsizeMode="tail">
                            {moment(item?.last_chat?.created_at).format('LT')}
                          </Text>
                        </View>
                      </>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default Chat;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
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
    backgroundColor: '#5491C9',
  },
  chipText: {
    fontSize: 14,
    color: '#337DBD',
  },
  chipTextSelected: {
    color: '#FFF',
  },
  card: {
    borderBottomWidth: 1,
    borderColor: '#c2c2c2',
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
    flex: 0.8,
  },
  chatDate: {
    fontSize: 12,
    color: '#777',
    fontFamily: 'Poppins-Regular',
    marginVertical: 8,
  },
  count: {
    fontSize: 10,
    color: '#fff',
    // fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  countView: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: width * 0.06,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
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
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: width * 0.08,
    borderTopStartRadius: width * 0.12,
    borderTopEndRadius: width * 0.12,
    backgroundColor: '#fff',
  },
});
