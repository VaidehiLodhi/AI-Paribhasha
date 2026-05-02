import {Text, View, Image, StyleSheet, Keyboard, Platform, KeyboardEvent, Dimensions } from 'react-native';
import TypewriterText from '@/components/login-components/typewriter-text';
import TrapeziumShape from '@/components/login-components/trapezium';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, withSequence, withRepeat } from 'react-native-reanimated';
import { AnimatedImage } from '@/components/login-components/animated-image';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '@/components/login-components/button-shadow';
import CustomInput from '@/components/login-components/custom-input';
import { router } from 'expo-router';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const OVERLAY_TOP_FROM_SCREEN = 500;
const OVERLAY_CONTENT_HEIGHT = 250; 
const OVERLAY_BOTTOM_FROM_SCREEN = OVERLAY_TOP_FROM_SCREEN + OVERLAY_CONTENT_HEIGHT;

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [inputError, setInputError] = useState(false);

  const overlayBottom = useSharedValue(0);
  const shakeX = useSharedValue(0);

  const overlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -overlayBottom.value }],
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const triggerShake = () => {
    shakeX.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8,  { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(6,  { duration: 50 }),
      withTiming(-4, { duration: 50 }),
      withTiming(0,  { duration: 50 }),
    );
  };

  const handlePhoneChange = (text: string) => {
    // Only allow digits
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned !== text) {
      // Non-numeric was typed — shake
      triggerShake();
      setInputError(true);
    } else {
      setInputError(false);
    }
    if (cleaned.length <= 10) setPhone(cleaned);
  };

  const handleContinue = () => {
    if (phone.length === 0 || phone.length < 10) {
      triggerShake();
      setInputError(true);
      return;
    }
    setInputError(false);
    router.push({ pathname: '../otp', params: { phone } });
  };

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e: KeyboardEvent) => {
        const kbTop = SCREEN_HEIGHT - e.endCoordinates.height;
        const overlap = OVERLAY_BOTTOM_FROM_SCREEN - kbTop;
        const pushUp = overlap > 0 ? overlap + 16 : 0;
        setKeyboardVisible(true);
        overlayBottom.value = withTiming(pushUp, { duration: 250 });
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        overlayBottom.value = withTiming(0, { duration: 200 });
      }
    );
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const trapeziumHeight = useSharedValue(0);
  const [imagesTriggered, setImagesTriggered] = useState(false);

  const trapeziumStyle = useAnimatedStyle(() => ({
    height: trapeziumHeight.value,
    overflow: "hidden",
  }));

  const handleTypingDone = () => {
    trapeziumHeight.value = withTiming(500, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
    setImagesTriggered(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to</Text>
      <TypewriterText onTypingDone={handleTypingDone} />

      <View style={styles.trapeziumWrapper}>

        <Animated.View style={[trapeziumStyle, {
          marginTop: -5,
          backgroundColor: '#ffffff',
          alignItems: 'center',
          overflow: 'hidden',
          transform: [{ translateX: -15 }],
          zIndex: 1,
        }]}>
          <TrapeziumShape />
        </Animated.View>

        <LinearGradient
          colors={[
            'rgba(255,255,255,0.1)',
            'rgba(255,255,255,0.55)',
            'rgba(255,255,255,0.775)',
            'rgba(255,255,255,0.8875)',
            '#ffffff',
          ]}
          locations={[0, 0.3077, 0.5241, 0.726, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.gradientRect, { zIndex: 2 }]}
        />

        <View style={[styles.imagesRow, { zIndex: 3 }]}>
          <AnimatedImage
            source={require('../../assets/images/login-imgs/clock.png')}
            style={[styles.leftImage]}
            delay={300}
            triggered={imagesTriggered}
          />
          <AnimatedImage
            source={require('../../assets/images/login-imgs/pencil-rectangle.png')}
            style={styles.centerImage}
            delay={0}
            triggered={imagesTriggered}
          />
          <AnimatedImage
            source={require('../../assets/images/login-imgs/laptop-circle.png')}
            style={[styles.rightImage, { transform: [{ translateY: -10 }] }]}
            delay={600}
            triggered={imagesTriggered}
          />
        </View>

        <Animated.View style={[styles.textOverlay, overlayStyle, { zIndex: 3 },
          keyboardVisible && {
            backgroundColor: '#ffffff',
            width: '100%',
            paddingVertical: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }
        ]}>
          <Text style={{ fontFamily: 'PelikanMedium', color: '#808080', fontSize: 18 }}>
            Let's get you started
          </Text>

          <View style={{ alignItems: "center", marginTop: 16, gap: 2 }}>
            <Text style={{ fontFamily: 'PelikanMedium', color: '#000000', fontSize: 14 }}>
              Enter your phone number
            </Text>
            <Text style={{ fontFamily: 'PelikanMedium', color: '#808080', fontSize: 12 }}>
              We'll send you a 6-digit OTP
            </Text>
          </View>

          {/* Shake wrapper around just the input */}
          <Animated.View style={shakeStyle}>
            <CustomInput
              placeholder="+91 98765 43210"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              width={251}
              height={45}
              backgroundColor={inputError ? "rgba(255, 60, 60, 0.15)" : "rgba(255, 110, 81, 0.2)"}
              borderColor={inputError ? "#FF3C3C" : "#FF6E51"}
            />
          </Animated.View>

          {/* Subtle error hint */}
          {inputError && (
            <Text style={{ fontFamily: 'PelikanMedium', color: '#FF3C3C', fontSize: 11, marginTop: -8 }}>
              {phone.length === 0 ? 'Please enter your phone number' : phone.length < 10 ? 'Enter a valid 10-digit number' : 'Only digits allowed'}
            </Text>
          )}

          <Button
            label="Get your OTP"
            onPress={handleContinue}
            width={253}
            height={44}
            backgroundColor="#E4CFFF"
            shadowColor="#9E42DF"
            textColor="#000000"
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 100,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PelikanMedium',
    color: "#808080",
  },
  trapeziumWrapper: {
    width: 390,
    height: 500,
    marginTop: -2,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  imagesRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    width: 380,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    marginTop: 75,
    paddingHorizontal: 10,
  },
  textOverlay: {
    position: 'absolute',
    top: 340,
    left: 0,
    right: 0,
    marginTop: 2,
    alignItems: 'center',
    gap: 15,
  },
  centerImage: {
    width: 120,
    height: 120,
    transform: [{ rotate: '-9.26deg' }],
    backgroundColor: 'transparent',
    resizeMode: 'contain',
    alignSelf: 'flex-start',
  },
  leftImage: {
    width: 115,
    height: 115,
    backgroundColor: 'transparent',
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
  rightImage: {
    width: 125,
    height: 125,
    backgroundColor: 'transparent',
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
  gradientRect: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 390,
    height: 354,
  },
});