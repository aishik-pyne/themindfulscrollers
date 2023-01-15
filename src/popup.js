'use strict';

import './popup.css';
import Chart from 'chart.js/auto';

const ctx = document.getElementById('entropyHistory');

let chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: new Array(51).fill(0),
    datasets: [{
      label: 'Entropy',
      data: new Array(51).fill(0),
      borderWidth: 1,
      tension: 0.3,
      fill: false
    }]
  },
  options: {
    scales: {
      x: {
        ticks: {
          display: false,
        },
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        beginAtZero: true,
        suggestedMax: 1,
        suggestedMin: 0

      }
    }
  }
});

function addData(chart, label, data) {
  console.log("HERE");
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

function removeData(chart) {
  console.log("HERE");
  chart.data.labels.shift();
  chart.data.datasets.forEach((dataset) => {
      dataset.data.shift();
  });
  chart.update();
}

setInterval(function name() {
  chrome.storage.local.get("entropy")
  .then(function(data) {
    removeData(chart)
    addData(chart, data.entropy, data.entropy)
  })
 
}, 800)