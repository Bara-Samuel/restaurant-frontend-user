import React, { useState } from "react";
import { motion } from "framer-motion";
import { features, stats } from "../../data/aboutdata";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import Customer from "../../assets/customer_1.jpeg";

const About = () => {
  const [hoveredStat, setHoveredStat] = useState(null);

  return (
    <div
      className="min-h-screen bg-linear-to-br
      from-[#1a120b] via-[#3c2a21] to-[#0b2f24]
      text-emerald-50 overflow-hidden relative"
    >
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[450px] h-[450px]
          rounded-full bg-emerald-500/10 blur-3xl"
        />

        <div
          className="absolute -bottom-40 -right-32 w-[500px] h-[500px]
          rounded-full bg-amber-500/10 blur-3xl"
        />
      </div>

      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <p
            className="mb-4 text-xs sm:text-sm uppercase
            tracking-[0.35em] text-emerald-400 font-semibold"
          >
            The Maison EKO Story
          </p>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl
            font-bold mb-6 font-serif bg-clip-text text-transparent
            bg-linear-to-r from-emerald-300 via-green-400 to-amber-300"
          >
            Culinary Excellence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl
            text-emerald-100/75 leading-relaxed"
          >
            Crafting unforgettable dining experiences and serving them to the
            very best: you.
          </motion.p>

          <div
            className="w-28 h-[2px] mx-auto mt-8
            bg-linear-to-r from-transparent via-emerald-400 to-transparent"
          />
        </div>
      </motion.section>

      {/* FEATURE SECTION */}
      <section className="relative py-14 px-4 md:px-8">
        <div
          className="max-w-7xl mx-auto grid grid-cols-1
          sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  margin: "0px 0px -100px 0px",
                }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.6,
                }}
                className="relative group"
              >
                <div
                  className="absolute -inset-1 rounded-[2rem]
                  bg-linear-to-br from-emerald-500/25 to-amber-400/15
                  blur-xl opacity-40 group-hover:opacity-80
                  transition-opacity duration-500"
                />

                <div
                  className="relative h-full overflow-hidden rounded-[2rem]
                  border border-emerald-400/20 bg-white/5
                  backdrop-blur-lg shadow-2xl shadow-black/25
                  transition-all duration-500
                  group-hover:-translate-y-3
                  group-hover:border-emerald-400/50"
                >
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={feature.img}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6 }}
                    />

                    <div
                      className="absolute inset-0
                      bg-linear-to-t from-[#1a120b]
                      via-[#1a120b]/10 to-transparent"
                    />
                  </div>

                  <div className="relative p-7">
                    <motion.div
                      className="inline-flex p-3 mb-4 rounded-xl
                      bg-emerald-900/40 border border-emerald-400/20"
                      whileHover={{ rotate: 10, scale: 1.08 }}
                    >
                      <Icon className="w-9 h-9 text-emerald-400" />
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-3 text-emerald-100">
                      {feature.title}
                    </h3>

                    <p className="text-emerald-100/65 leading-relaxed">
                      {feature.text}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* STATS SECTION */}
      <section
        className="relative py-20 px-4 md:px-8
        bg-linear-to-br from-[#160e09]/90 to-[#2f211a]/80"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-xs sm:text-sm uppercase tracking-[0.35em]
              text-emerald-400 font-semibold mb-3"
            >
              Excellence in every experience
            </p>

            <h2
              className="text-4xl sm:text-5xl font-serif font-bold
              text-emerald-100"
            >
              The EKO Difference
            </h2>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2
            md:grid-cols-4 gap-7"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.15,
                    type: "spring",
                  }}
                  className="relative group h-52"
                  onHoverStart={() => setHoveredStat(index)}
                  onHoverEnd={() => setHoveredStat(null)}
                  animate={{
                    scale: hoveredStat === index ? 1.05 : 1,
                    zIndex: hoveredStat === index ? 10 : 1,
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    }}
                  >
                    <div
                      className="relative h-full overflow-hidden rounded-2xl
                      border border-emerald-400/20 bg-white/5
                      backdrop-blur-lg p-6 shadow-xl
                      transition-all duration-300
                      group-hover:border-emerald-400/50"
                    >
                      <div
                        className="absolute inset-0
                        bg-linear-to-br from-emerald-900/15
                        via-transparent to-amber-500/10"
                      />

                      <div
                        className="relative z-10 h-full flex
                        flex-col items-center justify-center text-center"
                      >
                        <motion.div
                          className="mb-4 p-3 rounded-full
                          bg-emerald-900/40
                          border border-emerald-400/20"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                        >
                          <Icon className="w-8 h-8 text-emerald-400" />
                        </motion.div>

                        <div
                          className="text-4xl font-bold mb-2 bg-clip-text
                          bg-linear-to-r from-emerald-200
                          to-amber-300 text-transparent"
                        >
                          {stat.number}
                        </div>

                        <motion.div
                          className="text-sm uppercase tracking-widest
                          font-medium text-emerald-100/75"
                          animate={{
                            letterSpacing:
                              hoveredStat === index ? "0.15em" : "0.1em",
                          }}
                        >
                          {stat.label}
                        </motion.div>

                        {stat.subtext && (
                          <p className="mt-3 text-xs text-emerald-100/45">
                            {stat.subtext}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CUSTOMER FEEDBACK SECTION */}
      <section
        className="relative overflow-hidden py-24
        px-4 sm:px-6 lg:px-8"
      >
        <div
          className="absolute top-1/2 left-0 w-80 h-80
          -translate-y-1/2 rounded-full
          bg-emerald-500/10 blur-3xl pointer-events-none"
        />

        <div
          className="relative max-w-7xl mx-auto
          grid grid-cols-1 lg:grid-cols-2
          gap-16 lg:gap-20 items-center"
        >
          {/* CUSTOMER IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            <div
              className="absolute w-[280px] h-[280px]
              sm:w-[380px] sm:h-[380px]
              rounded-full bg-linear-to-br
              from-emerald-400/30 via-green-600/10
              to-amber-400/20 blur-sm"
            />

            <div className="relative group">
              <div
                className="absolute -inset-4 rounded-[3rem]
                bg-linear-to-br from-emerald-400/30
                via-transparent to-amber-400/20
                blur-xl opacity-70 group-hover:opacity-100
                transition-opacity duration-500"
              />

              <motion.img
                src={Customer}
                alt="Satisfied Maison EKO customer"
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ duration: 0.4 }}
                className="relative w-[280px] h-[360px]
                sm:w-[360px] sm:h-[450px]
                object-cover rounded-[2.5rem]
                border border-emerald-400/30
                shadow-2xl shadow-black/50"
              />

              <div
                className="absolute -bottom-6 left-1/2
                -translate-x-1/2 min-w-[230px]
                rounded-2xl bg-[#17100b]/90
                backdrop-blur-xl
                border border-emerald-400/20
                px-5 py-3 text-center shadow-xl"
              >
                <p className="font-bold text-emerald-200">
                  Jake Tommy
                </p>

                <p
                  className="text-xs uppercase tracking-[0.2em]
                  text-emerald-400"
                >
                  Loyal EKO Guest
                </p>
              </div>
            </div>
          </motion.div>

          {/* CUSTOMER REVIEW */}
          <div className="text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs sm:text-sm uppercase
              tracking-[0.35em] text-emerald-400
              font-semibold mb-4"
            >
              Customer Love
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-5xl sm:text-6xl
              font-serif font-bold leading-tight
              bg-linear-to-r from-emerald-200
              via-green-400 to-amber-300
              bg-clip-text text-transparent"
            >
              Loved by Our EKO-ites
            </motion.h2>

            <div
              className="w-24 h-[2px] my-7
              mx-auto lg:mx-0 bg-linear-to-r
              from-emerald-400 via-amber-300 to-transparent"
            />

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="flex justify-center lg:justify-start
              gap-1 mb-6"
            >
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className="text-amber-400 text-xl"
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="relative overflow-hidden rounded-[2rem]
              border border-emerald-400/20
              bg-white/5 backdrop-blur-xl
              p-7 sm:p-9 shadow-2xl shadow-black/30"
            >
              <FaQuoteLeft
                className="absolute top-6 left-6
                text-7xl text-emerald-400/10"
              />

              <p
                className="relative z-10 text-lg sm:text-xl
                font-serif italic leading-relaxed
                text-emerald-50/85"
              >
                “This is my fifth time here. I’m from New York, but EKO
                never misses. The egusi was rich and satisfying, and the
                jollof rice was perfectly seasoned. I will definitely be
                coming back.”
              </p>

              <div
                className="mt-7 pt-6
                border-t border-emerald-400/10
                flex flex-col sm:flex-row
                sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p className="font-bold text-lg text-emerald-200">
                    Jake Tommy
                  </p>

                  <p className="text-sm text-emerald-100/50">
                    New York, USA
                  </p>
                </div>

                <span
                  className="self-center sm:self-auto rounded-full
                  border border-amber-400/30 bg-amber-400/10
                  px-4 py-2 text-xs font-semibold
                  uppercase tracking-wider text-amber-300"
                >
                  Verified Guest
                </span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-7 max-w-xl mx-auto lg:mx-0
              text-emerald-100/55 leading-relaxed"
            >
              Every plate tells a story of culture, flavor, and
              tradition—thoughtfully prepared to create unforgettable
              memories.
            </motion.p>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-8 rounded-full px-8 py-3.5
              bg-linear-to-r from-emerald-400 to-green-600
              text-[#120b08] font-bold
              shadow-lg shadow-emerald-950/40
              transition-all duration-300
              hover:-translate-y-1 hover:scale-[1.03]
              hover:shadow-emerald-500/20"
            >
              Order Your Experience
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;