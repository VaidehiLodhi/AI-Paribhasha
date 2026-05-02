import OTPInput from "@/components/login-components/otp-input";
import Button from '@/components/login-components/button-shadow';
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

export default function FinalScreen() {
    return (
        <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>
            <Text style={styles.title}>The End</Text>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
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
});