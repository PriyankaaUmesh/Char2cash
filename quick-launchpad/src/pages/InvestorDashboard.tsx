import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Flame, Sprout, Users, Globe, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

const InvestorDashboard = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [residueOrders, setResidueOrders] = useState<any[]>([]);
  const [biocharOrders, setBiocharOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user]);

  useEffect(() => {
    if (user) {
      Promise.all([
        supabase.from("residue_orders").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("biochar_orders").select("*").order("created_at", { ascending: false }).limit(50),
      ]).then(([{ data: r }, { data: b }]) => {
        setResidueOrders(r || []);
        setBiocharOrders(b || []);
      });
    }
  }, [user]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;

  const totalCO2Avoided = residueOrders.reduce((s, o) => s + Number(o.weight_kg) * 1.5, 0); // ~1.5 kg CO2 per kg residue
  const totalCarbonSeq = biocharOrders.reduce((s, o) => s + Number(o.quantity_kg) * 0.8, 0);
  const totalFarmerPayouts = residueOrders.reduce((s, o) => s + Number(o.total_amount), 0);
  const uniqueFarmers = new Set([...residueOrders.map(o => o.farmer_id), ...biocharOrders.map(o => o.farmer_id)]).size;

  const stats = [
    { icon: Flame, value: `${(totalCO2Avoided / 1000).toFixed(1)} tons`, label: "CO₂ Avoided", color: "text-destructive" },
    { icon: Sprout, value: `${(totalCarbonSeq / 1000).toFixed(1)} tons`, label: "Carbon Sequestered", color: "text-primary" },
    { icon: TrendingUp, value: `₹${totalFarmerPayouts.toLocaleString()}`, label: "Farmer Payouts", color: "text-accent" },
    { icon: Users, value: uniqueFarmers, label: "Active Farmers", color: "text-leaf" },
  ];

  const allOrders = [
    ...residueOrders.map(o => ({ ...o, orderType: "Residue Pickup", amount: o.total_amount })),
    ...biocharOrders.map(o => ({ ...o, orderType: "Biochar Purchase", amount: o.total_amount })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Welcome, {profile?.full_name || "Investor"}</h1>
              <p className="text-sm text-muted-foreground">{profile?.organization ? `${profile.designation} at ${profile.organization}` : "Investor Dashboard"}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="h-4 w-4 mr-2" /> Logout</Button>
          </div>

          {/* Impact stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-5">
                <s.icon className={`h-6 w-6 mb-2 ${s.color}`} />
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Read-only transaction history */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">All Transactions (Read-Only)</h2>
            </div>
            {allOrders.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground text-center">No transactions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  </tr></thead>
                  <tbody>
                    {allOrders.map((o) => (
                      <tr key={o.id} className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="p-3 text-foreground">{o.orderType}</td>
                        <td className="p-3 font-semibold text-foreground">₹{Number(o.amount).toLocaleString()}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground capitalize">{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;
