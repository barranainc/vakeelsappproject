import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Fontisto';
import {Dimensions} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Controller} from 'react-hook-form';
import moment from 'moment';

const Width = Dimensions.get('window').width;
const DatePicker = ({
  icon,
  placeholder,
  date,
  setDate,
  control,
  name,
  rules,
  isMin,
  isMax,
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisibility(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const lastDayOfCurrentMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  );
  return (
    // <>
    // <Controller
    //   control={control}
    //   rules={rules}
    //   render={({field: {onChange, value}, fieldState: {error}}) => (
    <>
      <TouchableOpacity onPress={showDatePicker} style={styles?.container}>
        <Text style={styles.input}>
          {date ? moment(date).format('D-MMM-YYYY') : 'DD/MM/YY'}
        </Text>
        <Icon
          style={{paddingEnd: 10}}
          name={'date'}
          size={16}
          color={'#747474'}
          // onPress={showDatePicker}
        />
      </TouchableOpacity>
      {isDatePickerVisible === true && (
        <DateTimePicker
          minimumDate={isMin ? null : new Date()}
          value={date}
          mode="date" // Change to 'time' for time picker
          is24Hour={true}
          display="default"
          onChange={onChange}
          maximumDate={isMax ? lastDayOfCurrentMonth : null}
        />
      )}
      {/* {error && (
            <Text style={[styles?.error_msg, {color: 'red'}]}>
              {error?.message}
            </Text>
          )}
        </>
//       )}
//       name={name}
//     /> */}
    </>
  );
};

export default DatePicker;

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
    marginBottom: Width * 0.04,
  },
  input: {
    width: '97%',
    fontSize: 14,
    backgroundColor: '#FFF',
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
  error_msg: {
    fontSize: Width * 0.03,
    paddingVertical: 8,
    fontFamily: 'Helvetica',
  },
});
