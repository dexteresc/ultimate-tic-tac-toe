import { useEffect, useRef, useState } from "react";
type Player = "X" | "O";

type BoardProps = {
  turn: Player;
  onClick: () => void;
};

type UltimateBoardProps = {
  size: number;
};

export default function UltimateBoard({
  size,
}: UltimateBoardProps): JSX.Element {
  const [turn, setTurn] = useState<Player>("X");
  const handleClick = () => {
    console.log("click", turn);
    setTurn((prevTurn: Player) => (prevTurn === "X" ? "O" : "X"));
  };

  const [boards, setBoards] = useState<JSX.Element>(
    <div className="loading" />
  );

  const createBoards = () => {
    const boards: JSX.Element[] = [];
    for (let i = 0; i < size; i++) {
      boards.push(<Board key={i} turn={turn} onClick={handleClick} />);
    }
    return <div className="ultimate-board">{boards}</div>;
  };

  useEffect(() => {
    setBoards(createBoards());
  }, [size]);

  return boards;
}

function Board({ turn, onClick }: BoardProps): JSX.Element {
  const size = 3;
  const [squares, setSquares] = useState<(Player | null)[]>(
    Array(size * size).fill(null)
  );
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(winner);
  }, [winner]);
  const handleClick = (i: number) => {
    console.log(turn)
    console.log(i);
    // check if all squares are filled
    const newSquares = [...squares];
    if (winner || squares[i]) {
      return;
    }
    newSquares[i] = turn; // set the square to the current player
    setSquares(newSquares); // update state
    console.log("Switch should happen");
    onClick(); // Switch turn
    const newWinner = calculateWinner(newSquares);
    if (newWinner) {
      // if winner was found
      setWinner(newWinner.winner); // set winner
      colorSquares(newWinner.winningSquares); // color winning squares
    } else {
      checkDraw(newSquares);
    }
  };

  const checkDraw = (squares: (Player | null)[]) => {
    if (squares.every((square) => square !== null)) {
      setWinner("draw");
      // add .draw class to board
      const board = document.querySelector(".board");
      if (board) {
        board.classList.add("draw");
      }
    }
  };
  // Calculate the winner of the game
  // Return the winner and the winning squares
  function calculateWinner(
    squares: (Player | null)[]
  ): { winner: Player; winningSquares: number[] } | null {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        if (squares[a] === "X") {
          return { winner: "X", winningSquares: [a, b, c] };
        } else {
          return { winner: "O", winningSquares: [a, b, c] };
        }
      }
    }
    return null;
  }

  const colorSquares = (winningSquares: number[]) => {
    if (boardRef.current) {
      const squaresElem = boardRef.current.querySelectorAll(".square");
      for (let i = 0; i < squaresElem.length; i++) {
        squaresElem[i].classList.add("filled");
        if (winningSquares.includes(i)) {
          squaresElem[i].classList.add("winning-square");
        }
      }
    }
  };

  const createBoard = (): JSX.Element => {
    // create .square elements with .row being the size of the board
    const rows: JSX.Element[] = [];
    for (let i = 0; i < size; i++) {
      const row: JSX.Element[] = [];
      for (let j = 0; j < size; j++) {
        const index = i * size + j;
        row.push(
          <Square
            key={index}
            value={squares[index]}
            onClick={() => handleClick(index)}
          />
        );
      }
      rows.push(
        <div ref={boardRef} className="row" key={i}>
          {row}
        </div>
      );
    }
    return (
      <div ref={boardRef} className="board">
        {rows}
      </div>
    );
  };

  return createBoard();
}

function Square(props: { value: Player | null; onClick: () => void }) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export type { Player };
