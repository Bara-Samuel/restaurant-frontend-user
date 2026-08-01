import React from "react";
import { aboutfeature } from "../../data/style";
import { Link } from "react-router-dom";
import { FaCircleInfo } from "react-icons/fa6";
import AboutImage from "../../assets/danfo_joy.png";
import FloatingParticle from "../FloatingParticle/FloatingParticle";
import "./AboutHome.css";

const AboutHome = () => {
  return (
    <section
      className="relative overflow-hidden bg-linear-to-br
      from-[#100a07] via-[#21150d] to-[#064e3b]
      text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 -left-24 w-[420px] h-[420px]
          bg-green-500/10 rounded-full blur-3xl"
        />

        <div
          className="absolute -bottom-40 -right-24 w-[480px] h-[480px]
          bg-amber-500/10 rounded-full blur-3xl"
        />

        <div
          className="absolute top-1/3 left-1/2 w-72 h-72
          bg-emerald-500/5 rounded-full blur-3xl"
        />
      </div>

      <div
        className="relative max-w-7xl mx-auto grid grid-cols-1
        lg:grid-cols-2 items-center gap-14 lg:gap-20"
      >
        {/* IMAGE SECTION */}
        <div className="relative group order-2 lg:order-1">
          <div
            className="absolute -inset-4 bg-linear-to-br
            from-green-500/20 via-transparent to-amber-400/15
            rounded-[3rem] blur-2xl opacity-70
            group-hover:opacity-100 transition-opacity duration-500"
          />

          <div
            className="relative overflow-hidden rounded-[2.5rem]
            border border-green-400/25 bg-white/5 backdrop-blur-sm
            shadow-2xl shadow-black/50 p-3"
          >
            <img
              src={AboutImage}
              alt="Maison EKO dining experience"
              className="w-full h-auto object-contain rounded-[2rem]
              transition-transform duration-700
              group-hover:scale-[1.03]"
            />

            <div
              className="absolute inset-3 rounded-[2rem]
              bg-linear-to-t from-black/40 via-transparent to-transparent
              pointer-events-none"
            />
          </div>

          <div
            className="absolute -bottom-5 -left-5 px-5 py-3
            rounded-2xl bg-[#17100b]/90 backdrop-blur-md
            border border-green-400/20 shadow-xl"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-green-400">
              Authentic
            </p>
            <p className="font-cursive text-xl text-green-100">
              EKO Hospitality
            </p>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="order-1 lg:order-2">
          <p
            className="text-green-400 uppercase tracking-[0.35em]
            text-xs sm:text-sm font-semibold mb-4"
          >
            The Maison EKO experience
          </p>

          <h2 className="leading-tight">
            <span
              className="font-cursive block text-5xl sm:text-6xl
              md:text-7xl bg-linear-to-r from-green-200
              via-emerald-400 to-amber-300
              bg-clip-text text-transparent drop-shadow-lg"
            >
              Epicurean Elegance
            </span>

            <span
              className="block mt-4 text-2xl sm:text-3xl
              md:text-4xl font-light text-green-50/90"
            >
              Where flavors dance and memories bloom
            </span>
          </h2>

          <div
            className="w-24 h-[2px] my-7 bg-linear-to-r
            from-green-400 via-amber-300 to-transparent"
          />

          <p
            className="max-w-2xl text-base sm:text-lg
            text-green-50/75 leading-relaxed font-serif italic
            border-l-2 border-green-400 pl-5"
          >
            “In our kitchen, passion meets precision. We craft not only meals,
            but memorable culinary journeys that linger on the plate and in the
            heart.”
          </p>

          {/* FEATURES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
            {aboutfeature.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title || index}
                  className="group relative overflow-hidden rounded-2xl
                  border border-green-400/15 bg-white/5
                  backdrop-blur-sm p-5
                  transition-all duration-300
                  hover:-translate-y-2 hover:border-green-400/40
                  hover:bg-green-900/20 hover:shadow-xl
                  hover:shadow-green-950/40"
                >
                  <div
                    className="absolute inset-0 bg-linear-to-br
                    from-green-400/5 to-amber-400/5
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300"
                  />

                  <div className="relative flex items-start gap-4">
                    <div
                      className={`shrink-0 p-3 rounded-xl
                      bg-linear-to-br ${item.color}
                      shadow-lg transition-transform duration-300
                      group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className="text-xl sm:text-2xl text-white" />
                    </div>

                    <div>
                      <h3
                        className="text-lg sm:text-xl font-bold
                        text-green-200 mb-2"
                      >
                        {item.title}
                      </h3>

                      <p
                        className="text-sm sm:text-base
                        text-green-50/65 leading-relaxed"
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BUTTON */}
          <div className="mt-10">
            <Link
              to="/about"
              className="group relative inline-flex items-center gap-3
              overflow-hidden rounded-full px-7 py-3.5
              bg-linear-to-r from-green-500 to-emerald-600
              text-[#100a07] font-bold
              shadow-lg shadow-green-950/30
              transition-all duration-300
              hover:-translate-y-1 hover:scale-[1.02]
              hover:shadow-xl hover:shadow-green-500/20"
            >
              <span
                className="absolute inset-0 bg-linear-to-r
                from-white/20 via-transparent to-transparent
                -translate-x-full group-hover:translate-x-full
                transition-transform duration-700"
              />

              <FaCircleInfo className="relative z-10 text-lg" />

              <span className="relative z-10 font-cursive text-xl">
                Unveil Our Legacy
              </span>
            </Link>
          </div>
        </div>
      </div>

      <FloatingParticle />
    </section>
  );
};

export default AboutHome;