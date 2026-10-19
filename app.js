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
const USER_KEY = "locsee.booking.user";
const STAFF_LOCAL_KEY = "locsee.booking.staff";
const LOG_LOCAL_KEY = "locsee.booking.log";
const SWAP_LOCAL_KEY = "locsee.booking.swaps";
// ใช้เฉพาะโหมดทดลองในเครื่อง (ไม่มี Supabase) — ของจริงอยู่ในตาราง staff บน Supabase
const STAFF_SEED = [
  ["พจนา", "พจนา ศรีคำจักร์"], ["ฐิติพร", "ฐิติพร เหมี้ยงหอม"], ["มณฑิชา", "มณฑิชา ทองทิพย์"],
  ["ช่อผกา", "ช่อผกา สารวัตร"], ["โสภิดา", "โสภิดา ธรรมชัยกูล"], ["ชนกานต์", "ชนกานต์ คาบเพ็ชร"],
  ["รุจิรา", "รุจิรา เครื่องสาย"], ["พรชิตา", "พรชิตา ยาวิชัย", true], ["ภัคคนันทน์", "ภัคคนันทน์ บุญทรง"],
  ["รัชพร", "รัชพร ศรีเขื่อนแก้ว"], ["กุลสตรี", "กุลสตรี ชัยยานนท์"], ["จิรปาน", "จิรปาน ปัญจะเรือง"],
  ["ณัฎฐาภรณ์", "ณัฎฐาภรณ์ บุญศรีไหว"], ["เสาวภา", "เสาวภา รักสกุลดี"], ["แสงดาว", "แสงดาว เชื้อพูล"],
  ["วิสสุตา", "วิสสุตา เปาวะ"], ["อรวรรณ", "อรวรรณ"], ["อัมพันธ์", "อัมพันธ์"]
];

const thMonthFull = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
const thMonthAbbr = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
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
  ["2027-07-28", "วันหยุดพิเศษ"],
  // ปีงบ 2571 (ต.ค. 70 – ก.ย. 71): วันหยุดวันที่ตายตัว + วันชดเชย · วันหยุดทางพุทธศาสนาให้เพิ่มเองในแท็บสรุป
  ["2027-10-13", "วันคล้ายวันสวรรคต ร.9"],
  ["2027-10-25", "ชดเชยวันปิยมหาราช"],
  ["2027-12-06", "ชดเชยวันพ่อแห่งชาติ"],
  ["2027-12-10", "วันรัฐธรรมนูญ"],
  ["2027-12-31", "วันสิ้นปี"],
  ["2028-01-03", "ชดเชยวันขึ้นปีใหม่"],
  ["2028-04-06", "วันจักรี"],
  ["2028-04-13", "วันสงกรานต์"],
  ["2028-04-14", "วันสงกรานต์"],
  ["2028-04-17", "ชดเชยวันสงกรานต์"],
  ["2028-05-01", "วันแรงงาน"],
  ["2028-05-04", "วันฉัตรมงคล"],
  ["2028-06-05", "ชดเชยวันเฉลิมฯ พระราชินี"],
  ["2028-07-28", "วันเฉลิมฯ ร.10"],
  ["2028-08-14", "ชดเชยวันแม่แห่งชาติ"]
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
let currentUser = null;      // { name, isAdmin }
let sessionPin = "";         // PIN ของรอบนี้ เก็บในหน่วยความจำเท่านั้น ใช้กับงานผู้ดูแล
let staffNames = [];         // [{ short_name, has_pin }]
let loginName = "";
let swapRequests = [];       // คำขอแลก Loc จากตาราง swap_requests
let swapPickFor = null;      // id ของ Loc ที่กำลังเลือกคนจะแลกด้วย

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
  printBtn: document.querySelector("#printBtn"),
  printTitle: document.querySelector("#printTitle"),
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
  note: document.querySelector("#note"),
  nameForm: document.querySelector("#nameForm"),
  nameSelect: document.querySelector("#nameSelect"),
  nameMessage: document.querySelector("#nameMessage"),
  pinForm: document.querySelector("#pinForm"),
  pinTitle: document.querySelector("#pinTitle"),
  pinHint: document.querySelector("#pinHint"),
  pinInput: document.querySelector("#pinInput"),
  pinConfirm: document.querySelector("#pinConfirm"),
  pinSubmit: document.querySelector("#pinSubmit"),
  pinMessage: document.querySelector("#pinMessage"),
  rememberMe: document.querySelector("#rememberMe"),
  forgotPinBtn: document.querySelector("#forgotPinBtn"),
  mePill: document.querySelector("#mePill"),
  bookingNameHint: document.querySelector("#bookingNameHint"),
  mineTitle: document.querySelector("#mineTitle"),
  mineList: document.querySelector("#mineList"),
  adminUnlockForm: document.querySelector("#adminUnlockForm"),
  adminPinInput: document.querySelector("#adminPinInput"),
  staffList: document.querySelector("#staffList"),
  staffForm: document.querySelector("#staffForm"),
  staffShort: document.querySelector("#staffShort"),
  staffFull: document.querySelector("#staffFull"),
  logList: document.querySelector("#logList"),
  drawOverlay: document.querySelector("#drawOverlay"),
  toast: document.querySelector("#toast")
};

console.log("[LOCSee] app.js loaded (มีปุ่มปริ้น):", Boolean(el.printBtn));

populateFiscalYearSelect();
applySavedTheme();
syncDateBounds();

el.loginForm.addEventListener("submit", event => {
  event.preventDefault();
  if (el.passwordInput.value === APP_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, "1");
    el.loginMessage.textContent = "";
    showNameStep();
  } else {
    el.loginMessage.textContent = "รหัสผ่านไม่ถูกต้อง";
    el.passwordInput.select();
  }
});

function on(target, eventName, handler) {
  if (!target) {
    console.warn(`[LOCSee] ไม่พบ element สำหรับ event "${eventName}" — ตรวจสอบว่าไฟล์ index.html เป็นเวอร์ชันล่าสุด`);
    return;
  }
  target.addEventListener(eventName, handler);
}

el.tabButtons.forEach(button => button.addEventListener("click", () => setTab(button.dataset.tab)));
on(el.search, "input", render);
on(el.logoutBtn, "click", logoutApp);
on(el.reloadBtn, "click", loadData);
on(el.printBtn, "click", printYearOverview);
on(el.themeSelect, "change", () => {
  applyTheme(el.themeSelect.value);
  localStorage.setItem(THEME_KEY, el.themeSelect.value);
});
on(el.fiscalYearSelect, "change", () => {
  selectedFiscalYear = Number(el.fiscalYearSelect.value);
  localStorage.setItem(YEAR_KEY, String(selectedFiscalYear));
  MONTHS = buildFiscalMonths(selectedFiscalYear);
  syncDateBounds();
  render();
});
on(el.slotForm, "submit", createSlot);
on(el.bookingForm, "submit", createBooking);
on(el.holidayForm, "submit", createHoliday);

on(el.nameForm, "submit", submitName);
on(el.pinForm, "submit", submitPin);
on(el.forgotPinBtn, "click", () => { el.pinMessage.textContent = "แจ้งผู้ดูแล (พรชิตา) ให้รีเซ็ต PIN แล้วกลับมาตั้งใหม่ได้เลย"; });
document.querySelectorAll("[data-login-back]").forEach(button => button.addEventListener("click", () => showLoginStep(button.dataset.loginBack)));

function restoreSession() {
  const saved = readStoredUser();
  if (saved && (sessionStorage.getItem(AUTH_KEY) === "1" || saved.remember)) {
    sessionStorage.setItem(AUTH_KEY, "1");
    currentUser = { name: saved.name, isAdmin: Boolean(saved.isAdmin) };
    unlockApp();
  } else if (sessionStorage.getItem(AUTH_KEY) === "1") {
    showNameStep();
  } else {
    el.passwordInput.focus();
  }
}

function readStoredUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function storeUser(remember) {
  const value = JSON.stringify({ ...currentUser, remember });
  try {
    sessionStorage.setItem(USER_KEY, value);
    if (remember) localStorage.setItem(USER_KEY, value);
    else localStorage.removeItem(USER_KEY);
  } catch {}
}

function showLoginStep(id) {
  [el.loginForm, el.nameForm, el.pinForm].forEach(form => { if (form) form.hidden = form.id !== id; });
  const first = document.getElementById(id)?.querySelector("input:not([hidden]), select");
  first?.focus();
}

async function showNameStep() {
  showLoginStep("nameForm");
  el.nameSelect.innerHTML = `<option value="">กำลังโหลดรายชื่อ...</option>`;
  el.nameMessage.textContent = "";
  try {
    staffNames = await staffApi.list();
    el.nameSelect.innerHTML = `<option value="">— เลือกชื่อ —</option>` + staffNames.map(item =>
      `<option value="${escapeHtml(item.short_name)}">${escapeHtml(item.short_name)}${item.has_pin ? "" : " (ยังไม่ตั้ง PIN)"}</option>`
    ).join("");
  } catch (error) {
    el.nameSelect.innerHTML = `<option value="">โหลดรายชื่อไม่สำเร็จ</option>`;
    el.nameMessage.textContent = staffErrorText(error);
  }
}

