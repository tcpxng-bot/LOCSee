const APP_PASSWORD = "locsee2570";
const AUTH_KEY = "locsee.booking.auth";
const YEAR_KEY = "locsee.booking.year";
const LOCK_DAYS = 5;
const VAC_KEY = "locsee.booking.slots";
const BOOKING_KEY = "locsee.booking.bookings";
const HOLIDAY_KEY = "locsee.booking.holidays";

const thMonthFull = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
const thDays = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const monthColors = ["#a9cbd3", "#b8c7d9", "#b8d2bd", "#c8d7ad", "#e7dda5", "#e6ccb1", "#ddbea8", "#d8b293", "#d9aaa0", "#d8b7c1", "#cdb9cd", "#c4b5a8"];
const longDate = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", { day: "numeric", month: "long", year: "numeric" });

const BASE_HOLIDAYS = [
  ["2026-10-13", "วันหยุดพิเศษ"],
  ["2027-01-01", "วันหยุดพิเศษ"],
  ["2027-02-22", "วันหยุดพิเศษ"],
  ["2027-03-03", "วันหยุดพิเศษ"],
  ["2027-04-06", "วันหยุดพิเศษ"],
  ["2027-04-13", "วันหยุดพิเศษ"],
  ["2027-04-14", "วันหยุดพิเศษ"],
  ["2027-04-15", "วันหยุดพิเศษ"],
  ["2027-05-01", "วันหยุดพิเศษ"],
  ["2027-05-03", "วันหยุดพิเศษ"],
  ["2027-05-20", "วันหยุดพิเศษ"],
  ["2027-06-03", "วันหยุดพิเศษ"],
  ["2027-07-19", "วันหยุดพิเศษ"],
  ["2027-07-28", "วันหยุดพิเศษ"]
];

const cfg = window.LOCVAC_SUPABASE || {};
const supabaseUrl = normalizeSupabaseUrl(cfg.url);
const supabaseAnonKey = String(cfg.anonKey || "").trim();
const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey && window.supabase);
const db = hasSupabase ? window.supabase.createClient(supabaseUrl, supabaseAnonKey) : null;

let selectedFiscalYear = Number(localStorage.getItem(YEAR_KEY) || "2570");
let MONTHS = buildFiscalMonths(selectedFiscalYear);
let selectedIndex = 0;
let minDate = "";
let maxDate = "";
let slots = [];
let bookings = [];
let customHolidays = [];

function normalizeSupabaseUrl(rawUrl) {
  const value = String(rawUrl || "").trim();
  if (!value) return "";
  try {
    const url = new URL(value);
    return `${url.protocol}//${url.host}`;
  } catch (error) {
    return value.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
  }
}

const el = {
  loginGate: document.querySelector("#loginGate"),
  appShell: document.querySelector("#appShell"),
  loginForm: document.querySelector("#loginForm"),
  passwordInput: document.querySelector("#passwordInput"),
  loginMessage: document.querySelector("#loginMessage"),
  statusText: document.querySelector("#statusText"),
  tabButtons: document.querySelectorAll(".tab"),
  panels: document.querySelectorAll(".panel"),
  search: document.querySelector("#search"),
  fiscalYearSelect: document.querySelector("#fiscalYearSelect"),
  reloadBtn: document.querySelector("#reloadBtn"),
  yearOverview: document.querySelector("#yearOverview"),
  slotForm: document.querySelector("#slotForm"),
  slotLabel: document.querySelector("#slotLabel"),
  slotStart: document.querySelector("#slotStart"),
  bookingForm: document.querySelector("#bookingForm"),
  bookingSlot: document.querySelector("#bookingSlot"),
  bookingName: document.querySelector("#bookingName"),
  openSlotList: document.querySelector("#openSlotList"),
  drawList: document.querySelector("#drawList"),
  winnerSummary: document.querySelector("#winnerSummary"),
  recentList: document.querySelector("#recentList"),
  holidayForm: document.querySelector("#holidayForm"),
  holidayName: document.querySelector("#holidayName"),
  holidayDate: document.querySelector("#holidayDate"),
  note: document.querySelector("#note")
};

populateFiscalYearSelect();
syncDateBounds();

el.loginForm.addEventListener("submit", event => {
  event.preventDefault();
  if (el.passwordInput.value === APP_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, "1");
    unlockApp();
  } else {
    el.loginMessage.textContent = "รหัสผ่านไม่ถูกต้อง";
    el.passwordInput.select();
  }
});

