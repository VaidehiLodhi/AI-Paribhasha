// ClassSlider.jsx
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';

const CLASSES = [5, 6, 7, 8, 9, 10, 11, 12];
const TRACK_HEIGHT = 38;
const THUMB_SIZE = 40;
const DOT_SIZE = 8;
const TRACK_PADDING_H = 18;

type ClassSliderProps = {
  initialClass?: number;
  onChange?: (cls: number) => void;
};

export default function ClassSlider({ initialClass = 8, onChange } : ClassSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(
    CLASSES.indexOf(initialClass)
  );
  const [trackWidth, setTrackWidth] = useState(0);

  const startIndexRef = useRef(selectedIndex);

  // Pixel x-position of dot at index i
  const getDotX = (i : number) => {
    const usable = trackWidth - TRACK_PADDING_H * 2;
    return TRACK_PADDING_H + (i / (CLASSES.length - 1)) * usable;
  };

  // Snap to nearest dot index given an x position
  const getNearestIndex = (x : number) => {
    let nearest = 0;
    let minDist = Infinity;
    CLASSES.forEach((_, i) => {
      const dist = Math.abs(getDotX(i) - x);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });
    return nearest;
  };

  const thumbLeft = trackWidth > 0
    ? getDotX(selectedIndex) - THUMB_SIZE / 2
    : 0;

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin(() => {
      startIndexRef.current = selectedIndex;
    })
    .onUpdate((e) => {
      const startX = getDotX(startIndexRef.current);
      const currentX = startX + e.translationX;
      const clamped = Math.max(
        TRACK_PADDING_H,
        Math.min(trackWidth - TRACK_PADDING_H, currentX)
      );
      const idx = getNearestIndex(clamped);
      if (idx !== selectedIndex) {
        setSelectedIndex(idx);
        onChange?.(CLASSES[idx]);
      }
    });

  return (
    <GestureHandlerRootView>
      <View
        style={styles.track}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      >
        {/* Dots */}
        {trackWidth > 0 && CLASSES.map((cls, i) => (
          <View
            key={cls}
            style={[
              styles.dot,
              {
                left: getDotX(i) - DOT_SIZE / 2,
                opacity: i === selectedIndex ? 0 : 1, // hide dot under thumb
              },
            ]}
          />
        ))}

        {/* Thumb */}
        {trackWidth > 0 && (
          <GestureDetector gesture={gesture}>
            <LinearGradient 
                colors={['#9E42DF', '#E4CFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.thumb, { left: thumbLeft }]} />
          </GestureDetector>
        )}
      </View>

      <Text style={styles.label}>
        You are in{' '}
        <Text style={styles.labelBold}>class {CLASSES[selectedIndex]}</Text>
      </Text>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  track: {
    height: TRACK_HEIGHT,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#E5AFFB',
    backgroundColor: 'transparent',
    position: 'relative',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#E5AFFB',
    top: (TRACK_HEIGHT - DOT_SIZE) / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    top: (TRACK_HEIGHT - THUMB_SIZE) / 2,
    borderWidth: 3,
    borderColor: '#251A7A',
  },
  label: {
    fontFamily: 'PelikanMedium',
    fontSize: 14,
    color: '#808080',
    marginTop: 8,
  },
  labelBold: {
    fontFamily: 'PelikanBold',
    color: '#000000',
  },
});