function submitName(event) {
  event.preventDefault();
  loginName = el.nameSelect.value;
  if (!loginName) { el.nameMessage.textContent = "กรุณาเลือกชื่อของคุณ"; return; }
  const person = staffNames.find(item => item.short_name === loginName);
  const firstTime = !person?.has_pin;
  el.pinTitle.textContent = firstTime ? `ตั้ง PIN ของ ${loginName}` : `สวัสดี ${loginName}`;
  el.pinHint.textContent = firstTime
    ? "ครั้งแรก ตั้ง PIN เป็นตัวเลข 4–6 หลักที่จำได้ ใช้ทุกครั้งที่เข้าสู่ระบบ"
    : "ใส่ PIN ของคุณ";
  el.pinConfirm.hidden = !firstTime;
  el.forgotPinBtn.hidden = firstTime;
  el.pinSubmit.textContent = firstTime ? "ตั้ง PIN และเข้าสู่ระบบ" : "เข้าสู่ระบบ";
  el.pinForm.dataset.mode = firstTime ? "set" : "login";
  el.pinInput.value = "";
  el.pinConfirm.value = "";
  el.pinMessage.textContent = "";
  showLoginStep("pinForm");
}

async function submitPin(event) {
  event.preventDefault();
  const pin = el.pinInput.value.trim();
  el.pinSubmit.disabled = true;
  try {
    let result;
    if (el.pinForm.dataset.mode === "set") {
      if (!/^\d{4,6}$/.test(pin)) { el.pinMessage.textContent = "PIN ต้องเป็นตัวเลข 4–6 หลัก"; return; }
      if (pin !== el.pinConfirm.value.trim()) { el.pinMessage.textContent = "PIN สองช่องไม่ตรงกัน ลองใหม่อีกครั้ง"; return; }
      result = await staffApi.setPin(loginName, pin);
    } else {
      result = await staffApi.login(loginName, pin);
    }
    if (result.status === "ok") {
      currentUser = { name: loginName, isAdmin: Boolean(result.is_admin) };
      sessionPin = pin;
      storeUser(el.rememberMe.checked);
      el.pinInput.value = "";
      el.pinConfirm.value = "";
      unlockApp();
      return;
    }
    el.pinInput.value = "";
    el.pinMessage.textContent = {
      wrong: "PIN ไม่ถูกต้อง",
      locked: "ใส่ PIN ผิดหลายครั้ง ระบบล็อกไว้ 5 นาที ลองใหม่ภายหลังหรือแจ้งผู้ดูแล",
      nopin: "ชื่อนี้ยังไม่ได้ตั้ง PIN กด \"เลือกชื่ออื่น\" แล้วเลือกชื่อเดิมอีกครั้ง",
      notfound: "ไม่พบชื่อนี้ในระบบ แจ้งผู้ดูแลให้เพิ่มชื่อ"
    }[result.status] || "เข้าสู่ระบบไม่สำเร็จ";
  } catch (error) {
    el.pinMessage.textContent = staffErrorText(error);
  } finally {
    el.pinSubmit.disabled = false;
  }
}

function staffErrorText(error) {
  const message = String(error?.message || error || "");
  if (message.includes("PIN_EXISTS")) return "ชื่อนี้ตั้ง PIN ไว้แล้ว ถ้าไม่ใช่คุณตั้ง แจ้งผู้ดูแลให้รีเซ็ต";
  if (message.includes("PIN_FORMAT")) return "PIN ต้องเป็นตัวเลข 4–6 หลัก";
  if (message.includes("PIN_LOCKED")) return "ใส่ PIN ผิดหลายครั้ง ระบบล็อกไว้ 5 นาที";
  if (message.includes("PIN_WRONG")) return "PIN ไม่ถูกต้อง";
  if (message.includes("NOT_ADMIN")) return "ต้องเป็นผู้ดูแลเท่านั้น";
  if (message.includes("CANNOT_REMOVE_ADMIN")) return "ลบรายชื่อผู้ดูแลไม่ได้";
  if (message.includes("SWAP_PENDING_EXISTS")) return "Loc นี้มีคำขอแลกค้างอยู่แล้ว รอให้ตอบรับหรือยกเลิกก่อน";
  if (message.includes("SWAP_NOT_YOURS")) return "Loc นี้ไม่ใช่ของคุณแล้ว ลองกดรีเฟรช";
  if (message.includes("SWAP_NOT_THEIRS")) return "อีกฝ่ายไม่ได้เป็นผู้ได้ Loc นั้นแล้ว ลองกดรีเฟรช";
  if (message.includes("SWAP_ALREADY_THERE")) return "คุณกับอีกฝ่ายอยู่ใน Loc เดียวกันอยู่แล้ว";
  if (message.includes("SWAP_NOT_PENDING")) return "คำขอนี้ถูกตอบหรือยกเลิกไปแล้ว";
  if (message.includes("SWAP_")) return "ทำรายการแลก Loc ไม่สำเร็จ ลองกดรีเฟรชแล้วทำใหม่";
  if (/locsee_swap/i.test(message)) return "ยังไม่ได้ติดตั้งระบบแลก Loc ใน Supabase (ต้องรันไฟล์ supabase-setup-swap.sql ก่อน)";
  if (/locsee_|function|schema cache/i.test(message)) return "ยังไม่ได้ติดตั้งระบบรายชื่อใน Supabase (ต้องรันไฟล์ supabase-setup-pin.sql ก่อน)";
  return `เกิดข้อผิดพลาด: ${message}`;
}

function unlockApp() {
  el.loginGate.classList.add("is-unlocked");
  el.appShell.classList.remove("is-locked");
  applyRole();
  setTab("overview");
  loadData();
}

function logoutApp() {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(USER_KEY);
  try { localStorage.removeItem(USER_KEY); } catch {}
  currentUser = null;
  sessionPin = "";
  swapNoticeShown = false;
  swapPickFor = null;
  document.body.classList.remove("is-admin");
  el.passwordInput.value = "";
  el.loginMessage.textContent = "";
  el.loginGate.classList.remove("is-unlocked");
  el.appShell.classList.add("is-locked");
  showLoginStep("loginForm");
}

function isAdmin() { return Boolean(currentUser?.isAdmin); }
function myName() { return currentUser?.name || ""; }

function applyRole() {
  document.body.classList.toggle("is-admin", isAdmin());
  if (el.mePill) {
    el.mePill.textContent = `${isAdmin() ? "👑" : "👤"} ${myName()}`;
    el.mePill.classList.toggle("admin", isAdmin());
  }
}

function setTab(name) {
  const target = [...el.tabButtons].find(button => button.dataset.tab === name);
  if (!target || (target.hasAttribute("data-admin-only") && !isAdmin())) name = "overview";
  el.tabButtons.forEach(button => button.classList.toggle("is-active", button.dataset.tab === name));
  el.panels.forEach(panel => panel.classList.toggle("is-active", panel.dataset.panel === name));
  if (name === "admin") renderAdmin();
}

function printYearOverview() {
  const picker = document.querySelector("#printPicker");
  if (!picker) { openPrintPreview("timeline"); return; }
  picker.hidden = false;
  picker.querySelector("[data-print-layout]")?.focus();
}

function closePrintPicker() {
  const picker = document.querySelector("#printPicker");
  if (picker) picker.hidden = true;
}

document.querySelectorAll("[data-print-layout]").forEach(button => button.addEventListener("click", () => {
  closePrintPicker();
  openPrintPreview(button.dataset.printLayout);
}));
on(document.querySelector("#printPickerCancel"), "click", closePrintPicker);
on(document.querySelector("#printPicker"), "click", event => { if (event.target.id === "printPicker") closePrintPicker(); });
on(document.querySelector("#printCloseBtn"), "click", closePrintPreview);
on(document.querySelector("#printNowBtn"), "click", () => {
  if (typeof window.print !== "function") {
    alert("เบราว์เซอร์นี้ไม่รองรับการปริ้นหน้าเว็บโดยตรง กรุณาเปิดผ่าน Chrome หรือ Safari ปกติ");
    return;
  }
  window.print();
});
window.addEventListener("resize", () => { if (document.body.classList.contains("is-printing")) scalePrintPages(); });

function openPrintPreview(layout) {
  const pages = document.querySelector("#printPages");
  if (!pages) return;
  const html = [];
  if (layout === "timeline" || layout === "both") html.push(printPageShell(`ภาพรวม Loc Vacation ปีงบประมาณ ${selectedFiscalYear}`, buildPrintTimeline()));
  if (layout === "calendar" || layout === "both") html.push(printPageShell(`ปฏิทิน Loc Vacation ปีงบประมาณ ${selectedFiscalYear}`, buildPrintCalendar()));
  pages.innerHTML = html.map(page => `<div class="pp-wrap">${page}</div>`).join("");
  document.body.classList.add("is-printing");
  window.scrollTo(0, 0);
  scalePrintPages();
  fitPrintNames();
  if (document.fonts?.ready) document.fonts.ready.then(fitPrintNames);
}

function closePrintPreview() {
  document.body.classList.remove("is-printing");
  const pages = document.querySelector("#printPages");
  if (pages) pages.innerHTML = "";
}

function scalePrintPages() {
  const avail = Math.max(200, document.documentElement.clientWidth - 24);
  document.querySelectorAll(".pp-wrap").forEach(wrap => {
    const page = wrap.querySelector(".print-page");
    const scale = Math.min(1, avail / page.offsetWidth);
    page.style.transform = `scale(${scale})`;
    wrap.style.width = `${page.offsetWidth * scale}px`;
    wrap.style.height = `${page.offsetHeight * scale}px`;
  });
}

