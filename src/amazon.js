const axios = require("axios");
const fs = require("fs/promises");
const { JSDOM } = require("jsdom");

const URL =
  "https://www.amazon.co.jp/s?k=%E3%82%AD%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%89&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=2F3YIDQEW18EY&sprefix=%E3%82%AD%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%89%2Caps%2C199&ref=nb_sb_noss_1";
const AMAZON_PATH = "src/data/amazon.txt";

(async () => {
  try {
    const res = await axios.get(URL);
    const dom = new JSDOM(res.data);
    const document = dom.window.document;
    const data = [];

    const titleData = [...document.querySelectorAll(".a-size-base-plus")].map(
      (title) => title.textContent
    );

    const priceData = [...document.querySelectorAll(".a-price-whole")].map(
      (price) => price.textContent
    );

    for (let i = 0; i < titleData.length && i < priceData.length; i++) {
      data.push({ title: titleData[i], price: priceData[i] });
    }

    const keyboardData = JSON.stringify(data, null, " ");

    await fs.writeFile(AMAZON_PATH, keyboardData, "utf8");

    console.log("amazon :", priceData);
  } catch (error) {
    console.log("[ERROR] :", error);
  }
})();
