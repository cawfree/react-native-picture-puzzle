"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PicturePuzzle;
import { View, Animated, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import ObscureView from './ObscureView';
import GestureRecognizer from "react-native-swipe-detect";

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _ObscureView = _interopRequireDefault(require("./ObscureView"));


var _types = require("../types");

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var BASELINE_ROW_LENGTH = 3;

var styles = _reactNative.StyleSheet.create({
  absolute: {
    position: 'absolute'
  },
  invisible: {
    opacity: 0
  },
  fullWidth: {
    width: '100%'
  },
  noOverflow: {
    overflow: 'hidden'
  },
  row: {
    flexDirection: 'row'
  }
});

function PicturePuzzle(_ref) {
  var style = _ref.style,
    size = _ref.size,
    pieces = _ref.pieces,
    source = _ref.source,
    hidden = _ref.hidden,
    renderLoading = _ref.renderLoading,
    onChange = _ref.onChange;

  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    loaded = _React$useState2[0],
    setLoaded = _React$useState2[1];

  React.useEffect(function () {
    if (!!source && _typeof(source) === 'object') {
      var uri = source.uri;

      if (typeof uri === 'string' && !!uri.length) {
        _reactNative.Image.prefetch(uri);
      }
    }
  }, [source]);

  React.useEffect(function () {
    if (typeof size !== 'number' || !Number.isInteger(size) || size <= 0) {
      throw new Error("[PicturePuzzle]: Expected positive integer size, encountered ".concat(size, "."));
    }
  }), [size];

  React.useEffect(function () {
    return (0, _constants.throwOnInvalidPuzzlePieces)(pieces);
  }, [pieces]);



  var piecesPerRow = React.useMemo(function () {
    return Math.sqrt(pieces.length);
  }, [pieces.length]);

  var pieceSize = React.useMemo(function () {
    var baseSize = size / piecesPerRow;
    return baseSize - baseSize % _reactNative.PixelRatio.get();
  }, [size, piecesPerRow]);

  var consecutivePieceOpacities = React.useMemo(function () {
    return _toConsumableArray(Array(pieces.length)).map(function () {
      return new _reactNative.Animated.Value(0);
    });
  }, [pieces.length]);

  var consecutivePieceTranslations = React.useMemo(function () {
    return _toConsumableArray(Array(pieces.length)).map(function () {
      return new _reactNative.Animated.ValueXY({
        x: 0,
        y: 0
      });
    });
  }, [pieces.length]);

  var calculatePieceOffset = React.useCallback(function (pieceNumber) {
    var i = pieces.indexOf(pieceNumber);
    var x = i % piecesPerRow * pieceSize;
    var y = Math.floor(i / piecesPerRow) * pieceSize;
    return {
      x: x,
      y: y
    };
  }, [pieces, piecesPerRow]);

  var getMoveDirections = React.useCallback(function (pieceNumber) {

    var i = pieces.indexOf(pieceNumber);
    var bottom = i + piecesPerRow;
    var left = i - 1;
    var right = i + 1;
    var top = i - piecesPerRow;
    if ((i === 2 && pieces[3] === 0) || ((i === 3 && pieces[2] === 0))) {
      return false
    }
    if ((i === 5 && pieces[6] === 0) || ((i === 6 && pieces[5] === 0))) {
      return false
    }

    return [pieces[bottom] === hidden && _types.MoveDirection.BOTTOM, pieces[left] === hidden && _types.MoveDirection.LEFT, pieces[right] === hidden && _types.MoveDirection.RIGHT, pieces[top] === hidden && _types.MoveDirection.TOP].filter(function (e) {
      return !!e;
    });
  }, [pieces, piecesPerRow, hidden]);

  React.useEffect(function () {
    _reactNative.Animated.parallel(consecutivePieceTranslations.map(function (consecutivePieceTranslation, i) {
      return _reactNative.Animated.spring(consecutivePieceTranslation, {
        toValue: calculatePieceOffset(i),
        useNativeDriver: _reactNative.Platform.OS !== 'web'
      });
    })).start();
  }, [loaded, pieces, calculatePieceOffset, consecutivePieceTranslations, piecesPerRow]);

  var shouldGlobalAnimate = React.useCallback(function () {
    _reactNative.Animated.stagger(50 * (BASELINE_ROW_LENGTH / piecesPerRow), consecutivePieceOpacities.map(function (consecutivePieceOpacity, i) {
      return _reactNative.Animated.spring(consecutivePieceOpacity, {
        toValue: i === hidden ? 0 : 1,
        useNativeDriver: _reactNative.Platform.OS !== 'web'
      });
    })).start();
  }, [piecesPerRow, consecutivePieceOpacities, hidden]);

  React.useEffect(function () {
    if (hidden !== null && pieces.indexOf(hidden) < 0) {
      throw new Error("[PicturePuzzle]: Expected hidden to resolve to a valid piece, but encountered ".concat(hidden, "."));
    }
  }, [hidden, pieces]);


  var onLoadStart = React.useCallback(function () {
    return setLoaded(false);
  }, [setLoaded]);

  React.useEffect(function () {
    shouldGlobalAnimate();
  }, [source, loaded, piecesPerRow, hidden]);
  var onLoad = React.useCallback(function () {
    window.setTimeout(function () {
      return window.requestAnimationFrame(function () {
        return setLoaded(true);
      });
    }, 10);
  }, [setLoaded, shouldGlobalAnimate]);

  var animLoadOpacity = React.useMemo(function () {
    return new _reactNative.Animated.Value(1);
  }, []);

  React.useEffect(function () {
    _reactNative.Animated.timing(animLoadOpacity, {
      toValue: loaded ? 0 : 1,
      useNativeDriver: _reactNative.Platform.OS !== 'web',
      duration: piecesPerRow / BASELINE_ROW_LENGTH * 250
    }).start();
  }, [animLoadOpacity, loaded]);

  var getNextPieceIndex = React.useCallback(function (pieceNumber, direction) {
    var idx = pieces.indexOf(pieceNumber);

    if (direction === _types.MoveDirection.LEFT) {
      return idx - 1;
    } else if (direction === _types.MoveDirection.RIGHT) {
      return idx + 1;
    } else if (direction === _types.MoveDirection.TOP) {
      return idx - piecesPerRow;
    } else if (direction === _types.MoveDirection.BOTTOM) {
      return idx + piecesPerRow;
    }

    return idx;
  }, [pieces, piecesPerRow]);

  var shouldMovePiece = React.useCallback(function (pieceNumber, dir) {

    var maybeDirections = getMoveDirections(pieceNumber, pieces);

    if (maybeDirections.length) {
      var _maybeDirections = _slicedToArray(maybeDirections, 1),
        direction = _maybeDirections[0];
      if (dir && direction !== dir) {
        return
      }
      var idx = pieces.indexOf(pieceNumber);
      var nextPieceIndex = getNextPieceIndex(pieceNumber, direction);
      var nextPieces = _toConsumableArray(pieces);
      nextPieces[idx] = nextPieces[nextPieceIndex];
      nextPieces[nextPieceIndex] = pieceNumber;
      typeof onChange === 'function' && onChange(nextPieces, nextPieces[idx]);
    }
  }, [getMoveDirections, pieces, onChange, hidden, getNextPieceIndex]);

  var actualSize = pieceSize * piecesPerRow;

  const config = {
    velocityThreshold: 0.1,
    directionalOffsetThreshold: 80,
  };

  return (
    <Animated.View style={
      [StyleSheet.flatten(style), styles.noOverflow, {
        width: actualSize,
        height: actualSize
      }]
    }>
      <View style={StyleSheet.absoluteFill}>
        <Image
          style={[{
            width: actualSize,
            height: actualSize
          }, styles.absolute, styles.invisible]}
          source={source}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
        />
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            // { opacity: animLoadOpacity }
          ]}>
          {/* {typeof renderLoading === 'function' && renderLoading()} */}
          {_toConsumableArray(Array(piecesPerRow))?.map((_, i) => {
            return (
              <View
                style={[styles.row, styles.fullWidth]}
                key={"k".concat(i)}
              >
                {_toConsumableArray(Array(piecesPerRow))?.map((_, j?: any) => {
                  var idx = i * piecesPerRow + j;
                  var opacity = consecutivePieceOpacities[idx];
                  var translate = consecutivePieceTranslations[idx];
                  var top = -i * pieceSize;
                  var bottom = -i * pieceSize + pieceSize;
                  var left = -j * pieceSize;
                  var right = -j * pieceSize + pieceSize;
                  var pieceNumber = i * piecesPerRow + j;

                  return (
                    <ObscureView
                      key={"k".concat(j)}
                      style={[styles.absolute, {
                        opacity: opacity,
                        transform: [{
                          scaleX: opacity
                        }, {
                          scaleY: opacity
                        }, {
                          translateX: translate.x
                        }, {
                          translateY: translate.y
                        }],
                      }]}
                      top={top}
                      bottom={bottom}
                      left={left}
                      right={right}
                    >

                      <GestureRecognizer
                        onSwipe={(direction, state) => {
                        }}
                        onSwipeUp={(state) => {
                          shouldMovePiece(pieceNumber, 'top')
                        }}
                        onSwipeDown={(state) => {
                          shouldMovePiece(pieceNumber, 'bottom')
                        }}
                        onSwipeLeft={(state) => {
                          shouldMovePiece(pieceNumber, 'left')
                        }}
                        onSwipeRight={(state) => {
                          shouldMovePiece(pieceNumber, 'right')
                        }}
                        config={config}
                        style={{
                          flex: 1,
                        }}
                      >
                        <TouchableWithoutFeedback
                          onPress={() => {
                            shouldMovePiece(pieceNumber)
                          }}
                        >
                          <Image
                            style={{
                              width: actualSize, height: actualSize
                            }}
                            source={source}
                          />
                        </TouchableWithoutFeedback>
                      </GestureRecognizer>

                    </ObscureView>
                  )
                })}
              </View>
            )
          })}
        </Animated.View>
      </View >

    </Animated.View >
  )
}