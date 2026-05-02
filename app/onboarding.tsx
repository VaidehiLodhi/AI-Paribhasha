import Button from '@/components/login-components/button-shadow';
import CustomInput from '@/components/login-components/custom-input';
import { router, Stack } from "expo-router";
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
    withDelay,
    Easing,
} from 'react-native-reanimated';

const HOVER_DISTANCE = 8;
const HOVER_DURATION = 1600;

export default function OnboardingScreen() {
    const [name, setName] = useState('');
    const [showNameInput, setShowNameInput] = useState(false);
    const [draftName, setDraftName] = useState('');

    const p1y = useSharedValue(0);
    const p2y = useSharedValue(0);
    const p3y = useSharedValue(0);
    const p4y = useSharedValue(0);

    useEffect(() => {
        const hover = (sv: typeof p1y, delayMs: number) => {
            sv.value = withDelay(
                delayMs,
                withRepeat(
                    withSequence(
                        withTiming(-HOVER_DISTANCE, { duration: HOVER_DURATION, easing: Easing.inOut(Easing.sin) }),
                        withTiming(0, { duration: HOVER_DURATION, easing: Easing.inOut(Easing.sin) }),
                    ),
                    -1,
                    false
                )
            );
        };

        hover(p1y, 0);
        hover(p2y, 400);
        hover(p3y, 800);
        hover(p4y, 200);
    }, []);

    const style1 = useAnimatedStyle(() => ({ transform: [{ translateY: p1y.value }] }));
    const style2 = useAnimatedStyle(() => ({ transform: [{ translateY: p2y.value }] }));
    const style3 = useAnimatedStyle(() => ({ transform: [{ translateY: p3y.value }] }));
    const style4 = useAnimatedStyle(() => ({ transform: [{ translateY: p4y.value }] }));

    const handleConfirmName = () => {
        setName(draftName.trim());
        setShowNameInput(false);
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>What should we call you?</Text>
                    <Text style={styles.subtitle}>You can later edit this too</Text>
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

                    <View style={styles.bottomSection}>
                        <TouchableOpacity
                            style={styles.nameTrigger}
                            onPress={() => {
                                setDraftName(name);
                                setShowNameInput(true);
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.nameTriggerText, !name && styles.namePlaceholder]}>
                                {name || "What's your name?"}
                            </Text>
                        </TouchableOpacity>

                        <Button
                            label="Continue"
                            onPress={() => router.push({
                                pathname: '../finalSplash',
                                params: { name },
                            })}
                            width={253}
                            height={44}
                            backgroundColor="#E4CFFF"
                            shadowColor="#9E42DF"
                            textColor="#000000"
                        />
                    </View>
                </View>

                {showNameInput && (
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setShowNameInput(false)}
                    >
                        <TouchableOpacity activeOpacity={1} style={styles.inputCard}>
                            <Text style={styles.inputLabel}>What's your name?</Text>
                            <TextInput
                                autoFocus
                                style={styles.textInput}
                                placeholder="e.g. Anant, Priya"
                                placeholderTextColor="#aaa"
                                value={draftName}
                                onChangeText={setDraftName}
                                onSubmitEditing={handleConfirmName}
                                returnKeyType="done"
                            />
                            <Button
                                label="Continue"
                                onPress={handleConfirmName}
                                width={'100%'}
                                height={44}
                                backgroundColor="#E4CFFF"
                                shadowColor="#9E42DF"
                                textColor="#000000"
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            </KeyboardAvoidingView>
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
    bottomSection: {
        width: '100%',
        alignItems: 'center',
        gap: 10,
        marginTop: 70,
    },
    nameTrigger: {
        width: 251,
        height: 45,
        borderWidth: 1,
        borderColor: '#808080',
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 14,
        backgroundColor: '#ffffff',
    },
    nameTriggerText: {
        fontFamily: 'PelikanBook',
        fontSize: 14,
        color: '#000000',
    },
    namePlaceholder: {
        color: '#808080',
        fontFamily: 'PelikanBook'
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
    },
    modalKAV: {
        width: '100%',
    },
    inputCard: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 36,
        gap: 12,
    },
    inputLabel: {
        fontFamily: 'PelikanBook',
        fontSize: 16,
        color: '#808080',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#808080',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontFamily: 'PelikanBook',
        fontSize: 14,
        color: '#000000',
    },
});