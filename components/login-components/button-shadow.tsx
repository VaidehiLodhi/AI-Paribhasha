import { Pressable, Text, StyleSheet, View } from 'react-native';

interface OTPButtonProps {
  label: string;
  onPress: () => void;
  width?: number | `${number}%`;
  height?: number;
  backgroundColor?: string;
  shadowColor?: string;
  textColor?: string;
}

export default function Button({
  label,
  onPress,
  width = 253,
  height = 44,
  backgroundColor = '#E4CFFF',
  shadowColor = '#9E42DF',
  textColor = '#000000',
}: OTPButtonProps) {
  return (
    <View style={{ width, height: height + 4 }}>
      
      {/* fake shadow — sits behind, offset by 4px */}
      <View style={[styles.shadow, {
        width,
        height,
        backgroundColor: shadowColor,
      }]} />

      {/* actual button */}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            width,
            height,
            backgroundColor,
            transform: pressed
              ? [{ translateX: 4 }, { translateY: 4 }]  // press into shadow
              : [{ translateX: 0 }, { translateY: 0 }],
          },
        ]}
      >
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    top: 4,       // offset down
    left: 4,      // offset right
    borderRadius: 10,
  },
  button: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'PelikanMedium',
    fontSize: 16,
  },
});