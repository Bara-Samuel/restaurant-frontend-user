import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiMessageSquare,
  FiArrowRight,
  FiGlobe,
} from "react-icons/fi";
import { contactFormFields } from "../../data/data";

const Contact = () => {
  const initialFormData = {
    name: "",
    phone: "",
    email: "",
    address: "",
    dish: "",
    query: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Form submitted:", formData);

    toast.success("Your message has been submitted successfully!", {
      style: {
        border: "1px solid rgba(74, 222, 128, 0.4)",
        padding: "16px",
        color: "#dcfce7",
        background: "rgba(18, 11, 8, 0.95)",
        backdropFilter: "blur(16px)",
      },
      iconTheme: {
        primary: "#4ade80",
        secondary: "#120b08",
      },
    });

    setFormData(initialFormData);
  };

  const contactCards = [
    {
      title: "Our Headquarters",
      value: "486 Bell Road, Nashville, TN 37217, United States",
      icon: FiMapPin,
      href: "https://maps.google.com/?q=486+Bell+Road+Nashville+TN+37217",
      action: "View location",
    },
    {
      title: "Contact Number",
      value: "+1 (615) 525-9650",
      icon: FiPhone,
      href: "tel:+16155259650",
      action: "Call us",
    },
    {
      title: "Email Address",
      value: "barasamuel2005@gmail.com",
      icon: FiMail,
      href: "mailto:barasamuel2005@gmail.com",
      action: "Send an email",
    },
  ];

  return (
    <section
      className="relative min-h-screen overflow-hidden
      bg-linear-to-br from-[#120b08] via-[#21140d] to-[#064e3b]
      px-4 py-20 font-[Poppins] text-white
      sm:px-6 lg:px-8 lg:py-24"
    >
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 4000 }}
      />

      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-32 -top-32 h-[420px] w-[420px]
          rounded-full bg-green-500/10 blur-3xl"
        />

        <div
          className="absolute -bottom-40 -right-28 h-[500px] w-[500px]
          rounded-full bg-amber-400/10 blur-3xl"
        />

        <div
          className="absolute left-1/2 top-1/3 h-72 w-72
          -translate-x-1/2 rounded-full bg-emerald-400/5 blur-3xl"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <p
            className="mb-4 text-xs font-semibold uppercase
            tracking-[0.35em] text-green-400 sm:text-sm"
          >
            We would love to hear from you
          </p>

          <h1
            className="bg-linear-to-r from-green-200
            via-emerald-400 to-amber-300 bg-clip-text
            text-4xl font-bold text-transparent
            sm:text-5xl md:text-6xl"
          >
            Connect With Maison EKO
          </h1>

          <div
            className="mx-auto my-6 h-[2px] w-28
            bg-linear-to-r from-transparent via-green-400 to-transparent"
          />

          <p className="text-base leading-relaxed text-green-50/70 sm:text-lg">
            Have a question, reservation request, catering inquiry, or special
            dish in mind? Send us a message and our team will respond.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Contact information */}
          <div>
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.25em] text-green-400">
                Contact details
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-100">
                Let’s start a conversation
              </h2>

              <p className="mt-4 max-w-xl leading-relaxed text-green-50/65">
                Reach out to us directly or complete the form. Whether you are
                planning a visit, ordering a meal, or organizing an event, we
                are ready to assist you.
              </p>
            </div>

            <div className="space-y-5">
              {contactCards.map((card) => {
                const Icon = card.icon;

                return (
                  <a
                    key={card.title}
                    href={card.href}
                    target={card.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      card.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group relative block overflow-hidden
                    rounded-2xl border border-green-400/15
                    bg-white/5 p-6 backdrop-blur-md
                    shadow-xl shadow-black/20
                    transition-all duration-300
                    hover:-translate-y-1 hover:border-green-400/40
                    hover:bg-green-900/20 hover:shadow-green-950/40"
                  >
                    <div
                      className="absolute inset-0 bg-linear-to-r
                      from-green-400/5 to-amber-300/5
                      opacity-0 transition-opacity duration-300
                      group-hover:opacity-100"
                    />

                    <div className="relative flex items-start gap-4">
                      <div
                        className="flex h-14 w-14 shrink-0 items-center
                        justify-center rounded-2xl
                        border border-green-400/20
                        bg-green-500/10 text-green-400
                        transition-all duration-300
                        group-hover:scale-110 group-hover:bg-green-400
                        group-hover:text-[#120b08]"
                      >
                        <Icon className="text-2xl" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-green-200">
                          {card.title}
                        </h3>

                        <p className="mt-2 break-words leading-relaxed text-green-50/70">
                          {card.value}
                        </p>

                        <span
                          className="mt-3 inline-flex items-center gap-2
                          text-sm font-semibold text-green-400"
                        >
                          {card.action}
                          <FiArrowRight
                            className="transition-transform duration-300
                            group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            <div
              className="mt-6 flex items-center gap-3 rounded-2xl
              border border-amber-300/15 bg-amber-300/5
              px-5 py-4 text-sm text-green-50/70"
            >
              <FiGlobe className="shrink-0 text-xl text-amber-300" />

              <p>
                Serving Nashville with authentic Nigerian cuisine, hospitality,
                and unforgettable cultural experiences.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div
            className="relative overflow-hidden rounded-[2rem]
            border border-green-400/20 bg-white/5
            p-6 backdrop-blur-xl
            shadow-[0_30px_80px_rgba(0,0,0,0.35)]
            sm:p-8"
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20
              h-56 w-56 rounded-full bg-green-500/10 blur-3xl"
            />

            <div className="relative z-10">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.25em] text-green-400">
                  Send a message
                </p>

                <h2 className="mt-2 text-3xl font-bold text-green-100">
                  How may we help you?
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-green-50/60">
                  Complete the form below and provide as much information as
                  possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {contactFormFields.map(
                  ({ label, name, type, placeholder, pattern, Icon }) => (
                    <div key={name}>
                      <label
                        htmlFor={name}
                        className="mb-2 block text-sm font-medium
                        text-green-100"
                      >
                        {label}
                      </label>

                      <div className="relative">
                        {Icon && (
                          <Icon
                            className="pointer-events-none absolute
                            left-4 top-1/2 -translate-y-1/2
                            text-lg text-green-400"
                          />
                        )}

                        <input
                          id={name}
                          type={type}
                          name={name}
                          value={formData[name] ?? ""}
                          onChange={handleChange}
                          placeholder={placeholder}
                          pattern={pattern || undefined}
                          required
                          className={`w-full rounded-xl border
                          border-green-400/20 bg-black/20
                          py-3.5 pr-4 text-green-50
                          outline-none transition-all duration-300
                          placeholder:text-green-50/35
                          focus:border-green-400/60
                          focus:bg-black/30
                          focus:ring-4 focus:ring-green-500/10
                          ${Icon ? "pl-12" : "pl-4"}`}
                        />
                      </div>
                    </div>
                  )
                )}

                <div>
                  <label
                    htmlFor="query"
                    className="mb-2 block text-sm font-medium text-green-100"
                  >
                    Your Message
                  </label>

                  <div className="relative">
                    <FiMessageSquare
                      className="pointer-events-none absolute
                      left-4 top-4 text-lg text-green-400"
                    />

                    <textarea
                      id="query"
                      rows={5}
                      name="query"
                      value={formData.query}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      required
                      className="w-full resize-none rounded-xl
                      border border-green-400/20 bg-black/20
                      py-3.5 pl-12 pr-4 text-green-50
                      outline-none transition-all duration-300
                      placeholder:text-green-50/35
                      focus:border-green-400/60
                      focus:bg-black/30
                      focus:ring-4 focus:ring-green-500/10"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="group relative flex w-full items-center
                  justify-center gap-3 overflow-hidden rounded-xl
                  bg-linear-to-r from-green-400 to-emerald-500
                  px-6 py-4 font-bold text-[#120b08]
                  shadow-lg shadow-green-950/30
                  transition-all duration-300
                  hover:-translate-y-1 hover:scale-[1.01]
                  hover:shadow-green-500/20 active:scale-[0.98]"
                >
                  <span
                    className="absolute inset-0 -translate-x-full
                    bg-linear-to-r from-white/25 via-transparent to-transparent
                    transition-transform duration-700
                    group-hover:translate-x-full"
                  />

                  <span className="relative z-10">Submit Message</span>

                  <FiArrowRight
                    className="relative z-10 h-5 w-5
                    transition-transform duration-300
                    group-hover:translate-x-1"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;