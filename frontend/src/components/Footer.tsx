import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone, MapPin, Facebook } from "lucide-react";
import { BUSINESS } from "@/lib/data";
import logoUrl from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoUrl} alt={`${BUSINESS.name} logo`} className="h-10 w-10 rounded-xl object-contain" />
            <span className="font-display text-lg font-extrabold">{BUSINESS.name}</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            {BUSINESS.tagline}. Share what you have, then continue on WhatsApp with a real person from our team.
          </p>
          <a
            href={BUSINESS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Facebook className="h-4 w-4" /> Follow us on Facebook
          </a>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-primary">Products We Buy</Link></li>
            <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link to="/about" className="hover:text-primary">How It Works</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-primary">Start an Offer</Link></li>
            <li><Link to="/contact" className="hover:text-primary">WhatsApp Support</Link></li>
            <li><Link to="/about" className="hover:text-primary">How It Works</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {BUSINESS.phone}</li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-secondary" /> WhatsApp: {BUSINESS.phone}</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {BUSINESS.city}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        (c) {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
      </div>
    </footer>
  );
}
