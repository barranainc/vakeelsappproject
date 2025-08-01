import React from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
const {width} = Dimensions.get('window');

const AppHeader = ({navigation, title, progress, chat, onPress, profile,screen}) => {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 40,
      }}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => screen?navigation?.navigate(screen):navigation?.goBack()}
        style={{
          backgroundColor: '#1C5A9A',
          padding: 5,
          borderRadius: 10,
        }}>
        <Ionicons name="chevron-back-outline" size={20} color={'white'} />
      </TouchableOpacity>

      {/* Header Title */}

      {title && (
        <View style={{flex: 1, marginLeft: width * 0.04}}>
          <Text
            style={{
              fontSize: width * 0.06,
              fontFamily: 'Marathon-Serial Bold',
              color: '#1C5A9A',
            }}>
            {title}
          </Text>
        </View>
      )}
      {chat && (
        <TouchableOpacity
          onPress={onPress}
          style={{
            width: chat==='Matter'? width * 0.25:width * 0.30,
            height: width * 0.12,
            borderRadius: 20,
            backgroundColor: 'orange',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          {chat === 'Matter'||'Request' ? (
            <Ionicons name="newspaper-outline" size={20} color={'white'} />
          ) : (
            <Feather name="edit-2" size={20} color={'white'} />
          )}
          <Text style={{color: 'white', left: 4}}>{chat}</Text>
        </TouchableOpacity>
      )}
      {/* Progress Indicator */}

      {progress && (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'orange',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>{progress}</Text>
        </View>
      )}
    </View>
  );
};

export default AppHeader;
