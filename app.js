function getDates() {
  return JSON.parse(localStorage.getItem("dates")) || [];
}

function saveDates(dates) {
  localStorage.setItem("dates", JSON.stringify(dates));
}

function addDate() {
  const input = document.getElementById("dateInput").value;
  if (!input) return;

  let dates = getDates();
  dates.push(input);
  dates.sort();

  saveDates(dates);
  render();
}

function deleteDate(index) {
  let dates = getDates();
  dates.splice(index, 1);
  saveDates(dates);
  render();
}

function render() {
  const dates = getDates();
  const list = document.getElementById("dateList");
  list.innerHTML = "";

  dates.forEach((d, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${d} <button onclick="deleteDate(${i})">❌</button>`;
    list.appendChild(li);
  });

  predict(dates);
}

function predict(dates) {
  if (dates.length < 2) return;

  let cycles = [];

  for (let i = 1; i < dates.length; i++) {
    let d1 = new Date(dates[i-1]);
    let d2 = new Date(dates[i]);
    let diff = (d2 - d1) / (1000 * 60 * 60 * 24);
    cycles.push(diff);
  }

  let weights = cycles.map((_, i) => i + 1);
  let weightedSum = cycles.reduce((sum, c, i) => sum + c * weights[i], 0);
  let totalWeight = weights.reduce((a, b) => a + b, 0);

  let avg = weightedSum / totalWeight;

  let lastDate = new Date(dates[dates.length - 1]);

  let next = new Date(lastDate);
  next.setDate(next.getDate() + Math.round(avg));

  let early = new Date(lastDate);
  early.setDate(early.getDate() + Math.round(avg - 3));

  let late = new Date(lastDate);
  late.setDate(late.getDate() + Math.round(avg + 3));

  document.getElementById("prediction").innerText =
    `Expected: ${next.toDateString()}
Range: ${early.toDateString()} - ${late.toDateString()}`;
}

render();