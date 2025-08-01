import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ImageBackground,
  Image,
  BackHandler
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppImages } from '../../Utils/ImagesUrl';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import notifee from '@notifee/react-native';
import { apiCall } from '../../services/apiCall';
import SocketServices from '../../services/sockets/SocketServices';

const { width, height } = Dimensions.get('window');

const ClientHome = ({ navigation }) => {
  const [notificationCount, setNotificationCount] = useState(null);
    const [chatCount, setChatCount] = useState(0);
  const isFocus = useIsFocused()
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
       console.log('error', error);
     } finally {
     }
   };
  useEffect(()=>{
    getNotificationCount()
  },[isFocus])
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={AppImages?.Login_Bg}
        style={styles.background}
        imageStyle={{ flex: 1, resizeMode: 'cover' }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ alignItems: 'center', paddingVertical: width * 0.027 }}>
            <Image
              resizeMode="contain"
              source={AppImages?.VakeelLogoWithoutName}
              style={{ height: 45, width: 45 }}
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

        {/* Featured Text Section */}
        <View style={styles.featuredTextContainer}>
          <Text>
            <Text style={styles.featuredTextBold}>Professional</Text>
            <Text style={styles.featuredTextNormal}> &{'\n'}</Text>
            <Text style={styles.featuredTextNormal}>verified </Text>
            <Text style={styles.featuredTextBold}>{'Lawyers' + ' '}</Text>
            <Text style={styles.featuredTextNormal}>just{'\n'}</Text>
            <Text style={styles.featuredTextNormal}>a few clicks away</Text>
          </Text>
        </View>

        <View style={{ paddingHorizontal: width * 0.055, marginTop: width * 0.0138 }}>

          <View>
            <Text style={styles.headerTitle}>Legal Matters</Text>
            <Text style={styles.headerSubtitle}>
              Get free consultation on your legal matters
            </Text>
          </View>

        </View>



        {/* Content Section */}
        <View style={styles.uploadContainer1}>
          <TouchableOpacity
            onPress={() => { navigation.navigate('CreateMatter1') }}
            style={[styles.uploadBox1, { backgroundColor: '#5491C9' }]}
          >
            <View style={{ width: '40%', alignItems: 'center' }}>
              <Image
                resizeMode="contain"
                source={AppImages?.Post_Matter}
                style={{ height: width*0.1, width:  width*0.1 }}
              />
            </View>
            <View style={{ width: '60%', alignItems: 'flex-start' }}>
              <Text style={styles.actionText}>Post Your Matter</Text>

            </View>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => { navigation.navigate('MyMatters1') }}
            style={[styles.uploadBox1, { backgroundColor: 'white', borderColor: '#5491C9' }]}
          >
            <View style={{ width: '40%', alignItems: 'center' }}>
              <Image
                resizeMode="contain"
                source={AppImages?.My_Matters}
                style={{ height: width*0.1, width:  width*0.1 }}
              />
            </View>
            <View style={{ width: '60%', alignItems: 'flex-start', }}>
              <Text style={[styles.actionText, { color: '#404B53' }]}>My{'\n'}Matters</Text>

            </View>
          </TouchableOpacity>

        </View>


        <View style={{ paddingHorizontal: width * 0.055, marginTop: width * 0.027 }}>

          <View>
            <Text style={styles.headerTitle}>Paralegal Assistance</Text>
            <Text style={styles.headerSubtitle}>
              Get your legal/official documents e.g. Birth Certificate
            </Text>
          </View>

        </View>


        {/* Content Section */}
        <View style={styles.uploadContainer1}>
          <TouchableOpacity
            onPress={() => { navigation.navigate('AddRequest1') }}
            style={[styles.uploadBox1, { backgroundColor: '#EAA141' }]}
          >
            <View style={{ width: '40%', alignItems: 'center' }}>
              <Image
                resizeMode="contain"
                source={AppImages?.Post_Matter}
                style={{ height: width*0.1, width:  width*0.1 }}
              />
            </View>
            <View style={{ width: '60%', alignItems: 'flex-start', }}>
              <Text style={styles.actionText}>Post Your Request</Text>

            </View>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => { navigation.navigate('MyRequest1') }}
            style={[styles.uploadBox1, { backgroundColor: 'white', borderColor: '#EAA141' }]}
          >
            <View style={{ width: '40%', alignItems: 'center' }}>
              <Image
                resizeMode="contain"
                source={AppImages?.My_Matters}
                style={{ height: width*0.1, width:  width*0.1 }}
              />
            </View>
            <View style={{ width: '60%', alignItems: 'flex-start', }}>
              <Text style={[styles.actionText, { color: '#404B53' }]}>My{'\n'}Requests</Text>

            </View>
          </TouchableOpacity>

        </View>

        {/* Bottom Navigation */}
        {/* <View style={{ width: '100%', alignItems: 'center', position: 'absolute', bottom: width * 0.093 }}> */}
          <View style={styles.bottomNav}>
            <TouchableOpacity
              onPress={() => { navigation.navigate('ProfileDetails') }}
            >
              <Ionicons name="person-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.navHome}>
              <TouchableOpacity>
                <Image
                  resizeMode="contain"
                  source={AppImages?.Home_Icon}
                  style={{ height: 30, width: 30 }}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>{ navigation.navigate('Chat')}}>
              <View>
                <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
               {chatCount>0&& <View style={styles.notificationBadge}>
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
    flex: 1,
    width: '100%',
    height: height,
  },

  featuredTextContainer: {
    paddingHorizontal: width * 0.027,
    paddingVertical: width * 0.027,
    // backgroundColor: 'red', // Light gray background
    borderRadius: width * 0.022,
    marginHorizontal: width * 0.044,
    // marginVertical: width * 0.035,
    marginBottom: width * 0.035,
    // backgroundColor:'red'
    // alignItems: 'center',
  },
  featuredTextBold: {
    fontFamily: 'Marathon-Serial Bold',
    color: '#EAA141', // Orange color for 'Professional' and 'verified Lawyers'
    fontSize: width * 0.077, // Large text size
  },
  featuredTextNormal: {
    fontFamily: 'Marathon-Serial Bold',
    color: '#A4A9AE', // Gray color for the rest
    fontSize: width * 0.077, // Match the bold font size
  },
  uploadContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.055,
    paddingVertical: width * 0.027,
    marginBottom: width * 0.0138,
    // backgroundColor:'red'
  },
  uploadBox1: {
    width: '48%',
    paddingVertical: width * 0.051,
    // paddingHorizontal:10,
    // padding:15,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: width * 0.066,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionText: {
    fontSize: width * 0.038,
    fontFamily: 'Poppins-Regular',
    color: 'white',
    // textAlign: 'center',
    marginTop: width * 0.033,
  },
  bottomNav: {
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.083,
    alignItems: 'center',
    paddingVertical: width * 0.033,
    backgroundColor: '#337DBD',
    borderRadius: width * 0.069,
    elevation: 4,
    position:"absolute",
    bottom:width*0.07,
    alignSelf:"center"
  },
  navHome: {
    width: 70,
    height: 70,
    backgroundColor: '#EAA141',
    borderRadius: width * 0.097,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationBadge: {
    position: 'absolute',
    right: -width * 0.027,
    top: -width * 0.013,
    backgroundColor: '#EAA141',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: width * 0.027,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: width * 0.083,
    paddingHorizontal: width * 0.055,
  },
  headerTitle: {
    fontSize: width * 0.050,
    fontFamily: 'Marathon-Serial Bold',
    // fontWeight: '700',
    color: '#404B53',
  },
  headerSubtitle: {
    fontSize: width * 0.030,
    color: '#A4A9AE',
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
});

export default ClientHome;
