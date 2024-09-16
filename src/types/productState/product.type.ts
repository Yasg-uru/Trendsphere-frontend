// Frontend interface for a product variant
export interface IProductVariantFrontend {
    size: { size: string; stock: number ,_id:string}[]; // Array of sizes and their stocks
    color: string;
    material: string;
    price: number;
    stock: number;
    sku: string;
    images: string[]; // Array of images for this variant
    available: boolean; // Is this variant available?
    _id:string;
  }
  
  // Frontend interface for a product review
  export interface IProductReviewFrontend {
    customerId: string; // Reference to the customer who left the review (as a string, since it's just used for display)
    comment: string;
    rating: number;
    createdAt: Date;
    helpfulCount: number;
    isVerifiedPurchase: boolean;
    images: IReviewImageFrontend[]; // Array of review images
  }
  
  // Interface for review images on the frontend
  export interface IReviewImageFrontend {
    url: string;
    description: string;
    createdAt: Date;
  }
  
  // Frontend interface for the return policy
  export interface IReturnPolicyFrontend {
    eligible: boolean;
    refundDays: number;
    terms: string;
  }
  
  // Frontend interface for the replacement policy
  export interface IReplacePolicyFrontend {
    eligible: boolean;
    replacementDays: number;
    terms: string;
    validReason: string[];
  }
  
  // Frontend interface for the product discount
  export interface IProductDiscountFrontend {
    discountPercentage: number;
    validFrom: Date;
    validUntil: Date;
  }
  
  // Main interface for the product on the frontend
  export interface IProductFrontend {
    _id: string; // The product ID
    name: string;
    category: string;
    subcategory: string;
    childcategory: string;
    description: string;
    basePrice: number; // The base price of the product
    materials: string[]; // Array of materials (e.g., Cotton, Polyester)
    sustainabilityRating: number; // Sustainability rating (out of 5)
    available: boolean; // Whether the product is available
    brand: string; // The brand of the product
    overallStock: number; // Overall stock calculated from variants
    defaultImage: string; // The default product image
    variants: IProductVariantFrontend[]; // Array of product variants
    reviews: IProductReviewFrontend[]; // Array of customer reviews
    rating: number; // Average rating for the product (out of 5)
    discount?: IProductDiscountFrontend; // Optional discount object
    loyalityPoints: number; // Loyalty points associated with the product
    returnPolicy: IReturnPolicyFrontend; // Return policy for the product
    replacementPolicy: IReplacePolicyFrontend; // Replacement policy for the product
    gender: "mens" | "womens" | "kids" | ""; // Gender category for the product
    highlights: string[]; // Product highlights (e.g., features)
    productDetails: Record<string, string>; // Additional details as a key-value map
  }
  