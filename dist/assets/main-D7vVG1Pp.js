import "./style-QzXUSgRu.js";
const D = [
    { code: "HAN", city: "Hà Nội", airport: "Nội Bài" },
    { code: "SGN", city: "TP. Hồ Chí Minh", airport: "Tân Sơn Nhất" },
    { code: "DAD", city: "Đà Nẵng", airport: "Đà Nẵng" },
    { code: "PQC", city: "Phú Quốc", airport: "Phú Quốc" },
    { code: "CXR", city: "Nha Trang", airport: "Cam Ranh" },
    { code: "DLI", city: "Đà Lạt", airport: "Liên Khương" },
  ],
  L = {
    VN: { name: "Vietnam Airlines", color: "#155e75", mark: "VN" },
    VJ: { name: "Vietjet Air", color: "#d7263d", mark: "VJ" },
    QH: { name: "Bamboo Airways", color: "#168c70", mark: "QH" },
    VU: { name: "Vietravel Airlines", color: "#f28c28", mark: "VU" },
  },
  O = [
    {
      id: "VN213",
      carrier: "VN",
      from: "HAN",
      to: "SGN",
      depart: "06:10",
      arrive: "08:20",
      duration: "2h 10m",
      price: 1459e3,
      tag: "Bán chạy",
    },
    {
      id: "VJ129",
      carrier: "VJ",
      from: "HAN",
      to: "SGN",
      depart: "08:35",
      arrive: "10:45",
      duration: "2h 10m",
      price: 1069e3,
      tag: "Giá tốt",
    },
    {
      id: "QH201",
      carrier: "QH",
      from: "HAN",
      to: "SGN",
      depart: "11:20",
      arrive: "13:30",
      duration: "2h 10m",
      price: 1279e3,
    },
    {
      id: "VU787",
      carrier: "VU",
      from: "HAN",
      to: "SGN",
      depart: "14:15",
      arrive: "16:25",
      duration: "2h 10m",
      price: 1189e3,
    },
    {
      id: "VN263",
      carrier: "VN",
      from: "HAN",
      to: "SGN",
      depart: "18:05",
      arrive: "20:15",
      duration: "2h 10m",
      price: 1639e3,
    },
    {
      id: "VJ159",
      carrier: "VJ",
      from: "HAN",
      to: "SGN",
      depart: "21:10",
      arrive: "23:20",
      duration: "2h 10m",
      price: 989e3,
      tag: "Rẻ nhất",
    },
  ];
async function x(t, n = {}) {
  const e = await fetch(`/api${t}`, {
    headers: { "Content-Type": "application/json" },
    ...n,
  });
  if (!e.ok) throw new Error(`API ${e.status}`);
  return e.status === 204 ? null : e.json();
}
let v;
try {
  v = await x("/flights");
} catch {
  v = O;
}
const r = {
    results: [...v],
    selected: null,
    step: 1,
    trip: "oneway",
    passengers: 1,
  },
  S = (t) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(t),
  A = new Date(Date.now() + 864e5),
  $ = (t) => {
    const n = t.getFullYear(),
      e = String(t.getMonth() + 1).padStart(2, "0"),
      o = String(t.getDate()).padStart(2, "0");
    return `${n}-${e}-${o}`;
  },
  j = (t, n) => {
    const e = new Date(t);
    return (e.setDate(e.getDate() + n), e);
  },
  g = (t, n = "w-5 h-5") =>
    `<svg class="${n}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="${t}"/></svg>`;
