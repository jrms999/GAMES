 Solitaire game using React, Redux and HTML5's drag & drop feature. Due to the nature of HTML5's drag & drop, touch devices are not supported.

> **Note:** The top-left deck is a bit simplified and the behaviour slightly differs from the original game. Once it is clicked, it simply moves the remaining of the three drawn cards to the bottom of the deck.

#React
The app uses the following react components:
### Game, Stock, Foundation, Tableau
Layout components. The `Game` component behaves as the main container. The `Stock` component is the top-left section with the rest of the deck. The `Foundation` component is the top-right section where you can collect each suit starting with the aces. The `Tableau` component is the bottom component with the seven piles.

### Card
Displays a single card and dispatches the `DRAG_START`, `DRAG_END` and `FLOP` events. Receives the following properties: card suit, number, if it belongs to the top-left stock or not (different action is performed on click if it is), if the front side or the back side is  visible, is it locked (can be clicked / dragged), and whether if it is the last item in the pile. On drag event it fills the event's `dataTransfer` attribute with its own suit and number.

### Heart, Tile, Clover, Pike
SVG components that contain the icon of each suit.

### DropSite
Renders a mostly invisible drop area where a dragged card can be dropped. The visibility is handled by the redux store based on which card is currently dragged (a drop area should only be visible if the currently dragged card can be dropped to that position). Once a card is dropped on it, it interprets the event's `dataTransfer` attribute and dispatches a `DROP` event with the incoming data (which card has been dropped) and it's own position (where the card has been dropped).

#Redux
There are three reducers for the three main sections of the game, the `stackReducer`, the `foundationReducer` and the `tableauReducer`. These reducers implement the following actions:
### DRAG_START
Once a card is dragged, the possible drop sites should be set to visible. Each drop site is checked with the dragged card's suite and number and if the dragged card could be dropped to a drop site, then that `DropSite` component should be set to visible. In case a drop site belongs to the foundation (top-right section), it only accepts those dragged cards which are the last one in their original pile. Drop sites belonging to the tableau (bottom section) accept cards that are not the last ones in their own pile as well (if it is not the last one, the rest of the pile will be also moved).
### DRAG_END
Once a card is not dragged anymore, all the drop sites must be hidden again.
### DROP
Once a drop happens the dragged card has to be removed from it's original pile and has to be added to it's new position. This is not necessarily done by one reducer, if you drag a card from the stock to the tableau section, then the stockReducer's responsibility is to remove the card from it's original place, and the tableauReducer's responsibility is to add it to it's new position. In case the dragged card was not the last one in it's own pile, all the depending cards are moved as well (this is only possible within the tableau section).
### FLOP
In the stock section the previously drawn cards move back to the bottom of the deck and three new cards are drawn from the top. This part slightly differs from the original behaviour of the game.