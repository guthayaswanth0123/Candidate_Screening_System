import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, LogIn, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const navigate = useNavigate();

  const validateForm = () => {

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {

      const fieldErrors: { email?: string; password?: string } = {};

      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {

      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      /* ✅ SAVE USER SESSION */
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Welcome back!");

      /* ✅ REDIRECT TO DASHBOARD */
      navigate("/", { replace: true });

    } catch (error: any) {

      toast.error(error.message || "Failed to sign in");

    }

    setLoading(false);

  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >

        {/* Logo */}
        <div className="text-center mb-8">

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4"
          >
            <FileSearch className="h-8 w-8 text-primary" />
          </motion.div>

          <h1 className="text-2xl font-bold text-foreground">
            AI Candidate Screening System
          </h1>

          <p className="text-muted-foreground mt-1">
            Intelligent Resume Analysis
          </p>

        </div>


        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95">

          <CardHeader className="space-y-1 text-center">

            <CardTitle className="text-2xl font-bold">
              Welcome Back
            </CardTitle>

            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>

          </CardHeader>


          <form onSubmit={handleSubmit}>

            <CardContent className="space-y-4">

              {/* EMAIL */}
              <div className="space-y-2">

                <label className="text-sm font-medium text-foreground">
                  Email Address
                </label>

                <div className="relative">

                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />

                </div>

                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}

              </div>


              {/* PASSWORD */}
              <div className="space-y-2">

                <label className="text-sm font-medium text-foreground">
                  Password
                </label>

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                </div>

                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}

              </div>

            </CardContent>


            <CardFooter className="flex flex-col gap-4">

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Create Account
                </Link>
              </p>

            </CardFooter>

          </form>

        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} AI Candidate Screening System
        </p>

      </motion.div>

    </div>
  );

};

export default Login;