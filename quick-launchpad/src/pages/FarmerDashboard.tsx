import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sprout, Flame, Wallet, ShoppingCart, History, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

// Pricing constants
const RESIDUE_PRICES = { dry: 4, wet: 2 }; // ₹/kg
const BIOCHAR_TIERS = [
  { label: "Standard (50% Carbon)", carbon: 50, price: 10 },
  { label: "Premium (65% Carbon)", carbon: 65, price: 14 },
  { label: "Ultra (80% Carbon)", carbon: 80, price: 18 },
];

const FarmerDashboard = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sell residue state
  const [residueType, setResidueType] = useState<"dry" | "wet">("dry");
  const [weightKg, setWeightKg] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [sellLoading, setSellLoading] = useState(false);

  // Buy biochar state
  const [soilType, setSoilType] = useState("");
  const [areaAcres, setAreaAcres] = useState("");
  const [currentCrop, setCurrentCrop] = useState("");
  const [plannedCrop, setPlannedCrop] = useState("");
  const [biocharTier, setBiocharTier] = useState(0);
  const [biocharQty, setBiocharQty] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [buyLoading, setBuyLoading] = useState(false);

  // Transaction history
  const [residueOrders, setResidueOrders] = useState<any[]>([]);
  const [biocharOrders, setBiocharOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    const [{ data: r }, { data: b }] = await Promise.all([
      supabase.from("residue_orders").select("*").eq("farmer_id", user!.id).order("created_at", { ascending: false }),
      supabase.from("biochar_orders").select("*").eq("farmer_id", user!.id).order("created_at", { ascending: false }),
    ]);
    setResidueOrders(r || []);
    setBiocharOrders(b || []);
  };

  const handleSellResidue = async (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weightKg);
    if (!w || w <= 0) {
      toast({ title: "Error", description: "Enter a valid weight.", variant: "destructive" });
      return;
    }
    setSellLoading(true);
    const pricePerKg = RESIDUE_PRICES[residueType];
    const totalAmount = w * pricePerKg;

    const { error } = await supabase.from("residue_orders").insert({
      farmer_id: user!.id,
      residue_type: residueType,
      weight_kg: w,
      price_per_kg: pricePerKg,
      total_amount: totalAmount,
      pickup_location: pickupLocation.trim() || null,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Order placed!", description: `₹${totalAmount.toLocaleString()} for ${w} kg ${residueType} residue.` });
      setWeightKg("");
      setPickupLocation("");
      fetchOrders();
    }
    setSellLoading(false);
  };

  const handleBuyBiochar = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(biocharQty);
    if (!qty || qty <= 0 || !soilType) {
      toast({ title: "Error", description: "Fill all required fields.", variant: "destructive" });
      return;
    }
    setBuyLoading(true);
    const tier = BIOCHAR_TIERS[biocharTier];
    const totalAmount = qty * tier.price;

    const { error } = await supabase.from("biochar_orders").insert({
      farmer_id: user!.id,
      soil_type: soilType,
      area_acres: parseFloat(areaAcres) || 0,
      current_crop: currentCrop.trim() || null,
      planned_crop: plannedCrop.trim() || null,
      quantity_kg: qty,
      carbon_content_percent: tier.carbon,
      price_per_kg: tier.price,
      total_amount: totalAmount,
      delivery_location: deliveryLocation.trim() || null,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Order placed!", description: `₹${totalAmount.toLocaleString()} for ${qty} kg biochar.` });
      setBiocharQty("");
      setDeliveryLocation("");
      fetchOrders();
    }
    setBuyLoading(false);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;

  const totalResidueIncome = residueOrders.reduce((s, o) => s + Number(o.total_amount), 0);
  const totalBiocharSpent = biocharOrders.reduce((s, o) => s + Number(o.total_amount), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Welcome, {profile?.full_name || "Farmer"}</h1>
              <p className="text-sm text-muted-foreground">Farmer Dashboard</p>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="h-4 w-4 mr-2" /> Logout</Button>
          </div>

          {/* Wallet summary */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
              <Wallet className="h-6 w-6 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">₹{totalResidueIncome.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Residue Income</p>
            </div>
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-5">
              <ShoppingCart className="h-6 w-6 text-accent mb-2" />
              <p className="text-2xl font-bold text-foreground">₹{totalBiocharSpent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Biochar Spent</p>
            </div>
          </div>

          <Tabs defaultValue="sell" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sell"><Flame className="h-4 w-4 mr-1" /> Sell Residue</TabsTrigger>
              <TabsTrigger value="buy"><Sprout className="h-4 w-4 mr-1" /> Buy Biochar</TabsTrigger>
              <TabsTrigger value="history"><History className="h-4 w-4 mr-1" /> History</TabsTrigger>
            </TabsList>

            {/* SELL RESIDUE */}
            <TabsContent value="sell">
              <form onSubmit={handleSellResidue} className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h2 className="font-display text-lg font-semibold text-foreground">Sell Crop Residue</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Residue Type</Label>
                    <Select value={residueType} onValueChange={(v) => setResidueType(v as "dry" | "wet")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dry">Dry Residue (₹4/kg)</SelectItem>
                        <SelectItem value="wet">Wet Residue (₹2/kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input id="weight" type="number" min="1" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} required />
                  </div>
                </div>

                {weightKg && parseFloat(weightKg) > 0 && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Estimated payout:</p>
                    <p className="text-2xl font-bold text-primary">₹{(parseFloat(weightKg) * RESIDUE_PRICES[residueType]).toLocaleString()}</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="pickupLoc">Pickup Location</Label>
                  <Input id="pickupLoc" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder="Village, District" maxLength={200} />
                </div>

                <Button type="submit" disabled={sellLoading} className="w-full">
                  {sellLoading ? "Placing order..." : "Request Pickup"}
                </Button>
              </form>
            </TabsContent>

            {/* BUY BIOCHAR */}
            <TabsContent value="buy">
              <form onSubmit={handleBuyBiochar} className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h2 className="font-display text-lg font-semibold text-foreground">Buy Biochar</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Soil Type *</Label>
                    <Select value={soilType} onValueChange={setSoilType}>
                      <SelectTrigger><SelectValue placeholder="Select soil" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alluvial">Alluvial</SelectItem>
                        <SelectItem value="black">Black (Regur)</SelectItem>
                        <SelectItem value="red">Red Soil</SelectItem>
                        <SelectItem value="laterite">Laterite</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="clay">Clay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="area">Area (acres)</Label>
                    <Input id="area" type="number" min="0.1" step="0.1" value={areaAcres} onChange={(e) => setAreaAcres(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentCrop">Current Crop</Label>
                    <Input id="currentCrop" value={currentCrop} onChange={(e) => setCurrentCrop(e.target.value)} placeholder="e.g. Paddy" maxLength={100} />
                  </div>
                  <div>
                    <Label htmlFor="plannedCrop">Next Crop</Label>
                    <Input id="plannedCrop" value={plannedCrop} onChange={(e) => setPlannedCrop(e.target.value)} placeholder="e.g. Wheat" maxLength={100} />
                  </div>
                </div>

                <div>
                  <Label>Biochar Grade</Label>
                  <Select value={String(biocharTier)} onValueChange={(v) => setBiocharTier(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BIOCHAR_TIERS.map((t, i) => (
                        <SelectItem key={i} value={String(i)}>{t.label} — ₹{t.price}/kg</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {areaAcres && parseFloat(areaAcres) > 0 && (
                  <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                    💡 Recommendation: ~{Math.ceil(parseFloat(areaAcres) * 3)} kg of biochar for {areaAcres} acres (approx 3 kg/acre).
                  </p>
                )}

                <div>
                  <Label htmlFor="biocharQty">Quantity (kg) *</Label>
                  <Input id="biocharQty" type="number" min="1" step="0.5" value={biocharQty} onChange={(e) => setBiocharQty(e.target.value)} required />
                </div>

                {biocharQty && parseFloat(biocharQty) > 0 && (
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Total cost:</p>
                    <p className="text-2xl font-bold text-accent">₹{(parseFloat(biocharQty) * BIOCHAR_TIERS[biocharTier].price).toLocaleString()}</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="deliveryLoc">Delivery Location</Label>
                  <Input id="deliveryLoc" value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} placeholder="Village, District" maxLength={200} />
                </div>

                <Button type="submit" disabled={buyLoading} className="w-full">
                  {buyLoading ? "Placing order..." : "Order Biochar"}
                </Button>
              </form>
            </TabsContent>

            {/* HISTORY */}
            <TabsContent value="history">
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <h3 className="font-display text-sm font-semibold text-foreground p-4 border-b border-border bg-muted/30">Residue Sales</h3>
                  {residueOrders.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">No residue orders yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-border">
                          <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Weight</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                        </tr></thead>
                        <tbody>
                          {residueOrders.map((o) => (
                            <tr key={o.id} className="border-b border-border/50">
                              <td className="p-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                              <td className="p-3 text-foreground capitalize">{o.residue_type}</td>
                              <td className="p-3 text-foreground">{o.weight_kg} kg</td>
                              <td className="p-3 font-semibold text-primary">₹{Number(o.total_amount).toLocaleString()}</td>
                              <td className="p-3"><span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground capitalize">{o.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <h3 className="font-display text-sm font-semibold text-foreground p-4 border-b border-border bg-muted/30">Biochar Purchases</h3>
                  {biocharOrders.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">No biochar orders yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-border">
                          <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Grade</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Qty</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                        </tr></thead>
                        <tbody>
                          {biocharOrders.map((o) => (
                            <tr key={o.id} className="border-b border-border/50">
                              <td className="p-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                              <td className="p-3 text-foreground">{o.carbon_content_percent}% Carbon</td>
                              <td className="p-3 text-foreground">{o.quantity_kg} kg</td>
                              <td className="p-3 font-semibold text-accent">₹{Number(o.total_amount).toLocaleString()}</td>
                              <td className="p-3"><span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground capitalize">{o.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
