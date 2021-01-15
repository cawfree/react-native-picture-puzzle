import * as React from 'react';
import {
  PanResponder,
  Platform,
  Image,
  Animated,
  StyleSheet,
  ImageProps,
  ImageURISource,
  View,
  ViewStyle,
 } from 'react-native';

import ObscureView from './ObscureView';
import { PuzzlePieces, MoveDirection } from '../types';
import { throwOnInvalidPuzzlePieces, shouldDoubleBuffer } from '../constants';

// Used to describe animations using the length of the row as a metric.
const BASELINE_ROW_LENGTH = 3;

export type PicturePuzzleProps = ImageProps & {
  readonly hidden: number | null;
  readonly size: number;
  readonly pieces: PuzzlePieces;
  readonly source: ImageURISource | number;
  readonly renderLoading?: () => JSX.Element;
  readonly onChange?: (nextPieces: PuzzlePieces, nextHidden: number | null) => void;
};

const styles = StyleSheet.create({
  absolute: {position: 'absolute'},
  invisible: {opacity: 0},
  fullWidth: {width: '100%'},
  noOverflow: {overflow: 'hidden'},
  row: {flexDirection: 'row'},
});

// TODO: add loading indicator :D, make sick as hell
export default function PicturePuzzle({
  style,
  size,
  pieces,
  source,
  hidden,
  renderLoading,
  onChange,
}: PicturePuzzleProps): JSX.Element {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (!!source && typeof source === 'object') {
      const { uri } = source as ImageURISource;
      if (typeof uri === 'string' && !!uri.length) {
        Image.prefetch(uri);
      }
    }
  }, [source]);
  React.useEffect(() => {
    if (typeof size !== 'number' || !Number.isInteger(size) || size <= 0) {
      throw new Error(`[PicturePuzzle]: Expected positive integer size, encountered ${size}.`);
    }
  }), [size];
  React.useEffect(() => throwOnInvalidPuzzlePieces(pieces), [pieces]);

  const piecesPerRow = React.useMemo((): number => Math.sqrt(pieces.length), [pieces.length])

  const pieceSize = React.useMemo((): number => (
    size / piecesPerRow
  ), [size, piecesPerRow]);

  const consecutivePieceOpacities = React.useMemo(() => (
    [...Array(pieces.length)].map(() => new Animated.Value(0))
  ), [pieces.length]);

  const consecutivePieceTranslations = React.useMemo(() => (
    [...Array(pieces.length)].map(() => new Animated.ValueXY({
      x: 0,
      y: 0,
    }))
  ), [pieces.length]);

  const calculatePieceOffset = React.useCallback((pieceNumber: number): {
    readonly x: number;
    readonly y: number;
  } => {
    const i = pieces.indexOf(pieceNumber);
    const x = (i % piecesPerRow) * pieceSize;
    const y = Math.floor(i / piecesPerRow) * pieceSize;
    return {x, y};
  }, [pieces, piecesPerRow]);

  const getMoveDirections = React.useCallback((pieceNumber: number): readonly MoveDirection[] => {
    const i = pieces.indexOf(pieceNumber);
    const bottom = i + piecesPerRow;
    const left = i - 1;
    const right = i + 1;
    const top = i - piecesPerRow;
    return [
      pieces[bottom] === hidden && MoveDirection.BOTTOM,
      pieces[left] === hidden && MoveDirection.LEFT,
      pieces[right] === hidden && MoveDirection.RIGHT,
      pieces[top] === hidden && MoveDirection.TOP,
    ].filter(e => !!e) as readonly MoveDirection[];
  }, [pieces, piecesPerRow, hidden]);

  React.useEffect(() => {
    Animated.parallel(consecutivePieceTranslations.map(
      (consecutivePieceTranslation, i) => Animated.timing(
        consecutivePieceTranslation,
        {
          toValue: calculatePieceOffset(i),
          duration: loaded ? 100 : 0,
          useNativeDriver: Platform.OS !== 'web',
        },
      ),
    )).start();
  }, [loaded, pieces, calculatePieceOffset, consecutivePieceTranslations]);

  const shouldGlobalAnimate = React.useCallback(() => {
    Animated.stagger(50 * (BASELINE_ROW_LENGTH / piecesPerRow), consecutivePieceOpacities.map(
      // TODO: It is wrong to connect pieceOpacity with scaling
      (consecutivePieceOpacity, i) => Animated.spring(consecutivePieceOpacity, {
        toValue: i === hidden ? 0 : 1,
        overshootClamping: true,
        useNativeDriver: Platform.OS !== 'web',
      }),
    )).start()
  }, [piecesPerRow, consecutivePieceOpacities, hidden]);

  React.useEffect(() => { /* validate */
    if (hidden !== null && pieces.indexOf(hidden) < 0) {
      throw new Error(`[PicturePuzzle]: Expected hidden to resolve to a valid piece, but encountered ${hidden}.`);
    }
  }, [hidden, pieces]);

  const onLoadStart = React.useCallback(() => setLoaded(false), [setLoaded]);

  React.useEffect(() => {
    shouldGlobalAnimate();
  }, [source, loaded, piecesPerRow, hidden]);

  const onLoad = React.useCallback(() => {
    setTimeout(
      () => shouldDoubleBuffer(
        () => setLoaded(true),
        () => null,
      ),
      10,
    );
  }, [setLoaded, shouldGlobalAnimate]);

  // test code
  React.useEffect(() => {
    setTimeout(() => {
      // TODO: if onChange undefined, repeat the replacement animation 
      typeof onChange === 'function' && onChange(
        [...Array(16)].map((_, i) => i),
        0,
      );
    }, 3000);
  }, [onChange]);
  
  const animLoadOpacity = React.useMemo(() => new Animated.Value(1), []);

  React.useEffect(() => {
    Animated.timing(animLoadOpacity, {
      toValue: loaded ? 0 : 1,
      useNativeDriver: Platform.OS !== 'web',
      duration: (piecesPerRow / BASELINE_ROW_LENGTH) * 250,
    }).start();
  }, [animLoadOpacity, loaded]);

  const panResponder = React.useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState): boolean => {
      const {moveX, moveY} = gestureState;
      console.log(moveX, moveY);
      return false;
    },
    //onPanResponderMove: (_, gestureState) => {
    //  console.log(gestureState);
    //},
  }), []);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        StyleSheet.flatten(style),
        styles.noOverflow,
        {width: size, height: size},
      ]}
    >
      <View style={StyleSheet.absoluteFill}>
        <Image
          style={[
            {width: size, height: size },
            styles.absolute,
            styles.invisible,
          ]}
          source={source}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
        />
        <Animated.View style={[StyleSheet.absoluteFill, {opacity: animLoadOpacity}]}>
          {typeof renderLoading === 'function' && renderLoading()}
        </Animated.View>
        {[...Array(piecesPerRow)].map((_, i) => (
          <View style={[styles.row, styles.fullWidth]} key={`k${i}`}>
            {[...Array(piecesPerRow)].map((_, j) => {
                const idx = i * piecesPerRow + j;
                const opacity = consecutivePieceOpacities[idx];
                const translate = consecutivePieceTranslations[idx];
                const top = -i * pieceSize;
                const bottom = (-i * pieceSize) + pieceSize;
                const left = -j * pieceSize;
                const right = (-j * pieceSize) + pieceSize;
                const pieceNumber = (i * piecesPerRow) + j;
                return (
                  <ObscureView
                    key={`k${j}`}
                    style={[
                      styles.absolute,
                      {
                        opacity,
                        //left: translate.x,
                        //top: translate.y,
                        transform: [
                          { scaleX: opacity },
                          { scaleY: opacity },
                          { translateX: translate.x },
                          { translateY: translate.y },
                        ],
                      },
                    ] as ViewStyle}
                    top={top} 
                    bottom={bottom}
                    left={left}
                    right={right}
                  >
                    <Image style={{width: size, height: size}} source={source} />
                  </ObscureView>
                );
              }
            )}
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
