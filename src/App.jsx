import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function App() {

  // ================= CURSOR EFFECT =================
  useEffect(() => {
    const glow = document.getElementById("cursor-glow");

    const move = (e) => {
      if (!glow) return;
      glow.style.background = `radial-gradient(
        500px at ${e.clientX}px ${e.clientY}px,
        rgba(255,255,255,0.08),
        transparent 80%
      )`;
    };

    const handleHover = () => {
      if (!glow) return;
      glow.style.background = `radial-gradient(
        300px at center,
        rgba(255,255,255,0.12),
        transparent 80%
      )`;
    };

    const reset = () => {
      if (!glow) return;
      glow.style.background = "transparent";
    };

    window.addEventListener("mousemove", move);

    const targets = document.querySelectorAll("a, button");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", reset);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", reset);
      });
    };
  }, []);

  // ================= ACTIVE NAVBAR =================
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav a");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.remove("text-white");
              link.classList.add("text-gray-400");

              if (link.getAttribute("href") === `#${entry.target.id}`) {
                link.classList.remove("text-gray-400");
                link.classList.add("text-white");
              }
            });
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => sections.forEach((sec) => observer.unobserve(sec));
  }, []);

  // ================= SCROLL =================
  const { scrollY, scrollYProgress } = useScroll();

  const heroY = useTransform(scrollY, [0, 500], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.6]);

  const bgY1 = useTransform(scrollY, [0, 1000], [0, 150]);
  const bgY2 = useTransform(scrollY, [0, 1000], [0, -120]);

  const aboutY = useTransform(scrollY, [300, 800], [80, -40]);
  const aboutScale = useTransform(scrollY, [300, 800], [0.95, 1.08]);
  const aboutRotate = useTransform(scrollY, [300, 800], [1, -1]);

  // ================= ANIMATION =================
  const reveal = {
    hidden: { opacity: 0, y: 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };

  const heroContainer = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.06 },
    },
  };

  const heroItem = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  // ================= COMPONENT =================
  const Section = ({ id, children }) => (
    <section
      id={id}
      className="min-h-screen px-8 md:px-20 py-24 relative z-10 flex items-center"
    >
      {children}
    </section>
  );

  const Card = ({ title, desc }) => (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-100px" }}
      whileHover={{
        y: -15,
        scale: 1.05,
        rotateX: 6,
        rotateY: -6,
        boxShadow: "0 30px 80px rgba(255,255,255,0.12)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="bg-white/5 border border-white/20 p-6 rounded-2xl backdrop-blur-lg hover:border-white/40 transition"
    >
      <h3 className="text-xl font-hero font-semibold mb-2">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );

  return (
    <div className="bg-black text-white font-sans tracking-wide overflow-x-hidden relative">

      {/* SCROLL PROGRESS */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-white z-[999]"
        style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
      />

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />

      <motion.div
        style={{ y: bgY1 }}
        className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] bg-white/5 blur-3xl rounded-full z-0"
      />

      <motion.div
        style={{ y: bgY2 }}
        className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-white/5 blur-3xl rounded-full z-0"
      />

      <div id="cursor-glow" className="pointer-events-none fixed inset-0 z-0" />

      {/* NAVBAR */}
      <nav className="fixed w-full flex justify-between items-center px-10 py-4 bg-black/70 backdrop-blur-lg border-b border-white/10 z-50">
        <a
        href="#home"
        className="font-hero text-xl font-bold tracking-wider relative group"
        >
        FARREL
        <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
        </a>

        <div className="flex items-center space-x-6 text-sm text-gray-400">
          <a href="#home" className="hover:text-white transition duration-300">Home</a>
          <a href="#work" className="hover:text-white transition duration-300">Project</a>
          <a href="#about" className="hover:text-white transition duration-300">About</a>
          <a href="#contact" className="hover:text-white transition duration-300">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <Section id="home">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          initial="hidden"
          animate="show"
          variants={reveal}
          className="max-w-3xl"
        >
          <motion.h1
            variants={heroContainer}
            initial="hidden"
            animate="show"
            className="font-hero text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            {"I Build Systems That Make Things Work Better".split(" ").map((word, i) => (
              <motion.span key={i} variants={heroItem} className="inline-block mr-3">
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <p className="text-gray-400 text-lg mb-8">
            turning complex processes into efficient systems that create real impact.
          </p>

          <div className="flex gap-4">
            <a href="#work" className="bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition">
              View Work
            </a>

            <a href="#contact" className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition">
              Contact Me
            </a>
          </div>
        </motion.div>
      </Section>

      {/* STACK */}
      <Section id="stack">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: false }} variants={reveal}>
          <h2 className="font-hero text-3xl font-bold mb-6">Tech Stack</h2>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {["React", "Tailwind", "JavaScript", "Figma", "Node.js"].map((tech, i) => (
              <span key={i} className="px-4 py-2 border border-white/10 rounded-lg hover:border-white hover:text-white transition">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* PROJECT */}
      <Section id="work">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: false }} variants={reveal}>
          <h2 className="font-hero text-4xl font-bold mb-10">Selected Work</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card title="Portfolio Website" desc="Personal branding website with modern UI." />
            <Card title="SOP Management System" desc="Workflow optimization system." />
            <Card title="Dashboard UI" desc="Data visualization interface." />
          </div>
        </motion.div>
      </Section>

      {/* ABOUT */}
      <Section id="about">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          variants={reveal}
          className="grid md:grid-cols-2 gap-12 items-center w-full"
        >

          <motion.div variants={reveal} className="space-y-4 text-gray-400 leading-relaxed">
            <h2 className="font-hero text-4xl font-bold text-white mb-6">About Me</h2>
            <p>Final-year Industrial Engineering student focused on Industrial Operations and Organizational Systems.</p>
            <p>Experienced in ERP systems, PPIC, Supply Chain Management, and process optimization.</p>
            <p>Passionate about improving operational efficiency through people, processes, and technology.</p>
          </motion.div>

          <motion.div variants={reveal} className="flex justify-center md:justify-end">
            <motion.img
              style={{ y: aboutY, scale: aboutScale, rotate: aboutRotate }}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: false }}
              src="/PP 2 ae .png"
              alt="Farrel"
              className="w-[520px] h-[720px] object-cover rounded-3xl border border-white/10 shadow-2xl"
            />
          </motion.div>

        </motion.div>
      </Section>

      {/* CONTACT */}
      <Section id="contact">
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: false }}>
          <h2 className="font-hero text-4xl font-bold mb-6">Let’s Work Together</h2>

          <p className="text-gray-400 mb-6">
            Open for internship, fulltime, freelance, or collaboration opportunities.
          </p>

          <a href="mailto:farrelrifqiansyah1@gmail.com"
            className="bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition">
            Contact Me
          </a>
        </motion.div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 mt-20 px-8 md:px-20 py-8 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4 backdrop-blur-md bg-white/5">

        <div>
          <span className="text-white font-medium">Farrel</span> — Industrial Engineering
        </div>

        <div className="flex gap-6">
          <a href="mailto:farrelrifqiansyah1@gmail.com" className="hover:text-white">Email</a>
          <a href="#" className="hover:text-white">LinkedIn</a>
          <a href="#" className="hover:text-white">GitHub</a>
        </div>

        <div className="text-xs text-gray-500">
          © 2026 Farrel Rifqian Syah. All rights reserved.
        </div>

      </footer>

    </div>
  );
}