"use client";

import { useMemo, useState } from "react";

type Airport = { city: string; code: string; region: string };

const airports: Airport[] = [
  ["Akron / Canton", "CAK", "US"], ["Albany", "ALB", "US"], ["Arcata / Eureka", "ACV", "US"], ["Atlantic City", "ACY", "US"], ["Baltimore / Washington", "BWI", "US"], ["Bangor", "BGR", "US"],
  ["Birmingham", "BHM", "US"], ["Brownsville", "BRO", "US"], ["Burbank", "BUR", "US"], ["Burlington", "BTV", "US"], ["Charleston, SC", "CHS", "US"], ["Charleston, WV", "CRW", "US"],
  ["Cincinnati", "CVG", "US"], ["Columbus", "CMH", "US"], ["Dallas / Fort Worth", "DFW", "US"], ["Dayton", "DAY", "US"], ["Daytona Beach", "DAB", "US"], ["Denver", "DEN", "US"],
  ["Erie", "ERI", "US"], ["Evansville", "EVV", "US"], ["Fayetteville / Northwest Arkansas", "XNA", "US"], ["Fort Lauderdale", "FLL", "US"], ["Fort Myers", "RSW", "US"], ["Grand Junction", "GJT", "US"],
  ["Greensboro", "GSO", "US"], ["Greenville / Spartanburg", "GSP", "US"], ["Gulfport / Biloxi", "GPT", "US"], ["Hartford", "BDL", "US"], ["Huntsville", "HSV", "US"], ["Jacksonville", "JAX", "US"],
  ["Key West", "EYW", "US"], ["Lancaster", "LNS", "US"], ["Lansing", "LAN", "US"], ["Las Vegas", "LAS", "US"], ["Lincoln", "LNK", "US"], ["Long Island / Islip", "ISP", "US"],
  ["Los Angeles", "LAX", "US"], ["Louisville", "SDF", "US"], ["Madison", "MSN", "US"], ["Manchester", "MHT", "US"], ["Memphis", "MEM", "US"], ["Myrtle Beach", "MYR", "US"],
  ["New Bern", "EWN", "US"], ["New Haven", "HVN", "US"], ["New Orleans", "MSY", "US"], ["Newark", "EWR", "US"], ["Newburgh / Stewart", "SWF", "US"], ["Norfolk", "ORF", "US"],
  ["Ogden", "OGD", "US"], ["Ogdensburg", "OGS", "US"], ["Orlando", "MCO", "US"], ["Pensacola", "PNS", "US"], ["Phoenix", "PHX", "US"], ["Pittsburgh", "PIT", "US"],
  ["Portland, ME", "PWM", "US"], ["Portsmouth", "PSM", "US"], ["Providence", "PVD", "US"], ["Provo / Salt Lake City", "PVU", "US"], ["Raleigh / Durham", "RDU", "US"], ["Redmond / Bend", "RDM", "US"],
  ["Richmond", "RIC", "US"], ["Rochester", "ROC", "US"], ["Salisbury / Ocean City", "SBY", "US"], ["San Antonio", "SAT", "US"], ["San Bernardino", "SBD", "US"], ["San Diego", "SAN", "US"],
  ["San Francisco", "SFO", "US"], ["Santa Ana / Orange County", "SNA", "US"], ["Sarasota / Bradenton", "SRQ", "US"], ["Savannah", "SAV", "US"], ["South Bend", "SBN", "US"], ["Springfield", "SPI", "US"],
  ["Syracuse", "SYR", "US"], ["Tallahassee", "TLH", "US"], ["Tampa", "TPA", "US"], ["Trenton", "TTN", "US"], ["Tri-Cities", "TRI", "US"], ["Twin Falls", "TWF", "US"],
  ["Vero Beach", "VRB", "US"], ["Washington / Dulles", "IAD", "US"], ["West Palm Beach", "PBI", "US"], ["White Plains", "HPN", "US"], ["Wilkes-Barre / Scranton", "AVP", "US"], ["Wilmington, NC", "ILM", "US"],
  ["Cancún", "CUN", "International"], ["Montego Bay", "MBJ", "International"], ["Nassau", "NAS", "International"], ["Punta Cana", "PUJ", "International"], ["San José, Costa Rica", "SJO", "International"], ["St. Thomas", "STT", "International"],
].map(([city, code, region]) => ({ city, code, region }));

