// ===================================================================
//  EDIT THIS FILE to change the brand's phone numbers, email, etc.
//  (The server reads this file too, so prices and fees stay in sync.)
// ===================================================================

export const BRAND = {
  name: "RYZE",
  tagline: "Rise above the ordinary.",

  // Shown on the website
  phone: "0814 301 9070",
  phoneLink: "+2348143019070",

  // WhatsApp number: country code + number, digits only, no "+"
  whatsapp: "2348143019070",

  email: "makindepriscilla5@gmail.com",
  instagram: "https://instagram.com/priscillamakinde",
  instagramHandle: "@priscillamakinde",
  snapchat: "https://www.snapchat.com/add/ryze_szn",
  snapchatHandle: "ryze_szn",
  tiktok: "https://www.tiktok.com/@ryze_clothing_",
  tiktokHandle: "@ryze_clothing_",
  additionalPhones: [
    { name: "Ryder", display: "08155431862", link: "+2348155431862", whatsapp: "2348155431862" },
    { name: "Pelumi", display: "09078550857", link: "+2349078550857", whatsapp: "2349078550857" },
  ],
  location: "Lagos, Nigeria",

  // Delivery
  deliveryFee: 3000,
  freeDeliveryOver: 80000,
};

export const BANK_TRANSFER = {
  accountNumber: "1814926436",
  accountName: "Atere Daniel Obuname",
  bank: "Providus Bank",
};

export function formatPrice(amount) {
  return "₦" + Number(amount).toLocaleString("en-NG");
}

export function whatsappLink(message, number) {
  const recipient = number || BRAND.whatsapp;
  return "https://wa.me/" + recipient + "?text=" + encodeURIComponent(message);
}
