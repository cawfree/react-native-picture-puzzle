import * as React from 'react';
import {
  Image,
  Animated,
  StyleSheet,
  ImageProps,
  ImageURISource,
  View,
 } from 'react-native';

import ObscureView from './ObscureView';
import { PuzzlePieces } from '../types';
import { throwOnInvalidPuzzlePieces } from '../constants';

export type PicturePuzzleProps = ImageProps & {
  readonly size: number;
  readonly pieces: PuzzlePieces;
  readonly source: ImageURISource | number;
};

const styles = StyleSheet.create({
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
}: PicturePuzzleProps): JSX.Element {
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

  const pieceSize = React.useMemo((): number => (
    size / Math.sqrt(pieces.length)
  ), [size]);

  const consecutivePuzzlePieces = React.useMemo((): readonly React.ElementType[][] => {
    const dim = Math.sqrt(pieces.length);
    return [...Array(dim)].map((_, i) => (
      [...Array(dim)].map((_, j) => (
        /* <ObscuredPiece /> */
        (props) => {
          const top = -i * pieceSize;
          const bottom = (-i * pieceSize) + pieceSize;
          const left = -j * pieceSize;
          const right = (-j * pieceSize) + pieceSize;
          return (
            <ObscureView {...props} top={top} bottom={bottom} left={left} right={right}>
              <Image style={{width: size, height: size}} source={source} />
            </ObscureView>
          );
        }
      ))
    ))
  }, [size, source, pieces.length]);
  return (
    <Animated.View
      style={[
        StyleSheet.flatten(style),
        styles.noOverflow,
        {
          width: size,
          height: size,
          backgroundColor: 'red',
        }
      ]}
    >
      <View style={StyleSheet.absoluteFill}>
        {consecutivePuzzlePieces.map(([...rowPieces], i) => (
          <View style={[styles.row, styles.fullWidth]} key={`k${i}`}>
            {rowPieces.map((ObscuredPiece, j) => (
              <ObscuredPiece key={`k${j}`} />
            ))}
          </View>
        ))}
      </View>
      {false && <Animated.Image style={StyleSheet.absoluteFill} source={source} />}
    </Animated.View>
  );
}
