"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Leaf,
  TrendingUp,
  Mail,
  Rocket,
  Globe,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Header scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close mobile menu when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = () => setIsMobileMenuOpen(false);
    const handleScroll = () => setIsMobileMenuOpen(false);

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileMenuOpen]);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Message sent successfully!", {
          description:
            "Thank you for your interest. We'll get back to you soon.",
        });
        form.reset();
      } else {
        toast.error("Failed to send message", {
          description: data.error || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="min-h-screen bg-gradient-to-br from-background via-accent to-secondary">
        {/* Header */}
        <header
          className={`bg-card/90 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-lg shadow-primary/5 transition-transform duration-300 ease-in-out ${
            isHeaderVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative">
                  <Image
                    src="/albertaAI.webp"
                    alt="Alberta AI"
                    width={48}
                    height={48}
                  />

                  <motion.div
                    className="absolute inset-0 h-9 w-9 bg-primary/20 rounded-full blur-lg"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Alberta AI
                  </h1>
                  <div className="text-xs text-muted-foreground font-medium">
                    Fueling the Future of Innovation in Alberta
                  </div>
                </div>
              </motion.div>

              {/* Desktop Navigation */}
              <motion.nav
                className="hidden md:flex space-x-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <button
                  onClick={() => scrollToSection("about")}
                  className="relative group text-muted-foreground hover:text-primary transition-all duration-300 font-medium"
                >
                  About
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button
                  onClick={() => scrollToSection("findings")}
                  className="relative group text-muted-foreground hover:text-primary transition-all duration-300 font-medium"
                >
                  Key Findings
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button
                  onClick={() => scrollToSection("authors")}
                  className="relative group text-muted-foreground hover:text-primary transition-all duration-300 font-medium"
                >
                  Authors
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="relative group text-muted-foreground hover:text-primary transition-all duration-300 font-medium"
                >
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </button>
              </motion.nav>

              {/* Mobile Menu Button */}
              <motion.button
                className="md:hidden relative z-50 p-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6 text-foreground" />
                  ) : (
                    <Menu className="h-6 w-6 text-foreground" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Mobile Menu */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed top-20 left-4 right-4 bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl z-50 md:hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.nav
                  className="p-6"
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="flex flex-col space-y-3">
                    {[
                      { label: "About", id: "about" },
                      { label: "Key Findings", id: "findings" },
                      { label: "Authors", id: "authors" },
                      { label: "Contact", id: "contact" },
                    ].map((item, index) => (
                      <motion.button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="group text-left py-4 px-5 rounded-xl bg-background/50 hover:bg-background/80 border border-border/30 hover:border-primary/30 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.15 + index * 0.05,
                        }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                          {item.label}
                        </span>
                        <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-300 mt-2"></div>
                      </motion.button>
                    ))}
                  </div>
                </motion.nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <section
          className="h-screen px-8 relative overflow-hidden flex items-center"
          style={{ height: "calc(100vh - 80px)" }}
        >
          {/* Curved Element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 300 150"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="curveGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity="0.2"
                  />
                  <stop
                    offset="50%"
                    stopColor="var(--primary)"
                    stopOpacity="0.25"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity="0.2"
                  />
                </linearGradient>
              </defs>

              <path
                d="M 0,151
                   L 0,21
                   Q -50,146 280,151
                   L 0,151
                   Z"
                fill="url(#curveGradient)"
              />

              {/* Mirrored triangle on the right side */}
              <path
                d="M 300,151
                   L 300,21
                   Q 350,146 20,151
                   L 300,151
                   Z"
                fill="url(#curveGradient)"
              />
            </svg>
          </motion.div>

          <div className="max-w-3xl mx-auto text-center relative z-10 w-full">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeInUp}>
                <Badge
                  variant="secondary"
                  className="mb-6 text-sm bg-white text-primary border-border shadow-md"
                >
                  <Rocket className="w-3 h-3 mr-1" />
                  Research Paper • June 2025 • Revision 10.5
                </Badge>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                  Alberta&apos;s Role in the World&apos;s{" "}
                  <span className="text-primary">Insatiable Appetite</span> for
                  Artificial Intelligence
                </h1>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
                  Alberta knows how to do it… and how to make it{" "}
                  <span className="text-emerald-600 font-semibold">green</span>.
                  Exploring the 7.5 GW Wonder Valley Data Center project and
                  Alberta&apos;s competitive advantage in the global AI market.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link href="#about" className="flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        Explore the Vision
                      </Link>
                    </Button>
                  </motion.div>
                  {/*<motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link href="#contact" className="flex items-center">
                        <Paperclip className="w-4 h-4 mr-2" />
                        View the Paper
                      </Link>
                    </Button>
                  </motion.div>*/}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-8 bg-card/70 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-5 gap-16 items-center">
              <motion.div
                className="lg:col-span-2 space-y-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeInLeft}>
                  <Badge className="mb-4 bg-accent text-primary">
                    Game-Changing Project
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                    The Wonder Valley Data Center Project
                  </h2>
                </motion.div>
                <motion.div variants={fadeInLeft}>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    A remarkable{" "}
                    <span className="font-bold text-primary">
                      7.5 gigawatt (GW)
                    </span>{" "}
                    data processing capacity development is contemplated for the
                    Wonder Valley Data Center (WVDC) in west central Alberta,
                    associated with the Greenview Industrial Gateway (GIG).
                  </p>
                </motion.div>
                <motion.div variants={fadeInLeft}>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    This groundbreaking project represents Alberta&apos;s entry
                    into the global AI infrastructure market, leveraging the
                    province&apos;s abundant energy resources and strategic
                    advantages to power the future of artificial intelligence.
                  </p>
                </motion.div>
                <motion.div variants={fadeInLeft}>
                  <div className="text-lg text-muted-foreground leading-relaxed">
                    <b>Want to learn more?</b> Check out the project{" "}
                    <Link
                      className="text-primary/80 hover:text-primary"
                      href="https://olearyventures.com/wondervalley/"
                      target="_blank"
                    >
                      here.
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div
                className="lg:col-span-3 relative"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInRight}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/30 rounded-2xl blur-2xl transform rotate-1"></div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src="/wonder-valley.png"
                    alt="Alberta landscape with data center concept"
                    width={1000}
                    height={800}
                    className="rounded-2xl shadow-2xl relative z-10 w-full"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Key Findings */}
        <section
          id="findings"
          className="py-20 px-8 bg-gradient-to-br from-background to-accent relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto relative z-10">
            <motion.div
              className="text-center mb-20"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8 leading-tight">
                Key Findings &
                <span className="block text-primary">Opportunities</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Discover the massive potential and strategic advantages that
                position Alberta as a global AI infrastructure leader in the
                next decade
              </p>
            </motion.div>

            <motion.div
              className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* Market Opportunity Card */}
              <motion.div variants={fadeInUp} className="group">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <motion.div
                    whileHover={{ y: -12, rotateY: 5 }}
                    transition={{ duration: 0.4 }}
                    className="relative h-full bg-card/80 backdrop-blur-md border border-border/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500"
                  >
                    <div className="flex flex-col h-full">
                      <div className="mb-6">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                          <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl w-full h-full flex items-center justify-center">
                            <TrendingUp className="h-10 w-10 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent mb-3">
                            $120B Market
                          </h3>
                          <p className="text-muted-foreground text-lg font-medium">
                            Annual Global Opportunity
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl p-4 border border-emerald-200/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Alberta&apos;s Cost
                            </span>
                            <span className="text-2xl font-bold text-emerald-600">
                              12¢/kWh
                            </span>
                          </div>
                          <div className="w-full bg-emerald-100 dark:bg-emerald-900/50 rounded-full h-2">
                            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full w-3/4"></div>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-foreground leading-relaxed">
                            Alberta is positioned to capture{" "}
                            <span className="font-bold text-emerald-600">
                              5-10%
                            </span>{" "}
                            of this rapidly growing market within the next 5
                            years through competitive energy costs.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Energy Demand Card */}
              <motion.div variants={fadeInUp} className="group">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <motion.div
                    whileHover={{ y: -12, rotateY: -5 }}
                    transition={{ duration: 0.4 }}
                    className="relative h-full bg-card/80 backdrop-blur-md border border-border/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500"
                  >
                    <div className="flex flex-col h-full">
                      <div className="mb-6">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl -rotate-6 group-hover:-rotate-12 transition-transform duration-500"></div>
                          <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl w-full h-full flex items-center justify-center">
                            <Zap className="h-10 w-10 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-3">
                            1000 TWh
                          </h3>
                          <p className="text-muted-foreground text-lg font-medium">
                            Energy Demand by 2030
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50/50 dark:bg-blue-950/30 rounded-lg p-3 text-center border border-blue-200/30">
                            <div className="text-xs text-muted-foreground mb-1">
                              Equivalent to
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                              Japan&apos;s Usage
                            </div>
                          </div>
                          <div className="bg-blue-50/50 dark:bg-blue-950/30 rounded-lg p-3 text-center border border-blue-200/30">
                            <div className="text-xs text-muted-foreground mb-1">
                              Uptime Required
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                              99.999%
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-foreground leading-relaxed">
                            Only{" "}
                            <span className="font-bold text-blue-600">
                              hydropower, hydrocarbons, and nuclear
                            </span>{" "}
                            can deliver the reliability and scale AI
                            infrastructure demands.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Green Solution Card */}
              <motion.div variants={fadeInUp} className="group">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <motion.div
                    whileHover={{ y: -12, rotateY: 5 }}
                    transition={{ duration: 0.4 }}
                    className="relative h-full bg-card/80 backdrop-blur-md border border-border/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500"
                  >
                    <div className="flex flex-col h-full">
                      <div className="mb-6">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                          <div className="relative bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl w-full h-full flex items-center justify-center">
                            <Leaf className="h-10 w-10 text-white" />
                          </div>
                        </div>
                        <div className="text-center">
                          <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-3">
                            Green Solution
                          </h3>
                          <p className="text-muted-foreground text-lg font-medium">
                            Sustainable AI Infrastructure
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="bg-green-50/50 dark:bg-green-950/30 rounded-xl p-4 border border-green-200/30">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                              Natural Gas
                            </span>
                            <span className="text-green-500">+</span>
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                              Carbon Capture
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="text-xs text-green-600 font-medium">
                              = Scalable Green Energy
                            </span>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-foreground leading-relaxed">
                            The only power source that can be built at the pace
                            AI demands while achieving
                            <span className="font-bold text-green-600">
                              {" "}
                              long-term carbon neutrality
                            </span>
                            .
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Authors Section */}
        <section
          id="authors"
          className="py-16 px-4 bg-card/70 backdrop-blur-sm"
        >
          <div className="container mx-auto">
            <motion.div
              className="text-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Badge className="mb-4 bg-accent text-primary">
                Expert Leadership
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Meet the Research Team
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                World-class expertise spanning aerospace medicine, petroleum
                engineering, and geoscience innovation
              </p>
            </motion.div>
            <AnimatedTestimonialsDemo />
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="py-20 px-8 bg-gradient-to-br from-background to-accent text-foreground relative overflow-hidden"
        >
          <div className="container mx-auto relative z-10">
            <div className="max-w-2xl mx-auto">
              <motion.div
                className="text-center mb-16"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  <Mail className="w-3 h-3 mr-1" />
                  Let&apos;s Connect
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Ready to Shape the Future?
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Join us in exploring Alberta&apos;s revolutionary approach to
                  AI infrastructure. Whether you&apos;re an investor, government
                  partner, or industry leader, let&apos;s discuss how we can
                  build tomorrow&apos;s technology today.
                </p>
              </motion.div>

              {/* Centered Contact Form with Glassmorphism */}
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="w-full"
              >
                <div className="bg-card/20 backdrop-blur-md p-8 rounded-2xl border border-border shadow-2xl">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">
                                First Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="John"
                                  className="bg-background/20 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-destructive" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">
                                Last Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Doe"
                                  className="bg-background/20 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-destructive" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john.doe@example.com"
                                className="bg-background/20 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-destructive" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">
                              Message
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your interest in Alberta's AI data center opportunities..."
                                rows={4}
                                className="bg-background/20 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-destructive" />
                          </FormItem>
                        )}
                      />

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-3"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Mail className="w-4 h-4 mr-2" />
                          )}
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-12 px-4">
          <div className="container mx-auto">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="flex items-center space-x-3 mb-6 md:mb-0">
                <div className="relative">
                  <Image
                    src="/albertaAI.webp"
                    alt="Alberta AI"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <motion.div
                    className="absolute inset-0 h-8 w-8 bg-primary/20 rounded-full blur-lg"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <div>
                  <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Alberta AI
                  </span>
                  <div className="text-xs text-muted-foreground font-medium">
                    Fueling the Future of Innovation in Alberta
                  </div>
                </div>
              </div>
              <div className="text-sm text-center md:text-right">
                <div className="font-medium text-foreground">
                  © 2025 Research Collaboration
                </div>
                <div className="text-muted-foreground">
                  Douglas Hamilton • Michael Woofter • David Hume
                </div>
              </div>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "Distinguished physician-engineer with Ph.D. in Cardiovascular Physiology, M.D. with Valedictorian honors, and dual engineering degrees. Former NASA and Canadian Space Agency Flight Surgeon with Space Shuttle and ISS certification.",
      name: "Dr. Douglas R. Hamilton",
      designation: "Physician, Engineer & NASA Flight Surgeon",
      src: "/doug.png",
    },
    {
      quote:
        "Seasoned petroleum engineer with 20+ years specializing in unconventional resources, production forecasting, and regulatory stewardship. Principal of Woofter Petroleum Consultants Ltd. and Qualified Reserve Evaluator.",
      name: "Michael B. Woofter",
      designation: "Principal Petroleum Engineer & Reserves Expert",
      src: "/michael.png",
    },
    {
      quote:
        "President of Hume Energy Enterprises LLC and Business Development Specialist at University of Houston. Former President at Core Laboratories with expertise in upstream energy and CCUS strategic partnerships.",
      name: "David W. Hume",
      designation: "Geoscientist & Business Development Leader",
      src: "/david.png",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
