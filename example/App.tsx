import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PicturePuzzle, isSquare } from './lib';

const styles = StyleSheet.create({
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

export default function App() {
  const pieces = [...Array(64)].map((_, i) => i);
  return (
    <View style={styles.container}>
      <PicturePuzzle
        style={styles.shadow}
        pieces={pieces}
        size={300}
        source={{uri: 'https://art.art/wp-content/uploads/2020/11/maxresdefault.jpg'}}
      />
    </View>
  );
}
