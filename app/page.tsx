import Link from "next/link";
import Logo from "@/components/Logo";
import { Check, Flame, HeartPulse, Salad, Trophy, LineChart, ArrowRight, Star } from "lucide-react";

const benefits = [
  { icon: Salad, title: "Real food, real results", desc: "Simple recipes anyone can cook — no restrictive diets." },
  { icon: HeartPulse, title: "Built for your body", desc: "Plans that adapt to your goals, schedule and preferences." },
  { icon: Trophy, title: "21-day challenges", desc: "Stay consistent with structured, gamified routines." },
  { icon: LineChart, title: "Track real progress", desc: "Weight, water, streaks and calories — all in one place." },
];

const steps = [
  { n: "01", title: "Set your goal", desc: "Tell us your current weight, goal weight and timeline." },
  { n: "02", title: "Get your plan", desc: "Receive recipes, routines and a 21-day challenge tailored for you." },
  { n: "03", title: "Track & win", desc: "Log progress daily and watch the streak grow." },
];

const recipes = [
  { name: "Green protein bowl", kcal: 420, tag: "High protein", emoji: "🥗" },
  { name: "Avocado toast plus", kcal: 310, tag: "Breakfast", emoji: "🥑" },
  { name: "Lemon herb salmon", kcal: 480, tag: "Dinner", emoji: "🐟" },
  { name: "Berry power smoothie", kcal: 220, tag: "Snack", emoji: "🍓" },
];

const plans = [
  { name: "Free", price: "$0", per: "forever", features: ["Basic recipes", "Weight tracker", "Community access"], cta: "Get started" },
  { name: "Premium", price: "$9", per: "/month", features: ["All recipes", "21-day challenges", "Progress analytics", "Meal planner"], cta: "Start Premium", featured: true },
  { name: "VIP", price: "$29", per: "/month", features: ["Everything in Premium", "1:1 coach chat", "Custom meal plans", "Priority support"], cta: "Go VIP" },
];

