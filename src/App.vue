<template>
<div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
  <div v-if="!coinList" class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center">
    <svg class="animate-spin -ml-1 mr-3 h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>

  <div class="container">
    <div class="w-full my-4"></div>
    <section>
      <div class="flex">
        <div class="max-w-xs">
          <label for="wallet" class="block text-sm font-medium text-gray-700"
            >Тикер</label
          >
          <div class="mt-1 relative rounded-md shadow-md">
            <input
              v-model="ticker"
              @keyup="setTooltips"
              type="text"
              name="wallet"
              id="wallet"
              class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              placeholder="Например DOGE"
            />
          </div>
          <div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
            <span
              v-for="tip in tooltips"
              :key="tip"
              @click="addTicker(tip)"
              class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              {{ tip }}
            </span>
          </div>
          <div
            v-if="error"
            class="text-sm text-red-600"
          >
            {{ error }}
          </div>
        </div>
      </div>
      <button
        @click = "addTicker"
        type="button"
        class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <!-- Heroicon name: solid/mail -->
        <svg
          class="-ml-0.5 mr-2 h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="#ffffff"
        >
          <path
            d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          ></path>
        </svg>
        Добавить
      </button>
    </section>
      <template  v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <div>
          <button
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            v-if="page > 1"
            @click="page = page - 1"
          >
            Назад
          </button>
          <button
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            @click="page = page + 1"
            v-if="hasNextPage"
          >
            Вперед
          </button>
          <div>Фильтр: <input v-model="filter" /></div>
        </div>
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="t in paginatedTickers"
            :key="t"
            @click="selectTicker(t)"
            :class="{
              'border-4': selectedTicker === t,
            }"
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ t.symbol }} - USD
                <br>
                {{ t.fullName }}
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ t.price }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="deleteTicker(t)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path></svg>Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>
    <section v-if="selectedTicker" class="relative">
      <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
        {{ selectedTicker.symbol }} - USD
      </h3>
      <div class="flex items-end border-gray-600 border-b border-l h-64">
        <div
          v-for="(bar, idx) in normalizeGraph(selectedTicker)"
          :key="idx"
          :style="{ height: `${bar}%`}"
          class="bg-purple-800 border w-10 h-24"
        ></div>
      </div>
      <button
        @click="selectedTicker = null"
        type="button"
        class="absolute top-0 right-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xmlns:svgjs="http://svgjs.com/svgjs"
          version="1.1"
          width="30"
          height="30"
          x="0"
          y="0"
          viewBox="0 0 511.76 511.76"
          style="enable-background:new 0 0 512 512"
          xml:space="preserve"
        >
          <g>
            <path
              d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
              fill="#718096"
              data-original="#000000"
            ></path>
          </g>
        </svg>
      </button>
    </section>
  </div>
</div>
</template>

