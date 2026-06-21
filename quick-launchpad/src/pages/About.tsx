import { motion } from "framer-motion";
import { Target, Heart, Globe, Leaf, Flame, Sprout } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">About Char2Cash</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our mission is to end crop residue burning by creating an economic incentive for farmers while sequestering carbon for a healthier planet.
          </p>
        </motion.div>

        {/* Mission / Values / Impact */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Our Mission", desc: "Eliminate agricultural residue burning by creating a circular economy where waste becomes wealth — empowering farmers with real income." },
              { icon: Heart, title: "Our Values", desc: "Transparency, farmer-first approach, sustainability. Every transaction is verifiable. Every rupee is traceable." },
              { icon: Globe, title: "Our Vision", desc: "A future where no crop residue is burned, farmlands are enriched with biochar, and rural communities thrive sustainably." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 text-center"
              >
                <item.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What We Do */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Flame, title: "Stop Residue Burning", desc: "We pay farmers to collect their crop residue instead of burning it — reducing air pollution and protecting soil health." },
              { icon: Leaf, title: "Produce Biochar", desc: "Collected residue is converted into biochar through pyrolysis — a carbon-negative process that locks CO₂ for centuries." },
              { icon: Sprout, title: "Enrich Farmland", desc: "Farmers buy back affordable biochar to boost soil fertility, retain moisture, and increase crop yield sustainably." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-primary/5 border border-primary/20 rounded-xl p-6"
              >
                <item.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why It Matters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Why It Matters</h2>
          <div className="space-y-4 text-muted-foreground text-sm md:text-base">
            <p>
              Every year, millions of tons of crop residue are burned across India, releasing toxic pollutants and contributing massively to air pollution during harvest seasons.
            </p>
            <p>
              Char2Cash turns this waste into wealth — farmers earn money for their residue, get affordable biochar to improve their soil, and the planet benefits from carbon sequestration.
            </p>
            <p>
              Our transparent platform ensures every transaction is verifiable, making it ideal for CSR organisations and NGOs looking to fund impactful environmental initiatives.
            </p>
          </div>
          <div className="mt-8">
            <p className="text-xs text-muted-foreground">Contact us: <span className="text-foreground font-medium">+91 93533 03713</span> • support@char2cash.in</p>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