function fitPrintNames() {
  document.querySelectorAll(".print-page .pbar").forEach(bar => {
    const name = bar.querySelector(".pname");
    const maxFont = Number(bar.dataset.maxFont || 17);
    const minFont = Number(bar.dataset.minFont || 11);
    const wrap = bar.dataset.wrap === "1";
    bar.classList.remove("spill", "spill-left");
    name.classList.toggle("nowrap", !wrap);
    let size = maxFont;
    name.style.fontSize = `${size}px`;
    const overflowing = () => name.scrollWidth > name.clientWidth + 1 || (wrap && name.scrollHeight > name.clientHeight + 2);
    while (overflowing() && size > minFont) {
      size -= 0.5;
      name.style.fontSize = `${size}px`;
    }
    if (overflowing()) {
      name.style.fontSize = `${Math.min(13, maxFont)}px`;
      bar.classList.add("spill");
      if (bar.dataset.edge === "right") bar.classList.add("spill-left");
    }
  });
}

function printPageShell(title, body) {
  const now = new Date();
  const printed = `${now.getDate()} ${thMonthAbbr[now.getMonth()]} ${now.getFullYear() + 543}`;
  return `<article class="print-page">
    <header class="ps-head">
      <img class="ps-logo" src="./assets/locsee-logo.png" alt="LOCSee">
      <h2 class="ps-title">${escapeHtml(title)}</h2>
      <div class="ps-legend">
        <span><i class="lg-open"></i>เปิดจอง (ยังไม่จับฉลาก)</span>
        <span><i class="lg-won"></i>จับฉลากแล้ว</span>
        <span><i class="lg-hol"></i>วันหยุดพิเศษ</span>
        <span><i class="lg-we"></i>เสาร์-อาทิตย์</span>
      </div>
    </header>
    <div class="ps-body">${body}</div>
    <footer class="ps-foot"><span>${escapeHtml(location.host + location.pathname)}</span><span>พิมพ์เมื่อ ${printed}</span></footer>
  </article>`;
}

function printSlotLabel(slot) {
  if (slot.status === "drawn" && slot.winner_name) return splitWinners(slot.winner_name).join(", ");
  const names = uniqueNames(bookings.filter(item => item.slot_id === slot.id).map(item => item.person_name || ""));
  if (!names.length) return "ยังไม่มีผู้จอง";
  return names.length <= 3 ? names.join(", ") : `${names.slice(0, 3).join(", ")} +${names.length - 3}`;
}

// แบ่ง Loc ในเดือนนั้นเป็นช่วงวันทำการติดกัน (ตัดเสาร์-อาทิตย์ออก)
function printMonthSegments(month) {
  const days = new Date(month.adYear, month.month, 0).getDate();
  const monthStart = `${month.adYear}-${String(month.month).padStart(2, "0")}-01`;
  const monthEnd = `${month.adYear}-${String(month.month).padStart(2, "0")}-${String(days).padStart(2, "0")}`;
  const segments = [];
  slots
    .filter(slot => overlapsFiscalYear(slot.start_date, slot.end_date) && slot.start_date <= monthEnd && slot.end_date >= monthStart)
    .forEach(slot => {
      const from = slot.start_date > monthStart ? slot.start_date : monthStart;
      const to = slot.end_date < monthEnd ? slot.end_date : monthEnd;
      let runStart = null;
      for (let date = new Date(`${from}T00:00:00`); iso(date) <= to; date.setDate(date.getDate() + 1)) {
        const d = date.getDate();
        if (isWeekendDate(date)) {
          if (runStart !== null) { segments.push({ s: runStart, e: d - 1, slot }); runStart = null; }
        } else if (runStart === null) runStart = d;
      }
      if (runStart !== null) segments.push({ s: runStart, e: Number(to.slice(8, 10)), slot });
    });
  return segments.sort((a, b) => a.s - b.s || b.e - a.e);
}

function assignPrintLanes(segments) {
  const laneEnds = [];
  segments.forEach(seg => {
    let lane = laneEnds.findIndex(end => end < seg.s);
    if (lane === -1) { lane = laneEnds.length; laneEnds.push(seg.e); } else laneEnds[lane] = seg.e;
    seg.lane = lane;
  });
  return Math.max(1, laneEnds.length);
}

