import "./style.css";
import { api } from "./data-store.js";

const airports = [
  { code: "HAN", city: "Hà Nội", airport: "Nội Bài" },
  { code: "SGN", city: "TP. Hồ Chí Minh", airport: "Tân Sơn Nhất" },
  { code: "DAD", city: "Đà Nẵng", airport: "Đà Nẵng" },
  { code: "PQC", city: "Phú Quốc", airport: "Phú Quốc" },
  { code: "CXR", city: "Nha Trang", airport: "Cam Ranh" },
  { code: "DLI", city: "Đà Lạt", airport: "Liên Khương" },
];
const carriers = {
  VN: { name: "Vietnam Airlines", color: "#155e75", mark: "VN" },
  VJ: { name: "Vietjet Air", color: "#d7263d", mark: "VJ" },
  QH: { name: "Bamboo Airways", color: "#168c70", mark: "QH" },
  VU: { name: "Vietravel Airlines", color: "#f28c28", mark: "VU" },
};
const defaultFlights = [
  {
    id: "VN213",
    carrier: "VN",
    from: "HAN",
    to: "SGN",
    depart: "06:10",
    arrive: "08:20",
    duration: "2h 10m",
    price: 1459000,
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
    price: 1069000,
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
    price: 1279000,
  },
  {
    id: "VU787",
    carrier: "VU",
    from: "HAN",
    to: "SGN",
    depart: "14:15",
    arrive: "16:25",
    duration: "2h 10m",
    price: 1189000,
  },
  {
    id: "VN263",
    carrier: "VN",
    from: "HAN",
    to: "SGN",
    depart: "18:05",
    arrive: "20:15",
    duration: "2h 10m",
    price: 1639000,
  },
  {
    id: "VJ159",
    carrier: "VJ",
    from: "HAN",
    to: "SGN",
    depart: "21:10",
    arrive: "23:20",
    duration: "2h 10m",
    price: 989000,
    tag: "Rẻ nhất",
  },
];
let flights;
try {
  flights = await api("/flights");
} catch {
  flights = defaultFlights;
}
const state = {
  searched: false,
  results: [...flights],
  selected: null,
  step: 1,
  trip: "oneway",
  passengers: 1,
};
const money = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n,
  );
const tomorrow = new Date(Date.now() + 86400000);
const dateISO = (d) => {
  const year = d.getFullYear(),
    month = String(d.getMonth() + 1).padStart(2, "0"),
    day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};
const city = (code) =>
  airports.find((airport) => airport.code === code)?.city || code;
const icon = (path, cls = "w-5 h-5") =>
  `<svg class="${cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="${path}"/></svg>`;

