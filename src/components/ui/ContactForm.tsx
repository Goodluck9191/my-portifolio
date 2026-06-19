"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormData = z.infer<typeof contactSchema>;
type FieldErrors = Partial<Record<keyof FormData, string>>;

interface ContactFormProps {
  onSubmit?: (data: FormData) => void | Promise<void>;
  loading?: boolean;
  success?: boolean;
  error?: string;
}

const projectTypes = ["Business Website", "Web App", "Landing Page", "E-Commerce", "Other"];
const budgets = ["Under $500", "$500 - $1500", "$1500 - $5000", "$5000+", "Let's discuss"];

export function ContactForm({ onSubmit, loading = false, success = false, error: submitErrorProp }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submitError, setSubmitError] = useState("");

  function validateField(field: keyof FormData, value: string) {
    const result = contactSchema.safeParse({ ...formData, [field]: value });
    if (result.success) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      return true;
    }
    const fieldError = result.error?.issues?.find((e) => e.path[0] === field);
    setErrors((prev) => ({ ...prev, [field]: fieldError?.message }));
    return false;
  }

  function handleChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched.has(field)) validateField(field, value);
  }

  function handleBlur(field: keyof FormData) {
    setTouched((prev) => new Set(prev).add(field));
    validateField(field, formData[field] ?? "");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError("");

    const allTouched = new Set(["name", "email", "message", "projectType", "budget"]);
    setTouched(allTouched);

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const err of result.error.issues) {
        const key = err.path[0] as keyof FormData;
        if (!fieldErrors[key]) fieldErrors[key] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await onSubmit?.(result.data);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  }

  function inputClass(field: keyof FormData) {
    const hasError = touched.has(field) && errors[field];
    return `w-full rounded-lg border bg-[#16162A] px-4 py-3 text-[#EEEEFF] placeholder-[#7A7A9A] outline-none transition-all duration-200 focus:border-[#6C63FF] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.2)] ${
      hasError ? "border-red-500" : "border-[#2A2A38]"
    }`;
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-[#2A2A38] bg-[#0F0F1A] px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-sans text-lg font-semibold text-[#EEEEFF]">
          Message sent!
        </p>
        <p className="font-sans text-sm text-[#7A7A9A]">
          I&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          className={inputClass("name")}
          required
        />
        {touched.has("name") && errors.name && (
          <p className="font-sans text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <input
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          className={inputClass("email")}
          required
        />
        {touched.has("email") && errors.email && (
          <p className="font-sans text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <select
          value={formData.projectType}
          onChange={(e) => handleChange("projectType", e.target.value)}
          onBlur={() => handleBlur("projectType")}
          className={inputClass("projectType")}
        >
          <option value="">Project Type</option>
          {projectTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <select
          value={formData.budget}
          onChange={(e) => handleChange("budget", e.target.value)}
          onBlur={() => handleBlur("budget")}
          className={inputClass("budget")}
        >
          <option value="">Budget Range</option>
          {budgets.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <textarea
          placeholder="Tell me about your project..."
          rows={5}
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          className={`${inputClass("message")} resize-none`}
          required
        />
        {touched.has("message") && errors.message && (
          <p className="font-sans text-xs text-red-500">{errors.message}</p>
        )}
      </div>

      {(submitError || submitErrorProp) && (
        <p className="font-sans text-sm text-red-500">{submitError || submitErrorProp}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-6 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" fill="currentColor" className="opacity-75" />
            </svg>
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