function printBar(seg, month, holidayMap, gridColumn, gridRow, maxFont, edge, wrap = false) {
  const parts = [];
  for (let d = seg.s; d <= seg.e; d++) {
    const key = `${month.adYear}-${String(month.month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    parts.push(`<span class="pseg${holidayMap.has(key) ? " hol" : ""}"></span>`);
  }
  const status = seg.slot.status === "drawn" ? "drawn" : "open";
  return `<div class="pbar ${status}" data-max-font="${maxFont}" data-edge="${edge}" data-wrap="${wrap ? 1 : 0}" style="grid-column:${gridColumn};grid-row:${gridRow}"><span class="psegs">${parts.join("")}</span><span class="pname">${escapeHtml(printSlotLabel(seg.slot))}</span></div>`;
}

function buildPrintTimeline() {
  const holidayMap = groupHolidays();
  let html = `<div class="pt"><div class="pt-head"><div class="pt-hd">เดือน</div>`;
  for (let d = 1; d <= 31; d++) html += `<div class="pt-hd">${d}</div>`;
  html += `</div>`;
  MONTHS.forEach(month => {
    const days = new Date(month.adYear, month.month, 0).getDate();
    const segments = printMonthSegments(month);
    const lanes = assignPrintLanes(segments);
    html += `<div class="pt-row${lanes > 1 ? " multi" : ""}" style="grid-template-rows:repeat(${lanes}, minmax(0, 1fr))">`;
    html += `<div class="pt-mo">${thMonthAbbr[month.month - 1]} ${String(month.beYear).slice(-2)}</div>`;
    for (let d = 1; d <= 31; d++) {
      let cls = "pt-c";
      if (d > days) cls += " void";
      else {
        const date = new Date(month.adYear, month.month - 1, d);
        if (holidayMap.has(iso(date))) cls += " hol";
        else if (isWeekendDate(date)) cls += " we";
      }
      html += `<div class="${cls}" style="grid-column:${d + 1}"></div>`;
    }
    segments.forEach(seg => {
      html += printBar(seg, month, holidayMap, `${seg.s + 1} / span ${seg.e - seg.s + 1}`, seg.lane + 1, lanes > 1 ? 13 : 17, seg.s >= 27 ? "right" : "left", lanes === 1 && seg.e > seg.s);
    });
    html += `</div>`;
  });
  return html + `</div>`;
}

function buildPrintCalendar() {
  const holidayMap = groupHolidays();
  const weekdayHead = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"].map(name => `<span>${name}</span>`).join("");
  let html = `<div class="pc">`;
  MONTHS.forEach(month => {
    const days = new Date(month.adYear, month.month, 0).getDate();
    const offset = (new Date(month.adYear, month.month - 1, 1).getDay() + 6) % 7;
    const weekCount = Math.ceil((offset + days) / 7);
    const segments = printMonthSegments(month);
    html += `<section class="pc-m"><h3>${thMonthFull[month.month - 1]} ${month.beYear}</h3><div class="pc-wd">${weekdayHead}</div><div class="pc-weeks">`;
    for (let w = 0; w < weekCount; w++) {
      const weekSegs = segments
        .filter(seg => Math.floor((offset + seg.s - 1) / 7) === w)
        .map(seg => ({ ...seg }));
      const lanes = assignPrintLanes(weekSegs);
      html += `<div class="pc-w" style="grid-template-rows:12px repeat(${lanes}, minmax(0, 1fr))">`;
      for (let c = 0; c < 7; c++) {
        const d = w * 7 + c - offset + 1;
        if (d < 1 || d > days) { html += `<div class="pc-d" style="grid-column:${c + 1}"></div>`; continue; }
        const date = new Date(month.adYear, month.month - 1, d);
        const cls = holidayMap.has(iso(date)) ? " hol" : isWeekendDate(date) ? " we" : "";
        html += `<div class="pc-d${cls}" style="grid-column:${c + 1}"><b>${d}</b></div>`;
      }
      weekSegs.forEach(seg => {
        const col = (offset + seg.s - 1) % 7 + 1;
        html += printBar(seg, month, holidayMap, `${col} / span ${seg.e - seg.s + 1}`, seg.lane + 2, lanes > 1 ? 11 : 14, col >= 5 ? "right" : "left");
      });
      html += `</div>`;
    }
    html += `</div></section>`;
  });
  return html + `</div>`;
}

window.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  closePrintPicker();
});

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
      const swapRes = await db.from("swap_requests").select("*").order("created_at", { ascending: false }).limit(300);
      swapRequests = swapRes.error ? [] : (swapRes.data || []);
    } else {
      slots = readLocal(VAC_KEY);
      bookings = readLocal(BOOKING_KEY);
      customHolidays = readLocal(HOLIDAY_KEY);
      swapRequests = readLocal(SWAP_LOCAL_KEY);
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
  if (!isAdmin() && personName !== myName()) return alert("จองได้เฉพาะในชื่อของคุณเอง");
  if (bookings.some(item => String(item.slot_id) === String(slotId) && item.person_name === personName)) {
    showToast(`${personName} จอง Loc นี้ไว้แล้ว`);
    return;
  }
  const ok = await saveBookings(slotId, [personName]);
  if (!ok) return;
  el.bookingStart.value = "";
  const slot = findSlot(slotId);
  showToast(`จอง ${slot ? slotDateLabel(slot) : "Loc"} ในชื่อ ${personName} แล้ว`);
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
  const slot = findSlot(slotId);
  logEvent(`เลือกผู้ได้ Loc ${slot ? slotDateLabel(slot) : ""} เอง → ${winner}${slot?.winner_name ? ` (เดิม: ${slot.winner_name})` : ""}`);
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

async function swapWinners(firstSlotId, secondSlotId) {
  if (!firstSlotId || !secondSlotId) return alert("กรุณาเลือก Loc ที่ต้องการแลกให้ครบทั้ง 2 รายการ");
  if (firstSlotId === secondSlotId) return alert("กรุณาเลือก Loc คนละรายการ");

  const firstSlot = slots.find(slot => String(slot.id) === String(firstSlotId));
  const secondSlot = slots.find(slot => String(slot.id) === String(secondSlotId));
  if (!firstSlot?.winner_name || !secondSlot?.winner_name) return alert("Loc ที่เลือกต้องมีผู้ได้แล้วทั้ง 2 รายการ");

  const message = [
    "ยืนยันการแลก Loc โดยไม่จับฉลากใหม่?",
    "",
    `${firstSlot.winner_name}: ${slotDateLabel(firstSlot)}`,
    `⇄ ${secondSlot.winner_name}: ${slotDateLabel(secondSlot)}`
  ].join("\n");
  if (!confirm(message)) return;

  const firstWinner = firstSlot.winner_name;
  const secondWinner = secondSlot.winner_name;

  if (hasSupabase) {
    const firstResult = await db.from("loc_slots")
      .update({ winner_name: secondWinner, status: "drawn" })
      .eq("id", firstSlot.id);
    if (firstResult.error) return alert(`แลก Loc ไม่สำเร็จ: ${firstResult.error.message}`);

    const secondResult = await db.from("loc_slots")
      .update({ winner_name: firstWinner, status: "drawn" })
      .eq("id", secondSlot.id);
    if (secondResult.error) {
      const rollback = await db.from("loc_slots")
        .update({ winner_name: firstWinner, status: "drawn" })
        .eq("id", firstSlot.id);
      const rollbackMessage = rollback.error ? " และคืนค่ารายการแรกไม่สำเร็จ กรุณาตรวจสอบข้อมูล" : " ระบบคืนค่ารายการแรกให้แล้ว";
      return alert(`แลก Loc ไม่สำเร็จ: ${secondResult.error.message}${rollbackMessage}`);
    }
  } else {
    slots = slots.map(slot => {
      if (String(slot.id) === String(firstSlot.id)) return { ...slot, winner_name: secondWinner, status: "drawn" };
      if (String(slot.id) === String(secondSlot.id)) return { ...slot, winner_name: firstWinner, status: "drawn" };
      return slot;
    });
    writeLocal(VAC_KEY, slots);
  }

  logEvent(`แลก Loc: ${firstWinner} ได้ ${slotDateLabel(secondSlot)} ⇄ ${secondWinner} ได้ ${slotDateLabel(firstSlot)}`);
  await loadData();
  alert("แลก Loc เรียบร้อยแล้ว");
}

async function deleteItem(type, id) {
  if (!confirm("ลบรายการนี้?")) return;
  if (type === "slot") {
    const slot = findSlot(id);
    if (slot) logEvent(`ลบ Loc ${slotDateLabel(slot)}${slot.winner_name ? ` (ผู้ได้: ${slot.winner_name})` : ""}`);
  } else if (type === "booking") {
    const booking = bookings.find(item => String(item.id) === String(id));
    const slot = booking && findSlot(booking.slot_id);
    if (booking && slot) logEvent(`ยกเลิกการจอง Loc ${slotDateLabel(slot)} ของ ${booking.person_name}`);
  }
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
  renderBookingNames();
  renderOpenSlots(filteredSlots);
  renderDrawList(filteredSlots);
  renderMine(yearSlots);
  updateMineBadge(yearSlots);
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
    cells.push(`<button class="year-cell month-label month-link" type="button" data-month-index="${index}" style="background:${monthColors[index]}"><span class="month-full">${thMonthFull[month.month - 1]} ${month.beYear}</span><span class="month-abbr">${thMonthAbbr[month.month - 1]} ${String(month.beYear).slice(-2)}</span></button>`);
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
      cells.push(`<button class="${classes}" type="button"${dateAttr}><span class="day-num">${day}</span><span class="weekday-mini">${thDays[date.getDay()]}</span>${label ? `<span class="cell-label">${escapeHtml(label)}</span>` : ""}</button>`);
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
  const list = isAdmin() ? items : items.filter(slot => slot.status !== "drawn");
  const card = isAdmin() ? slotCard : memberSlotCard;
  el.openSlotList.innerHTML = list.length ? list.map(card).join("") : `<div class="card slot-card">ยังไม่มี Loc ที่เปิดจองในปีนี้</div>`;
  bindSlotActions(el.openSlotList);
}

function renderDrawList(items) {
  const drawnSlots = items.filter(slot => slot.status === "drawn" && splitWinners(slot.winner_name).length);
  const swapPanel = drawnSlots.length >= 2 ? renderSwapPanel(drawnSlots) : "";
  const order = { ready: 0, one: 1, empty: 2, done: 3 };
  const sorted = [...items].sort((a, b) => order[slotState(a)] - order[slotState(b)] || a.start_date.localeCompare(b.start_date));
  const cards = sorted.length ? sorted.map(slotCard).join("") : `<div class="card slot-card">ยังไม่มี Loc สำหรับจับฉลาก</div>`;
  el.drawList.innerHTML = swapPanel + cards;
  bindSwapActions(el.drawList);
  bindSlotActions(el.drawList);
}

function renderSwapPanel(drawnSlots) {
  const options = drawnSlots.map(slot => `
    <option value="${escapeHtml(String(slot.id))}">${escapeHtml(slot.winner_name)} · ${escapeHtml(slotDateLabel(slot))}</option>
  `).join("");
  return `
    <section class="swap-panel card">
      <div>
        <h2>ผู้ดูแลสลับ Loc ให้ทันที</h2>
        <p>ใช้กรณีพิเศษ ปกติให้แต่ละคนกด "ขอแลก" ในแท็บ Loc ของฉัน แล้วให้อีกฝ่ายยืนยันเอง</p>
      </div>
      <div class="swap-fields">
        <label>Loc ฝ่ายที่ 1
          <select class="input" data-swap-first>
            <option value="">เลือก Loc</option>
            ${options}
          </select>
        </label>
        <span class="swap-arrow" aria-hidden="true">⇄</span>
        <label>Loc ฝ่ายที่ 2
          <select class="input" data-swap-second>
            <option value="">เลือก Loc</option>
            ${options}
          </select>
        </label>
        <button class="btn swap" type="button" data-swap-winners>ยืนยันแลก Loc</button>
      </div>
      <small>หมายเหตุ: ถ้า Loc มีผู้ได้หลายคน ระบบจะสลับรายชื่อทั้งกลุ่ม</small>
    </section>
  `;
}

function bindSwapActions(root) {
  const button = root.querySelector("[data-swap-winners]");
  if (!button) return;
  button.addEventListener("click", () => {
    const first = root.querySelector("[data-swap-first]")?.value;
    const second = root.querySelector("[data-swap-second]")?.value;
    swapWinners(first, second);
  });
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
  const state = slotState(slot);
  return `
    <article class="slot-card${state === "ready" ? " is-ready" : ""}">
      <div class="slot-top">
        <div>
          <div class="slot-title">${escapeHtml(slotDisplayTitle(slot))}</div>
          <div class="slot-meta">${slotDateLabel(slot)} · ${slotLeaveDays(slot)} วันลา · ${slotBookings.length} คนจอง</div>
          <div class="candidate-list">${candidates}</div>
        </div>
        <div class="actions">
          ${state === "ready" ? `<button class="btn go-draw" type="button" data-go-draw="${slot.id}">🎰 ไปจับฉลาก</button>` : ""}
          ${state === "one" ? `<button class="btn swap" type="button" data-confirm-one="${slot.id}">✓ ยืนยันให้ ${escapeHtml(slotBookings[0].person_name)}</button>` : ""}
          ${!slotBookings.length && winnerNames.length ? `<button class="btn" type="button" data-move-winner="${slot.id}">ย้ายเป็นผู้จอง</button>` : ""}
          <button class="btn danger" type="button" data-delete-slot="${slot.id}">ลบ Loc</button>
        </div>
      </div>
      ${slotBadge(slot)}
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
              <button class="btn draw" type="button" data-draw="${slot.id}">🎰 จับฉลากใหม่</button>
              <button class="btn" type="button" data-clear-winner="${slot.id}">ยกเลิกผล</button>
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
    openDrawOverlay(btn.dataset.draw, input?.value || 1);
  }));
  root.querySelectorAll("[data-go-draw]").forEach(btn => btn.addEventListener("click", () => openDrawOverlay(btn.dataset.goDraw, 1)));
  root.querySelectorAll("[data-confirm-one]").forEach(btn => btn.addEventListener("click", () => confirmSingleBooker(btn.dataset.confirmOne)));
  root.querySelectorAll("[data-clear-winner]").forEach(btn => btn.addEventListener("click", () => cancelResult(btn.dataset.clearWinner)));
  root.querySelectorAll("[data-book]").forEach(btn => btn.addEventListener("click", () => bookForMe(btn.dataset.book)));
  root.querySelectorAll("[data-unbook]").forEach(btn => btn.addEventListener("click", () => deleteItem("booking", btn.dataset.unbook)));
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

/* =====================================================================
   ปีงบ 2571 · รายชื่อ + PIN, Loc ของฉัน, ผู้ดูแล, จับฉลากแบบสล็อต
   ===================================================================== */

