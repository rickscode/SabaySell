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
    seoTitle: "Buy & Sell iPhone, Samsung Phones | Marketplace Template",
    seoDescription: "Buy & sell new & used iPhones, Samsung Galaxy, Huawei phones. iPhone 15, Samsung S24, and more. Free listings.",
    seoKeywords: ["buy iphone", "sell iphone", "samsung phone", "sell my phone", "buy smartphone"],
    subcategories: ["iPhones", "Samsung Galaxy", "Huawei", "Oppo & Vivo", "Feature Phones"],
    enabled: true
  },
  "Tablets & iPads": {
    id: "Tablets & iPads",
    slug: "tablets",
    icon: "Tablet",
    seoTitle: "Buy & Sell iPad, Tablets | Marketplace Template",
    seoDescription: "Buy & sell new & used iPads, Samsung tablets. iPad Pro, iPad Air, Galaxy Tab. Free listings.",
    seoKeywords: ["buy ipad", "sell ipad", "buy tablet", "sell my ipad", "ipad price"],
    subcategories: ["iPads", "Samsung Galaxy Tabs", "Android Tablets", "E-Readers"],
    enabled: true
  },
  "Laptops & Computers": {
    id: "Laptops & Computers",
    slug: "laptops",
    icon: "Laptop",
    seoTitle: "Buy & Sell MacBook, Gaming Laptops, PCs | Marketplace Template",
    seoDescription: "Buy & sell new & used MacBooks, gaming laptops, business laptops. Dell, HP, Asus, Lenovo. Free listings.",
    seoKeywords: ["buy macbook", "sell macbook", "gaming laptop", "sell my laptop", "laptop price"],
    subcategories: ["MacBooks", "Gaming Laptops", "Business Laptops", "Desktop PCs", "Components"],
    enabled: true
  },
  "Accessories": {
    id: "Accessories",
    slug: "accessories",
    icon: "Headphones",
    seoTitle: "Buy & Sell Phone Cases, Chargers, Electronics Accessories | Marketplace Template",
    seoDescription: "Buy & sell phone cases, chargers, cables, headphones, power banks. iPhone accessories, Samsung accessories. Free listings.",
    seoKeywords: ["phone accessories", "sell phone accessories", "iphone case", "charger"],
    subcategories: ["Cases & Covers", "Chargers & Cables", "Headphones & Earbuds", "Power Banks", "Smartwatches"],
    enabled: true
  }
};

export const getAllCategories = () => Object.values(ELECTRONICS_CATEGORIES);
export const getEnabledCategories = () => Object.values(ELECTRONICS_CATEGORIES).filter(cat => cat.enabled);
export const getCategoryBySlug = (slug: string) =>
  Object.values(ELECTRONICS_CATEGORIES).find(cat => cat.slug === slug);
