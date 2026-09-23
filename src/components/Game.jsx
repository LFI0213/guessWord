import { useState } from "react";
import words from "../data/words";
import SideMenu from "./SideMenu"

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

function Game({user}) {
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

  const [isCorrect, setIsCorrect] = useState(false); // 是否答對

  const [isNotimes, setIsNotimes] = useState(false); //六次次數用完

  // 玩家按下鍵盤字母
  const handleLetterClick = (letter) => {
    if (guess.length >= WORD_LENGTH) {
      return;
    }

    setGuess(guess + letter);
  };

  // 刪除最後一個字母
  const handleBackspace = () => {
    setGuess(guess.slice(0, -1));
  };

  // 鍵盤顏色優先權
  const getStatusPriority = (status) => {
    if (status === "correct") return 3;
    if (status === "wrong-position") return 2;
    if (status === "not-in-word") return 1;

    return 0;
  };

  // 判斷玩家猜的單字每個字母狀態
const checkGuess = (guess, answer) => {
  // 先全部設定成not-in-word
  const result = Array(WORD_LENGTH).fill("not-in-word");

  // 複製答案，之後用來記錄「還剩哪些字母可以配對」
  const remainingLetters = answer.split("");

  // 第一輪：先找完全正確的字母
  guess.split("").forEach((letter, index) => {
    if (letter === answer[index]) {
      result[index] = "correct";

      // 把已經配對成功的字母移除
      remainingLetters[index] = null;
    }
  });

  // 第二輪：找位置錯誤的字母
  guess.split("").forEach((letter, index) => {
    // 這個位置已經是綠色，不用再判斷
    if (result[index] === "correct") {
      return;
    }

    const foundIndex = remainingLetters.indexOf(letter);

    if (foundIndex !== -1) {
      result[index] = "wrong-position";

      // 這個字母已經被使用，不能再給其他重複字母
      remainingLetters[foundIndex] = null;
    }
  });

  return result;
};

  // 玩家送出答案
  const handleSubmit = () => {
    const userGuess = guess.toLowerCase();

    // 必須輸入五個字母
    if(userGuess.length !== WORD_LENGTH) {
      return;
    }

    // 檢查輸入的是否為正確單字
    if(!words.includes(userGuess)){
      setMessage("The word is not in the list.");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      return;
    }

    // 把這次猜的答案加入 guesses
    setGuesses([...guesses, userGuess]);

    //更新鍵盤顏色

    const newKeyboardStatus = { ...keyboardStatus };

    // 判斷每個字母的狀態
    const statuses = checkGuess(userGuess, currentWord);

    // 更新鍵盤顏色
    statuses.forEach((status, index) => {
      const letter = userGuess[index];

      const oldStatus = newKeyboardStatus[letter];

      if (getStatusPriority(status) > getStatusPriority(oldStatus)) 
      {
        newKeyboardStatus[letter] = status;
      }
    });

    // 更新鍵盤顏色
    setKeyboardStatus(newKeyboardStatus);

    // =========================

    // 判斷是否答對
    if (userGuess === currentWord) {
      setIsCorrect(true);
    }

    // 判斷是否六次用完
    if (guesses.length + 1 === MAX_ATTEMPTS) {
      setIsNotimes(true);
    }

    // 清空目前輸入
    setGuess("");
  };

  // 下一題
  const handleNextWord = () => {
    let nextWord;

    do {
      nextWord = words[Math.floor(Math.random() * words.length)];
    } 
    while (
      nextWord === currentWord &&
      words.length > 1
    );

    // 換答案
    setCurrentWord(nextWord);

    // 清空目前輸入
    setGuess("");

    // 清空已猜答案
    setGuesses([]);

    // 重置遊戲狀態
    setIsCorrect(false);
    setIsNotimes(false);

    // 清除鍵盤顏色
    setKeyboardStatus({});
  };

  // A ~ Z
  const keyboardRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  return (
    <div className="game">

      {/* 漢堡選單按鈕 */}
      <button
        className="menu-button"
        onClick={() => setIsMenuOpen(true)}
      >
        ☰
      </button>

      {/* 側邊選單 */}
      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
      />

      <h1>Guess Word</h1>

      {message && (
        <div className="toast">
          {message}
        </div>
      )}

      {/* 猜測棋盤 */}
      <div className="board">

        {/* 已經猜過的答案 */}
        {guesses.map((word, rowIndex) => {
          const statuses = checkGuess(word, currentWord);

          return (
            <div className="row" key={rowIndex}>

              {word.split("").map((letter, index) => (
                <div
                  className={`tile ${statuses[index]}`}
                  key={index}
                >
                  {letter.toUpperCase()}
                </div>
              ))}

            </div>
          );
        })}

        {/* 玩家目前正在輸入的答案 */}
        {guesses.length < MAX_ATTEMPTS &&
          !isCorrect && (
            <div className="row">

              {Array.from({
                length: WORD_LENGTH,
              }).map((_, index) => (
                <div
                  className="tile current"
                  key={index}
                >
                  {guess[index]?.toUpperCase() || ""}
                </div>
              ))}

            </div>
          )}

        {/* 還沒有使用的格子 */}
        {Array.from({
          length:
            MAX_ATTEMPTS -
            guesses.length -
            (isCorrect ? 0 : 1),
        }).map((_, rowIndex) => (

          <div
            className="row"
            key={`empty-${rowIndex}`}
          >

            {Array.from({
              length: WORD_LENGTH,
            }).map((_, index) => (
              <div
                className="tile"
                key={index}
              ></div>
            ))}

          </div>

        ))}

      </div>

      {/* 下一題按鈕 */}
      {(isCorrect || isNotimes) && (
        <div className="message">

          <button
            className="next-button"
            onClick={handleNextWord}
          >
            Next Question
          </button>

          <div
            style={{
              marginTop:"8px"
              }}>
            The answer is {currentWord}
          </div>

        </div>
      )}

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