// ---------- รายชื่อ + PIN (Supabase ถ้ามี, ไม่มีก็ใช้ข้อมูลในเครื่องสำหรับทดลอง) ----------
const staffApi = hasSupabase ? {
  async list() { return rpc("locsee_staff_list"); },
  async login(name, pin) { return rpc("locsee_login", { p_name: name, p_pin: pin }); },
  async setPin(name, pin) { return rpc("locsee_set_pin", { p_name: name, p_pin: pin }); },
  async adminList(pin) { return rpc("locsee_admin_staff", { p_admin: myName(), p_admin_pin: pin }); },
  async resetPin(pin, target) { return rpc("locsee_admin_reset_pin", { p_admin: myName(), p_admin_pin: pin, p_target: target }); },
  async saveStaff(pin, short, full) { return rpc("locsee_admin_save_staff", { p_admin: myName(), p_admin_pin: pin, p_short: short, p_full: full }); },
  async removeStaff(pin, target) { return rpc("locsee_admin_remove_staff", { p_admin: myName(), p_admin_pin: pin, p_target: target }); }
} : {
  async list() { return localStaff().map(s => ({ short_name: s.short_name, has_pin: Boolean(s.pin) })); },
  async login(name, pin) {
    const s = localStaff().find(item => item.short_name === name);
    if (!s) return { status: "notfound" };
    if (!s.pin) return { status: "nopin" };
    return s.pin === pin ? { status: "ok", is_admin: s.is_admin } : { status: "wrong" };
  },
  async setPin(name, pin) {
    const all = localStaff(), s = all.find(item => item.short_name === name);
    if (!s) throw new Error("NOT_FOUND");
    if (s.pin) throw new Error("PIN_EXISTS");
    s.pin = pin; writeLocal(STAFF_LOCAL_KEY, all); logEvent("ตั้ง PIN ครั้งแรก", name);
    return { status: "ok", is_admin: s.is_admin };
  },
  async adminList(pin) { localAdminCheck(pin); return localStaff().map(s => ({ ...s, has_pin: Boolean(s.pin), is_locked: false })); },
  async resetPin(pin, target) { localAdminCheck(pin); const all = localStaff(); const s = all.find(i => i.short_name === target); if (s) s.pin = null; writeLocal(STAFF_LOCAL_KEY, all); logEvent(`รีเซ็ต PIN ของ ${target}`); },
  async saveStaff(pin, short, full) {
    localAdminCheck(pin);
    const all = localStaff(), s = all.find(i => i.short_name === short);
    if (s) { s.full_name = full; logEvent(`แก้ไขชื่อเต็มของ ${short}`); }
    else { all.push({ short_name: short, full_name: full, is_admin: false, pin: null }); logEvent(`เพิ่มรายชื่อ ${short}`); }
    writeLocal(STAFF_LOCAL_KEY, all);
  },
  async removeStaff(pin, target) {
    localAdminCheck(pin);
    const all = localStaff();
    if (all.find(i => i.short_name === target)?.is_admin) throw new Error("CANNOT_REMOVE_ADMIN");
    writeLocal(STAFF_LOCAL_KEY, all.filter(i => i.short_name !== target)); logEvent(`ลบรายชื่อ ${target}`);
  }
};

async function rpc(name, params) {
  const { data, error } = await db.rpc(name, params);
  if (error) throw error;
  return data;
}

function localStaff() {
  const saved = readLocal(STAFF_LOCAL_KEY);
  if (saved.length) return saved;
  const seeded = STAFF_SEED.map(([short_name, full_name, is_admin]) => ({ short_name, full_name, is_admin: Boolean(is_admin), pin: null }));
  writeLocal(STAFF_LOCAL_KEY, seeded);
  return seeded;
}

function localAdminCheck(pin) {
  const me = localStaff().find(item => item.short_name === myName());
  if (!me || me.pin !== pin) throw new Error("PIN_WRONG");
  if (!me.is_admin) throw new Error("NOT_ADMIN");
}

// ---------- ประวัติ ----------
async function logEvent(action, actor = myName()) {
  try {
    if (hasSupabase) {
      await db.from("activity_log").insert({ actor, action });
    } else {
      const log = readLocal(LOG_LOCAL_KEY);
      log.unshift({ id: crypto.randomUUID(), created_at: new Date().toISOString(), actor, action });
      writeLocal(LOG_LOCAL_KEY, log.slice(0, 300));
    }
  } catch (error) {
    console.warn("[LOCSee] บันทึกประวัติไม่สำเร็จ", error);
  }
}

async function loadLog() {
  if (!hasSupabase) return readLocal(LOG_LOCAL_KEY);
  const { data, error } = await db.from("activity_log").select("*").order("created_at", { ascending: false }).limit(150);
  if (error) throw error;
  return data || [];
}

// ---------- ตัวช่วย ----------
function findSlot(id) { return slots.find(slot => String(slot.id) === String(id)); }
function slotBookingsOf(slot) { return bookings.filter(item => String(item.slot_id) === String(slot.id)); }

function slotState(slot) {
  if (splitWinners(slot.winner_name).length) return "done";
  const count = slotBookingsOf(slot).length;
  return count >= 2 ? "ready" : count === 1 ? "one" : "empty";
}

function slotBadge(slot) {
  const state = slotState(slot);
  const text = {
    ready: `🎲 พร้อมจับฉลาก · ${slotBookingsOf(slot).length} คน`,
    one: "จอง 1 คน",
    empty: "ยังไม่มีผู้จอง",
    done: `✓ ได้แล้ว: ${escapeHtml(splitWinners(slot.winner_name).join(", "))}`
  }[state];
  return `<span class="badge ${state}">${text}</span>`;
}

function nameChips(slot) {
  const winners = splitWinners(slot.winner_name);
  return slotBookingsOf(slot).map(item => {
    const cls = winners.includes(item.person_name) ? " win" : item.person_name === myName() ? " me" : "";
    return `<span class="name-chip${cls}">${escapeHtml(item.person_name)}</span>`;
  }).join("");
}

function renderBookingNames() {
  if (!el.bookingName) return;
  const current = el.bookingName.value || myName();
  const names = isAdmin()
    ? uniqueNames([myName(), ...staffNames.map(item => item.short_name)])
    : [myName()];
  el.bookingName.innerHTML = names.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
  el.bookingName.value = names.includes(current) ? current : myName();
  el.bookingName.disabled = !isAdmin();
  if (el.bookingNameHint) {
    el.bookingNameHint.textContent = isAdmin()
      ? "ผู้ดูแลจองแทนคนอื่นได้ เลือกชื่อจากรายการ"
      : "ระบบใส่ชื่อจากที่เข้าสู่ระบบให้อัตโนมัติ จองแทนคนอื่นไม่ได้";
  }
  if (isAdmin() && !staffNames.length) {
    staffApi.list().then(list => { staffNames = list; renderBookingNames(); }).catch(() => {});
  }
}

function myBookingIn(slot) {
  return slotBookingsOf(slot).find(item => item.person_name === myName());
}

function memberSlotCard(slot) {
  const state = slotState(slot);
  const mine = myBookingIn(slot);
  const count = slotBookingsOf(slot).length;
  return `
    <article class="slot-card${state === "ready" ? " is-ready" : ""}">
      <div class="slot-top">
        <div>
          <div class="slot-title">${escapeHtml(slotDateLabel(slot))}</div>
          <div class="slot-meta">${slotLeaveDays(slot)} วันลา · ${count} คนจอง</div>
        </div>
        <div class="actions">
          ${mine
            ? `<button class="btn" type="button" data-unbook="${mine.id}">ยกเลิกการจองของฉัน</button>`
            : `<button class="btn primary" type="button" data-book="${slot.id}">จองช่วงนี้</button>`}
        </div>
      </div>
      ${slotBadge(slot)}
      ${count ? `<div class="name-chips">${nameChips(slot)}</div>` : ""}
      ${state === "ready" ? `<small class="hint">รอผู้ดูแลจับฉลาก</small>` : ""}
    </article>`;
}

async function bookForMe(slotId) {
  const slot = findSlot(slotId);
  if (!slot || !myName()) return;
  if (myBookingIn(slot)) return showToast("คุณจอง Loc นี้ไว้แล้ว");
  const ok = await saveBookings(slot.id, [myName()]);
  if (!ok) return;
  showToast(`จอง ${slotDateLabel(slot)} ในชื่อ ${myName()} แล้ว`);
  await loadData();
}

async function confirmSingleBooker(slotId) {
  const slot = findSlot(slotId);
  const only = slot && slotBookingsOf(slot)[0];
  if (!only) return;
  await logEvent(`ยืนยัน Loc ${slotDateLabel(slot)} → ${only.person_name} (จองคนเดียว ไม่ต้องจับฉลาก)`);
  await setWinner(slot.id, only.person_name);
  showToast(`บันทึกแล้ว: ${only.person_name} ได้ ${slotDateLabel(slot)}`);
}

async function cancelResult(slotId) {
  const slot = findSlot(slotId);
  if (!slot?.winner_name) return;
  if (!confirm(`ยกเลิกผล Loc ${slotDateLabel(slot)} (ผู้ได้: ${slot.winner_name})?\nระบบจะเก็บผลเดิมไว้ในประวัติ`)) return;
  await logEvent(`ยกเลิกผล Loc ${slotDateLabel(slot)} (เดิม: ${slot.winner_name})`);
  await clearWinner(slot.id);
  showToast("ยกเลิกผลแล้ว");
  await loadData();
}

