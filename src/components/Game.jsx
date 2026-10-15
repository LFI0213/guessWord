import { useState } from "react";
import words from "../data/words";
import SideMenu from "./SideMenu";
import { PiCaretRight } from "react-icons/pi";

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

function Game({user,profile,onProfileUpdated}) {
  //側邊選單是否開啟
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //現在正在玩的答案
  const [currentWord, setCurrentWord] = useState(
    words[Math.floor(Math.random() * words.length)]
  );

  const [guess, setGuess] = useState(""); //玩家目前輸入的字

  const [guesses, setGuesses] = useState([]); //已經猜過的答案

  const [message, setMessage] = useState(""); //遊戲訊息

  const [keyboardStatus, setKeyboardStatus] = useState({}); //鍵盤上每個字母目前的顏色

  const [isCorrect, setIsCorrect] = useState(false); //是否答對

  const [isNotimes, setIsNotimes] = useState(false); //六次次數用完

  const [revealingRow, setRevealingRow] = useState(null); //正在翻牌的列，null表示沒有正在翻牌

  const isRevealing = revealingRow !== null; //是否正在翻牌

  const isGameOver = isCorrect || isNotimes; //是否已經結束這一題

  //玩家按下鍵盤字母
  const handleLetterClick = (letter) => {
    if (isRevealing || isGameOver) {
      return;
    }

    setGuess((previousGuess) => {
      if (previousGuess.length >= WORD_LENGTH) {
        return previousGuess;
      }

      return previousGuess + letter;
    });
  };

  //刪除最後一個字母
  const handleBackspace = () => {
    if (isRevealing || isGameOver) {
      return;
    }

    setGuess((previousGuess) => previousGuess.slice(0, -1));
  };

  //鍵盤顏色優先權
  const getStatusPriority = (status) => {
    if (status === "correct") return 3;
    if (status === "wrong-position") return 2;
    if (status === "not-in-word") return 1;

    return 0;
  };

  //判斷玩家猜的單字每個字母狀態
  const checkGuess = (guess, answer) => {
    //先全部設定成not-in-word
    const result = Array(WORD_LENGTH).fill("not-in-word");

    //複製答案，用來記錄「還剩哪些字母可以配對」
    const remainingLetters = answer.split("");

    //先找完全正確的字母
    guess.split("").forEach((letter, index) => {
      if (letter === answer[index]) {
        result[index] = "correct";

        //把已經配對成功的字母移除
        remainingLetters[index] = null;
      }
    });

    //找位置錯誤的字母
    guess.split("").forEach((letter, index) => {
      //這個位置已經是綠色，不用再判斷
      if (result[index] === "correct") {
        return;
      }

      const foundIndex = remainingLetters.indexOf(letter);

      if (foundIndex !== -1) {
        result[index] = "wrong-position";

        //這個字母已經被使用，不能再給其他重複字母
        remainingLetters[foundIndex] = null;
      }
    });

    return result;
  };

  //玩家送出答案
  const handleSubmit = () => {
    if (isRevealing || isGameOver) {
      return;
    }

    const userGuess = guess.toLowerCase();

    //必須輸入五個字母
    if(userGuess.length !== WORD_LENGTH) {
      return;
    }

    //檢查輸入的是否為正確單字
    if(!words.includes(userGuess)){
      setMessage("The word is not in the list.");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      return;
    }

    setMessage("");

    //記錄這次需要翻牌的列
    setRevealingRow(guesses.length);

    //把這次猜的答案加入guesses
    setGuesses((previousGuesses) => [
      ...previousGuesses,
      userGuess,
    ]);

    //清空目前輸入
    setGuess("");
  };

  //最後一格翻牌完成後，更新鍵盤與遊戲結果
  const handleRevealComplete = (userGuess) => {
    //判斷每個字母的狀態
    const statuses = checkGuess(userGuess, currentWord);

    //更新鍵盤顏色
    setKeyboardStatus((previousStatus) => {
      const newKeyboardStatus = { ...previousStatus };

      statuses.forEach((status, index) => {
        const letter = userGuess[index];

        const oldStatus = newKeyboardStatus[letter];

        if (getStatusPriority(status) > getStatusPriority(oldStatus)) 
        {
          newKeyboardStatus[letter] = status;
        }
      });

      return newKeyboardStatus;
    });

    //判斷是否答對
    const correct = userGuess === currentWord;

    setIsCorrect(correct);

    //判斷是否六次用完(最後一次沒有猜對&&長度6)
    setIsNotimes(
      !correct && guesses.length === MAX_ATTEMPTS
    );

    //翻牌完成，解除輸入鎖定
    setRevealingRow(null);
  };

  //下一題
  const handleNextWord = () => {
    if (isRevealing) {
      return;
    }

    let nextWord;

    do {
      nextWord = words[Math.floor(Math.random() * words.length)];
    } 
    while (
      nextWord === currentWord &&
      words.length > 1
    );

    //換答案
    setCurrentWord(nextWord);

    //清空目前輸入
    setGuess("");

    //清空已猜答案
    setGuesses([]);

    //重置遊戲狀態
    setIsCorrect(false);
    setIsNotimes(false);

    //清除鍵盤顏色
    setKeyboardStatus({});

    //重置翻牌狀態
    setRevealingRow(null);

    //清除提示訊息
    setMessage("");
  };

  //A ~ Z
  const keyboardRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  return (
    <div className="game">

      {/* 側邊選單 */}
      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        profile={profile}
        onProfileUpdated={onProfileUpdated}
      />

      <header className="game-header">
        {/* 漢堡選單按鈕 */}
        <button
          className="menu-button"
          onClick={() => setIsMenuOpen(true)}
        >
          ☰
        </button>

        {/* 上方遊戲logo */}
        <img className="game-logo"
          src="/guess-word-logo.png" 
          alt="Guess Word" 
        />
      </header>

      {/* 跳出訊息(xxxxx not in the list) */}
      {message && (
        <div className="toast">
          {message}
        </div>
      )}

      {/* 猜測棋盤 */}
      <div className="board">

        {Array.from({
          length: MAX_ATTEMPTS,
        }).map((_, rowIndex) => {
          //這列是否已經送出
          const submittedWord = guesses[rowIndex];
          const isSubmitted = submittedWord !== undefined;

          //這列是否正在翻牌
          const isFlipping = rowIndex === revealingRow;

          //這列是否為目前輸入列
          const isCurrent =
            rowIndex === guesses.length &&
            !isRevealing &&
            !isGameOver;

          let displayedWord = "";
          let statuses = [];

          //已經猜過的答案
          if (isSubmitted) {
            displayedWord = submittedWord;
            statuses = checkGuess(submittedWord, currentWord);
          }

          //玩家目前正在輸入的答案
          else if (isCurrent) {
            displayedWord = guess;
          }

          //還沒有使用的格子
          //保留displayedWord為空字串，顯示空白格子

          return (
            <div className="row" key={rowIndex}>

              {Array.from({
                length: WORD_LENGTH,
              }).map((_, index) => {
                const letter = displayedWord[index] || "";
                const status = statuses[index] || "";

                const tileClassName = [
                  "tile",
                  isCurrent ? "current" : "",
                  isCurrent && letter ? "pop" : "",
                  status,
                  isFlipping ? "flip" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    className={tileClassName}
                    key={`${index}-${letter}`}
                    style={{
                      "--flip-delay": `${index * 150}ms`,
                    }}
                    onAnimationEnd={(event) => {
                      //只處理翻牌動畫結束
                      if (event.animationName !== "tile-flip") {
                        return;
                      }

                      //最後一格翻完，才完成這次送出流程
                      if (
                        isFlipping &&
                        index === WORD_LENGTH - 1
                      ) {
                        handleRevealComplete(submittedWord);
                      }
                    }}
                  >
                    {letter.toUpperCase()}
                  </div>
                );
              })}

            </div>
          );
        })}

      </div>

      {/* 下一題按鈕 */}
      <div className="message"
        style={{
          visibility:(isCorrect || isNotimes) ? "visible":"hidden"
        }}
      >
        <p>
          The answer is <span className="answer-word">{currentWord}</span>
        </p>
                  
        <button
          className="next-button"
          onClick={handleNextWord}
        >
          Next Question
          <PiCaretRight
            style={{
              marginTop:"3px",
              marginLeft:"5px",
            }} 
          />
        </button>

      </div>

      {/* 虛擬鍵盤 */}
      <div className="keyboard">

        {keyboardRows.map((row, rowIndex) => (
          <div
            className="keyboard-row"
            key={rowIndex}
          >

            {row.map((letter) => (
              <button
                className={`key ${
                  keyboardStatus[letter] || ""
                }`}
                key={letter}
                onClick={() => handleLetterClick(letter)}
              >
                {letter.toUpperCase()}
              </button>
            ))}

          </div>
        ))}

        {/* Backspace / Enter */}
        <div className="keyboard-row">

          <button
            className="key special-key"
            onClick={handleBackspace}
          >
            ⌫
          </button>

          <button
            className="key special-key"
            onClick={handleSubmit}
          >
            Enter
          </button>

        </div>

      </div>

    </div>
  );
}

export default Game;