import { whyChooseUs } from "@/lib/data/content";
import { hospitalStats } from "@/lib/data/site";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/components/ui";
import { CountUp } from "@/components/ui/CountUp";
import { revealDelay } from "@/lib/use-scroll-reveal";

export function WhyChooseUs() {
  return (
    <section className="relative isolate overflow-hidden bg-primary-deep py-12 sm:py-14 lg:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[.22]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(60% 60% at 50% 40%, #000, transparent)",
        }}
      />
      <div className="shell relative">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow !text-secondary-400">Uncompromising Standards</p>
          <h2 className="mt-2 text-[1.75rem] leading-tight font-extrabold !text-white sm:text-[2.15rem] lg:text-[2.5rem]">
            Why Choose Brahmanandam Hospital?
          </h2>
          <span className="mx-auto mt-3 block h-[3px] w-16 rounded-full bg-secondary" />
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/72">
            Setting the regional standard for clinical outcomes, medical ethics,
            transparent pricing, and 24×7 emergency response in Jamshedpur.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item, i) => (
            <li
              key={item.title}
              data-reveal
              style={revealDelay(i, 90)}
              className="rounded-[1.125rem] border border-white/12 bg-white/[.07] p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:bg-white/[.11]"
            >
              <span
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-xl text-white",
                  item.tone === "secondary" ? "bg-secondary" : "bg-white/14",
                )}
              >
                <Icon name={item.icon} size={20} />
              </span>
              <h3 className="mt-5 text-[1.0625rem] font-extrabold !text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-white/70">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function StatsBand() {
  return (
    <section className="relative isolate bg-white py-11 sm:py-12">
      <div className="shell grid grid-cols-2 gap-y-9 lg:grid-cols-4">
        {hospitalStats.map((stat, i) => (
          <div
            key={stat.label}
            data-reveal
            style={revealDelay(i, 110)}
            className="text-center"
          >
            <CountUp
              value={stat.value}
              className={cn(
                "block font-display text-[2.25rem] leading-none font-extrabold tracking-[-0.03em] sm:text-[2.75rem]",
                stat.accent === "secondary" ? "text-secondary" : "text-primary",
              )}
            />
            <span
              className={cn(
                "mx-auto mt-2 block h-[3px] w-10 rounded-full",
                stat.accent === "secondary" ? "bg-primary" : "bg-secondary",
              )}
            />
            <p className="mt-2.5 text-[0.9375rem] font-bold text-primary">
              {stat.label}
            </p>
            <p className="mt-1 text-[0.8125rem] text-muted">{stat.caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
