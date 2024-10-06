import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Moon, Sun, Menu, X, Search, ShoppingCart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import {
  ApplyFilter,
  searchProducts,
} from "@/state-manager/slices/productSlice";
import { useToast } from "@/hooks/use-toast";
import { Logout } from "@/state-manager/slices/authSlice";
import { useDebounce } from "@uidotdev/usehooks";
import { SearchResults } from "../product-pages/searchbar";
import Loader from "@/helper/Loader";
export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { isLoading } = useAppSelector((state) => state.product);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [currentSubCategory, setCurrentSubCategory] = useState<string>("");
  const [currentChildCategory, setCurrentChildCategory] = useState<string>("");
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedsearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedsearchQuery) {
      dispatch(searchProducts(searchQuery))
        .then(() => {
          toast({
            title: "Searched successfully",
          });
        })
        .catch((error) => {
          toast({
            title: error,
          });
        });
    }
  }, [debouncedsearchQuery]);
  const handleClick = () => {
    const params = {
      category: currentCategory,
      subcategory: currentSubCategory,
      childcategory: currentChildCategory,
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
              category: currentCategory,
              subcategory: currentSubCategory,
              childcategory: currentChildCategory,
              fromNavbar: true,
            },
          });
        } else {
          navigate("/products", {
            state: {
              category: currentCategory,
              subcategory: currentSubCategory,
              childcategory: currentChildCategory,
              fromNavbar:true
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

  console.log(
    "states",
    currentCategory +
      "   " +
      currentSubCategory +
      "   " +
      "   " +
      currentChildCategory
  );
  const { categories } = useAppSelector((state) => state.product);
  const { userInfo } = useAppSelector((state) => state.auth);
  const handleCategoryHover = (category: string) => {
    setCurrentCategory(category);
    setCurrentSubCategory("");
    setCurrentChildCategory("");
  };

  const handleSubcategoryHover = (subcategory: string) => {
    setCurrentSubCategory(subcategory);
    setCurrentChildCategory("");
  };

  const handleChildCategoryClick = (childCategory: string) => {
    setCurrentChildCategory(childCategory);
  };
  useEffect(() => {
    if (!currentChildCategory) {
      return;
    }
    handleClick();
  }, [currentChildCategory]);
  const { carts } = useAppSelector((state) => state.auth);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">
                Trendsphere
              </span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="container px-4 md:px-6 py-4">
                <NavigationMenu>
                  <NavigationMenuList>
                    {categories.length > 0 &&
                      categories.map((categoryItem, index) => (
                        <NavigationMenuItem
                          key={index}
                          onMouseEnter={() => {
                            handleCategoryHover(categoryItem.category);
                          }}
                          onClick={handleClick}
                        >
                          <NavigationMenuTrigger>
                            {categoryItem.category}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="cursor-pointer">
                            <div className="grid w-[600px] p-4 gap-4">
                              {categoryItem.subcategories.map(
                                (subcat, subIndex) => (
                                  <div key={subIndex} className="space-y-2">
                                    <NavigationMenuLink
                                      asChild
                                      onMouseEnter={() =>
                                        handleSubcategoryHover(
                                          subcat.subcategory
                                        )
                                      }
                                      onClick={handleClick}
                                    >
                                      <Link
                                        to="#"
                                        className="block text-lg font-semibold text-primary hover:underline"
                                      >
                                        {subcat.subcategory}
                                      </Link>
                                    </NavigationMenuLink>
                                    {subcat.childcategories &&
                                      subcat.childcategories.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2">
                                          {subcat.childcategories.map(
                                            (child, childIndex) => (
                                              <span
                                                key={childIndex}
                                                onClick={() =>
                                                  handleChildCategoryClick(
                                                    child
                                                  )
                                                }
                                                className="text-sm text-muted-foreground hover:text-primary hover:underline cursor-pointer"
                                              >
                                                {child}
                                              </span>
                                            )
                                          )}
                                        </div>
                                      )}
                                  </div>
                                )
                              )}
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {isAuthenticated && (
              <Link to="/mycarts">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {carts && carts?.length > 0 && (
                    <div className="absolute top-0 right-0  flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {carts.length}
                    </div>
                  )}
                  <span className="sr-only">Shopping cart</span>
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            {!isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                className={`font-semibold transition-colors duration-200 dark:text-black dark:bg-white text-white bg-black`}
                onClick={() => {
                  navigate("/sign-in");
                }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {userInfo?.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px]">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {userInfo?.username.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5 leading-none">
                      <div className="font-semibold">{userInfo?.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {userInfo?.email}
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/u/orders" className="flex items-center gap-2">
                      <div className="h-4 w-4" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="#" className="flex items-center gap-2">
                      <div className="h-4 w-4" />
                      <span>Wishlist</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAuthenticated && userInfo?.Role === "admin" && (
                    <DropdownMenuItem>
                      <Link to="#" className="flex items-center gap-2">
                        <div className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAuthenticated && userInfo?.Role === "delivery_boy" && (
                    <DropdownMenuItem>
                      <Link
                        to="/delivery-dashboard"
                        className="flex items-center gap-2"
                      >
                        <div className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      dispatch(Logout())
                        .then(() => {
                          toast({ title: "Logged out successfully" });
                        })
                        .catch((error) => {
                          toast({ title: error, variant: "destructive" });
                        });
                    }}
                  >
                    <Link to="#" className="flex items-center gap-2">
                      <div className="h-4 w-4" />
                      <span>Logout</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Open main menu</span>
            </Button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3"></div>
          <div className="pt-4 pb-3 border-t border-muted">
            <div className="flex items-center px-5">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {isAuthenticated && (
                <Link to="/mycarts">
                  <Button variant="ghost" size="icon" className="ml-4">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="sr-only">Shopping cart</span>
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="ml-4"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`font-semibold transition-colors duration-200 `}
                onClick={() => {
                  navigate("/sign-in");
                }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
      <SearchResults />
    </nav>
  );
}