// ---------- Loc ของฉัน ----------
function renderMine(yearSlots) {
  if (!el.mineList || !currentUser) return;
  const name = myName();
  if (el.mineTitle) el.mineTitle.textContent = `Loc ของ ${name} · ปี ${selectedFiscalYear}`;
  const won = yearSlots.filter(slot => splitWinners(slot.winner_name).includes(name));
  const waiting = yearSlots.filter(slot => slot.status !== "drawn" && myBookingIn(slot));
  const used = won.reduce((total, slot) => total + personLeaveDays(slot, name), 0);
  const pendingDays = waiting.reduce((total, slot) => total + slotLeaveDays(slot), 0);
  const pct = value => Math.max(0, Math.min(100, value / TOTAL_ALLOWANCE_DAYS * 100));
  let html = `
    <article class="slot-card meter">
      <div class="slot-top">
        <div class="slot-title">ใช้ไปแล้ว ${used} / ${TOTAL_ALLOWANCE_DAYS} วัน</div>
        <span class="count-pill">เหลือ ${TOTAL_ALLOWANCE_DAYS - used} วัน</span>
      </div>
      <div class="meter-bar" role="img" aria-label="ใช้ ${used} จาก ${TOTAL_ALLOWANCE_DAYS} วัน">
        <span style="width:${pct(used)}%"></span>
        <span class="pending" style="width:${pct(Math.min(pendingDays, TOTAL_ALLOWANCE_DAYS - used))}%"></span>
      </div>
      <div class="meter-legend">
        <span>■ ได้ Loc แล้ว ${won.length} ครั้ง</span>
        <span>▨ รอจับฉลาก ${waiting.length} รายการ (${pendingDays} วัน)</span>
      </div>
      <small class="hint">สิทธิ์ลาพักร้อน ${VACATION_ALLOWANCE_DAYS} วัน + ของโรงพยาบาล ${HOSPITAL_ALLOWANCE_DAYS} วัน</small>
    </article>
    ${swapRequestCards()}
    <h2 class="section-title">Loc ที่ได้แล้ว</h2>`;
  html += won.length ? won.map(slot => wonSlotCard(slot, yearSlots)).join("") : `<div class="empty-note">ยังไม่ได้ Loc ในปีนี้</div>`;
  html += swapHistory();
  html += `<h2 class="section-title">รอจับฉลาก</h2>`;
  html += waiting.length ? waiting.map(slot => `
    <article class="slot-card">
      <div class="slot-top">
        <div>
          <div class="slot-title">${escapeHtml(slotDateLabel(slot))}</div>
          <div class="slot-meta">ผู้จองทั้งหมด ${slotBookingsOf(slot).length} คน</div>
        </div>
        <div class="actions"><button class="btn" type="button" data-unbook="${myBookingIn(slot).id}">ยกเลิกการจอง</button></div>
      </div>
      <div class="name-chips">${nameChips(slot)}</div>
    </article>`).join("") : `<div class="empty-note">ไม่มี Loc ที่รอจับฉลาก · ไปที่แท็บ "จอง Loc" เพื่อจอง</div>`;
  el.mineList.innerHTML = html;
  bindSlotActions(el.mineList);
}

function updateMineBadge(yearSlots) {
  const tab = [...el.tabButtons].find(button => button.dataset.tab === "mine");
  if (!tab || !currentUser) return;
  const waiting = yearSlots.filter(slot => slot.status !== "drawn" && myBookingIn(slot)).length;
  const incoming = incomingSwaps().length;
  tab.innerHTML = `Loc ของฉัน${incoming
    ? `<span class="tab-dot alert" title="มีคำขอแลก Loc">🔔${incoming}</span>`
    : waiting ? `<span class="tab-dot" title="รอจับฉลาก">${waiting}</span>` : ""}`;
  if (incoming && !swapNoticeShown) {
    swapNoticeShown = true;
    showToast(`มีคำขอแลก Loc ${incoming} รายการ ดูที่แท็บ "Loc ของฉัน"`);
  }
}

// ---------- ผู้ดูแล ----------
on(el.adminUnlockForm, "submit", async event => {
  event.preventDefault();
  sessionPin = el.adminPinInput.value.trim();
  el.adminPinInput.value = "";
  await renderAdmin();
});

on(el.staffForm, "submit", async event => {
  event.preventDefault();
  const short = el.staffShort.value.trim();
  if (!short) return showToast("กรุณาใส่ชื่อที่แสดง");
  await adminAction(() => staffApi.saveStaff(sessionPin, short, el.staffFull.value.trim()), `บันทึกรายชื่อ ${short} แล้ว`);
  el.staffShort.value = "";
  el.staffFull.value = "";
});

on(el.staffList, "click", async event => {
  const button = event.target.closest("button");
  if (!button) return;
  const { resetPin, removeStaff, editStaff } = button.dataset;
  if (resetPin) {
    if (!confirm(`รีเซ็ต PIN ของ ${resetPin}?\nเจ้าตัวจะต้องตั้ง PIN ใหม่ตอนเข้าสู่ระบบครั้งถัดไป`)) return;
    await adminAction(() => staffApi.resetPin(sessionPin, resetPin), `รีเซ็ต PIN ของ ${resetPin} แล้ว`);
  }
  if (removeStaff) {
    if (!confirm(`ลบ ${removeStaff} ออกจากรายชื่อ?\nข้อมูลการจองเดิมยังอยู่ แต่จะเข้าสู่ระบบไม่ได้`)) return;
    await adminAction(() => staffApi.removeStaff(sessionPin, removeStaff), `ลบ ${removeStaff} แล้ว`);
  }
  if (editStaff) {
    el.staffShort.value = editStaff;
    el.staffFull.value = button.dataset.full || "";
    el.staffFull.focus();
  }
});

async function adminAction(action, successText) {
  try {
    await action();
    showToast(successText);
    staffNames = await staffApi.list();
  } catch (error) {
    showToast(staffErrorText(error));
    if (/PIN_WRONG|PIN_LOCKED/.test(String(error?.message))) sessionPin = "";
  }
  await renderAdmin();
}

