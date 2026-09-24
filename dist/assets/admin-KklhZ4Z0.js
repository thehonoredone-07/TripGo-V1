import "./style-QzXUSgRu.js";
const w = JSON.parse(sessionStorage.getItem("tripgoAdmin") || "null");
(!w || w.role !== "admin") && location.replace("/?login=1");
const m = {
    VN: "Vietnam Airlines",
    VJ: "Vietjet Air",
    QH: "Bamboo Airways",
    VU: "Vietravel Airlines",
    TG: "TripGO Air",
  },
  M = ["HAN", "SGN", "DAD", "PQC", "CXR", "DLI", "HUI"];
let r = [],
  l = [],
  g = "dashboard",
  d = !1;
const k = (e) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(e) || 0),
  f =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition duration-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-100",
  L =
    "inline-flex items-center justify-center gap-2 rounded-2xl bg-[#075f58] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-900/10 transition duration-300 hover:-translate-y-0.5 hover:bg-[#064b46] hover:shadow-xl",
  o = (e, a = "h-5 w-5") =>
    `<svg class="${a}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="${e}"/></svg>`,
  i = {
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
async function c(e, a = {}) {
  const t = await fetch("/api" + e, {
    headers: { "Content-Type": "application/json" },
    ...a,
  });
  if (!t.ok) throw new Error();
  return t.status === 204 ? null : t.json();
}
document.querySelector("#adminApp").innerHTML =
  `<div id="loader" class="fixed inset-0 z-[100] grid place-items-center bg-[#043e3a] text-white transition duration-700"><div class="text-center"><div class="mx-auto animate-float text-5xl">✈</div><p class="mt-4 text-xl font-black">TripGO Control</p><div class="mt-4 h-1 w-40 overflow-hidden rounded-full bg-white/15"><div class="h-full w-1/3 animate-progress rounded-full bg-[#f4bf48]"></div></div></div></div><div class="min-h-screen bg-slate-50 text-[#173b3a]"><aside id="sidebar" class="fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col bg-[#043e3a] p-5 text-white shadow-2xl transition duration-300 lg:translate-x-0"><a href="/" class="flex items-center gap-3 px-2 py-3 text-2xl font-black"><span class="grid h-11 w-11 place-items-center rounded-2xl bg-[#f4bf48] text-[#075f58]">✈</span>TripGO</a><p class="px-2 py-5 text-xs font-bold tracking-[.22em] text-white/40">ADMIN CONTROL</p><nav class="space-y-2">${y("dashboard", i.home, "Tổng quan")}${y("flights", i.plane, "Quản lý chuyến bay")}${y("bookings", i.ticket, "Quản lý vé đã đặt")}</nav><div class="mt-auto space-y-2 border-t border-white/10 pt-4"><a href="/" class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/65 transition hover:bg-white/10 hover:text-white">← Về trang khách</a><button id="logout" class="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/65 transition hover:bg-red-500/20 hover:text-red-200">${o(i.logout)} Đăng xuất</button></div></aside><main class="min-h-screen transition-all lg:ml-72"><header class="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-7"><div class="flex items-center gap-3"><button id="menu" class="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 transition hover:bg-slate-50 lg:hidden">${o(i.menu)}</button><div><h1 id="title" class="text-xl font-black">Tổng quan</h1><p class="hidden text-sm text-slate-500 sm:block" id="date"></p></div></div><div class="flex items-center gap-3"><span class="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700 md:block">● Hoạt động</span><div class="text-right"><b class="block text-sm">${w.name}</b><span class="text-xs text-slate-400">Quản trị viên</span></div><div class="grid h-11 w-11 place-items-center rounded-2xl bg-[#075f58] font-black text-white">A</div></div></header><div id="content" class="min-h-[calc(100vh-150px)] p-4 sm:p-7"></div><footer class="border-t bg-white px-6 py-5 text-center text-sm text-slate-400">TripGO Admin · Dữ liệu demo từ db.json</footer></main><div id="modal"></div><div id="toast" class="fixed bottom-5 right-5 z-[110]"></div></div>`;
function y(e, a, t) {
  return `<button data-view="${e}" class="group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-extrabold text-white/60 transition duration-300 hover:translate-x-1 hover:bg-white/10 hover:text-white">${o(a)} ${t}</button>`;
}
async function O() {
  ((document.querySelector("#date").textContent = new Intl.DateTimeFormat(
    "vi-VN",
    { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" },
  ).format(new Date())),
    (document.querySelector("#menu").onclick = () =>
      document.querySelector("#sidebar").classList.toggle("-translate-x-full")),
    (document.querySelector("#logout").onclick = () => {
      (sessionStorage.removeItem("tripgoAdmin"), location.replace("/"));
    }),
    document.querySelectorAll("[data-view]").forEach(
      (e) =>
        (e.onclick = () => {
          ((g = e.dataset.view),
            (d = !1),
            document
              .querySelector("#sidebar")
              .classList.add("-translate-x-full"),
            q());
        }),
    ));
  try {
    [r, l] = await Promise.all([c("/flights"), c("/bookings")]);
  } catch {
    u("Không kết nối được JSON Server", "error");
  }
  (q(),
    setTimeout(() => {
      const e = document.querySelector("#loader");
      (e.classList.add("opacity-0", "pointer-events-none"),
        setTimeout(() => e.remove(), 700));
    }, 650));
}
function q() {
  const e = {
    dashboard: "Tổng quan",
    flights: "Quản lý chuyến bay",
    bookings: "Quản lý vé đã đặt",
  };
  ((document.querySelector("#title").textContent = e[g]),
    document.querySelectorAll("[data-view]").forEach((a) => {
      const t = a.dataset.view === g;
      (a.classList.toggle("bg-white/10", t),
        a.classList.toggle("text-white", t),
        a.classList.toggle("shadow-lg", t));
    }),
    (document.querySelector("#content").className =
      "min-h-[calc(100vh-150px)] p-4 sm:p-7 animate-fade-up"),
    { dashboard: j, flights: T, bookings: F }[g]());
}
const x = (e, a, t, n, s) =>
  `<article class="group rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl"><div class="flex items-start justify-between"><div><p class="text-sm font-bold text-slate-500">${e}</p><p class="mt-2 text-2xl font-black">${a}</p><p class="mt-2 text-xs text-slate-400">${t}</p></div><span class="grid h-12 w-12 place-items-center rounded-2xl ${n} transition duration-500 group-hover:rotate-6 group-hover:scale-110">${o(s)}</span></div></article>`;
function j() {
  const e = l.reduce((a, t) => a + (t.flight?.price || 0) * (t.count || 1), 0);
  ((document.querySelector("#content").innerHTML =
    `<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${x("Chuyến bay", r.length, "Đang khai thác", "bg-teal-50 text-teal-700", i.plane)}${x("Vé đã đặt", l.length, "Tổng đơn đặt chỗ", "bg-amber-50 text-amber-700", i.ticket)}${x("Doanh thu mô phỏng", k(e), "Không phải giao dịch thật", "bg-blue-50 text-blue-700", "M5 12h14M12 5l7 7-7 7")}${x("Tỷ lệ đúng giờ", "92%", "Theo dữ liệu mẫu", "bg-emerald-50 text-emerald-700", "M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0")}</section><section class="mt-6 grid gap-6 xl:grid-cols-[1.55fr_1fr]"><article class="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm"><div class="flex items-center justify-between"><div><p class="text-xs font-black tracking-wider text-teal-700">LỊCH KHAI THÁC</p><h2 class="mt-1 text-xl font-black">${d ? "Tất cả chuyến bay" : "Chuyến bay sắp khởi hành"}</h2></div><button id="expandFlights" class="rounded-xl bg-teal-50 px-4 py-2 text-sm font-extrabold text-teal-700 transition hover:bg-teal-100">${d ? "Thu gọn" : "Xem tất cả"}</button></div><div class="mt-5 grid gap-3 ${d ? "md:grid-cols-2" : ""}">${(d ? r : r.slice(0, 4)).map((a) => D(a)).join("") || S("Chưa có chuyến bay")}</div></article><article class="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm"><p class="text-xs font-black tracking-wider text-teal-700">TÌNH TRẠNG HỆ THỐNG</p><h2 class="mt-1 text-xl font-black">Dữ liệu vận hành</h2><div class="mt-6 space-y-5">${Object.entries(
      m,
    )
      .map(([a, t]) => {
        const n = r.filter((v) => v.carrier === a).length,
          s = r.length ? Math.round((n / r.length) * 100) : 0;
        return `<div><div class="mb-2 flex justify-between text-sm"><span>${t}</span><b>${n}</b></div><div class="h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-gradient-to-r from-teal-700 to-teal-400 transition-all duration-700" style="width:${s}%"></div></div></div>`;
      })
      .join("")}</div></article></section>`),
    (document.querySelector("#expandFlights").onclick = () => {
      ((d = !d), j());
    }));
}
function D(e) {
  return `<div class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition duration-300 hover:border-teal-200 hover:bg-teal-50/40"><div><b>${e.id} · ${e.from} → ${e.to}</b><p class="mt-1 text-xs text-slate-500">${m[e.carrier] || e.carrier}</p></div><div class="text-right"><b>${e.depart}</b><p class="text-xs ${e.status?.includes("Chậm") ? "text-amber-600" : "text-emerald-600"}">${e.status || "Đúng giờ"}</p></div></div>`;
}
function N(e, a) {
  return `<div class="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm"><table class="w-full min-w-[920px] border-collapse"><thead class="bg-slate-50 text-left text-xs font-black uppercase tracking-wider text-slate-500"><tr>${e.map((t) => `<th class="px-5 py-4">${t}</th>`).join("")}</tr></thead><tbody>${a}</tbody></table></div>`;
}
function T() {
  ((document.querySelector("#content").innerHTML =
    `<div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div class="relative max-w-md flex-1"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">${o(i.search, "h-4 w-4")}</span><input id="searchFlight" class="${f} pl-11" placeholder="Tìm số hiệu, điểm đi, điểm đến..."></div><button id="add" class="${L}">${o(i.plus)} Thêm chuyến bay</button></div><div id="flightTable"></div>`),
    (document.querySelector("#add").onclick = () => A()),
    (document.querySelector("#searchFlight").oninput = (e) =>
      C(e.target.value)),
    C(""));
}
function C(e) {
  const a = r.filter((t) =>
    [t.id, t.from, t.to, m[t.carrier]]
      .join(" ")
      .toLowerCase()
      .includes(e.toLowerCase()),
  );
  ((document.querySelector("#flightTable").innerHTML = a.length
    ? N(
        [
          "Chuyến bay",
          "Hành trình",
          "Thời gian",
          "Thời lượng",
          "Giá vé",
          "Trạng thái",
          "Thao tác",
        ],
        a
          .map(
            (t) =>
              `<tr class="border-t border-slate-100 transition hover:bg-teal-50/30"><td class="px-5 py-4"><b>${t.id}</b><p class="text-xs text-slate-400">${m[t.carrier] || t.carrier}</p></td><td class="px-5 py-4 font-bold">${t.from} → ${t.to}</td><td class="px-5 py-4">${t.depart} – ${t.arrive}</td><td class="px-5 py-4">${t.duration}</td><td class="px-5 py-4 font-black text-teal-700">${k(t.price)}</td><td class="px-5 py-4"><span class="rounded-full px-3 py-1 text-xs font-bold ${t.status?.includes("Chậm") ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}">${t.status || "Đúng giờ"}</span></td><td class="px-5 py-4"><div class="flex gap-2"><button data-edit="${t.id}" class="grid h-9 w-9 place-items-center rounded-xl border transition hover:border-teal-300 hover:bg-teal-50">${o(i.edit, "h-4 w-4")}</button><button data-del="${t.id}" class="grid h-9 w-9 place-items-center rounded-xl border transition hover:border-red-300 hover:bg-red-50 hover:text-red-600">${o(i.trash, "h-4 w-4")}</button></div></td></tr>`,
          )
          .join(""),
      )
    : S("Không tìm thấy chuyến bay")),
    document
      .querySelectorAll("[data-edit]")
      .forEach(
        (t) => (t.onclick = () => A(r.find((n) => n.id === t.dataset.edit))),
      ),
    document
      .querySelectorAll("[data-del]")
      .forEach((t) => (t.onclick = () => E(t.dataset.del))));
}
function h(e, a, t = "", n = "text", s = !1) {
  return `<label class="block"><span class="mb-2 block text-sm font-bold text-slate-600">${a}</span><input name="${e}" type="${n}" value="${t}" ${s ? "disabled" : ""} required class="${f} disabled:bg-slate-100"></label>`;
}
function b(e, a, t, n) {
  return `<label class="block"><span class="mb-2 block text-sm font-bold text-slate-600">${a}</span><select name="${e}" class="${f}">${t.map(([s, v]) => `<option value="${s}" ${s === n ? "selected" : ""}>${v}</option>`).join("")}</select></label>`;
}
function A(e = null) {
  ((document.querySelector("#modal").innerHTML =
    `<div class="fixed inset-0 z-[90] grid place-items-center bg-[#032d2a]/70 p-4 backdrop-blur-sm"><section class="max-h-[94vh] w-full max-w-2xl animate-fade-up overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl"><div class="flex items-center justify-between"><div><p class="text-xs font-black tracking-wider text-teal-700">${e ? "CẬP NHẬT" : "TẠO MỚI"}</p><h2 class="text-2xl font-black">${e ? "Sửa chuyến bay" : "Thêm chuyến bay"}</h2></div><button id="close" class="grid h-10 w-10 place-items-center rounded-xl border transition hover:rotate-90 hover:bg-slate-50">${o(i.close)}</button></div><form id="flightForm" class="mt-6 grid gap-4 sm:grid-cols-2">${h("id", "Số hiệu", e?.id || "", "text", !!e)}${b("carrier", "Hãng bay", Object.entries(m), e?.carrier || "TG")}${b(
      "from",
      "Điểm đi",
      M.map((a) => [a, a]),
      e?.from || "HAN",
    )}${b(
      "to",
      "Điểm đến",
      M.map((a) => [a, a]),
      e?.to || "SGN",
    )}${h("depart", "Giờ khởi hành", e?.depart || "", "time")}${h("arrive", "Giờ đến", e?.arrive || "", "time")}${h("duration", "Thời lượng", e?.duration || "")}${h("price", "Giá vé", e?.price || "", "number")}${b(
      "status",
      "Trạng thái",
      [
        ["Đúng giờ", "Đúng giờ"],
        ["Chậm 15 phút", "Chậm 15 phút"],
        ["Chậm 30 phút", "Chậm 30 phút"],
      ],
      e?.status || "Đúng giờ",
    )}<div class="sm:col-span-2"><p id="formError" class="hidden rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700"></p><div class="mt-3 flex gap-3"><button id="cancel" type="button" class="flex-1 rounded-2xl border px-5 py-3 font-extrabold transition hover:bg-slate-50">Hủy</button><button class="${L} flex-[2]">${e ? "Lưu thay đổi" : "Thêm chuyến bay"}</button></div></div></form></section></div>`),
    (document.querySelector("#close").onclick = p),
    (document.querySelector("#cancel").onclick = p),
    (document.querySelector("#flightForm").onsubmit = (a) => G(a, e?.id)));
}
async function G(e, a) {
  e.preventDefault();
  const t = Object.fromEntries(new FormData(e.target));
  ((t.id = (a || t.id).trim().toUpperCase()), (t.price = Number(t.price)));
  const n = V(t, a);
  if (n) return H(n);
  try {
    (a
      ? (await c("/flights/" + encodeURIComponent(a), {
          method: "PUT",
          body: JSON.stringify(t),
        }),
        (r = r.map((s) => (s.id === a ? t : s))))
      : (await c("/flights", { method: "POST", body: JSON.stringify(t) }),
        r.push(t)),
      p(),
      T(),
      u(a ? "Đã lưu thay đổi" : "Đã thêm chuyến bay"));
  } catch {
    H("Không thể ghi vào db.json. Hãy kiểm tra JSON Server.");
  }
}
function V(e, a) {
  return /^[A-Z]{2}[0-9]{2,4}$/.test(e.id)
    ? !a && r.some((t) => t.id === e.id)
      ? "Số hiệu đã tồn tại."
      : e.from === e.to
        ? "Điểm đi và điểm đến phải khác nhau."
        : e.depart === e.arrive
          ? "Giờ đi và giờ đến không được trùng."
          : e.price < 1e5
            ? "Giá vé phải từ 100.000 VNĐ."
            : /^\d+h( \d{1,2}m)?$/.test(e.duration)
              ? ""
              : "Thời lượng theo mẫu: 2h 10m."
    : "Số hiệu gồm 2 chữ cái và 2–4 chữ số.";
}
const H = (e) => {
  const a = document.querySelector("#formError");
  ((a.textContent = e), a.classList.remove("hidden"));
};
function E(e) {
  const a = r.find((t) => t.id === e);
  ((document.querySelector("#modal").innerHTML =
    `<div class="fixed inset-0 z-[90] grid place-items-center bg-[#032d2a]/70 p-4 backdrop-blur-sm"><section class="w-full max-w-md animate-fade-up rounded-[2rem] bg-white p-7 text-center shadow-2xl"><span class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-600">${o(i.trash)}</span><h2 class="mt-5 text-xl font-black">Xóa chuyến ${e}?</h2><p class="mt-2 text-sm text-slate-500">Hành trình ${a.from} → ${a.to} sẽ bị xóa khỏi db.json.</p><div class="mt-6 flex gap-3"><button id="cancel" class="flex-1 rounded-2xl border py-3 font-extrabold">Hủy</button><button id="confirm" class="flex-1 rounded-2xl bg-red-600 py-3 font-extrabold text-white transition hover:bg-red-700">Xóa</button></div></section></div>`),
    (document.querySelector("#cancel").onclick = p),
    (document.querySelector("#confirm").onclick = async () => {
      try {
        (await c("/flights/" + encodeURIComponent(e), { method: "DELETE" }),
          (r = r.filter((t) => t.id !== e)),
          p(),
          T(),
          u("Đã xóa chuyến bay"));
      } catch {
        u("Không thể xóa", "error");
      }
    }));
}
function F() {
  ((document.querySelector("#content").innerHTML =
    `<div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div class="relative max-w-md flex-1"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">${o(i.search, "h-4 w-4")}</span><input id="searchBooking" class="${f} pl-11" placeholder="Tìm mã vé, hành khách, chuyến bay..."></div><span class="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">${l.length} đặt chỗ</span></div><div id="bookingTable"></div>`),
    (document.querySelector("#searchBooking").oninput = (e) =>
      $(e.target.value)),
    $(""));
}
function $(e) {
  const a = l.filter((t) =>
    [t.code, t.passenger?.name, t.passenger?.email, t.flight?.id]
      .join(" ")
      .toLowerCase()
      .includes(e.toLowerCase()),
  );
  ((document.querySelector("#bookingTable").innerHTML = a.length
    ? N(
        [
          "Mã đặt chỗ",
          "Hành khách",
          "Chuyến bay",
          "Số lượng",
          "Tổng tiền",
          "Ngày đặt",
          "Trạng thái",
        ],
        a
          .map(
            (t) =>
              `<tr class="border-t border-slate-100 transition hover:bg-teal-50/30"><td class="px-5 py-4 font-black text-teal-700">${t.code}</td><td class="px-5 py-4"><b>${t.passenger?.name || "Chưa có tên"}</b><p class="text-xs text-slate-400">${t.passenger?.email || ""}</p></td><td class="px-5 py-4"><b>${t.flight?.id || "—"}</b><p class="text-xs text-slate-400">${t.flight?.from || "—"} → ${t.flight?.to || "—"}</p></td><td class="px-5 py-4">${t.count || 1}</td><td class="px-5 py-4 font-black">${k((t.flight?.price || 0) * (t.count || 1))}</td><td class="px-5 py-4">${t.createdAt ? new Date(t.createdAt).toLocaleDateString("vi-VN") : "—"}</td><td class="px-5 py-4"><select data-status="${t.id}" class="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold outline-none transition focus:border-teal-600">${["Đã xác nhận", "Đã check-in", "Đã hủy"].map((n) => `<option ${n === (t.status || "Đã xác nhận") ? "selected" : ""}>${n}</option>`).join("")}</select></td></tr>`,
          )
          .join(""),
      )
    : S(e ? "Không tìm thấy vé phù hợp" : "Chưa có vé nào được đặt")),
    document
      .querySelectorAll("[data-status]")
      .forEach((t) => (t.onchange = () => I(t.dataset.status, t.value))));
}
async function I(e, a) {
  const t = l.find((s) => String(s.id) === String(e));
  if (!t) return;
  const n = { ...t, status: a };
  try {
    (await c("/bookings/" + encodeURIComponent(e), {
      method: "PUT",
      body: JSON.stringify(n),
    }),
      (l = l.map((s) => (String(s.id) === String(e) ? n : s))),
      u("Đã lưu trạng thái vé"),
      $(document.querySelector("#searchBooking")?.value || ""));
  } catch {
    u("Không thể lưu trạng thái", "error");
  }
}
const S = (e) =>
  `<div class="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center"><div class="text-5xl">✈</div><p class="mt-4 font-black">${e}</p><p class="mt-1 text-sm text-slate-400">Dữ liệu sẽ xuất hiện tại đây khi có thông tin.</p></div>`;
function p() {
  document.querySelector("#modal").innerHTML = "";
}
function u(e, a = "ok") {
  const t = document.querySelector("#toast");
  ((t.innerHTML = `<div class="animate-fade-up rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-2xl ${a === "error" ? "bg-red-600" : "bg-[#173b3a]"}">${e}</div>`),
    setTimeout(() => (t.innerHTML = ""), 2600));
}
O();
