// ===================================================================
//  The RYZE product list. To add a product, copy one block below.
//  - type:   "tee", "hoodie", "joggers" or "cap" (decides the drawing)
//  - image:  put a photo link here (e.g. "/images/kite-tee.jpg") to
//            replace the drawing with a real product photo.
// ===================================================================

export const products = [
  {
    id: 1,
    slug: "kite-tee",
    name: "Twin-Tone RYZE Polo",
    category: "polos",
    price: 18000,
    type: "tee",
    color: "#121212",
    accent: "#e10b17",
    colorName: "Jet Black",
    tag: "Bestseller",
    image: "/WhatsApp Image 2026-11-18 at 1.54.30 PM.jpeg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The tee that started it all. Heavyweight cotton, boxy fit and the signature RYZE kite stitched on the chest.",
    details: [
      "240gsm heavyweight combed cotton",
      "Relaxed boxy fit - size down for a slimmer look",
      "Embroidered kite on chest",
      "Pre-shrunk, machine washable",
    ],
  },
  {
    id: 2,
    slug: "flight-hoodie",
    name: "Number 25 Racing Set",
    category: "sets",
    price: 38000,
    type: "hoodie",
    color: "#161616",
    accent: "#e10b17",
    colorName: "Midnight Black",
    tag: "New",
    image: "/WhatsApp Image 2026-11-18 at 1.54.30 PM (1).jpeg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Thick, soft and built for cold nights. A double-layer hood, kangaroo pocket and a bold red kite across the chest.",
    details: [
      "400gsm brushed fleece inside",
      "Double-layer hood with flat drawcords",
      "Ribbed cuffs and hem that hold their shape",
      "Embroidered kite and tail detail",
    ],
  },
  {
    id: 3,
    slug: "crimson-tee",
    name: "Limited Graphic Tops",
    category: "tops",
    price: 18000,
    type: "tee",
    color: "#c40a14",
    accent: "#0b0b0b",
    colorName: "Crimson Red",
    tag: "",
    image: "/WhatsApp Image 2026-11-18 at 1.54.31 PM.jpeg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Stand out in any crowd. The same heavyweight fit as our classic tee, dyed in deep crimson with a black kite.",
    details: [
      "240gsm heavyweight combed cotton",
      "Garment dyed for a rich, lived-in red",
      "Relaxed boxy fit",
      "Embroidered black kite on chest",
    ],
  },
  {
    id: 4,
    slug: "stealth-joggers",
    name: "Tactical Jungle Shorts",
    category: "bottoms",
    price: 28000,
    type: "joggers",
    color: "#141414",
    accent: "#e10b17",
    colorName: "Stealth Black",
    tag: "",
    image: "/WhatsApp Image 2026-11-18 at 1.54.31 PM (1).jpeg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Tapered, comfortable and sharp. Zip pockets keep your phone and keys safe while you move.",
    details: [
      "350gsm French terry",
      "Tapered leg with ribbed ankle cuffs",
      "Two zip pockets and one back pocket",
      "Red kite print on left thigh",
    ],
  },
  {
    id: 5,
    slug: "crimson-hoodie",
    name: "Limitless 77 Track Set",
    category: "sets",
    price: 38000,
    type: "hoodie",
    color: "#b8090f",
    accent: "#0b0b0b",
    colorName: "Crimson Red",
    tag: "Limited",
    image: "/WhatsApp Image 2026-11-18 at 1.54.31 PM (2).jpeg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Our boldest hoodie. Limited run in crimson red with black details, made for people who want to be seen.",
    details: [
      "400gsm brushed fleece inside",
      "Limited batch - when it is gone, it is gone",
      "Double-layer hood and kangaroo pocket",
      "Black embroidered kite on chest",
    ],
  },
  {
    id: 6,
    slug: "kite-cap",
    name: "Special Edition RYZE Polo",
    category: "polos",
    price: 12000,
    type: "cap",
    color: "#111111",
    accent: "#e10b17",
    colorName: "Black",
    tag: "",
    image: "/WhatsApp Image 2026-11-18 at 1.54.31 PM (3).jpeg",
    sizes: ["One Size"],
    description:
      "A clean six-panel cap with a curved brim and an adjustable strap. Fits every head, goes with every fit.",
    details: [
      "100% cotton twill",
      "Adjustable metal buckle strap",
      "Curved brim, unstructured crown",
      "Embroidered red kite on front",
    ],
  },
  {
    id: 7,
    slug: "ash-tee",
    name: "Shadow Camo Joggers",
    category: "bottoms",
    price: 18000,
    type: "tee",
    color: "#3a3a3a",
    accent: "#e10b17",
    colorName: "Ash Grey",
    tag: "",
    image: "/WhatsApp Image 2026-11-18 at 1.54.32 PM.jpeg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "A washed charcoal tee that pairs with everything. Soft from the first wear, with a red kite that pops.",
    details: [
      "240gsm heavyweight combed cotton",
      "Enzyme washed for a vintage feel",
      "Relaxed boxy fit",
      "Embroidered red kite on chest",
    ],
  },
  {
    id: 8,
    slug: "ember-joggers",
    name: "Rise Again Graphic Tee",
    category: "tops",
    price: 28000,
    type: "joggers",
    color: "#9c0a10",
    accent: "#0b0b0b",
    colorName: "Ember Red",
    tag: "New",
    image: "/WhatsApp Image 2026-11-18 at 1.54.32 PM (1).jpeg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The same tapered fit as our Stealth Joggers in a deep ember red. Matches the Crimson Hoodie perfectly.",
    details: [
      "350gsm French terry",
      "Tapered leg with ribbed ankle cuffs",
      "Two zip pockets and one back pocket",
      "Black kite print on left thigh",
    ],
  },
];

export function getProductBySlug(slug) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].slug === slug) {
      return products[i];
    }
  }
  return null;
}

export function getProductById(id) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === Number(id)) {
      return products[i];
    }
  }
  return null;
}
