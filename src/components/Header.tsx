"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const languages = [
  { code: "en", label: "EN" },
  { code: "hi", label: "HI" },
  { code: "bn", label: "BN" },
  { code: "te", label: "TE" },
  { code: "mr", label: "MR" },
  { code: "ta", label: "TA" },
  { code: "ur", label: "UR" },
  { code: "gu", label: "GU" },
  { code: "kn", label: "KN" },
  { code: "ml", label: "ML" },
  { code: "pa", label: "PA" },
  { code: "or", label: "OR" },
  { code: "as", label: "AS" }
];

const translations: Record<string, Record<string, string>> = {
  en: {
    services: "Services",
    explore: "Explore",
    interfaces: "Interfaces",
    localPro: "Local Pro",
    bookings: "Bookings",
    contact: "Contact",
    admin: "Admin",
    login: "Log in",
    register: "Book a Service",
    profile: "Profile",
    logout: "Log out",
    welcome: "Welcome",
    phone: "+91 6202770433"
  },
  hi: {
    services: "सेवाएँ",
    explore: "खोजें",
    interfaces: "इंटरफेस",
    localPro: "लोकल प्रो",
    bookings: "बुकिंग",
    contact: "संपर्क",
    admin: "एडमिन",
    login: "लॉगिन",
    register: "सेवा बुक करें",
    profile: "प्रोफ़ाइल",
    logout: "लॉग आउट",
    welcome: "स्वागत",
    phone: "+91 6202770433"
  },
  bn: {
    services: "সেবা",
    explore: "অনুসন্ধান",
    interfaces: "ইন্টারফেস",
    localPro: "লোকাল প্রো",
    bookings: "বুকিং",
    contact: "যোগাযোগ",
    admin: "অ্যাডমিন",
    login: "লগ ইন",
    register: "সেবা বুক করুন",
    profile: "প্রোফাইল",
    logout: "লগ আউট",
    welcome: "স্বাগতম",
    phone: "+91 6202770433"
  },
  te: {
    services: "సేవలు",
    explore: "అన్వేషించండి",
    interfaces: "ఇంటర్‌ఫేస్‌లు",
    localPro: "లోకల్ ప్రో",
    bookings: "బుకింగ్స్",
    contact: "సంప్రదించండి",
    admin: "అడ్మిన్",
    login: "లాగిన్",
    register: "సేవ బుక్ చేయండి",
    profile: "ప్రొఫైల్",
    logout: "లాగ్ అవుట్",
    welcome: "స్వాగతం",
    phone: "+91 6202770433"
  },
  mr: {
    services: "सेवा",
    explore: "शोधा",
    interfaces: "इंटरफेस",
    localPro: "लोकल प्रो",
    bookings: "बुकिंग",
    contact: "संपर्क",
    admin: "अॅडमिन",
    login: "लॉगिन",
    register: "सेवा बुक करा",
    profile: "प्रोफाइल",
    logout: "लॉग आउट",
    welcome: "स्वागत",
    phone: "+91 6202770433"
  },
  ta: {
    services: "சேவைகள்",
    explore: "தேடுங்கள்",
    interfaces: "இடைமுகங்கள்",
    localPro: "லோகல் புரோ",
    bookings: "முன்பதிவுகள்",
    contact: "தொடர்பு",
    admin: "நிர்வாகம்",
    login: "உள்நுழை",
    register: "சேவை புக் செய்",
    profile: "சுயவிவரம்",
    logout: "வெளியேறு",
    welcome: "வரவேற்கிறோம்",
    phone: "+91 6202770433"
  },
  ur: {
    services: "سروسز",
    explore: "تلاش کریں",
    interfaces: "انٹرفیس",
    localPro: "لوکل پرو",
    bookings: "بکنگز",
    contact: "رابطہ",
    admin: "ایڈمن",
    login: "لاگ اِن",
    register: "سروس بک کریں",
    profile: "پروفائل",
    logout: "لاگ آؤٹ",
    welcome: "خوش آمدید",
    phone: "+91 6202770433"
  },
  gu: {
    services: "સેવાઓ",
    explore: "શોધો",
    interfaces: "ઇન્ટરફેસ",
    localPro: "લોકલ પ્રો",
    bookings: "બુકિંગ્સ",
    contact: "સંપર્ક",
    admin: "એડમિન",
    login: "લૉગિન",
    register: "સેવા બુક કરો",
    profile: "પ્રોફાઇલ",
    logout: "લૉગઆઉટ",
    welcome: "સ્વાગત",
    phone: "+91 6202770433"
  },
  kn: {
    services: "ಸೇವೆಗಳು",
    explore: "ಅನ್ವೇಷಿಸಿ",
    interfaces: "ಇಂಟರ್ಫೇಸ್",
    localPro: "ಲೋಕಲ್ ಪ್ರೊ",
    bookings: "ಬುಕಿಂಗ್‌ಗಳು",
    contact: "ಸಂಪರ್ಕ",
    admin: "ಅಡ್ಮಿನ್",
    login: "ಲಾಗಿನ್",
    register: "ಸೇವೆ ಬುಕ್ ಮಾಡಿ",
    profile: "ಪ್ರೊಫೈಲ್",
    logout: "ಲಾಗ್ ಔಟ್",
    welcome: "ಸ್ವಾಗತ",
    phone: "+91 6202770433"
  },
  ml: {
    services: "സേവനങ്ങൾ",
    explore: "തിരയുക",
    interfaces: "ഇന്റർഫേസുകൾ",
    localPro: "ലോകൽ പ്രോ",
    bookings: "ബുക്കിംഗുകൾ",
    contact: "ബന്ധപ്പെടുക",
    admin: "അഡ്മിൻ",
    login: "ലോഗിൻ",
    register: "സേവനം ബുക്ക് ചെയ്യുക",
    profile: "പ്രൊഫൈൽ",
    logout: "ലോഗ് ഔട്ട്",
    welcome: "സ്വാഗതം",
    phone: "+91 6202770433"
  },
  pa: {
    services: "ਸੇਵਾਵਾਂ",
    explore: "ਖੋਜੋ",
    interfaces: "ਇੰਟਰਫੇਸ",
    localPro: "ਲੋਕਲ ਪ੍ਰੋ",
    bookings: "ਬੁਕਿੰਗਾਂ",
    contact: "ਸੰਪਰਕ",
    admin: "ਐਡਮਿਨ",
    login: "ਲੌਗਿਨ",
    register: "ਸੇਵਾ ਬੁੱਕ ਕਰੋ",
    profile: "ਪ੍ਰੋਫ਼ਾਈਲ",
    logout: "ਲੌਗ ਆਉਟ",
    welcome: "ਸਵਾਗਤ",
    phone: "+91 6202770433"
  },
  or: {
    services: "ସେବା",
    explore: "ଖୋଜନ୍ତୁ",
    interfaces: "ଇଣ୍ଟରଫେସ୍",
    localPro: "ଲୋକାଲ ପ୍ରୋ",
    bookings: "ବୁକିଂ",
    contact: "ଯୋଗାଯୋଗ",
    admin: "ଅ୍ୟାଡମିନ୍",
    login: "ଲଗଇନ୍",
    register: "ସେବା ବୁକ୍ କରନ୍ତୁ",
    profile: "ପ୍ରୋଫାଇଲ୍",
    logout: "ଲଗଆଉଟ୍",
    welcome: "ସ୍ବାଗତ",
    phone: "+91 6202770433"
  },
  as: {
    services: "সেৱাসমূহ",
    explore: "অন্বেষণ",
    interfaces: "ইণ্টাৰফেচ",
    localPro: "লোকেল প্ৰো",
    bookings: "বুকিং",
    contact: "যোগাযোগ",
    admin: "এডমিন",
    login: "লগ ইন",
    register: "সেৱা বুক কৰক",
    profile: "প্ৰফাইল",
    logout: "লগ আউট",
    welcome: "স্বাগতম",
    phone: "+91 6202770433"
  }
};

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const [language, setLanguage] = useState("en");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("localpulse_lang");
    if (stored && translations[stored]) {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("localpulse_lang", language);
  }, [language]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = useMemo(() => translations[language] ?? translations.en, [language]);

  const links = useMemo(
    () => [
      { href: "/services", label: t.services },
      { href: "/listings", label: t.explore },
      { href: "/interfaces", label: t.interfaces },
      { href: "/bookings", label: t.bookings },
      { href: "/contact", label: t.contact },
      { href: "/admin", label: t.admin }
    ],
    [t]
  );

  return (
    <header className="header" style={{
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.06)' : 'none'
    }}>
      <div className="container header-inner">
        {/* Left: Hamburger + Language */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            type="button"
            aria-label="Menu"
            style={{
              background: 'none',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)'
            }}
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <path d="M1 1h16M1 7h16M1 13h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid var(--color-border)',
            fontSize: '0.82rem',
            fontWeight: 600
          }}>
            {languages.slice(0, 2).map((lang, idx) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: language === lang.code ? 700 : 500,
                  opacity: language === lang.code ? 1 : 0.5,
                  fontSize: '0.82rem',
                  padding: '2px 4px'
                }}
              >
                {lang.label}
              </button>
            ))}
            <span style={{ opacity: 0.3 }}>/</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select language"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--color-heading)',
                width: '32px',
                padding: 0,
                appearance: 'none'
              }}
            >
              {languages.slice(2).map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Brand Logo */}
        <Link className="brand" href="/" style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="var(--color-primary)"/>
            <path d="M8 14h12M14 8v12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Local Services
        </Link>

        {/* Right: Phone + CTA */}
        <div className="nav-actions">
          <a href="tel:+916202770433" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.88rem',
            fontWeight: 500,
            color: 'var(--color-body)'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14.5 11.6v1.5a1 1 0 01-1.1 1A9.9 9.9 0 012 3.6a1 1 0 011-1.1h1.5a1 1 0 011 .7l.4 1.5a1 1 0 01-.2 1l-.7.7a8 8 0 004.4 4.4l.7-.7a1 1 0 011-.2l1.5.4a1 1 0 01.7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t.phone}
          </a>
          {isLoading ? null : user ? (
            <>
              <Link href="/profile" className="button ghost" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                {t.profile}
              </Link>
              <button className="button ghost" onClick={logout} type="button" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="button ghost" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                {t.login}
              </Link>
              <Link href="/register" className="button primary" style={{ padding: '10px 22px', fontSize: '0.85rem' }}>
                {t.register}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Desktop Nav Row */}
      <nav className="nav" style={{
        justifyContent: 'center',
        padding: '0 0 12px',
        borderTop: 'none'
      }}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="nav-link">
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          zIndex: 200,
          padding: '80px 32px 32px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <button
            onClick={() => setMobileOpen(false)}
            type="button"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '1.6rem',
              cursor: 'pointer',
              color: 'var(--color-heading)'
            }}
          >
            ✕
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: 'var(--color-heading)'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
