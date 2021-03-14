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

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  port.postMessage(["subscribe", ticker]);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  port.postMessage(["unsubscribe", ticker]);
};