el.tabButtons.forEach(button => button.addEventListener("click", () => setTab(button.dataset.tab)));
el.search.addEventListener("input", render);
el.reloadBtn.addEventListener("click", loadData);
el.fiscalYearSelect.addEventListener("change", () => {
  selectedFiscalYear = Number(el.fiscalYearSelect.value);
  localStorage.setItem(YEAR_KEY, String(selectedFiscalYear));
  MONTHS = buildFiscalMonths(selectedFiscalYear);
  syncDateBounds();
  render();
});
el.slotForm.addEventListener("submit", createSlot);
el.bookingForm.addEventListener("submit", createBooking);
el.holidayForm.addEventListener("submit", createHoliday);

if (sessionStorage.getItem(AUTH_KEY) === "1") unlockApp();
else el.passwordInput.focus();

function unlockApp() {
  el.loginGate.classList.add("is-unlocked");
  el.appShell.classList.remove("is-locked");
  loadData();
}

function setTab(name) {
  el.tabButtons.forEach(button => button.classList.toggle("is-active", button.dataset.tab === name));
  el.panels.forEach(panel => panel.classList.toggle("is-active", panel.dataset.panel === name));
}

async function loadData() {
  try {
    if (hasSupabase) {
      const [slotRes, bookingRes, holidayRes] = await Promise.all([
        db.from("loc_slots").select("*").order("start_date", { ascending: true }),
        db.from("loc_bookings").select("*").order("created_at", { ascending: true }),
        db.from("special_holidays").select("*").order("holiday_date", { ascending: true })
      ]);
      if (slotRes.error) throw slotRes.error;
      if (bookingRes.error) throw bookingRes.error;
      if (holidayRes.error) throw holidayRes.error;
      slots = slotRes.data || [];
      bookings = bookingRes.data || [];
      customHolidays = holidayRes.data || [];
    } else {
      slots = readLocal(VAC_KEY);
      bookings = readLocal(BOOKING_KEY);
      customHolidays = readLocal(HOLIDAY_KEY);
    }
    render();
  } catch (error) {
    el.statusText.textContent = `โหลดข้อมูลไม่สำเร็จ: ${error.message}`;
  }
}

async function createSlot(event) {
  event.preventDefault();
  const start = el.slotStart.value;
  if (!start) return;
  const end = addDays(start, LOCK_DAYS - 1);
  const item = {
    label: el.slotLabel.value.trim() || `Loc ${formatShort(start)}-${formatShort(end)}`,
    start_date: start,
    end_date: end,
    winner_name: null,
    status: "open"
  };
  if (hasSupabase) {
    const { error } = await db.from("loc_slots").insert(item);
    if (error) return alert(error.message);
  } else {
    slots.push({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...item });
    writeLocal(VAC_KEY, slots);
  }
  el.slotLabel.value = "";
  await loadData();
}

async function createBooking(event) {
  event.preventDefault();
  const item = {
    slot_id: el.bookingSlot.value,
    person_name: el.bookingName.value.trim()
  };
  if (!item.slot_id || !item.person_name) return;
  if (hasSupabase) {
    const { error } = await db.from("loc_bookings").insert(item);
    if (error) return alert(error.message);
  } else {
    bookings.push({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...item });
    writeLocal(BOOKING_KEY, bookings);
  }
  el.bookingName.value = "";
  await loadData();
}

async function createHoliday(event) {
  event.preventDefault();
  const item = { name: el.holidayName.value.trim(), holiday_date: el.holidayDate.value };
  if (!item.name || !item.holiday_date) return;
  if (hasSupabase) {
    const { error } = await db.from("special_holidays").insert(item);
    if (error) return alert(error.message);
  } else {
    customHolidays.push({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...item });
    writeLocal(HOLIDAY_KEY, customHolidays);
  }
  el.holidayName.value = "";
  await loadData();
}

async function drawSlot(slotId) {
  const slotBookings = bookings.filter(item => item.slot_id === slotId);
  if (!slotBookings.length) return alert("ยังไม่มีคนจอง Loc นี้");
  const winner = slotBookings[Math.floor(Math.random() * slotBookings.length)].person_name;
  await setWinner(slotId, winner);
}

