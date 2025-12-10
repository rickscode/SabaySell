"use client";

import { Card } from "./ui/card";
import { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CategoryCardProps {
  nameKey: string;
  icon: LucideIcon;
  count: string;
}

export function CategoryCard({ nameKey, icon: Icon, count }: CategoryCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="p-3 bg-[#fff5f0] rounded-full group-hover:bg-[#ffe5d9] transition-colors">
          <Icon className="w-6 h-6 text-[#fa6723]" />
        </div>
        <h3 className="text-sm" suppressHydrationWarning>{t(nameKey)}</h3>
        <p className="text-xs text-gray-500">{count}</p>
      </div>
    </Card>
  );
}
