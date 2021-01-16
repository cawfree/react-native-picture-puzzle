import React from 'react';
import { Text, ActivityIndicator, StyleSheet, View, Button } from 'react-native';
import { PicturePuzzle, PuzzlePieces } from './lib';

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
    shadowOpacity: 0.5,
    shadowRadius: 5.0,
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
  const [hidden, setHidden] = React.useState<number | null>(0);
  const [pieces, setPieces] = React.useState<PuzzlePieces>(() => {
    const [...p] = [...Array(16)].map((_, i) => i);
    shuffle(p);
    return p;
  });
  const source = React.useMemo(() => ({
    uri: 'https://art.art/wp-content/uploads/2020/11/maxresdefault.jpg',
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
      </View>
      {false && <Button onPress={() => requestAnimationFrame(() => setHidden(e => e + 1))} title="Inc" />}
      {false && <Button onPress={() => requestAnimationFrame(() => setHidden(e => e - 1))} title="Dec" />}
      {false && <Text>{`hidden ${hidden}`}</Text>}
    </View>
  );
}