function layout() {
  document.querySelector("#app").innerHTML = `
    <div id="pageLoader" class="fixed inset-0 z-[100] grid place-items-center bg-[#043e3a] text-white transition duration-700"><div class="text-center"><div class="mx-auto animate-float text-6xl">✈</div><p class="mt-5 text-2xl font-black tracking-tight">TripGO</p><p class="mt-1 text-sm text-white/55">Khởi tạo hành trình của bạn</p><div class="mt-5 h-1 w-44 overflow-hidden rounded-full bg-white/15"><div class="h-full w-1/3 animate-progress rounded-full bg-[#f4bf48]"></div></div></div></div>
    <header class="absolute inset-x-0 top-0 z-20 text-white">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8" aria-label="Điều hướng chính">
        <a href="#" class="flex items-center gap-2 text-2xl font-extrabold"><span class="grid h-9 w-9 place-items-center rounded-xl bg-sun text-ocean">✈</span>TripGo</a>
        <div class="hidden items-center gap-7 text-sm font-medium md:flex"><a href="#search" class="cursor-pointer transition hover:text-sun">Chuyến bay</a><a href="#offers" class="cursor-pointer transition hover:text-sun">Điểm đến</a><button id="lookupBtn" type="button" class="cursor-pointer transition hover:text-sun">Tra cứu</button><button id="bookingBtn" type="button" class="cursor-pointer transition hover:text-sun">Vé của tôi</button><a id="adminNavBtn" href="/admin.html" class="hidden cursor-pointer rounded-xl bg-sun px-4 py-2 font-extrabold text-ocean shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffd56a]">Admin Dashboard</a><button id="authBtn" type="button" class="cursor-pointer rounded-xl border border-white/40 px-4 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-sun hover:bg-white/10 hover:text-sun focus:outline-none focus:ring-4 focus:ring-white/20">Đăng nhập</button></div>
        <button id="mobileBtn" class="rounded-xl border border-white/30 p-2 md:hidden" aria-label="Mở menu">${icon("M4 6h16M4 12h16M4 18h16")}</button>
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
              ${airportField("from", "Điểm đi", "HAN")}
              <button type="button" id="swapBtn" class="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-ocean shadow-sm transition hover:-rotate-180" aria-label="Đổi điểm đi và điểm đến">${icon("M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4")}</button>
              ${airportField("to", "Điểm đến", "SGN")}
              ${inputField("depart", "Ngày đi", "date", dateISO(tomorrow), "M8 7V3m8 4V3M5 11h14M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2")}
              ${inputField("returnDate", "Ngày về", "date", dateISO(addDays(tomorrow, 1)), "M8 7V3m8 4V3M5 11h14M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2", "returnWrap")}
              ${inputField("passengers", "Hành khách", "number", "1", "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m11-10a4 4 0 100-8 4 4 0 000 8zm9 10v-2a4 4 0 00-3-3.87")}
              <button id="searchSubmit" type="submit" class="h-[58px] cursor-pointer rounded-2xl bg-sun px-7 font-bold text-ocean transition hover:-translate-y-0.5 hover:bg-[#ffd56a] focus:outline-none focus:ring-4 focus:ring-sun/30">Tìm chuyến bay</button>
            </form>
          </div>
          <div class="mt-5 flex flex-wrap gap-4 text-sm text-slate-200"><span class="flex items-center gap-2">✓ Không phí ẩn</span><span class="flex items-center gap-2">✓ Giá hiển thị đã gồm thuế</span><span class="flex items-center gap-2">✓ Hỗ trợ 24/7</span></div>
        </div>
      </section>
      <section id="results" class="hidden py-16">
       <div class="mx-auto max-w-7xl px-5 lg:px-8"><div class="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p class="text-sm font-semibold text-ocean">KẾT QUẢ TÌM KIẾM</p><h2 id="routeTitle" class="mt-2 text-3xl font-bold"></h2><p id="routeMeta" class="mt-2 text-slate-500"></p></div><select id="sortSelect" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold"><option value="price">Giá thấp nhất</option><option value="time">Khởi hành sớm</option></select></div><div class="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]"><aside id="filters" class="h-fit rounded-2xl bg-white p-5 shadow-sm"></aside><div id="flightList" class="space-y-4"></div></div></div></section>
      <section id="offers" class="bg-white py-20"><div class="mx-auto max-w-7xl px-5 lg:px-8"><div class="flex items-end justify-between"><div><p class="text-sm font-semibold text-ocean">CẢM HỨNG CHO CHUYẾN ĐI</p><h2 class="mt-2 text-3xl font-bold">Điểm đến được yêu thích</h2></div><span class="hidden text-sm text-slate-500 md:block">Giá tham khảo cho vé một chiều</span></div><div class="mt-8 grid gap-5 md:grid-cols-3">${destination("Đà Nẵng", "Thành phố của biển và những cây cầu", "890.000 ₫", "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=80")}${destination("Phú Quốc", "Hoàng hôn nhiệt đới giữa đảo ngọc", "1.090.000 ₫", "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=80")}${destination("Đà Lạt", "Những ngày se lạnh giữa ngàn thông", "790.000 ₫", "https://images.unsplash.com/photo-1574236170880-fb8568d487e8?auto=format&fit=crop&w=900&q=80")}</div></div></section>
      <section class="bg-slate-50 py-20"><div class="mx-auto max-w-7xl px-5 lg:px-8"><div class="text-center"><p class="text-sm font-black tracking-wider text-ocean">HÀNH TRÌNH DỄ DÀNG HƠN</p><h2 class="mt-2 text-3xl font-black">Mọi tiện ích trong một nơi</h2><p class="mx-auto mt-3 max-w-2xl text-slate-500">Chủ động quản lý chuyến đi từ lúc đặt vé đến khi hoàn tất hành trình.</p></div><div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">${serviceCard("01", "Làm thủ tục trực tuyến", "Tiết kiệm thời gian tại sân bay và chủ động chọn chỗ ngồi.")}${serviceCard("02", "Quản lý đặt chỗ", "Tra cứu hành trình, thông tin hành khách và trạng thái vé.")}${serviceCard("03", "Hành lý linh hoạt", "Kiểm tra quyền lợi hành lý theo từng hạng vé mô phỏng.")}${serviceCard("04", "Hỗ trợ 24/7", "Hướng dẫn rõ ràng cho mọi bước trong hành trình của bạn.")}</div></div></section>
      <section class="bg-white py-20"><div class="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-2 lg:px-8"><div><p class="text-sm font-black tracking-wider text-ocean">ƯU ĐÃI TRIPGO</p><h2 class="mt-3 text-4xl font-black leading-tight">Sẵn sàng cho hành trình tiếp theo?</h2><p class="mt-5 max-w-xl leading-7 text-slate-500">Khám phá giá vé mô phỏng hấp dẫn, lịch bay linh hoạt và trải nghiệm đặt chỗ đơn giản trên mọi thiết bị.</p><div class="mt-7 flex flex-wrap gap-3"><a href="#search" class="rounded-2xl bg-ocean px-6 py-3.5 font-black text-white shadow-lg shadow-teal-900/15 transition duration-300 hover:-translate-y-1 hover:bg-[#064b46]">Tìm chuyến bay</a><button id="promoLookup" class="rounded-2xl border border-slate-200 px-6 py-3.5 font-black text-ocean transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:bg-teal-50">Tra cứu vé</button></div></div><div class="grid grid-cols-2 gap-4"><div class="rounded-[2rem] bg-[#043e3a] p-6 text-white shadow-xl transition duration-500 hover:-translate-y-2"><p class="text-4xl font-black text-sun">30+</p><p class="mt-2 text-sm text-white/65">Hành trình mô phỏng</p></div><div class="mt-8 rounded-[2rem] bg-[#f4bf48] p-6 text-ocean shadow-xl transition duration-500 hover:-translate-y-2"><p class="text-4xl font-black">24/7</p><p class="mt-2 text-sm text-ocean/65">Hỗ trợ hành khách</p></div><div class="rounded-[2rem] bg-teal-50 p-6 text-ocean shadow-lg transition duration-500 hover:-translate-y-2"><p class="text-4xl font-black">3 bước</p><p class="mt-2 text-sm text-ocean/65">Hoàn tất đặt vé</p></div><div class="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg transition duration-500 hover:-translate-y-2"><p class="text-4xl font-black text-ocean">100%</p><p class="mt-2 text-sm text-slate-500">Dữ liệu hệ thống an toàn  </p></div></div></div></section>
      <section id="support" class="bg-ocean py-16 text-white"><div class="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8"><div><div class="text-2xl font-extrabold"><span class="text-sun">✈</span> TripGo</div><p class="mt-4 max-w-md text-sm leading-6 text-slate-300">Website đặt vé máy bay.</p></div><div><h3 class="font-bold">Hỗ trợ khách hàng</h3><p class="mt-4 text-sm text-slate-300">Hotline: 1900 6789<br>Email: hello@tripgo.demo</p></div><div><h3 class="font-bold">Thông tin</h3><p class="mt-4 text-sm text-slate-300">Điều khoản sử dụng<br>Chính sách bảo mật<br>Câu hỏi thường gặp</p></div></div></section>
    </main>
    <div id="modalRoot"></div><div id="toast" class="pointer-events-none fixed bottom-5 right-5 z-[70]"></div>`;
  bindBase();
  setTimeout(() => {
    const loader = document.querySelector("#pageLoader");
    loader?.classList.add("opacity-0", "pointer-events-none");
    setTimeout(() => loader?.remove(), 700);
  }, 750);
}

