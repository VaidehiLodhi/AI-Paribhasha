// components/login-components/custom-input.tsx
import { TextInput, StyleSheet, View } from 'react-native';

interface CustomInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  width = 251,
  height = 45,
  backgroundColor = 'rgba(255, 110, 81, 0.2)',
  borderColor = '#FF6E51',
  textColor = '#000000',
  keyboardType = 'default',
}: CustomInputProps) {
  return (
    <View style={[styles.container, { width, height, backgroundColor, borderColor }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(0,0,0,0.35)"
        keyboardType={keyboardType}
        style={[styles.input, { color: textColor }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    fontFamily: 'PelikanRegular',
    fontSize: 14,
    textAlign: 'center',
    padding: 0,   // removes default Android padding
  },
});