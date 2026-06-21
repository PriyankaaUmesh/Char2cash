import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Sprout, TrendingUp, Truck, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

type Role = "farmer" | "investor" | "collector";

const roleConfig = {
  farmer: { icon: Sprout, label: "Farmer", color: "text-primary" },
  investor: { icon: TrendingUp, label: "Investor", color: "text-accent" },
  collector: { icon: Truck, label: "Collector", color: "text-leaf" },
};

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get("role") as Role) || null;
  const [selectedRole, setSelectedRole] = useState<Role | null>(initialRole);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    organization: "",
    designation: "",
  });

  const updateForm = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: { emailRedirectTo: window.location.origin },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Registration failed");

      const userId = authData.user.id;

      // Insert profile
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: userId,
        full_name: form.fullName.trim(),
        phone: form.phone.trim() || null,
        organization: form.organization.trim() || null,
        designation: form.designation.trim() || null,
      });
      if (profileError) throw profileError;

      // Insert role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: selectedRole,
      });
      if (roleError) throw roleError;

      toast({ title: "Welcome to Char2Cash!", description: "Account created successfully." });

      // Redirect based on role
      if (selectedRole === "farmer") navigate("/farmer");
      else if (selectedRole === "investor") navigate("/investor");
      else navigate("/collector");
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Leaf className="h-10 w-10 text-primary mx-auto mb-3" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Join Char2Cash</h1>
            <p className="text-muted-foreground">Create your account</p>
          </motion.div>

          {/* Role selection */}
          {!selectedRole && (
            <div className="space-y-3 mb-8">
              <p className="text-sm font-medium text-foreground text-center">I am a...</p>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(roleConfig) as Role[]).map((r) => {
                  const cfg = roleConfig[r];
                  return (
                    <button
                      key={r}
                      onClick={() => setSelectedRole(r)}
                      className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary transition-colors"
                    >
                      <cfg.icon className={`h-8 w-8 mx-auto mb-2 ${cfg.color}`} />
                      <span className="text-sm font-medium text-foreground">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Registration form */}
          {selectedRole && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleRegister}
              className="bg-card border border-border rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary capitalize">{selectedRole} Registration</span>
                <button type="button" onClick={() => setSelectedRole(null)} className="text-xs text-muted-foreground hover:text-foreground">
                  Change role
                </button>
              </div>

              <div>
                <Label htmlFor="fullName">Full Name (as per Aadhaar) *</Label>
                <Input id="fullName" value={form.fullName} onChange={(e) => updateForm("fullName", e.target.value)} required maxLength={100} />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" maxLength={15} />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} required maxLength={255} />
              </div>

              {selectedRole === "investor" && (
                <>
                  <div>
                    <Label htmlFor="organization">Organisation *</Label>
                    <Input id="organization" value={form.organization} onChange={(e) => updateForm("organization", e.target.value)} required maxLength={200} />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation *</Label>
                    <Input id="designation" value={form.designation} onChange={(e) => updateForm("designation", e.target.value)} required maxLength={100} />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" value={form.password} onChange={(e) => updateForm("password", e.target.value)} required minLength={6} maxLength={72} />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Register"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <a href="/login" className="text-primary hover:underline">Login</a>
              </p>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