function airportField(id, label, value) {
  return `<label class="rounded-2xl border border-slate-200 bg-white px-4 py-3 transition duration-300 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100"><span class="block text-xs font-semibold text-slate-500">${label}</span><select id="${id}" class="mt-1 w-full bg-transparent text-sm font-bold outline-none">${airports.map((a) => `<option value="${a.code}" ${a.code === value ? "selected" : ""}>${a.city} (${a.code})</option>`).join("")}</select></label>`;
}
function inputField(id, label, type, value, path, wrapperId = "") {
  return `<label${wrapperId ? ` id="${wrapperId}"` : ""} class="${wrapperId ? "hidden " : ""}rounded-2xl border border-slate-200 bg-white px-4 py-3 transition duration-300 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100"><span class="block text-xs font-semibold text-slate-500">${label}</span><span class="mt-1 flex items-center gap-2 text-ocean">${icon(path, "h-4 w-4")}<input id="${id}" type="${type}" value="${value}" min="${type === "number" ? "1" : dateISO(new Date())}" max="${type === "number" ? "9" : ""}" required class="w-full bg-transparent text-sm font-bold text-ink outline-none"></span></label>`;
}
function destination(name, desc, price, img) {
  return `<article class="group relative min-h-[340px] overflow-hidden rounded-[2rem] shadow-lg transition duration-500 hover:-translate-y-2 hover:shadow-2xl"><img src="${img}" alt="${name}" class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"><div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10"></div><div class="absolute inset-x-0 bottom-0 p-6 text-white"><p class="text-sm text-slate-200">${desc}</p><div class="mt-2 flex items-end justify-between"><h3 class="text-2xl font-bold">${name}</h3><span class="rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur">Từ ${price}</span></div></div></article>`;
}
function serviceCard(number, title, text) {
  return `<article class="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-2 hover:border-teal-200 hover:shadow-xl"><span class="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 font-black text-ocean transition duration-500 group-hover:rotate-6 group-hover:bg-ocean group-hover:text-white">${number}</span><h3 class="mt-5 text-lg font-black">${title}</h3><p class="mt-2 text-sm leading-6 text-slate-500">${text}</p></article>`;
}

function bindBase() {
  const departInput = document.querySelector("#depart");
  const returnInput = document.querySelector("#returnDate");
  const syncReturnDate = () => {
    const minimum = dateISO(
      addDays(new Date(`${departInput.value}T00:00:00`), 1),
    );
    returnInput.min = minimum;
    if (returnInput.value < minimum) returnInput.value = minimum;
  };
  document.querySelector("#mobileBtn").onclick = () =>
    document.querySelector("#mobileMenu").classList.toggle("hidden");
  departInput.addEventListener("change", syncReturnDate);
  syncReturnDate();
  document.querySelector("#returnWrap").classList.add("hidden");
  returnInput.disabled = true;
  document.querySelectorAll(".tripTab").forEach(
    (b) =>
      (b.onclick = () => {
        state.trip = b.dataset.trip;
        const round = state.trip === "round",
          searchForm = document.querySelector("#searchForm");
        syncReturnDate();
        document
          .querySelector("#returnWrap")
          .classList.toggle("hidden", !round);
        document.querySelector("#returnDate").disabled = !round;
        searchForm.className = round
          ? "grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(145px,1fr)_auto_minmax(145px,1fr)_minmax(135px,.8fr)_minmax(135px,.8fr)_minmax(95px,.55fr)_auto] xl:items-end"
          : "grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(170px,1fr)_auto_minmax(170px,1fr)_minmax(150px,.8fr)_minmax(110px,.55fr)_auto] xl:items-end";
        document
          .querySelectorAll(".tripTab")
          .forEach(
            (x) =>
              (x.className =
                "tripTab cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition " +
                (x === b
                  ? "bg-ocean text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-100")),
          );
      }),
  );
  document.querySelector("#swapBtn").onclick = () => {
    const a = document.querySelector("#from"),
      b = document.querySelector("#to");
    [a.value, b.value] = [b.value, a.value];
  };
  document.querySelector("#searchForm").onsubmit = (e) => {
    e.preventDefault();
    doSearch();
  };
  document.querySelector("#bookingBtn").onclick = showBookings;
  document.querySelector("#mobileBookingBtn").onclick = showBookings;
  document.querySelector("#lookupBtn").onclick = showLookup;
  document.querySelector("#mobileLookupBtn").onclick = showLookup;
  document.querySelector("#authBtn").onclick = showAuth;
  document.querySelector("#mobileAuthBtn").onclick = showAuth;
  document.querySelector("#promoLookup").onclick = showLookup;
  updateAuthButtons();
  if (new URLSearchParams(location.search).get("login") === "1") {
    history.replaceState({}, "", location.pathname);
    setTimeout(showAuth, 850);
  }
}

