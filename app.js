const APP_PASSWORD = "locsee2570";
const AUTH_KEY = "locsee.booking.auth";
const YEAR_KEY = "locsee.booking.year";
const THEME_KEY = "locsee.booking.theme";
const LOCK_DAYS = 5;
const VACATION_ALLOWANCE_DAYS = 10;
const HOSPITAL_ALLOWANCE_DAYS = 5;
const TOTAL_ALLOWANCE_DAYS = VACATION_ALLOWANCE_DAYS + HOSPITAL_ALLOWANCE_DAYS;
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
  logoutBtn: document.querySelector("#logoutBtn"),
  tabButtons: document.querySelectorAll(".tab"),
  panels: document.querySelectorAll(".panel"),
  search: document.querySelector("#search"),
  fiscalYearSelect: document.querySelector("#fiscalYearSelect"),
  themeSelect: document.querySelector("#themeSelect"),
  reloadBtn: document.querySelector("#reloadBtn"),
  yearOverview: document.querySelector("#yearOverview"),
  monthView: document.querySelector("#monthView"),
  dayDetails: document.querySelector("#dayDetails"),
  slotForm: document.querySelector("#slotForm"),
  slotStart: document.querySelector("#slotStart"),
  slotLeaveDays: document.querySelector("#slotLeaveDays"),
  directWinnerName: document.querySelector("#directWinnerName"),
  bookingForm: document.querySelector("#bookingForm"),
  bookingSlot: document.querySelector("#bookingSlot"),
  bookingStart: document.querySelector("#bookingStart"),
  bookingLeaveDays: document.querySelector("#bookingLeaveDays"),
  bookingName: document.querySelector("#bookingName"),
  openSlotList: document.querySelector("#openSlotList"),
  drawList: document.querySelector("#drawList"),
  winnerSummary: document.querySelector("#winnerSummary"),
  recentList: document.querySelector("#recentList"),
  holidayForm: document.querySelector("#holidayForm"),
  holidaySummary: document.querySelector("#holidaySummary"),
  holidayName: document.querySelector("#holidayName"),
  holidayDate: document.querySelector("#holidayDate"),
  note: document.querySelector("#note")
};

populateFiscalYearSelect();
applySavedTheme();
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
el.logoutBtn.addEventListener("click", logoutApp);
el.reloadBtn.addEventListener("click", loadData);
el.themeSelect.addEventListener("change", () => {
  applyTheme(el.themeSelect.value);
  localStorage.setItem(THEME_KEY, el.themeSelect.value);
});
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

function logoutApp() {
  sessionStorage.removeItem(AUTH_KEY);
  el.passwordInput.value = "";
  el.loginMessage.textContent = "";
  el.loginGate.classList.remove("is-unlocked");
  el.appShell.classList.add("is-locked");
  el.passwordInput.focus();
}

function setTab(name) {
  el.tabButtons.forEach(button => button.classList.toggle("is-active", button.dataset.tab === name));
  el.panels.forEach(panel => panel.classList.toggle("is-active", panel.dataset.panel === name));
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "soft";
  applyTheme(savedTheme);
  el.themeSelect.value = savedTheme;
}

function applyTheme(themeName) {
  const allowedThemes = ["soft", "mint", "pink", "contrast"];
  document.body.dataset.theme = allowedThemes.includes(themeName) ? themeName : "soft";
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
  if (!validateMonday(start, el.slotStart)) return;
  const leaveDays = normalizeLeaveDays(el.slotLeaveDays.value);
  const end = addBusinessDays(start, leaveDays);
  const candidateNames = parseNames(el.directWinnerName.value);
  const saved = await findOrCreateOpenSlot({
    label: defaultSlotLabel(start, end),
    start_date: start,
    end_date: end,
    leave_days: leaveDays,
    winner_name: null,
    status: "open"
  });
  if (!saved) return;
  if (candidateNames.length) {
    const ok = await saveBookings(saved.id, candidateNames);
    if (!ok) return;
  }
  el.directWinnerName.value = "";
  await loadData();
}

