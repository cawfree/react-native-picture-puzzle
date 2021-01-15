export type PuzzlePiece = number;

export type PuzzlePieces = readonly PuzzlePiece[];

export enum MoveDirection {
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
}
