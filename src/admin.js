import "./style.css";
import { api } from "./data-store.js";

const admin = JSON.parse(sessionStorage.getItem("tripgoAdmin") || "null");
if (!admin || admin.role !== "admin") location.replace("/?login=1");

const carriers = {
  VN: "Vietnam Airlines",
  VJ: "Vietjet Air",
  QH: "Bamboo Airways",
  VU: "Vietravel Airlines",
  TG: "TripGO Air",
};
const airports = ["HAN", "SGN", "DAD", "PQC", "CXR", "DLI", "HUI"];
let flights = [],
  bookings = [],
  view = "dashboard",
  dashboardExpanded = false;
const money = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Number(n) || 0,
  );
const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition duration-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-100";
const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-[#075f58] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-900/10 transition duration-300 hover:-translate-y-0.5 hover:bg-[#064b46] hover:shadow-xl";
const icon = (d, c = "h-5 w-5") =>
  `<svg class="${c}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="${d}"/></svg>`;
const I = {
  home: "M3 12l9-9 9 9M5 10v10h14V10M9 20v-6h6v6",
  plane: "M2 16l20-8-8 20-3-9-9-3z",
  ticket:
    "M3 7a2 2 0 012-2h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7z",
  plus: "M12 5v14M5 12h14",
  menu: "M4 6h16M4 12h16M4 18h16",
  edit: "M13.5 6.5l4 4M4 20l4.5-1 10-10a2.8 2.8 0 00-4-4l-10 10L4 20z",
  trash: "M3 6h18M8 6V4h8v2m-10 0 1 14h10l1-14M10 11v5m4-5v5",
  close: "M6 18L18 6M6 6l12 12",
  search: "M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0",
  logout: "M10 17l5-5-5-5m5 5H3m12-7h4a2 2 0 012 2v10a2 2 0 01-2 2h-4",
};
document.querySelector("#adminApp").innerHTML =
  `<div id="loader" class="fixed inset-0 z-[100] grid place-items-center bg-[#043e3a] text-white transition duration-700"><div class="text-center"><div class="mx-auto animate-float text-5xl">✈</div><p class="mt-4 text-xl font-black">TripGO Control</p><div class="mt-4 h-1 w-40 overflow-hidden rounded-full bg-white/15"><div class="h-full w-1/3 animate-progress rounded-full bg-[#f4bf48]"></div></div></div></div><div class="min-h-screen bg-slate-50 text-[#173b3a]"><aside id="sidebar" class="fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col bg-[#043e3a] p-5 text-white shadow-2xl transition duration-300 lg:translate-x-0"><a href="/" class="flex items-center gap-3 px-2 py-3 text-2xl font-black"><span class="grid h-11 w-11 place-items-center rounded-2xl bg-[#f4bf48] text-[#075f58]">✈</span>TripGO</a><p class="px-2 py-5 text-xs font-bold tracking-[.22em] text-white/40">ADMIN CONTROL</p><nav class="space-y-2">${nav("dashboard", I.home, "Tổng quan")}${nav("flights", I.plane, "Quản lý chuyến bay")}${nav("bookings", I.ticket, "Quản lý vé đã đặt")}</nav><div class="mt-auto space-y-2 border-t border-white/10 pt-4"><a href="/" class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/65 transition hover:bg-white/10 hover:text-white">← Về trang khách</a><button id="logout" class="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/65 transition hover:bg-red-500/20 hover:text-red-200">${icon(I.logout)} Đăng xuất</button></div></aside><main class="min-h-screen transition-all lg:ml-72"><header class="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-7"><div class="flex items-center gap-3"><button id="menu" class="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 transition hover:bg-slate-50 lg:hidden">${icon(I.menu)}</button><div><h1 id="title" class="text-xl font-black">Tổng quan</h1><p class="hidden text-sm text-slate-500 sm:block" id="date"></p></div></div><div class="flex items-center gap-3"><span class="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700 md:block">● Hoạt động</span><div class="text-right"><b class="block text-sm">${admin.name}</b><span class="text-xs text-slate-400">Quản trị viên</span></div><div class="grid h-11 w-11 place-items-center rounded-2xl bg-[#075f58] font-black text-white">A</div></div></header><div id="content" class="min-h-[calc(100vh-150px)] p-4 sm:p-7"></div><footer class="border-t bg-white px-6 py-5 text-center text-sm text-slate-400">TripGO Admin</footer></main><div id="modal"></div><div id="toast" class="fixed bottom-5 right-5 z-[110]"></div></div>`;

function nav(id, path, label) {
  return `<button data-view="${id}" class="group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-extrabold text-white/60 transition duration-300 hover:translate-x-1 hover:bg-white/10 hover:text-white">${icon(path)} ${label}</button>`;
}
async function init() {
  document.querySelector("#date").textContent = new Intl.DateTimeFormat(
    "vi-VN",
    { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" },
  ).format(new Date());
  document.querySelector("#menu").onclick = () =>
    document.querySelector("#sidebar").classList.toggle("-translate-x-full");
  document.querySelector("#logout").onclick = () => {
    sessionStorage.removeItem("tripgoAdmin");
    location.replace("/");
  };
  document.querySelectorAll("[data-view]").forEach(
    (b) =>
      (b.onclick = () => {
        view = b.dataset.view;
        dashboardExpanded = false;
        document.querySelector("#sidebar").classList.add("-translate-x-full");
        render();
      }),
  );
  try {
    [flights, bookings] = await Promise.all([
      api("/flights"),
      api("/bookings"),
    ]);
  } catch {
    toast("Không tải được dữ liệu. Vui lòng thử lại.", "error");
  }
  render();
  setTimeout(() => {
    const l = document.querySelector("#loader");
    l.classList.add("opacity-0", "pointer-events-none");
    setTimeout(() => l.remove(), 700);
  }, 650);
}
function render() {
  const title = {
    dashboard: "Tổng quan",
    flights: "Quản lý chuyến bay",
    bookings: "Quản lý vé đã đặt",
  };
  document.querySelector("#title").textContent = title[view];
  document.querySelectorAll("[data-view]").forEach((b) => {
    const on = b.dataset.view === view;
    b.classList.toggle("bg-white/10", on);
    b.classList.toggle("text-white", on);
    b.classList.toggle("shadow-lg", on);
  });
  document.querySelector("#content").className =
    "min-h-[calc(100vh-150px)] p-4 sm:p-7 animate-fade-up";
  ({ dashboard, flights: flightPage, bookings: bookingPage })[view]();
}
const card = (label, value, note, color, path) =>
  `<article class="group rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl"><div class="flex items-start justify-between"><div><p class="text-sm font-bold text-slate-500">${label}</p><p class="mt-2 text-2xl font-black">${value}</p><p class="mt-2 text-xs text-slate-400">${note}</p></div><span class="grid h-12 w-12 place-items-center rounded-2xl ${color} transition duration-500 group-hover:rotate-6 group-hover:scale-110">${icon(path)}</span></div></article>`;
function dashboard() {
  const revenue = bookings.reduce(
    (s, b) => s + (b.flight?.price || 0) * (b.count || 1),
    0,
  );
  document.querySelector("#content").innerHTML =
    `<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${card("Chuyến bay", flights.length, "Đang khai thác", "bg-teal-50 text-teal-700", I.plane)}${card("Vé đã đặt", bookings.length, "Tổng đơn đặt chỗ", "bg-amber-50 text-amber-700", I.ticket)}${card("Doanh thu mô phỏng", money(revenue), "Không phải giao dịch thật", "bg-blue-50 text-blue-700", "M5 12h14M12 5l7 7-7 7")}${card("Tỷ lệ đúng giờ", "92%", "Theo dữ liệu mẫu", "bg-emerald-50 text-emerald-700", "M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0")}</section><section class="mt-6 grid gap-6 xl:grid-cols-[1.55fr_1fr]"><article class="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm"><div class="flex items-center justify-between"><div><p class="text-xs font-black tracking-wider text-teal-700">LỊCH KHAI THÁC</p><h2 class="mt-1 text-xl font-black">${dashboardExpanded ? "Tất cả chuyến bay" : "Chuyến bay sắp khởi hành"}</h2></div><button id="expandFlights" class="rounded-xl bg-teal-50 px-4 py-2 text-sm font-extrabold text-teal-700 transition hover:bg-teal-100">${dashboardExpanded ? "Thu gọn" : "Xem tất cả"}</button></div><div class="mt-5 grid gap-3 ${dashboardExpanded ? "md:grid-cols-2" : ""}">${(dashboardExpanded ? flights : flights.slice(0, 4)).map((f) => flightMini(f)).join("") || empty("Chưa có chuyến bay")}</div></article><article class="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm"><p class="text-xs font-black tracking-wider text-teal-700">TÌNH TRẠNG HỆ THỐNG</p><h2 class="mt-1 text-xl font-black">Dữ liệu vận hành</h2><div class="mt-6 space-y-5">${Object.entries(
      carriers,
    )
      .map(([c, n]) => {
        const k = flights.filter((f) => f.carrier === c).length,
          p = flights.length ? Math.round((k / flights.length) * 100) : 0;
        return `<div><div class="mb-2 flex justify-between text-sm"><span>${n}</span><b>${k}</b></div><div class="h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-gradient-to-r from-teal-700 to-teal-400 transition-all duration-700" style="width:${p}%"></div></div></div>`;
      })
      .join("")}</div></article></section>`;
  document.querySelector("#expandFlights").onclick = () => {
    dashboardExpanded = !dashboardExpanded;
    dashboard();
  };
}
function flightMini(f) {
  return `<div class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition duration-300 hover:border-teal-200 hover:bg-teal-50/40"><div><b>${f.id} · ${f.from} → ${f.to}</b><p class="mt-1 text-xs text-slate-500">${carriers[f.carrier] || f.carrier}</p></div><div class="text-right"><b>${f.depart}</b><p class="text-xs ${f.status?.includes("Chậm") ? "text-amber-600" : "text-emerald-600"}">${f.status || "Đúng giờ"}</p></div></div>`;
}
function tableWrap(head, body) {
  return `<div class="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm"><table class="w-full min-w-[920px] border-collapse"><thead class="bg-slate-50 text-left text-xs font-black uppercase tracking-wider text-slate-500"><tr>${head.map((x) => `<th class="px-5 py-4">${x}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></div>`;
}
function flightPage() {
  document.querySelector("#content").innerHTML =
    `<div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div class="relative max-w-md flex-1"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">${icon(I.search, "h-4 w-4")}</span><input id="searchFlight" class="${inputClass} pl-11" placeholder="Tìm số hiệu, điểm đi, điểm đến..."></div><button id="add" class="${buttonPrimary}">${icon(I.plus)} Thêm chuyến bay</button></div><div id="flightTable"></div>`;
  document.querySelector("#add").onclick = () => flightForm();
  document.querySelector("#searchFlight").oninput = (e) =>
    paintFlights(e.target.value);
  paintFlights("");
}
function paintFlights(q) {
  const list = flights.filter((f) =>
    [f.id, f.from, f.to, carriers[f.carrier]]
      .join(" ")
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  document.querySelector("#flightTable").innerHTML = list.length
    ? tableWrap(
        [
          "Chuyến bay",
          "Hành trình",
          "Thời gian",
          "Thời lượng",
          "Giá vé",
          "Trạng thái",
          "Thao tác",
        ],
        list
          .map(
            (f) =>
              `<tr class="border-t border-slate-100 transition hover:bg-teal-50/30"><td class="px-5 py-4"><b>${f.id}</b><p class="text-xs text-slate-400">${carriers[f.carrier] || f.carrier}</p></td><td class="px-5 py-4 font-bold">${f.from} → ${f.to}</td><td class="px-5 py-4">${f.depart} – ${f.arrive}</td><td class="px-5 py-4">${f.duration}</td><td class="px-5 py-4 font-black text-teal-700">${money(f.price)}</td><td class="px-5 py-4"><span class="rounded-full px-3 py-1 text-xs font-bold ${f.status?.includes("Chậm") ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}">${f.status || "Đúng giờ"}</span></td><td class="px-5 py-4"><div class="flex gap-2"><button data-edit="${f.id}" class="grid h-9 w-9 place-items-center rounded-xl border transition hover:border-teal-300 hover:bg-teal-50">${icon(I.edit, "h-4 w-4")}</button><button data-del="${f.id}" class="grid h-9 w-9 place-items-center rounded-xl border transition hover:border-red-300 hover:bg-red-50 hover:text-red-600">${icon(I.trash, "h-4 w-4")}</button></div></td></tr>`,
          )
          .join(""),
      )
    : empty("Không tìm thấy chuyến bay");
  document
    .querySelectorAll("[data-edit]")
    .forEach(
      (b) =>
        (b.onclick = () =>
          flightForm(flights.find((f) => f.id === b.dataset.edit))),
    );
  document
    .querySelectorAll("[data-del]")
    .forEach((b) => (b.onclick = () => removeFlight(b.dataset.del)));
}
function field(n, l, v = "", type = "text", disabled = false) {
  return `<label class="block"><span class="mb-2 block text-sm font-bold text-slate-600">${l}</span><input name="${n}" type="${type}" value="${v}" ${disabled ? "disabled" : ""} required class="${inputClass} disabled:bg-slate-100"></label>`;
}
function select(n, l, opts, v) {
  return `<label class="block"><span class="mb-2 block text-sm font-bold text-slate-600">${l}</span><select name="${n}" class="${inputClass}">${opts.map(([x, t]) => `<option value="${x}" ${x === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>`;
}
function flightForm(f = null) {
  document.querySelector("#modal").innerHTML =
    `<div class="fixed inset-0 z-[90] grid place-items-center bg-[#032d2a]/70 p-4 backdrop-blur-sm"><section class="max-h-[94vh] w-full max-w-2xl animate-fade-up overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl"><div class="flex items-center justify-between"><div><p class="text-xs font-black tracking-wider text-teal-700">${f ? "CẬP NHẬT" : "TẠO MỚI"}</p><h2 class="text-2xl font-black">${f ? "Sửa chuyến bay" : "Thêm chuyến bay"}</h2></div><button id="close" class="grid h-10 w-10 place-items-center rounded-xl border transition hover:rotate-90 hover:bg-slate-50">${icon(I.close)}</button></div><form id="flightForm" class="mt-6 grid gap-4 sm:grid-cols-2">${field("id", "Số hiệu", f?.id || "", "text", !!f)}${select("carrier", "Hãng bay", Object.entries(carriers), f?.carrier || "TG")}${select(
      "from",
      "Điểm đi",
      airports.map((x) => [x, x]),
      f?.from || "HAN",
    )}${select(
      "to",
      "Điểm đến",
      airports.map((x) => [x, x]),
      f?.to || "SGN",
    )}${field("depart", "Giờ khởi hành", f?.depart || "", "time")}${field("arrive", "Giờ đến", f?.arrive || "", "time")}${field("duration", "Thời lượng", f?.duration || "")}${field("price", "Giá vé", f?.price || "", "number")}${select(
      "status",
      "Trạng thái",
      [
        ["Đúng giờ", "Đúng giờ"],
        ["Chậm 15 phút", "Chậm 15 phút"],
        ["Chậm 30 phút", "Chậm 30 phút"],
      ],
      f?.status || "Đúng giờ",
    )}<div class="sm:col-span-2"><p id="formError" class="hidden rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700"></p><div class="mt-3 flex gap-3"><button id="cancel" type="button" class="flex-1 rounded-2xl border px-5 py-3 font-extrabold transition hover:bg-slate-50">Hủy</button><button class="${buttonPrimary} flex-[2]">${f ? "Lưu thay đổi" : "Thêm chuyến bay"}</button></div></div></form></section></div>`;
  document.querySelector("#close").onclick = close;
  document.querySelector("#cancel").onclick = close;
  document.querySelector("#flightForm").onsubmit = (e) => saveFlight(e, f?.id);
}
async function saveFlight(e, old) {
  e.preventDefault();
  const v = Object.fromEntries(new FormData(e.target));
  v.id = (old || v.id).trim().toUpperCase();
  v.price = Number(v.price);
  const err = validate(v, old);
  if (err) return formError(err);
  try {
    if (old) {
      await api("/flights/" + encodeURIComponent(old), {
        method: "PUT",
        body: JSON.stringify(v),
      });
      flights = flights.map((x) => (x.id === old ? v : x));
    } else {
      await api("/flights", { method: "POST", body: JSON.stringify(v) });
      flights.push(v);
    }
    close();
    flightPage();
    toast(old ? "Đã lưu thay đổi" : "Đã thêm chuyến bay");
  } catch {
    formError("Không thể lưu dữ liệu. Vui lòng thử lại.");
  }
}
function validate(v, old) {
  if (!/^[A-Z]{2}[0-9]{2,4}$/.test(v.id))
    return "Số hiệu gồm 2 chữ cái và 2–4 chữ số.";
  if (!old && flights.some((x) => x.id === v.id)) return "Số hiệu đã tồn tại.";
  if (v.from === v.to) return "Điểm đi và điểm đến phải khác nhau.";
  if (v.depart === v.arrive) return "Giờ đi và giờ đến không được trùng.";
  if (v.price < 100000) return "Giá vé phải từ 100.000 VNĐ.";
  if (!/^\d+h( \d{1,2}m)?$/.test(v.duration))
    return "Thời lượng theo mẫu: 2h 10m.";
  return "";
}
const formError = (t) => {
  const e = document.querySelector("#formError");
  e.textContent = t;
  e.classList.remove("hidden");
};
function removeFlight(id) {
  const f = flights.find((x) => x.id === id);
  document.querySelector("#modal").innerHTML =
    `<div class="fixed inset-0 z-[90] grid place-items-center bg-[#032d2a]/70 p-4 backdrop-blur-sm"><section class="w-full max-w-md animate-fade-up rounded-[2rem] bg-white p-7 text-center shadow-2xl"><span class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-600">${icon(I.trash)}</span><h2 class="mt-5 text-xl font-black">Xóa chuyến ${id}?</h2><p class="mt-2 text-sm text-slate-500">Hành trình ${f.from} → ${f.to} sẽ bị xóa khỏi db.json.</p><div class="mt-6 flex gap-3"><button id="cancel" class="flex-1 rounded-2xl border py-3 font-extrabold">Hủy</button><button id="confirm" class="flex-1 rounded-2xl bg-red-600 py-3 font-extrabold text-white transition hover:bg-red-700">Xóa</button></div></section></div>`;
  document.querySelector("#cancel").onclick = close;
  document.querySelector("#confirm").onclick = async () => {
    try {
      await api("/flights/" + encodeURIComponent(id), { method: "DELETE" });
      flights = flights.filter((x) => x.id !== id);
      close();
      flightPage();
      toast("Đã xóa chuyến bay");
    } catch {
      toast("Không thể xóa", "error");
    }
  };
}
function bookingPage() {
  document.querySelector("#content").innerHTML =
    `<div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div class="relative max-w-md flex-1"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">${icon(I.search, "h-4 w-4")}</span><input id="searchBooking" class="${inputClass} pl-11" placeholder="Tìm mã vé, hành khách, chuyến bay..."></div><span class="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">${bookings.length} đặt chỗ</span></div><div id="bookingTable"></div>`;
  document.querySelector("#searchBooking").oninput = (e) =>
    paintBookings(e.target.value);
  paintBookings("");
}
function paintBookings(q) {
  const list = bookings.filter((b) =>
    [b.code, b.passenger?.name, b.passenger?.email, b.flight?.id]
      .join(" ")
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  document.querySelector("#bookingTable").innerHTML = list.length
    ? tableWrap(
        [
          "Mã đặt chỗ",
          "Hành khách",
          "Chuyến bay",
          "Số lượng",
          "Tổng tiền",
          "Ngày đặt",
          "Trạng thái",
        ],
        list
          .map(
            (b) =>
              `<tr class="border-t border-slate-100 transition hover:bg-teal-50/30"><td class="px-5 py-4 font-black text-teal-700">${b.code}</td><td class="px-5 py-4"><b>${b.passenger?.name || "Chưa có tên"}</b><p class="text-xs text-slate-400">${b.passenger?.email || ""}</p></td><td class="px-5 py-4"><b>${b.flight?.id || "—"}</b><p class="text-xs text-slate-400">${b.flight?.from || "—"} → ${b.flight?.to || "—"}</p></td><td class="px-5 py-4">${b.count || 1}</td><td class="px-5 py-4 font-black">${money((b.flight?.price || 0) * (b.count || 1))}</td><td class="px-5 py-4">${b.createdAt ? new Date(b.createdAt).toLocaleDateString("vi-VN") : "—"}</td><td class="px-5 py-4"><select data-status="${b.id}" class="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold outline-none transition focus:border-teal-600">${["Đã xác nhận", "Đã check-in", "Đã hủy"].map((s) => `<option ${s === (b.status || "Đã xác nhận") ? "selected" : ""}>${s}</option>`).join("")}</select></td></tr>`,
          )
          .join(""),
      )
    : empty(q ? "Không tìm thấy vé phù hợp" : "Chưa có vé nào được đặt");
  document
    .querySelectorAll("[data-status]")
    .forEach(
      (s) => (s.onchange = () => saveBookingStatus(s.dataset.status, s.value)),
    );
}
async function saveBookingStatus(id, status) {
  const b = bookings.find((x) => String(x.id) === String(id));
  if (!b) return;
  const updated = { ...b, status };
  try {
    await api("/bookings/" + encodeURIComponent(id), {
      method: "PUT",
      body: JSON.stringify(updated),
    });
    bookings = bookings.map((x) => (String(x.id) === String(id) ? updated : x));
    toast("Đã lưu trạng thái vé");
    paintBookings(document.querySelector("#searchBooking")?.value || "");
  } catch {
    toast("Không thể lưu trạng thái", "error");
  }
}
const empty = (t) =>
  `<div class="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center"><div class="text-5xl">✈</div><p class="mt-4 font-black">${t}</p><p class="mt-1 text-sm text-slate-400">Dữ liệu sẽ xuất hiện tại đây khi có thông tin.</p></div>`;
function close() {
  document.querySelector("#modal").innerHTML = "";
}
function toast(t, type = "ok") {
  const e = document.querySelector("#toast");
  e.innerHTML = `<div class="animate-fade-up rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-2xl ${type === "error" ? "bg-red-600" : "bg-[#173b3a]"}">${t}</div>`;
  setTimeout(() => (e.innerHTML = ""), 2600);
}
init();
