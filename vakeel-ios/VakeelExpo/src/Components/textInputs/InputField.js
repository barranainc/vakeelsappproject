import {StyleSheet, View, Text, TextInput} from 'react-native';
import React, {useState} from 'react';
import {Controller} from 'react-hook-form';
import {Dimensions} from 'react-native';
import Eye from 'react-native-vector-icons/Feather';
const Width = Dimensions.get('window').width;
const InputField = ({
  icon,
  placeholder,
  secureTextEntry,
  control,
  name,
  numpad,
  rules = {},
  value,
  disable,
  isMultiple,
}) => {
  const [hidePass, setHidePass] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  return (
    <>
      {control ? (
        <Controller
          control={control}
          rules={rules}
          render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
            <>
              <View
                style={[
                  styles?.container,
                  {
                    height:isMultiple?150:55,
                    borderColor: isFocused ? '#0C6135' : '#c2c2c2',
                    alignItems:!isMultiple&&"center"
                  },
                ]}>
                <TextInput
                  onFocus={handleFocus}
                  placeholderTextColor={'#747474'}
                  secureTextEntry={secureTextEntry && hidePass ? true : false}
                  style={[styles.input,{textAlignVertical:isMultiple&&'top'}]}
                  onChangeText={onChange}
                  value={value}
                  placeholder={placeholder}
                  onBlur={handleBlur}
                  keyboardType={numpad && 'number-pad'}
                  multiline={isMultiple ? true : false}
                  numberOfLines={isMultiple && 6}
                  editable={disable ? false : true}
                />
                {secureTextEntry && (
                  <Eye
                    style={{ color: '#747474'}}
                    name={!hidePass ? 'eye' : 'eye-off'}
                    size={16}
                    onPress={() => setHidePass(!hidePass)}
                  />
                )}
              </View>
              {error && (
                <Text style={[styles?.error, {color: 'red'}]}>
                  {error?.message}
                </Text>
              )}
            </>
          )}
          name={name}
        />
      ) : (
        <View
          style={[styles?.container, {backgroundColor: disable && '#f4f4f4'}]}>
          <TextInput
            placeholderTextColor="#000"
            secureTextEntry={secureTextEntry && hidePass ? true : false}
            style={[styles.input, {fontSize: isMultiple ? 11 : 14}]}
            value={value}
            placeholder={placeholder}
            keyboardType={numpad && 'number-pad'}
            editable={disable ? false : true}
            multiline={true}
          />
         
        </View>
      )}
    </>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: Width * 0.04,
  },
  input: {
    width: '97%',
    fontSize: 14,
    backgroundColor: '#FFF',
    fontFamily: 'Poppins-Regular',
    color:'#000',
    // textAlignVertical:"top"
  },
  error: {
    paddingHorizontal: 15,
    fontSize: Width * 0.03,
    color: 'red',
    fontFamily: 'Poppins-Regular',
    bottom: Width * 0.02,
  },
});