function _() {
  ((document.querySelector("#app").innerHTML = `
    <div id="pageLoader" class="fixed inset-0 z-[100] grid place-items-center bg-[#043e3a] text-white transition duration-700"><div class="text-center"><div class="mx-auto animate-float text-6xl">✈</div><p class="mt-5 text-2xl font-black tracking-tight">TripGO</p><p class="mt-1 text-sm text-white/55">Khởi tạo hành trình của bạn</p><div class="mt-5 h-1 w-44 overflow-hidden rounded-full bg-white/15"><div class="h-full w-1/3 animate-progress rounded-full bg-[#f4bf48]"></div></div></div></div>
    <header class="absolute inset-x-0 top-0 z-20 text-white">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8" aria-label="Điều hướng chính">
        <a href="#" class="flex items-center gap-2 text-2xl font-extrabold"><span class="grid h-9 w-9 place-items-center rounded-xl bg-sun text-ocean">✈</span>TripGo</a>
        <div class="hidden items-center gap-7 text-sm font-medium md:flex"><a href="#search" class="cursor-pointer transition hover:text-sun">Chuyến bay</a><a href="#offers" class="cursor-pointer transition hover:text-sun">Điểm đến</a><button id="lookupBtn" type="button" class="cursor-pointer transition hover:text-sun">Tra cứu</button><button id="bookingBtn" type="button" class="cursor-pointer transition hover:text-sun">Vé của tôi</button><a id="adminNavBtn" href="/admin.html" class="hidden cursor-pointer rounded-xl bg-sun px-4 py-2 font-extrabold text-ocean shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffd56a]">Admin Dashboard</a><button id="authBtn" type="button" class="cursor-pointer rounded-xl border border-white/40 px-4 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-sun hover:bg-white/10 hover:text-sun focus:outline-none focus:ring-4 focus:ring-white/20">Đăng nhập</button></div>
        <button id="mobileBtn" class="rounded-xl border border-white/30 p-2 md:hidden" aria-label="Mở menu">${g("M4 6h16M4 12h16M4 18h16")}</button>
      </nav>
      <div id="mobileMenu" class="mx-5 hidden animate-fade-up rounded-2xl bg-ocean p-5 shadow-2xl md:hidden"><a class="block cursor-pointer py-2" href="#search">Chuyến bay</a><a class="block cursor-pointer py-2" href="#offers">Điểm đến</a><button id="mobileLookupBtn" type="button" class="block w-full cursor-pointer py-2 text-left">Tra cứu</button><button id="mobileBookingBtn" type="button" class="block w-full cursor-pointer py-2 text-left">Vé của tôi</button><a id="mobileAdminNavBtn" href="/admin.html" class="mt-2 hidden w-full cursor-pointer rounded-xl bg-sun px-4 py-2 font-extrabold text-ocean transition hover:bg-[#ffd56a]">Admin Dashboard</a><button id="mobileAuthBtn" type="button" class="mt-2 w-full cursor-pointer rounded-xl border border-white/30 px-4 py-2 text-left transition hover:border-sun hover:text-sun">Đăng nhập</button></div>
    </header>
    <main>
      <section class="min-h-[720px] bg-[linear-gradient(90deg,rgba(3,51,49,.92),rgba(3,51,49,.52)_52%,rgba(3,51,49,.14)),url('/hero.jpg')] bg-cover bg-center pb-16 pt-36 text-white">
        <div class="mx-auto max-w-7xl px-5 lg:px-8">
          <div class="max-w-2xl"><p class="mb-4 text-sm font-semibold uppercase tracking-[.28em] text-sun">Hành trình bắt đầu tại đây</p><h1 class="text-4xl font-extrabold leading-tight md:text-6xl">Bay xa hơn.<br><span class="text-sun">Trải nghiệm nhiều hơn.</span></h1><p class="mt-5 max-w-lg text-base leading-7 text-slate-200 md:text-lg">So sánh chuyến bay, chọn lịch trình phù hợp và hoàn tất đặt chỗ chỉ trong vài phút.</p></div>
          <div id="search" class="mt-10 rounded-[2rem] border border-white/30 bg-white/95 p-4 text-ink shadow-2xl shadow-teal-950/20 backdrop-blur-xl md:p-6">
            <div class="mb-5 flex gap-2" role="tablist"><button data-trip="oneway" class="tripTab rounded-full bg-ocean px-5 py-2.5 text-sm font-semibold text-white">Một chiều</button><button data-trip="round" class="tripTab rounded-full px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100">Khứ hồi</button></div>
            <form id="searchForm" class="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(170px,1fr)_auto_minmax(170px,1fr)_minmax(150px,.8fr)_minmax(110px,.55fr)_auto] xl:items-end">
              ${B("from", "Điểm đi", "HAN")}
              <button type="button" id="swapBtn" class="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-ocean shadow-sm transition hover:-rotate-180" aria-label="Đổi điểm đi và điểm đến">${g("M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4")}</button>
              ${B("to", "Điểm đến", "SGN")}
              ${q("depart", "Ngày đi", "date", $(A), "M8 7V3m8 4V3M5 11h14M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2")}
              ${q("returnDate", "Ngày về", "date", $(j(A, 1)), "M8 7V3m8 4V3M5 11h14M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2", "returnWrap", !0)}
              ${q("passengers", "Hành khách", "number", "1", "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m11-10a4 4 0 100-8 4 4 0 000 8zm9 10v-2a4 4 0 00-3-3.87")}
              <button type="submit" class="h-[58px] rounded-2xl bg-sun px-7 font-bold text-ocean transition hover:-translate-y-0.5 hover:bg-[#ffd56a] focus:outline-none focus:ring-4 focus:ring-sun/30">Tìm chuyến bay</button>
            </form>
          </div>
          <div class="mt-5 flex flex-wrap gap-4 text-sm text-slate-200"><span class="flex items-center gap-2">✓ Không phí ẩn</span><span class="flex items-center gap-2">✓ Giá hiển thị đã gồm thuế</span><span class="flex items-center gap-2">✓ Hỗ trợ 24/7</span></div>
        </div>
      </section>
      <section id="results" class="hidden py-16">
       <div class="mx-auto max-w-7xl px-5 lg:px-8"><div class="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p class="text-sm font-semibold text-ocean">KẾT QUẢ TÌM KIẾM</p><h2 id="routeTitle" class="mt-2 text-3xl font-bold"></h2><p id="routeMeta" class="mt-2 text-slate-500"></p></div><select id="sortSelect" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold"><option value="price">Giá thấp nhất</option><option value="time">Khởi hành sớm</option></select></div><div class="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]"><aside id="filters" class="h-fit rounded-2xl bg-white p-5 shadow-sm"></aside><div id="flightList" class="space-y-4"></div></div></div></section>
      <section id="offers" class="bg-white py-20"><div class="mx-auto max-w-7xl px-5 lg:px-8"><div class="flex items-end justify-between"><div><p class="text-sm font-semibold text-ocean">CẢM HỨNG CHO CHUYẾN ĐI</p><h2 class="mt-2 text-3xl font-bold">Điểm đến được yêu thích</h2></div><span class="hidden text-sm text-slate-500 md:block">Giá tham khảo cho vé một chiều</span></div><div class="mt-8 grid gap-5 md:grid-cols-3">${N("Đà Nẵng", "Thành phố của biển và những cây cầu", "890.000 ₫", "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=80")}${N("Phú Quốc", "Hoàng hôn nhiệt đới giữa đảo ngọc", "1.090.000 ₫", "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=80")}${N("Đà Lạt", "Những ngày se lạnh giữa ngàn thông", "790.000 ₫", "https://images.unsplash.com/photo-1574236170880-fb8568d487e8?auto=format&fit=crop&w=900&q=80")}</div></div></section>
      <section class="bg-slate-50 py-20"><div class="mx-auto max-w-7xl px-5 lg:px-8"><div class="text-center"><p class="text-sm font-black tracking-wider text-ocean">HÀNH TRÌNH DỄ DÀNG HƠN</p><h2 class="mt-2 text-3xl font-black">Mọi tiện ích trong một nơi</h2><p class="mx-auto mt-3 max-w-2xl text-slate-500">Chủ động quản lý chuyến đi từ lúc đặt vé đến khi hoàn tất hành trình.</p></div><div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">${w("01", "Làm thủ tục trực tuyến", "Tiết kiệm thời gian tại sân bay và chủ động chọn chỗ ngồi.")}${w("02", "Quản lý đặt chỗ", "Tra cứu hành trình, thông tin hành khách và trạng thái vé.")}${w("03", "Hành lý linh hoạt", "Kiểm tra quyền lợi hành lý theo từng hạng vé mô phỏng.")}${w("04", "Hỗ trợ 24/7", "Hướng dẫn rõ ràng cho mọi bước trong hành trình của bạn.")}</div></div></section>
      <section class="bg-white py-20"><div class="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-2 lg:px-8"><div><p class="text-sm font-black tracking-wider text-ocean">ƯU ĐÃI TRIPGO</p><h2 class="mt-3 text-4xl font-black leading-tight">Sẵn sàng cho hành trình tiếp theo?</h2><p class="mt-5 max-w-xl leading-7 text-slate-500">Khám phá giá vé mô phỏng hấp dẫn, lịch bay linh hoạt và trải nghiệm đặt chỗ đơn giản trên mọi thiết bị.</p><div class="mt-7 flex flex-wrap gap-3"><a href="#search" class="rounded-2xl bg-ocean px-6 py-3.5 font-black text-white shadow-lg shadow-teal-900/15 transition duration-300 hover:-translate-y-1 hover:bg-[#064b46]">Tìm chuyến bay</a><button id="promoLookup" class="rounded-2xl border border-slate-200 px-6 py-3.5 font-black text-ocean transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:bg-teal-50">Tra cứu vé</button></div></div><div class="grid grid-cols-2 gap-4"><div class="rounded-[2rem] bg-[#043e3a] p-6 text-white shadow-xl transition duration-500 hover:-translate-y-2"><p class="text-4xl font-black text-sun">30+</p><p class="mt-2 text-sm text-white/65">Hành trình mô phỏng</p></div><div class="mt-8 rounded-[2rem] bg-[#f4bf48] p-6 text-ocean shadow-xl transition duration-500 hover:-translate-y-2"><p class="text-4xl font-black">24/7</p><p class="mt-2 text-sm text-ocean/65">Hỗ trợ hành khách</p></div><div class="rounded-[2rem] bg-teal-50 p-6 text-ocean shadow-lg transition duration-500 hover:-translate-y-2"><p class="text-4xl font-black">3 bước</p><p class="mt-2 text-sm text-ocean/65">Hoàn tất đặt vé</p></div><div class="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg transition duration-500 hover:-translate-y-2"><p class="text-4xl font-black text-ocean">100%</p><p class="mt-2 text-sm text-slate-500">Dữ liệu demo</p></div></div></div></section>
      <section id="support" class="bg-ocean py-16 text-white"><div class="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8"><div><div class="text-2xl font-extrabold"><span class="text-sun">✈</span> TripGo</div><p class="mt-4 max-w-md text-sm leading-6 text-slate-300">Website mô phỏng đặt vé máy bay phục vụ học tập. Không phát hành vé thật và không thực hiện giao dịch thanh toán.</p></div><div><h3 class="font-bold">Hỗ trợ khách hàng</h3><p class="mt-4 text-sm text-slate-300">Hotline: 1900 6789<br>Email: hello@tripgo.demo</p></div><div><h3 class="font-bold">Thông tin</h3><p class="mt-4 text-sm text-slate-300">Điều khoản sử dụng<br>Chính sách bảo mật<br>Câu hỏi thường gặp</p></div></div></section>
    </main>
    <div id="modalRoot"></div><div id="toast" class="pointer-events-none fixed bottom-5 right-5 z-[70]"></div>`),
    G(),
    setTimeout(() => {
      const t = document.querySelector("#pageLoader");
      (t?.classList.add("opacity-0", "pointer-events-none"),
        setTimeout(() => t?.remove(), 700));
    }, 750));
}
function B(t, n, e) {
  return `<label class="rounded-2xl border border-slate-200 bg-white px-4 py-3 transition duration-300 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100"><span class="block text-xs font-semibold text-slate-500">${n}</span><select id="${t}" class="mt-1 w-full bg-transparent text-sm font-bold outline-none">${D.map((o) => `<option value="${o.code}" ${o.code === e ? "selected" : ""}>${o.city} (${o.code})</option>`).join("")}</select></label>`;
}
function q(t, n, e, o, s, a = "", d = !1) {
  return `<label${a ? ` id="${a}"` : ""} class="${d ? "hidden " : ""}rounded-2xl border border-slate-200 bg-white px-4 py-3 transition duration-300 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100"><span class="block text-xs font-semibold text-slate-500">${n}</span><span class="mt-1 flex items-center gap-2 text-ocean">${g(s, "h-4 w-4")}<input id="${t}" type="${e}" value="${o}" min="${e === "number" ? "1" : $(new Date())}" max="${e === "number" ? "9" : ""}" required class="w-full bg-transparent text-sm font-bold text-ink outline-none"></span></label>`;
}
function N(t, n, e, o) {
  return `<article class="group relative min-h-[340px] overflow-hidden rounded-[2rem] shadow-lg transition duration-500 hover:-translate-y-2 hover:shadow-2xl"><img src="${o}" alt="${t}" class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"><div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10"></div><div class="absolute inset-x-0 bottom-0 p-6 text-white"><p class="text-sm text-slate-200">${n}</p><div class="mt-2 flex items-end justify-between"><h3 class="text-2xl font-bold">${t}</h3><span class="rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur">Từ ${e}</span></div></div></article>`;
}
function w(t, n, e) {
  return `<article class="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-2 hover:border-teal-200 hover:shadow-xl"><span class="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 font-black text-ocean transition duration-500 group-hover:rotate-6 group-hover:bg-ocean group-hover:text-white">${t}</span><h3 class="mt-5 text-lg font-black">${n}</h3><p class="mt-2 text-sm leading-6 text-slate-500">${e}</p></article>`;
}
function G() {
  const t = document.querySelector("#depart"),
    n = document.querySelector("#returnDate"),
    e = () => {
      const o = $(j(new Date(`${t.value}T00:00:00`), 1));
      ((n.min = o), n.value < o && (n.value = o));
    };
  ((document.querySelector("#mobileBtn").onclick = () =>
    document.querySelector("#mobileMenu").classList.toggle("hidden")),
    t.addEventListener("change", e),
    e(),
    document.querySelectorAll(".tripTab").forEach(
      (o) =>
        (o.onclick = () => {
          r.trip = o.dataset.trip;
          const s = r.trip === "round",
            a = document.querySelector("#searchForm");
          (e(),
            document
              .querySelector("#returnWrap")
              .classList.toggle("hidden", !s),
            (document.querySelector("#returnDate").disabled = !s),
            (a.className = s
              ? "grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(145px,1fr)_auto_minmax(145px,1fr)_minmax(135px,.8fr)_minmax(135px,.8fr)_minmax(95px,.55fr)_auto] xl:items-end"
              : "grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(170px,1fr)_auto_minmax(170px,1fr)_minmax(150px,.8fr)_minmax(110px,.55fr)_auto] xl:items-end"),
            document
              .querySelectorAll(".tripTab")
              .forEach(
                (d) =>
                  (d.className =
                    "tripTab cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition " +
                    (d === o
                      ? "bg-ocean text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-100")),
              ));
        }),
    ),
    (n.disabled = !0),
    (document.querySelector("#swapBtn").onclick = () => {
      const o = document.querySelector("#from"),
        s = document.querySelector("#to");
      [o.value, s.value] = [s.value, o.value];
    }),
    (document.querySelector("#searchForm").onsubmit = (o) => {
      (o.preventDefault(), F());
    }),
    (document.querySelector("#bookingBtn").onclick = M),
    (document.querySelector("#mobileBookingBtn").onclick = M),
    (document.querySelector("#lookupBtn").onclick = T),
    (document.querySelector("#mobileLookupBtn").onclick = T),
    (document.querySelector("#authBtn").onclick = H),
    (document.querySelector("#mobileAuthBtn").onclick = H),
    (document.querySelector("#promoLookup").onclick = T),
    f(),
    new URLSearchParams(location.search).get("login") === "1" &&
      (history.replaceState({}, "", location.pathname), setTimeout(H, 850)));
}
function F() {
  const t = document.querySelector("#from").value,
    n = document.querySelector("#to").value;
  if (t === n) return i("Điểm đi và điểm đến phải khác nhau", "error");
  if (
    r.trip === "round" &&
    document.querySelector("#returnDate").value <=
      document.querySelector("#depart").value
  )
    return i("Ngày về phải sau ngày khởi hành.", "error");
  ((r.passengers = +document.querySelector("#passengers").value),
    (r.results = v.map((e) => ({ ...e, from: t, to: n }))),
    (document.querySelector("#routeTitle").textContent = `${c(t)} → ${c(n)}`),
    (document.querySelector("#routeMeta").textContent =
      `${V(document.querySelector("#depart").value)}${r.trip === "round" ? ` → ${V(document.querySelector("#returnDate").value)}` : ""} · ${r.passengers} hành khách · Bay thẳng`),
    document.querySelector("#results").classList.remove("hidden"),
    K(),
    C(),
    document.querySelector("#results").scrollIntoView({ behavior: "smooth" }),
    (document.querySelector("#sortSelect").onchange = C));
}
function c(t) {
  return D.find((n) => n.code === t)?.city || t;
}
function V(t) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(t + "T00:00:00"));
}
function K() {
  ((document.querySelector("#filters").innerHTML =
    `<h3 class="font-bold">Bộ lọc</h3><div class="mt-5 border-t pt-5"><p class="text-sm font-semibold">Hãng bay</p>${Object.entries(
      L,
    )
      .map(
        ([t, n]) =>
          `<label class="mt-3 flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" class="carrierFilter h-4 w-4 accent-ocean" value="${t}" checked>${n.name}</label>`,
      )
      .join(
        "",
      )}</div><div class="mt-6 border-t pt-5"><p class="text-sm font-semibold">Khởi hành</p><label class="mt-3 flex items-center gap-3 text-sm"><input id="morning" type="checkbox" class="h-4 w-4 accent-ocean">Trước 12:00</label></div>`),
    document
      .querySelectorAll("#filters input")
      .forEach((t) => (t.onchange = C)));
}
function C() {
  const t = [...document.querySelectorAll(".carrierFilter:checked")].map(
      (o) => o.value,
    ),
    n = document.querySelector("#morning")?.checked;
  let e = r.results.filter(
    (o) => t.includes(o.carrier) && (!n || +o.depart.slice(0, 2) < 12),
  );
  (e.sort(
    document.querySelector("#sortSelect")?.value === "time"
      ? (o, s) => o.depart.localeCompare(s.depart)
      : (o, s) => o.price - s.price,
  ),
    (document.querySelector("#flightList").innerHTML = e.length
      ? e.map((o, s) => R(o, s)).join("")
      : '<div class="rounded-2xl bg-white p-12 text-center"><p class="text-lg font-bold">Không tìm thấy chuyến bay</p><p class="mt-2 text-sm text-slate-500">Hãy thay đổi bộ lọc để xem thêm lựa chọn.</p></div>'),
    document
      .querySelectorAll("[data-book]")
      .forEach(
        (o) =>
          (o.onclick = () => J(r.results.find((s) => s.id === o.dataset.book))),
      ));
}
function R(t, n) {
  const e = L[t.carrier] || {
    name: t.carrier,
    color: "#075f58",
    mark: t.carrier,
  };
  return `<article class="animate-fade-up rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl" style="animation-delay:${n * 50}ms"><div class="grid items-center gap-5 md:grid-cols-[180px_1fr_170px]"><div class="flex items-center gap-3"><span class="grid h-11 w-11 place-items-center rounded-xl text-sm font-extrabold text-white" style="background:${e.color}">${e.mark}</span><div><p class="text-sm font-bold">${e.name}</p><p class="text-xs text-slate-500">${t.id} · Economy</p></div></div><div class="grid grid-cols-[1fr_1.2fr_1fr] items-center text-center"><div><strong class="text-xl">${t.depart}</strong><p class="text-xs text-slate-500">${t.from}</p></div><div class="relative"><p class="text-xs text-slate-500">${t.duration}</p><div class="relative my-3 border-t-2 border-dashed border-slate-300"><span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-ocean">✈</span></div><p class="text-[11px] text-emerald-600">Bay thẳng</p></div><div><strong class="text-xl">${t.arrive}</strong><p class="text-xs text-slate-500">${t.to}</p></div></div><div class="text-right"><div class="flex items-center justify-end gap-2">${t.tag ? `<span class="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">${t.tag}</span>` : ""}<strong class="text-lg text-ocean">${S(t.price)}</strong></div><p class="mb-3 text-xs text-slate-400">/ hành khách</p><button data-book="${t.id}" class="rounded-xl bg-ocean px-5 py-2.5 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-ink">Chọn chuyến</button></div></div><div class="mt-4 flex flex-wrap gap-4 border-t pt-4 text-xs text-slate-500"><span>🧳 Hành lý xách tay 7kg</span><span>💺 Chọn chỗ có phí</span><span>↻ Đổi vé có điều kiện</span></div></article>`;
}
function J(t) {
  ((r.selected = t), (r.step = 1), k());
}
function k() {
  const t = r.selected,
    n = t ? t.price * r.passengers : 0;
  (document.body.classList.add("overflow-hidden"),
    (document.querySelector("#modalRoot").innerHTML =
      `<div class="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm md:items-center md:p-5" role="dialog" aria-modal="true"><div class="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white md:rounded-3xl"><div class="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-5"><div><p class="text-xs font-semibold text-ocean">BƯỚC ${r.step}/3</p><h2 class="text-xl font-bold">${["Thông tin chuyến bay", "Thông tin hành khách", "Xác nhận đặt chỗ"][r.step - 1]}</h2></div><button id="closeModal" class="rounded-full p-2 hover:bg-slate-100" aria-label="Đóng">${g("M6 18L18 6M6 6l12 12")}</button></div><div class="p-6">${r.step === 1 ? U(t, n) : r.step === 2 ? P() : Q(t, n)}</div></div></div>`),
    (document.querySelector("#closeModal").onclick = p),
    document.querySelector("#backStep")?.addEventListener("click", () => {
      (r.step--, k());
    }),
    document.querySelector("#nextStep")?.addEventListener("click", () => {
      (r.step++, k());
    }),
    document
      .querySelector("#passengerForm")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        const o = Object.fromEntries(new FormData(e.target)),
          s = document.querySelector("#passengerError"),
          a = /^[\p{L}\s.'-]{2,}$/u.test(o.name.trim())
            ? /^0\d{9}$/.test(o.phone)
              ? new Date(o.birthDate) >= new Date()
                ? "Ngày sinh phải nhỏ hơn ngày hiện tại."
                : o.gender
                  ? ""
                  : "Vui lòng chọn giới tính."
              : "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0."
            : "Họ tên phải có ít nhất 2 ký tự và không chứa số.";
        if (a) {
          ((s.textContent = a), s.classList.remove("hidden"));
          return;
        }
        ((r.passenger = o), (r.step = 3), k());
      }),
    document.querySelector("#confirmBook")?.addEventListener("click", z));
}
function U(t, n) {
  const e = L[t.carrier];
  return `<div class="rounded-2xl bg-mist p-5"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><span class="grid h-11 w-11 place-items-center rounded-xl text-sm font-bold text-white" style="background:${e.color}">${e.mark}</span><div><b>${e.name}</b><p class="text-xs text-slate-500">${t.id}</p></div></div><span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Bay thẳng</span></div><div class="mt-7 grid grid-cols-[1fr_auto_1fr] items-center text-center"><div><b class="text-2xl">${t.depart}</b><p class="text-sm text-slate-500">${c(t.from)} (${t.from})</p></div><span class="px-5 text-2xl text-ocean">✈</span><div><b class="text-2xl">${t.arrive}</b><p class="text-sm text-slate-500">${c(t.to)} (${t.to})</p></div></div></div>${I(n)}<button id="nextStep" class="mt-6 w-full rounded-xl bg-ocean py-3.5 font-bold text-white">Tiếp tục</button>`;
}
function P() {
  const t = r.passenger || {};
  return `<form id="passengerForm" class="space-y-4"><div class="grid gap-4 md:grid-cols-2">${h("name", "Họ và tên", t.name || "", "Nguyễn Văn An")}${h("phone", "Số điện thoại", t.phone || "", "0901234567", "tel")}${h("email", "Email", t.email || "", "an@example.com", "email")}${h("idNumber", "CCCD/Hộ chiếu", t.idNumber || "", "012345678901")}${h("birthDate", "Ngày sinh", t.birthDate || "", "", "date")}<label><span class="mb-2 block text-sm font-semibold">Giới tính</span><select name="gender" required class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-ocean focus:ring-4 focus:ring-ocean/10"><option value="">Chọn giới tính</option><option ${t.gender === "Nam" ? "selected" : ""}>Nam</option><option ${t.gender === "Nữ" ? "selected" : ""}>Nữ</option><option ${t.gender === "Khác" ? "selected" : ""}>Khác</option></select></label></div><p id="passengerError" class="hidden rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700"></p><label class="flex gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900"><input required type="checkbox" class="mt-1 accent-ocean">Tôi xác nhận thông tin trên là chính xác và đồng ý với điều khoản đặt chỗ demo.</label><div class="flex gap-3"><button type="button" id="backStep" class="flex-1 rounded-xl border border-slate-200 py-3.5 font-bold">Quay lại</button><button class="flex-[2] rounded-xl bg-ocean py-3.5 font-bold text-white">Kiểm tra thông tin</button></div></form>`;
}
function h(t, n, e, o, s = "text") {
  return `<label><span class="mb-2 block text-sm font-semibold">${n}</span><input name="${t}" type="${s}" value="${e}" placeholder="${o}" required class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-ocean focus:ring-4 focus:ring-ocean/10"></label>`;
}
function Q(t, n) {
  return `<div class="rounded-2xl border border-slate-200 p-5"><div class="flex justify-between"><div><p class="text-xs text-slate-500">Hành khách</p><b>${r.passenger.name}</b><p class="mt-1 text-sm text-slate-500">${r.passenger.email} · ${r.passenger.phone}</p></div><span class="text-2xl">🎫</span></div><div class="my-5 border-t border-dashed"></div><div class="flex justify-between text-sm"><span>${c(t.from)} → ${c(t.to)}</span><b>${t.depart} · ${t.id}</b></div></div>${I(n)}<p class="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">Đây là website mô phỏng. Nút xác nhận không thực hiện thanh toán và không phát hành vé thật.</p><div class="mt-6 flex gap-3"><button id="backStep" class="flex-1 rounded-xl border border-slate-200 py-3.5 font-bold">Quay lại</button><button id="confirmBook" class="flex-[2] rounded-xl bg-sun py-3.5 font-bold text-ocean">Xác nhận đặt chỗ</button></div>`;
}
function I(t) {
  return `<div class="mt-5 space-y-3 text-sm"><div class="flex justify-between"><span>Vé máy bay × ${r.passengers}</span><span>${S(t)}</span></div><div class="flex justify-between"><span>Thuế và phí</span><span>Đã bao gồm</span></div><div class="flex justify-between border-t pt-3 text-lg font-bold"><span>Tổng cộng</span><span class="text-ocean">${S(t)}</span></div></div>`;
}
async function z() {
  const t = JSON.parse(localStorage.getItem("tripgoSession") || "null"),
    n = {
      code: "TG" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      flight: r.selected,
      passenger: r.passenger,
      count: r.passengers,
      trip: r.trip,
      status: "Đã xác nhận",
      userId: t?.id || null,
      createdAt: new Date().toISOString(),
    };
  try {
    await x("/bookings", { method: "POST", body: JSON.stringify(n) });
  } catch {
    return i("Không thể lưu vé. Hãy kiểm tra JSON Server.", "error");
  }
  ((document.querySelector("#modalRoot").innerHTML =
    `<div class="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-5 backdrop-blur-sm"><div class="w-full max-w-md rounded-3xl bg-white p-8 text-center"><div class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">✓</div><h2 class="mt-5 text-2xl font-bold">Đặt chỗ thành công!</h2><p class="mt-2 text-slate-500">Mã đặt chỗ của bạn</p><p class="mt-3 rounded-xl bg-mist py-4 text-2xl font-extrabold tracking-widest text-ocean">${n.code}</p><button id="doneBtn" class="mt-6 w-full cursor-pointer rounded-xl bg-ocean py-3.5 font-bold text-white">Hoàn tất</button></div></div>`),
    (document.querySelector("#doneBtn").onclick = () => {
      (p(), i("Đã lưu đặt chỗ vào db.json"));
    }));
}
async function M() {
  let t = [];
  try {
    t = await x("/bookings");
  } catch {}
  (document.body.classList.add("overflow-hidden"),
    (document.querySelector("#modalRoot").innerHTML =
      `<div class="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm md:items-center md:p-5"><div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 md:rounded-3xl"><div class="flex items-center justify-between"><div><p class="text-xs font-semibold text-ocean">CHUYẾN ĐI CỦA BẠN</p><h2 class="text-2xl font-bold">Đặt chỗ của tôi</h2></div><button id="closeModal" class="cursor-pointer rounded-full p-2 hover:bg-slate-100">${g("M6 18L18 6M6 6l12 12")}</button></div><div class="mt-6 space-y-4">${
        t.length
          ? t
              .map((n) => {
                const e = n.status === "Đã hủy";
                return `<div class="rounded-2xl border p-5"><div class="flex items-start justify-between"><div><span class="text-xs text-slate-500">Mã đặt chỗ</span><p class="font-extrabold tracking-wider text-ocean">${n.code}</p></div><span class="rounded-full px-3 py-1 text-xs font-semibold ${e ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}">${n.status || "Đã xác nhận"}</span></div><div class="mt-4 flex items-center justify-between gap-4"><div><b>${c(n.flight.from)} → ${c(n.flight.to)}</b><p class="text-sm text-slate-500">${n.flight.id} · ${n.flight.depart} · ${n.passenger.name}</p></div><div class="text-right"><b>${S(n.flight.price * n.count)}</b>${e ? "" : `<button data-cancel-booking="${n.id}" class="mt-2 block cursor-pointer text-xs font-bold text-red-600 hover:underline">Hủy vé</button>`}</div></div></div>`;
              })
              .join("")
          : '<div class="py-12 text-center"><div class="text-4xl">🎫</div><p class="mt-3 font-bold">Chưa có đặt chỗ nào</p><p class="mt-2 text-sm text-slate-500">Các chuyến bay đã đặt sẽ xuất hiện tại đây.</p></div>'
      }</div></div></div>`),
    (document.querySelector("#closeModal").onclick = p),
    document.querySelectorAll("[data-cancel-booking]").forEach(
      (n) =>
        (n.onclick = async () => {
          const e = t.find((o) => String(o.id) === n.dataset.cancelBooking);
          if (!(!e || !confirm(`Hủy vé ${e.code}?`)))
            try {
              (await x(`/bookings/${e.id}`, {
                method: "PUT",
                body: JSON.stringify({ ...e, status: "Đã hủy" }),
              }),
                i("Đã cập nhật trạng thái vé thành Đã hủy"),
                M());
            } catch {
              i("Không thể hủy vé. Hãy kiểm tra JSON Server.", "error");
            }
        }),
    ));
}
function T() {
  (document.body.classList.add("overflow-hidden"),
    (document.querySelector("#modalRoot").innerHTML =
      `<div class="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-5 backdrop-blur-sm"><div class="w-full max-w-lg rounded-3xl bg-white p-6"><div class="flex items-center justify-between"><div><p class="text-xs font-semibold text-ocean">TRA CỨU NHANH</p><h2 class="text-2xl font-bold">Thông tin hành trình</h2></div><button id="closeModal" class="rounded-full p-2 hover:bg-slate-100">${g("M6 18L18 6M6 6l12 12")}</button></div><div class="mt-6 flex gap-2"><button data-mode="booking" class="lookupTab flex-1 rounded-xl bg-ocean px-3 py-2.5 text-sm font-bold text-white">Mã đặt chỗ</button><button data-mode="flight" class="lookupTab flex-1 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-500">Số hiệu chuyến bay</button></div><form id="lookupForm" class="mt-5"><label class="mb-2 block text-sm font-bold text-slate-600" id="lookupLabel">Nhập mã đặt chỗ</label><input id="lookupValue" class="w-full rounded-2xl border border-slate-200 px-4 py-3 uppercase outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100" placeholder="Ví dụ: TGABC123" required><button class="mt-4 w-full rounded-2xl bg-ocean px-5 py-3 font-extrabold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#064b46]">Tra cứu</button></form><div id="lookupResult" class="mt-5"></div></div></div>`));
  let t = "booking";
  ((document.querySelector("#closeModal").onclick = p),
    document.querySelectorAll(".lookupTab").forEach(
      (n) =>
        (n.onclick = () => {
          ((t = n.dataset.mode),
            document
              .querySelectorAll(".lookupTab")
              .forEach(
                (e) =>
                  (e.className =
                    "lookupTab flex-1 rounded-xl px-3 py-2.5 text-sm font-bold " +
                    (e === n ? "bg-ocean text-white" : "text-slate-500")),
              ),
            (document.querySelector("#lookupLabel").textContent =
              t === "booking" ? "Nhập mã đặt chỗ" : "Nhập số hiệu chuyến bay"),
            (document.querySelector("#lookupValue").placeholder =
              t === "booking" ? "Ví dụ: TGABC123" : "Ví dụ: VN213"),
            (document.querySelector("#lookupResult").innerHTML = ""));
        }),
    ),
    (document.querySelector("#lookupForm").onsubmit = async (n) => {
      n.preventDefault();
      const e = document
        .querySelector("#lookupValue")
        .value.trim()
        .toUpperCase();
      let o;
      if (t === "booking")
        try {
          o = (await x(`/bookings?code=${encodeURIComponent(e)}`))[0];
        } catch {}
      else o = v.find((s) => s.id === e);
      document.querySelector("#lookupResult").innerHTML = o
        ? W(o, t)
        : '<p class="rounded-xl bg-red-50 p-4 text-sm text-red-700">Không tìm thấy thông tin phù hợp. Hãy kiểm tra lại mã.</p>';
    }));
}
function W(t, n) {
  const e = n === "booking" ? t.flight : t;
  return `<div class="rounded-2xl bg-mist p-5"><div class="flex items-center justify-between"><div><p class="text-xs text-slate-500">${n === "booking" ? "Mã đặt chỗ" : "Chuyến bay"}</p><b class="text-lg text-ocean">${n === "booking" ? t.code : e.id}</b></div><span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Đúng giờ</span></div><div class="mt-5 flex items-center justify-between text-center"><div><b class="text-xl">${e.depart}</b><p class="text-sm">${c(e.from)}</p></div><span class="text-2xl text-ocean">✈</span><div><b class="text-xl">${e.arrive}</b><p class="text-sm">${c(e.to)}</p></div></div>${n === "booking" ? `<p class="mt-4 border-t pt-4 text-sm text-slate-600">Hành khách: <b>${t.passenger.name}</b></p>` : ""}</div>`;
}
function H() {
  const t = JSON.parse(sessionStorage.getItem("tripgoAdmin") || "null");
  if (t?.role === "admin") {
    confirm(
      `Đang đăng nhập với tài khoản Admin (${t.email}). Bạn muốn đăng xuất?`,
    ) &&
      (sessionStorage.removeItem("tripgoAdmin"), f(), i("Đã đăng xuất Admin"));
    return;
  }
  const n = JSON.parse(localStorage.getItem("tripgoSession") || "null");
  if (n) {
    confirm(`Đang đăng nhập với ${n.email}. Bạn muốn đăng xuất?`) &&
      (localStorage.removeItem("tripgoSession"), f(), i("Đã đăng xuất"));
    return;
  }
  (document.body.classList.add("overflow-hidden"),
    (document.querySelector("#modalRoot").innerHTML =
      `<div id="authBackdrop" class="fixed inset-0 z-[90] grid place-items-center bg-ink/70 p-5 backdrop-blur-sm"><div class="w-full max-w-md animate-fade-up rounded-3xl bg-white p-6 shadow-2xl"><div class="flex items-center justify-between"><div><p class="text-xs font-semibold text-ocean">TÀI KHOẢN TRIPGO</p><h2 id="authTitle" class="text-2xl font-bold">Đăng nhập</h2></div><button id="closeModal" type="button" class="cursor-pointer rounded-full p-2 transition hover:rotate-90 hover:bg-slate-100" aria-label="Đóng">${g("M6 18L18 6M6 6l12 12")}</button></div><form id="authForm" class="mt-6 space-y-4"><div id="nameWrap" class="hidden">${h("name", "Họ và tên", "", "Nguyễn Văn An")}</div>${h("email", "Email", "", "ban@example.com", "email")}${h("password", "Mật khẩu", "", "Tối thiểu 6 ký tự", "password")}<p id="authError" class="hidden rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700"></p><button type="submit" class="w-full cursor-pointer rounded-2xl bg-ocean px-5 py-3 font-extrabold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#064b46] focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60">Đăng nhập</button></form><button id="toggleAuth" type="button" class="mt-4 w-full cursor-pointer text-sm font-semibold text-ocean transition hover:text-teal-800 hover:underline">Chưa có tài khoản? Đăng ký</button><p class="mt-5 text-center text-xs text-slate-400">Admin và khách hàng đăng nhập tại cùng một nơi.</p></div></div>`));
  let e = !1;
  const o = document.querySelector("#authForm"),
    s = o.querySelector('button[type="submit"]'),
    a = document.querySelector("#authError");
  ((document.querySelector("#nameWrap input").required = !1),
    (document.querySelector("#closeModal").onclick = p),
    (document.querySelector("#authBackdrop").onclick = (y) => {
      y.target.id === "authBackdrop" && p();
    }),
    (document.querySelector("#toggleAuth").onclick = () => {
      ((e = !e),
        a.classList.add("hidden"),
        (document.querySelector("#authTitle").textContent = e
          ? "Đăng ký"
          : "Đăng nhập"),
        document.querySelector("#nameWrap").classList.toggle("hidden", !e),
        (document.querySelector("#nameWrap input").required = e),
        (s.textContent = e ? "Tạo tài khoản" : "Đăng nhập"),
        (document.querySelector("#toggleAuth").textContent = e
          ? "Đã có tài khoản? Đăng nhập"
          : "Chưa có tài khoản? Đăng ký"));
    }),
    (o.onsubmit = async (y) => {
      (y.preventDefault(), a.classList.add("hidden"));
      const l = Object.fromEntries(new FormData(o));
      if (((l.email = l.email.trim().toLowerCase()), l.password.length < 6))
        return d("Mật khẩu cần ít nhất 6 ký tự.");
      ((s.disabled = !0), (s.textContent = "Đang kiểm tra..."));
      try {
        const b = await x("/users");
        if (e) {
          if (l.email === "admin@tripgo.vn")
            throw new Error(
              "Email admin@tripgo.vn là tài khoản quản trị riêng và không thể đăng ký.",
            );
          if (b.some((E) => String(E.email).toLowerCase() === l.email))
            throw new Error("Email này đã được đăng ký.");
          const u = {
            id: `customer-${Date.now()}`,
            name: l.name.trim(),
            email: l.email,
            password: l.password,
            role: "customer",
          };
          (await x("/users", { method: "POST", body: JSON.stringify(u) }),
            localStorage.setItem(
              "tripgoSession",
              JSON.stringify({
                id: u.id,
                name: u.name,
                email: u.email,
                role: "customer",
              }),
            ),
            p(),
            f(),
            i("Đăng ký thành công và đã lưu vào db.json"));
          return;
        }
        const m = b.find(
          (u) =>
            String(u.email).toLowerCase() === l.email &&
            u.password === l.password,
        );
        if (!m) throw new Error("Email hoặc mật khẩu chưa đúng.");
        if (m.role === "admin") {
          const u = { id: m.id, name: m.name, email: m.email, role: "admin" };
          (sessionStorage.setItem("tripgoAdmin", JSON.stringify(u)),
            localStorage.removeItem("tripgoSession"),
            p(),
            f(),
            i("Đăng nhập Admin thành công. Nút Admin Dashboard đã xuất hiện."));
          return;
        }
        (localStorage.setItem(
          "tripgoSession",
          JSON.stringify({
            id: m.id,
            name: m.name,
            email: m.email,
            role: "customer",
          }),
        ),
          sessionStorage.removeItem("tripgoAdmin"),
          p(),
          f(),
          i("Đăng nhập thành công"));
      } catch (b) {
        d(
          b.message === "API 404" || b.message === "API 500"
            ? "Không kết nối được dữ liệu tài khoản. Hãy chạy cả Vite và JSON Server bằng npm run dev."
            : b.message || "Không thể đăng nhập. Vui lòng thử lại.",
        );
      } finally {
        ((s.disabled = !1),
          (s.textContent = e ? "Tạo tài khoản" : "Đăng nhập"));
      }
    }));
  function d(y) {
    ((a.textContent = y),
      a.classList.remove("hidden"),
      (s.disabled = !1),
      (s.textContent = e ? "Tạo tài khoản" : "Đăng nhập"));
  }
}
function f() {
  const t = JSON.parse(sessionStorage.getItem("tripgoAdmin") || "null"),
    n = JSON.parse(localStorage.getItem("tripgoSession") || "null"),
    e = t?.role === "admin";
  (["adminNavBtn", "mobileAdminNavBtn"].forEach((o) =>
    document.querySelector("#" + o)?.classList.toggle("hidden", !e),
  ),
    ["authBtn", "mobileAuthBtn"].forEach((o) => {
      const s = document.querySelector("#" + o);
      s &&
        ((s.textContent = e
          ? "Admin"
          : n
            ? (n.name || n.email).split(" ")[0]
            : "Đăng nhập"),
        (s.title = e || n ? "Nhấn để đăng xuất" : "Nhấn để đăng nhập"),
        s.classList.toggle("border-sun", e),
        s.classList.toggle("text-sun", e));
    }));
}
function p() {
  ((document.querySelector("#modalRoot").innerHTML = ""),
    document.body.classList.remove("overflow-hidden"));
}
function i(t, n = "success") {
  const e = document.querySelector("#toast");
  ((e.innerHTML = `<div class="animate-fade-up rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-2xl ${n === "error" ? "bg-red-600" : "bg-ink"}">${t}</div>`),
    setTimeout(() => (e.innerHTML = ""), 3e3));
}
_();
document.modelContext?.registerTool &&
  (document.modelContext.registerTool({
    name: "search_flights",
    title: "Tìm chuyến bay",
    description: "Tìm các chuyến bay demo theo mã sân bay đi và đến.",
    inputSchema: {
      type: "object",
      properties: { from: { type: "string" }, to: { type: "string" } },
      required: ["from", "to"],
      additionalProperties: !1,
    },
    annotations: { readOnlyHint: !0, untrustedContentHint: !1 },
    execute: ({ from: t, to: n }) =>
      v
        .filter(
          (e) =>
            e.from === String(t).toUpperCase() &&
            e.to === String(n).toUpperCase(),
        )
        .map(({ id: e, depart: o, arrive: s, duration: a, price: d }) => ({
          id: e,
          depart: o,
          arrive: s,
          duration: a,
          price: d,
        })),
  }),
  document.modelContext.registerTool({
    name: "lookup_booking",
    title: "Tra cứu đặt chỗ",
    description:
      "Tra cứu đặt chỗ demo đã lưu trên trình duyệt bằng mã đặt chỗ.",
    inputSchema: {
      type: "object",
      properties: { code: { type: "string" } },
      required: ["code"],
      additionalProperties: !1,
    },
    annotations: { readOnlyHint: !0, untrustedContentHint: !1 },
    execute: async ({ code: t }) =>
      (
        await x(`/bookings?code=${encodeURIComponent(String(t).toUpperCase())}`)
      )[0] || { found: !1 },
  }));