async function createBooking(event) {
  event.preventDefault();
  const personName = el.bookingName.value.trim();
  if (!personName) return;
  const slotId = await resolveBookingSlotId();
  if (!slotId) return;
  const ok = await saveBookings(slotId, [personName]);
  if (!ok) return;
  el.bookingName.value = "";
  el.bookingStart.value = "";
  await loadData();
}

async function saveBookings(slotId, names) {
  const cleanNames = [...new Set(names.map(name => name.trim()).filter(Boolean))];
  const existingNames = bookings.filter(item => item.slot_id === slotId).map(item => item.person_name.trim().toLowerCase());
  const newNames = cleanNames.filter(name => !existingNames.includes(name.toLowerCase()));
  if (!newNames.length) return true;
  const slot = slots.find(item => item.id === slotId);
  const rows = newNames.map(name => ({ slot_id: slotId, person_name: name, leave_days: slotLeaveDays(slot) }));
  if (hasSupabase) {
    const { error } = await db.from("loc_bookings").insert(rows);
    if (error) {
      alert(error.message);
      return false;
    }
  } else {
    rows.forEach(item => bookings.push({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...item }));
    writeLocal(BOOKING_KEY, bookings);
  }
  return true;
}

async function resolveBookingSlotId() {
  if (el.bookingSlot.value) return el.bookingSlot.value;
  const start = el.bookingStart.value;
  if (!start) {
    alert("กรุณาเลือก Loc ที่เปิดไว้ หรือเลือกวันเริ่ม Loc ที่ต้องการจอง");
    el.bookingStart.focus();
    return "";
  }
  if (!validateMonday(start, el.bookingStart)) return "";
  const leaveDays = normalizeLeaveDays(el.bookingLeaveDays.value);
  const end = addBusinessDays(start, leaveDays);
  const existing = slots.find(slot => slot.start_date === start && slot.end_date === end && slotLeaveDays(slot) === leaveDays && slot.status !== "drawn");
  if (existing) return existing.id;
  const saved = await findOrCreateOpenSlot({
    label: defaultSlotLabel(start, end),
    start_date: start,
    end_date: end,
    leave_days: leaveDays,
    winner_name: null,
    status: "open"
  });
  return saved?.id || "";
}

async function findOrCreateOpenSlot(item) {
  const existing = slots.find(slot => slot.start_date === item.start_date && slot.end_date === item.end_date && slotLeaveDays(slot) === slotLeaveDays(item) && slot.status !== "drawn");
  if (existing) return existing;
  return saveSlot(item);
}

async function saveSlot(item) {
  if (hasSupabase) {
    const { data, error } = await db.from("loc_slots").insert(item).select("id").single();
    if (error) {
      alert(error.message);
      return null;
    }
    return { id: data.id, ...item };
  }
  const saved = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...item };
  slots.push(saved);
  writeLocal(VAC_KEY, slots);
  return saved;
}

async function updateSlotLeaveDays(slotId, value) {
  const leaveDays = normalizeLeaveDays(value);
  if (hasSupabase) {
    const { error } = await db.from("loc_slots").update({ leave_days: leaveDays }).eq("id", slotId);
    if (error) {
      alert(error.message);
      return;
    }
  } else {
    slots = slots.map(slot => slot.id === slotId ? { ...slot, leave_days: leaveDays } : slot);
    writeLocal(VAC_KEY, slots);
  }
  await loadData();
}

