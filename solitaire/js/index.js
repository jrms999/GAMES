'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Import { createStore, combineReducers } from 'redux' */
var _Redux = Redux;
var createStore = _Redux.createStore;
var combineReducers = _Redux.combineReducers;

/* Import { connect, Provider } from 'react-redux' */

var _ReactRedux = ReactRedux;
var connect = _ReactRedux.connect;
var Provider = _ReactRedux.Provider;

/*********
* Constatants
**********/

var consts = {
  FOUNDATION: 'FOUNDATION',
  TABLEAU: 'TABLEAU',

  HEART: 'HEART',
  CLOVER: 'CLOVER',
  TILE: 'TILE',
  PIKE: 'PIKE'
};

/*********
* REACT
**********/
var Game = function () {
  var UnconnectedGame = function UnconnectedGame(_ref) {
    var congratulation = _ref.congratulation;
    return React.createElement(
      'div',
      { id: 'container' },
      React.createElement(
        'div',
        { className: 'header' },
        React.createElement(Stock, null),
        React.createElement(Foundation, null)
      ),
      React.createElement(Tableau, null),
      React.createElement(
        'div',
        { className: 'congratulation',
          style: { visibility: congratulation ? 'visible' : 'hidden' } },
        React.createElement(
          'h1',
          null,
          'Congratulation, you did it!'
        )
      )
    );
  };
  var mapStateToProps = function mapStateToProps(state, ownProps) {
    return {
      congratulation: state.foundation[0].cards.length === 13 && state.foundation[1].cards.length === 13 && state.foundation[2].cards.length === 13 && state.foundation[3].cards.length === 13
    };
  };

  return connect(mapStateToProps)(UnconnectedGame);
}();

var Stock = function () {
  var UnconnectedStock = function UnconnectedStock(_ref2) {
    var rest = _ref2.rest;
    var flopped = _ref2.flopped;
    return React.createElement(
      'div',
      { className: 'stock' },
      React.createElement(
        'div',
        { className: 'rest' },
        rest.map(function (card) {
          return React.createElement(
            'div',
            { className: 'cardContainer',
              key: JSON.stringify({ suit: card.suit, number: card.number }) },
            React.createElement(Card, { key: JSON.stringify({ suit: card.suit, number: card.number }),
              suit: card.suit, number: card.number,
              stack: true,
              turned: card.turned, locked: card.locked, last: false })
          );
        })
      ),
      React.createElement(
        'div',
        { className: 'flop' },
        flopped.map(function (card) {
          return React.createElement(
            'div',
            { className: 'cardContainer',
              key: JSON.stringify({ suit: card.suit, number: card.number }) },
            React.createElement(Card, { key: JSON.stringify({ suit: card.suit, number: card.number }),
              suit: card.suit, number: card.number,
              stack: true,
              turned: card.turned, locked: card.locked, last: card.last })
          );
        })
      )
    );
  };

  var mapStateToProps = function mapStateToProps(state, ownProps) {
    return {
      rest: state.stock.rest,
      flopped: state.stock.flopped
    };
  };

  return connect(mapStateToProps)(UnconnectedStock);
}();

var Foundation = function () {
  var UnconnectedFoundation = function UnconnectedFoundation(_ref3) {
    var piles = _ref3.piles;
    return React.createElement(
      'div',
      { className: 'foundation' },
      piles.map(function (pile, pileIndex) {
        return React.createElement(
          'div',
          { className: 'pile', key: pileIndex },
          pile.cards.map(function (card) {
            return React.createElement(
              'div',
              { className: 'cardContainer',
                key: JSON.stringify({ suit: card.suit, number: card.number }) },
              React.createElement(Card, { key: JSON.stringify({ suit: card.suit, number: card.number }),
                suit: card.suit, number: card.number,
                turned: card.turned, locked: card.locked, last: card.last })
            );
          }),
          React.createElement(DropSite, { key: JSON.stringify({ type: consts.FOUNDATION, index: pileIndex }),
            pileType: consts.FOUNDATION, pileIndex: pileIndex, visible: pile.drop })
        );
      })
    );
  };

  var mapStateToProps = function mapStateToProps(state, ownProps) {
    return {
      piles: state.foundation
    };
  };

  return connect(mapStateToProps)(UnconnectedFoundation);
}();

