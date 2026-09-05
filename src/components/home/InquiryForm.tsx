import { useState, type FormEvent } from "react";
import { CheckCircle2, Lock, Send } from "lucide-react";
import { site } from "@/lib/data/site";

type Errors = Partial<Record<"name" | "phone" | "subject" | "message", string>>;

export function InquiryForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    subject: defaultSubject,
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof values, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (values.name.trim().length < 3) next.name = "Please enter your full name";
    if (!/^[6-9]\d{9}$/.test(values.phone.trim()))
      next.phone = "Enter a valid 10-digit mobile number";
    if (values.subject.trim().length < 3)
      next.subject = "Tell us the department or subject";
    if (values.message.trim().length < 10)
      next.message = "Please describe your requirement (min. 10 characters)";
    setErrors(next);
    if (Object.keys(next).length) return;
    // No backend yet — replace with a POST to the hospital CRM/API endpoint.
    setSent(true);
  };

  if (sent) {
    return (
      <div
        role="status"
        className="flex h-full min-h-[26rem] flex-col items-center justify-center rounded-[1.25rem] border border-line bg-white p-8 text-center shadow-card"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-[rgba(15,157,110,.1)] text-success">
          <CheckCircle2 size={30} strokeWidth={2} />
        </span>
        <h3 className="mt-5 text-[1.375rem] font-extrabold">Inquiry Received</h3>
        <p className="mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
          Thank you, {values.name.split(" ")[0]}. Our hospital helpdesk will call
          you on {values.phone} within 15 minutes during OPD hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setValues({ name: "", phone: "", subject: defaultSubject, message: "" });
          }}
          className="mt-6 inline-flex h-11 items-center rounded-full bg-[rgba(47,59,128,.06)] px-6 text-[0.875rem] font-bold text-primary hover:bg-[rgba(47,59,128,.11)]"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-[1.25rem] border border-line bg-white p-6 shadow-card sm:p-8"
      aria-label="Send an inquiry or request a callback"
    >
      <h3 className="text-[1.3125rem] font-extrabold">
        Send an Inquiry or Request Callback
      </h3>
      <p className="mt-1.5 text-[0.875rem] text-muted">
        Our hospital helpdesk responds within 15 minutes during OPD hours.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="cf-name"
            label="Your Name"
            placeholder="Full name"
            value={values.name}
            onChange={(v) => set("name", v)}
            error={errors.name}
            autoComplete="name"
          />
          <Field
            id="cf-phone"
            label="Phone Number"
            placeholder="10-digit mobile"
            value={values.phone}
            onChange={(v) => set("phone", v.replace(/\D/g, "").slice(0, 10))}
            error={errors.phone}
            inputMode="numeric"
            autoComplete="tel-national"
          />
        </div>

        <Field
          id="cf-subject"
          label="Subject / Department"
          placeholder="e.g. OPD timing, Cashless TPA inquiry, Doctor consultation"
          value={values.subject}
          onChange={(v) => set("subject", v)}
          error={errors.subject}
        />

        <div>
          <label htmlFor="cf-message" className="label">
            Message / Clinical Query
          </label>
          <textarea
            id="cf-message"
            rows={4}
            className="field resize-y"
            placeholder="Briefly describe your medical requirement or inquiry..."
            value={values.message}
            aria-invalid={errors.message ? "true" : undefined}
            aria-describedby={errors.message ? "cf-message-err" : undefined}
            onChange={(e) => set("message", e.target.value)}
          />
          {errors.message ? (
            <p id="cf-message-err" className="mt-1 text-[0.75rem] font-medium text-secondary">
              {errors.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          className="inline-flex h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-xl bg-primary text-[0.9375rem] font-extrabold tracking-[0.02em] text-white transition-colors hover:bg-primary-800"
        >
          SUBMIT INQUIRY
          <Send size={17} strokeWidth={2.2} />
        </button>

        <div className="flex flex-col gap-2 border-t border-line pt-4 text-[0.8125rem] sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-muted">
            <Lock size={14} className="text-success" />
            Strict Medical Confidentiality
          </p>
          <p className="text-muted">
            Need urgent help? Call{" "}
            <a href={site.phoneHref} className="font-bold text-secondary hover:underline">
              {site.phone}
            </a>
          </p>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  inputMode,
  autoComplete,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  inputMode?: "numeric" | "text";
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        className="field"
        placeholder={placeholder}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? (
        <p id={`${id}-err`} className="mt-1 text-[0.75rem] font-medium text-secondary">
          {error}
        </p>
      ) : null}
    </div>
  );
}
