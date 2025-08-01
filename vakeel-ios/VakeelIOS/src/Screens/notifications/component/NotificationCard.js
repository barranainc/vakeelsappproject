import {StyleSheet, View, Image, Text, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';

import moment from 'moment';
const Width = Dimensions.get('window').width;

const NotificationCard = ({item,handlePress}) => {
  return (
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
                         <Ionicons
                           name="notifications-outline"
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
   
                     <View style={{width: '85%'}}>
                       <Text numberOfLines={1} style={styles.cardTitle}>
                         {item?.title}
                       </Text>
                       <View
                         style={{
                           width: '100%',
                           flexDirection: 'row',
                           justifyContent: 'flex-start',
                         }}>
                         {/* <Text style={styles.cardCategory}>{item?.type}</Text> */}
                       </View>
                       <View style={{flexDirection: 'row'}}>
                         <>
                           <Text
                             style={[styles.cardDescription,{ fontFamily: item?.is_seen?'Poppins-Regular':'Poppins-Bold'}]}
                             numberOfLines={2}
                             ellipsizeMode="tail">
                             {item?.content}
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
                               style={[styles.chatDate,{ fontFamily: item?.is_seen?'Poppins-Regular':'Poppins-Bold'}]}
                               numberOfLines={2}
                               ellipsizeMode="tail">
                               {moment(item?.updated_at).format('LT')}
                             </Text>
                           </View>
                         </>
                       </View>
                     </View>
                   </View>
                 </TouchableOpacity>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 6,
    marginHorizontal: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth:0.5,
    borderColor:'#747474',
    backgroundColor:'transparent'
  },
  txt: {
    fontSize: Width * 0.035,
    lineHeight: Width * 0.05,
    color: '#6F6F6F',
    fontFamily: 'Helvetica',
    maxWidth: Width * 0.54,
  },
  heading: {
    fontSize: Width * 0.0375,
    fontFamily: 'Helvetica-Bold',
    color: '#323B4B',
  },

  icon_view: {
    width: Width*0.3,
    height: Width*0.2,
    backgroundColor: '#DAF5DA',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