async function updatePersonLeaveDays(slotId, personName, value) {
  const leaveDays = normalizeLeaveDays(value);
  const booking = bookingForPerson(slotId, personName);
  if (!booking) {
    alert("ยังไม่พบชื่อผู้จองคนนี้ใน Loc นี้");
    return;
  }
  if (hasSupabase) {
    const { error } = await db.from("loc_bookings").update({ leave_days: leaveDays }).eq("id", booking.id);
    if (error) {
      alert(error.message);
      return;
    }
  } else {
    bookings = bookings.map(item => item.id === booking.id ? { ...item, leave_days: leaveDays } : item);
    writeLocal(BOOKING_KEY, bookings);
  }
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

async function drawSlot(slotId, winnerCount = 1) {
  const slotBookings = bookings.filter(item => item.slot_id === slotId);
  if (!slotBookings.length) return alert("ยังไม่มีคนจอง Loc นี้");
  const count = Math.max(1, Math.min(Number(winnerCount) || 1, slotBookings.length));
  const shuffled = [...slotBookings].sort(() => Math.random() - 0.5);
  const winners = shuffled.slice(0, count).map(item => item.person_name);
  await setWinner(slotId, joinWinners(winners));
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

async function clearWinner(slotId) {
  if (hasSupabase) {
    const { error } = await db.from("loc_slots").update({ winner_name: null, status: "open" }).eq("id", slotId);
    if (error) return alert(error.message);
  } else {
    slots = slots.map(slot => slot.id === slotId ? { ...slot, winner_name: null, status: "open" } : slot);
    writeLocal(VAC_KEY, slots);
  }
}

async function moveWinnerToBookings(slotId) {
  const slot = slots.find(item => item.id === slotId);
  const names = splitWinners(slot?.winner_name);
  if (!slot || !names.length) return;
  const ok = await saveBookings(slotId, names);
  if (!ok) return;
  await clearWinner(slotId);
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
  const filteredSlots = yearSlots.filter(slot => slotMatchesQuery(slot, query));
  const bookingCount = bookings.filter(item => yearSlots.some(slot => slot.id === item.slot_id)).length;
  el.statusText.textContent = `${hasSupabase ? "ออนไลน์/Supabase" : "ทดลองในเครื่อง/localStorage"} · ปี ${selectedFiscalYear} · Loc ${yearSlots.length} รายการ · ผู้จอง ${bookingCount} รายชื่อ`;
  el.note.textContent = `นับเฉพาะวันทำการ ไม่นับเสาร์-อาทิตย์ · สิทธิพื้นฐาน ${VACATION_ALLOWANCE_DAYS}+${HOSPITAL_ALLOWANCE_DAYS} = ${TOTAL_ALLOWANCE_DAYS} วันต่อคน · Loc หนึ่งจองได้หลายคน`;
  renderBookingOptions(yearSlots);
  renderYear(slotDayMap, holidayMap, query);
  renderMonthView(0, slotDayMap, holidayMap);
  renderSearchDetails(query, filteredSlots, holidayMap);
  renderOpenSlots(filteredSlots);
  renderDrawList(filteredSlots);
  renderSummary(yearSlots);
  renderHolidaySummary();
  renderRecent(yearSlots);
}

function renderBookingOptions(yearSlots) {
  const openSlots = yearSlots.filter(slot => slot.status !== "drawn");
  el.bookingSlot.innerHTML = [
    `<option value="">เลือกจาก Loc ที่เปิดไว้ หรือเลือกวันเริ่มด้านล่าง</option>`,
    ...openSlots.map(slot => `<option value="${slot.id}">${escapeHtml(slotDateLabel(slot))}</option>`)
  ].join("");
}

function renderYear(slotDayMap, holidayMap, query = "") {
  const cells = [`<div class="year-cell day-head">เดือน</div>`];
  for (let day = 1; day <= 31; day++) cells.push(`<div class="year-cell day-head">${day}</div>`);
  MONTHS.forEach((month, index) => {
    const lastDay = new Date(month.adYear, month.month, 0).getDate();
    cells.push(`<button class="year-cell month-label month-link" type="button" data-month-index="${index}" style="background:${monthColors[index]}">${thMonthFull[month.month - 1]} ${month.beYear}</button>`);
    for (let day = 1; day <= 31; day++) {
      if (day > lastDay) { cells.push(`<div class="year-cell invalid"></div>`); continue; }
      const date = new Date(month.adYear, month.month - 1, day);
      const key = iso(date);
      const daySlots = slotDayMap.get(key) || [];
      const holidays = holidayMap.get(key) || [];
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const winner = uniqueNames(daySlots.flatMap(item => splitWinners(item.winner_name)));
      const hasInfo = daySlots.length || holidays.length;
      const isHit = query && (daySlots.some(slot => slotMatchesQuery(slot, query)) || holidays.some(item => holidayMatchesQuery(item, query)));
      const isMuted = query && hasInfo && !isHit;
      const classes = ["year-cell", isWeekend ? "weekend" : "", daySlots.length ? "has-slot" : "", winner.length ? "has-winner" : "", holidays.length ? "has-holiday" : "", isHit ? "search-hit" : "", isMuted ? "search-muted" : ""].filter(Boolean).join(" ");
      const label = winner.length ? winner.slice(0, 2).join("\n") : daySlots.length ? `จอง ${candidateCount(daySlots[0].id)} คน` : holidays.length ? `หยุด ${displayNames(holidays.map(h => h.name))}` : "";
      const dateAttr = daySlots.length || holidays.length ? ` data-detail-date="${key}"` : "";
      cells.push(`<button class="${classes}" type="button"${dateAttr}><span class="weekday-mini">${thDays[date.getDay()]}</span>${label ? `<span class="cell-label">${escapeHtml(label)}</span>` : ""}</button>`);
    }
  });
  el.yearOverview.innerHTML = cells.join("");
  el.yearOverview.querySelectorAll("[data-month-index]").forEach(button => {
    button.addEventListener("click", () => {
      renderMonthView(Number(button.dataset.monthIndex), slotDayMap, holidayMap);
      el.monthView.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  el.yearOverview.querySelectorAll("[data-detail-date]").forEach(button => {
    button.addEventListener("click", () => showDayDetails(button.dataset.detailDate, slotDayMap, holidayMap));
  });
}

function renderMonthView(monthIndex, slotDayMap, holidayMap) {
  const month = MONTHS[monthIndex] || MONTHS[0];
  const lastDay = new Date(month.adYear, month.month, 0).getDate();
  const cells = [];
  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(month.adYear, month.month - 1, day);
    const key = iso(date);
    const daySlots = slotDayMap.get(key) || [];
    const holidays = holidayMap.get(key) || [];
    const winners = uniqueNames(daySlots.flatMap(item => splitWinners(item.winner_name)));
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const classes = ["month-day", isWeekend ? "weekend" : "", daySlots.length ? "has-slot" : "", winners.length ? "has-winner" : "", holidays.length ? "has-holiday" : ""].filter(Boolean).join(" ");
    const label = winners.length ? winners.slice(0, 3).join(", ") : daySlots.length ? `จอง ${candidateCount(daySlots[0].id)} คน` : holidays.length ? displayNames(holidays.map(h => h.name)) : "";
    cells.push(`
      <button class="${classes}" type="button" ${daySlots.length || holidays.length ? `data-detail-date="${key}"` : ""}>
        <strong>${day}</strong>
        <span>${thDays[date.getDay()]}</span>
        ${label ? `<small>${escapeHtml(label)}</small>` : ""}
      </button>
    `);
  }
  el.monthView.innerHTML = `
    <div class="month-view-head">
      <h2>${thMonthFull[month.month - 1]} ${month.beYear}</h2>
      <span>มุมมองรายเดือน</span>
    </div>
    <div class="month-grid">${cells.join("")}</div>
  `;
  el.monthView.querySelectorAll("[data-detail-date]").forEach(button => {
    button.addEventListener("click", () => showDayDetails(button.dataset.detailDate, slotDayMap, holidayMap));
  });
}

function renderSearchDetails(query, matchedSlots, holidayMap) {
  if (!query) {
    el.dayDetails.innerHTML = `
      <strong>กดช่องในตารางเพื่อดูรายละเอียด</strong>
      <span>หรือพิมพ์ชื่อ / วันที่ในช่องค้นหาเพื่อไฮไลต์รายการบนตาราง</span>
    `;
    return;
  }
  const matchedHolidays = [...holidayMap.values()].flat().filter(item => holidayMatchesQuery(item, query));
  const detailGroups = groupSlotsForDetails(matchedSlots);
  const slotRows = detailGroups.map(detailGroupRow).join("");
  const holidayRows = matchedHolidays.map(item => `
    <div class="detail-row holiday-row">
      <strong>วันหยุดพิเศษ</strong>
      <span>${escapeHtml(item.name)}</span>
      <small>${formatDate(item.holiday_date)}</small>
    </div>
  `).join("");
  const total = detailGroups.length + matchedHolidays.length;
  el.dayDetails.innerHTML = `
    <div class="detail-head">
      <strong>ผลค้นหา: ${escapeHtml(query)}</strong>
      <span>${total ? `${total} รายการ` : "ไม่พบรายการ"}</span>
    </div>
    <div class="detail-list">${slotRows}${holidayRows || ""}</div>
  `;
  if (!total) el.dayDetails.querySelector(".detail-list").innerHTML = `<div class="detail-row"><strong>ไม่พบข้อมูลที่ตรงกัน</strong><span>ลองค้นด้วยชื่อเล่นหรือวันที่ เช่น 12/01/2570</span></div>`;
  el.dayDetails.querySelectorAll("[data-book-slot]").forEach(button => {
    button.addEventListener("click", () => selectSlotForBooking(button.dataset.bookSlot));
  });
}

function showDayDetails(dateText, slotDayMap, holidayMap) {
  const daySlots = slotDayMap.get(dateText) || [];
  const holidays = holidayMap.get(dateText) || [];
  const detailGroups = groupSlotsForDetails(daySlots);
  const slotRows = detailGroups.map(detailGroupRow).join("");
  const holidayRows = holidays.map(item => `
    <div class="detail-row holiday-row">
      <strong>วันหยุดพิเศษ</strong>
      <span>${escapeHtml(item.name)}</span>
    </div>
  `).join("");
  el.dayDetails.innerHTML = `
    <div class="detail-head">
      <strong>${formatDate(dateText)}</strong>
      <span>${detailGroups.length ? `${detailGroups.length} Loc` : ""}${detailGroups.length && holidays.length ? " · " : ""}${holidays.length ? `${holidays.length} วันหยุด` : ""}</span>
    </div>
    <div class="detail-list">${slotRows}${holidayRows}</div>
  `;
  el.dayDetails.querySelectorAll("[data-book-slot]").forEach(button => {
    button.addEventListener("click", () => selectSlotForBooking(button.dataset.bookSlot));
  });
}

function selectSlotForBooking(slotId) {
  setTab("booking");
  el.bookingSlot.value = slotId;
  el.bookingStart.value = "";
  el.bookingName.focus();
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
  const winnerNames = splitWinners(slot.winner_name);
  const winnerOptions = slotBookings.map(item => {
    const selected = winnerNames.includes(item.person_name) ? "selected" : "";
    return `<option value="${escapeHtml(item.person_name)}" ${selected}>${escapeHtml(item.person_name)}</option>`;
  }).join("");
  const winnerLeaveRows = winnerNames.map(name => `
    <div class="winner-day-row">
      <strong>${escapeHtml(name)}</strong>
      <label class="mini-field">ใช้จริง
        <input class="input count-input" type="number" min="1" max="${LOCK_DAYS}" value="${personLeaveDays(slot, name)}" data-person-leave="${slot.id}" data-person-name="${escapeHtml(name)}">
      </label>
      <button class="btn small" type="button" data-save-person-leave="${slot.id}" data-person-name="${escapeHtml(name)}">บันทึก</button>
    </div>
  `).join("");
  return `
    <article class="slot-card">
      <div class="slot-top">
        <div>
          <div class="slot-title">${escapeHtml(slotDisplayTitle(slot))}</div>
          <div class="slot-meta">${slotDateLabel(slot)} · ${slotLeaveDays(slot)} วันลา · ${slotBookings.length} คนจอง</div>
          <div class="candidate-list">${candidates}</div>
        </div>
        <div class="actions">
          ${slotBookings.length && !winnerNames.length ? `
            <label class="mini-field">ผู้ได้
              <input class="input count-input" type="number" min="1" max="${slotBookings.length}" value="${Math.min(Math.max(winnerNames.length || 1, 1), slotBookings.length)}" data-winner-count="${slot.id}">
            </label>
            <button class="btn draw" type="button" data-draw="${slot.id}">จับฉลาก</button>
          ` : ""}
          ${!slotBookings.length && winnerNames.length ? `<button class="btn" type="button" data-move-winner="${slot.id}">ย้ายเป็นผู้จอง</button>` : ""}
          <button class="btn danger" type="button" data-delete-slot="${slot.id}">ลบ Loc</button>
        </div>
      </div>
      <div class="actual-days">
        <label class="mini-field">วันลาที่ใช้จริง
          <input class="input count-input" type="number" min="1" max="${LOCK_DAYS}" value="${slotLeaveDays(slot)}" data-leave-days="${slot.id}">
        </label>
        <span class="slot-meta">ค่าเริ่มต้นของรอบ Loc นี้</span>
        <button class="btn" type="button" data-save-leave="${slot.id}">บันทึกค่าเริ่มต้น</button>
      </div>
      ${winnerLeaveRows ? `<div class="winner-days">${winnerLeaveRows}</div>` : ""}
      ${slotBookings.length ? `
        ${winnerNames.length ? `
          <details class="manual-winner edit-winner">
            <summary>แก้ผล / จับใหม่</summary>
            <div class="manual-winner-fields">
              <label class="mini-field">ผู้ได้
                <input class="input count-input" type="number" min="1" max="${slotBookings.length}" value="${Math.min(Math.max(winnerNames.length || 1, 1), slotBookings.length)}" data-winner-count="${slot.id}">
              </label>
              <button class="btn draw" type="button" data-draw="${slot.id}">จับฉลากใหม่</button>
              <select class="input compact-input" data-winner-select="${slot.id}" multiple size="${Math.min(slotBookings.length, 4)}">
                ${winnerOptions}
              </select>
              <button class="btn" type="button" data-choose-winner="${slot.id}">บันทึกผู้ได้</button>
            </div>
          </details>
        ` : `
          <div class="manual-winner">
            <select class="input compact-input" data-winner-select="${slot.id}" multiple size="${Math.min(slotBookings.length, 4)}">
              ${winnerOptions}
            </select>
            <button class="btn" type="button" data-choose-winner="${slot.id}">บันทึกผู้ได้</button>
          </div>
        `}
      ` : ""}
    </article>
  `;
}

function bindSlotActions(root) {
  root.querySelectorAll("[data-draw]").forEach(btn => btn.addEventListener("click", () => {
    const input = root.querySelector(`[data-winner-count="${CSS.escape(btn.dataset.draw)}"]`);
    drawSlot(btn.dataset.draw, input?.value || 1);
  }));
  root.querySelectorAll("[data-save-leave]").forEach(btn => btn.addEventListener("click", () => {
    const input = root.querySelector(`[data-leave-days="${CSS.escape(btn.dataset.saveLeave)}"]`);
    updateSlotLeaveDays(btn.dataset.saveLeave, input?.value || LOCK_DAYS);
  }));
  root.querySelectorAll("[data-save-person-leave]").forEach(btn => btn.addEventListener("click", () => {
    const input = [...root.querySelectorAll("[data-person-leave]")]
      .find(item => item.dataset.personLeave === btn.dataset.savePersonLeave && item.dataset.personName === btn.dataset.personName);
    updatePersonLeaveDays(btn.dataset.savePersonLeave, btn.dataset.personName, input?.value || LOCK_DAYS);
  }));
  root.querySelectorAll("[data-choose-winner]").forEach(btn => {
    btn.addEventListener("click", () => {
      const select = root.querySelector(`[data-winner-select="${CSS.escape(btn.dataset.chooseWinner)}"]`);
      const winners = [...(select?.selectedOptions || [])].map(option => option.value);
      chooseWinner(btn.dataset.chooseWinner, joinWinners(winners));
    });
  });
  root.querySelectorAll("[data-delete-slot]").forEach(btn => btn.addEventListener("click", () => deleteItem("slot", btn.dataset.deleteSlot)));
  root.querySelectorAll("[data-move-winner]").forEach(btn => btn.addEventListener("click", () => moveWinnerToBookings(btn.dataset.moveWinner)));
}

function renderSummary(yearSlots) {
  const groups = new Map();
  yearSlots.forEach(slot => {
    splitWinners(slot.winner_name).forEach(name => {
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push({ slot, leaveDays: personLeaveDays(slot, name) });
    });
  });
  const rows = [...groups.entries()].sort((a, b) => sumLeaveDays(b[1]) - sumLeaveDays(a[1]) || a[0].localeCompare(b[0], "th"));
  el.winnerSummary.innerHTML = rows.length
    ? rows.map(([name, personItems], index) => `
      <div class="person-row compact">
        <span class="rank">${index + 1}</span>
        <strong>${escapeHtml(name)}</strong>
        <span class="count-pill">ใช้ ${sumLeaveDays(personItems)} / ${TOTAL_ALLOWANCE_DAYS} วัน</span>
        <small>คงเหลือ ${remainingLeaveDays(personItems)} วัน · ${personItems.length} ล็อค · ${escapeHtml(personItems.map(item => `${formatShort(item.slot.start_date)}-${formatShort(item.slot.end_date)} (${item.leaveDays}ว)`).join(", "))}</small>
      </div>
    `).join("")
    : `<div class="slot-card">ยังไม่มีผลจับฉลาก</div>`;
}

function renderHolidaySummary() {
  const holidayMap = groupHolidays();
  const rows = [...holidayMap.values()].flat().sort((a, b) => a.holiday_date.localeCompare(b.holiday_date));
  el.holidaySummary.innerHTML = rows.length
    ? rows.map(item => `
      <div class="holiday-item">
        <strong>${escapeHtml(item.name)}</strong>
        <span>${formatDate(item.holiday_date)}</span>
      </div>
    `).join("")
    : `<p class="hint">ยังไม่มีวันหยุดพิเศษในปีนี้</p>`;
}

function renderRecent(yearSlots) {
  const rows = [...yearSlots].slice(-6).reverse().map(slot => `<div class="slot-card"><strong>${escapeHtml(slotDisplayTitle(slot))}</strong><span>${slotDateLabel(slot)}</span></div>`);
  el.recentList.innerHTML = rows.join("") || `<div class="slot-card">ยังไม่มีรายการ</div>`;
}

function expandSlots(items) {
  const days = [];
  items.forEach(slot => {
    for (let date = new Date(`${slot.start_date}T00:00:00`); date <= new Date(`${slot.end_date}T00:00:00`); date.setDate(date.getDate() + 1)) {
      if (isWeekendDate(date)) continue;
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
  const firstMonday = nextMondayOnOrAfter(minDate);
  el.slotStart.min = minDate;
  el.slotStart.max = maxDate;
  el.bookingStart.min = minDate;
  el.bookingStart.max = maxDate;
  if (!el.slotStart.value || el.slotStart.value < minDate || el.slotStart.value > maxDate || !isMondayText(el.slotStart.value)) {
    el.slotStart.value = firstMonday;
  }
  if (el.bookingStart.value && (el.bookingStart.value < minDate || el.bookingStart.value > maxDate || !isMondayText(el.bookingStart.value))) {
    el.bookingStart.value = "";
  }
  el.holidayDate.min = minDate;
  el.holidayDate.max = maxDate;
  if (!el.holidayDate.value || el.holidayDate.value < minDate || el.holidayDate.value > maxDate) el.holidayDate.value = minDate;
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
function parseNames(value) {
  return value
    .split(/[\n,;]+/)
    .map(name => name.trim())
    .filter(Boolean);
}
function splitWinners(value) { return parseNames(value || ""); }
function joinWinners(names) { return [...new Set(names.map(name => name.trim()).filter(Boolean))].join(", "); }
function uniqueNames(names) { return [...new Set(names.map(name => name.trim()).filter(Boolean))]; }
function groupSlotsForDetails(items) {
  const groups = new Map();
  items.forEach(slot => {
    const key = `${slot.start_date}|${slot.end_date}|${slotLeaveDays(slot)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(slot);
  });
  return [...groups.values()];
}
function detailGroupRow(group) {
  const first = group[0];
  const groupBookings = uniqueNames(group.flatMap(slot => bookings.filter(item => item.slot_id === slot.id).map(item => item.person_name)));
  const groupWinners = uniqueNames(group.flatMap(slot => splitWinners(slot.winner_name)));
  const openSlot = group.find(slot => slot.status !== "drawn");
  const status = groupWinners.length ? `ผู้ได้ Loc: ${displayNames(groupWinners)}` : `รอจับฉลาก (${groupBookings.length} คนจอง)`;
  const bookButton = openSlot ? `<button class="btn small" type="button" data-book-slot="${openSlot.id}">จองรอบนี้</button>` : "";
  return `
    <div class="detail-row">
      <strong>${escapeHtml(status)}</strong>
      <span>${slotDateLabel(first)} · ${slotLeaveDays(first)} วัน</span>
      <small>ผู้จอง: ${escapeHtml(groupBookings.join(", ") || "ยังไม่มี")}</small>
      ${bookButton}
    </div>
  `;
}
function normalizeLeaveDays(value) { return Math.max(1, Math.min(Number(value) || LOCK_DAYS, LOCK_DAYS)); }
function slotLeaveDays(slot) { return normalizeLeaveDays(slot?.leave_days); }
function bookingForPerson(slotId, personName) {
  const target = String(personName || "").trim().toLowerCase();
  return bookings.find(item => item.slot_id === slotId && item.person_name.trim().toLowerCase() === target);
}
function personLeaveDays(slot, personName) {
  return normalizeLeaveDays(bookingForPerson(slot.id, personName)?.leave_days ?? slotLeaveDays(slot));
}
function sumLeaveDays(personItems) { return personItems.reduce((total, item) => total + (item.leaveDays ?? slotLeaveDays(item)), 0); }
function remainingLeaveDays(personItems) { return TOTAL_ALLOWANCE_DAYS - sumLeaveDays(personItems); }
function validateMonday(dateText, input) {
  if (isMondayText(dateText)) return true;
  alert("วันเริ่ม Loc ต้องเป็นวันจันทร์เท่านั้น เพราะ 1 Loc คือจันทร์-ศุกร์");
  input?.focus();
  return false;
}
function slotMatchesQuery(slot, query) {
  if (!query) return true;
  const candidates = bookings.filter(item => item.slot_id === slot.id).map(item => item.person_name).join(" ");
  return searchableText([
    slot.label,
    slot.start_date,
    slot.end_date,
    formatDate(slot.start_date),
    formatDate(slot.end_date),
    formatShort(slot.start_date),
    formatShort(slot.end_date),
    slot.winner_name || "",
    candidates
  ]).includes(query);
}
function holidayMatchesQuery(item, query) {
  if (!query) return true;
  return searchableText([item.name, item.holiday_date, formatDate(item.holiday_date), formatShort(item.holiday_date)]).includes(query);
}
function searchableText(parts) { return parts.join(" ").toLowerCase(); }
function defaultSlotLabel(start, end) { return `${formatShort(start)}-${formatShort(end)}`; }
function slotDateLabel(slot) { return `${formatDate(slot.start_date)} - ${formatDate(slot.end_date)}`; }
function slotDisplayTitle(slot) {
  if (slot.winner_name) return `ผู้ได้ Loc: ${slot.winner_name}`;
  const count = candidateCount(slot.id);
  return count ? `รอจับฉลาก (${count} คนจอง)` : "ยังไม่มีผู้จอง";
}
function addBusinessDays(dateText, count) {
  const date = new Date(`${dateText}T00:00:00`);
  let added = 0;
  while (added < count) {
    if (!isWeekendDate(date)) added += 1;
    if (added < count) date.setDate(date.getDate() + 1);
  }
  return iso(date);
}
function isMondayText(dateText) { return new Date(`${dateText}T00:00:00`).getDay() === 1; }
function nextMondayOnOrAfter(dateText) {
  const date = new Date(`${dateText}T00:00:00`);
  while (date.getDay() !== 1) date.setDate(date.getDate() + 1);
  return iso(date);
}
function isWeekendDate(date) { return date.getDay() === 0 || date.getDay() === 6; }
function addDays(dateText, days) { const d = new Date(`${dateText}T00:00:00`); d.setDate(d.getDate() + days); return iso(d); }
function iso(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function formatDate(dateText) { return longDate.format(new Date(`${dateText}T00:00:00`)); }
function formatShort(dateText) { const d = new Date(`${dateText}T00:00:00`); return `${d.getDate()} ${thMonthFull[d.getMonth()]}`; }
function candidateCount(slotId) { return bookings.filter(item => item.slot_id === slotId).length; }
function displayNames(names) { const clean = [...new Set(names.filter(Boolean))]; return clean.length <= 2 ? clean.join(", ") : `${clean[0]}, ${clean[1]} +${clean.length - 2}`; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[ch]); }