function doSearch() {
  const from = document.querySelector("#from").value,
    to = document.querySelector("#to").value;
  if (from === to) return toast("Điểm đi và điểm đến phải khác nhau", "error");
  if (
    state.trip === "round" &&
    document.querySelector("#returnDate").value <=
      document.querySelector("#depart").value
  )
    return toast("Ngày về phải sau ngày khởi hành.", "error");
  state.passengers = +document.querySelector("#passengers").value;
  state.results = flights.map((f) => ({ ...f, from, to }));
  document.querySelector("#routeTitle").textContent =
    `${city(from)} → ${city(to)}`;
  document.querySelector("#routeMeta").textContent =
    `${formatDate(document.querySelector("#depart").value)}${state.trip === "round" ? ` → ${formatDate(document.querySelector("#returnDate").value)}` : ""} · ${state.passengers} hành khách · Bay thẳng`;
  document.querySelector("#results").classList.remove("hidden");
  renderFilters();
  renderFlights();
  document.querySelector("#results").scrollIntoView({ behavior: "smooth" });
  document.querySelector("#sortSelect").onchange = renderFlights;
}
function formatDate(v) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(v + "T00:00:00"));
}
function renderFilters() {
  document.querySelector("#filters").innerHTML =
    `<h3 class="font-bold">Bộ lọc</h3><div class="mt-5 border-t pt-5"><p class="text-sm font-semibold">Hãng bay</p>${Object.entries(
      carriers,
    )
      .map(
        ([k, c]) =>
          `<label class="mt-3 flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" class="carrierFilter h-4 w-4 accent-ocean" value="${k}" checked>${c.name}</label>`,
      )
      .join(
        "",
      )}</div><div class="mt-6 border-t pt-5"><p class="text-sm font-semibold">Khởi hành</p><label class="mt-3 flex items-center gap-3 text-sm"><input id="morning" type="checkbox" class="h-4 w-4 accent-ocean">Trước 12:00</label></div>`;
  document
    .querySelectorAll("#filters input")
    .forEach((i) => (i.onchange = renderFlights));
}
function renderFlights() {
  const enabled = [...document.querySelectorAll(".carrierFilter:checked")].map(
      (x) => x.value,
    ),
    morning = document.querySelector("#morning")?.checked;
  let list = state.results.filter(
    (f) =>
      enabled.includes(f.carrier) && (!morning || +f.depart.slice(0, 2) < 12),
  );
  list.sort(
    document.querySelector("#sortSelect")?.value === "time"
      ? (a, b) => a.depart.localeCompare(b.depart)
      : (a, b) => a.price - b.price,
  );
  document.querySelector("#flightList").innerHTML = list.length
    ? list.map((f, i) => flightCard(f, i)).join("")
    : `<div class="rounded-2xl bg-white p-12 text-center"><p class="text-lg font-bold">Không tìm thấy chuyến bay</p><p class="mt-2 text-sm text-slate-500">Hãy thay đổi bộ lọc để xem thêm lựa chọn.</p></div>`;
  document
    .querySelectorAll("[data-book]")
    .forEach(
      (b) =>
        (b.onclick = () =>
          openBooking(state.results.find((f) => f.id === b.dataset.book))),
    );
}
function flightCard(f, i) {
  const c = carriers[f.carrier] || {
    name: f.carrier,
    color: "#075f58",
    mark: f.carrier,
  };
  return `<article class="animate-fade-up rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl" style="animation-delay:${i * 50}ms"><div class="grid items-center gap-5 md:grid-cols-[180px_1fr_170px]"><div class="flex items-center gap-3"><span class="grid h-11 w-11 place-items-center rounded-xl text-sm font-extrabold text-white" style="background:${c.color}">${c.mark}</span><div><p class="text-sm font-bold">${c.name}</p><p class="text-xs text-slate-500">${f.id} · Economy</p></div></div><div class="grid grid-cols-[1fr_1.2fr_1fr] items-center text-center"><div><strong class="text-xl">${f.depart}</strong><p class="text-xs text-slate-500">${f.from}</p></div><div class="relative"><p class="text-xs text-slate-500">${f.duration}</p><div class="relative my-3 border-t-2 border-dashed border-slate-300"><span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-ocean">✈</span></div><p class="text-[11px] text-emerald-600">Bay thẳng</p></div><div><strong class="text-xl">${f.arrive}</strong><p class="text-xs text-slate-500">${f.to}</p></div></div><div class="text-right"><div class="flex items-center justify-end gap-2">${f.tag ? `<span class="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">${f.tag}</span>` : ""}<strong class="text-lg text-ocean">${money(f.price)}</strong></div><p class="mb-3 text-xs text-slate-400">/ hành khách</p><button data-book="${f.id}" class="rounded-xl bg-ocean px-5 py-2.5 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-ink">Chọn chuyến</button></div></div><div class="mt-4 flex flex-wrap gap-4 border-t pt-4 text-xs text-slate-500"><span>🧳 Hành lý xách tay 7kg</span><span>💺 Chọn chỗ có phí</span><span>↻ Đổi vé có điều kiện</span></div></article>`;
}

