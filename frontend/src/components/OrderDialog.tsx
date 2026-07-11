import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Product,
  type OrderDetails,
  buildWhatsappLink,
  BUSINESS,
  categoryName,
  formatPayout,
  submitOffer,
} from "@/lib/data";

const emptyDetails: OrderDetails = {
  name: "",
  email: "",
  phone: "",
  city: "",
  quantity: "1",
  condition: "New sealed",
  monthsLeft: "7+ months",
  expiryDate: "",
  notes: "",
};

const steps = [
  "Product",
  "Contact",
  "Quantity",
  "Condition",
  "Expiry",
  "Notes",
  "Send",
];

export function OrderDialog({
  product,
  children,
  disabled,
}: {
  product: Product;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState<OrderDetails>(emptyDetails);
  const [submitting, setSubmitting] = useState(false);

  const progress = useMemo(() => Math.round(((step + 1) / steps.length) * 100), [step]);

  const set = (key: keyof OrderDetails, value: string) =>
    setDetails((d) => ({ ...d, [key]: value }));

  function reset() {
    setStep(0);
    setDetails(emptyDetails);
    setSubmitting(false);
  }

  function close(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) reset();
  }

  function validateCurrentStep() {
    if (step === 1) {
      if (!details.name.trim()) {
        toast.error("Please enter your name.");
        return false;
      }
      if (!details.phone.trim()) {
        toast.error("WhatsApp number is required.");
        return false;
      }
      if (details.email.trim() && !/^\S+@\S+\.\S+$/.test(details.email.trim())) {
        toast.error("Enter a valid email address or leave email empty.");
        return false;
      }
    }
    if (step === 2 && (!details.quantity || Number(details.quantity) < 1)) {
      toast.error("Quantity must be at least 1.");
      return false;
    }
    return true;
  }

  function next() {
    if (!validateCurrentStep()) return;
    setStep((value) => Math.min(value + 1, steps.length - 1));
  }

  async function submit() {
    if (!details.name.trim() || !details.phone.trim()) {
      toast.error("Name and WhatsApp number are required.");
      setStep(1);
      return;
    }

    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/products/${product.id}`
        : `/products/${product.id}`;

    try {
      setSubmitting(true);
      await submitOffer({ product, details });
      window.open(buildWhatsappLink(product, url, details), "_blank", "noopener");
      close(false);
      toast.success("Offer saved. Opening WhatsApp with your product details...");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit your offer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="leading-snug">Product offer details</DialogTitle>
          <DialogDescription>
            Step {step + 1} of {steps.length}: {steps[step]}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>{steps[step]}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
              <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-muted-foreground">
                    <Package className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {categoryName(product.category)}
                </p>
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <p className="text-sm font-semibold text-secondary">{formatPayout(product)}</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4">
              <Field label="Name" id="offer-name" required>
                <Input
                  id="offer-name"
                  value={details.name}
                  maxLength={100}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Your full name"
                />
              </Field>
              <Field label="WhatsApp number" id="offer-phone" required>
                <Input
                  id="offer-phone"
                  value={details.phone}
                  maxLength={40}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder={BUSINESS.phone}
                />
              </Field>
              <Field label="Email" id="offer-email" hint="Optional">
                <Input
                  id="offer-email"
                  type="email"
                  value={details.email}
                  maxLength={255}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="City" id="offer-city" hint="Optional">
                <Input
                  id="offer-city"
                  value={details.city}
                  maxLength={100}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Your city"
                />
              </Field>
            </div>
          )}

          {step === 2 && (
            <Field label="Quantity" id="offer-quantity" required>
              <Input
                id="offer-quantity"
                type="number"
                min={1}
                value={details.quantity}
                onChange={(e) => set("quantity", e.target.value)}
              />
            </Field>
          )}

          {step === 3 && (
            <Field label="Product condition" id="offer-condition" required>
              <Select value={details.condition} onValueChange={(value) => set("condition", value)}>
                <SelectTrigger id="offer-condition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New sealed">New sealed</SelectItem>
                  <SelectItem value="New open box">New open box</SelectItem>
                  <SelectItem value="Used">Used</SelectItem>
                  <SelectItem value="Damaged box">Damaged box</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}

          {step === 4 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Expiration date" id="offer-expiry" hint="Optional">
                <Input
                  id="offer-expiry"
                  type="date"
                  value={details.expiryDate}
                  onChange={(e) => set("expiryDate", e.target.value)}
                />
              </Field>
              <Field label="Months left" id="offer-months" required>
                <Select value={details.monthsLeft} onValueChange={(value) => set("monthsLeft", value)}>
                  <SelectTrigger id="offer-months">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7+ months">7+ months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                    <SelectItem value="5 months">5 months</SelectItem>
                    <SelectItem value="Less than 5 months">Less than 5 months</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}

          {step === 5 && (
            <Field label="Extra notes" id="offer-notes" hint="Optional">
              <Textarea
                id="offer-notes"
                value={details.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={5}
                placeholder="Add packaging details, expiry notes, pickup preference, or anything else we should know."
              />
            </Field>
          )}

          {step === 6 && (
            <div className="space-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
              <ReviewRow label="Product" value={product.name} />
              <ReviewRow label="Name" value={details.name} />
              <ReviewRow label="WhatsApp" value={details.phone} />
              {details.email && <ReviewRow label="Email" value={details.email} />}
              {details.city && <ReviewRow label="City" value={details.city} />}
              <ReviewRow label="Quantity" value={details.quantity} />
              <ReviewRow label="Condition" value={details.condition} />
              <ReviewRow label="Months left" value={details.monthsLeft} />
              <ReviewRow label="Expiry date" value={details.expiryDate || "N/A"} />
              {details.notes && <ReviewRow label="Notes" value={details.notes} />}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button type="button" variant="outline" disabled={step === 0 || submitting} onClick={() => setStep((value) => Math.max(value - 1, 0))}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button type="button" onClick={next}>
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
            >
              {submitting ? (
                <>
                  <Check className="h-4 w-4" /> Saving...
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4" /> Send on WhatsApp
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  id,
  required,
  hint,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id}>{label}{required ? " *" : ""}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[120px_1fr]">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="break-words text-foreground">{value}</span>
    </div>
  );
}
