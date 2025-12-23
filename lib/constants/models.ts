/**
 * Electronics model options for SabaySell marketplace
 * Nested by brand for cascading dropdown functionality
 */

export interface ModelOption {
  value: string;
  label: string;
  brand: string;
}

/**
 * Comprehensive model catalog organized by brand
 * Includes popular models available in Cambodia
 */
export const ELECTRONICS_MODELS: Record<string, ModelOption[]> = {
  // Apple models (iPhones, iPads, MacBooks)
  apple: [
    // iPhones
    { value: "iphone-16-pro-max", label: "iPhone 16 Pro Max", brand: "apple" },
    { value: "iphone-16-pro", label: "iPhone 16 Pro", brand: "apple" },
    { value: "iphone-16-plus", label: "iPhone 16 Plus", brand: "apple" },
    { value: "iphone-16", label: "iPhone 16", brand: "apple" },
    { value: "iphone-15-pro-max", label: "iPhone 15 Pro Max", brand: "apple" },
    { value: "iphone-15-pro", label: "iPhone 15 Pro", brand: "apple" },
    { value: "iphone-15-plus", label: "iPhone 15 Plus", brand: "apple" },
    { value: "iphone-15", label: "iPhone 15", brand: "apple" },
    { value: "iphone-14-pro-max", label: "iPhone 14 Pro Max", brand: "apple" },
    { value: "iphone-14-pro", label: "iPhone 14 Pro", brand: "apple" },
    { value: "iphone-14-plus", label: "iPhone 14 Plus", brand: "apple" },
    { value: "iphone-14", label: "iPhone 14", brand: "apple" },
    { value: "iphone-13-pro-max", label: "iPhone 13 Pro Max", brand: "apple" },
    { value: "iphone-13-pro", label: "iPhone 13 Pro", brand: "apple" },
    { value: "iphone-13", label: "iPhone 13", brand: "apple" },
    { value: "iphone-12-pro-max", label: "iPhone 12 Pro Max", brand: "apple" },
    { value: "iphone-12-pro", label: "iPhone 12 Pro", brand: "apple" },
    { value: "iphone-12", label: "iPhone 12", brand: "apple" },
    { value: "iphone-11-pro-max", label: "iPhone 11 Pro Max", brand: "apple" },
    { value: "iphone-11-pro", label: "iPhone 11 Pro", brand: "apple" },
    { value: "iphone-11", label: "iPhone 11", brand: "apple" },
    { value: "iphone-se-2022", label: "iPhone SE (2022)", brand: "apple" },
    { value: "iphone-se-2020", label: "iPhone SE (2020)", brand: "apple" },

    // iPads
    { value: "ipad-pro-129-2024", label: "iPad Pro 12.9\" (2024)", brand: "apple" },
    { value: "ipad-pro-11-2024", label: "iPad Pro 11\" (2024)", brand: "apple" },
    { value: "ipad-air-2024", label: "iPad Air (2024)", brand: "apple" },
    { value: "ipad-10", label: "iPad (10th Gen)", brand: "apple" },
    { value: "ipad-9", label: "iPad (9th Gen)", brand: "apple" },
    { value: "ipad-mini-6", label: "iPad Mini (6th Gen)", brand: "apple" },

    // MacBooks
    { value: "macbook-pro-16-m4", label: "MacBook Pro 16\" M4", brand: "apple" },
    { value: "macbook-pro-14-m4", label: "MacBook Pro 14\" M4", brand: "apple" },
    { value: "macbook-pro-16-m3", label: "MacBook Pro 16\" M3", brand: "apple" },
    { value: "macbook-pro-14-m3", label: "MacBook Pro 14\" M3", brand: "apple" },
    { value: "macbook-air-15-m3", label: "MacBook Air 15\" M3", brand: "apple" },
    { value: "macbook-air-13-m3", label: "MacBook Air 13\" M3", brand: "apple" },
    { value: "macbook-air-15-m2", label: "MacBook Air 15\" M2", brand: "apple" },
    { value: "macbook-air-13-m2", label: "MacBook Air 13\" M2", brand: "apple" },
    { value: "macbook-air-13-m1", label: "MacBook Air 13\" M1", brand: "apple" },

    { value: "other", label: "Other Apple Model", brand: "apple" },
  ],

  // Samsung models (Galaxy phones, tablets, laptops)
  samsung: [
    // Galaxy S series
    { value: "galaxy-s24-ultra", label: "Galaxy S24 Ultra", brand: "samsung" },
    { value: "galaxy-s24-plus", label: "Galaxy S24+", brand: "samsung" },
    { value: "galaxy-s24", label: "Galaxy S24", brand: "samsung" },
    { value: "galaxy-s23-ultra", label: "Galaxy S23 Ultra", brand: "samsung" },
    { value: "galaxy-s23-plus", label: "Galaxy S23+", brand: "samsung" },
    { value: "galaxy-s23", label: "Galaxy S23", brand: "samsung" },
    { value: "galaxy-s22-ultra", label: "Galaxy S22 Ultra", brand: "samsung" },
    { value: "galaxy-s22-plus", label: "Galaxy S22+", brand: "samsung" },
    { value: "galaxy-s22", label: "Galaxy S22", brand: "samsung" },
    { value: "galaxy-s21-ultra", label: "Galaxy S21 Ultra", brand: "samsung" },
    { value: "galaxy-s21-plus", label: "Galaxy S21+", brand: "samsung" },
    { value: "galaxy-s21", label: "Galaxy S21", brand: "samsung" },

    // Galaxy Z (Foldables)
    { value: "galaxy-z-fold-6", label: "Galaxy Z Fold 6", brand: "samsung" },
    { value: "galaxy-z-fold-5", label: "Galaxy Z Fold 5", brand: "samsung" },
    { value: "galaxy-z-flip-6", label: "Galaxy Z Flip 6", brand: "samsung" },
    { value: "galaxy-z-flip-5", label: "Galaxy Z Flip 5", brand: "samsung" },

    // Galaxy A series
    { value: "galaxy-a54", label: "Galaxy A54", brand: "samsung" },
    { value: "galaxy-a34", label: "Galaxy A34", brand: "samsung" },
    { value: "galaxy-a24", label: "Galaxy A24", brand: "samsung" },
    { value: "galaxy-a14", label: "Galaxy A14", brand: "samsung" },

    // Tablets
    { value: "galaxy-tab-s9-ultra", label: "Galaxy Tab S9 Ultra", brand: "samsung" },
    { value: "galaxy-tab-s9-plus", label: "Galaxy Tab S9+", brand: "samsung" },
    { value: "galaxy-tab-s9", label: "Galaxy Tab S9", brand: "samsung" },
    { value: "galaxy-tab-a9-plus", label: "Galaxy Tab A9+", brand: "samsung" },

    // Laptops
    { value: "galaxy-book-4-pro", label: "Galaxy Book 4 Pro", brand: "samsung" },
    { value: "galaxy-book-3-ultra", label: "Galaxy Book 3 Ultra", brand: "samsung" },

    { value: "other", label: "Other Samsung Model", brand: "samsung" },
  ],

  // Xiaomi models
  xiaomi: [
    { value: "xiaomi-14-ultra", label: "Xiaomi 14 Ultra", brand: "xiaomi" },
    { value: "xiaomi-14-pro", label: "Xiaomi 14 Pro", brand: "xiaomi" },
    { value: "xiaomi-14", label: "Xiaomi 14", brand: "xiaomi" },
    { value: "xiaomi-13-ultra", label: "Xiaomi 13 Ultra", brand: "xiaomi" },
    { value: "xiaomi-13-pro", label: "Xiaomi 13 Pro", brand: "xiaomi" },
    { value: "xiaomi-13", label: "Xiaomi 13", brand: "xiaomi" },
    { value: "redmi-note-13-pro-plus", label: "Redmi Note 13 Pro+", brand: "xiaomi" },
    { value: "redmi-note-13-pro", label: "Redmi Note 13 Pro", brand: "xiaomi" },
    { value: "redmi-note-13", label: "Redmi Note 13", brand: "xiaomi" },
    { value: "redmi-note-12-pro-plus", label: "Redmi Note 12 Pro+", brand: "xiaomi" },
    { value: "redmi-note-12-pro", label: "Redmi Note 12 Pro", brand: "xiaomi" },
    { value: "poco-x6-pro", label: "POCO X6 Pro", brand: "xiaomi" },
    { value: "poco-f5-pro", label: "POCO F5 Pro", brand: "xiaomi" },
    { value: "other", label: "Other Xiaomi Model", brand: "xiaomi" },
  ],

  // Huawei models
  huawei: [
    { value: "huawei-p60-pro", label: "Huawei P60 Pro", brand: "huawei" },
    { value: "huawei-p50-pro", label: "Huawei P50 Pro", brand: "huawei" },
    { value: "huawei-mate-60-pro", label: "Huawei Mate 60 Pro", brand: "huawei" },
    { value: "huawei-mate-50-pro", label: "Huawei Mate 50 Pro", brand: "huawei" },
    { value: "huawei-nova-12-pro", label: "Huawei Nova 12 Pro", brand: "huawei" },
    { value: "huawei-nova-11-pro", label: "Huawei Nova 11 Pro", brand: "huawei" },
    { value: "other", label: "Other Huawei Model", brand: "huawei" },
  ],

  // OPPO models
  oppo: [
    { value: "oppo-find-x7-ultra", label: "OPPO Find X7 Ultra", brand: "oppo" },
    { value: "oppo-find-x6-pro", label: "OPPO Find X6 Pro", brand: "oppo" },
    { value: "oppo-reno-11-pro", label: "OPPO Reno 11 Pro", brand: "oppo" },
    { value: "oppo-reno-11", label: "OPPO Reno 11", brand: "oppo" },
    { value: "oppo-reno-10-pro-plus", label: "OPPO Reno 10 Pro+", brand: "oppo" },
    { value: "oppo-a79", label: "OPPO A79", brand: "oppo" },
    { value: "oppo-a59", label: "OPPO A59", brand: "oppo" },
    { value: "other", label: "Other OPPO Model", brand: "oppo" },
  ],

  // Vivo models
  vivo: [
    { value: "vivo-x100-pro", label: "Vivo X100 Pro", brand: "vivo" },
    { value: "vivo-x90-pro", label: "Vivo X90 Pro", brand: "vivo" },
    { value: "vivo-v30-pro", label: "Vivo V30 Pro", brand: "vivo" },
    { value: "vivo-v29-pro", label: "Vivo V29 Pro", brand: "vivo" },
    { value: "vivo-y100", label: "Vivo Y100", brand: "vivo" },
    { value: "vivo-y56", label: "Vivo Y56", brand: "vivo" },
    { value: "other", label: "Other Vivo Model", brand: "vivo" },
  ],

  // Realme models
  realme: [
    { value: "realme-gt-5-pro", label: "Realme GT 5 Pro", brand: "realme" },
    { value: "realme-12-pro-plus", label: "Realme 12 Pro+", brand: "realme" },
    { value: "realme-12-pro", label: "Realme 12 Pro", brand: "realme" },
    { value: "realme-11-pro-plus", label: "Realme 11 Pro+", brand: "realme" },
    { value: "realme-c67", label: "Realme C67", brand: "realme" },
    { value: "other", label: "Other Realme Model", brand: "realme" },
  ],

  // Google Pixel models
  google: [
    { value: "pixel-9-pro-xl", label: "Pixel 9 Pro XL", brand: "google" },
    { value: "pixel-9-pro", label: "Pixel 9 Pro", brand: "google" },
    { value: "pixel-9", label: "Pixel 9", brand: "google" },
    { value: "pixel-8-pro", label: "Pixel 8 Pro", brand: "google" },
    { value: "pixel-8", label: "Pixel 8", brand: "google" },
    { value: "pixel-7-pro", label: "Pixel 7 Pro", brand: "google" },
    { value: "pixel-7", label: "Pixel 7", brand: "google" },
    { value: "pixel-tablet", label: "Pixel Tablet", brand: "google" },
    { value: "other", label: "Other Pixel Model", brand: "google" },
  ],

  // OnePlus models
  oneplus: [
    { value: "oneplus-12", label: "OnePlus 12", brand: "oneplus" },
    { value: "oneplus-12r", label: "OnePlus 12R", brand: "oneplus" },
    { value: "oneplus-11", label: "OnePlus 11", brand: "oneplus" },
    { value: "oneplus-nord-3", label: "OnePlus Nord 3", brand: "oneplus" },
    { value: "oneplus-pad", label: "OnePlus Pad", brand: "oneplus" },
    { value: "other", label: "Other OnePlus Model", brand: "oneplus" },
  ],

  // Dell laptops
  dell: [
    { value: "xps-17", label: "XPS 17", brand: "dell" },
    { value: "xps-15", label: "XPS 15", brand: "dell" },
    { value: "xps-13", label: "XPS 13", brand: "dell" },
    { value: "inspiron-16", label: "Inspiron 16", brand: "dell" },
    { value: "inspiron-15", label: "Inspiron 15", brand: "dell" },
    { value: "inspiron-14", label: "Inspiron 14", brand: "dell" },
    { value: "g15-gaming", label: "G15 Gaming", brand: "dell" },
    { value: "alienware-m18", label: "Alienware m18", brand: "dell" },
    { value: "alienware-m16", label: "Alienware m16", brand: "dell" },
    { value: "other", label: "Other Dell Model", brand: "dell" },
  ],

  // HP laptops
  hp: [
    { value: "spectre-x360-16", label: "Spectre x360 16", brand: "hp" },
    { value: "spectre-x360-14", label: "Spectre x360 14", brand: "hp" },
    { value: "envy-17", label: "Envy 17", brand: "hp" },
    { value: "envy-15", label: "Envy 15", brand: "hp" },
    { value: "pavilion-15", label: "Pavilion 15", brand: "hp" },
    { value: "omen-16", label: "Omen 16", brand: "hp" },
    { value: "victus-15", label: "Victus 15", brand: "hp" },
    { value: "other", label: "Other HP Model", brand: "hp" },
  ],

  // Lenovo laptops
  lenovo: [
    { value: "thinkpad-x1-carbon", label: "ThinkPad X1 Carbon", brand: "lenovo" },
    { value: "thinkpad-x1-yoga", label: "ThinkPad X1 Yoga", brand: "lenovo" },
    { value: "thinkpad-t14", label: "ThinkPad T14", brand: "lenovo" },
    { value: "ideapad-slim-5", label: "IdeaPad Slim 5", brand: "lenovo" },
    { value: "ideapad-3", label: "IdeaPad 3", brand: "lenovo" },
    { value: "legion-9i", label: "Legion 9i", brand: "lenovo" },
    { value: "legion-7i", label: "Legion 7i", brand: "lenovo" },
    { value: "legion-5-pro", label: "Legion 5 Pro", brand: "lenovo" },
    { value: "yoga-9i", label: "Yoga 9i", brand: "lenovo" },
    { value: "other", label: "Other Lenovo Model", brand: "lenovo" },
  ],

  // ASUS laptops
  asus: [
    { value: "rog-zephyrus-g16", label: "ROG Zephyrus G16", brand: "asus" },
    { value: "rog-strix-scar-18", label: "ROG Strix SCAR 18", brand: "asus" },
    { value: "tuf-gaming-a15", label: "TUF Gaming A15", brand: "asus" },
    { value: "vivobook-15", label: "VivoBook 15", brand: "asus" },
    { value: "zenbook-14-oled", label: "ZenBook 14 OLED", brand: "asus" },
    { value: "other", label: "Other ASUS Model", brand: "asus" },
  ],

  // Acer laptops
  acer: [
    { value: "predator-helios-18", label: "Predator Helios 18", brand: "acer" },
    { value: "predator-helios-16", label: "Predator Helios 16", brand: "acer" },
    { value: "nitro-16", label: "Nitro 16", brand: "acer" },
    { value: "nitro-5", label: "Nitro 5", brand: "acer" },
    { value: "aspire-5", label: "Aspire 5", brand: "acer" },
    { value: "swift-3", label: "Swift 3", brand: "acer" },
    { value: "other", label: "Other Acer Model", brand: "acer" },
  ],

  // MSI laptops
  msi: [
    { value: "titan-18-hx", label: "Titan 18 HX", brand: "msi" },
    { value: "raider-ge78-hx", label: "Raider GE78 HX", brand: "msi" },
    { value: "stealth-16-studio", label: "Stealth 16 Studio", brand: "msi" },
    { value: "katana-15", label: "Katana 15", brand: "msi" },
    { value: "cyborg-15", label: "Cyborg 15", brand: "msi" },
    { value: "other", label: "Other MSI Model", brand: "msi" },
  ],

  // Microsoft Surface
  microsoft: [
    { value: "surface-laptop-6", label: "Surface Laptop 6", brand: "microsoft" },
    { value: "surface-laptop-5", label: "Surface Laptop 5", brand: "microsoft" },
    { value: "surface-pro-10", label: "Surface Pro 10", brand: "microsoft" },
    { value: "surface-pro-9", label: "Surface Pro 9", brand: "microsoft" },
    { value: "other", label: "Other Surface Model", brand: "microsoft" },
  ],

  // Other brands with "Other" option
  razer: [
    { value: "other", label: "Other Razer Model", brand: "razer" },
  ],
  nokia: [
    { value: "other", label: "Other Nokia Model", brand: "nokia" },
  ],
  motorola: [
    { value: "other", label: "Other Motorola Model", brand: "motorola" },
  ],
  sony: [
    { value: "other", label: "Other Sony Model", brand: "sony" },
  ],
  lg: [
    { value: "other", label: "Other LG Model", brand: "lg" },
  ],
  toshiba: [
    { value: "other", label: "Other Toshiba Model", brand: "toshiba" },
  ],
  anker: [
    { value: "other", label: "Other Anker Model", brand: "anker" },
  ],
  belkin: [
    { value: "other", label: "Other Belkin Model", brand: "belkin" },
  ],
  baseus: [
    { value: "other", label: "Other Baseus Model", brand: "baseus" },
  ],
  ugreen: [
    { value: "other", label: "Other UGREEN Model", brand: "ugreen" },
  ],
  spigen: [
    { value: "other", label: "Other Spigen Model", brand: "spigen" },
  ],
  otterbox: [
    { value: "other", label: "Other OtterBox Model", brand: "otterbox" },
  ],
  logitech: [
    { value: "other", label: "Other Logitech Model", brand: "logitech" },
  ],
  sandisk: [
    { value: "other", label: "Other SanDisk Model", brand: "sandisk" },
  ],
};

/**
 * Get models for a specific brand
 * @param brand - Brand value (slug)
 * @returns Array of model options for the brand
 */
export function getModelsForBrand(brand: string): ModelOption[] {
  return ELECTRONICS_MODELS[brand] || [];
}

/**
 * Get model label from value and brand
 * @param brand - Brand value (slug)
 * @param value - Model value (slug)
 * @returns Model label or undefined if not found
 */
export function getModelLabel(brand: string, value: string): string | undefined {
  const models = ELECTRONICS_MODELS[brand] || [];
  const model = models.find(m => m.value === value);
  return model?.label;
}

/**
 * Check if a model exists for a brand
 * @param brand - Brand value
 * @param value - Model value to check
 * @returns True if model exists for the brand
 */
export function isValidModel(brand: string, value: string): boolean {
  const models = ELECTRONICS_MODELS[brand] || [];
  return models.some(m => m.value === value);
}
