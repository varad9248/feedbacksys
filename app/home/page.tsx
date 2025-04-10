"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ChevronRight,
  BarChart3,
  FileText,
  Share2,
  PieChart,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const steps = [
  "Create dynamic feedback forms effortlessly with drag-and-drop UI.",
  "Publish your form and get it ready to collect responses.",
  "Share the unique code or link with users or participants.",
  "Collect real-time responses and view structured data.",
  "Analyze responses and download reports in CSV format.",
];

const features = [
  {
    title: "Form Builder",
    description:
      "Intuitive drag-and-drop interface to create custom forms with various question types.",
    icon: FileText,
  },
  {
    title: "Real-time Sharing",
    description:
      "Generate unique codes and links to share your forms instantly with participants.",
    icon: Share2,
  },
  {
    title: "Analytics Dashboard",
    description:
      "Visualize feedback data with interactive charts and comprehensive reports.",
    icon: BarChart3,
  },
  {
    title: "Insights Engine",
    description:
      "AI-powered analysis to extract meaningful patterns from your feedback data.",
    icon: PieChart,
  },
  {
    title: "Export Options",
    description:
      "Download your data in multiple formats including CSV, Excel, and PDF.",
    icon: Download,
  },
];

const faqs = [
  {
    question: "How do I create my first form?",
    answer:
      "After signing up, go to your dashboard and click 'Create New Form'. You'll use the drag-and-drop builder to customize questions, styles, and logic.",
  },
  {
    question: "How do participants access my forms?",
    answer:
      "When you publish a form, you'll get a unique code and link. Share it directly or embed it on your site for easy access.",
  },
  {
    question: "What types of analytics are available?",
    answer:
      "Our analytics include response rates, completion trends, question-level stats, and AI-powered suggestions (Pro plans only).",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. FeedForms uses industry-standard encryption, secure hosting, and GDPR-compliant practices to protect your data.",
  },
];

export default function WelcomePage() {

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-muted/20 to-background text-foreground">
      <main className="flex-1">

        {/* Hero Section */}
        <section className="container px-4 sm:px-6 py-12 md:py-24">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full md:max-w-xl text-center md:text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Welcome to{" "}
                <span className="text-primary drop-shadow-[0_0_0.5rem_rgba(255,255,255,0.4)]">
                  FeedForms
                </span>
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg mb-8">
                Create, share, and analyze feedback forms with real-time insights. Empower your team, class, or organization with structured data and beautiful analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/dashboard">
                  <Button size="lg" className="shadow-lg hover:scale-105 transition-transform w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="hover:scale-105 transition-transform w-full sm:w-auto">
                    Learn More <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md"
            >
              <Image
                src="/feed.png"
                alt="Feedback Illustration"
                width={500}
                height={500}
                className="w-full h-auto rounded-xl hover:scale-105 transition-transform shadow-xl"
              />
            </motion.div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="bg-muted/30 container px-4 sm:px-6 py-12 md:py-24">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-center mb-10"
            >
              🚀 How to Use <span className="text-primary">FeedForms</span>
            </motion.h2>

            <div className="relative border-l-2 border-muted pl-6 space-y-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {/* Step badge */}
                  <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {index + 1}
                  </div>

                  {/* Step text */}
                  <div className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition">
                    <p className="text-base sm:text-lg font text-foreground">
                      {step}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* Features Section */}
        <section id="features" className="container px-4 sm:px-6 py-12 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to create, distribute, and analyze feedback forms in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-muted/30 py-12 md:py-24">
          <div className="container px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Find answers to common questions about FeedForms.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
