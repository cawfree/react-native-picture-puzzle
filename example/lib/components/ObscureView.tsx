import * as React from 'react';
import { StyleSheet, Animated, ViewStyle } from 'react-native';

export type ObscureViewProps = {
  readonly children: JSX.Element;
  readonly bottom: number;
  readonly left: number;
  readonly right: number;
  readonly style?: ViewStyle;
  readonly top: number;
};

const styles = StyleSheet.create({
  absolute: {position: 'absolute'},
  container: {overflow: 'hidden'}
});

export default function ObscureView({
  bottom,
  left,
  right,
  top,
  children,
  style,
}: ObscureViewProps): JSX.Element {
  return (
    <Animated.View
      style={[
        styles.container,
        StyleSheet.flatten(style),
        {width: right - left, height: bottom - top},
      ]}
    >
      <Animated.View style={[styles.absolute, {bottom, left, right, top}]}>
        {children}
      </Animated.View>
    </Animated.View>
  );
}
