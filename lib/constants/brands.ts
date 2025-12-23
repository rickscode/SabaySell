/**
 * Electronics brand options for SabaySell marketplace
 * Organized by category with support for cascading dropdowns
 */

export type ElectronicsCategory =
  | "Mobile Phones"
  | "Tablets & iPads"
  | "Laptops & Computers"
  | "Accessories";

export interface BrandOption {
  value: string;
  label: string;
  categories: ElectronicsCategory[];
}

/**
 * Comprehensive list of electronics brands available in Cambodia
 * Each brand includes which categories it applies to
 */
export const ELECTRONICS_BRANDS: BrandOption[] = [
  // Premium brands (Mobile Phones, Tablets, Laptops)
  {
    value: "apple",
    label: "Apple",
    categories: ["Mobile Phones", "Tablets & iPads", "Laptops & Computers"]
  },

  // Mobile Phones & Tablets
  {
    value: "samsung",
    label: "Samsung",
    categories: ["Mobile Phones", "Tablets & iPads", "Laptops & Computers"]
  },
  {
    value: "huawei",
    label: "Huawei",
    categories: ["Mobile Phones", "Tablets & iPads"]
  },
  {
    value: "xiaomi",
    label: "Xiaomi",
    categories: ["Mobile Phones", "Tablets & iPads", "Laptops & Computers"]
  },
  {
    value: "oppo",
    label: "OPPO",
    categories: ["Mobile Phones", "Tablets & iPads"]
  },
  {
    value: "vivo",
    label: "Vivo",
    categories: ["Mobile Phones", "Tablets & iPads"]
  },
  {
    value: "realme",
    label: "Realme",
    categories: ["Mobile Phones", "Tablets & iPads"]
  },
  {
    value: "google",
    label: "Google",
    categories: ["Mobile Phones", "Tablets & iPads"]
  },
  {
    value: "oneplus",
    label: "OnePlus",
    categories: ["Mobile Phones", "Tablets & iPads"]
  },
  {
    value: "nokia",
    label: "Nokia",
    categories: ["Mobile Phones"]
  },
  {
    value: "motorola",
    label: "Motorola",
    categories: ["Mobile Phones"]
  },
  {
    value: "sony",
    label: "Sony",
    categories: ["Mobile Phones"]
  },
  {
    value: "asus",
    label: "ASUS",
    categories: ["Mobile Phones", "Tablets & iPads", "Laptops & Computers"]
  },
  {
    value: "lenovo",
    label: "Lenovo",
    categories: ["Mobile Phones", "Tablets & iPads", "Laptops & Computers"]
  },

  // Laptops & Computers
  {
    value: "dell",
    label: "Dell",
    categories: ["Laptops & Computers"]
  },
  {
    value: "hp",
    label: "HP",
    categories: ["Laptops & Computers"]
  },
  {
    value: "acer",
    label: "Acer",
    categories: ["Laptops & Computers"]
  },
  {
    value: "msi",
    label: "MSI",
    categories: ["Laptops & Computers"]
  },
  {
    value: "razer",
    label: "Razer",
    categories: ["Laptops & Computers"]
  },
  {
    value: "microsoft",
    label: "Microsoft",
    categories: ["Tablets & iPads", "Laptops & Computers"]
  },
  {
    value: "lg",
    label: "LG",
    categories: ["Mobile Phones", "Tablets & iPads", "Laptops & Computers"]
  },
  {
    value: "toshiba",
    label: "Toshiba",
    categories: ["Laptops & Computers"]
  },

  // Accessories brands
  {
    value: "anker",
    label: "Anker",
    categories: ["Accessories"]
  },
  {
    value: "belkin",
    label: "Belkin",
    categories: ["Accessories"]
  },
  {
    value: "baseus",
    label: "Baseus",
    categories: ["Accessories"]
  },
  {
    value: "ugreen",
    label: "UGREEN",
    categories: ["Accessories"]
  },
  {
    value: "spigen",
    label: "Spigen",
    categories: ["Accessories"]
  },
  {
    value: "otterbox",
    label: "OtterBox",
    categories: ["Accessories"]
  },
  {
    value: "logitech",
    label: "Logitech",
    categories: ["Accessories"]
  },
  {
    value: "sandisk",
    label: "SanDisk",
    categories: ["Accessories"]
  },

  // "Other" option for all categories
  {
    value: "other",
    label: "Other (specify in description)",
    categories: ["Mobile Phones", "Tablets & iPads", "Laptops & Computers", "Accessories"]
  },
];

/**
 * Get brands filtered by category
 * @param category - Electronics category to filter by
 * @returns Array of brand options applicable to the category
 */
export function getBrandsForCategory(category: ElectronicsCategory): BrandOption[] {
  return ELECTRONICS_BRANDS.filter(brand =>
    brand.categories.includes(category)
  );
}

/**
 * Get brand label from value
 * @param value - Brand value (slug)
 * @returns Brand label or undefined if not found
 */
export function getBrandLabel(value: string): string | undefined {
  const brand = ELECTRONICS_BRANDS.find(b => b.value === value);
  return brand?.label;
}

/**
 * Check if a brand value is valid
 * @param value - Brand value to check
 * @returns True if brand exists
 */
export function isValidBrand(value: string): boolean {
  return ELECTRONICS_BRANDS.some(b => b.value === value);
}