async function renderAdmin() {
  if (!isAdmin() || !el.staffList) return;
  el.adminUnlockForm.hidden = Boolean(sessionPin);
  el.staffForm.hidden = !sessionPin;
  if (!sessionPin) {
    el.staffList.innerHTML = `<div class="empty-note">ใส่ PIN ด้านบนเพื่อดูและจัดการรายชื่อ</div>`;
  } else {
    try {
      const rows = await staffApi.adminList(sessionPin);
      el.staffList.innerHTML = rows.map(row => `
        <div class="staff-row">
          <div><strong>${row.is_admin ? "👑 " : ""}${escapeHtml(row.short_name)}</strong><small>${escapeHtml(row.full_name || "—")}</small></div>
          <span class="pin-state ${row.is_locked ? "locked" : row.has_pin ? "ok" : "no"}">${row.is_locked ? "ล็อก 5 นาที" : row.has_pin ? "ตั้ง PIN แล้ว" : "ยังไม่ตั้ง PIN"}</span>
          <div class="actions">
            <button class="btn small" type="button" data-edit-staff="${escapeHtml(row.short_name)}" data-full="${escapeHtml(row.full_name || "")}">แก้ชื่อ</button>
            ${row.has_pin || row.is_locked ? `<button class="btn small" type="button" data-reset-pin="${escapeHtml(row.short_name)}">รีเซ็ต PIN</button>` : ""}
            ${row.is_admin ? "" : `<button class="btn small danger" type="button" data-remove-staff="${escapeHtml(row.short_name)}">ลบ</button>`}
          </div>
        </div>`).join("");
    } catch (error) {
      el.staffList.innerHTML = `<div class="empty-note">${escapeHtml(staffErrorText(error))}</div>`;
      if (/PIN_WRONG|PIN_LOCKED/.test(String(error?.message))) {
        sessionPin = "";
        el.adminUnlockForm.hidden = false;
        el.staffForm.hidden = true;
      }
    }
  }
  try {
    const log = await loadLog();
    const fmt = new Intl.DateTimeFormat("th-TH-u-ca-buddhist", { day: "numeric", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit" });
    el.logList.innerHTML = log.length
      ? log.map(item => `<div class="log-item"><time>${fmt.format(new Date(item.created_at))} · ${escapeHtml(item.actor || "-")}</time>${escapeHtml(item.action)}</div>`).join("")
      : `<div class="empty-note">ยังไม่มีประวัติ</div>`;
  } catch (error) {
    el.logList.innerHTML = `<div class="empty-note">โหลดประวัติไม่สำเร็จ (ต้องรันไฟล์ supabase-setup-pin.sql ก่อน)</div>`;
  }
}

// ---------- หน้าจับฉลากเต็มจอ ----------
const draw = { slotId: null, count: 1, spinning: false };
const drawEl = id => document.getElementById(id);

on(drawEl("drawCloseBtn"), "click", closeDrawOverlay);
on(drawEl("drawMinus"), "click", () => { draw.count--; updateDrawStepper(); buildReels(); });
on(drawEl("drawPlus"), "click", () => { draw.count++; updateDrawStepper(); buildReels(); });
on(drawEl("drawSpinBtn"), "click", spinDraw);
window.addEventListener("keydown", event => {
  if (event.key === "Escape" && el.drawOverlay && !el.drawOverlay.hidden && !draw.spinning) closeDrawOverlay();
});

function drawCandidates() {
  const slot = findSlot(draw.slotId);
  return slot ? uniqueNames(slotBookingsOf(slot).map(item => item.person_name)) : [];
}

function openDrawOverlay(slotId, count = 1) {
  if (!isAdmin()) return;
  const slot = findSlot(slotId);
  if (!slot) return;
  const names = uniqueNames(slotBookingsOf(slot).map(item => item.person_name));
  if (!names.length) return alert("ยังไม่มีคนจอง Loc นี้");
  draw.slotId = slot.id;
  draw.count = Math.max(1, Math.min(Number(count) || 1, names.length));
  drawEl("drawTitle").textContent = slotDateLabel(slot);
  drawEl("drawMeta").textContent = `${slotLeaveDays(slot)} วันลา · ผู้จอง ${names.length} คน${slot.winner_name ? ` · ผลเดิม: ${slot.winner_name}` : ""}`;
  drawEl("drawNames").innerHTML = names.map(name => `<span class="name-chip">${escapeHtml(name)}</span>`).join("");
  drawEl("drawSaved").hidden = true;
  drawEl("drawNextBtn").hidden = true;
  drawEl("drawSpinBtn").hidden = false;
  drawEl("drawSpinBtn").disabled = false;
  drawEl("drawMessage").textContent = "กดปุ่มด้านล่างเพื่อเริ่มสุ่ม";
  updateDrawStepper();
  buildReels();
  el.drawOverlay.hidden = false;
  el.drawOverlay.scrollTop = 0;
  document.body.classList.add("drawing");
  drawEl("drawSpinBtn").focus();
}

function closeDrawOverlay() {
  if (draw.spinning) return;
  el.drawOverlay.hidden = true;
  document.body.classList.remove("drawing");
  draw.slotId = null;
}

function updateDrawStepper() {
  const total = drawCandidates().length;
  drawEl("drawCount").textContent = draw.count;
  drawEl("drawMinus").disabled = draw.spinning || draw.count <= 1;
  drawEl("drawPlus").disabled = draw.spinning || draw.count >= total;
}

function buildReels() {
  drawEl("drawReels").innerHTML = Array.from({ length: draw.count }, () =>
    `<div class="reel"><div class="reel-strip"><div>?</div></div></div>`).join("");
}

function spinDraw() {
  if (draw.spinning) return;
  const names = drawCandidates();
  if (!names.length) return;
  draw.spinning = true;
  updateDrawStepper();
  drawEl("drawSpinBtn").disabled = true;
  drawEl("drawMessage").textContent = "กำลังสุ่ม…";
  const pool = [...names];
  const random = max => {
    if (window.crypto?.getRandomValues) { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % max; }
    return Math.floor(Math.random() * max);
  };
  for (let i = pool.length - 1; i > 0; i--) { const j = random(i + 1); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const picked = pool.slice(0, draw.count);
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const reels = [...document.querySelectorAll("#drawReels .reel")];
  let finished = 0;
  reels.forEach((reel, index) => {
    const strip = reel.querySelector(".reel-strip");
    const sequence = [];
    const loops = reduce ? 1 : 16 + index * 6;
    for (let k = 0; k < loops; k++) sequence.push(names[(k + index) % names.length]);
    sequence.push(picked[index]);
    strip.innerHTML = sequence.map(name => `<div>${escapeHtml(name)}</div>`).join("");
    strip.style.transition = "none";
    strip.style.transform = "translateY(0)";
    void strip.offsetHeight;
    const duration = reduce ? 150 : 2800 + index * 800;
    const rowHeight = strip.firstElementChild.offsetHeight || 76;
    strip.style.transition = `transform ${duration}ms cubic-bezier(.12,.75,.18,1)`;
    strip.style.transform = `translateY(-${(sequence.length - 1) * rowHeight}px)`;
    setTimeout(() => {
      reel.classList.add("win");
      if (++finished === reels.length) finishDraw(picked, names.length);
    }, duration + 60);
  });
}

async function finishDraw(picked, total) {
  const slot = findSlot(draw.slotId);
  const winners = joinWinners(picked);
  drawEl("drawMessage").textContent = "กำลังบันทึกผล…";
  await logEvent(`จับฉลาก Loc ${slotDateLabel(slot)} → ${winners} (จากผู้จอง ${total} คน)${slot.winner_name ? ` · ผลเดิม: ${slot.winner_name}` : ""}`);
  await setWinner(slot.id, winners);
  draw.spinning = false;
  updateDrawStepper();
  drawEl("drawMessage").textContent = "ได้ผลแล้ว!";
  drawEl("drawSpinBtn").hidden = true;
  drawEl("drawWinners").textContent = winners;
  drawEl("drawSaved").hidden = false;
  const yearSlots = slots.filter(item => overlapsFiscalYear(item.start_date, item.end_date));
  const next = yearSlots.filter(item => slotState(item) === "ready").sort((a, b) => a.start_date.localeCompare(b.start_date))[0];
  const nextBtn = drawEl("drawNextBtn");
  nextBtn.hidden = false;
  nextBtn.textContent = next ? `จับฉลาก Loc ถัดไป (${slotDateLabel(next)}) →` : "จับครบทุก Loc แล้ว · กลับหน้าจับฉลาก";
  nextBtn.onclick = () => next ? openDrawOverlay(next.id, 1) : closeDrawOverlay();
  launchConfetti();
}

// ---------- แจ้งเตือนสั้น + คอนเฟตตี ----------
let toastTimer;
function showToast(message) {
  if (!el.toast) return;
  el.toast.textContent = message;
  el.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.toast.hidden = true; }, 2800);
}

function launchConfetti() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = document.getElementById("confetti");
  const ctx = canvas?.getContext("2d");
  if (!ctx) return;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const style = getComputedStyle(document.body);
  const colors = ["--yellow", "--green", "--blue", "--pink", "--cream"].map(name => style.getPropertyValue(name).trim() || "#ead989");
  const bits = Array.from({ length: 130 }, () => ({
    x: canvas.width / 2, y: canvas.height * 0.4,
    vx: (Math.random() - 0.5) * 15, vy: -Math.random() * 15 - 4,
    s: 7 + Math.random() * 6, r: Math.random() * 6,
    c: colors[Math.floor(Math.random() * colors.length)]
  }));
  let frame = 0;
  (function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bits.forEach(b => {
      b.vy += 0.42; b.x += b.vx; b.y += b.vy; b.r += 0.12;
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
      ctx.fillStyle = b.c; ctx.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
      ctx.strokeStyle = "#2f3542"; ctx.lineWidth = 1; ctx.strokeRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
      ctx.restore();
    });
    if (++frame < 120) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  })();
}

/* =====================================================================
   รอบที่ 2 · ขอแลก Loc แบบยืนยันสองฝ่าย
   ===================================================================== */
let swapNoticeShown = false;

const swapApi = hasSupabase ? {
  request(pin, mySlot, targetSlot, targetName) {
    return rpc("locsee_swap_request", { p_name: myName(), p_pin: pin, p_my_slot: String(mySlot), p_target_slot: String(targetSlot), p_target_name: targetName });
  },
  respond(pin, requestId, accept) {
    return rpc("locsee_swap_respond", { p_name: myName(), p_pin: pin, p_request_id: Number(requestId), p_accept: accept });
  },
  cancel(pin, requestId) {
    return rpc("locsee_swap_cancel", { p_name: myName(), p_pin: pin, p_request_id: Number(requestId) });
  }
} : {
  // โหมดทดลองในเครื่อง ทำงานแบบเดียวกับฟังก์ชันใน Supabase
  async request(pin, mySlot, targetSlot, targetName) {
    await localPinCheck(pin);
    const all = readLocal(SWAP_LOCAL_KEY);
    const busy = all.some(r => r.status === "pending" && [[r.from_name, r.from_slot_id], [r.to_name, r.to_slot_id]]
      .some(([n, sl]) => (n === myName() && sl === String(mySlot)) || (n === targetName && sl === String(targetSlot))));
    if (busy) throw new Error("SWAP_PENDING_EXISTS");
    all.unshift({ id: Date.now(), created_at: new Date().toISOString(), from_name: myName(), from_slot_id: String(mySlot), to_name: targetName, to_slot_id: String(targetSlot), status: "pending" });
    writeLocal(SWAP_LOCAL_KEY, all);
    logEvent(`ขอแลก Loc ${slotDateLabel(findSlot(mySlot))} กับ ${targetName} (${slotDateLabel(findSlot(targetSlot))}) · รอตอบรับ`);
  },
  async respond(pin, requestId, accept) {
    await localPinCheck(pin);
    const all = readLocal(SWAP_LOCAL_KEY);
    const r = all.find(item => String(item.id) === String(requestId));
    if (!r || r.status !== "pending") throw new Error("SWAP_NOT_PENDING");
    r.resolved_at = new Date().toISOString();
    if (!accept) { r.status = "rejected"; writeLocal(SWAP_LOCAL_KEY, all); logEvent(`ปฏิเสธคำขอแลก Loc จาก ${r.from_name}`); return "rejected"; }
    const a = findSlot(r.from_slot_id), b = findSlot(r.to_slot_id);
    const an = splitWinners(a?.winner_name), bn = splitWinners(b?.winner_name);
    if (!a || !b || !an.includes(r.from_name) || !bn.includes(r.to_name)) { r.status = "expired"; writeLocal(SWAP_LOCAL_KEY, all); return "expired"; }
    a.winner_name = an.map(n => n === r.from_name ? r.to_name : n).join(", ");
    b.winner_name = bn.map(n => n === r.to_name ? r.from_name : n).join(", ");
    writeLocal(VAC_KEY, slots);
    r.status = "accepted";
    all.forEach(o => { if (o !== r && o.status === "pending" && [o.from_slot_id, o.to_slot_id].some(id => id === r.from_slot_id || id === r.to_slot_id)) { o.status = "expired"; } });
    writeLocal(SWAP_LOCAL_KEY, all);
    logEvent(`แลก Loc สำเร็จ: ${r.from_name} ได้ ${slotDateLabel(b)} ⇄ ${r.to_name} ได้ ${slotDateLabel(a)}`);
    return "accepted";
  },
  async cancel(pin, requestId) {
    await localPinCheck(pin);
    const all = readLocal(SWAP_LOCAL_KEY);
    const r = all.find(item => String(item.id) === String(requestId));
    if (!r || r.status !== "pending") throw new Error("SWAP_NOT_PENDING");
    r.status = "cancelled"; r.resolved_at = new Date().toISOString();
    writeLocal(SWAP_LOCAL_KEY, all);
    logEvent(`ยกเลิกคำขอแลก Loc กับ ${r.to_name}`);
  }
};

