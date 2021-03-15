const state = {
  tickers: [],
  filter: "",
  page: 1,
};
const FILTER_KEYS = ["filter", "page"];
const URLParams = Object.fromEntries(
  new URL(window.location).searchParams.entries(),
);

export const setFilterOptions = ({ filter, page }) => {
  state.filter = filter;
  state.page = page;
  setURL();
};
export const getFilterOptions = () => {
  return FILTER_KEYS.reduce((options, key) => {
    if (URLParams[key]) {
      options[key] = URLParams[key];
    }
    return options;
  }, {});
};

export const setTickers = (tickers) => {
  state.tickers = tickers;
  setURL();
};
export const getTickers = () => {
  if (URLParams.tickers === "" || URLParams.tickers === undefined) {
    return [];
  }
  return URLParams.tickers.split(",");
};

function setURL() {
  window.history.pushState(
    null,
    document.title,
    `${window.location.pathname}?tickers=${state.tickers.join(",")}&filter=${
      state.filter
    }&page=${state.page}`,
  );
}
