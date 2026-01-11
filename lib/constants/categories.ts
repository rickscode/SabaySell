export type ElectronicsCategory =
  | "Mobile Phones"
  | "Tablets & iPads"
  | "Laptops & Computers"
  | "Accessories";

export interface CategoryConfig {
  id: ElectronicsCategory;
  slug: string;
  icon: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  subcategories: string[];
  enabled: boolean;
}

export const ELECTRONICS_CATEGORIES: Record<ElectronicsCategory, CategoryConfig> = {
  "Mobile Phones": {
    id: "Mobile Phones",
    slug: "phones",
    icon: "Smartphone",
    seoTitle: "Buy & Sell iPhone, Samsung Phones in Cambodia | SabaySell",
    seoDescription: "Buy & sell new & used iPhones, Samsung Galaxy, Huawei phones in Cambodia. Best prices in Phnom Penh. iPhone 15, Samsung S24. Free listings.",
    seoKeywords: ["buy iphone cambodia", "sell iphone phnom penh", "samsung phone cambodia", "sell my phone cambodia", "buy smartphone phnom penh"],
    subcategories: ["iPhones", "Samsung Galaxy", "Huawei", "Oppo & Vivo", "Feature Phones"],
    enabled: true
  },
  "Tablets & iPads": {
    id: "Tablets & iPads",
    slug: "tablets",
    icon: "Tablet",
    seoTitle: "Buy & Sell iPad, Tablets in Cambodia | SabaySell",
    seoDescription: "Buy & sell new & used iPads, Samsung tablets in Cambodia. iPad Pro, iPad Air, Galaxy Tab. Best prices in Phnom Penh, Siem Reap. Free listings.",
    seoKeywords: ["buy ipad cambodia", "sell ipad phnom penh", "buy tablet phnom penh", "sell my ipad cambodia", "ipad price cambodia"],
    subcategories: ["iPads", "Samsung Galaxy Tabs", "Android Tablets", "E-Readers"],
    enabled: true
  },
  "Laptops & Computers": {
    id: "Laptops & Computers",
    slug: "laptops",
    icon: "Laptop",
    seoTitle: "Buy & Sell MacBook, Gaming Laptops, PCs in Cambodia | SabaySell",
    seoDescription: "Buy & sell new & used MacBooks, gaming laptops, business laptops in Cambodia. Dell, HP, Asus, Lenovo. Best prices in Phnom Penh. Free listings.",
    seoKeywords: ["buy macbook cambodia", "sell macbook phnom penh", "gaming laptop cambodia", "sell my laptop cambodia", "laptop price phnom penh"],
    subcategories: ["MacBooks", "Gaming Laptops", "Business Laptops", "Desktop PCs", "Components"],
    enabled: false
  },
  "Accessories": {
    id: "Accessories",
    slug: "accessories",
    icon: "Headphones",
    seoTitle: "Buy & Sell Phone Cases, Chargers, Electronics Accessories Cambodia | SabaySell",
    seoDescription: "Buy & sell phone cases, chargers, cables, headphones, power banks in Cambodia. iPhone accessories, Samsung accessories. Free listings.",
    seoKeywords: ["phone accessories cambodia", "sell phone accessories phnom penh", "iphone case cambodia", "charger phnom penh"],
    subcategories: ["Cases & Covers", "Chargers & Cables", "Headphones & Earbuds", "Power Banks", "Smartwatches"],
    enabled: false
  }
};

export const getAllCategories = () => Object.values(ELECTRONICS_CATEGORIES);
export const getEnabledCategories = () => Object.values(ELECTRONICS_CATEGORIES).filter(cat => cat.enabled);
export const getCategoryBySlug = (slug: string) =>
  Object.values(ELECTRONICS_CATEGORIES).find(cat => cat.slug === slug);