function openBooking(f) {
  state.selected = f;
  state.step = 1;
  renderBookingModal();
}
function renderBookingModal() {
  const f = state.selected,
    total = f ? f.price * state.passengers : 0;
  document.body.classList.add("overflow-hidden");
  document.querySelector("#modalRoot").innerHTML =
    `<div class="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm md:items-center md:p-5" role="dialog" aria-modal="true"><div class="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white md:rounded-3xl"><div class="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-5"><div><p class="text-xs font-semibold text-ocean">BƯỚC ${state.step}/3</p><h2 class="text-xl font-bold">${["Thông tin chuyến bay", "Thông tin hành khách", "Xác nhận đặt chỗ"][state.step - 1]}</h2></div><button id="closeModal" class="rounded-full p-2 hover:bg-slate-100" aria-label="Đóng">${icon("M6 18L18 6M6 6l12 12")}</button></div><div class="p-6">${state.step === 1 ? summaryStep(f, total) : state.step === 2 ? passengerStep() : confirmStep(f, total)}</div></div></div>`;
  document.querySelector("#closeModal").onclick = closeModal;
  document.querySelector("#backStep")?.addEventListener("click", () => {
    state.step--;
    renderBookingModal();
  });
  document.querySelector("#nextStep")?.addEventListener("click", () => {
    state.step++;
    renderBookingModal();
  });
  document.querySelector("#passengerForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const passenger = Object.fromEntries(new FormData(e.target)),
      error = document.querySelector("#passengerError");
    const message = !/^[\p{L}\s.'-]{2,}$/u.test(passenger.name.trim())
      ? "Họ tên phải có ít nhất 2 ký tự và không chứa số."
      : !/^0\d{9}$/.test(passenger.phone)
        ? "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0."
        : new Date(passenger.birthDate) >= new Date()
          ? "Ngày sinh phải nhỏ hơn ngày hiện tại."
          : !passenger.gender
            ? "Vui lòng chọn giới tính."
            : "";
    if (message) {
      error.textContent = message;
      error.classList.remove("hidden");
      return;
    }
    state.passenger = passenger;
    state.step = 3;
    renderBookingModal();
  });
  document
    .querySelector("#confirmBook")
    ?.addEventListener("click", saveBooking);
}
function summaryStep(f, total) {
  const c = carriers[f.carrier];
  return `<div class="rounded-2xl bg-mist p-5"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><span class="grid h-11 w-11 place-items-center rounded-xl text-sm font-bold text-white" style="background:${c.color}">${c.mark}</span><div><b>${c.name}</b><p class="text-xs text-slate-500">${f.id}</p></div></div><span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Bay thẳng</span></div><div class="mt-7 grid grid-cols-[1fr_auto_1fr] items-center text-center"><div><b class="text-2xl">${f.depart}</b><p class="text-sm text-slate-500">${city(f.from)} (${f.from})</p></div><span class="px-5 text-2xl text-ocean">✈</span><div><b class="text-2xl">${f.arrive}</b><p class="text-sm text-slate-500">${city(f.to)} (${f.to})</p></div></div></div>${priceBox(total)}<button id="nextStep" class="mt-6 w-full rounded-xl bg-ocean py-3.5 font-bold text-white">Tiếp tục</button>`;
}
function passengerStep() {
  const p = state.passenger || {};
  return `<form id="passengerForm" class="space-y-4"><div class="grid gap-4 md:grid-cols-2">${formInput("name", "Họ và tên", p.name || "", "Nguyễn Văn An")}${formInput("phone", "Số điện thoại", p.phone || "", "0901234567", "tel")}${formInput("email", "Email", p.email || "", "an@example.com", "email")}${formInput("idNumber", "CCCD/Hộ chiếu", p.idNumber || "", "012345678901")}${formInput("birthDate", "Ngày sinh", p.birthDate || "", "", "date")}<label><span class="mb-2 block text-sm font-semibold">Giới tính</span><select name="gender" required class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-ocean focus:ring-4 focus:ring-ocean/10"><option value="">Chọn giới tính</option><option ${p.gender === "Nam" ? "selected" : ""}>Nam</option><option ${p.gender === "Nữ" ? "selected" : ""}>Nữ</option><option ${p.gender === "Khác" ? "selected" : ""}>Khác</option></select></label></div><p id="passengerError" class="hidden rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700"></p><label class="flex gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900"><input required type="checkbox" class="mt-1 accent-ocean">Tôi xác nhận thông tin trên là chính xác và đồng ý với điều khoản đặt chỗ demo.</label><div class="flex gap-3"><button type="button" id="backStep" class="flex-1 rounded-xl border border-slate-200 py-3.5 font-bold">Quay lại</button><button class="flex-[2] rounded-xl bg-ocean py-3.5 font-bold text-white">Kiểm tra thông tin</button></div></form>`;
}
function formInput(name, label, value, placeholder, type = "text") {
  return `<label><span class="mb-2 block text-sm font-semibold">${label}</span><input name="${name}" type="${type}" value="${value}" placeholder="${placeholder}" required class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-ocean focus:ring-4 focus:ring-ocean/10"></label>`;
}
function confirmStep(f, total) {
  return `<div class="rounded-2xl border border-slate-200 p-5"><div class="flex justify-between"><div><p class="text-xs text-slate-500">Hành khách</p><b>${state.passenger.name}</b><p class="mt-1 text-sm text-slate-500">${state.passenger.email} · ${state.passenger.phone}</p></div><span class="text-2xl">🎫</span></div><div class="my-5 border-t border-dashed"></div><div class="flex justify-between text-sm"><span>${city(f.from)} → ${city(f.to)}</span><b>${f.depart} · ${f.id}</b></div></div>${priceBox(total)}<p class="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">Đây là website mô phỏng. Nút xác nhận không thực hiện thanh toán và không phát hành vé thật.</p><div class="mt-6 flex gap-3"><button id="backStep" class="flex-1 rounded-xl border border-slate-200 py-3.5 font-bold">Quay lại</button><button id="confirmBook" class="flex-[2] rounded-xl bg-sun py-3.5 font-bold text-ocean">Xác nhận đặt chỗ</button></div>`;
}
function priceBox(total) {
  return `<div class="mt-5 space-y-3 text-sm"><div class="flex justify-between"><span>Vé máy bay × ${state.passengers}</span><span>${money(total)}</span></div><div class="flex justify-between"><span>Thuế và phí</span><span>Đã bao gồm</span></div><div class="flex justify-between border-t pt-3 text-lg font-bold"><span>Tổng cộng</span><span class="text-ocean">${money(total)}</span></div></div>`;
}
async function saveBooking() {
  const session = JSON.parse(localStorage.getItem("tripgoSession") || "null"),
    booking = {
      code: "TG" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      flight: state.selected,
      passenger: state.passenger,
      count: state.passengers,
      trip: state.trip,
      status: "Đã xác nhận",
      userId: session?.id || null,
      createdAt: new Date().toISOString(),
    };
  try {
    await api("/bookings", { method: "POST", body: JSON.stringify(booking) });
  } catch {
    return toast(
      "Không thể lưu vé. Vui lòng tải lại trang và thử lại.",
      "error",
    );
  }
  document.querySelector("#modalRoot").innerHTML =
    `<div class="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-5 backdrop-blur-sm"><div class="w-full max-w-md rounded-3xl bg-white p-8 text-center"><div class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">✓</div><h2 class="mt-5 text-2xl font-bold">Đặt chỗ thành công!</h2><p class="mt-2 text-slate-500">Mã đặt chỗ của bạn</p><p class="mt-3 rounded-xl bg-mist py-4 text-2xl font-extrabold tracking-widest text-ocean">${booking.code}</p><button id="doneBtn" class="mt-6 w-full cursor-pointer rounded-xl bg-ocean py-3.5 font-bold text-white">Hoàn tất</button></div></div>`;
  document.querySelector("#doneBtn").onclick = () => {
    closeModal();
    toast("Đã lưu đặt chỗ thành công");
  };
}
async function showBookings() {
  let bookings = [];
  try {
    bookings = await api("/bookings");
  } catch {}
  document.body.classList.add("overflow-hidden");
  document.querySelector("#modalRoot").innerHTML =
    `<div class="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm md:items-center md:p-5"><div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 md:rounded-3xl"><div class="flex items-center justify-between"><div><p class="text-xs font-semibold text-ocean">CHUYẾN ĐI CỦA BẠN</p><h2 class="text-2xl font-bold">Đặt chỗ của tôi</h2></div><button id="closeModal" class="cursor-pointer rounded-full p-2 hover:bg-slate-100">${icon("M6 18L18 6M6 6l12 12")}</button></div><div class="mt-6 space-y-4">${
      bookings.length
        ? bookings
            .map((b) => {
              const cancelled = b.status === "Đã hủy";
              return `<div class="rounded-2xl border p-5"><div class="flex items-start justify-between"><div><span class="text-xs text-slate-500">Mã đặt chỗ</span><p class="font-extrabold tracking-wider text-ocean">${b.code}</p></div><span class="rounded-full px-3 py-1 text-xs font-semibold ${cancelled ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}">${b.status || "Đã xác nhận"}</span></div><div class="mt-4 flex items-center justify-between gap-4"><div><b>${city(b.flight.from)} → ${city(b.flight.to)}</b><p class="text-sm text-slate-500">${b.flight.id} · ${b.flight.depart} · ${b.passenger.name}</p></div><div class="text-right"><b>${money(b.flight.price * b.count)}</b>${cancelled ? "" : `<button data-cancel-booking="${b.id}" class="mt-2 block cursor-pointer text-xs font-bold text-red-600 hover:underline">Hủy vé</button>`}</div></div></div>`;
            })
            .join("")
        : `<div class="py-12 text-center"><div class="text-4xl">🎫</div><p class="mt-3 font-bold">Chưa có đặt chỗ nào</p><p class="mt-2 text-sm text-slate-500">Các chuyến bay đã đặt sẽ xuất hiện tại đây.</p></div>`
    }</div></div></div>`;
  document.querySelector("#closeModal").onclick = closeModal;
  document.querySelectorAll("[data-cancel-booking]").forEach(
    (btn) =>
      (btn.onclick = async () => {
        const booking = bookings.find(
          (b) => String(b.id) === btn.dataset.cancelBooking,
        );
        if (!booking || !confirm(`Hủy vé ${booking.code}?`)) return;
        try {
          await api(`/bookings/${booking.id}`, {
            method: "PUT",
            body: JSON.stringify({ ...booking, status: "Đã hủy" }),
          });
          toast("Đã cập nhật trạng thái vé thành Đã hủy");
          showBookings();
        } catch {
          toast("Không thể hủy vé. Vui lòng thử lại.", "error");
        }
      }),
  );
}
function showLookup() {
  document.body.classList.add("overflow-hidden");
  document.querySelector("#modalRoot").innerHTML =
    `<div class="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-5 backdrop-blur-sm"><div class="w-full max-w-lg rounded-3xl bg-white p-6"><div class="flex items-center justify-between"><div><p class="text-xs font-semibold text-ocean">TRA CỨU NHANH</p><h2 class="text-2xl font-bold">Thông tin hành trình</h2></div><button id="closeModal" class="rounded-full p-2 hover:bg-slate-100">${icon("M6 18L18 6M6 6l12 12")}</button></div><div class="mt-6 flex gap-2"><button data-mode="booking" class="lookupTab flex-1 rounded-xl bg-ocean px-3 py-2.5 text-sm font-bold text-white">Mã đặt chỗ</button><button data-mode="flight" class="lookupTab flex-1 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-500">Số hiệu chuyến bay</button></div><form id="lookupForm" class="mt-5"><label class="mb-2 block text-sm font-bold text-slate-600" id="lookupLabel">Nhập mã đặt chỗ</label><input id="lookupValue" class="w-full rounded-2xl border border-slate-200 px-4 py-3 uppercase outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100" placeholder="Ví dụ: TGABC123" required><button class="mt-4 w-full rounded-2xl bg-ocean px-5 py-3 font-extrabold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#064b46]">Tra cứu</button></form><div id="lookupResult" class="mt-5"></div></div></div>`;
  let mode = "booking";
  document.querySelector("#closeModal").onclick = closeModal;
  document.querySelectorAll(".lookupTab").forEach(
    (btn) =>
      (btn.onclick = () => {
        mode = btn.dataset.mode;
        document
          .querySelectorAll(".lookupTab")
          .forEach(
            (x) =>
              (x.className =
                "lookupTab flex-1 rounded-xl px-3 py-2.5 text-sm font-bold " +
                (x === btn ? "bg-ocean text-white" : "text-slate-500")),
          );
        document.querySelector("#lookupLabel").textContent =
          mode === "booking" ? "Nhập mã đặt chỗ" : "Nhập số hiệu chuyến bay";
        document.querySelector("#lookupValue").placeholder =
          mode === "booking" ? "Ví dụ: TGABC123" : "Ví dụ: VN213";
        document.querySelector("#lookupResult").innerHTML = "";
      }),
  );
  document.querySelector("#lookupForm").onsubmit = async (e) => {
    e.preventDefault();
    const q = document.querySelector("#lookupValue").value.trim().toUpperCase();
    let item;
    if (mode === "booking") {
      try {
        item = (await api(`/bookings?code=${encodeURIComponent(q)}`))[0];
      } catch {}
    } else item = flights.find((f) => f.id === q);
    document.querySelector("#lookupResult").innerHTML = item
      ? lookupCard(item, mode)
      : `<p class="rounded-xl bg-red-50 p-4 text-sm text-red-700">Không tìm thấy thông tin phù hợp. Hãy kiểm tra lại mã.</p>`;
  };
}
function lookupCard(item, mode) {
  const f = mode === "booking" ? item.flight : item;
  return `<div class="rounded-2xl bg-mist p-5"><div class="flex items-center justify-between"><div><p class="text-xs text-slate-500">${mode === "booking" ? "Mã đặt chỗ" : "Chuyến bay"}</p><b class="text-lg text-ocean">${mode === "booking" ? item.code : f.id}</b></div><span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Đúng giờ</span></div><div class="mt-5 flex items-center justify-between text-center"><div><b class="text-xl">${f.depart}</b><p class="text-sm">${city(f.from)}</p></div><span class="text-2xl text-ocean">✈</span><div><b class="text-xl">${f.arrive}</b><p class="text-sm">${city(f.to)}</p></div></div>${mode === "booking" ? `<p class="mt-4 border-t pt-4 text-sm text-slate-600">Hành khách: <b>${item.passenger.name}</b></p>` : ""}</div>`;
}