const courses = [
  { title: "Aviation Foundations", subtitle: "Aircraft, airline basics & terminology", icon: "✈" },
  { title: "Emergency Procedures", subtitle: "Safety, evacuation & abnormal situations", icon: "＋" },
  { title: "Safety & Security", subtitle: "Cabin security, compliance & awareness", icon: "◇" },
  { title: "Service & Hospitality", subtitle: "Guest experience from boarding to landing", icon: "○" },
  { title: "Onboard Operations", subtitle: "Cabin flow, equipment & procedures", icon: "▱" },
  { title: "Medical & First Aid", subtitle: "Recognizing and responding to medical events", icon: "＋" },
  { title: "Breeze Knowledge", subtitle: "Airline-specific policies & standards", icon: "✦" },
  { title: "Final Cabin Check", subtitle: "Mixed review before training day", icon: "✓" },
];

const starterQuestions = [
  { q: "What is the primary purpose of a cabin crew member during an emergency?", options: ["Protect and evacuate guests safely", "Serve refreshments", "Complete paperwork", "Prepare the cockpit"], answer: 0, why: "Safety and emergency response are the cabin crew's primary responsibilities when an emergency occurs." },
  { q: "What does IAD identify?", options: ["Washington Dulles International Airport", "Baltimore/Washington International", "Newark Liberty International", "Long Island MacArthur Airport"], answer: 0, why: "IAD is the IATA code for Washington Dulles International Airport." },
  { q: "Which action best supports clear cabin communication?", options: ["Use concise, standardized language", "Speak as quickly as possible", "Avoid confirming instructions", "Use different terms for the same procedure"], answer: 0, why: "Standardized, concise communication reduces ambiguity and supports coordinated crew actions." },
];

