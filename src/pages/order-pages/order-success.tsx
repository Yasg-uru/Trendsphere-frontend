import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-background">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-background rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-8 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            className="flex justify-center mb-6"
          >
            <CheckCircle className="h-20 w-20 text-green-500" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-4"
          >
            Order Successful!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-8"
          >
            Thank you for shopping with Trendsphere. Your order has been placed successfully.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <Button 
              onClick={() => navigate("/u/orders")}
              className="w-full"
              size="lg"
            >
              View Order Details
            </Button>
            <Button 
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Continue Shopping
            </Button>
          </motion.div>
          
         
        </div>
      </motion.div>
    </div>
  );
}