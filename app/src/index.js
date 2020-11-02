import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.highlighted ? "square highlighted" : "square"} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square
      highlighted={this.props.squares[i].isHighlighted}
      value={this.props.squares[i].value}
      onClick={() => this.props.onClick(i)}
    />;
  }

  renderRow(index) {
    const rowIndex = [];
    for (let i = index; i < index + 3; i++) {
      rowIndex.push(i);
    }
    return rowIndex.map(v => {
      return (
        this.renderSquare(v)
      )
    });
  }

  render() {
    const rows = [0, 3, 6].map(v => {
      return (<div className="board-row">
        {this.renderRow(v)}
      </div>)
    });

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill({value: null, isHighlighted: false}),
      }],
      xIsNext: true,
      stepNumber: 0,
      isHistoryAsc: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i].value) {
      return;
    }
    squares[i] = {
      value: this.state.xIsNext ? 'X' : 'O',
      highlighted: false
    };

    const winningSquares = calculateWinner(squares)
    if(winningSquares) {
      winningSquares.forEach(ws => {
        squares[ws] = {
          value: squares[ws].value,
          isHighlighted: true
        }
      });
    }

    this.setState({
      history: history.concat([{
        squares: squares,
        location: i
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleOrder() {
    this.setState({
      isHistoryAsc: !this.state.isHistoryAsc
    });
  }

  render() {
    const history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, index) => {
      const move = this.state.isHistoryAsc ? index : history.length - 1 - index;
      const board = history[move];
      const player = (move % 2) === 0 ? 'O' : 'X';
      const desc = move ?
        'Go to move #' + move + " - " + player + " at (" + getColumn(board.location) + ", " + getRow(board.location) + ")" :
        'Go to game start';
      return (
        <li key={move} className={move === this.state.stepNumber ? "selected-step" : ""}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[current.location].value;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
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
          <button onClick={() => this.toggleOrder()}> Toggle Order </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
    if (squares[a].value && squares[a].value === squares[b].value && squares[a].value === squares[c].value) {
      return lines[i];
    }
  }
  return null;
}

function getColumn(square) {
  if([0,3,6].includes(square)){
    return 1;
  }

  if([1,4,7].includes(square)){
    return 2;
  }

  if([2,5,8].includes(square)){
    return 3;
  }
}

function getRow(square) {
  return Math.round(square / 3);
}