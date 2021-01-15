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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    const [...p] = [...Array(64)].map((_, i) => i);
    shuffle(p);
    console.log(p);
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
    <View style={styles.container}>
      <PicturePuzzle
        style={styles.shadow}
        renderLoading={renderLoading}
        pieces={pieces}
        hidden={hidden}
        onChange={onChange}
        size={250}
        source={source}
      />
      <Button onPress={() => requestAnimationFrame(() => setHidden(e => e + 1))} title="Inc" />
      <Button onPress={() => requestAnimationFrame(() => setHidden(e => e - 1))} title="Dec" />
      <Text>{`hidden ${hidden}`}</Text>
    </View>
  );
}
