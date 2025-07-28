import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import { application, json } from "express";
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


export default async function main({msg}) {
const prompt = `${msg}`;
const response = await ai.models.generateContent({
  model: "gemini-2.5-pro",
  contents: `You are an expert frontend engineer and designer. Build a complete modern web application using React based on the following user intent. Generate a professional-looking UI that is fully functional, responsive, and aesthetically appealing using best practices. Use modular components and minimal but elegant styling (Tailwind CSS if needed). Optimize layout and spacing, use appropriate fonts, colors, and responsive design. Ensure code is readable, maintainable, and scalable.\n\nUser Intent: Build a ${msg}, e.g., 'Tic Tac Toe game with score tracking', 'personal portfolio site for a developer named Rutik with dark mode', 'blog page with Markdown support']\n\nDeliver the output as a JSON object with the following structure:"files": {
    "src/index.js": {
      "content": "console.log('hello!')",
      "isBinary": false
    },
    "package.json": {
      "content": {
        "dependencies": {}
      }
    }
  }  do not response with any other than this just build the website directly keep that in mind you are pro frontend dev use css rether tan tailwiind 
    
  eg :{
  "files": {
    "public/index.html": {
      "content": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <meta name=\"theme-color\" content=\"#000000\" />\n    <meta\n      name=\"description\"\n      content=\"Tic Tac Toe game created with React\"\n    />\n    <title>React Tic-Tac-Toe</title>\n  </head>\n  <body>\n    <noscript>You need to enable JavaScript to run this app.</noscript>\n    <div id=\"root\"></div>\n  </body>\n</html>\n",
      "isBinary": false
    },
    "src/App.js": {
      "content": "import Game from './Game';\n\nexport default function App() {\n  return (\n    <main>\n      <Game />\n    </main>\n  );\n}\n",
      "isBinary": false
    },
    "src/Board.js": {
      "content": "import Square from './Square';\n\nfunction Board({ xIsNext, squares, onPlay }) {\n  function handleClick(i) {\n    if (calculateWinner(squares) || squares[i]) {\n      return;\n    }\n    const nextSquares = squares.slice();\n    if (xIsNext) {\n      nextSquares[i] = 'X';\n    } else {\n      nextSquares[i] = 'O';\n    }\n    onPlay(nextSquares);\n  }\n\n  const winner = calculateWinner(squares);\n  let status;\n  if (winner) {\n    status = 'Winner: ' + winner;\n  } else {\n    status = 'Next player: ' + (xIsNext ? 'X' : 'O');\n  }\n\n  return (\n    <>\n      <div className=\"status\">{status}</div>\n      <div className=\"board-row\">\n        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />\n        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />\n        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />\n      </div>\n      <div className=\"board-row\">\n        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />\n        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />\n        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />\n      </div>\n      <div className=\"board-row\">\n        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />\n        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />\n        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />\n      </div>\n    </>\n  );\n}\n\nfunction calculateWinner(squares) {\n  const lines = [\n    [0, 1, 2],\n    [3, 4, 5],\n    [6, 7, 8],\n    [0, 3, 6],\n    [1, 4, 7],\n    [2, 5, 8],\n    [0, 4, 8],\n    [2, 4, 6],\n  ];\n  for (let i = 0; i < lines.length; i++) {\n    const [a, b, c] = lines[i];\n    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {\n      return squares[a];\n    }\n  }\n  return null;\n}\n\nexport default Board;\n",
      "isBinary": false
    },
    "src/Game.js": {
      "content": "import { useState } from 'react';\nimport Board from './Board';\n\nexport default function Game() {\n  const [history, setHistory] = useState([Array(9).fill(null)]);\n  const [currentMove, setCurrentMove] = useState(0);\n  const xIsNext = currentMove % 2 === 0;\n  const currentSquares = history[currentMove];\n\n  function handlePlay(nextSquares) {\n    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];\n    setHistory(nextHistory);\n    setCurrentMove(nextHistory.length - 1);\n  }\n\n  function jumpTo(nextMove) {\n    setCurrentMove(nextMove);\n  }\n\n  const moves = history.map((squares, move) => {\n    let description;\n    if (move > 0) {\n      description = 'Go to move #' + move;\n    } else {\n      description = 'Go to game start';\n    }\n    return (\n      <li key={move}>\n        <button onClick={() => jumpTo(move)}>{description}</button>\n      </li>\n    );\n  });\n\n  return (\n    <div className=\"game\">\n      <div className=\"game-board\">\n        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />\n      </div>\n      <div className=\"game-info\">\n        <ol>{moves}</ol>\n      </div>\n    </div>\n  );\n}\n",
      "isBinary": false
    },
    "src/Square.js": {
      "content": "export default function Square({ value, onSquareClick }) {\n  return (\n    <button className=\"square\" onClick={onSquareClick}>\n      {value}\n    </button>\n  );\n}\n",
      "isBinary": false
    },
    "src/index.css": {
      "content": "* {\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: sans-serif;\n  margin: 20px;\n  padding: 0;\n}\n\nh1 {\n  margin-top: 0;\n  font-size: 24px;\n}\n\n.game {\n  display: flex;\n  flex-direction: row;\n  gap: 20px;\n}\n\n.game-info {\n  margin-left: 20px;\n}\n\n.game-info ol {\n  padding-left: 20px;\n}\n\n.game-info li {\n  margin-bottom: 5px;\n}\n\n.game-info button {\n  background-color: #f0f0f0;\n  border: 1px solid #999;\n  padding: 5px 10px;\n  cursor: pointer;\n}\n\n.game-info button:hover {\n  background-color: #e0e0e0;\n}\n\n.status {\n  margin-bottom: 10px;\n  font-size: 18px;\n  font-weight: bold;\n}\n\n.board-row:after {\n  clear: both;\n  content: '';\n  display: table;\n}\n\n.square {\n  background: #fff;\n  border: 1px solid #999;\n  float: left;\n  font-size: 48px;\n  font-weight: bold;\n  line-height: 68px;\n  height: 68px;\n  margin-right: -1px;\n  margin-top: -1px;\n  padding: 0;\n  text-align: center;\n  width: 68px;\n  cursor: pointer;\n}\n\n.square:focus {\n  outline: none;\n}\n",
      "isBinary": false
    },
    "src/index.js": {
      "content": "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport './index.css';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n",
      "isBinary": false
    },
    "package.json": {
      "content": {
        "name": "tic-tac-toe-react",
        "version": "0.1.0",
        "private": true,
        "dependencies": {
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "react-scripts": "5.0.1"
        },
        "scripts": {
          "start": "react-scripts start",
          "build": "react-scripts build",
          "test": "react-scripts test",
          "eject": "react-scripts eject"
        },
        "eslintConfig": {
          "extends": [
            "react-app",
            "react-app/jest"
          ]
        },
        "browserslist": {
          "production": [
            ">0.2%",
            "not dead",
            "not op_mini all"
          ],
          "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
        "browserslist": {
          "production": [
            ">0.2%",
            "not dead",
            "not op_mini all"
          ],
          "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
          "production": [
            ">0.2%",
            "not dead",
            "not op_mini all"
          ],
          "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
            ">0.2%",
            "not dead",
            "not op_mini all"
          ],
          "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
            "not op_mini all"
          ],
          "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
          ],
          "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
          "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
          ]
        }
      },
            "last 1 firefox version",
            "last 1 safari version"
          ]
        }
      },
          ]
        }
      },
      "isBinary": false
    }
        }
      },
      "isBinary": false
    }
      "isBinary": false
    }
  }
    }
  }
  }
} `,
  config:{
    responseMimeType:application/json,
    responseSchema:{
  "files": {
    "src/index.js": {
      "content": "console.log('hello!')",
      "isBinary": false
    },
    "package.json": {
      "content": {
        "dependencies": {}
      }
    }
  }
}
}

});

  return cleanCodeOutput(response.text);
  function cleanCodeOutput(text) {
   return( text
    .replace(/^```[\w]*\n/, '') // Remove opening ```jsx or ```ts or just ```
    .replace(/```$/, '')        // Remove closing ```
    .trim() ) ;                  // Remove extra whitespace
}
 
}

