import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Star } from "lucide-react";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import {
  ApplyFilter,
  getcategories,
  getUniqueCategories,
  TopRatedProducts,
} from "@/state-manager/slices/productSlice";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/helper/Loader";

export default function Home() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const {
    topRated = [],
    isLoading,
    MappedCategoriesWithImage = [],
  } = useAppSelector((state) => state.product);
  console.log("this is a mapped categories:", MappedCategoriesWithImage);
  useEffect(() => {
    dispatch(getcategories()).catch((error) => {
      toast({
        title: error,
      });
    });
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
  const navigate = useNavigate();
  const handleClick = (category: string) => {
    const params = {
      category,
    };
    dispatch(ApplyFilter(params))
      .then(() => {
        toast({
          title: "Fetched successfully your results ",
        });
        if (location.pathname === "/products") {
          navigate("/products", {
            replace: true,
            state: {
              category,
              subcategory: "",
              childcategory: "",
              fromNavbar: true,
            },
          });
        } else {
          navigate("/products", {
            state: {
              category,
              subcategory: "",
              childcategory: "",
              fromNavbar: true,
            },
          });
        }
      })
      .catch(() => {
        toast({
          title: "Failed to Fetch results",
        });
      });
  };

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
          {MappedCategoriesWithImage.length > 0 &&
            MappedCategoriesWithImage.map((category, index) => (
              <Link
                to="#"
                key={index}
                className="group"
                onClick={() => handleClick(category.category)}
              >
                <div className="relative h-60 rounded-lg overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-white text-xl font-semibold text-center">
                      {category.category}
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
              <div
                key={index}
                className="group"
                onClick={() =>
                  navigate("/details", { state: { id: product._id } })
                }
              >
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
    </div>
  );
}
