import React, { useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ChefHat, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await api.post('/messages', form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactDetails = [
    {
      icon: MapPin,
      label: 'Our Location',
      value: 'Gulberg, Lahore, Pakistan',
      sub: 'Come visit us — we\'d love to see you!',
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/30',
    },
    {
      icon: Phone,
      label: 'Phone Number',
      value: '+92 300 1234567',
      sub: 'Mon – Sat, 11am – 10pm',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    },
    {
      icon: Mail,
      label: 'Email Address',
      value: 'hello@tablecraft.pk',
      sub: 'We\'ll reply within 24 hours',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/30',
    },
    {
      icon: Clock,
      label: 'Opening Hours',
      value: 'Mon–Fri: 11am – 10pm',
      sub: 'Sat: 10am–11pm  |  Sun: 12pm–9pm',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/30',
    },
  ];

  return (
    <PageTransition>
    <div className="bg-white dark:bg-stone-950 min-h-screen transition-colors duration-200">

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-orange-950 to-stone-900" />
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-orange-600/20 rounded-sm blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-600/20 rounded-sm blur-3xl" />

        <div className="relative z-10 container mx-auto px-6 max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-sm text-white/80 text-sm font-medium mb-6">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>Gulberg, Lahore</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            Get in <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-stone-300 text-lg max-w-xl mx-auto">
            Have a question, special request, or just want to say hello? We're always happy to hear from our guests.
          </p>
        </div>
      </section>

      <section className="py-16 bg-stone-50 dark:bg-stone-900">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactDetails.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-6 border border-stone-100 dark:border-stone-800  hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 ${c.bg} rounded-sm flex items-center justify-center mb-5`}>
                    <Icon className={`w-6 h-6 ${c.color}`} />
                  </div>
                  <h3 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-2">{c.label}</h3>
                  <p className="text-sm font-bold text-stone-800 dark:text-stone-100 mb-1">{c.value}</p>
                  <p className="text-xs text-stone-400 dark:text-stone-500">{c.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-stone-950">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            <div className="lg:col-span-2 flex flex-col gap-6">
              
              <div className="relative rounded-none border border-stone-200 dark:border-stone-800 overflow-hidden h-64 lg:h-full min-h-[280px] bg-stone-900 border border-stone-200 dark:border-stone-800 ">
                
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-stone-900/20 to-stone-900/80" />

                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 300">
                  <line x1="0" y1="150" x2="400" y2="150" stroke="#6366f1" strokeWidth="8" />
                  <line x1="200" y1="0" x2="200" y2="300" stroke="#6366f1" strokeWidth="8" />
                  <line x1="0" y1="80" x2="400" y2="80" stroke="#8b5cf6" strokeWidth="4" />
                  <line x1="0" y1="220" x2="400" y2="220" stroke="#8b5cf6" strokeWidth="4" />
                  <line x1="100" y1="0" x2="100" y2="300" stroke="#8b5cf6" strokeWidth="4" />
                  <line x1="300" y1="0" x2="300" y2="300" stroke="#8b5cf6" strokeWidth="4" />
                </svg>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                  <div className="w-14 h-14 bg-orange-600 rounded-sm flex items-center justify-center shadow-2xl shadow-orange-600/60 ring-4 ring-white/20 animate-pulse">
                    <ChefHat className="w-7 h-7 text-white" />
                  </div>
                  <div className="bg-white text-stone-900 font-bold text-xs px-3 py-1 rounded-sm shadow-lg whitespace-nowrap">
                    TableCraft · Gulberg, Lahore
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-600 to-amber-700 rounded-none border border-stone-200 dark:border-stone-800 p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/15 rounded-sm flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-black text-base">Find Us Here</div>
                    <div className="text-orange-200 text-xs">Walk-in or order online</div>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-orange-100">
                  <p className="font-bold text-white">TableCraft Restaurant</p>
                  <p>Main Gulberg, Lahore</p>
                  <p>Punjab, Pakistan</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-stone-900 rounded-none border border-stone-200 dark:border-stone-800 p-8 border border-stone-100 dark:border-stone-800 ">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100 mb-2">Send Us a Message</h2>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">
                    For reservations, feedback, or any question — we read every message!
                  </p>
                </div>

                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-none border border-stone-200 dark:border-stone-800 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 mb-2">Message Sent! 🎉</h3>
                      <p className="text-stone-500 dark:text-stone-400 text-sm">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                    </div>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                      className="mt-2 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-sm text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                          Full Name *
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Ali Hassan"
                          className="w-full px-4 py-3 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="ali@example.com"
                          className="w-full px-4 py-3 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                        Subject *
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        required
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select a subject…</option>
                        <option value="reservation">Table Reservation</option>
                        <option value="feedback">Feedback / Review</option>
                        <option value="order-issue">Order Issue</option>
                        <option value="catering">Catering Enquiry</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                        Your Message *
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        required
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help…"
                        className="w-full px-4 py-3 rounded-sm border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-70 text-white font-bold py-3.5 rounded-none border border-stone-200 dark:border-stone-800 transition-all shadow-lg shadow-orange-200 dark:shadow-none active:scale-95"
                    >
                      {submitting ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-sm animate-spin" /> Sending…</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Message</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
      </PageTransition>

    );
};

export default Contact;
