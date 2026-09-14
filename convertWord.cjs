const fs = require("fs");

// 讀取下載的 words.txt
const text = fs.readFileSync("words.txt", "utf-8");

// 把文字按照換行切開
const words = text
  .split(/\r?\n/)
  .map(word => word.trim().toLowerCase())
  .filter(word => word.length === 5);

// 移除重複單字
const uniqueWords = [...new Set(words)];

// 轉成JavaScript陣列
const output = `const words = ${JSON.stringify(uniqueWords, null, 2)};

export default words;
`;

// 寫入 words.js
fs.writeFileSync("src/data/words.js", output);

console.log(`完成！共有 ${uniqueWords.length} 個五字母單字。`);