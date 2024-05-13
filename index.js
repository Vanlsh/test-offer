const form = document.querySelector("#form");
const inputLabel = document.querySelector("#form label");

const sortByNameBtn = document.querySelector("#sortByName");
const sortByValueBtn = document.querySelector("#sortByValue");
const deleteBtn = document.querySelector("#delete");
const parseBtn = document.querySelector("#parse");

const showDataInput = document.querySelector("#data");
// CONSTANCE
const INVALID = "invalid";
const DATA_KEY_LS = "data";
const IS_XML_KEY_LS = "isXml";

form.addEventListener("submit", onSubmit);
sortByNameBtn.addEventListener("click", onSortByName);
sortByValueBtn.addEventListener("click", onSortByValue);
deleteBtn.addEventListener("click", onDelete);
parseBtn.addEventListener("click", onChangeFormat);
showDataInput.addEventListener("input", () => {
  return;
});
// EVENTS
function onSubmit(e) {
  e.preventDefault();
  const { value } = e.currentTarget.elements.data;

  if (validate(value)) {
    const pairs = [parsePair(value), ...getPairs()];
    setPairs(pairs);
    renderList(pairs);
    inputLabel.classList.remove(INVALID);
    e.currentTarget.reset();
  } else {
    inputLabel.classList.add(INVALID);
  }
}

function onSortByName() {
  const pairs = getPairs();
  renderList(sortPairs(pairs, "key"));
}

function onSortByValue() {
  const pairs = getPairs();
  renderList(sortPairs(pairs, "value"));
}

function onDelete() {
  const { value, selectionStart, selectionEnd } = showDataInput;
  if (selectionStart == selectionEnd) return;

  const range = getIndexesRangePair({ value, selectionStart, selectionEnd });

  if (!range) return;

  const { startIndex, endIndex } = range;

  const pairs = getPairs();
  pairs.splice(startIndex, endIndex - startIndex + 1);

  setPairs(pairs);
  renderList(pairs);
}

function onChangeFormat(e) {
  const { checked } = e.currentTarget;
  setIsXml(checked);
  renderList(getPairs());
}
// EVENTS END
startApp();
// read data from LS
function startApp() {
  const pairs = getPairs();
  parseBtn.checked = getIsXml();
  if (pairs.length) renderList(pairs);
}

function validate(value) {
  const regex = /^\s*[\w\d]+\s*=\s*[\w\d]+\s*$/;
  return regex.test(value);
}

function parsePair(text) {
  const [key, value] = text.split("=");
  return { key: key.trim(), value: value.trim() };
}

// A function that returns the range of indexes of lines that were selected
function getIndexesRangePair({ value, selectionStart, selectionEnd }) {
  const pairLengths = value
    .trim()
    .split("\n")
    .map((pair) => pair.length + 1);

  const isXml = getIsXml();

  let pairEndIndexes = [];

  if (isXml) {
    let counter = pairLengths[0];
    //  if we select only start teg <data>
    if (counter >= selectionEnd) return null;

    for (let i = 1; i < pairLengths.length - 1; i++) {
      counter += pairLengths[i];
      pairEndIndexes.push(counter);
    }
    //  if we select only end teg </data>
    if (pairEndIndexes.at(-1) <= selectionStart) return null;
    const lastItem =
      pairEndIndexes[pairEndIndexes.length - 1] + pairLengths.at(-1) - 1;

    pairEndIndexes[pairEndIndexes.length - 1] = lastItem;
  } else {
    pairEndIndexes = pairLengths.reduce(
      (acc, nextPair) => [...acc, acc.at(-1) + nextPair || nextPair],
      []
    );
  }

  const startIndex = pairEndIndexes.findIndex((item) => item > selectionStart);
  const endIndex = pairEndIndexes.findIndex((item) => item >= selectionEnd);

  return { startIndex, endIndex };
}

function renderList(pairs) {
  if (!pairs.length) {
    showDataInput.value = "";
    return;
  }
  const isXml = parseBtn.checked;
  if (isXml) {
    showDataInput.value = makeXml(pairs);
  } else {
    showDataInput.value = makeSimplePairs(pairs);
  }
}

function makeXml(pairs) {
  const text = pairs.reduce(
    (acc, { key, value }) => (acc += `  <${key}>${value}</${key}>\n`),
    ""
  );
  return "<data>\n" + text + "</data>";
}

function makeSimplePairs(pairs) {
  return pairs.reduce((acc, { key, value }) => acc + `${key}=${value}\n`, "");
}

function sortPairs(pairs, type) {
  const sortedPairs = pairs.toSorted((firstPair, secondPair) =>
    firstPair[type].localeCompare(secondPair[type])
  );
  setPairs(sortedPairs);
  return sortedPairs;
}

// Local Storage
function getPairs() {
  return getFromLS(DATA_KEY_LS) || [];
}

function setPairs(pairs) {
  setToLS(DATA_KEY_LS, pairs);
}

function getIsXml() {
  return getFromLS(IS_XML_KEY_LS) || false;
}

function setIsXml(value) {
  setToLS(IS_XML_KEY_LS, value);
}
// Function to get data from localStorage

function getFromLS(key) {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  } else {
    return null;
  }
}

// Function to set data to localStorage
function setToLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