async function chooseWinner(slotId, winner) {
  if (!winner) return alert("กรุณาเลือกชื่อผู้ได้ Loc");
  await setWinner(slotId, winner);
}

async function setWinner(slotId, winner) {
  if (hasSupabase) {
    const { error } = await db.from("loc_slots").update({ winner_name: winner, status: "drawn" }).eq("id", slotId);
    if (error) return alert(error.message);
  } else {
    slots = slots.map(slot => slot.id === slotId ? { ...slot, winner_name: winner, status: "drawn" } : slot);
    writeLocal(VAC_KEY, slots);
  }
  await loadData();
}

async function deleteItem(type, id) {
  if (!confirm("ลบรายการนี้?")) return;
  if (hasSupabase) {
    const table = type === "slot" ? "loc_slots" : type === "booking" ? "loc_bookings" : "special_holidays";
    const { error } = await db.from(table).delete().eq("id", id);
    if (error) return alert(error.message);
  } else if (type === "slot") {
    slots = slots.filter(item => item.id !== id);
    bookings = bookings.filter(item => item.slot_id !== id);
    writeLocal(VAC_KEY, slots); writeLocal(BOOKING_KEY, bookings);
  } else if (type === "booking") {
    bookings = bookings.filter(item => item.id !== id);
    writeLocal(BOOKING_KEY, bookings);
  } else {
    customHolidays = customHolidays.filter(item => item.id !== id);
    writeLocal(HOLIDAY_KEY, customHolidays);
  }
  await loadData();
}

function render() {
  const yearSlots = slots.filter(slot => overlapsFiscalYear(slot.start_date, slot.end_date));
  const slotDays = expandSlots(yearSlots);
  const slotDayMap = groupByDate(slotDays);
  const holidayMap = groupHolidays();
  const query = el.search.value.trim().toLowerCase();
  const filteredSlots = yearSlots.filter(slot => {
    const candidates = bookings.filter(item => item.slot_id === slot.id).map(item => item.person_name).join(" ");
    return `${slot.label} ${slot.start_date} ${slot.end_date} ${slot.winner_name || ""} ${candidates}`.toLowerCase().includes(query);
  });
  const bookingCount = bookings.filter(item => yearSlots.some(slot => slot.id === item.slot_id)).length;
  el.statusText.textContent = `${hasSupabase ? "ออนไลน์/Supabase" : "ทดลองในเครื่อง/localStorage"} · ปี ${selectedFiscalYear} · Loc ${yearSlots.length} รายการ · ผู้จอง ${bookingCount} รายชื่อ`;
  el.note.textContent = `1 Loc = ${LOCK_DAYS} วัน · Loc หนึ่งจองได้หลายคน แล้วจับฉลากเลือกผู้ได้ Loc ตอนหน้างาน`;
  renderBookingOptions(yearSlots);
  renderYear(slotDayMap, holidayMap);
  renderOpenSlots(filteredSlots);
  renderDrawList(filteredSlots);
  renderSummary(yearSlots);
  renderRecent(yearSlots);
}

function renderBookingOptions(yearSlots) {
  const openSlots = yearSlots.filter(slot => slot.status !== "drawn");
  el.bookingSlot.innerHTML = openSlots.map(slot => `<option value="${slot.id}">${escapeHtml(slot.label)} · ${formatDate(slot.start_date)} - ${formatDate(slot.end_date)}</option>`).join("");
}

function renderYear(slotDayMap, holidayMap) {
  const cells = [`<div class="year-cell day-head">เดือน</div>`];
  for (let day = 1; day <= 31; day++) cells.push(`<div class="year-cell day-head">${day}</div>`);
  MONTHS.forEach((month, index) => {
    const lastDay = new Date(month.adYear, month.month, 0).getDate();
    cells.push(`<div class="year-cell month-label" style="background:${monthColors[index]}">${thMonthFull[month.month - 1]} ${month.beYear}</div>`);
    for (let day = 1; day <= 31; day++) {
      if (day > lastDay) { cells.push(`<div class="year-cell invalid"></div>`); continue; }
      const date = new Date(month.adYear, month.month - 1, day);
      const key = iso(date);
      const daySlots = slotDayMap.get(key) || [];
      const holidays = holidayMap.get(key) || [];
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const winner = daySlots.find(item => item.winner_name)?.winner_name;
      const classes = ["year-cell", isWeekend ? "weekend" : "", daySlots.length ? "has-slot" : "", winner ? "has-winner" : "", holidays.length ? "has-holiday" : ""].filter(Boolean).join(" ");
      const label = winner ? winner : daySlots.length ? `จอง ${candidateCount(daySlots[0].id)} คน` : holidays.length ? `หยุด ${displayNames(holidays.map(h => h.name))}` : "";
      cells.push(`<button class="${classes}" type="button"><span class="weekday-mini">${thDays[date.getDay()]}</span>${label ? `<span class="cell-label">${escapeHtml(label)}</span>` : ""}</button>`);
    }
  });
  el.yearOverview.innerHTML = cells.join("");
}

