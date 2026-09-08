export interface ReviewImage {
  id: number;
  image: string;
}

export interface Review {
  id: number;

  rating: number;

  comment: string;

  customer: {
    id: number;
    name: string;
    photo: string;
  };

  images: ReviewImage[];
}
