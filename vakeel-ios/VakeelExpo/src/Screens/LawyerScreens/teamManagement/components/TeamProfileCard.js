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
import React from 'react';
import {AppImages} from '../../../../Utils/ImagesUrl';
import {enviroment} from '../../../../environment';
const {width} = Dimensions.get('window');
const TeamProfileCard = ({onPress, item}) => {
  console.log(enviroment?.API_URL + `${item?.picture}`);
  return (
    <TouchableOpacity
      onPress={() => {
       onPress(item);
      }}
      style={styles.card}>
      <View style={[styles.cardHeader, {flexDirection: 'row', marginTop: 16}]}>
        <View
          style={{
            width: '25%',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#c2c2c2',
              borderRadius: 50,
              alignItems: 'center',
              justifyContent:"center",
              padding: 10,
              height: width*0.18, width: width*0.18,
              overflow:"hidden"
            }}>
            <Image
              resizeMode="cover"
              source={
                item?.picture
                  ? {uri: enviroment?.API_URL + item.picture}
                  : AppImages?.Post_Matter
              }
              style={{ height: width*0.18, width: width*0.18}}
            />
          </View>
        </View>

        <View style={{width: '80%'}}>
          <Text numberOfLines={1} style={styles.cardTitle}>
            {item?.first_name + ' ' + item?.last_name}
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <Text style={styles.cardCategory}>{item?.user_type}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TeamProfileCard;
const styles = StyleSheet.create({
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

  innerTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
