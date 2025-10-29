<script>
export default {
  name: "ProductCatalog",
  data() {
    return {
      currentProductId: 1,
      product: null,
      isLoading: false,
      // State untuk melacak kategori saat ini (men, women, unavailable)
      categoryType: "unavailable",
    };
  },

  // Method ini akan dijalankan saat komponen pertama kali dimuat
  mounted() {
    this.fetchNextProduct();
  },

  methods: {
    // Logika Fetch API dan Navigasi
    async fetchNextProduct() {
      // Logika Increment ID & Reset
      // Periksa apakah ini BUKAN pemanggilan pertama (mounted)
      if (this.product !== null) {
        this.currentProductId++;
      }

      // Atur Index (looping 1-20)
      if (this.currentProductId > 20) {
        this.currentProductId = 1;
      }

      this.isLoading = true;
      this.product = null; // Reset product sebelum fetch
      this.categoryType = "unavailable"; // Reset kategori

      const url = `https://fakestoreapi.com/products/${this.currentProductId}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Cek Kondisi Kategori (Case Insensitive)
        const category = data.category.toLowerCase();

        if (category === "men's clothing") {
          this.product = data;
          this.categoryType = "men";
        } else if (category === "women's clothing") {
          this.product = data;
          this.categoryType = "women";
        } else {
          // Kategori TIDAK DITERIMA
          this.product = data; // Simpan produk agar bisa ditampilkan kategorinya
          this.categoryType = "unavailable";
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        this.categoryType = "unavailable";
      } finally {
        this.isLoading = false;
      }
    },
  },

  // Computed untuk membantu class binding di template
  computed: {
    // Menggunakan Class Binding untuk menentukan desain
    mainContainerClass() {
      // Mengembalikan class sesuai dengan categoryType
      return {
        "page-men": this.categoryType === "men",
        "page-women": this.categoryType === "women",
        "page-unavailable": this.categoryType === "unavailable",
      };
    },
    // Memformat rating sebagai bintang untuk desain Men/Women Section
    formatRating() {
      if (!this.product || !this.product.rating) return "";
      const roundedRate = Math.round(this.product.rating.rate);
      return "★".repeat(roundedRate) + "☆".repeat(5 - roundedRate);
    },
  },
};
</script>

<template>
  <div :class="['product-wrapper', mainContainerClass]">
    <div class="product-card">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Memuat produk...</p>
      </div>

      <div v-else class="content-display">
        <div v-if="categoryType === 'unavailable'" class="unavailable-state">
          <div class="sad-face">
            <div class="eyebrow eyebrow-left"></div>
            <div class="eyebrow eyebrow-right"></div>
            <div class="eye eye-left"></div>
            <div class="eye eye-right"></div>
            <div class="mouth"></div>
          </div>

          <div class="overlay-content">
            <p class="unavailable-message">
              This product is unavailable to show
            </p>
            <button
              class="next-btn-unavailable"
              @click="fetchNextProduct"
              :disabled="isLoading"
            >
              Next product
            </button>
          </div>
        </div>
        <div v-else :class="['product-details', categoryType]">
          <div class="product-image-container">
            <img
              :src="product.image"
              :alt="product.title"
              class="product-image"
            />
          </div>

          <div class="product-info">
            <template v-if="categoryType === 'women'">
              <h2 class="women-title">{{ product.title }}</h2>
              <div class="women-header-meta">
                <p class="category-text">{{ product.category }}</p>
                <div class="rating-group">
                  <span class="rating-text-women"
                    >{{ product.rating.rate }} / 5</span
                  >
                  <span class="stars-women">{{ formatRating }}</span>
                </div>
              </div>
              <hr class="divider" />
              <p class="product-description">
                {{ product.description }}
              </p>
              <hr class="divider" />

              <p class="product-price-women">${{ product.price.toFixed(2) }}</p>
              <div class="action-buttons-women">
                <button class="buy-now-btn-women">Buy now</button>
                <button class="next-btn-women" @click="fetchNextProduct">
                  Next product
                </button>
              </div>
            </template>
            <template v-else-if="categoryType === 'men'">
              <h2 class="men-title">{{ product.title }}</h2>
              <div class="men-header-meta">
                <p class="category-text">{{ product.category }}</p>
                <div class="rating-group">
                  <span class="rating-text-men">
                    {{ product.rating.rate }} / 5
                  </span>
                  <span class="stars-men"> {{ formatRating }}</span>
                </div>
              </div>
              <hr class="divider" />
              <p class="product-description">
                {{ product.description }}
              </p>
              <hr class="divider" />
              <p class="product-price-men">${{ product.price.toFixed(2) }}</p>
              <div class="action-buttons-men">
                <button class="buy-now-btn-men">Buy now</button>
                <button class="next-btn-men" @click="fetchNextProduct">
                  Next product
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
