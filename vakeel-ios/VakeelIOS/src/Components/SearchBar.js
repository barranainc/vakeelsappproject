import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import Fontisto from 'react-native-vector-icons/Fontisto';
const {width, height} = Dimensions.get('window');
const SearchBar = ({
  onPress,
  placeholder,
  value,
  onChangeText,
  onBlur,
  func,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = _.debounce(term => {
    // Perform the actual search operation here
    func(term);
    // You can trigger an API call or any other operation with the debounced term
  }, 1000); // 1000 milliseconds (1 second) debounce time

  const handleInputChange = text => {
    setSearchTerm(text);
    debouncedSearch(text); // This will trigger the debounced function after 1 second
  };
  return (
    <View style={styles?.container}>
     
      
     
      <TextInput
        style={{color: '#000', flex: 1}}
        onChangeText={handleInputChange}
        value={value}
        placeholder={placeholder}
        onBlur={onBlur}
        placeholderTextColor={'#747474'}
        // editable={false}
      />
        <Fontisto name="search" size={width * 0.06} color={'#c2c2c2'} />
    </View>
  );
};
export default SearchBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        width: '100%',
        height: 55,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 18,
        paddingHorizontal: 15,
        marginBottom: width * 0.04,
      },
  input: {
    width: '97%',
    fontSize: 14,
    backgroundColor: '#FFF',
    fontFamily: 'Poppins-Regular',
    color:'#000',
    // textAlignVertical:"top"
  },
});
