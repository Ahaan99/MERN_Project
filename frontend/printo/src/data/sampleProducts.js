export const sampleProducts = [
  // T-Shirts
  {
    _id: "1",
    name: "Classic Cotton T-Shirt",
    description: "Premium cotton blend t-shirt perfect for everyday wear",
    price: 29.99,
    category: "t-shirts",
    gender: "men",
    images: [
      {
        url: "https://res.cloudinary.com/djjm5xvhs/image/upload/v1746846786/Green_Mens_s7ihgs.jpg",
        public_id: "classic-tshirt_white"
      }
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#000000" }
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    isNew: true
  },

  // Hoodies
  {
    _id: "2",
    name: "Essential Pullover Hoodie",
    description: "Comfortable cotton-blend hoodie for casual wear",
    price: 49.99,
    category: "hoodies",
    gender: "unisex",
    images: [
      {
        url: "https://res.cloudinary.com/djjm5xvhs/image/upload/v1746846182/Essential_cn0uc1.jpg",
        public_id: "hoodie_gray"
      }
    ],
    colors: [
      { name: "Gray", hex: "#808080" },
      { name: "Black", hex: "#000000" }
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },

  // Tops
  {
    _id: "3",
    name: "Floral Summer Top",
    description: "Lightweight and stylish summer top",
    price: 34.99,
    category: "tops",
    gender: "women",
    images: [
      {
        url: "https://res.cloudinary.com/djjm5xvhs/image/upload/v1746846851/Floral_b1ijtz.webp",
        public_id: "womens_premium_top"
      }
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Pink", hex: "#FFC0CB" }
    ],
    sizes: ["XS", "S", "M", "L"],
    inStock: true
  },

  // Shirts
  {
    _id: "4",
    name: "Oxford Button-Down Shirt",
    description: "Classic oxford shirt for a polished look",
    price: 44.99,
    category: "shirts",
    gender: "men",
    images: [
      {
        url: "https://res.cloudinary.com/djjm5xvhs/image/upload/v1746847200/product-placeholder_e0hw4u.jpg",
        public_id: "mens_oxford_shirt"
      }
    ],
    colors: [
      { name: "Blue", hex: "#0000FF" },
      { name: "White", hex: "#ffffff" }
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },

  // Tank Tops
  {
    _id: "5",
    name: "Athletic Tank Top",
    description: "Breathable tank top for workouts",
    price: 24.99,
    category: "tank-tops",
    gender: "unisex",
    images: [
      {
        url: "https://res.cloudinary.com/djjm5xvhs/image/upload/v1746847310/Athletic_qag1jq.jpg",
        public_id: "athletic_tank_top"
      }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#808080" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true
  },

  // Jackets
  {
    _id: "6",
    name: "Lightweight Bomber Jacket",
    description: "Stylish bomber jacket for all seasons",
    price: 79.99,
    category: "jackets",
    gender: "men",
    images: [
      {
        url: "https://res.cloudinary.com/djjm5xvhs/image/upload/v1746847549/Lightweight_agm9q6.webp",
        public_id: "lightweight_bomber_jacket"
      }
    ],
    colors: [
      { name: "Navy", hex: "#000080" },
      { name: "Black", hex: "#000000" }
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },

  // Women's Premium Crew Neck
  {
    _id: "7",
    name: "Women's Premium Crew Neck",
    description: "High-quality fitted crew neck perfect for custom designs and prints. Made from 100% premium cotton.",
    price: 32.99,
    category: "t-shirts",
    gender: "women",
    images: [
      {
        url: "https://res.cloudinary.com/djjm5xvhs/image/upload/v1746846057/Summer_Outfit_wummqb.jpg",
        public_id: "womens-premium-crew_white"
      }
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#000000" },
      { name: "Pink", hex: "#FFC0CB" },
      { name: "Light Blue", hex: "#ADD8E6" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    isNew: true,
    popularity: 4.8
  },

  // Additional Men's Products
  {
    _id: "m3",
    name: "Girls Fashion T-Shirt Dress",
    description: "Stylish and comfortable t-shirt dress perfect for custom designs and prints. Made from soft cotton blend.",
    price: 34.99,
    category: "dresses",
    gender: "women",
    images: [
      {
        url: "https://res.cloudinary.com/djjm5xvhs/image/upload/v1746846057/fashion_dress.jpg",
        public_id: "summer_fashion_dress"
      }
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Pink", hex: "#FFC0CB" },
      { name: "Light Blue", hex: "#ADD8E6" },
      { name: "Lavender", hex: "#E6E6FA" }
    ],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    isNew: true,
    popularity: 4.9
  },
  {
    _id: "m4",
    name: "Performance Athletic Tank",
    description: "Moisture-wicking tank top for sports and training",
    price: 27.99,
    category: "tank-tops",
    gender: "men",
    images: [
      {
        url: "https://res.cloudinary.com/djjm5xvhs/image/upload/v1746847451/Premium_jhxzzz.png",
        public_id: "athletic_tank_top"
      }
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#808080" }
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    popularity: 4.5
  },

  // Additional Women's Products
  {
    _id: "w3",
    name: "Custom Team Uniform",
    description: "Professional sports uniform for women's teams",
    price: 39.99,
    category: "active-wear",
    gender: "women",
    images: [{ url: "https://res.cloudinary.com/djjm5xvhs/image/upload/v1746842626/womens-uniform-placeholder.jpg" }],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Purple", hex: "#800080" }
    ],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    isNew: true,
    popularity: 4.8
  },
  {
    _id: "w4",
    name: "Premium Polo Shirt",
    description: "High-quality polo shirt for custom embroidery",
    price: 32.99,
    category: "polo",
    gender: "women",
    images: [{ url: "https://res.cloudinary.com/djjm5xvhs/image/upload/v1746842626/womens-polo-placeholder.jpg" }],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Pink", hex: "#FFC0CB" },
      { name: "Light Blue", hex: "#ADD8E6" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    popularity: 4.6
  },

  // women's product
  {
    _id: "k3",
    name: "Women's Crop Top",
    description: "Trendy and stylish crop top perfect for custom designs and prints. Made from premium cotton blend fabric.",
    price: 29.99,
    category: "tops",
    gender: "women",
    images: [
      {
        url: "https://res.cloudinary.com/djjm5xvhs/image/upload/v1746847002/Women_s_c_u6hqgy.avif",
        public_id: "womens_crop_top"
      }
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#000000" },
      { name: "Rose Pink", hex: "#FF69B4" },
      { name: "Sage Green", hex: "#98FB98" }
    ],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    isNew: true,
    popularity: 4.7
  },

  // Sweaters
  {
    _id: "8",
    name: "Classic Knit Sweater",
    description: "Comfortable and stylish knit sweater",
    price: 54.99,
    category: "sweaters",
    gender: "unisex",
    images: [
      {
        url: "https://res.cloudinary.com/djjm5xvhs/image/upload/v1746847639/sweater_ajqhl1.avif",
        public_id: "classic_knit_sweater"
      }
    ],
    colors: [
      { name: "Gray", hex: "#808080" },
      { name: "Navy", hex: "#000080" },
      { name: "Beige", hex: "#F5F5DC" }
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },

  // Premium Polo Shirt
  {
    _id: "9",
    name: "Premium Polo Shirt",
    description: "Classic fit polo shirt perfect for custom embroidery and prints. Made from high-quality pique cotton.",
    price: 39.99,
    category: "shirts",
    gender: "men",
    images: [
      {
        url: "https://res.cloudinary.com/djjm5xvhs/image/upload/v1746849851/Premium_kfca2m.avif",
        public_id: "premium_polo_shirt"
      }
    ],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Navy", hex: "#000080" },
      { name: "Black", hex: "#000000" },
      { name: "Light Blue", hex: "#ADD8E6" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    isNew: true,
    popularity: 4.7
  }
];
