const API_KEY =
  "b3a19c6933939f7a045e9a502f99c0ef55dc2254bb9e4e73f0c138100f8e7354";
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`,
);
const AGGREGATE_INDEX = "5";
let maxId = 0;

const connects = new Map();
const bc = new BroadcastChannel("tickers-rate");

self.onconnect = ({ ports }) => {
  const port = ports[0];
  const id = maxId++;
  connects.set(id, []);
  port.onmessage = ({ data: [type, ticker] }) => {
    switch (type) {
      case "subscribe":
        connects.get(id).push(ticker);
        subscribeToTickerOnWs(ticker);
        break;
      case "unsubscribe":
        connects.set(
          id,
          connects.get(id).filter((t) => t !== ticker),
        );
        // eslint-disable-next-line no-case-declarations
        let isLast = true;
        connects.forEach((item) => {
          if (item.includes(ticker)) {
            isLast = false;
          }
        });
        if (isLast) {
          unsubscribeFromTickerOnWs(ticker);
        }
        break;
      // TODO: catch close tab and remove connection with this tab
    }
  };
};

socket.addEventListener("message", (e) => {
  const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(
    e.data,
  );
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }
  bc.postMessage([currency, newPrice]);
});

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true },
  );
}

function subscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

function unsubscribeFromTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}
