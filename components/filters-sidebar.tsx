"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ListingCondition, ListingType } from "@/lib/database.types";

export interface FilterState {
  conditions: ListingCondition[];
  priceMin: number;
  priceMax: number;
  types: ListingType[];
  locations: string[];
  shippingFree: boolean;
  shippingPaid: boolean;
  localPickup: boolean;
}

interface FiltersSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
  onFiltersChange?: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export function FiltersSidebar({ onClose, isMobile, onFiltersChange, initialFilters }: FiltersSidebarProps) {
  const { t } = useTranslation();
  const [priceRange, setPriceRange] = useState<number[]>([
    initialFilters?.priceMin || 0,
    initialFilters?.priceMax || 50000
  ]);
  const [selectedConditions, setSelectedConditions] = useState<ListingCondition[]>(
    initialFilters?.conditions || []
  );
  const [selectedTypes, setSelectedTypes] = useState<ListingType[]>(
    initialFilters?.types || []
  );
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialFilters?.locations || []
  );
  const [shippingFree, setShippingFree] = useState<boolean>(
    initialFilters?.shippingFree || false
  );
  const [shippingPaid, setShippingPaid] = useState<boolean>(
    initialFilters?.shippingPaid || false
  );
  const [localPickup, setLocalPickup] = useState<boolean>(
    initialFilters?.localPickup || false
  );

  // Notify parent component when filters change
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange({
        conditions: selectedConditions,
        priceMin: priceRange[0],
        priceMax: priceRange[1],
        types: selectedTypes,
        locations: selectedLocations,
        shippingFree,
        shippingPaid,
        localPickup,
      });
    }
  }, [selectedConditions, priceRange, selectedTypes, selectedLocations, shippingFree, shippingPaid, localPickup, onFiltersChange]);

  // Toggle condition filter
  const toggleCondition = (condition: ListingCondition) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  // Toggle type filter
  const toggleType = (type: ListingType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Toggle location filter
  const toggleLocation = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedConditions([]);
    setPriceRange([0, 50000]);
    setSelectedTypes([]);
    setSelectedLocations([]);
    setShippingFree(false);
    setShippingPaid(false);
    setLocalPickup(false);
  };

  return (
    <Card className={`p-4 ${isMobile ? 'h-full' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h2>{t('filters.title')}</h2>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Condition */}
        <div>
          <h3 className="mb-3">{t('filters.condition')}</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new"
                checked={selectedConditions.includes('new')}
                onCheckedChange={() => toggleCondition('new')}
              />
              <Label htmlFor="new" className="cursor-pointer">New</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="like_new"
                checked={selectedConditions.includes('like_new')}
                onCheckedChange={() => toggleCondition('like_new')}
              />
              <Label htmlFor="like_new" className="cursor-pointer">Like New</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="used"
                checked={selectedConditions.includes('used')}
                onCheckedChange={() => toggleCondition('used')}
              />
              <Label htmlFor="used" className="cursor-pointer">Used</Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <h3 className="mb-3">{t('filters.price_range')}</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor="min-price" className="text-xs text-gray-500">{t('filters.min_price')}</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="min-price"
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setPriceRange([Math.max(0, Math.min(value, priceRange[1])), priceRange[1]]);
                    }}
                    className="pl-7"
                    placeholder="0"
                  />
                </div>
              </div>
              <span className="text-gray-400 pt-6">—</span>
              <div className="flex-1">
                <Label htmlFor="max-price" className="text-xs text-gray-500">{t('filters.max_price')}</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="max-price"
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 200000;
                      setPriceRange([priceRange[0], Math.min(200000, Math.max(value, priceRange[0]))]);
                    }}
                    className="pl-7"
                    placeholder="200,000"
                  />
                </div>
              </div>
            </div>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={200000}
              step={10}
            />
          </div>
        </div>

        {/* MVP: Hide Buying Format filter - fixed price only */}
        {/*
        <Separator />

        <div>
          <h3 className="mb-3">{t('filters.buying_format')}</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auction"
                checked={selectedTypes.includes('auction')}
                onCheckedChange={() => toggleType('auction')}
              />
              <Label htmlFor="auction" className="cursor-pointer">{t('filters.auction')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fixed_price"
                checked={selectedTypes.includes('fixed_price')}
                onCheckedChange={() => toggleType('fixed_price')}
              />
              <Label htmlFor="fixed_price" className="cursor-pointer">{t('filters.buy_it_now')}</Label>
            </div>
          </div>
        </div>

        <Separator />
        */}

        {/* Location */}
        <div>
          <h3 className="mb-3">{t('filters.location')}</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="phnom-penh"
                checked={selectedLocations.includes('Phnom Penh')}
                onCheckedChange={() => toggleLocation('Phnom Penh')}
              />
              <Label htmlFor="phnom-penh" className="cursor-pointer">{t('filters.phnom_penh')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="siem-reap"
                checked={selectedLocations.includes('Siem Reap')}
                onCheckedChange={() => toggleLocation('Siem Reap')}
              />
              <Label htmlFor="siem-reap" className="cursor-pointer">{t('filters.siem_reap')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sihanoukville"
                checked={selectedLocations.includes('Sihanoukville')}
                onCheckedChange={() => toggleLocation('Sihanoukville')}
              />
              <Label htmlFor="sihanoukville" className="cursor-pointer">{t('filters.sihanoukville')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="kampot"
                checked={selectedLocations.includes('Kampot')}
                onCheckedChange={() => toggleLocation('Kampot')}
              />
              <Label htmlFor="kampot" className="cursor-pointer">{t('filters.kampot')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="other-location"
                checked={selectedLocations.includes('Other Location')}
                onCheckedChange={() => toggleLocation('Other Location')}
              />
              <Label htmlFor="other-location" className="cursor-pointer">{t('filters.other_location')}</Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Shipping */}
        <div>
          <h3 className="mb-3">{t('filters.shipping_options')}</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="free-shipping"
                checked={shippingFree}
                onCheckedChange={(checked) => setShippingFree(!!checked)}
              />
              <Label htmlFor="free-shipping" className="cursor-pointer">{t('filters.free_shipping')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="local-pickup"
                checked={localPickup}
                onCheckedChange={(checked) => setLocalPickup(!!checked)}
              />
              <Label htmlFor="local-pickup" className="cursor-pointer">{t('filters.local_pickup')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="paid-shipping"
                checked={shippingPaid}
                onCheckedChange={(checked) => setShippingPaid(!!checked)}
              />
              <Label htmlFor="paid-shipping" className="cursor-pointer">Paid Shipping</Label>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-6" onClick={clearAllFilters}>
          {t('filters.clear_all')}
        </Button>
      </div>
    </Card>
  );
}