var Tableau = function () {
  var UnconnectedTableau = function UnconnectedTableau(_ref4) {
    var piles = _ref4.piles;
    return React.createElement(
      'div',
      { className: 'tableau' },
      piles.map(function (pile, pileIndex) {
        return React.createElement(
          'div',
          { className: 'pile', key: pileIndex },
          pile.cards.map(function (card, index) {
            return React.createElement(
              'div',
              { className: 'cardContainer',
                key: JSON.stringify({ suit: card.suit, number: card.number }) },
              React.createElement(Card, { key: JSON.stringify({ suit: card.suit, number: card.number }),
                suit: card.suit, number: card.number,
                stack: false,
                turned: card.turned, locked: card.locked, last: card.last })
            );
          }),
          React.createElement(DropSite, { key: JSON.stringify({ type: consts.TABLEAU, index: pileIndex }),
            pileType: consts.TABLEAU, pileIndex: pileIndex, visible: pile.drop })
        );
      })
    );
  };

  var mapStateToProps = function mapStateToProps(state, ownProps) {
    return {
      piles: state.tableau
    };
  };

  return connect(mapStateToProps)(UnconnectedTableau);
}();

/*********
 * React: Card
 *********/
var Card = function () {
  var UnconnectedCard = function (_React$Component) {
    _inherits(UnconnectedCard, _React$Component);

    function UnconnectedCard(_ref5) {
      var suit = _ref5.suit;
      var number = _ref5.number;
      var stack = _ref5.stack;
      var turned = _ref5.turned;
      var locked = _ref5.locked;
      var last = _ref5.last;

      _classCallCheck(this, UnconnectedCard);

      var _this = _possibleConstructorReturn(this, _React$Component.call(this, { suit: suit, number: number, stack: stack, turned: turned, locked: locked, last: last }));

      _this.state = {
        rotation: turned ? 0 : -180
      };

      _this.turn = _this.turn.bind(_this);
      _this.dragStart = _this.dragStart.bind(_this);
      _this.dragEnd = _this.dragEnd.bind(_this);
      return _this;
    }

    UnconnectedCard.prototype.turn = function turn() {
      var _this2 = this;

      if (this.props.stack === true) {
        this.props.flop();
      } else {
        var _ret = function () {
          if (_this2.props.turned === true || _this2.props.locked) {
            return {
              v: undefined
            };
          }

          var lastTime = null;

          var slideBackAnimation = function (time) {
            var rotation = null;
            if (lastTime !== null) {
              var delta = (time - lastTime) * 0.4;
              rotation = Math.min(0, _this2.state.rotation + delta);
              _this2.setState({ rotation: rotation });
            }
            lastTime = time;
            if (rotation !== 0) requestAnimationFrame(slideBackAnimation);
          }.bind(_this2);

          requestAnimationFrame(slideBackAnimation);
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    };

    UnconnectedCard.prototype.dragStart = function dragStart(ev) {
      ev.dataTransfer.setData('text/plain', JSON.stringify({
        suit: this.props.suit,
        number: this.props.number
      }));
      this.props.dragStart();
    };

    UnconnectedCard.prototype.dragEnd = function dragEnd(ev) {
      this.props.dragEnd();
    };

    UnconnectedCard.prototype.render = function render() {
      var suit = undefined;
      switch (this.props.suit) {
        case consts.HEART:
          suit = React.createElement(Heart, null);
          break;
        case consts.TILE:
          suit = React.createElement(Tile, null);
          break;
        case consts.CLOVER:
          suit = React.createElement(Clover, null);
          break;
        case consts.PIKE:
          suit = React.createElement(Pike, null);
          break;
      }
      return React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'cardFace frontFace',
            style: { transform: 'rotateY(' + this.state.rotation + 'deg)' },
            draggable: this.props.locked === false,
            onDragStart: this.dragStart,
            onDragEnd: this.dragEnd },
          React.createElement(
            'div',
            null,
            React.createElement(
              'h1',
              { className: this.props.suit },
              this.props.number
            ),
            suit
          )
        ),
        React.createElement('div', { className: 'cardFace backFace' + (this.props.locked === false ? ' pointer' : ''),
          style: { transform: 'rotateY(' + (this.state.rotation + 180) + 'deg)' },
          onClick: this.turn })
      );
    };

    return UnconnectedCard;
  }(React.Component);

  var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
    return {
      dragStart: function dragStart() {
        dispatch({
          type: 'DRAG_START',
          suit: ownProps.suit,
          number: ownProps.number,
          last: ownProps.last
        });
      },
      dragEnd: function dragEnd() {
        dispatch({ type: 'DRAG_END' });
      },
      flop: function flop() {
        dispatch({ type: 'FLOP' });
      }
    };
  };
  return connect(null, mapDispatchToProps)(UnconnectedCard);
}();

