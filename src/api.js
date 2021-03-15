const { port } = new SharedWorker("sw.js");
const bc = new BroadcastChannel("tickers-rate");

port.start();

const tickersHandlers = new Map();

bc.onmessage = (msg) => {
  const [currency, newPrice] = msg.data;
  if (tickersHandlers.has(currency)) {
    const handlers = tickersHandlers.get(currency) ?? [];
    handlers.forEach((fn) => fn(newPrice));
  }
};
async function setPrimePrice(ticker, cb, currency) {
  try {
    const resp = await fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${ticker}&tsyms=${currency}`,
    );
    const data = await resp.json();
    cb(data[currency]);
  } catch (err) {
    console.log(err);
  }
}

export const getAllTokens = async () => {
  try {
    const resp = await fetch(
      "https://min-api.cryptocompare.com/data/all/coinlist?summary=true",
    );
    return await resp.json();
  } catch (err) {
    console.log(err);
  }
};

export const subscribeToTicker = (ticker, cb, currency = "USD") => {
  setPrimePrice(ticker, cb, currency);
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  port.postMessage(["subscribe", ticker, currency]);
};

export const unsubscribeFromTicker = (ticker, currency = "USD") => {
  tickersHandlers.delete(ticker);
  port.postMessage(["unsubscribe", ticker, currency]);
};