function renderOpenSlots(items) {
  el.openSlotList.innerHTML = items.length ? items.map(slotCard).join("") : `<div class="card slot-card">ยังไม่มี Loc ที่เปิดจองในปีนี้</div>`;
  bindSlotActions(el.openSlotList);
}

function renderDrawList(items) {
  el.drawList.innerHTML = items.length ? items.map(slotCard).join("") : `<div class="card slot-card">ยังไม่มี Loc สำหรับจับฉลาก</div>`;
  bindSlotActions(el.drawList);
}

function slotCard(slot) {
  const slotBookings = bookings.filter(item => item.slot_id === slot.id);
  const candidates = slotBookings.map(item => escapeHtml(item.person_name)).join(", ") || "ยังไม่มีผู้จอง";
  const winnerOptions = slotBookings.map(item => {
    const selected = item.person_name === slot.winner_name ? "selected" : "";
    return `<option value="${escapeHtml(item.person_name)}" ${selected}>${escapeHtml(item.person_name)}</option>`;
  }).join("");
  return `
    <article class="slot-card">
      <div class="slot-top">
        <div>
          <div class="slot-title">${escapeHtml(slot.label)}</div>
          <div class="slot-meta">${formatDate(slot.start_date)} - ${formatDate(slot.end_date)} · ${slotBookings.length} คนจอง</div>
          <div class="candidate-list">${candidates}</div>
          ${slot.winner_name ? `<div class="winner">ผู้ได้ Loc: ${escapeHtml(slot.winner_name)}</div>` : ""}
        </div>
        <div class="actions">
          <button class="btn draw" type="button" data-draw="${slot.id}">จับฉลาก</button>
          <button class="btn danger" type="button" data-delete-slot="${slot.id}">ลบ Loc</button>
        </div>
      </div>
      ${slotBookings.length ? `
        <div class="manual-winner">
          <select class="input compact-input" data-winner-select="${slot.id}">
            <option value="">เลือกผู้ได้ Loc เอง</option>
            ${winnerOptions}
          </select>
          <button class="btn" type="button" data-choose-winner="${slot.id}">บันทึกผู้ได้</button>
        </div>
      ` : ""}
    </article>
  `;
}

function bindSlotActions(root) {
  root.querySelectorAll("[data-draw]").forEach(btn => btn.addEventListener("click", () => drawSlot(btn.dataset.draw)));
  root.querySelectorAll("[data-choose-winner]").forEach(btn => {
    btn.addEventListener("click", () => {
      const select = root.querySelector(`[data-winner-select="${CSS.escape(btn.dataset.chooseWinner)}"]`);
      chooseWinner(btn.dataset.chooseWinner, select?.value || "");
    });
  });
  root.querySelectorAll("[data-delete-slot]").forEach(btn => btn.addEventListener("click", () => deleteItem("slot", btn.dataset.deleteSlot)));
}

function renderSummary(yearSlots) {
  const counts = new Map();
  yearSlots.filter(slot => slot.winner_name).forEach(slot => counts.set(slot.winner_name, (counts.get(slot.winner_name) || 0) + 1));
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "th"));
  el.winnerSummary.innerHTML = rows.length
    ? rows.map(([name, count]) => `<div class="person-row"><strong>${escapeHtml(name)}</strong><span>${count} ล็อค</span></div>`).join("")
    : `<div class="slot-card">ยังไม่มีผลจับฉลาก</div>`;
}

function renderRecent(yearSlots) {
  const rows = [...yearSlots].slice(-6).reverse().map(slot => `<div class="slot-card"><strong>${escapeHtml(slot.label)}</strong><span>${formatDate(slot.start_date)} - ${formatDate(slot.end_date)}</span></div>`);
  el.recentList.innerHTML = rows.join("") || `<div class="slot-card">ยังไม่มีรายการ</div>`;
}

