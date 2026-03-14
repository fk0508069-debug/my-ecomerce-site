"use client";
// import { useCart } from "@/context/CartContext";
import Link from "next/link";
export default function Navbar({ onCartOpen }) {
  // const { count } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 border-b border-white/8">
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-md" />
      <nav className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 rounded-sm bg-amber-400 flex items-center justify-center">
            <span className="text-ink text-xs font-bold">L</span>
          </div>
          <span className="font-display text-lg text-cream tracking-wide">Luxe</span>
        </a>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {["Shop", "Collections", "About"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-cream/50 text-xs tracking-[0.2em] uppercase hover:text-cream transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onCartOpen}
            className="relative flex items-center gap-2 text-cream/70 hover:text-cream transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            <span className="text-xs tracking-wide">Cart</span>
            {/* {count > 0 && (
              <span
              className="absolute -top-2 -right-3 w-4 h-4 bg-amber-400 text-ink text-[10px]
              font-bold rounded-full flex items-center justify-center"
              >
              {count}
              </span>
              )} */}
          </button>
              <Link href="/profile">Profile</Link>
        </div>
      </nav>
    </header>
  );
}