async function localPinCheck(pin) {
  const result = await staffApi.login(myName(), pin);
  if (result.status !== "ok") throw new Error(result.status === "locked" ? "PIN_LOCKED" : "PIN_WRONG");
}

function incomingSwaps() { return swapRequests.filter(r => r.status === "pending" && r.to_name === myName()); }
function outgoingSwaps() { return swapRequests.filter(r => r.status === "pending" && r.from_name === myName()); }
function slotHasPendingSwap(slot, name) {
  return swapRequests.some(r => r.status === "pending" &&
    ((r.from_name === name && String(r.from_slot_id) === String(slot.id)) || (r.to_name === name && String(r.to_slot_id) === String(slot.id))));
}
function swapSlotLabel(id) { const slot = findSlot(id); return slot ? slotDateLabel(slot) : "Loc ที่ถูกลบไปแล้ว"; }

function pinField(id, label = "PIN ของคุณ") {
  return `<input class="input swap-pin" id="${id}" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="off" placeholder="${label}" aria-label="${label}">`;
}

function swapRequestCards() {
  const incoming = incomingSwaps().map(r => `
    <article class="slot-card swap-req">
      <div class="slot-title">🔔 ${escapeHtml(r.from_name)} ขอแลก Loc กับคุณ</div>
      <div class="swap-line">
        <div class="swap-side"><small>คุณจะได้</small><strong>${escapeHtml(swapSlotLabel(r.from_slot_id))}</strong></div>
        <span class="swap-arrow" aria-hidden="true">⇄</span>
        <div class="swap-side"><small>${escapeHtml(r.from_name)} จะได้ (ของคุณตอนนี้)</small><strong>${escapeHtml(swapSlotLabel(r.to_slot_id))}</strong></div>
      </div>
      <div class="swap-actions">
        ${pinField(`swap-pin-${r.id}`)}
        <button class="btn swap" type="button" data-swap-accept="${r.id}">ยอมรับแลก</button>
        <button class="btn ghost" type="button" data-swap-reject="${r.id}">ปฏิเสธ</button>
      </div>
    </article>`).join("");
  const outgoing = outgoingSwaps().map(r => `
    <article class="slot-card swap-req out">
      <div class="slot-title">⏳ รอ ${escapeHtml(r.to_name)} ตอบรับ</div>
      <div class="slot-meta">ของคุณ ${escapeHtml(swapSlotLabel(r.from_slot_id))} ⇄ ของ ${escapeHtml(r.to_name)} ${escapeHtml(swapSlotLabel(r.to_slot_id))}</div>
      <div class="swap-actions">
        ${pinField(`swap-pin-${r.id}`)}
        <button class="btn ghost" type="button" data-swap-cancel="${r.id}">ยกเลิกคำขอ</button>
      </div>
    </article>`).join("");
  return incoming || outgoing ? `<h2 class="section-title">คำขอแลก Loc</h2>${incoming}${outgoing}` : "";
}

function wonSlotCard(slot, yearSlots) {
  const name = myName();
  const busy = slotHasPendingSwap(slot, name);
  const targets = [];
  yearSlots.forEach(other => {
    if (String(other.id) === String(slot.id)) return;
    const winners = splitWinners(other.winner_name);
    if (!winners.length || winners.includes(name)) return;
    winners.forEach(person => {
      if (splitWinners(slot.winner_name).includes(person) || slotHasPendingSwap(other, person)) return;
      targets.push({ slot: other, person });
    });
  });
  targets.sort((a, b) => a.slot.start_date.localeCompare(b.slot.start_date));
  const picking = String(swapPickFor) === String(slot.id);
  return `
    <article class="slot-card">
      <div class="slot-top">
        <div>
          <div class="slot-title">${escapeHtml(slotDateLabel(slot))}</div>
          <div class="slot-meta">ใช้ ${personLeaveDays(slot, name)} วันลา</div>
        </div>
        <div class="actions">
          ${busy ? `<span class="badge one">มีคำขอแลกค้างอยู่</span>`
            : picking ? "" : `<button class="btn swap" type="button" data-swap-pick="${slot.id}" ${targets.length ? "" : "disabled"}>⇄ ขอแลก</button>`}
        </div>
      </div>
      ${picking ? `
        <div class="swap-pick">
          <label for="swap-target-${slot.id}">อยากแลกกับ Loc ของใคร</label>
          <select class="input" id="swap-target-${slot.id}">
            ${targets.map(t => `<option value="${escapeHtml(String(t.slot.id))}|${escapeHtml(t.person)}">${escapeHtml(t.person)} · ${escapeHtml(slotDateLabel(t.slot))}</option>`).join("")}
          </select>
          <div class="swap-actions">
            ${pinField(`swap-pin-new-${slot.id}`, "PIN ยืนยันการขอ")}
            <button class="btn primary" type="button" data-swap-send="${slot.id}">ส่งคำขอแลก</button>
            <button class="btn ghost" type="button" data-swap-pick="">ยกเลิก</button>
          </div>
          <small class="hint">อีกฝ่ายต้องเข้ามาใส่ PIN กดยอมรับก่อน ระบบถึงจะสลับให้</small>
        </div>` : ""}
    </article>`;
}

function swapHistory() {
  const name = myName();
  const done = swapRequests.filter(r => r.status !== "pending" && (r.from_name === name || r.to_name === name)).slice(0, 5);
  if (!done.length) return "";
  const word = { accepted: "✓ แลกสำเร็จ", rejected: "✕ ถูกปฏิเสธ", cancelled: "ยกเลิกแล้ว", expired: "หมดอายุ (ผลจับฉลากเปลี่ยน)" };
  return `<h2 class="section-title">ประวัติการขอแลกล่าสุด</h2>` + done.map(r => `
    <div class="log-item"><time>${escapeHtml(word[r.status] || r.status)}</time>
      ${escapeHtml(r.from_name)} (${escapeHtml(swapSlotLabel(r.from_slot_id))}) ⇄ ${escapeHtml(r.to_name)} (${escapeHtml(swapSlotLabel(r.to_slot_id))})</div>`).join("");
}

on(el.mineList, "click", async event => {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  const d = button.dataset;
  if (d.swapPick !== undefined) {
    swapPickFor = d.swapPick || null;
    render();
    if (swapPickFor) document.getElementById(`swap-target-${swapPickFor}`)?.focus();
    return;
  }
  const readPin = id => {
    const input = document.getElementById(id);
    const pin = input?.value.trim() || "";
    if (!pin) { showToast("ใส่ PIN ของคุณก่อน"); input?.focus(); }
    return pin;
  };
  const run = async (work, success) => {
    button.disabled = true;
    try {
      const result = await work();
      if (result === "expired") showToast("คำขอนี้ใช้ไม่ได้แล้ว เพราะผลจับฉลากเปลี่ยนไป");
      else { showToast(success); if (result === "accepted") launchConfetti(); }
      swapPickFor = null;
      await loadData();
    } catch (error) {
      showToast(staffErrorText(error));
      button.disabled = false;
    }
  };
  if (d.swapSend) {
    const pin = readPin(`swap-pin-new-${d.swapSend}`); if (!pin) return;
    const [targetSlot, targetName] = (document.getElementById(`swap-target-${d.swapSend}`)?.value || "").split("|");
    if (!targetSlot || !targetName) return showToast("เลือก Loc ที่อยากแลกก่อน");
    await run(() => swapApi.request(pin, d.swapSend, targetSlot, targetName), `ส่งคำขอแล้ว รอ ${targetName} ตอบรับ`);
  }
  if (d.swapAccept) {
    const pin = readPin(`swap-pin-${d.swapAccept}`); if (!pin) return;
    await run(() => swapApi.respond(pin, d.swapAccept, true), "แลก Loc สำเร็จแล้ว!");
  }
  if (d.swapReject) {
    const pin = readPin(`swap-pin-${d.swapReject}`); if (!pin) return;
    await run(() => swapApi.respond(pin, d.swapReject, false), "ปฏิเสธคำขอแล้ว");
  }
  if (d.swapCancel) {
    const pin = readPin(`swap-pin-${d.swapCancel}`); if (!pin) return;
    await run(() => swapApi.cancel(pin, d.swapCancel), "ยกเลิกคำขอแล้ว");
  }
});

// เริ่มทำงานหลังประกาศทุกอย่างครบแล้ว
restoreSession();
