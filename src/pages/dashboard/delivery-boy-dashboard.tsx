import  { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Activity,
  Package,
  TrendingUp,
  DollarSign,
  MapPin,
 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/state-manager/hook";
import {
  getdeliveryOntimeRate,
  GetMyDeliveries,
  getMyEarnings,
  getRatings,
  getWeeklyDeliveryReport,
} from "@/state-manager/slices/deliverySlice";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/helper/Loader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DeliveryBoyDashboard() {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    mydeliveries: {
      pendingOrders,
      deliveryCounts: { completed, pending },
    },
    weeklyDataLoading,
    WeeklyData,
    deliveryPerformanceData,
    Ratings,
    Earnings,
  } = useAppSelector((state) => state.delivery);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(GetMyDeliveries())
      .unwrap()
      .then(() => {
        toast({
          title: "Fetched your deliveries successfully",
        });
      })
      .catch((error) => {
        toast({
          title: error,
        });
      });
    dispatch(getWeeklyDeliveryReport())
      .unwrap()
      .then(() => {
        toast({
          title: "Fetched successfully weekly details",
        });
      })
      .catch((error) => {
        toast({
          title: error,
        });
      });
    dispatch(getdeliveryOntimeRate())
      .unwrap()
      .then(() => {
        toast({
          title: "successfully fetched delivery on time rates ",
        });
      })
      .catch((error) => {
        toast({
          title: error,
        });
      });
    dispatch(getRatings());
    dispatch(getMyEarnings());
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-background shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold ">Delivery Dashboard</h1>
        </div>
        <nav className="mt-6">
          <a className="flex items-center py-2 px-4 bg-background " href="#">
            <Activity className="mr-3 h-5 w-5" />
            Dashboard
          </a>
          <Link
            className="flex items-center mt-2 py-2 px-4  hover:bg-background"
            to="/orders"
          >
            <Package className="mr-3 h-5 w-5" />
            My Deliveries
          </Link>
          <a
            className="flex items-center mt-2 py-2 px-4  hover:bg-background"
            href="#"
          >
            <MapPin className="mr-3 h-5 w-5" />
            Route Planner
          </a>
          <a
            className="flex items-center mt-2 py-2 px-4  hover:bg-background"
            href="#"
          >
            <TrendingUp className="mr-3 h-5 w-5" />
            Performance
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Deliveries
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completed + pending}</div>
                <p className="text-xs text-muted-foreground">
                  {pending} pending, {completed} completed
                </p>
              </CardContent>
            </Card>
            {deliveryPerformanceData && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    On-Time Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {deliveryPerformanceData.onTimePercentage}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {deliveryPerformanceData.message}
                  </p>
                </CardContent>
              </Card>
            )}
            {Ratings && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Customer Rating
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Ratings.averageRating}/5
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on {Ratings.totalReviews} reviews
                  </p>
                </CardContent>
              </Card>
            )}
            {Earnings && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Earnings
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${Earnings.TotalEarnings}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Earnings.yesterdayEarnings >= 0
                      ? `+${Earnings.yesterdayEarnings} `
                      : `-${Earnings.yesterdayEarnings} `}
                    from yesterday
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Delivery Performance Chart */}
          <Card className="mt-5">
            <CardHeader>
              <CardTitle>Weekly Delivery Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {!weeklyDataLoading && <Bar data={WeeklyData} />}
            </CardContent>
          </Card>

          {/* Upcoming Deliveries */}
          <Card className="mt-5">
            <CardHeader>
              <CardTitle>Upcoming Deliveries</CardTitle>
              <CardDescription>
                You have {pending} pending deliveries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order._id}</TableCell>
                      <TableCell>{order.address.name}</TableCell>
                      <TableCell>
                        {`${order.address.addressLine1}, ${order.address.city}, ${order.address.state}, ${order.address.country}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {order.orderStatus.charAt(0).toUpperCase() +
                            order.orderStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Start Delivery
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