function expandSlots(items) {
  const days = [];
  items.forEach(slot => {
    for (let date = new Date(`${slot.start_date}T00:00:00`); date <= new Date(`${slot.end_date}T00:00:00`); date.setDate(date.getDate() + 1)) {
      days.push({ date: iso(date), ...slot });
    }
  });
  return days;
}

function groupByDate(items) {
  const map = new Map();
  items.forEach(item => { if (!map.has(item.date)) map.set(item.date, []); map.get(item.date).push(item); });
  return map;
}

function groupHolidays() {
  const all = [...BASE_HOLIDAYS.map(([holiday_date, name]) => ({ holiday_date, name })), ...customHolidays];
  const map = new Map();
  all.forEach(item => {
    if (!isInSelectedFiscalYear(item.holiday_date)) return;
    if (!map.has(item.holiday_date)) map.set(item.holiday_date, []);
    map.get(item.holiday_date).push(item);
  });
  return map;
}

function buildFiscalMonths(fiscalYearBe) {
  const prevBe = fiscalYearBe - 1, prevAd = prevBe - 543, currentAd = fiscalYearBe - 543;
  return [
    { beYear: prevBe, adYear: prevAd, month: 10 }, { beYear: prevBe, adYear: prevAd, month: 11 }, { beYear: prevBe, adYear: prevAd, month: 12 },
    { beYear: fiscalYearBe, adYear: currentAd, month: 1 }, { beYear: fiscalYearBe, adYear: currentAd, month: 2 }, { beYear: fiscalYearBe, adYear: currentAd, month: 3 },
    { beYear: fiscalYearBe, adYear: currentAd, month: 4 }, { beYear: fiscalYearBe, adYear: currentAd, month: 5 }, { beYear: fiscalYearBe, adYear: currentAd, month: 6 },
    { beYear: fiscalYearBe, adYear: currentAd, month: 7 }, { beYear: fiscalYearBe, adYear: currentAd, month: 8 }, { beYear: fiscalYearBe, adYear: currentAd, month: 9 }
  ];
}

function populateFiscalYearSelect() {
  let html = "";
  for (let year = selectedFiscalYear - 1; year <= selectedFiscalYear + 4; year++) html += `<option value="${year}">ปี ${year}</option>`;
  el.fiscalYearSelect.innerHTML = html;
  el.fiscalYearSelect.value = String(selectedFiscalYear);
}

function syncDateBounds() {
  const first = MONTHS[0], last = MONTHS[MONTHS.length - 1];
  const minDate = `${first.adYear}-${String(first.month).padStart(2, "0")}-01`;
  const maxDate = iso(new Date(last.adYear, last.month, 0));
  for (const input of [el.slotStart, el.holidayDate]) {
    input.min = minDate; input.max = maxDate;
    if (!input.value || input.value < minDate || input.value > maxDate) input.value = minDate;
  }
}

function isInSelectedFiscalYear(dateText) {
  const first = MONTHS[0], last = MONTHS[MONTHS.length - 1];
  const min = `${first.adYear}-${String(first.month).padStart(2, "0")}-01`;
  const max = iso(new Date(last.adYear, last.month, 0));
  return dateText >= min && dateText <= max;
}

function overlapsFiscalYear(start, end) {
  const first = MONTHS[0], last = MONTHS[MONTHS.length - 1];
  const min = `${first.adYear}-${String(first.month).padStart(2, "0")}-01`;
  const max = iso(new Date(last.adYear, last.month, 0));
  return start <= max && end >= min;
}

function readLocal(key) { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } }
function writeLocal(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function addDays(dateText, days) { const d = new Date(`${dateText}T00:00:00`); d.setDate(d.getDate() + days); return iso(d); }
function iso(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function formatDate(dateText) { return longDate.format(new Date(`${dateText}T00:00:00`)); }
function formatShort(dateText) { const d = new Date(`${dateText}T00:00:00`); return `${d.getDate()} ${thMonthFull[d.getMonth()]}`; }
function candidateCount(slotId) { return bookings.filter(item => item.slot_id === slotId).length; }
function displayNames(names) { const clean = [...new Set(names.filter(Boolean))]; return clean.length <= 2 ? clean.join(", ") : `${clean[0]}, ${clean[1]} +${clean.length - 2}`; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[ch]); }