export default function Home() {
  const [tab, setTab] = useState("home");
  const [completed, setCompleted] = useState(0);
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [noteDraft, setNoteDraft] = useState("");
  const [selected, setSelected] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);

  const filteredAirports = useMemo(() => airports.filter(a => `${a.city} ${a.code}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const activeCourse = Math.min(completed, courses.length - 1);

  const addNote = () => {
    if (!noteDraft.trim()) return;
    setNotes([noteDraft.trim(), ...notes]);
    setNoteDraft("");
  };

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#171716]">
      <div className="mx-auto min-h-screen max-w-6xl px-5 pb-28 pt-6 sm:px-8">
        <header className="flex items-center justify-between border-b border-black/10 pb-5">
          <button onClick={() => setTab("home")} className="text-left">
            <div className="font-serif text-2xl tracking-tight">CabinReady</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-[0.28em] text-black/50">Flight attendant training</div>
          </button>
          <div className="rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-medium">OCT 2026</div>
        </header>

        {tab === "home" && (
          <>
            <section className="grid gap-8 py-10 lg:grid-cols-[1.4fr_.8fr] lg:items-end">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-black/45">Training day prep</p>
                <h1 className="max-w-3xl font-serif text-5xl leading-[.95] tracking-[-.04em] sm:text-7xl">Let&apos;s get<br />cabin-ready.</h1>
                <p className="mt-6 max-w-xl text-lg leading-7 text-black/60">A calm, focused study space for building confidence before training.</p>
                <button onClick={() => setTab("practice")} className="mt-7 rounded-full bg-[#171716] px-6 py-3 text-sm font-semibold text-[#f7f4ee]">Start practice →</button>
              </div>
              <div className="rounded-[2rem] border border-black/10 bg-[#e7dfd0] p-6 sm:p-8">
                <div className="text-xs uppercase tracking-[.2em] text-black/45">Training passport</div>
                <div className="mt-3 flex items-end justify-between"><span className="font-serif text-4xl">{completed}/8</span><span className="text-sm text-black/50">completed</span></div>
                <div className="mt-5 flex gap-1.5">{courses.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i < completed ? "bg-[#171716]" : "bg-black/10"}`} />)}</div>
                <p className="mt-5 text-sm text-black/60">Next checkpoint</p><p className="mt-1 font-semibold">{courses[activeCourse].title}</p>
              </div>
            </section>

            <section className="py-8">
              <div className="mb-5 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-black/40">Your route</p><h2 className="mt-1 font-serif text-3xl">Training journey</h2></div><button onClick={() => setTab("journey")} className="text-sm underline underline-offset-4">Open map</button></div>
              <div className="overflow-x-auto pb-5"><div className="relative flex min-w-[900px] items-center gap-4 px-5 py-10">
                <div className="absolute left-12 right-12 top-1/2 h-px bg-black/15" />
                {courses.map((course, i) => { const done = i < completed; const current = i === activeCourse; return <button key={course.title} onClick={() => setTab("journey")} className={`relative z-10 w-28 text-center ${current ? "scale-105" : ""}`}><div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border text-xl shadow-sm ${done ? "border-[#171716] bg-[#171716] text-[#f7f4ee]" : current ? "border-black/20 bg-white" : "border-black/10 bg-[#f0eadf]"}`}>{done ? "✓" : course.icon}</div><div className="mt-3 text-xs font-semibold">{course.title}</div><div className="mt-1 text-[10px] text-black/45">Course {i + 1}</div></button>; })}
              </div></div>
            </section>

            <section className="grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
              {[['airports','Airport codes','Search the Breeze network'],['notes','My notes','Save the things you want to remember'],['practice','Practice','Questions with explanations'],['study','Study guides','Review source-first material']].map(([id,title,desc]) => <button key={id} onClick={() => setTab(id)} className="rounded-[1.5rem] border border-black/10 bg-white/60 p-5 text-left transition hover:-translate-y-0.5 hover:bg-white"><div className="text-xs uppercase tracking-[.18em] text-black/40">{title}</div><div className="mt-8 font-serif text-2xl">{title}</div><p className="mt-2 text-sm leading-5 text-black/55">{desc}</p><span className="mt-5 block text-sm font-semibold">Open section →</span></button>)}
            </section>
          </>
        )}

        {tab === "journey" && <section className="py-10"><button onClick={() => setTab("home")} className="text-sm text-black/50">← Home</button><p className="mt-10 text-xs uppercase tracking-[.2em] text-black/40">Training passport</p><h1 className="mt-2 font-serif text-5xl">Your journey</h1><p className="mt-4 max-w-xl text-black/55">Complete each checkpoint to move your aircraft along the route.</p><div className="mt-12 space-y-5">{courses.map((c,i) => { const unlocked = i <= completed; return <div key={c.title} className={`flex items-center gap-5 rounded-[1.75rem] border p-5 ${unlocked ? 'border-black/10 bg-white/70' : 'border-black/5 bg-black/[.02] opacity-50'}`}><div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${i < completed ? 'bg-[#171716] text-white' : 'bg-[#e7dfd0]'}`}>{i < completed ? '✓' : c.icon}</div><div className="flex-1"><div className="text-xs uppercase tracking-[.15em] text-black/40">Course {i + 1}</div><div className="mt-1 font-serif text-2xl">{c.title}</div><div className="mt-1 text-sm text-black/50">{c.subtitle}</div></div>{i === activeCourse && <span className="rounded-full bg-[#d9e3d2] px-3 py-1 text-xs font-semibold">Current</span>}</div>; })}</div><button onClick={() => setCompleted(Math.min(completed + 1, 8))} className="mt-8 rounded-full bg-[#171716] px-6 py-3 text-sm font-semibold text-white">{completed < 8 ? `Mark Course ${completed + 1} complete` : 'Training complete ✓'}</button></section>}

        {tab === "airports" && <section className="py-10"><button onClick={() => setTab("home")} className="text-sm text-black/50">← Home</button><div className="mt-10 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[.2em] text-black/40">Breeze network</p><h1 className="mt-2 font-serif text-5xl">Airport codes</h1></div><div className="rounded-full bg-[#e7dfd0] px-3 py-1.5 text-xs">{airports.length} study entries</div></div><p className="mt-4 max-w-2xl text-black/55">Search by city or IATA code. The international list includes current Breeze destinations such as Montego Bay, Nassau, Punta Cana, Cancún, San José and St. Thomas.</p><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search airport or code…" className="mt-8 w-full rounded-2xl border border-black/10 bg-white px-5 py-4 outline-none focus:border-black/30" /><div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{filteredAirports.map(a => <div key={a.code} className="flex items-center justify-between rounded-2xl border border-black/8 bg-white/65 p-4"><div><div className="font-medium">{a.city}</div><div className="mt-1 text-xs text-black/40">{a.region}</div></div><div className="font-mono text-lg tracking-wider">{a.code}</div></div>)}</div></section>}

        {tab === "practice" && <section className="py-10"><button onClick={() => setTab("home")} className="text-sm text-black/50">← Home</button><p className="mt-10 text-xs uppercase tracking-[.2em] text-black/40">Practice room</p><h1 className="mt-2 font-serif text-5xl">Know it. Don&apos;t just read it.</h1><div className="mt-10 max-w-3xl rounded-[2rem] border border-black/10 bg-white/70 p-6 sm:p-10"><div className="text-sm text-black/45">Question {selected + 1} of {starterQuestions.length}</div><h2 className="mt-4 font-serif text-3xl leading-tight">{starterQuestions[selected].q}</h2><div className="mt-8 grid gap-3">{starterQuestions[selected].options.map((o,i) => { const chosen = answer === i; const correct = i === starterQuestions[selected].answer; return <button key={o} onClick={() => setAnswer(i)} className={`rounded-2xl border p-4 text-left ${answer !== null && correct ? 'border-[#71806a] bg-[#e5ecdf]' : chosen ? 'border-[#b87979] bg-[#f3e2e2]' : 'border-black/10 bg-white hover:bg-[#f7f4ee]'}`}><span className="mr-3 text-black/35">{String.fromCharCode(65 + i)}</span>{o}</button>; })}</div>{answer !== null && <div className="mt-6 rounded-2xl bg-[#f0eadf] p-5"><div className="font-semibold">{answer === starterQuestions[selected].answer ? 'Correct ✓' : 'Not quite'}</div><p className="mt-2 text-sm leading-6 text-black/60">{starterQuestions[selected].why}</p></div>}<div className="mt-6 flex justify-between"><button disabled={answer === null} onClick={() => { setSelected((selected + 1) % starterQuestions.length); setAnswer(null); }} className="rounded-full bg-[#171716] px-5 py-2.5 text-sm text-white disabled:opacity-30">Next question →</button><span className="self-center text-xs text-black/40">Immediate feedback</span></div></div></section>}

        {tab === "notes" && <section className="py-10"><button onClick={() => setTab("home")} className="text-sm text-black/50">← Home</button><p className="mt-10 text-xs uppercase tracking-[.2em] text-black/40">Personal study layer</p><h1 className="mt-2 font-serif text-5xl">My notes</h1><p className="mt-4 max-w-xl text-black/55">Capture the key ideas you want to carry with you. Highlight-to-save from study guides will plug into this same space.</p><div className="mt-8 flex gap-2"><input value={noteDraft} onChange={e => setNoteDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} placeholder="Write a note…" className="min-w-0 flex-1 rounded-2xl border border-black/10 bg-white px-5 py-4 outline-none" /><button onClick={addNote} className="rounded-2xl bg-[#171716] px-5 text-sm font-semibold text-white">Save</button></div><div className="mt-6 grid gap-3">{notes.length === 0 ? <div className="rounded-[1.5rem] border border-dashed border-black/15 p-8 text-sm text-black/45">Your saved notes will appear here.</div> : notes.map((n,i) => <div key={i} className="rounded-[1.5rem] border border-black/10 bg-white/70 p-5"><div className="flex gap-3"><button className="font-bold">B</button><button className="italic">I</button><button>✦</button></div><p className="mt-4 leading-7">{n}</p></div>)}</div></section>}

        {tab === "study" && <section className="py-10"><button onClick={() => setTab("home")} className="text-sm text-black/50">← Home</button><p className="mt-10 text-xs uppercase tracking-[.2em] text-black/40">Source-first study</p><h1 className="mt-2 font-serif text-5xl">Study guides</h1><div className="mt-8 max-w-3xl rounded-[2rem] border border-black/10 bg-white/70 p-7"><div className="text-xs uppercase tracking-[.18em] text-black/40">Aviation Foundations</div><h2 className="mt-3 font-serif text-3xl">Cabin crew essentials</h2><p className="mt-4 leading-7 text-black/65">Use this space for the official training material. Select important text to save it to My Notes once the source document is connected.</p><div className="mt-6 rounded-2xl bg-[#f0eadf] p-5 text-sm leading-7">Tip: the final version will let you highlight a phrase, choose <strong>Save to Notes</strong>, then edit the saved note with formatting and color.</div></div></section>}

        <footer className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border border-black/10 bg-white/90 p-1.5 shadow-lg backdrop-blur"><Nav label="Home" active={tab === 'home'} onClick={() => setTab('home')} /><Nav label="Journey" active={tab === 'journey'} onClick={() => setTab('journey')} /><Nav label="Study" active={tab === 'study'} onClick={() => setTab('study')} /><Nav label="Airports" active={tab === 'airports'} onClick={() => setTab('airports')} /><Nav label="Notes" active={tab === 'notes'} onClick={() => setTab('notes')} /></footer>
      </div>
    </main>
  );
}

function Nav({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`rounded-full px-4 py-2 text-xs font-medium ${active ? 'bg-[#171716] text-white' : 'text-black/55 hover:bg-black/5'}`}>{label}</button>;
}
