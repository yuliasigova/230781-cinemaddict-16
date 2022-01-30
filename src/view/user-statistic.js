import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { createTime, getTotalTime  } from '../utils/common.js';
import { filterStats, StatsFilterType, getUserRank, getGenres, getFirstGenre} from '../utils/stats.js';

const renderChart = (statisticCtx, films) => {
  const BAR_HEIGHT = 50;
  const genres = [];
  const genresCounts = [];

  getGenres(films).forEach(([name, count]) => {
    genres.push(name);
    genresCounts.push(count);
  });

  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genres,
      datasets: [{
        data: genresCounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createUserStatsTemplate = (data, currentValue) => {
  const {films} = data;
  const totalTime = createTime(getTotalTime(films));
  const topGenre = getFirstGenre(films);
  return  `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${getUserRank(films)}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${StatsFilterType.ALL}"${currentValue === StatsFilterType.ALL ? 'checked' : ''}>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${StatsFilterType.TODAY}"${currentValue === StatsFilterType.TODAY ? 'checked' : ''}>
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${StatsFilterType.WEEK}"${currentValue === StatsFilterType.WEEK ? 'checked' : ''}>
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${StatsFilterType.MONTH}"${currentValue === StatsFilterType.MONTH ? 'checked' : ''}>
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${StatsFilterType.YEAR}"${currentValue === StatsFilterType.YEAR ? 'checked' : ''}>
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${films.length} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${totalTime.hours}<span class="statistic__item-description">h</span>${totalTime.minutes} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000" height="0"></canvas>
  </div>

</section>`;
};

export default class UserStatsView extends SmartView {
  #renderChart = null;
  #currentSort = null;

  constructor(films) {
    super();
    this.#currentSort = StatsFilterType.ALL;
    this._data = {films: filterStats[this.#currentSort](films)};

    this.#setCharts();
    this.#setFilterItemChangeHandler();
  }

  get template() {
    return createUserStatsTemplate(this._data, this.#currentSort);
  }

  #setCharts = () => {
    const {films} = this._data;
    const statisticCtx = this.element.querySelector('.statistic__chart');
    this.#renderChart = renderChart(statisticCtx, films);
  }

  #setFilterItemChangeHandler = () => {
    this.element.querySelectorAll('.statistic__filters-input ').forEach((input) => input.addEventListener('change', this.#filterItemChangeHandler));
  }

  #filterItemChangeHandler = (evt) => {
    evt.preventDefault();
    const {films} = this._data;
    this.#currentSort = evt.target.value;
    this._data = {films: filterStats[this.#currentSort](films)};
    this.updateElement();
    this._data = {films};
  };

  restoreHandlers = () => {
    this.#setFilterItemChangeHandler();
    this.#setCharts();
  }
}

