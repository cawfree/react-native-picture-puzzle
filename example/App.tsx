import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View, Button } from 'react-native';
import { PicturePuzzle, PuzzlePieces } from 'react-native-picture-puzzle';

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: { flexDirection: 'row', justifyContent: 'flex-end'},
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 10.0,
  },
});

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

export default function App() {
  const originalPieces = React.useMemo<PuzzlePieces>(() => (
    [...Array(16)].map((_, i) => i)
  ), []);
  const shuffledPieces = React.useMemo<PuzzlePieces>(() => {
    const p = [...originalPieces];
    shuffle(p);
    return p;
  }, [originalPieces]);
  const [hidden, setHidden] = React.useState<number | null>(0);
  const [pieces, setPieces] = React.useState<PuzzlePieces>(shuffledPieces);
  const source = React.useMemo(() => ({
    uri: 'https://static.tvtropes.org/pmwiki/pub/images/big_l_6.jpg',
  }), []);
  const renderLoading = React.useCallback((): JSX.Element => (
    <View style={[StyleSheet.absoluteFill, styles.center]}>
      <ActivityIndicator />
    </View>
  ), []);
  const onChange = React.useCallback((nextPieces: PuzzlePieces, nextHidden: number | null): void => {
    setPieces([...nextPieces]);
    setHidden(nextHidden);
  }, [setPieces, setHidden]);
  const solve = React.useCallback(() => {
    setPieces(originalPieces);
    setHidden(null);
  }, [setPieces, originalPieces]);
  const retry = React.useCallback(() => {
    setPieces(shuffledPieces);
    setHidden(0);
  }, [setPieces, shuffledPieces]);
  return (
    <View style={[styles.container, styles.center]}>
      <PicturePuzzle
        style={styles.shadow}
        renderLoading={renderLoading}
        pieces={pieces}
        hidden={hidden}
        onChange={onChange}
        size={290}
        source={source}
      />
      <View>
        <Text style={{color: 'black', fontSize: 24, paddingTop: 5}}>
          react-native-picture-puzzle
        </Text>
        <View style={styles.row}>
          <Text style={{color: 'black'}}>
            time wasted by @cawfree
          </Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={retry}>
            <Text style={{color: 'blue', marginRight: 5}}>
              retry
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={solve}>
            <Text style={{color: 'blue'}}>
              solve
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
