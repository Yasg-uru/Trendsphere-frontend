import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import {
  ApplyFilter,
  getcategories,
} from "@/state-manager/slices/productSlice";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/helper/Loader";
import { Typewriter } from "react-simple-typewriter";
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
    // dispatch(TopRatedProducts())
    //   .unwrap()
    //   .then(() => {
    //     toast({
    //       title: "top rated products fetched successfully",
    //     });
    //   })
    //   .catch((error) => {
    //     toast({
    //       title: error,
    //     });
    //   });
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
  {/* Background Image with Dark Overlay */}
  <div className="absolute inset-0 h-full w-full">
    <img
      src="https://yt3.googleusercontent.com/c0z5L6YvoxxXjPBqNh_RZToQ55nR8HYC-YDK0R8t3gP0M7_aaMYivmlB1J12PtVlD_Zfuru3wg=s900-c-k-c0x00ffffff-no-rj"
      alt="TrendSphere Hero"
      className="w-full h-full object-cover brightness-50"
    />
    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
  </div>

  {/* Text Content */}
  <div className="absolute inset-0 flex flex-col justify-center items-start p-8 sm:p-16 text-white">
    <h1 className="text-4xl sm:text-6xl font-bold mb-4">
      <Typewriter
        words={[
          "Sustainable Fashion at TrendSphere",
          "Eco-Friendly & Stylish",
          "Redefining Fashion Trends",
        ]}
        loop
        cursor
        cursorStyle="_"
        typeSpeed={50}
        deleteSpeed={40}
        delaySpeed={1500}
      />
    </h1>
    <p className="text-xl sm:text-2xl mb-8 text-gray-300">
      Discover eco-friendly styles that make a difference.
    </p>
    <Button
      size="lg"
      className="bg-[#8402e7] text-white hover:bg-[#6a02b4] transition-all"
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h3 className="dark:text-white text-xl font-semibold text-center">
                      {category.category}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