var Heart = function Heart(_ref6) {
  var _ref6$zoom = _ref6.zoom;
  var zoom = _ref6$zoom === undefined ? false : _ref6$zoom;
  return React.createElement(
    'svg',
    { className: 'suitIcon',
      width: zoom === true ? 40 : 20, height: zoom === true ? 40 : 20,
      viewBox: '0 0 20 20' },
    React.createElement('path', { className: 'heart',
      d: ' M 0 6  A 2.5 2.5 0 0 1 10 6  A 2.5 2.5 0 0 1 20 6 Q 16 14 10 19 Q 4 14 0 6' })
  );
};

var Tile = function Tile(_ref7) {
  var _ref7$zoom = _ref7.zoom;
  var zoom = _ref7$zoom === undefined ? false : _ref7$zoom;
  return React.createElement(
    'svg',
    { className: 'suitIcon',
      width: zoom === true ? 40 : 20, height: zoom === true ? 40 : 20,
      viewBox: '0 0 20 20' },
    React.createElement('path', { className: 'tile',
      d: ' M 10 0  Q 13 5 17 10  Q 13 15 10 20 Q 7 15 3 10 Q 7 5 10 0' })
  );
};

var Clover = function Clover(_ref8) {
  var _ref8$zoom = _ref8.zoom;
  var zoom = _ref8$zoom === undefined ? false : _ref8$zoom;
  return React.createElement(
    'svg',
    { className: 'suitIcon',
      width: zoom === true ? 40 : 20, height: zoom === true ? 40 : 20,
      viewBox: '0 0 20 20' },
    React.createElement('circle', { className: 'clover', cx: '10', cy: '5', r: '4.5' }),
    React.createElement('circle', { className: 'clover', cx: '5', cy: '11', r: '4.5' }),
    React.createElement('circle', { className: 'clover', cx: '15', cy: '11', r: '4.5' }),
    React.createElement('polygon', { className: 'clover', points: '10 10, 13 20, 7 20' })
  );
};

var Pike = function Pike(_ref9) {
  var _ref9$zoom = _ref9.zoom;
  var zoom = _ref9$zoom === undefined ? false : _ref9$zoom;
  return React.createElement(
    'svg',
    { className: 'suitIcon',
      width: zoom === true ? 40 : 20, height: zoom === true ? 40 : 20,
      viewBox: '0 0 20 20' },
    React.createElement('path', { className: 'pike',
      d: ' M 0 12  A 2.5 2.5 0 0 0 10 12  A 2.5 2.5 0 0 0 20 12 Q 16 4 10 0 Q 4 4 0 12' }),
    React.createElement('polygon', { className: 'pike', points: '10 10, 13 20, 7 20' })
  );
};

/*********
 * React: Drop Site
 *********/
