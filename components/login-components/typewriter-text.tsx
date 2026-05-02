import { useEffect, useState } from "react";
import {  Image, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";

const FULL_TEXT = "AI aribhasha";
const TYPING_SPEED = 80; //ms per character
const PA_INDEX = 3;
const TOTAL_TYPING_DURATION = FULL_TEXT.length * TYPING_SPEED; // when typing ends

interface TypewriterTextProps {
    onTypingDone?: () => void; // callback to trigger trapezium
}

export default function TypewriterText({onTypingDone} : TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState("");
    const cursorOpacity = useSharedValue(1);
    // useSharedValue stores mutable values, 
    // doesn't trigger re-render
    // persists across renders
    // useSharedValue is wired into the animation system and UI thread
    const imageOpacity = useSharedValue(0); //प starts invisible
    const pTextOpacity = useSharedValue(0); //P text starts invisible

    // blinking cursor
    useEffect(() => {
        cursorOpacity.value = withRepeat(
            withTiming(0, {
                duration : 500,
                easing: Easing.inOut(Easing.ease),
            }),
            -1, // infinite
            true // reverse (0 > 1 > 0 > 1)
        );
    }, []);

    // typing effect
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if(i < FULL_TEXT.length) {
                setDisplayedText(FULL_TEXT.slice(0, i+1));
                i++;
            } else {
                clearInterval(interval); // done typing

                // typing done -> swap image to P, trigger trapezium
                imageOpacity.value = withTiming(0, {duration: 300}); //प fades out
                pTextOpacity.value = withDelay(200, 
                    withTiming(1, {duration: 300})
                );
                onTypingDone?.(); //tell parent to reveal trapezium
            }
        }, TYPING_SPEED);

        return () => clearInterval(interval); // cleanup
    }, []);

    //fade प image in when it appears
    useEffect(() => {
        if(displayedText.length === PA_INDEX) {
            imageOpacity.value = withTiming(1, {duration: 200});
        }
    }, [displayedText]);

    const cursorStyle = useAnimatedStyle(() => ({
        opacity: cursorOpacity.value,
    }));

    const imageStyle = useAnimatedStyle(() => ({
        opacity: imageOpacity.value,
    }));

    const pTextStyle = useAnimatedStyle(() => ({
        opacity: pTextOpacity.value,
    }));

    return (
        <View style={styles.row}>
            <Text style={styles.text}>{displayedText.slice(0, PA_INDEX)}</Text>

             {/* प image and P text stacked, cross-fading */}
            {displayedText.length >= PA_INDEX && (
                <View style={styles.paContainer}>
                <Animated.Image
                    source={require("../../assets/images/login-imgs/p-se-panchi.png")}
                    style={[styles.paImage, imageStyle]}
                />
                <Animated.Text style={[styles.text, styles.pText, pTextStyle]}>
                    P
                </Animated.Text>
                </View>
            )}

            <Text style={styles.text}>
                {displayedText.length > PA_INDEX ? displayedText.slice(PA_INDEX) : ''}
            </Text>
            <Animated.View style={[styles.cursor, cursorStyle]}/>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 28,
        color: '#9E42DF',
        fontFamily: 'PelikanMedium'
    },
    cursor: {
        width: 2,
        height: 28,        // match font size
        backgroundColor: '#9E42DF',
        marginLeft: 2,
    },
    paContainer: {
        width: 24,
        height: 28,
    },
    paImage: {
        width: 24,
        height: 26.4,
        resizeMode: 'contain',
    },
    pText: {
        position: "absolute",
        top: -6,
        left: 6,
    },
})
