import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail } from "lucide-react";

export default function Home() {
  
  const featuredCategories = [
    {
      name: "Summer Collection",
      image:
        "https://th.bing.com/th/id/OIP.qljFsUWXIAvTwiu1WZUUIwAAAA?rs=1&pid=ImgDetMain",
    },
    {
      name: "Autumn Essentials",
      image:
        "https://th.bing.com/th/id/OIP.GcynwSEKoymbNX3chZXcBQHaLG?rs=1&pid=ImgDetMain",
    },
    {
      name: "Activewear",
      image:
        "https://th.bing.com/th/id/OIP.SQmDj88glDZbWdYnIE_EEAHaJ3?rs=1&pid=ImgDetMain",
    },
    {
      name: "Accessories",
      image:
        "https://th.bing.com/th/id/OIP.cwrtS6a61Sr0AArkdAzazQHaHa?w=800&h=800&rs=1&pid=ImgDetMain",
    },
  ];

  const trendingProducts = [
    {
      name: "Oversized Tee",
      price: 29.99,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Slim Fit Jeans",
      price: 59.99,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Floral Dress",
      price: 49.99,
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Leather Jacket",
      price: 129.99,
      image: "/placeholder.svg?height=300&width=300",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative h-[70vh] rounded-lg overflow-hidden mb-12">
        <img src="" alt="Hero Image" className="brightness-75 " />
        <div className="absolute inset-0 flex flex-col justify-center items-start p-8 sm:p-16">
          <h1 className="text-4xl sm:text-6xl font-bold dark:text-white mb-4">
            Summer Sale is On!
          </h1>
          <p className="text-xl sm:text-2xl dark:text-white mb-8">
            Get up to 50% off on selected items
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200 shadow-2xl shadow-gray-200 border-[0.5px] border-black"
          >
            Shop Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Featured Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {featuredCategories.length > 0 &&
            featuredCategories.map((category, index) => (
              <Link to="#" key={index} className="group">
                <div className="relative h-60 rounded-lg overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="dark:text-white text-xl font-semibold text-center">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {trendingProducts.map((product, index) => (
            <div key={index} className="group">
              <div className="relative h-72 rounded-lg overflow-hidden mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-muted-foreground">
                ${product.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-muted rounded-lg p-8 mb-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter for exclusive deals and style tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-grow"
            />
            <Button type="submit" className="whitespace-nowrap">
              Subscribe <Mail className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
