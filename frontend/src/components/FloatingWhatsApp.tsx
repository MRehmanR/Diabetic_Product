import { MessageCircle } from "lucide-react";
import { BUSINESS } from "@/lib/data";

export function FloatingWhatsApp() {
  const href = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
    `Hello ${BUSINESS.name}, I would like to sell my diabetes care products.`,
  )}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 font-semibold text-whatsapp-foreground shadow-glow transition-transform hover:scale-105 animate-float"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
