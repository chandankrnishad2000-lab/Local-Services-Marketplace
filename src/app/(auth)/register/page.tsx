"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    
    // Check if passwords match
    if (payload.password !== payload.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Registration failed.");
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push("/listings");
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex h-auto min-h-[calc(100vh-140px)] w-full flex-col overflow-x-hidden p-6 max-w-md mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center pb-6 justify-between mt-6">
        <button onClick={() => router.back()} className="text-slate-900 flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-orange-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </button>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Create Account</h2>
      </div>

      <div className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl min-h-[180px] bg-orange-100/50 mb-6" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")' }}>
      </div>

      <div className="flex flex-col pb-8">
        <h1 className="text-slate-900 tracking-tight text-[32px] font-bold leading-tight text-center pb-2">Join Our Community</h1>
        <p className="text-slate-600 text-center text-sm mb-6">Enter your details to get started with your new account</p>

        {/* Form Container */}
        <form className="flex flex-col gap-4 w-full" onSubmit={onSubmit}>
          {/* Full Name Field */}
          <div className="flex flex-col w-full">
            <p className="text-slate-900 text-sm font-medium leading-normal pb-2">Full Name</p>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input className="form-input flex w-full rounded-xl text-slate-900 focus:outline-0 focus:ring-2 focus:ring-[#ec5b13] border border-slate-200 bg-white h-14 placeholder:text-slate-400 pl-12 pr-4 text-base font-normal leading-normal" placeholder="John Doe" type="text" name="name" required />
            </div>
          </div>

          {/* Email Address Field */}
          <div className="flex flex-col w-full">
            <p className="text-slate-900 text-sm font-medium leading-normal pb-2">Email Address</p>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <input className="form-input flex w-full rounded-xl text-slate-900 focus:outline-0 focus:ring-2 focus:ring-[#ec5b13] border border-slate-200 bg-white h-14 placeholder:text-slate-400 pl-12 pr-4 text-base font-normal leading-normal" placeholder="example@mail.com" type="email" name="email" required />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col w-full">
            <p className="text-slate-900 text-sm font-medium leading-normal pb-2">Password</p>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input className="form-input flex w-full rounded-xl text-slate-900 focus:outline-0 focus:ring-2 focus:ring-[#ec5b13] border border-slate-200 bg-white h-14 placeholder:text-slate-400 pl-12 pr-12 text-base font-normal leading-normal" placeholder="Create a password" type="password" name="password" required minLength={8} />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col w-full">
            <p className="text-slate-900 text-sm font-medium leading-normal pb-2">Confirm Password</p>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input className="form-input flex w-full rounded-xl text-slate-900 focus:outline-0 focus:ring-2 focus:ring-[#ec5b13] border border-slate-200 bg-white h-14 placeholder:text-slate-400 pl-12 pr-4 text-base font-normal leading-normal" placeholder="Repeat password" type="password" name="confirmPassword" required minLength={8} />
            </div>
          </div>
          
          {/* Role Field */}
          <div className="flex flex-col w-full">
            <p className="text-slate-900 text-sm font-medium leading-normal pb-2">I am signing up as a...</p>
            <div className="relative">
              <select name="role" defaultValue="CUSTOMER" className="form-select flex w-full rounded-xl text-slate-900 focus:outline-0 focus:ring-2 focus:ring-[#ec5b13] border border-slate-200 bg-white h-14 pl-4 pr-10 text-base font-normal leading-normal appearance-none cursor-pointer">
                <option value="CUSTOMER">Customer (Looking to book services)</option>
                <option value="LOCAL_PRO">Local Pro (Looking to offer services)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm font-medium text-center">{error}</p>}

          {/* Terms and Conditions */}
          <div className="flex items-center gap-2 mt-2">
            <input className="rounded border-slate-300 text-[#ec5b13] focus:ring-[#ec5b13] h-4 w-4 bg-white" id="terms" type="checkbox" required />
            <label className="text-sm text-slate-600 leading-tight" htmlFor="terms">
              I agree to the <Link className="text-[#ec5b13] font-semibold hover:underline" href="#">Terms of Service</Link> and <Link className="text-[#ec5b13] font-semibold hover:underline" href="#">Privacy Policy</Link>
            </label>
          </div>

          {/* Sign Up Button */}
          <button type="submit" disabled={loading} className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-[#ec5b13] text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-[#ec5b13]/20 hover:bg-[#ec5b13]/90 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
            <span className="truncate">{loading ? "Creating Account..." : "Create Account"}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="h-[1px] flex-1 bg-slate-200"></div>
          <p className="text-slate-500 text-sm font-medium">Or sign up with</p>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>

        {/* Social Sign-up Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button type="button" className="flex items-center justify-center gap-2 h-14 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span className="text-slate-700 font-semibold text-sm">Google</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-2 h-14 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm">
            <svg className="h-5 w-5" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
            </svg>
            <span className="text-slate-700 font-semibold text-sm">Apple</span>
          </button>
        </div>

        {/* Login Link */}
        <div className="mt-8 text-center pb-8 border-t border-slate-200 pt-6">
          <p className="text-slate-600">Already have an account? 
            <Link className="text-[#ec5b13] font-bold hover:underline ml-2" href="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
