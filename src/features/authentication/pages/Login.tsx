import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, AlertCircle, Loader2, Sparkles, CheckCircle2, Building2, Shield, Zap } from "lucide-react";
import { useLogin } from "../index";
import { useAuth } from "@/context/AuthContext";

// Background options - choose your preferred one
const BACKGROUNDS = {
  // Option 1: Construction Site GIF (Recommended)
  construction: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHp0c3MwY3c0dXJ4b3ZkNjNlYzZ6b2Z5cWZ6bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bGZ5bG9iYW5hbmEifQ",

  // Option 2: Modern Office Building
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop",

  // Option 3: Construction Worker Silhouette (Cinematic)
  constructionCinematic: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop",

  // Option 4: Blueprint/Technical Background
  blueprint: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2070&auto=format&fit=crop",

  // Option 5: Animated Gradient (alternative if no external images)
  gradient: "gradient"
};

export default function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState(BACKGROUNDS.constructionCinematic);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      window.location.reload();
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 50 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.8,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 30px 60px -20px rgba(0,0,0,0.4)",
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    animate: {
      rotate: [0, -10, 10, -10, 0],
      scale: [1, 1.1, 1.1, 1],
      transition: { duration: 0.6, ease: "easeInOut", delay: 0.5 },
    },
    hover: {
      scale: 1.15,
      rotate: 5,
      transition: { type: "spring", stiffness: 500 },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.5)",
      transition: { type: "spring", stiffness: 500, damping: 15 },
    },
    tap: { scale: 0.98 },
  };

  const errorVariants = {
    hidden: { opacity: 0, x: -20, height: 0 },
    visible: {
      opacity: 1,
      x: 0,
      height: "auto",
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
    exit: {
      opacity: 0,
      x: 20,
      height: 0,
      transition: { duration: 0.2 },
    },
  };

  const loadingCircleVariants = {
    spin: {
      rotate: 360,
      transition: { repeat: Infinity, duration: 1, ease: "linear" },
    },
  };

  // For gradient background
  const gradientBackground = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      {backgroundImage !== BACKGROUNDS.gradient ? (
        <>
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <img
              src={backgroundImage}
              alt="Background"
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
            />
            {/* Animated Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Animated Particles Over Background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            background: [
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "linear-gradient(135deg, #764ba2 0%, #f093fb 100%)",
              "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={gradientBackground}
        />
      )}

      {/* Floating Elements for Construction Theme */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-white/10"
          animate={{
            y: [0, 30, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Building2 className="w-32 h-32" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-white/10"
          animate={{
            y: [0, -30, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <Shield className="w-40 h-40" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/4 text-white/5"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Zap className="w-24 h-24" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/30"
          >
            {/* Header with Construction Badge */}
            <motion.div variants={itemVariants} className="space-y-2 text-center">
              <motion.div
                className="flex justify-center mb-4"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
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

              <motion.h1
                className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% auto" }}
              >
                CMS
              </motion.h1>
              <p className="text-gray-600 font-medium">Construction Management System</p>

            </motion.div>

            {/* Error Alert */}
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
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="admin@buildcms.com"
                  className="w-full bg-white/90 backdrop-blur-sm border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300"
                  disabled={loginMutation.isPending}
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
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  className="w-full bg-white/90 backdrop-blur-sm border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300"
                  disabled={loginMutation.isPending}
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                initial="idle"
                animate="idle"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-xl relative overflow-hidden group shadow-lg"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <motion.div className="flex items-center justify-center gap-2">
                      <motion.div variants={loadingCircleVariants} animate="spin">
                        <Loader2 className="w-5 h-5" />
                      </motion.div>
                      <span>Authenticating...</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      className="flex items-center justify-center gap-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Access Dashboard
                      <motion.span
                        animate={{ x: isHovered ? 8 : 0 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        →
                      </motion.span>
                    </motion.span>
                  )}
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </Button>
              </motion.div>
            </form>


            {/* Success Animation */}
            <AnimatePresence>
              {loginMutation.isSuccess && (
                <motion.div
                  className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-3xl flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="text-center"
                  >
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-gray-800 font-semibold"
                    >
                      Login Successful!
                    </motion.p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Image Selector (Optional - for demo) */}
      <div className="fixed bottom-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => setBackgroundImage(BACKGROUNDS.constructionCinematic)}
          className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-all"
          title="Construction Background"
        />
        <button
          onClick={() => setBackgroundImage(BACKGROUNDS.office)}
          className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-all"
          title="Office Background"
        />
        <button
          onClick={() => setBackgroundImage(BACKGROUNDS.blueprint)}
          className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-all"
          title="Gradient Background"
        />
      </div>
    </div>
  );
}