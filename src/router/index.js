import Vue from "vue";
import VueRouter from "vue-router";
// Import komponen katalog utama
import ProductCatalog from "../components/ProductCatalog.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    // Menggunakan komponen ProductCatalog sebagai halaman utama
    component: ProductCatalog,
    // Kita akan menggunakan logika kategori di dalam komponen itu sendiri
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