const faqs = [
  { q: "Do I need a gym?", a: "No. Levefy focuses on nutrition and simple routines you can do at home." },
  { q: "Is it really sustainable?", a: "Yes — no impossible diets. Real food, simple habits, gradual progress." },
  { q: "Can I cancel anytime?", a: "Absolutely. Manage or cancel your plan in one click from your profile." },
  { q: "Is there a free trial?", a: "The Free plan lets you explore the core experience with no time limit." },
];

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#benefits" className="hover:text-slate-900">Benefits</a>
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-semibold text-slate-700 px-4 py-2">Sign in</Link>
            <Link href="/dashboard" className="btn-primary !py-2 !px-4 text-sm">Start Now</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 to-white" />
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" /> Join 12,000+ losing weight the healthy way
            </span>
            <h1 className="mt-6 text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Lose weight without <span className="text-gradient">impossible diets.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-lg">
              Levefy combines simple routines, healthy recipes and a 21-day challenge so you build the habits that actually last.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="btn-primary">Start Now <ArrowRight className="w-4 h-4 ml-2" /></Link>
              <Link href="/challenge" className="btn-ghost">Join the Challenge</Link>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {["bg-brand-300","bg-brand-400","bg-brand-500","bg-brand-600"].map((c,i)=>(
                  <span key={i} className={`w-8 h-8 rounded-full border-2 border-white ${c}`} />
                ))}
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_,i)=>(<Star key={i} className="w-4 h-4 fill-current" />))}
                <span className="ml-2 text-slate-600">4.9/5 from 2,800+ members</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 gradient-brand opacity-20 blur-3xl rounded-full" />
            <div className="relative card p-6 lg:p-8 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">This week</p>
                  <p className="text-2xl font-bold">-1.4 kg</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">On track</span>
              </div>
              <div className="mt-6 h-32 flex items-end gap-2">
                {[40,55,48,70,62,78,90].map((h,i)=>(
                  <div key={i} className="flex-1 rounded-t-lg gradient-brand opacity-90" style={{height: `${h}%`}} />
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Streak</p><p className="font-bold text-lg">14d</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Water</p><p className="font-bold text-lg">2.1L</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Kcal</p><p className="font-bold text-lg">1,640</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold">Why Levefy works</h2>
            <p className="mt-3 text-slate-600">Designed by people who lost weight and kept it off.</p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map(({icon:Icon,title,desc})=>(
              <div key={title} className="card p-6">
                <span className="w-11 h-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center"><Icon className="w-5 h-5"/></span>
                <h3 className="mt-4 font-semibold text-lg">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold">How it works</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {steps.map(s=>(
              <div key={s.n} className="card p-7">
                <p className="text-gradient font-bold text-3xl">{s.n}</p>
                <h3 className="mt-3 font-semibold text-lg">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipes preview */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold">Recipes you'll actually want to cook</h2>
              <p className="mt-3 text-slate-600">Fresh, fast, and crafted for fat loss.</p>
            </div>
            <Link href="/recipes" className="text-brand-700 font-semibold inline-flex items-center gap-1">Browse all <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recipes.map(r=>(
              <div key={r.name} className="card overflow-hidden group">
                <div className="aspect-[4/3] gradient-brand flex items-center justify-center text-6xl">{r.emoji}</div>
                <div className="p-5">
                  <p className="text-xs text-brand-700 font-semibold">{r.tag}</p>
                  <h3 className="mt-1 font-semibold">{r.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{r.kcal} kcal</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="rounded-3xl gradient-brand text-white p-10 lg:p-16 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-white/10 rounded-full" />
            <div className="absolute -right-10 top-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">21-DAY CHALLENGE</span>
              <h2 className="mt-5 text-3xl lg:text-5xl font-bold">Build the habit in 21 days.</h2>
              <p className="mt-4 text-white/85 text-lg">A guided daily plan that makes healthy living automatic. Small wins, daily streaks, real change.</p>
              <Link href="/challenge" className="mt-8 inline-flex items-center justify-center rounded-full bg-white text-brand-700 font-semibold px-6 py-3 hover:bg-brand-50 transition">
                Join the Challenge <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold">Progress you can see</h2>
            <p className="mt-3 text-slate-600">Weight charts, streaks, water intake and calorie summaries — beautifully simple.</p>
            <ul className="mt-6 space-y-3">
              {["Weekly weight chart","Daily streak counter","Water + calories tracker","Body measurements"].map(t=>(
                <li key={t} className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-brand-600" /> {t}</li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-brand-50 p-5"><p className="text-xs text-brand-700 font-semibold">CURRENT</p><p className="text-3xl font-bold mt-1">72.4 kg</p><p className="text-xs text-slate-500 mt-1">-3.6 kg total</p></div>
              <div className="rounded-2xl bg-slate-100 p-5"><p className="text-xs text-slate-600 font-semibold">GOAL</p><p className="text-3xl font-bold mt-1">68.0 kg</p><p className="text-xs text-slate-500 mt-1">12 weeks</p></div>
            </div>
            <div className="mt-4 h-40 flex items-end gap-1.5">
              {[80,72,76,68,70,60,64,55,58,48,50,40].map((h,i)=>(
                <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400" style={{height:`${h}%`}}/>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold">Loved by members</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {[
              { name: "Sara K.", lost: "-8 kg in 3 months", quote: "Finally something that fits my real life. Recipes are amazing." },
              { name: "Daniel R.", lost: "-12 kg in 5 months", quote: "The 21-day challenge changed my mindset completely." },
              { name: "Mia L.", lost: "-6 kg in 2 months", quote: "Simple, beautiful and motivating. I look forward to opening the app." },
            ].map(t=>(
              <div key={t.name} className="card p-6">
                <div className="flex items-center gap-1 text-amber-500">{[...Array(5)].map((_,i)=>(<Star key={i} className="w-4 h-4 fill-current"/>))}</div>
                <p className="mt-4 text-slate-700">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full gradient-brand" />
                  <div><p className="font-semibold text-sm">{t.name}</p><p className="text-xs text-brand-700">{t.lost}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold">Simple, honest pricing</h2>
            <p className="mt-3 text-slate-600">Start free. Upgrade anytime.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {plans.map(p=>(
              <div key={p.name} className={`card p-7 relative ${p.featured ? "ring-2 ring-brand-600 scale-[1.02]" : ""}`}>
                {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-brand text-white text-xs font-semibold">Most popular</span>}
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="mt-2"><span className="text-4xl font-bold">{p.price}</span><span className="text-slate-500">{p.per}</span></p>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map(f=>(<li key={f} className="flex items-center gap-2 text-sm text-slate-700"><Check className="w-4 h-4 text-brand-600"/> {f}</li>))}
                </ul>
                <Link href="/membership" className={`mt-7 inline-flex w-full justify-center ${p.featured ? "btn-primary" : "btn-ghost"}`}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center">Frequently asked</h2>
          <div className="mt-10 space-y-3">
            {faqs.map(f=>(
              <details key={f.q} className="card p-5 group">
                <summary className="cursor-pointer font-semibold flex justify-between items-center">{f.q}<span className="text-brand-600 group-open:rotate-45 transition">+</span></summary>
                <p className="mt-3 text-slate-600 text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold">Your healthier life starts today.</h2>
          <p className="mt-4 text-slate-600 text-lg">Join thousands building lasting habits with Levefy.</p>
          <Link href="/dashboard" className="btn-primary mt-8 text-base">Start Now <ArrowRight className="w-4 h-4 ml-2"/></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          <Logo />
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} Levefy. All rights reserved.</p>
          <div className="flex gap-5 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="#" className="hover:text-slate-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