var DropSite = function () {
  var UnconnectedDropSite = function (_React$Component2) {
    _inherits(UnconnectedDropSite, _React$Component2);

    function UnconnectedDropSite(_ref10) {
      var pileType = _ref10.pileType;
      var pileIndex = _ref10.pileIndex;
      var visible = _ref10.visible;
      var drop = _ref10.drop;

      _classCallCheck(this, UnconnectedDropSite);

      var _this3 = _possibleConstructorReturn(this, _React$Component2.call(this, { pileType: pileType, pileIndex: pileIndex, visible: visible, drop: drop }));

      _this3.allowDrop = _this3.allowDrop.bind(_this3);
      _this3.drop = _this3.drop.bind(_this3);
      return _this3;
    }

    UnconnectedDropSite.prototype.allowDrop = function allowDrop(ev) {
      ev.preventDefault();
    };

    UnconnectedDropSite.prototype.drop = function drop(ev) {
      ev.preventDefault();
      var data = JSON.parse(ev.dataTransfer.getData("text"));
      this.props.drop(data.suit, data.number);
    };

    UnconnectedDropSite.prototype.render = function render() {
      return React.createElement(
        'div',
        { className: 'dropTarget',
          style: { visibility: this.props.visible ? 'visible' : 'hidden' },
          onDrop: this.drop, onDragOver: this.allowDrop },
        React.createElement(
          'h1',
          null,
          '+'
        )
      );
    };

    return UnconnectedDropSite;
  }(React.Component);

  var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
    return {
      drop: function drop(suit, number) {
        dispatch({
          type: 'DRAG_END'
        });
        dispatch({
          type: 'DROP',
          targetPileType: ownProps.pileType,
          targetPileIndex: ownProps.pileIndex,
          suit: suit,
          number: number
        });
      }
    };
  };
  return connect(null, mapDispatchToProps)(UnconnectedDropSite);
}();

