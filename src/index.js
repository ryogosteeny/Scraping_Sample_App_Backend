const PORT = 8000;
const axios = require("axios");
const express = require("express");
const app = express();
const { JSDOM } = require("jsdom");
const fs = require("fs/promises");

const URL =
  "https://search.rakuten.co.jp/search/mall/%E3%82%AD%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%89/100026/";
const PRICE_PATH = "src/data/price.txt";

(async () => {
  try {
    const res = await axios.get(URL);
    const dom = await new JSDOM(res.data);
    const document = dom.window.document;
    const data = [];

    const titleData = [...document.querySelectorAll(".title")]
      .map((title) => title.textContent)
      .filter((title) => title.length > 0);

    const priceData = [...document.querySelectorAll(".important")]
      .map((price) => price.textContent)
      .filter((priceText) => priceText.length > 0);

    for (let i = 0; i < titleData.length && i < priceData.length; i++) {
      data.push({ title: titleData[i], price: priceData[i] });
    }


    // Getメソッド
    app.get("/api/keyboard", (req, res) => {
      res.send(data);
    });

    const keyboardData = JSON.stringify(data, null, " ");
    await fs.writeFile(PRICE_PATH, keyboardData, "utf8");
  } catch (error) {
    console.log("[ERROR] :", error);
  }
})();

app.listen(PORT, () => {
  console.log(`start localhost${PORT}`);
});
