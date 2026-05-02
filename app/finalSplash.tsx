import Button from '@/components/login-components/button-shadow';
import { router, Stack } from "expo-router";
import { useEffect } from 'react';
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    Easing,
    SharedValue,
} from 'react-native-reanimated';

const DURATION = 900;
const SCALE_DURATION = 400;
const EASING = Easing.inOut(Easing.ease);

export default function OnboardingScreen() {
    const p1x = useSharedValue(0);
    const p1y = useSharedValue(0);
    const p2x = useSharedValue(0);
    const p2y = useSharedValue(0);
    const p3x = useSharedValue(0);
    const p3y = useSharedValue(0);
    const p4x = useSharedValue(0);
    const p4y = useSharedValue(0);

    const p1s = useSharedValue(1);
    const p2s = useSharedValue(1);
    const p3s = useSharedValue(1);
    const p4s = useSharedValue(1);

    useEffect(() => {
        const move = (sv: SharedValue<number>, to: number) => {
            sv.value = withTiming(to, { duration: DURATION, easing: EASING });
        };

        const scaleAfterMove = (sv: SharedValue<number>, scaleTo: number) => {
            sv.value = withDelay(
                DURATION, // wait for move to finish
                withTiming(scaleTo, { duration: SCALE_DURATION, easing: Easing.out(Easing.ease) })
            );
        };

        // piece1 (blue) → piece2's position
        move(p1x, 160);
        move(p1y, -15);
        scaleAfterMove(p1s, 1.15);

        // piece2 (purple) → piece4's position
        move(p2x, -5);
        move(p2y, 160);
        scaleAfterMove(p2s, 1.15);

        // piece3 (yellow) → piece1's position
        move(p3x, 0);
        move(p3y, -190);
        scaleAfterMove(p3s, 1.15);

        // piece4 (green) → piece3's position
        move(p4x, -175);
        move(p4y, -15);
        scaleAfterMove(p4s, 1.15);
    }, []);

    const style1 = useAnimatedStyle(() => ({
        transform: [{ translateX: p1x.value }, { translateY: p1y.value }, { scale: p1s.value }],
    }));
    const style2 = useAnimatedStyle(() => ({
        transform: [{ translateX: p2x.value }, { translateY: p2y.value }, { scale: p2s.value }],
    }));
    const style3 = useAnimatedStyle(() => ({
        transform: [{ translateX: p3x.value }, { translateY: p3y.value }, { scale: p3s.value }],
    }));
    const style4 = useAnimatedStyle(() => ({
        transform: [{ translateX: p4x.value }, { translateY: p4y.value }, { scale: p4s.value }],
    }));

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                <Text style={styles.title}>Your space is ready!</Text>
                <Text style={styles.subtitle}>
                    Your learning journey has been set up, explore all you like.
                </Text>
                <View style={styles.puzzleContainer}>
                    <Animated.Image
                        source={require('../assets/images/onboarding-imgs/puzzle-blue.png')}
                        style={[styles.piece1, style1]}
                    />
                    <Animated.Image
                        source={require('../assets/images/onboarding-imgs/puzzle-purple.png')}
                        style={[styles.piece2, style2]}
                    />
                    <Animated.Image
                        source={require('../assets/images/onboarding-imgs/puzzle-yellow.png')}
                        style={[styles.piece3, style3]}
                    />
                    <Animated.Image
                        source={require('../assets/images/onboarding-imgs/puzzle-green.png')}
                        style={[styles.piece4, style4]}
                    />
                </View>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    marginTop: 100,
                    width: '100%'
                }}>
                    <Button
                        label="Enter your digital classroom"
                        onPress={() => router.push({ pathname: '../final' })}
                        width={300}
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
        alignItems: 'flex-start',
        backgroundColor: '#ffffff',
        paddingTop: 100,
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 30,
        fontFamily: 'PelikanMedium',
        color: "#000000",
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'PelikanMedium',
        color: "#808080",
        marginTop: 4,
    },
    puzzleContainer: {
        width: '100%',
        height: 300,
        marginTop: 24,
        position: 'relative',
    },
    piece1: {
        position: 'absolute',
        top: 25,
        left: -15,
        width: 157,
        height: 130,
        resizeMode: 'contain',
    },
    piece2: {
        position: 'absolute',
        top: 0,
        right: -10,
        width: 154,
        height: 157,
        resizeMode: 'contain',
    },
    piece3: {
        position: 'absolute',
        bottom: -30,
        left: 2,
        width: 130,
        height: 130,
        resizeMode: 'contain',
    },
    piece4: {
        position: 'absolute',
        bottom: -30,
        right: 0,
        width: 131,
        height: 157,
        resizeMode: 'contain',
    },
});