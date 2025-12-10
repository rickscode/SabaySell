"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerAvatar?: string;
  date: Date;
  productTitle: string;
}

interface SellerReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function SellerReviews({ reviews, averageRating, totalReviews }: SellerReviewsProps) {
  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });
    return distribution.reverse();
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Seller Ratings</CardTitle>
          <CardDescription>Based on {totalReviews} reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-4xl mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">{totalReviews} reviews</div>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars, index) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm w-8">{stars} ★</span>
                  <Progress
                    value={(ratingDistribution[index] / totalReviews) * 100}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-8">
                    {ratingDistribution[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={review.reviewerAvatar} />
                  <AvatarFallback>{review.reviewerName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div>{review.reviewerName}</div>
                      <div className="text-sm text-gray-600">
                        {review.date.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <div className="text-sm text-gray-600">
                    Product: {review.productTitle}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