<script>
  import { subscribeToTicker, unsubscribeFromTicker, getAllTokens } from "./api";

  export default {
    name: "App",
    data() {
      return {
        ticker: '',
        tickers: [],
        selectedTicker: null,
        intervalId: 0,
        coinList: null,
        filter: '',
        page: 1,
        tooltips: [],
        error: '',
      };
    },
    created: async function () {
      let { Data } = await getAllTokens();
      const fullNames = Object.keys(Data).map(coin => Data[coin].FullName.toUpperCase());
      const symbols = Object.keys(Data).map(coin => Data[coin].Symbol);
      this.coinList = { fullNames, symbols };

      const windowData = Object.fromEntries(
        new URL(window.location).searchParams.entries()
      );
      const VALID_KEYS = ["filter", "page"];
      VALID_KEYS.forEach(key => {
        if (windowData[key]) {
          this[key] = windowData[key];
        }
      });

      const tickersData = localStorage.getItem("cryptonomicon-list");
      if (tickersData) {
        const parsedTikers = JSON.parse(tickersData);
        this.tickers = parsedTikers.map((symbol) => {
          const idx = this.coinList.symbols.findIndex((s) => s === symbol);
          return this.createTicker(symbol, this.coinList.fullNames[idx]);
        });
        parsedTikers.forEach((symbol) => {
          const tiker = this.tickers.find((t) => symbol === t.symbol);
          subscribeToTicker(symbol, (newPrice) => {
              tiker.price = this.normalizePrice(newPrice);
              tiker.graph.push(newPrice);
          });
        });
      }
    },
    computed: {

      startIndex() {
        return (this.page - 1) * 6;
      },

      endIndex() {
        return this.page * 6;
      },

      filteredTickers() {
        return this.tickers.filter(ticker => ticker.symbol.includes(this.filter.toUpperCase()));
      },

      paginatedTickers() {
        return this.filteredTickers.slice(this.startIndex, this.endIndex);
      },

      hasNextPage() {
        return this.filteredTickers.length > this.endIndex;
      },

      pageStateOptions() {
        return {
          filter: this.filter,
          page: this.page
        };
      }
    },

    methods: {

      addTicker(tip) {
        this.error = '';
        if(!tip.target){
          this.ticker = tip;
        }
        if(this.tickers.find(t => t.symbol === this.ticker.toUpperCase())){
          return this.error = 'Такой тикер уже добавлен';
        }
        const idx = this.coinList.symbols.indexOf(this.ticker.toUpperCase());
        if(idx === -1) {
          return this.error = 'Нет такой криптовалюты';
        }
        const newTicker = this.createTicker(this.ticker.toUpperCase(), this.coinList.fullNames[idx]);
        this.tickers = [...this.tickers, newTicker];
        const currentTiker = this.tickers.find((tiker) => newTicker.symbol === tiker.symbol);
        subscribeToTicker(newTicker.symbol, (newPrice) => {
          currentTiker.price = this.normalizePrice(newPrice);
          currentTiker.graph.push(newPrice);
        });
        this.ticker = '';
        this.tooltips = [];
      },

      selectTicker(ticker) {
        this.selectedTicker = ticker;
      },

      deleteTicker(ticker) {
        this.tickers = this.tickers.filter( t => t !== ticker);
        if(this.selectedTicker === ticker) {
          this.selectedTicker = null;
        }
        unsubscribeFromTicker(ticker.symbol);
      },

      setTooltips(e) {
        if(e.key === "Enter") {
          return this.addTicker(e);
        }
        this.error = '';
        this.tooltips = [];
        if(this.ticker) {
          const { fullNames, symbols }= this.coinList;
          for(let i = 0; i < fullNames.length; i++) {
            if(fullNames[i].includes(this.ticker.toUpperCase())) {
              this.tooltips.push(symbols[i]);
              if (this.tooltips.length >= 4) {
                break;
              }
            }
          }
        }
      },

      normalizeGraph(ticker) {
        const maxVal = Math.max(...ticker.graph);
        const minVal = Math.min(...ticker.graph);
        return ticker.graph.map(price => {
          if(minVal === maxVal) {
            return 50;
          }
          return 5 + ((price - minVal) * 95 /(maxVal - minVal));
        });
      },

      normalizePrice(price) {
        return price > 1 ? price.toFixed(2) : price.toPrecision(2);
      },

      createTicker(symbol, fullName, currency = 'USD') {
        return {
          symbol,
          fullName,
          currency,
          price: '-',
          graph: [],
        }
      },
    },
    watch: {

      tickers() {
        const toSave = this.tickers.map((t) => t.symbol);
        localStorage.setItem("cryptonomicon-list", JSON.stringify(toSave));
      },

      paginatedTickers() {
        if (this.paginatedTickers.length === 0 && this.page > 1) {
          this.page -= 1;
        }
      },

      filter() {
        this.page = 1;
        this.selectedTicker = null;
      },

      pageStateOptions(value) {
        window.history.pushState(
          null,
          document.title,
          `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
        );
      }
    },
  }
</script>
