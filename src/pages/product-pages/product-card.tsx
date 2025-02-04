import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Star, CheckCircle, XCircle } from "lucide-react";
import { IProductFrontend } from "@/types/productState/product.type";

const ProductCard: React.FunctionComponent<{ product: IProductFrontend }> = ({ product }) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 400, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 400, damping: 30 });
  const scale = useSpring(isHovered ? 1.05 : 1, { stiffness: 300, damping: 20 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;

    setMousePosition({ x: relativeX, y: relativeY });
    x.set(relativeX / rect.width - 0.5);
    y.set(relativeY / rect.height - 0.5);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 2000 }}
      className="relative cursor-pointer"
      onClick={() => navigate("/details", { state: { id: product._id } })}
    >
      
      <motion.div
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        className="relative will-change-transform"
      >
       <Card className="relative dark:bg-black backdrop-blur-md border border-gray-800 hover:border-blue-500/50 transition-all duration-300 overflow-hidden w-full max-w-md px-5">

        <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `
              radial-gradient(
                800px circle at ${mousePosition.x}px ${mousePosition.y}px,
                rgba(29, 78, 216, 0.15),
                transparent 40%
              )
            `,
            }}
          />
        )}
      </AnimatePresence>

          <CardHeader className="p-0 relative">
            <motion.img
              src={product.defaultImage}
              alt={product.name}
              className="w-full h-64 object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
          </CardHeader>

          <CardContent className="p-4">
            <CardTitle className="text-white text-2xl font-semibold">{product.name}</CardTitle>
            <p className="text-gray-300 text-sm">
              <span className="font-semibold">Brand:</span> {product.brand}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="font-semibold">Category:</span> {product.category} › {product.subcategory}
            </p>

            <div className="flex items-center my-2">
              <p className="font-bold text-xl text-yellow-400">${product.basePrice.toFixed(2)}</p>
              {product.discount && (
                <span className="ml-3 bg-red-500 text-white px-2 py-1 rounded text-sm">
                  {product.discount.discountPercentage}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center mb-2">
              {product.available ? (
                <CheckCircle className="text-green-400 w-5 h-5 mr-1" />
              ) : (
                <XCircle className="text-red-400 w-5 h-5 mr-1" />
              )}
              <span className="text-sm">{product.available ? "In Stock" : "Out of Stock"} ({product.overallStock} left)</span>
            </div>

            <p className="text-sm text-gray-400">
              <span className="font-semibold">Materials:</span> {product.materials.join(", ")}
            </p>

            <ul className="text-sm text-gray-400 list-disc pl-5 mt-2">
              {product.highlights.slice(0, 3).map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="p-4 flex justify-between items-center border-t border-gray-800/50">
            <div className="flex items-center">
              <span className="text-sm mr-2">Rating:</span>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < product.rating ? "text-yellow-400 fill-current" : "text-gray-500"}`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-400">{product.loyalityPoints} Loyalty Points</p>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
