"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ContactProps {
  data: {
    title: string;
    phone: string;
    address: string;
    formLabels: {
      name: string;
      inst: string;
      email: string;
      phone: string;
      category: string;
      message: string;
    };
    submitText: string;
    successMsg: string;
  };
}

export default function ContactSection({ data }: ContactProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">{data.title}</h2>
          
          {success ? (
            <div className="text-center p-12 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
              <p className="text-2xl font-bold text-blue-600">{data.successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 lg:p-12 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input name="name" required placeholder={data.formLabels.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent" />
                <input name="inst" required placeholder={data.formLabels.inst} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent" />
                <input type="email" name="email" required placeholder={data.formLabels.email} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent" />
                <input type="tel" name="phone" required placeholder={data.formLabels.phone} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent" />
              </div>
              <input name="category" placeholder={data.formLabels.category} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent" />
              <textarea name="message" required placeholder={data.formLabels.message} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent h-32" />
              <button disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors">
                {loading ? "Sending..." : data.submitText}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
