import Link from "next/link";
import { Recycle, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <Recycle className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Diab<span className="text-primary">Buy</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We buy your unused, factory-sealed diabetic supplies. Contact us on WhatsApp for a quick quote and same-day payment.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="/supplies" className="block text-sm text-muted-foreground hover:text-primary transition-colors">What We Buy</Link>
              <Link href="/get-offer" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Get Offer</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Categories We Buy</h3>
            <div className="space-y-2">
              <Link href="/supplies?category=CGM+Sensors" className="block text-sm text-muted-foreground hover:text-primary transition-colors">CGM Sensors</Link>
              <Link href="/supplies?category=Insulin+Pump+Supplies" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Insulin Pump Supplies</Link>
              <Link href="/supplies?category=Test+Strips" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Test Strips</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Contact Us</h3>
            <div className="space-y-3">
              <a
                href="https://wa.me/18001234567?text=Hi!%20I%20have%20some%20diabetic%20supplies%20to%20sell.%20Can%20you%20help?"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span>WhatsApp Us</span>
              </a>
              <p className="text-xs text-muted-foreground pl-10">
                Fastest way to get a quote!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} DiabBuy. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Helping people turn unused diabetic supplies into cash.
          </p>
        </div>
      </div>
    </footer>
  );
}
