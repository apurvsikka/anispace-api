// test-rate-limit.js
const fetch = require("node-fetch");
const API_URL = "http://localhost:3000/api/manga/latest";

const TOTAL_REQUESTS = 20;
const DELAY_MS = 200;

async function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function sendRequest(i) {
  try {
    const res = await fetch(API_URL, {
      headers: {
        "x-forwarded-for": "1.2.3.4",
      },
    });

    const text = await res.text();
    console.log(
      `#${i + 1}: ${res.status} ${res.statusText} - ${text.slice(0, 100)}`
    );
  } catch (err) {
    console.error(`#${i + 1}: ERROR - ${err.message}`);
  }
}

(async () => {
  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    await sendRequest(i);
    await delay(DELAY_MS);
  }
})();
