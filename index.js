const form = document.querySelector("#form");
const inputLable = document.querySelector("#form label");

const sortByNameBtn = document.querySelector("#sortByName");
const sortByValueBtn = document.querySelector("#sortByValue");
const deleteBtn = document.querySelector("#delete");
const parseBtn = document.querySelector("#parse");

const showDataInput = document.querySelector("#data");

// save user data as array of object {key, value}
let userData = [];
// to check how to display user data
let isXml = false;

form.addEventListener("click", onSubmit);
sortByNameBtn.addEventListener("click", onSortByName);
sortByValueBtn.addEventListener("click", onSortByValue);
deleteBtn.addEventListener("click", onDelete);
parseBtn.addEventListener("input", onchange);

function onSubmit(e) {
  e.preventDefault();
  const { value } = e.currentTarget.elements.data;
}
function onSortByName() {}
function onSortByValue() {}
function onDelete() {}
function onChangeFormat(e) {}
