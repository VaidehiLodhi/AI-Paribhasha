import { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

export default function OTPInput({ onComplete }: { onComplete?: (otp: string) => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return; // block paste of multiple chars

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // move to next
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // fire onComplete when all filled
    if (newOtp.every(d => d !== '')) {
      onComplete?.(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus(); // go back on backspace
    }
  };

  return (
    <View style={styles.row}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref => { inputs.current[index] = ref; }}
          style={styles.box}
          value={digit}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          textContentType="oneTimeCode" // iOS autofill from SMS
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  box: {
    width: 38,
    height: 45,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FF6E51',
    backgroundColor: 'rgba(255, 110, 81, 0.2)',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'PelikanMedium',
    color: '#000000',
  },
});