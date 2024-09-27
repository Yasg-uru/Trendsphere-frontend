import { useState, useEffect } from "react";
import { CalendarIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import { useToast } from "@/hooks/use-toast";
import { filtersOrders } from "@/state-manager/slices/orderSlice";
import { OrderQueryParams } from "@/types/ordertypes/initialState";
import { useDebounce } from "@uidotdev/usehooks";
import { useFetcher, useNavigate } from "react-router-dom";
import Loader from "@/helper/Loader";

export default function OrdersAdmin() {
  const [filters, setFilters] = useState<OrderQueryParams>({
    deliveryType: undefined,
    orderStatus: undefined,
    userId: undefined,
    startDate: undefined,
    endDate: undefined,
    productId: undefined,
    page: 1,
    limit: 10,
    searchTerm: undefined,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const { orders, ordersPagination, isLoading } = useAppSelector(
    (state) => state.order
  );
  console.log(
    "this is a orders in for checking whether varianid is exist or not :",
    orders
  );
  useEffect(() => {
    fetchOrders();
  }, [filters]);
  useEffect(() => {
    if (debouncedSearchTerm) {
      handleFilterChange("searchTerm", debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  const fetchOrders = () => {
    dispatch(filtersOrders(filters))
      .then(() => {
        toast({
          title: "Fetched your result successfully",
        });
      })
      .catch((error) => {
        toast({
          title: error,
          variant: "destructive",
        });
      });
  };

  const handleFilterChange = (key: keyof OrderQueryParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
  };
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">TrendSphere Orders</h1>

      {/* Search Input */}
      <div className="flex items-center space-x-2">
        <SearchIcon className="w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by Order ID, Customer Name, or Address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        {/* Status Filter */}
        <div className="flex-1">
          <Label htmlFor="status-filter">Order Status</Label>
          <Select
            value={filters.orderStatus}
            onValueChange={(value) => handleFilterChange("orderStatus", value)}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="return_requested">Return Requested</SelectItem>
              <SelectItem value="replacement_requested">
                Replacement Requested
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="flex-1 space-y-2">
          <Label>Date Range</Label>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[140px] pl-3 text-left font-normal"
                >
                  {filters.startDate
                    ? new Date(filters.startDate).toLocaleDateString()
                    : "Start Date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    filters.startDate ? new Date(filters.startDate) : undefined
                  }
                  onSelect={(date) => handleFilterChange("startDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[140px] pl-3 text-left font-normal"
                >
                  {filters.endDate
                    ? new Date(filters.endDate).toLocaleDateString()
                    : "End Date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    filters.endDate ? new Date(filters.endDate) : undefined
                  }
                  onSelect={(date) => handleFilterChange("endDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Order List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Filtered Orders ({orders.length})
        </h2>
        {orders.map((order) => (
          <div
            key={order._id}
            className="border p-4 rounded-lg shadow"
            onClick={() => navigate(`/orders/details/${order._id}`)}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="font-bold">Order #{order._id}</h3>
                <p>{order.address.name}</p>
                <p className="text-sm text-gray-500">
                  {order.address.city}, {order.address.country}
                </p>
              </div>
              <div className="mt-2 md:mt-0 text-right">
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="font-semibold">${order.finalAmount.toFixed(2)}</p>
                <p className="text-sm">{order.products.length} item(s)</p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  order.orderStatus === "delivered"
                    ? "bg-green-200 text-green-800"
                    : order.orderStatus === "shipped"
                    ? "bg-blue-200 text-blue-800"
                    : order.orderStatus === "processing"
                    ? "bg-yellow-200 text-yellow-800"
                    : order.orderStatus === "cancelled"
                    ? "bg-red-200 text-red-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {order.orderStatus.charAt(0).toUpperCase() +
                  order.orderStatus.slice(1).replace("_", " ")}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  order.payment.paymentStatus === "completed"
                    ? "bg-green-200 text-green-800"
                    : order.payment.paymentStatus === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                Payment:{" "}
                {order.payment.paymentStatus.charAt(0).toUpperCase() +
                  order.payment.paymentStatus.slice(1)}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-200 text-purple-800">
                {order.deliveryType.charAt(0).toUpperCase() +
                  order.deliveryType.slice(1)}{" "}
                Delivery
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {ordersPagination && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button
            onClick={() => handleFilterChange("page", filters.page - 1)}
            disabled={filters.page === 1}
          >
            Previous
          </Button>
          <span className="self-center">
            Page {filters.page} of {ordersPagination.totalPages}
          </span>
          <Button
            onClick={() => handleFilterChange("page", filters.page + 1)}
            disabled={filters.page === ordersPagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
