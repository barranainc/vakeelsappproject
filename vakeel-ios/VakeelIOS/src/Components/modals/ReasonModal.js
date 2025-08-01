import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { apiCall } from '../../services/apiCall';
import { useNavigation } from '@react-navigation/native';
import { showToast } from '../../helpers';

const ReasonModal = ({visible, onCancel,detail}) => {
  const [reason, setReason] = useState('');
  const [loader, setLoader] = useState(false);
  const navigation = useNavigation()
  const onSubmit = async () => {
    if(reason){
    try {
      setLoader(true);
      let result = await apiCall?.updateMatterStatus({id:detail?._id, is_interested:false,reason:reason});
       onCancel()
       navigation?.goBack()
       } catch (error) {
      console.log("error",error)
      showToast('error', error ? error : 'Something went wrong');
    } finally {
      setLoader(false);
    }
  }else{
    showToast("error",'Please give reason')
  }
  };
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Reason</Text>

          <TextInput
            style={styles.input}
            multiline
            placeholder="Please explain why you are not interested"
            value={reason}
            onChangeText={setReason}
          />

          <TouchableOpacity
            style={styles.submitButton}
            disabled={loader?true:false}
            onPress={() => {
              onSubmit(reason);
            }}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              onCancel();
              setReason('');
            }}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 100,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
    backgroundColor: '#FFF',
    fontFamily: 'Poppins-Regular',
    color: '#000',
    // textAlignVertical:"top"
  },
  submitButton: {
    backgroundColor: '#F5A623', // Orange
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#4A90E2', // Blue
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  cancelText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default ReasonModal;
