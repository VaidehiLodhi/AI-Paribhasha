import { useEffect } from "react";
import { ImageStyle, StyleProp } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from "react-native-reanimated";

interface AnimatedImageProps {
    source: any;
    style ?: StyleProp<ImageStyle>;
    delay ?: number;
    triggered: boolean;
}

export const AnimatedImage =({source, style, delay = 0, triggered} : AnimatedImageProps)=> {
    const scale = useSharedValue(0);
    const translateY = useSharedValue(0);

    useEffect(() => {
        if (!triggered) return; // wait for trigger

        //scale in with bounce after delay
        scale.value = withDelay(
            delay,
            withSequence(
                withTiming(1.15, { duration: 400 }),   // scale up slowly
                withSpring(1, { damping: 8, stiffness: 120 })  // bounce back
            )
        );

        //hover float - start after scale in settles
        translateY.value = withDelay(
            delay + 600,
            withRepeat(
                withSequence(
                    withTiming(-8, {duration: 1500}), //flaot up
                    withTiming(0, {duration: 1500}), //float down
                ),
                -1, //infinite
                true
            )
        );
    }, [triggered]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {scale: scale.value},
            {translateY: translateY.value},
        ],
    }));

    return (
        <Animated.Image
            source={source}
            style={[style, animatedStyle]}
            resizeMode= "contain"
        />
    )
}