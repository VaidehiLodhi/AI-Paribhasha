import OTPInput from "@/components/login-components/otp-input";
import Button from '@/components/login-components/button-shadow';
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

export default function OtpScreen() {
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [timer, setTimer] = useState(60);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(false);

    const shakeX = useSharedValue(0);

    const shakeStyle = useAnimatedStyle(() => ({
        transform: [{translateX: shakeX.value}],
    }));

    const triggerShake =()=> {
         shakeX.value = withSequence(
            withTiming(-8, { duration: 50 }),
            withTiming(8,  { duration: 50 }),
            withTiming(-6, { duration: 50 }),
            withTiming(6,  { duration: 50 }),
            withTiming(-4, { duration: 50 }),
            withTiming(0,  { duration: 50 }),
        );
    }

    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = () => {
        if (otp === '123456') {
            router.push('./subjects');
        } else {
            setError(true);
            triggerShake();
        }
    };

    return (
        <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.appName}>AI Paribhasha</Text>

            <View style={styles.inputHeader}>
                <Text style={styles.codeSentText}>
                    Code sent to <Text style={styles.phoneText}>+91 {phone}</Text>
                </Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.changeNumber}>Change number?</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputField}>
                {timer > 0 ? (
                    <Text style={styles.resendTimer}>
                        Resend Code in <Text style={styles.timerBold}>0:{String(timer).padStart(2, '0')}</Text>
                    </Text>
                ) : (
                    <TouchableOpacity onPress={() => { setTimer(60); setError(false); setOtp(''); }}>
                        <Text style={styles.resendButton}>Resend Code</Text>
                    </TouchableOpacity>
                )}

                <Animated.View style={shakeStyle}>
                    <OTPInput onComplete={(val) => {
                        setOtp(val);
                        setError(false);
                    }} />
                </Animated.View>

                {error && (
                    <Text style={styles.errorText}>Invalid OTP. Please try again.</Text>
                )}

            </View>
            <View style={{
                marginTop: 22
            }}>
                <Button
                    label="Verify OTP"
                    onPress={handleVerify}
                    width={260}
                    height={44}
                    backgroundColor="#E4CFFF"
                    shadowColor="#9E42DF"
                    textColor="#000000"
                />
            </View>
        </View>
        </>
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
    appName: {
        fontSize: 28,
        color: '#9E42DF',
        fontFamily: 'PelikanMedium',
    },
    inputHeader: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginTop: 50,
        gap: 4,
    },
    codeSentText: {
        fontFamily: 'PelikanMedium',
        fontSize: 16,
        color: '#808080',
    },
    phoneText: {
        fontFamily: 'PelikanBold',
        color: '#000000',
    },
    changeNumber: {
        fontFamily: 'PelikanBook',
        fontSize: 12,
        color: '#FF6E51',
        textDecorationLine: 'underline',
    },
    inputField: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: 36,
        gap: 12,
    },
    resendTimer: {
        fontFamily: 'PelikanBook',
        fontSize: 12,
    },
    timerBold: {
        fontFamily: 'PelikanBold',
    },
    resendButton: {
        fontFamily: 'PelikanBook',
        fontSize: 12,
        textDecorationLine: 'underline',
        color: '#FF6E51',
    },
    errorText: {
       fontFamily: 'PelikanMedium', 
       color: '#FF3C3C', 
       fontSize: 11, 
       marginTop: -8
    },
});