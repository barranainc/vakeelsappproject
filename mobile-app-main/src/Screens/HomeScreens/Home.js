import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppImages} from '../../Utils/ImagesUrl';
import {showToast} from '../../helpers';
import {apiCall} from '../../services/apiCall';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {AndroidImportance, AndroidVisibility} from '@notifee/react-native';
import notifee from '@notifee/react-native';
import { useIsFocused } from '@react-navigation/native';
import SocketServices from '../../services/sockets/SocketServices';
const {width, height} = Dimensions.get('window');

const Home = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [matter, setMatter] = useState([]);
  const Isfocus = useIsFocused()
  const [notificationCount, setNotificationCount] = useState(null);
  const [chatCount, setChatCount] = useState(0);
  const renderPostedMatter = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        // navigation?.navigate('LawyerPostedMatter');
        navigation.navigate('MyMatters2', {MatterDetails: item,type:'Lawyer'})
      }}
      style={styles.matterCard}>
      {/* Left Content */}
      <View style={{flex:0.8}}>
        <Text numberOfLines={1} style={styles.matterTitle}>{item.title}</Text>
        <Text
          style={
            styles.matterType
          }>{`${item?.category?.name} - ${item?.subcategory?.name}`}</Text>
      </View>
      {/* Right Content */}
      <View style={styles.matterDateContainer}>
        <Ionicons name="calendar-outline" size={16} color="#A9A9A9" />
        <Text style={styles.matterDate}>
          {moment(item.created_at).format('DD-MM-YYYY')}
        </Text>
      </View>
    </TouchableOpacity>
  );
  async function onDisplayNotification(remoteMessage) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'galaxy',
      name: 'galaxy',
      sound: 'default',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
    });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,

      ios: {
        sound: 'default',
        criticalVolume: 1.0,
        critical: true,
      },
      android: {
        channelId,
        visibility: AndroidVisibility.PUBLIC,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });
  }
  useEffect(() => {
    // Handler for messages received while the app is in the foreground
    const foregroundNotification = messaging().onMessage(async (remoteMessage) => {
      console.log('Message received in the foreground!', remoteMessage);
      
      // // Get roomId from the notification data
      // var roomId = remoteMessage != null ? JSON.parse(remoteMessage?.data?.obj) : null;
      // roomId=JSON.parse(roomId)
      // if (roomId) {
      //   try {
      //     SocketServices.connect('connect', () => {});
      //       navigation.navigate('IndividualChat', { id: roomId?.room_id });
         
      //   } catch (e) {
      //     console.error('Error during foreground notification handling:', e);
      //   }
      // }
     
      await onDisplayNotification(remoteMessage);
      getNotificationCount();
    });

    // Handler for messages received while the app is in the background or killed
    const backgroundMessageHandler = messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Notification caused app to open from background state:', remoteMessage);

      var roomId = remoteMessage != null ? JSON.parse(remoteMessage?.data?.obj) : null;
      roomId=JSON.parse(roomId)
      if (roomId) {
        try {
          SocketServices.connect('connect', () => {});
        
            navigation.navigate('IndividualChat', { id: roomId?.room_id });
         
        } catch (e) {
          console.error('Error during background notification handling:', e);
        }
      }

      await onDisplayNotification(remoteMessage);
    });

    // Handler for when a notification opens the app from the background
    const openedNotification = messaging().onNotificationOpenedApp(async (remoteMessage) => {

      const roomId = remoteMessage?.data?.obj ? JSON.parse(remoteMessage?.data?.obj) : null;

      if (roomId) {
        try {
          SocketServices.connect('connect', () => {});
        
            navigation.navigate('IndividualChat', { id: roomId?.room_id });
  
        } catch (e) {
          console.error('Error during opened notification handling:', e);
        }
      }

      await onDisplayNotification(remoteMessage);
      getNotificationCount();
    });

    // Handler for when the app is launched from a terminated state (via notification)
    messaging().getInitialNotification().then(async (remoteMessage) => {
      if (remoteMessage) {
        console.log('App was opened from a terminated state via notification:', remoteMessage);
        var roomId = remoteMessage != null ? JSON.parse(remoteMessage?.data?.obj) : null;
      roomId=JSON.parse(roomId)
        if (roomId) {
          try {
            SocketServices.connect('connect', () => {});
      
              navigation.navigate('IndividualChat', { id: roomId?.room_id });
      
          } catch (e) {
            console.error('Error handling initial notification:', e);
          }
        }

        await onDisplayNotification(remoteMessage);
        getNotificationCount();
      }
    });
 // App launched from terminated state (via notification)
 messaging().getInitialNotification().then(async (remoteMessage) => {
  if (remoteMessage) {
    console.log('App was opened from a terminated state via notification:', remoteMessage);

    await onDisplayNotification(remoteMessage);
    getNotificationCount();

    var roomId = remoteMessage != null ? JSON.parse(remoteMessage?.data?.obj) : null;
    roomId=JSON.parse(roomId)
      if (roomId) {
        try {
          SocketServices.connect('connect', () => {});
    
            navigation.navigate('IndividualChat', { id: roomId?.room_id });
    
        } catch (e) {
          console.error('Error handling initial notification:', e);
        }
      }
  }
});
    // Cleanup listeners on component unmount
    return () => {
      foregroundNotification();
      backgroundMessageHandler();
      openedNotification();
    };
  }, [navigation]);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(
          'https://vakeelserver.barrana.io/api/client/matters?limit=4',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const result = await response.json();
        setMatter(result?.data?.matters);
        if (result?.responseCode == 200) {
        } else {
          console.error('Failed to fetch data:', result.message);
        }
        setLoader(false);
      } catch (error) {
        console.error('Error fetching API:', error);
        setLoader(false);
      }
    };
    fetchData();
    getNotificationCount();
  }, [Isfocus]);
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  const getNotificationCount = async () => {
    try {
      let result = await apiCall?.getNotificationCont();
      let chatCount = await apiCall?.getChatCount();
      setNotificationCount(result?.data?.count);
      setChatCount(chatCount?.data?.count)
    } catch (error) {
      showToast('error', error ? error : 'Something went wrong');
      console.log('error', error);
    } finally {
    }
  };
  // const fetchMatters = async () => {
  //   let obj = {
  //     limit:1000
  //   };
  //   try {
  //     setLoader(true);
  //     let result = await apiCall?.getMetters();
  //     console.log("result",result)
  //     // showToast('success', result?.message);
  //   } catch (error) {
  //     showToast('error', error ? error : 'Something went wrong');
  //     console.log('error', error);
  //   } finally {
  //     setLoader(false);
  //   }
  // };
  // useEffect(()=>{
  //   fetchMatters()
  // },[]);
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={styles.background}
        imageStyle={{flex: 1, resizeMode: 'cover'}}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{alignItems: 'center', paddingVertical: 10}}>
            <Image
              resizeMode="contain"
              source={AppImages?.VakeelLogoWithoutName}
              style={{height: 45, width: 45}}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation?.navigate('Notifications');
            }}
            style={{alignItems: 'center', paddingVertical: 10}}>
            {notificationCount > 0 ? (
              <Image
                resizeMode="contain"
                source={AppImages?.Notification_Icon}
                style={{height: 30, width: 30}}
              />
            ) : (
              <Ionicons
                name="notifications-outline"
                size={width * 0.08}
                color="#1C5A9A"
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Posted Matters</Text>
            <Text style={styles.headerSubtitle}>
              Matters posted by clients seeking legal consultation
            </Text>
          </View>
        </View>

        {/* List of Posted Matters */}
        <View
          style={{
            height: matter?.length > 3 ? '50%' : '45%',
            justifyContent: 'center',
          }}>
          {loader ? (
            <View style={styles.uploadDocBox}>
              <ActivityIndicator size="large" color={'#EAA141'} />
            </View>
          ) : (
            <>
              <FlatList
                data={matter}
                keyExtractor={item => item.id}
                renderItem={renderPostedMatter}
                contentContainerStyle={styles.list}
                // ListFooterComponent={}
              />
              <TouchableOpacity
                onPress={() => {
                  navigation?.navigate('LawyerPostedMatter');
                }}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.uploadContainer1}>
          <TouchableOpacity
            // key={index}
            style={[styles.uploadBox1, {backgroundColor: '#5491C9'}]}
            onPress={() => navigation.navigate('GetAllCases')}>
            <Image
              resizeMode="contain"
              source={AppImages?.Cases_Management}
              style={{height: 30, width: 30}}
            />
            <Text style={styles.actionText}>Cases Management</Text>
          </TouchableOpacity>
          <TouchableOpacity
            // key={index}
            style={[styles.uploadBox1, {backgroundColor: '#EAA141'}]}
            onPress={() => navigation.navigate('DairyManagement')}>
            <Image
              resizeMode="contain"
              source={AppImages?.Diary_Management}
              style={{height: 30, width: 30}}
            />
            <Text style={styles.actionText}>Diary Management</Text>
          </TouchableOpacity>
          <TouchableOpacity
            // key={index}
            style={[styles.uploadBox1, {backgroundColor: '#0F5189'}]}
            onPress={() => navigation.navigate('Teams')}>
            <Image
              resizeMode="contain"
              source={AppImages?.Team_Management}
              style={{height: 30, width: 30}}
            />
            <Text style={styles.actionText}>Team Management</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="folder-outline" size={28} color="#1C5A9A" />
            <Text style={styles.actionText}>Cases Management</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.highlightButton]}>
            <Ionicons name="book-outline" size={28} color="#FFA500" />
            <Text style={[styles.actionText, styles.highlightText]}>
              Diary Management
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="people-outline" size={28} color="#1C5A9A" />
            <Text style={styles.actionText}>Team Management</Text>
          </TouchableOpacity>
        </View> */}

        {/* Bottom Navigation */}

        {/* <View
          style={{width: '100%', alignItems: 'center', paddingVertical: 30}}> */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LawyerProfile');
            }}>
            <Ionicons name="person-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.navHome}>
            <TouchableOpacity>
              <Image
                resizeMode="contain"
                source={AppImages?.Home_Icon}
                style={{height: 30, width: 30}}
              />
              {/* <Ionicons name="home-outline" size={28} color="#FFFFFF" /> */}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Chat');
            }}>
              
            <View>
              <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
              {chatCount>0&&<View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{chatCount>0?chatCount:0}</Text>
              </View>}
            </View>
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  background: {
    width: '100%',
    height: height,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Marathon-Serial Bold',
    // fontWeight: '700',
    color: '#404B53',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#A4A9AE',
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
  },
  matterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  matterTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#2669A9',
  },
  matterType: {
    fontSize: 10,
    color: '#EAA141',
    fontFamily: 'Poppins-Regular',
    // marginTop: 4,
  },
  matterDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex:0.3
  },
  matterDate: {
    fontSize: 12,
    color: '#58595A',
    marginLeft: 6,
  },
  viewAll: {
    textAlign: 'center',
    color: '#5491C9',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginVertical: 14,
    textDecorationLine: 'underline',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  highlightButton: {
    backgroundColor: '#FFF4E6',
    borderRadius: 12,
    padding: 16,
  },
  actionText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: 'white',
    textAlign: 'center',
    marginTop: 12,
  },
  highlightText: {
    color: '#FFA500',
  },

  uploadContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 5,
    // backgroundColor:'red'
  },
  uploadBox1: {
    // width: width * 0.26,
    // height: 100,
    width: 100,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomNav: {
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#337DBD',
    borderRadius: 25,
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: -4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    elevation: 4,
    position: 'absolute',
    bottom: width * 0.07,
    alignSelf: 'center',
  },
  navHome: {
    width: 70,
    height: 70,
    backgroundColor: '#EAA141',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: '50%',
    // marginTop: -10, // Center Button Elevated
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12,
  },
  notificationBadge: {
    position: 'absolute',
    right: -10,
    top: -5,
    backgroundColor: '#EAA141',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Home;
