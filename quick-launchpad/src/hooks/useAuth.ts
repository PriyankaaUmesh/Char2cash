import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // Fetch role
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", currentUser.id)
            .limit(1);
          setRole(roles?.[0]?.role ?? null);

          // Fetch profile
          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", currentUser.id)
            .limit(1);
          setProfile(prof?.[0] ?? null);
        } else {
          setRole(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setProfile(null);
  };

  return { user, role, profile, loading, signOut };
}