/*********
* REDUX: Store
**********/
var store = function () {
  var cards = function () {
    function deck() {
      var cards = [];
      for (var i = 2; i <= 14; i++) {
        var number = i;
        if (i === 11) number = 'J';
        if (i === 12) number = 'Q';
        if (i === 13) number = 'K';
        if (i === 14) number = 'A';
        cards.push({ suit: consts.HEART, number: number });
        cards.push({ suit: consts.TILE, number: number });
        cards.push({ suit: consts.CLOVER, number: number });
        cards.push({ suit: consts.PIKE, number: number });
      }
      return cards;
    }

    function shuffle(a) {
      for (var i = a.length; i; i--) {
        var j = Math.floor(Math.random() * i);
        var _ref11 = [a[j], a[i - 1]];
        a[i - 1] = _ref11[0];
        a[j] = _ref11[1];
      }
    }

    var cards = deck();
    shuffle(cards);
    return cards;
  }();

  function pop(cards) {
    var turned = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    if (turned) {
      return _extends({}, cards.shift(), { turned: true, locked: false, last: true });
    } else {
      return _extends({}, cards.shift(), { turned: false, locked: true, last: false });
    }
  }

  var initialState = {
    tableau: [{ drop: false, cards: [pop(cards, true)] }, { drop: false, cards: [pop(cards), pop(cards, true)] }, { drop: false, cards: [pop(cards), pop(cards), pop(cards, true)] }, { drop: false, cards: [pop(cards), pop(cards), pop(cards), pop(cards, true)] }, { drop: false, cards: [pop(cards), pop(cards), pop(cards), pop(cards), pop(cards, true)] }, { drop: false, cards: [pop(cards), pop(cards), pop(cards), pop(cards), pop(cards), pop(cards, true)] }, { drop: false, cards: [pop(cards), pop(cards), pop(cards), pop(cards), pop(cards), pop(cards), pop(cards, true)] }],
    stock: {
      rest: [].concat(cards.map(function (card) {
        return {
          suit: card.suit,
          number: card.number,
          turned: false,
          locked: false,
          last: false
        };
      })),
      flopped: []
    },
    foundation: [{ drop: false, cards: [] }, { drop: false, cards: [] }, { drop: false, cards: [] }, { drop: false, cards: [] }]
  };

  var stockReducer = function stockReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState.stock : arguments[0];
    var action = arguments[1];

    switch (action.type) {
      case 'FLOP':
        {
          var rest = [].concat(state.flopped.map(function (card) {
            return {
              suit: card.suit,
              number: card.number,
              turned: false,
              locked: false
            };
          }), state.rest);

          var flopped = [];
          var first = rest.pop();
          var second = rest.pop();
          var third = rest.pop();
          if (third !== undefined) {
            flopped.push(Object.assign({}, third, { turned: true, locked: true, last: false }));
          }
          if (second !== undefined) {
            flopped.push(Object.assign({}, second, { turned: true, locked: true, last: false }));
          }
          if (first !== undefined) {
            flopped.push(Object.assign({}, first, { turned: true, locked: false, last: true }));
          }

          return {
            rest: rest,
            flopped: flopped
          };
        }
      case 'DROP':
        {
          var topFlop = state.flopped[state.flopped.length - 1];
          if (topFlop !== undefined && topFlop.suit === action.suit && topFlop.number === action.number) {
            // The top of the flopped cards has been moved
            var flopped = [];
            if (state.flopped.length > 2) {
              flopped = flopped.concat(state.flopped.slice(0, -2));
            }
            if (state.flopped.length > 1) {
              flopped.push(Object.assign({}, state.flopped[state.flopped.length - 2], {
                locked: false,
                last: true
              }));
            }
            return {
              rest: state.rest,
              flopped: flopped
            };
          }
          return state;
        }
      default:
        {
          return state;
        }
    }
  };

  var foundationReducer = function foundationReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState.foundation : arguments[0];
    var action = arguments[1];

    switch (action.type) {
      case 'DRAG_START':
        {
          var _ret2 = function () {
            var match = function match(targetCard, draggedCard) {
              if (targetCard === undefined && draggedCard.number === 'A') {
                return true;
              }
              if (targetCard === undefined) {
                return false;
              }
              return targetCard.suit === draggedCard.suit && (targetCard.number === 'A' && draggedCard.number === 2 || targetCard.number === 10 && draggedCard.number === 'J' || targetCard.number === 'J' && draggedCard.number === 'Q' || targetCard.number === 'Q' && draggedCard.number === 'K' || targetCard.number + 1 === draggedCard.number);
            };

            if (action.last !== true) {
              return {
                v: state
              };
            }

            var draggedCard = { suit: action.suit, number: action.number };
            return {
              v: state.map(function (pile) {
                return {
                  drop: match(pile.cards[pile.cards.length - 1], draggedCard),
                  cards: [].concat(pile.cards)
                };
              })
            };
          }();

          if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
        }
      case 'DRAG_END':
        {
          return state.map(function (pile) {
            return {
              drop: false,
              cards: [].concat(pile.cards)
            };
          });
        }
      case 'DROP':
        {
          var _ret3 = function () {
            var match = function match(card, suit, number) {
              return card !== undefined && card.suit === suit && card.number === number;
            };

            // Check if the moved card belonged to the foundation piles

            var sourcePileIndex = state.findIndex(function (pile) {
              return match(pile.cards[pile.cards.length - 1], action.suit, action.number);
            });

            return {
              v: state.map(function (pile, pileIndex) {
                // Add the card to the corresponding pile if the target is a foundation pile
                if (action.targetPileType === consts.FOUNDATION && action.targetPileIndex === pileIndex) {
                  return {
                    drop: false,
                    cards: [].concat(pile.cards.map(function (card) {
                      return {
                        suit: card.suit,
                        number: card.number,
                        turned: true,
                        locked: true,
                        last: false
                      };
                    }), [{
                      suit: action.suit,
                      number: action.number,
                      turned: true,
                      locked: false,
                      last: true
                    }])
                  };
                }
                // Remove the card from if it has been part of a foundation pile
                if (sourcePileIndex !== undefined && sourcePileIndex === pileIndex) {
                  var _cards = [];
                  if (pile.cards.length > 2) {
                    _cards = _cards.concat(pile.cards.slice(0, -2));
                  }
                  if (pile.cards.length > 1) {
                    _cards.push(Object.assign({}, pile.cards[pile.cards.length - 2], { locked: false, last: true }));
                  }
                  return {
                    drop: false,
                    cards: _cards
                  };
                }
                // Return the pile unchanged if it has not been affected by the drop
                return pile;
              })
            };
          }();

          if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
        }
      default:
        {
          return state;
        }
    }
  };

  var tableauReducer = function tableauReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState.tableau : arguments[0];
    var action = arguments[1];

    switch (action.type) {
      case 'DRAG_START':
        {
          var _ret4 = function () {
            var match = function match(targetCard, draggedCard) {
              if (targetCard === undefined && draggedCard.number === 'K') {
                return true;
              }
              if (targetCard === undefined) {
                return false;
              }
              return (targetCard.number === 'K' && draggedCard.number === 'Q' || targetCard.number === 'Q' && draggedCard.number === 'J' || targetCard.number === 'J' && draggedCard.number === 10 || targetCard.number === draggedCard.number + 1) && ((targetCard.suit === consts.HEART || targetCard.suit === consts.TILE) && (draggedCard.suit === consts.CLOVER || draggedCard.suit === consts.PIKE) || (targetCard.suit === consts.CLOVER || targetCard.suit === consts.PIKE) && (draggedCard.suit === consts.HEART || draggedCard.suit === consts.TILE));
            };

            var draggedCard = { suit: action.suit, number: action.number };
            return {
              v: state.map(function (pile) {
                return {
                  drop: match(pile.cards[pile.cards.length - 1], draggedCard),
                  cards: [].concat(pile.cards)
                };
              })
            };
          }();

          if ((typeof _ret4 === 'undefined' ? 'undefined' : _typeof(_ret4)) === "object") return _ret4.v;
        }
      case 'DRAG_END':
        {
          return state.map(function (pile) {
            return {
              drop: false,
              cards: [].concat(pile.cards)
            };
          });
        }
      case 'DROP':
        {
          var _ret5 = function () {
            var match = function match(card, suit, number) {
              return card !== undefined && card.suit === suit && card.number === number;
            };

            var _state$reduce = state.reduce(function (accumulated, currentPile) {
              var index = currentPile.cards.findIndex(function (card) {
                return match(card, action.suit, action.number);
              });
              if (index !== -1) {
                var _cards2 = [];
                if (index > 1) {
                  _cards2 = _cards2.concat(currentPile.cards.slice(0, index - 1).map(function (card) {
                    return {
                      suit: card.suit,
                      number: card.number,
                      turned: card.turned,
                      locked: card.locked,
                      last: false
                    };
                  }));
                }
                if (index > 0) {
                  _cards2.push(Object.assign({}, currentPile.cards[index - 1], {
                    locked: false,
                    last: true
                  }));
                }
                accumulated[0].push({
                  drop: false,
                  cards: _cards2
                });
                accumulated[1] = currentPile.cards.slice(index).map(function (card) {
                  return {
                    suit: card.suit,
                    number: card.number,
                    turned: true,
                    locked: false,
                    last: card.last
                  };
                });
              } else {
                accumulated[0].push(currentPile);
              }
              return accumulated;
            }, [[
              // Tableau without moving cards
            ], [
            // Moving cards default (overwritten if source found in a tableau pile)
            {
              suit: action.suit,
              number: action.number,
              turned: true,
              locked: false,
              last: true
            }]]);

            var tableauWithoutMovingCards = _state$reduce[0];
            var movingCards = _state$reduce[1];

            if (action.targetPileType === consts.TABLEAU) {
              tableauWithoutMovingCards[action.targetPileIndex] = {
                drop: false,
                cards: tableauWithoutMovingCards[action.targetPileIndex].cards.map(function (card) {
                  return {
                    suit: card.suit,
                    number: card.number,
                    turned: card.turned,
                    locked: card.locked,
                    last: false
                  };
                }).concat(movingCards)
              };
              return {
                v: tableauWithoutMovingCards
              };
            }
            return {
              v: tableauWithoutMovingCards
            };
          }();

          if ((typeof _ret5 === 'undefined' ? 'undefined' : _typeof(_ret5)) === "object") return _ret5.v;
        }
      default:
        {
          return state;
        }
    }
  };

  var mainReducer = combineReducers({
    stock: stockReducer,
    foundation: foundationReducer,
    tableau: tableauReducer
  });

  return createStore(mainReducer);
}();

/*********
 * React DOM
 *********/
ReactDOM.render(React.createElement(
  Provider,
  { store: store },
  React.createElement(Game, null)
), document.getElementById('app'));