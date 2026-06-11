import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Briefcase, AlertCircle, Loader2, Sparkles, Building2, Shield, Zap } from "lucide-react";
import { useRegister } from "../hooks/useRegister";
import { useAuth } from "@/shared/context/AuthContext";

const BACKGROUND =
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop";

export default function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        full_name: fullName,
        email,
        password,
        confirm_password: confirmPassword,
      });
      // The new account is logged in immediately; reload so AuthContext
      // re-reads the session cookies and routes into the empty workspace.
      window.location.assign("/");
    } catch (err) {
      setError("Sign up failed. Please check your details and try again.");
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const cardVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0, y: 50 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 30, duration: 0.8 },
    },
  };

  const iconVariants: Variants = {
    initial: { rotate: 0, scale: 1 },
    animate: {
      rotate: [0, -10, 10, -10, 0],
      scale: [1, 1.1, 1.1, 1],
      transition: { duration: 0.6, ease: "easeInOut", delay: 0.4 },
    },
  };

  const buttonVariants: Variants = {
    idle: { scale: 1 },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.5)",
      transition: { type: "spring", stiffness: 500, damping: 15 },
    },
    tap: { scale: 0.98 },
  };

  const errorVariants: Variants = {
    hidden: { opacity: 0, x: -20, height: 0 },
    visible: {
      opacity: 1,
      x: 0,
      height: "auto",
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
    exit: { opacity: 0, x: 20, height: 0, transition: { duration: 0.2 } },
  };

  const inputClass =
    "w-full bg-white/90 backdrop-blur-sm border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300";

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <img src={BACKGROUND} alt="Background" className="w-full h-full object-cover" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </motion.div>

      {/* Floating decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-white/10"
          animate={{ y: [0, 30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Building2 className="w-32 h-32" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-white/10"
          animate={{ y: [0, -30, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <Shield className="w-40 h-40" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/4 text-white/5"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Zap className="w-24 h-24" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={cardVariants}
            className="bg-white/95 rounded-3xl shadow-2xl p-8 space-y-6 border border-white/30"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="space-y-2 text-center">
              <motion.div
                className="flex justify-center mb-4"
                variants={iconVariants}
                initial="initial"
                animate="animate"
              >
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg relative">
                  <Briefcase className="w-10 h-10 text-white" />
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </motion.div>
                </div>
              </motion.div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Create your workspace
              </h1>
              <p className="text-gray-600 font-medium">
                Sign up to start managing your construction projects
              </p>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Builder"
                  className={inputClass}
                  disabled={registerMutation.isPending}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={inputClass}
                  disabled={registerMutation.isPending}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className={inputClass}
                  disabled={registerMutation.isPending}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={inputClass}
                  disabled={registerMutation.isPending}
                />
              </motion.div>

              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial="idle"
                animate="idle"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-xl relative overflow-hidden group shadow-lg"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating account...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Create Account
                      <motion.span
                        animate={{ x: isHovered ? 8 : 0 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        →
                      </motion.span>
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Footer link */}
            <motion.p variants={itemVariants} className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-700">
                Sign in
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
