import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Star } from "lucide-react";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import { TopRatedProducts } from "@/state-manager/slices/productSlice";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/helper/Loader";

export default function Home() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const { topRated=[], isLoading } = useAppSelector((state) => state.product);
  useEffect(() => {
    dispatch(TopRatedProducts())
      .unwrap()
      .then(() => {
        toast({
          title: "top rated products fetched successfully",
        });
      })
      .catch((error) => {
        toast({
          title: error,
        });
      });
  }, []);
  const productCategories = [
    {
      name: "Clothing",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clothing-category-2Xq8kNGd3TvI8k9wSxDtD6ALwxLHFQ.jpg",
    },
    {
      name: "Footwear",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/footwear-category-0Iy8Kx9aqHwvbB7tnbQQbLUBDqxmFQ.jpg",
    },
    {
      name: "Accessories",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/accessories-category-rnPHCEWEGBXEFELMXx5Hs7Ue3YNQFQ.jpg",
    },
    {
      name: "Sportswear",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sportswear-category-Hy8Ue3YNQFQ7tnbQQbLUBDqxmFQ.jpg",
    },
  ];

  const topRatedProducts = [
    {
      name: "Eco-Friendly T-Shirt",
      price: 29.99,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Sustainable Denim Jeans",
      price: 79.99,
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Recycled Polyester Jacket",
      price: 89.99,
      rating: 4.9,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Organic Cotton Dress",
      price: 59.99,
      rating: 4.6,
      image: "/placeholder.svg?height=300&width=300",
    },
  ];
  if (isLoading) {
    return <Loader />;
  }
  console.log("this is a top rated products :", topRated);
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative h-[70vh] rounded-lg overflow-hidden mb-12">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/trendsphere-hero-LUBDqxmFQ7tnbQQbHy8Ue3YNQFQ.jpg"
          alt="TrendSphere Hero"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-start p-8 sm:p-16">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">
            Sustainable Fashion at TrendSphere
          </h1>
          <p className="text-xl sm:text-2xl text-white mb-8">
            Discover eco-friendly styles that make a difference
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Shop Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Product Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Product Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {productCategories.map((category, index) => (
            <Link to="#" key={index} className="group">
              <div className="relative h-60 rounded-lg overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold text-center">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Rated Products */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Top Rated Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {topRated.length > 0 &&
            topRated.map((product, index) => (
              <div key={index} className="group">
                <div className="relative h-72 rounded-lg overflow-hidden mb-2">
                  <img
                    src={product.defaultImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-muted-foreground">
                  ${product.basePrice.toFixed(2)}
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-secondary rounded-lg p-8 mb-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join the TrendSphere Community
          </h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter for sustainable fashion tips and
            exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-grow"
            />
            <Button
              type="submit"
              className="whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Subscribe <Mail className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
