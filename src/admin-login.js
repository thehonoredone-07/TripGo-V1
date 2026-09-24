import "./style.css";
import { api } from "./data-store.js";

if (sessionStorage.getItem("tripgoAdmin")) location.replace("/admin.html");
const app = document.querySelector("#adminLogin");
app.innerHTML = `<main class="relative grid min-h-screen place-items-center overflow-hidden bg-[#043e3a] px-4 py-10 text-[#173b3a]"><div class="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl"></div><div class="absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-amber-300/15 blur-3xl"></div><a href="/" class="absolute left-5 top-5 flex items-center gap-2 font-bold text-white/80 transition hover:text-white">← Trang chủ</a><section class="relative w-full max-w-md animate-fade-up rounded-[2rem] border border-white/20 bg-white p-7 shadow-2xl sm:p-9"><div class="flex items-center gap-3"><span class="grid h-12 w-12 place-items-center rounded-2xl bg-[#f4bf48] text-2xl text-[#075f58] shadow-lg shadow-amber-200">✈</span><div><h1 class="text-2xl font-black text-[#075f58]">TripGO Admin</h1><p class="text-sm text-slate-500">Trung tâm điều hành chuyến bay</p></div></div><form id="loginForm" class="mt-8 space-y-5"><label class="block"><span class="mb-2 block text-sm font-bold text-slate-600">Email quản trị</span><input name="email" type="email" value="admin@tripgo.vn" required class="w-full rounded-2xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"></label><label class="block"><span class="mb-2 block text-sm font-bold text-slate-600">Mật khẩu</span><div class="relative"><input id="password" name="password" type="password" value="Admin@123" required class="w-full rounded-2xl border border-slate-200 px-4 py-3.5 pr-14 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"><button id="togglePassword" type="button" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm font-bold text-teal-700">Hiện</button></div></label><p id="error" class="hidden rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700"></p><button class="w-full rounded-2xl bg-[#075f58] py-3.5 font-extrabold text-white shadow-lg shadow-teal-900/20 transition duration-300 hover:-translate-y-1 hover:bg-[#064b46] hover:shadow-xl disabled:opacity-60">Đăng nhập hệ thống</button></form><div class="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500"><b class="text-slate-700">Tài khoản demo</b><br>Email: admin@tripgo.vn<br>Mật khẩu: Admin@123</div></section></main>`;
document.querySelector("#togglePassword").onclick = () => {
  const p = document.querySelector("#password");
  p.type = p.type === "password" ? "text" : "password";
  document.querySelector("#togglePassword").textContent =
    p.type === "password" ? "Hiện" : "Ẩn";
};
document.querySelector("#loginForm").onsubmit = async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const error = document.querySelector("#error");
  btn.disabled = true;
  btn.textContent = "Đang xác thực...";
  try {
    const v = Object.fromEntries(new FormData(e.target));
    const users = await api(
      `/users?email=${encodeURIComponent(v.email.toLowerCase())}&password=${encodeURIComponent(v.password)}&role=admin`,
    );
    if (!users.length) throw new Error();
    sessionStorage.setItem(
      "tripgoAdmin",
      JSON.stringify({
        id: users[0].id,
        name: users[0].name,
        email: users[0].email,
        role: "admin",
      }),
    );
    location.replace("/admin.html");
  } catch {
    error.textContent = "Email hoặc mật khẩu quản trị không chính xác.";
    error.classList.remove("hidden");
    btn.disabled = false;
    btn.textContent = "Đăng nhập hệ thống";
  }
};
