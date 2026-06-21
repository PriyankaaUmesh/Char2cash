import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, Package, MapPin, CheckCircle, LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const CollectorDashboard = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pickupOrders, setPickupOrders] = useState<any[]>([]);
  const [deliveryOrders, setDeliveryOrders] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    const [{ data: pickups }, { data: deliveries }] = await Promise.all([
      supabase.from("residue_orders").select("*").order("created_at", { ascending: false }),
      supabase.from("biochar_orders").select("*").order("created_at", { ascending: false }),
    ]);
    setPickupOrders(pickups || []);
    setDeliveryOrders(deliveries || []);

    // Fetch farmer profiles
    const farmerIds = new Set([
      ...(pickups || []).map((o: any) => o.farmer_id),
      ...(deliveries || []).map((o: any) => o.farmer_id),
    ]);
    if (farmerIds.size > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, full_name, phone")
        .in("user_id", Array.from(farmerIds));
      const map: Record<string, any> = {};
      profs?.forEach((p: any) => { map[p.user_id] = p; });
      setProfiles(map);
    }
  };

  const acceptOrder = async (type: "pickup" | "delivery", orderId: string) => {
    const table = type === "pickup" ? "residue_orders" : "biochar_orders";
    const { error } = await supabase
      .from(table)
      .update({ collector_id: user!.id, status: "assigned" })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Accepted!", description: `Order ${type} assigned to you.` });
      fetchOrders();
    }
  };

  const completeOrder = async (type: "pickup" | "delivery", orderId: string) => {
    const table = type === "pickup" ? "residue_orders" : "biochar_orders";
    const { error } = await supabase
      .from(table)
      .update({ status: type === "pickup" ? "collected" : "delivered" })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Completed!", description: "Order marked as complete." });
      fetchOrders();
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;

  const pendingPickups = pickupOrders.filter(o => o.status === "pending");
  const myPickups = pickupOrders.filter(o => o.collector_id === user?.id);
  const pendingDeliveries = deliveryOrders.filter(o => o.status === "pending");
  const myDeliveries = deliveryOrders.filter(o => o.collector_id === user?.id);

  const OrderCard = ({ order, type, isMine }: { order: any; type: "pickup" | "delivery"; isMine: boolean }) => {
    const farmer = profiles[order.farmer_id];
    return (
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-foreground">{farmer?.full_name || "Farmer"}</p>
            {farmer?.phone && <p className="text-xs text-muted-foreground">{farmer.phone}</p>}
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
            order.status === "assigned" ? "bg-blue-100 text-blue-800" :
            "bg-green-100 text-green-800"
          } capitalize`}>{order.status}</span>
        </div>

        {type === "pickup" ? (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Type: <span className="text-foreground capitalize">{order.residue_type}</span> residue</p>
            <p>Weight: <span className="text-foreground">{order.weight_kg} kg</span></p>
            <p>Payout: <span className="text-primary font-semibold">₹{Number(order.total_amount).toLocaleString()}</span></p>
            {order.pickup_location && <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.pickup_location}</p>}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Biochar: <span className="text-foreground">{order.quantity_kg} kg ({order.carbon_content_percent}% carbon)</span></p>
            <p>Amount: <span className="text-accent font-semibold">₹{Number(order.total_amount).toLocaleString()}</span></p>
            {order.delivery_location && <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.delivery_location}</p>}
          </div>
        )}

        <div className="flex gap-2">
          {!isMine && order.status === "pending" && (
            <Button size="sm" onClick={() => acceptOrder(type, order.id)}>Accept</Button>
          )}
          {isMine && order.status === "assigned" && (
            <Button size="sm" variant="outline" onClick={() => completeOrder(type, order.id)}>
              <CheckCircle className="h-4 w-4 mr-1" /> Mark Complete
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Welcome, {profile?.full_name || "Collector"}</h1>
              <p className="text-sm text-muted-foreground">Collector Dashboard</p>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="h-4 w-4 mr-2" /> Logout</Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <Clock className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{pendingPickups.length}</p>
              <p className="text-xs text-muted-foreground">Pending Pickups</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <Truck className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{myPickups.filter(o => o.status === "assigned").length}</p>
              <p className="text-xs text-muted-foreground">My Pickups</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <Package className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{pendingDeliveries.length}</p>
              <p className="text-xs text-muted-foreground">Pending Deliveries</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{myPickups.filter(o => ["collected","delivered"].includes(o.status)).length + myDeliveries.filter(o => o.status === "delivered").length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>

          <Tabs defaultValue="pickups" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pickups"><Truck className="h-4 w-4 mr-1" /> Residue Pickups</TabsTrigger>
              <TabsTrigger value="deliveries"><Package className="h-4 w-4 mr-1" /> Biochar Deliveries</TabsTrigger>
            </TabsList>

            <TabsContent value="pickups">
              <div className="space-y-3">
                {pendingPickups.length === 0 && myPickups.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pickup orders available.</p>
                ) : (
                  <>
                    {pendingPickups.length > 0 && <h3 className="text-sm font-semibold text-muted-foreground">Available Pickups</h3>}
                    {pendingPickups.map(o => <OrderCard key={o.id} order={o} type="pickup" isMine={false} />)}
                    {myPickups.length > 0 && <h3 className="text-sm font-semibold text-muted-foreground mt-4">My Pickups</h3>}
                    {myPickups.map(o => <OrderCard key={o.id} order={o} type="pickup" isMine={true} />)}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="deliveries">
              <div className="space-y-3">
                {pendingDeliveries.length === 0 && myDeliveries.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No delivery orders available.</p>
                ) : (
                  <>
                    {pendingDeliveries.length > 0 && <h3 className="text-sm font-semibold text-muted-foreground">Available Deliveries</h3>}
                    {pendingDeliveries.map(o => <OrderCard key={o.id} order={o} type="delivery" isMine={false} />)}
                    {myDeliveries.length > 0 && <h3 className="text-sm font-semibold text-muted-foreground mt-4">My Deliveries</h3>}
                    {myDeliveries.map(o => <OrderCard key={o.id} order={o} type="delivery" isMine={true} />)}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CollectorDashboard;
