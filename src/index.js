import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    // adding a click function with state value, so when clicked on the square it will appear "X" and because
    // it is "setState" the history will be kept
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
    // connecting the value from Board below in here "{this.props.value}"
  );
}

class Board extends React.Component {
  renderSquare(i) {
    // added proparty "value" in the squares so when clicked on the squares you will get numbers (will change that to X and O later)
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    // the table of squares
    return (
      <div>
        <h1>Tic Tac Toe</h1>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  // placing the history state so we can undo the moves
  constructor(props) {
    // all React component classes that have a constructor should start with a super(props) call.
    super(props);
    this.state = {
      history: [
        {
          // set the 0 squares to have the value of "null", when the game is played
          // the "null" will be switched out for "X" or "O"
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      // the default will be that X is the first move
      xIsNext: true,
    };
  }

  handleClick(i) {
    // collecting the history of the clicks
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // ignore the next click if someone has won the game
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // X and O will take terns and setting the value of the squares as X and O
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // when clicked on undo it will jump back in time to that move
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = (
      <>
        <li>
          <button className="buttons" onClick={() => this.jumpTo(0)}>
            start new game
          </button>
        </li>

        <li>
          <button
            className="buttons"
            onClick={() => this.jumpTo(this.state.stepNumber - 1)}
          >
            Undo
          </button>
        </li>
      </>
    );

    // the status will change if someone has won
    let status;
    if (winner) {
      status = "Yayy the winner is: " + winner;
    } else {
      status = "Your turn now: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// function to calculate if someone has won
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
