<template>
  <footer class="mt-20 border-t border-slate-200 bg-slate-50">
    <div class="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
      <div>
        <router-link to="/" class="text-base font-bold text-slate-900 md:text-lg flex ">
        <img src="/pkkmb-icon.png" alt="Logo PKKMB IF FT UNG" class="mr-2 inline h-12 w-12" />
        <div class="flex flex-col leading-tight">
          <h3 class="font-extrabold text-xl text-primary">PKKMB FTUNG 2026</h3>
          <p class="text-sm">Universitas Negeri Gorontalo</p>
        </div>
      </router-link>
        <p class="mt-3 text-sm text-slate-600">
          Website resmi Pengenalan Kehidupan Kampus bagi Mahasiswa Baru Teknik Informatika.
        </p>
      </div>
      <div>
        <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Navigasi</h4>
        <ul class="mt-3 space-y-2 text-sm text-slate-700">
          <li><router-link to="/">Beranda</router-link></li>
          <li><router-link to="/agenda">Agenda</router-link></li>
          <li><router-link to="/tentang">Tentang</router-link></li>
          <li><router-link to="/kontak">Kontak</router-link></li>
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-500">Kontak</h4>
        <ul class="mt-3 space-y-2 text-sm text-slate-700">
          <li>Email: pkkmb.informatika@ung.ac.id</li>
          <li>Instagram: @informatika_ung</li>
          <li>TikTok: @pkkmb_if_ung</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
      Copyright {{ new Date().getFullYear() }} PKKMB Teknik Informatika FT UNG.
    </div>
  </footer>
</template>
