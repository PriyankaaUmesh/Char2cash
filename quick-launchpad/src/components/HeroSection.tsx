import { motion } from "framer-motion";
import { Flame, Sprout, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import residueBurning from "@/assets/residue-burning.jpg";
import greenFarm from "@/assets/green-farm.jpg";

const stats = [
  { icon: Sprout, value: "12,500+", label: "Tons of Biochar Produced", color: "text-primary" },
  { icon: Flame, value: "45,000+", label: "Tons CO₂ Prevented", color: "text-destructive" },
  { icon: TrendingUp, value: "₹8.5 Cr", label: "Paid to Farmers", color: "text-accent" },
  { icon: Users, value: "3,200+", label: "Registered Farmers", color: "text-leaf" },
];

const HeroSection = () => (
  <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
    {/* Background subtle pattern */}
    <div className="absolute inset-0 bg-muted/30" />

    <div className="container mx-auto px-4 relative z-10">
      {/* Hero content */}
      <div className="text-center max-w-4xl mx-auto mb-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm font-semibold tracking-widest uppercase text-accent mb-4"
        >
          Sustainable Agriculture • Carbon Credits • Farmer Empowerment
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
        >
          Turning Agricultural Waste into{" "}
          <span className="text-gradient-primary">Climate Wealth</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          We connect farmers with investors to convert crop residue into biochar — sequestering carbon, enriching soil, and generating income.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6" asChild>
            <Link to="/register?role=farmer">
              <Sprout className="mr-2 h-5 w-5" />
              I'm a Farmer
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground text-base px-8 py-6" asChild>
            <Link to="/register?role=investor">
              <TrendingUp className="mr-2 h-5 w-5" />
              I'm an Investor
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Dual images */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20"
      >
        <div className="relative group overflow-hidden rounded-xl shadow-2xl">
          <img
            src={residueBurning}
            alt="Agricultural residue being burned — the problem we solve"
            className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-sm font-semibold text-destructive-foreground bg-destructive/80 px-3 py-1 rounded-full">
              The Problem
            </span>
            <p className="text-primary-foreground text-sm mt-2 font-medium">
              Crop residue burning releases toxic CO₂ and destroys soil health
            </p>
          </div>
        </div>

        <div className="relative group overflow-hidden rounded-xl shadow-2xl">
          <img
            src={greenFarm}
            alt="Green sustainable farm enriched with biochar"
            className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-sm font-semibold bg-primary/80 text-primary-foreground px-3 py-1 rounded-full">
              The Solution
            </span>
            <p className="text-primary-foreground text-sm mt-2 font-medium">
              Biochar-enriched soil boosts yield and sequesters carbon for decades
            </p>
          </div>
        </div>
      </motion.div>

      {/* Aggregate stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
            className="bg-card border border-border rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow"
          >
            <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
            <p className="font-display text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>

    {/* How it works section */}
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">How Char2Cash Works</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">A transparent, technology-driven platform bridging farmers, logistics, and investors.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {[
          { step: "01", title: "Farmer Sells Residue", desc: "Request a pickup of your crop residue. Get paid instantly upon verified collection." },
          { step: "02", title: "Residue → Biochar", desc: "Processing units convert agricultural waste into high-quality biochar through pyrolysis." },
          { step: "03", title: "Carbon Credits & Biochar", desc: "Investors fund the process, earning carbon credits. Farmers buy biochar to enrich soil." },
        ].map((item, i) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-card border border-border rounded-xl p-8 relative"
          >
            <span className="text-5xl font-display font-bold text-muted/60 absolute top-4 right-4">{item.step}</span>
            <h3 className="font-display text-xl font-semibold text-foreground mb-3">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button variant="outline" size="lg" asChild>
          <Link to="/learn">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default HeroSection;