function showAuth() {
  const adminSession = JSON.parse(
    sessionStorage.getItem("tripgoAdmin") || "null",
  );
  if (adminSession?.role === "admin") {
    if (
      confirm(
        `Đang đăng nhập với tài khoản Admin (${adminSession.email}). Bạn muốn đăng xuất?`,
      )
    ) {
      sessionStorage.removeItem("tripgoAdmin");
      updateAuthButtons();
      toast("Đã đăng xuất Admin");
    }
    return;
  }
  const current = JSON.parse(localStorage.getItem("tripgoSession") || "null");
  if (current) {
    if (confirm(`Đang đăng nhập với ${current.email}. Bạn muốn đăng xuất?`)) {
      localStorage.removeItem("tripgoSession");
      updateAuthButtons();
      toast("Đã đăng xuất");
    }
    return;
  }
  document.body.classList.add("overflow-hidden");
  document.querySelector("#modalRoot").innerHTML =
    `<div id="authBackdrop" class="fixed inset-0 z-[90] grid place-items-center bg-ink/70 p-5 backdrop-blur-sm"><div class="w-full max-w-md animate-fade-up rounded-3xl bg-white p-6 shadow-2xl"><div class="flex items-center justify-between"><div><p class="text-xs font-semibold text-ocean">TÀI KHOẢN TRIPGO</p><h2 id="authTitle" class="text-2xl font-bold">Đăng nhập</h2></div><button id="closeModal" type="button" class="cursor-pointer rounded-full p-2 transition hover:rotate-90 hover:bg-slate-100" aria-label="Đóng">${icon("M6 18L18 6M6 6l12 12")}</button></div><form id="authForm" class="mt-6 space-y-4"><div id="nameWrap" class="hidden">${formInput("name", "Họ và tên", "", "Nguyễn Văn An")}</div>${formInput("email", "Email", "", "ban@example.com", "email")}${formInput("password", "Mật khẩu", "", "Tối thiểu 6 ký tự", "password")}<p id="authError" class="hidden rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700"></p><button type="submit" class="w-full cursor-pointer rounded-2xl bg-ocean px-5 py-3 font-extrabold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#064b46] focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60">Đăng nhập</button></form><button id="toggleAuth" type="button" class="mt-4 w-full cursor-pointer text-sm font-semibold text-ocean transition hover:text-teal-800 hover:underline">Chưa có tài khoản? Đăng ký</button><p class="mt-5 text-center text-xs text-slate-400">Admin và khách hàng đăng nhập tại cùng một nơi.</p></div></div>`;
  let register = false;
  const form = document.querySelector("#authForm"),
    submit = form.querySelector('button[type="submit"]'),
    error = document.querySelector("#authError");
  document.querySelector("#nameWrap input").required = false;
  document.querySelector("#closeModal").onclick = closeModal;
  document.querySelector("#authBackdrop").onclick = (e) => {
    if (e.target.id === "authBackdrop") closeModal();
  };
  document.querySelector("#toggleAuth").onclick = () => {
    register = !register;
    error.classList.add("hidden");
    document.querySelector("#authTitle").textContent = register
      ? "Đăng ký"
      : "Đăng nhập";
    document.querySelector("#nameWrap").classList.toggle("hidden", !register);
    document.querySelector("#nameWrap input").required = register;
    submit.textContent = register ? "Tạo tài khoản" : "Đăng nhập";
    document.querySelector("#toggleAuth").textContent = register
      ? "Đã có tài khoản? Đăng nhập"
      : "Chưa có tài khoản? Đăng ký";
  };
  form.onsubmit = async (e) => {
    e.preventDefault();
    error.classList.add("hidden");
    const v = Object.fromEntries(new FormData(form));
    v.email = v.email.trim().toLowerCase();
    if (v.password.length < 6)
      return showAuthError("Mật khẩu cần ít nhất 6 ký tự.");
    submit.disabled = true;
    submit.textContent = "Đang kiểm tra...";
    try {
      const users = await api("/users");
      if (register) {
        if (v.email === "admin@tripgo.vn")
          throw new Error(
            "Email admin@tripgo.vn là tài khoản quản trị riêng và không thể đăng ký.",
          );
        if (users.some((u) => String(u.email).toLowerCase() === v.email))
          throw new Error("Email này đã được đăng ký.");
        const user = {
          id: `customer-${Date.now()}`,
          name: v.name.trim(),
          email: v.email,
          password: v.password,
          role: "customer",
        };
        await api("/users", { method: "POST", body: JSON.stringify(user) });
        localStorage.setItem(
          "tripgoSession",
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: "customer",
          }),
        );
        closeModal();
        updateAuthButtons();
        toast("Đăng ký thành công");
        return;
      }
      const user = users.find(
        (u) =>
          String(u.email).toLowerCase() === v.email &&
          u.password === v.password,
      );
      if (!user) throw new Error("Email hoặc mật khẩu chưa đúng.");
      if (user.role === "admin") {
        const account = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: "admin",
        };
        sessionStorage.setItem("tripgoAdmin", JSON.stringify(account));
        localStorage.removeItem("tripgoSession");
        closeModal();
        updateAuthButtons();
        toast("Đăng nhập Admin thành công. Nút Admin Dashboard đã xuất hiện.");
        return;
      }
      localStorage.setItem(
        "tripgoSession",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: "customer",
        }),
      );
      sessionStorage.removeItem("tripgoAdmin");
      closeModal();
      updateAuthButtons();
      toast("Đăng nhập thành công");
    } catch (err) {
      showAuthError(
        err.message === "API 404" || err.message === "API 500"
          ? "Không tải được dữ liệu tài khoản. Vui lòng tải lại trang."
          : err.message || "Không thể đăng nhập. Vui lòng thử lại.",
      );
    } finally {
      submit.disabled = false;
      submit.textContent = register ? "Tạo tài khoản" : "Đăng nhập";
    }
  };
  function showAuthError(message) {
    error.textContent = message;
    error.classList.remove("hidden");
    submit.disabled = false;
    submit.textContent = register ? "Tạo tài khoản" : "Đăng nhập";
  }
}
function updateAuthButtons() {
  const adminSession = JSON.parse(
      sessionStorage.getItem("tripgoAdmin") || "null",
    ),
    user = JSON.parse(localStorage.getItem("tripgoSession") || "null"),
    isAdmin = adminSession?.role === "admin";
  ["adminNavBtn", "mobileAdminNavBtn"].forEach((id) =>
    document.querySelector("#" + id)?.classList.toggle("hidden", !isAdmin),
  );
  ["authBtn", "mobileAuthBtn"].forEach((id) => {
    const el = document.querySelector("#" + id);
    if (!el) return;
    el.textContent = isAdmin
      ? "Admin"
      : user
        ? (user.name || user.email).split(" ")[0]
        : "Đăng nhập";
    el.title = isAdmin || user ? "Nhấn để đăng xuất" : "Nhấn để đăng nhập";
    el.classList.toggle("border-sun", isAdmin);
    el.classList.toggle("text-sun", isAdmin);
  });
}
function closeModal() {
  document.querySelector("#modalRoot").innerHTML = "";
  document.body.classList.remove("overflow-hidden");
}
function toast(message, type = "success") {
  const el = document.querySelector("#toast");
  el.innerHTML = `<div class="animate-fade-up rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-2xl ${type === "error" ? "bg-red-600" : "bg-ink"}">${message}</div>`;
  setTimeout(() => (el.innerHTML = ""), 3000);
}

layout();

if (document.modelContext?.registerTool) {
  document.modelContext.registerTool({
    name: "search_flights",
    title: "Tìm chuyến bay",
    description: "Tìm các chuyến bay demo theo mã sân bay đi và đến.",
    inputSchema: {
      type: "object",
      properties: { from: { type: "string" }, to: { type: "string" } },
      required: ["from", "to"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute: ({ from, to }) =>
      flights
        .filter(
          (f) =>
            f.from === String(from).toUpperCase() &&
            f.to === String(to).toUpperCase(),
        )
        .map(({ id, depart, arrive, duration, price }) => ({
          id,
          depart,
          arrive,
          duration,
          price,
        })),
  });
  document.modelContext.registerTool({
    name: "lookup_booking",
    title: "Tra cứu đặt chỗ",
    description:
      "Tra cứu đặt chỗ demo đã lưu trên trình duyệt bằng mã đặt chỗ.",
    inputSchema: {
      type: "object",
      properties: { code: { type: "string" } },
      required: ["code"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute: async ({ code }) =>
      (
        await api(
          `/bookings?code=${encodeURIComponent(String(code).toUpperCase())}`,
        )
      )[0] || { found: false },
  });
}
