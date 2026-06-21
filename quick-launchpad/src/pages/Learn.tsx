import { motion } from "framer-motion";
import { BookOpen, MapPin, Store, Sprout, Droplets, Wheat } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const usageSteps = [
  { icon: Wheat, title: "Sell Your Crop Residue", desc: "Request a pickup after harvest. Our verified agents collect, weigh, and pay you on the spot." },
  { icon: Sprout, title: "Buy Biochar", desc: "Get AI-powered recommendations on how much biochar your farm needs based on soil type and crop." },
  { icon: Droplets, title: "Improve Soil Health", desc: "Apply biochar to retain moisture, enrich nutrients, and boost your crop yield sustainably." },
];

const stores = [
  { name: "GreenField Agro Store", location: "Hubli, Karnataka", contact: "+91 98765 11111" },
  { name: "Kisan Biochar Centre", location: "Belgaum, Karnataka", contact: "+91 98765 22222" },
  { name: "Eco Fertilizer Depot", location: "Dharwad, Karnataka", contact: "+91 98765 33333" },
  { name: "Sustainable Agri Mart", location: "Vijayapura, Karnataka", contact: "+91 98765 44444" },
];

const Learn = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Learn More</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Understand how biochar transforms agriculture and how you can start benefiting today.
          </p>
        </motion.div>

        {/* How to use */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {usageSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <step.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What is Biochar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 mb-20"
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">What is Biochar?</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>Biochar is a carbon-rich material produced by heating organic matter (like crop residue) in a low-oxygen environment — a process called <strong className="text-foreground">pyrolysis</strong>.</p>
            <p>When added to soil, biochar improves water retention, increases nutrient availability, and boosts microbial activity. It also locks carbon in the ground for hundreds of years, preventing it from re-entering the atmosphere.</p>
            <p>Instead of burning crop residue (which causes severe air pollution and releases CO₂), converting it to biochar creates a <strong className="text-foreground">win-win</strong>: farmers earn income, soil gets enriched, and the planet benefits from carbon sequestration.</p>
          </div>
        </motion.div>

        {/* Stores */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Store className="h-6 w-6 text-accent" />
            <h2 className="font-display text-2xl font-bold text-foreground">Bio-Fertiliser Stores</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {stores.map((store) => (
              <div key={store.name} className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
                <MapPin className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">{store.name}</p>
                  <p className="text-sm text-muted-foreground">{store.location}</p>
                  <p className="text-sm text-muted-foreground">{store.contact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Learn;
