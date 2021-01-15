import { PuzzlePieces } from '../types';
import isSquare from './isSquare';

export default function throwOnInvalidPuzzlePieces(pieces: PuzzlePieces): void {
  if (!Array.isArray(pieces)) {
    throw new Error(`[PicturePuzzle]: Expected Array pieces, encountered ${pieces}.`);
  } else if (!isSquare(pieces.length)) {
    throw new Error(`[PicturePuzzle]: The length of pieces should be a square i.e. 4, 9, but it was ${pieces.length}.`);
  }

  const [...piecesWhichArentIntegers] = pieces
    .filter((e) => typeof e !== 'number' || !Number.isInteger(e));

  if (piecesWhichArentIntegers.length) {
    throw new Error(`[PicturePuzzle]: Encountered ${
      piecesWhichArentIntegers.length
    } puzzle pieces which aren't integers: ${
      pieces.map(e => JSON.stringify(e)).join(',')
    }.`);
  }

  // @ts-ignore
  const [...sortedPieces] = pieces.sort((a: number, b: number): number => a - b);
  if (sortedPieces[0] !== 0) {
    throw new Error('[PicturePuzzle]: Pieces must be zero indexed.');
  }

  for (let i = 0; i < sortedPieces.length - 1; i += 1) {
    const a = sortedPieces[i];
    const b = sortedPieces[i + 1];
    if (b - a !== 1) {
      throw new Error('[PicturePuzzle]: Puzzle pieces must be consecutive.');
    }
  }
}
