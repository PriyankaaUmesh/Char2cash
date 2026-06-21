import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// Legacy redirect — sends users to /register or /login
const SignIn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role");

  useEffect(() => {
    navigate(role ? `/register?role=${role}` : "/register", { replace: true });
  }, []);

  return null;
};

export default SignIn;
