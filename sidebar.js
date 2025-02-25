chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateSidebar") {
    console.log("Received message from background script");
    fetchPageData();
  }
});

document.getElementById("scrapeBtn").addEventListener("click", () => {
  console.log("Scrape button clicked");
  fetchPageData();
});

function fetchPageData() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => {
          const h1Element = document.querySelector("h1");
          const title = h1Element ? h1Element.innerText.trim() : document.title;
          return { title, url: window.location.href };
        }
      },
      (results) => {
        if (results?.[0]?.result) {
          updateSidebar(results[0].result.title, results[0].result.url);
        } else {
          updateSidebar("Error fetching data.", "");
        }
      }
    );
  });
}

function updateSidebar(title, url) {
  document.getElementById("title").innerText = `Title: ${title}`;
  document.getElementById("url").innerText = `URL: ${url}`;
  createChart(title, url);
}


function createChart(title, url) {
  const ctx = document.getElementById("myChart").getContext("2d");

  // Destroy existing chart instance if it exists (to avoid duplication)
  if (window.myChart instanceof Chart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Title Length", "URL Length"],
      datasets: [{
        label: "Character Count",
        data: [title.length, url.length],
        backgroundColor: ["blue", "red"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Allow dynamic height
      layout: {
        padding: 10 // Reduce padding
      },
      scales: {
        y: {
          ticks: {
            font: { size: 12 } // Smaller font size
          },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false // Hide legend for a cleaner look
        }
      }
    }
  });
}
