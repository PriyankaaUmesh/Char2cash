import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({ title: "Error", description: "Please fill all fields.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      // Get user role to redirect
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .limit(1);

      const role = roles?.[0]?.role;
      toast({ title: "Welcome back!", description: "Login successful." });

      if (role === "farmer") navigate("/farmer");
      else if (role === "investor") navigate("/investor");
      else if (role === "collector") navigate("/collector");
      else navigate("/");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
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
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Login to Char2Cash</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleLogin}
            className="bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <div>
              <Label htmlFor="email">Email / Phone Number</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="/register" className="text-primary hover:underline">Register</a>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Login;
