// --- Data Initialization ---
let items = [];
let formDetails = {};

// --- Helpers ---
function calcItemTotal(itemQty, itemCost) {
  return parseFloat(itemQty) * parseFloat(itemCost);
}

function itemConstructor(el, classes, content) {
  const item = document.createElement(el);
  for (const className of classes) {
    item.classList.add(className);
  }
  item.textContent = content;
  return item;
}

function saveDetails() {
  sessionStorage.setItem("invoiceDetails", JSON.stringify(formDetails));
}

function saveItems() {
  sessionStorage.setItem("invoiceItems", JSON.stringify(items));
}

// --- Load stored data ---
const storedItems = sessionStorage.getItem("invoiceItems");
items = storedItems ? JSON.parse(storedItems) : [];

const storedDetails = sessionStorage.getItem("invoiceDetails");
formDetails = storedDetails ? JSON.parse(storedDetails) : {};

// --- Load and render on page ready ---
window.addEventListener("DOMContentLoaded", () => {
  currentDate();
  renderDetails();
  itemRender();
});

// --- Set invoice date ---
function currentDate() {
  const date = document.getElementById("date");
  const today = new Date();
  date.textContent =
    today.getFullYear() +
    "/" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + today.getDate()).slice(-2);
}

// --- Render Details ---
// Renders the in-memory formDetails to the page. Does not read or write
// storage — call saveDetails() separately when formDetails actually changes.
const fieldMappings = [
  { field: "name", elId: "name-value", fallback: "first last" },
  { field: "email", elId: "email-value", fallback: "name@email.com" },
  { field: "email", elId: "payment-details", fallback: "name@email.com" },
  { field: "phone", elId: "phone-value", fallback: "+x (xxx) xxx-xxxx" },
  {
    field: "invoiceNumber",
    elId: "invoice-number",
    fallback: "00000",
    format: (v) => ("00000" + (v || "0")).slice(-5),
  },
  { field: "companyName", elId: "company-name", fallback: "Company Name" },
  { field: "clientName", elId: "client-name", fallback: "Client Name" },
  { field: "clientEmail", elId: "client-email", fallback: "client@client.com" },
  {
    field: "clientLocation",
    elId: "client-location",
    fallback: "Client Address",
  },
  {
    field: "amountPaid",
    elId: "paid-value",
    fallback: "0.00",
    format: (v) => parseFloat(v || "0").toFixed(2),
  },
  { field: "taxed", elId: "taxed", type: "checkbox" },
];

function renderDetails() {
  for (const { field, elId, fallback, format, type } of fieldMappings) {
    const el = document.getElementById(elId);
    if (!el) continue;
    const value = formDetails[field];
    if (type === "checkbox") {
      el.checked = value ?? false;
    } else {
      el.textContent = format ? format(value) : value || fallback;
    }
  }

  calculateTotal();
}

const inputFields = [...new Set(fieldMappings.map((m) => m.field))];

for (const fieldId of inputFields) {
  const el = document.getElementById(fieldId);
  if (!el) continue;
  el.addEventListener("change", () => {
    formDetails[fieldId] = el.type === "checkbox" ? el.checked : el.value;
    saveDetails();
    renderDetails();
  });
}

// --- Calculate Totals ---
// Uses the in-memory formDetails — assumes renderDetails() or the caller
// has already synced any changes before calling this.
function calculateTotal() {
  const itemsTotal = document.querySelectorAll(".item-total");
  const cost = document.getElementById("cost-value");
  const tax = document.getElementById("tax-value");
  const total = document.getElementById("total-value");

  let itemsCost = 0;
  itemsTotal.forEach((item) => {
    const value = parseFloat(item.textContent);
    if (!isNaN(value)) itemsCost += value;
  });

  const taxed = formDetails.taxed === true;
  const taxAmount = taxed ? itemsCost * 0.13 : 0;
  const paidAmount = parseFloat(formDetails.amountPaid) || 0;

  tax.textContent = taxAmount.toFixed(2);
  cost.textContent = itemsCost.toFixed(2);
  total.textContent = "$" + (itemsCost + taxAmount - paidAmount).toFixed(2);
}

// --- Item Handling ---
function itemRender() {
  const itemList = document.getElementById("item-list");

  while (itemList.children.length > 1) {
    itemList.removeChild(itemList.lastChild);
  }

  for (const item of items) {
    const itemDiv = itemConstructor("div", ["item", "grid"]);
    const itemDesc = itemConstructor("p", ["item-desc"], item.desc);
    const itemQty = itemConstructor("p", ["item-qty"], item.qty);
    const itemCost = itemConstructor("p", ["item-cost"], item.rate);
    const itemTotal = itemConstructor(
      "p",
      ["item-total", "fs-1"],
      calcItemTotal(item.qty, item.rate).toFixed(2),
    );

    itemDiv.appendChild(itemDesc);
    itemDiv.appendChild(itemQty);
    itemDiv.appendChild(itemCost);
    itemDiv.appendChild(itemTotal);
    itemList.appendChild(itemDiv);
  }
  calculateTotal();
}

function itemAdd() {
  const descInput = document.getElementById("item-desc");
  const qtyInput = document.getElementById("item-qty");
  const rateInput = document.getElementById("item-rate");

  if (!descInput.value || !qtyInput.value || !rateInput.value) return;

  items.push({
    desc: descInput.value,
    qty: qtyInput.value,
    rate: rateInput.value,
  });
  saveItems();

  descInput.value = "";
  qtyInput.value = "";
  rateInput.value = "";
  descInput.focus();

  itemRender();
}

// --- Form Submit Handler ---
document.getElementById("item-form").addEventListener("submit", (e) => {
  e.preventDefault();
  itemAdd();
});

function savePDF() {
  window.print();
}

function wipeFormDetails() {
  formDetails = {};
  items = [];
  sessionStorage.removeItem("invoiceDetails");
  sessionStorage.removeItem("invoiceItems");
  renderDetails();
  itemRender();
}
