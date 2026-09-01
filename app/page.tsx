"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

type Tab = "home" | "journey" | "study" | "passport" | "calendar" | "notes" | "practice" | "flashcards" | "quiz" | "test" | "airports" | "phonetic" | "aircraft" | "training" | "profile" | "settings";
type Note = { id: number; title: string; text: string; color: string; size: "sm" | "base" | "lg"; bold: boolean };
type EventItem = { id: number; date: string; title: string; type: string; color: string };
type Question = { q: string; o: string[]; a: number; e: string; topic: string };

type Course = { title: string; subtitle: string; icon: string; lessons: string[] };

const courses: Course[] = [
  { title: "Aviation Foundations", subtitle: "Aircraft, aviation basics & terminology", icon: "✈", lessons: ["Cabin crew role & aviation terminology", "UTC / Zulu time", "IATA airport codes", "ICAO phonetic alphabet"] },
  { title: "Emergency Procedures", subtitle: "Safety, evacuation & abnormal situations", icon: "✦", lessons: ["Emergency priorities", "Evacuation fundamentals", "Crew communication", "Emergency equipment — verify against official training package"] },
  { title: "Safety & Security", subtitle: "Cabin security, compliance & awareness", icon: "◇", lessons: ["Security awareness", "Cabin checks", "Standardized communication", "Airline-specific procedures — official package required"] },
  { title: "Service & Hospitality", subtitle: "Guest experience from boarding to landing", icon: "○", lessons: ["Guest experience", "Boarding & cabin flow", "Service standards", "Breeze-specific standards — official package required"] },
  { title: "Onboard Operations", subtitle: "Cabin flow, equipment & procedures", icon: "▱", lessons: ["Preflight workflow", "Cabin operations", "Equipment & procedures", "Airline-specific procedures — official package required"] },
  { title: "Medical & First Aid", subtitle: "Recognizing and responding to medical events", icon: "+", lessons: ["Medical response fundamentals", "First-aid principles", "Communication & escalation", "Airline-specific procedures — official package required"] },
  { title: "Breeze Knowledge", subtitle: "Airline-specific policies & standards", icon: "✦", lessons: ["Breeze terminology", "Company knowledge", "Policies & standards", "Only verified material from your official training package"] },
  { title: "Final Cabin Check", subtitle: "Mixed review before training day", icon: "✓", lessons: ["Mixed review", "Weak-area practice", "Flashcard review", "Final graded knowledge check"] },
];

const airports = [
  ["Akron / Canton", "CAK", "US"], ["Albany", "ALB", "US"], ["Arcata / Eureka", "ACV", "US"], ["Atlantic City", "ACY", "US"], ["Baltimore", "BWI", "US"], ["Bangor", "BGR", "US"], ["Birmingham", "BHM", "US"], ["Brownsville", "BRO", "US"], ["Burbank", "BUR", "US"], ["Burlington", "BTV", "US"], ["Cancún", "CUN", "INTL"], ["Charleston, SC", "CHS", "US"], ["Charleston, WV", "CRW", "US"], ["Cincinnati", "CVG", "US"], ["Columbus", "CMH", "US"], ["Dallas / Fort Worth", "DFW", "US"], ["Dayton", "DAY", "US"], ["Daytona Beach", "DAB", "US"], ["Denver", "DEN", "US"], ["Erie", "ERI", "US"], ["Evansville", "EVV", "US"], ["Fayetteville / Northwest Arkansas", "XNA", "US"], ["Fort Lauderdale", "FLL", "US"], ["Fort Myers", "RSW", "US"], ["Greensboro", "GSO", "US"], ["Greenville / Spartanburg", "GSP", "US"], ["Hartford", "BDL", "US"], ["Huntsville", "HSV", "US"], ["Jacksonville", "JAX", "US"], ["Key West", "EYW", "US"], ["Las Vegas", "LAS", "US"], ["Los Angeles", "LAX", "US"], ["Louisville", "SDF", "US"], ["Manchester", "MHT", "US"], ["Memphis", "MEM", "US"], ["Myrtle Beach", "MYR", "US"], ["Nassau", "NAS", "INTL"], ["New Orleans", "MSY", "US"], ["Newark", "EWR", "US"], ["Norfolk", "ORF", "US"], ["Orlando", "MCO", "US"], ["Pensacola", "PNS", "US"], ["Phoenix", "PHX", "US"], ["Pittsburgh", "PIT", "US"], ["Portland, ME", "PWM", "US"], ["Providence", "PVD", "US"], ["Punta Cana", "PUJ", "INTL"], ["Raleigh / Durham", "RDU", "US"], ["Richmond", "RIC", "US"], ["Rochester", "ROC", "US"], ["San Antonio", "SAT", "US"], ["San Diego", "SAN", "US"], ["San Francisco", "SFO", "US"], ["San José, Costa Rica", "SJO", "INTL"], ["Sarasota / Bradenton", "SRQ", "US"], ["Savannah", "SAV", "US"], ["South Bend", "SBN", "US"], ["St. Thomas", "STT", "INTL"], ["Syracuse", "SYR", "US"], ["Tallahassee", "TLH", "US"], ["Tampa Bay", "TPA", "US"], ["Trenton", "TTN", "US"], ["Vero Beach", "VRB", "US"], ["Washington / Dulles", "IAD", "US"], ["West Palm Beach", "PBI", "US"], ["White Plains", "HPN", "US"], ["Wilmington, NC", "ILM", "US"],
].map(([city, code, region]) => ({ city, code, region }));

const phonetic = [["A", "Alpha"], ["B", "Bravo"], ["C", "Charlie"], ["D", "Delta"], ["E", "Echo"], ["F", "Foxtrot"], ["G", "Golf"], ["H", "Hotel"], ["I", "India"], ["J", "Juliett"], ["K", "Kilo"], ["L", "Lima"], ["M", "Mike"], ["N", "November"], ["O", "Oscar"], ["P", "Papa"], ["Q", "Quebec"], ["R", "Romeo"], ["S", "Sierra"], ["T", "Tango"], ["U", "Uniform"], ["V", "Victor"], ["W", "Whiskey"], ["X", "X-ray"], ["Y", "Yankee"], ["Z", "Zulu"]];

const questions: Question[] = [
  { q: "Zulu (Z) is another name for which time reference?", o: ["UTC", "Eastern Time", "Local time", "Destination time"], a: 0, e: "Zulu is the aviation designation for UTC (UTC±00:00).", topic: "UTC / Zulu" },
  { q: "A location is UTC−5. Local time is 14:00. What is Zulu?", o: ["09:00Z", "14:00Z", "19:00Z", "05:00Z"], a: 2, e: "UTC−5 is five hours behind UTC, so add 5 hours: 14:00 + 5 = 19:00Z.", topic: "UTC / Zulu" },
  { q: "A location is UTC+3. Local time is 18:00. What is Zulu?", o: ["21:00Z", "15:00Z", "18:00Z", "03:00Z"], a: 1, e: "UTC+3 is three hours ahead of UTC, so subtract 3 hours: 18:00 − 3 = 15:00Z.", topic: "UTC / Zulu" },
  { q: "Zulu is 02:00Z and the location is UTC−4. What is local time?", o: ["22:00 previous day", "06:00", "02:00", "04:00"], a: 0, e: "UTC−4 is four hours behind UTC: 02:00 − 4 = 22:00 on the previous calendar day.", topic: "UTC / Zulu" },
  { q: "Which word represents A in the ICAO phonetic alphabet?", o: ["Alpha", "Aviation", "Able", "Atlas"], a: 0, e: "A is represented by Alpha.", topic: "Phonetic Alphabet" },
  { q: "Which word represents J in the ICAO phonetic alphabet?", o: ["Jupiter", "Juliett", "Jet", "January"], a: 1, e: "J is represented by Juliett.", topic: "Phonetic Alphabet" },
  { q: "What does IAD identify?", o: ["Washington Dulles International Airport", "Baltimore/Washington International", "Newark Liberty International", "Long Island MacArthur Airport"], a: 0, e: "IAD is the IATA code for Washington Dulles International Airport.", topic: "Airport Codes" },
  { q: "What does MCO identify?", o: ["Miami International", "Orlando International", "Memphis International", "Manchester-Boston Regional"], a: 1, e: "MCO is the IATA code for Orlando International Airport.", topic: "Airport Codes" },
  { q: "What does SFO identify?", o: ["San Diego International", "San Francisco International", "Sacramento International", "Santa Fe Regional"], a: 1, e: "SFO is the IATA code for San Francisco International Airport.", topic: "Airport Codes" },
  { q: "Which aircraft family is the focus of the aircraft lab?", o: ["Airbus A220", "Boeing 737", "Airbus A380", "Embraer 175"], a: 0, e: "The CabinReady aircraft lab is being prepared around the Airbus A220. Exact equipment locations must be verified from the official training package.", topic: "Aircraft" },
  { q: "What should be the primary source for Breeze-specific procedures?", o: ["Your official training package", "A social-media post", "A generic quiz website", "Another trainee's rumor"], a: 0, e: "Airline-specific procedures should be learned from the official material supplied for your training.", topic: "Breeze Knowledge" },
  { q: "Why should aircraft equipment locations be verified against the training package?", o: ["Configurations can be specific to the aircraft/operator", "Every aircraft has identical layouts", "Locations never change", "Equipment is not important"], a: 0, e: "CabinReady should not invent airline-specific locations. Use the official training package for the exact configuration.", topic: "Aircraft" },
];

const flashcards = [
  ["UTC", "Coordinated Universal Time; the zero-offset reference used for Zulu time."],
  ["Zulu / Z", "The aviation designation for UTC. Example: 1530Z means 15:30 UTC."],
  ["UTC conversion rule", "Local → UTC: subtract the UTC offset. UTC → Local: add the UTC offset. Watch the calendar date when crossing midnight."],
  ["IATA code", "A three-letter airport identifier such as IAD, MCO or SFO."],
  ["ICAO phonetic alphabet", "Alpha, Bravo, Charlie … Zulu. Used to spell letters clearly over radio/telephone communications."],
  ["Airbus A220", "The aircraft family being prepared for the CabinReady aircraft lab. Exact cabin layout and equipment locations require official training material."],
];

const noteColors = ["#fffdf8", "#f1e5d6", "#e2eee0", "#e2e8f1", "#e5e1ee", "#f1dfdf", "#eee5c8", "#dedfe5", "#d7e9e7", "#e7ddd1"];
const eventColors = ["#d85f67", "#5c7fa6", "#71946b", "#b28a52", "#8c73a7", "#5d7773", "#e07b39"];
const topics = ["All topics", "UTC / Zulu", "Phonetic Alphabet", "Airport Codes", "Aircraft", "Breeze Knowledge"];

function keyDate(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function shuffle<T>(items: T[]) { return [...items].sort(() => Math.random() - 0.5); }

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [splash, setSplash] = useState(true);
  const [menu, setMenu] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [draftTitle, setDraftTitle] = useState("");
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [noteColor, setNoteColor] = useState(noteColors[0]);
  const [noteSize, setNoteSize] = useState<Note["size"]>("base");
  const [noteBold, setNoteBold] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [month, setMonth] = useState(new Date(2026, 8, 1));
  const [selectedDay, setSelectedDay] = useState(keyDate(new Date()));
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("Study");
  const [eventColor, setEventColor] = useState(eventColors[1]);
  const [airportQuery, setAirportQuery] = useState("");
  const [card, setCard] = useState(0);
  const [flip, setFlip] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizTopic, setQuizTopic] = useState("All topics");
  const [finalQuestions, setFinalQuestions] = useState<Question[]>([]);
  const [finalIndex, setFinalIndex] = useState(0);
  const [finalAnswer, setFinalAnswer] = useState<number | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [finalStarted, setFinalStarted] = useState(false);
  const [finalDone, setFinalDone] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState<number | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const [practiceDone, setPracticeDone] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [profileName, setProfileName] = useState("");
  const [username, setUsername] = useState("");
  const [aiEnabled, setAiEnabled] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("cabinready-v3");
    if (raw) {
      try {
        const d = JSON.parse(raw);
        setCompletedLessons(d.completedLessons || {});
        setNotes(d.notes || []);
        setEvents(d.events || []);
        setProfileName(d.profileName || "");
        setUsername(d.username || "");
        setPdfName(d.pdfName || "");
        setAiEnabled(false);
      } catch { /* ignore malformed local data */ }
    }
    const timer = window.setTimeout(() => setSplash(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("cabinready-v3", JSON.stringify({ completedLessons, notes, events, profileName, username, pdfName }));
  }, [completedLessons, notes, events, profileName, username, pdfName]);

  const go = (next: Tab) => { setTab(next); setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const allLessonCount = courses.slice(0, 7).reduce((n, c) => n + c.lessons.length, 0);
  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const progress = Math.round((completedCount / allLessonCount) * 100);
  const activeCourse = courses.findIndex(c => c.lessons.some((_, i) => !completedLessons[`${courses.indexOf(c)}-${i}`]));
  const filteredAirports = useMemo(() => airports.filter(a => `${a.city} ${a.code} ${a.region}`.toLowerCase().includes(airportQuery.toLowerCase())), [airportQuery]);

  const toggleLesson = (courseIndex: number, lessonIndex: number) => {
    if (courseIndex === 7) return;
    const key = `${courseIndex}-${lessonIndex}`;
    setCompletedLessons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveNote = () => {
    if (!draft.trim()) return;
    if (editing !== null) {
      setNotes(ns => ns.map(n => n.id === editing ? { ...n, title: draftTitle.trim() || "Untitled note", text: draft.trim(), color: noteColor, size: noteSize, bold: noteBold } : n));
    } else {
      setNotes(ns => [{ id: Date.now(), title: draftTitle.trim() || "Untitled note", text: draft.trim(), color: noteColor, size: noteSize, bold: noteBold }, ...ns]);
    }
    setDraftTitle(""); setDraft(""); setEditing(null); setNoteColor(noteColors[0]); setNoteSize("base"); setNoteBold(false);
  };
  const editNote = (n: Note) => { setEditing(n.id); setDraftTitle(n.title); setDraft(n.text); setNoteColor(n.color); setNoteSize(n.size); setNoteBold(n.bold); };
  const deleteNote = (id: number) => setNotes(ns => ns.filter(n => n.id !== id));

  const addEvent = () => {
    if (!eventTitle.trim()) return;
    setEvents(es => [...es, { id: Date.now(), date: selectedDay, title: eventTitle.trim(), type: eventType, color: eventColor }]);
    setEventTitle("");
  };
  const monthDays = () => {
    const y = month.getFullYear(), m = month.getMonth();
    const first = new Date(y, m, 1).getDay();
    const count = new Date(y, m + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => new Date(y, m, i + 1))];
  };

  const startQuiz = () => {
    const pool = quizTopic === "All topics" ? questions : questions.filter(q => q.topic === quizTopic);
    setQuizQuestions(shuffle(pool).slice(0, Math.min(8, pool.length)));
    setQuizIndex(0); setQuizAnswer(null); setQuizScore(0); setQuizDone(false);
  };
  const answerQuiz = (i: number) => { if (quizAnswer === null) { setQuizAnswer(i); if (i === quizQuestions[quizIndex].a) setQuizScore(s => s + 1); } };
  const nextQuiz = () => { if (quizIndex === quizQuestions.length - 1) setQuizDone(true); else { setQuizIndex(i => i + 1); setQuizAnswer(null); } };

  const startPractice = () => {
    const pool = questions.filter(q => q.topic === "UTC / Zulu");
    setPracticeQuestions(shuffle(pool).slice(0, 4)); setPracticeIndex(0); setPracticeAnswer(null); setPracticeScore(0); setPracticeDone(false);
  };
  const answerPractice = (i: number) => { if (practiceAnswer === null) { setPracticeAnswer(i); if (i === practiceQuestions[practiceIndex].a) setPracticeScore(s => s + 1); } };
  const nextPractice = () => { if (practiceIndex === practiceQuestions.length - 1) setPracticeDone(true); else { setPracticeIndex(i => i + 1); setPracticeAnswer(null); } };

  const startFinal = () => {
    setFinalQuestions(shuffle(questions).slice(0, 10)); setFinalIndex(0); setFinalAnswer(null); setFinalScore(0); setFinalStarted(true); setFinalDone(false);
  };
  const answerFinalQuestion = (i: number) => { if (finalAnswer === null) { setFinalAnswer(i); if (i === finalQuestions[finalIndex].a) setFinalScore(s => s + 1); } };
  const nextFinal = () => { if (finalIndex === finalQuestions.length - 1) setFinalDone(true); else { setFinalIndex(i => i + 1); setFinalAnswer(null); } };

  const uploadPdf = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") return;
    setPdfName(file.name);
  };

  if (splash) return <div className="splash"><div className="splash-plane">✈</div><h1>CabinReady</h1><p>flight attendant training</p><span>PREPARING YOUR CABIN</span></div>;

  return (
    <main className="app-shell">
      <div className="app-frame">
        <header className="topbar">
          <button className="brand" onClick={() => go("home")}><span className="brand-mark">✈</span><span><strong>CabinReady</strong><small>flight attendant training</small></span></button>
          <div className="top-actions"><span className="date-pill">TRAINING HUB</span><button className="plane-menu" aria-label="Open main menu" onClick={() => setMenu(v => !v)}>✈</button><button className="account-pill" onClick={() => go("profile")}>{profileName ? profileName : "Profile"}</button></div>
        </header>

        {menu && <div className="menu-panel">
          <div className="menu-head"><div><span className="eyebrow">CABINREADY</span><h3>Main menu</h3></div><button className="icon-btn" onClick={() => setMenu(false)}>×</button></div>
          <div className="menu-grid">
            {[['home','⌂','Home'],['journey','✈','Training Journey'],['study','▦','Study Hub'],['passport','▤','Training Passport'],['calendar','□','Calendar'],['notes','✎','Notes'],['practice','◌','Practice Lab'],['flashcards','▣','Flashcards'],['quiz','?','Quiz Generator'],['test','✓','Final Test'],['airports','⌖','Airport Codes'],['phonetic','ABC','Phonetic Alphabet'],['aircraft','◇','Aircraft Lab'],['training','▱','Training Package'],['profile','●','Profile'],['settings','⚙','Settings']].map(([id, icon, label]) => <button key={id} onClick={() => go(id as Tab)}><span>{icon}</span>{label}</button>)}
          </div>
        </div>}

        <section className="content">
          {tab === "home" && <>
            <div className="hero-card"><div><span className="eyebrow">YOUR TRAINING CO-PILOT</span><h1>Get cabin-ready, one lesson at a time.</h1><p>Build the knowledge, confidence and recall you need before training day.</p><div className="hero-actions"><button className="primary" onClick={() => go("journey")}>Continue journey →</button><button className="secondary" onClick={() => go("quiz")}>Take a quick quiz</button></div></div><div className="hero-art"><div className="cloud cloud-a"/><div className="cloud cloud-b"/><div className="plane-art">✈</div><div className="route-line"/></div></div>
            <div className="quote-card"><span>✦</span><div><strong>Today’s reminder</strong><p>“You do not have to know everything today. Keep learning, keep practicing, keep moving.”</p></div></div>
            <div className="dashboard-grid">
              <button className="dash-card" onClick={() => go("journey")}><span className="card-icon">✈</span><span className="eyebrow">JOURNEY</span><h3>{progress}% complete</h3><div className="progress"><i style={{ width: `${progress}%` }}/></div><small>{completedCount} of {allLessonCount} lessons completed</small></button>
              <button className="dash-card" onClick={() => go("calendar")}><span className="card-icon">□</span><span className="eyebrow">NEXT UP</span><h3>{events.length ? events.sort((a,b) => a.date.localeCompare(b.date))[0].title : "Add your training dates"}</h3><small>Use Calendar for exams, homework and study blocks.</small></button>
              <button className="dash-card" onClick={() => go("practice")}><span className="card-icon">◌</span><span className="eyebrow">PRACTICE</span><h3>UTC & Zulu Lab</h3><small>Practice conversions and see why each answer is right or wrong.</small></button>
            </div>
            <div className="section-heading"><div><span className="eyebrow">STUDY SHORTCUTS</span><h2>Pick up where you want</h2></div></div>
            <div className="shortcut-grid"><button onClick={() => go("flashcards")}>▣<span>Flashcards</span><small>Quick recall</small></button><button onClick={() => go("quiz")}>?<span>Quiz Generator</span><small>Random practice</small></button><button onClick={() => go("aircraft")}>◇<span>Aircraft Lab</span><small>Know the cabin</small></button><button onClick={() => go("training")}>↑<span>Training Package</span><small>Upload your PDF</small></button></div>
          </>}

          {tab === "journey" && <>
            <PageIntro eyebrow="YOUR ROADMAP" title="Training Journey" text="Work through the lessons in order. Course 8 is the final check and is not manually marked complete." />
            <div className="journey-list">{courses.map((c, ci) => { const done = ci < 7 && c.lessons.every((_, li) => completedLessons[`${ci}-${li}`]); const lessonDone = ci < 7 ? c.lessons.filter((_, li) => completedLessons[`${ci}-${li}`]).length : 0; return <div className={`course-card ${ci === 7 ? 'final-course' : ''}`} key={c.title}><div className="course-top"><div className="course-icon">{c.icon}</div><div><span className="course-number">COURSE {ci + 1}</span><h3>{c.title}</h3><p>{c.subtitle}</p></div><div className="course-status">{ci === 7 ? 'ASSESSMENT' : `${lessonDone}/${c.lessons.length}`}</div></div><div className="lesson-list">{c.lessons.map((lesson, li) => <button key={lesson} disabled={ci === 7} className={completedLessons[`${ci}-${li}`] ? 'lesson done' : 'lesson'} onClick={() => toggleLesson(ci, li)}><span>{completedLessons[`${ci}-${li}`] ? '✓' : '○'}</span>{lesson}{ci === 7 && li === c.lessons.length - 1 ? <b onClick={(e) => { e.stopPropagation(); go('test'); }}>Open final test →</b> : null}</button>)}</div>{done && <div className="course-complete">✓ Course lessons complete</div>}</div>; })}</div>
          </>}

          {tab === "study" && <>
            <PageIntro eyebrow="STUDY HUB" title="Learn the foundations" text="Everything here works without AI. Airline-specific facts remain intentionally locked behind your official training material." />
            <div className="study-grid">{courses.slice(0,7).map((c, i) => <button key={c.title} className="study-tile" onClick={() => go('journey')}><span>{c.icon}</span><small>COURSE {i + 1}</small><h3>{c.title}</h3><p>{c.lessons.slice(0,3).join(' • ')}</p><b>Open course →</b></button>)}</div>
            <div className="info-banner"><strong>What is already built in?</strong><span>UTC/Zulu practice, airport codes, ICAO phonetic alphabet, Airbus A220 study shell, flashcards, quizzes, final test, notes and calendar.</span></div>
          </>}

          {tab === "passport" && <>
            <PageIntro eyebrow="YOUR RECORD" title="Training Passport" text="A visual record of what you have practiced and completed." />
            <div className="passport"><div className="passport-cover"><span>✈</span><strong>CabinReady</strong><small>TRAINING PASSPORT</small><em>CREW CANDIDATE</em></div><div className="passport-inside"><div><span className="eyebrow">PROGRESS</span><h2>{progress}%</h2><p>{completedCount} lessons completed</p></div><div className="stamp-row">{courses.slice(0,7).map((c, i) => { const done = c.lessons.every((_, li) => completedLessons[`${i}-${li}`]); return <div className={`stamp ${done ? 'earned' : ''}`} key={c.title}><span>{done ? '✓' : '·'}</span><small>COURSE {i+1}</small></div>; })}</div><div className="passport-work"><strong>Needs work</strong><p>{completedCount === allLessonCount ? 'All core lessons are complete. Review with flashcards and the final test.' : `${allLessonCount - completedCount} core lessons remain. Your unfinished lessons stay visible in the Training Journey.`}</p></div></div></div>
          </>}

          {tab === "calendar" && <>
            <PageIntro eyebrow="PLAN YOUR TIME" title="Training Calendar" text="Color-code exams, homework, study blocks and training days." />
            <div className="calendar-layout"><div className="calendar-card"><div className="calendar-nav"><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth()-1, 1))}>‹</button><h3>{month.toLocaleString('en-US', { month:'long', year:'numeric' })}</h3><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth()+1, 1))}>›</button></div><div className="weekdays">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <span key={d}>{d}</span>)}</div><div className="calendar-grid">{monthDays().map((d, i) => { if (!d) return <span key={`blank-${i}`} className="day blank"/>; const kd=keyDate(d); const dayEvents=events.filter(e=>e.date===kd); return <button key={kd} className={`day ${selectedDay===kd?'selected':''}`} onClick={() => setSelectedDay(kd)}><b>{d.getDate()}</b>{dayEvents.slice(0,3).map(e => <i key={e.id} style={{background:e.color}} title={e.title}/>)}</button>; })}</div></div><div className="side-card"><span className="eyebrow">ADD TO {selectedDay}</span><input value={eventTitle} onChange={e=>setEventTitle(e.target.value)} placeholder="Exam, homework, study…"/><select value={eventType} onChange={e=>setEventType(e.target.value)}><option>Study</option><option>Exam</option><option>Homework</option><option>Training</option><option>Reminder</option></select><div className="color-picker">{eventColors.map(c=><button key={c} aria-label="Choose event color" style={{background:c, outline:eventColor===c?'3px solid #26241f':'none'}} onClick={()=>setEventColor(c)}/>)}</div><button className="primary full" onClick={addEvent}>Add calendar item</button><div className="event-list">{events.filter(e=>e.date===selectedDay).map(e=><div key={e.id}><i style={{background:e.color}}/><span><b>{e.title}</b><small>{e.type}</small></span><button onClick={()=>setEvents(es=>es.filter(x=>x.id!==e.id))}>×</button></div>)}</div></div></div>
          </>}

          {tab === "notes" && <>
            <PageIntro eyebrow="YOUR NOTEBOOK" title="Notes" text="Write, format, recolor, edit and delete your study notes." />
            <div className="notes-layout"><div className="note-editor"><input className="title-input" value={draftTitle} onChange={e=>setDraftTitle(e.target.value)} placeholder="Note title"/><textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Write your notes here…"/><div className="editor-tools"><div className="color-picker">{noteColors.map(c=><button key={c} style={{background:c, outline:noteColor===c?'3px solid #26241f':'none'}} onClick={()=>setNoteColor(c)}/>)}</div><div className="format-tools"><button className={noteBold?'active':''} onClick={()=>setNoteBold(v=>!v)}>B</button>{(['sm','base','lg'] as const).map(s=><button key={s} className={noteSize===s?'active':''} onClick={()=>setNoteSize(s)}>{s==='sm'?'A−':s==='lg'?'A+':'A'}</button>)}</div></div><div className="editor-actions">{editing!==null && <button className="secondary" onClick={()=>{setEditing(null);setDraftTitle('');setDraft('')}}>Cancel</button>}<button className="primary" onClick={saveNote}>{editing!==null?'Save changes':'Save note'}</button></div></div><div className="saved-notes">{notes.length===0 ? <div className="empty-state"><span>✎</span><h3>No saved notes yet</h3><p>Your notes will appear here with edit and delete controls.</p></div> : notes.map(n=><article className="saved-note" style={{background:n.color}} key={n.id}><div className="note-actions"><button onClick={()=>editNote(n)}>Edit</button><button onClick={()=>deleteNote(n.id)}>Delete</button></div><h3>{n.title}</h3><p className={`note-text ${n.size} ${n.bold?'bold':''}`}>{n.text}</p></article>)}</div></div>
          </>}

          {tab === "practice" && <>
            <PageIntro eyebrow="PRACTICE LAB" title="UTC & Zulu practice" text="Use the offset rule, then check the explanation. The app will tell you exactly why an answer is right or wrong." />
            {!practiceQuestions.length || practiceDone ? <div className="assessment-card"><div className="big-icon">◌</div>{practiceDone ? <><span className="eyebrow">PRACTICE COMPLETE</span><h2>{practiceScore}/{practiceQuestions.length}</h2><p>{practiceScore === practiceQuestions.length ? 'Perfect. You have the conversion logic down.' : 'Review the explanations and try the lab again.'}</p></> : <><h2>Ready for a conversion drill?</h2><p>Questions cover local → Zulu and Zulu → local conversions, including midnight.</p></>}<button className="primary" onClick={startPractice}>{practiceDone?'Try again':'Start practice'}</button></div> : <QuestionCard question={practiceQuestions[practiceIndex]} index={practiceIndex} total={practiceQuestions.length} answer={practiceAnswer} onAnswer={answerPractice} onNext={nextPractice} />}
          </>}

          {tab === "flashcards" && <><PageIntro eyebrow="RECALL TRAINING" title="Flashcards" text="Tap a card to reveal the answer. Use the arrows to move through the deck."/><div className="flash-wrap"><button className="flash-arrow" onClick={()=>{setCard((card-1+flashcards.length)%flashcards.length);setFlip(false)}}>‹</button><button className={`flashcard ${flip?'flipped':''}`} onClick={()=>setFlip(v=>!v)}><span className="eyebrow">CARD {card+1} / {flashcards.length}</span><div className="flash-content"><h2>{flip ? flashcards[card][1] : flashcards[card][0]}</h2><p>{flip ? 'Tap to see the front' : 'Tap to reveal'}</p></div></button><button className="flash-arrow" onClick={()=>{setCard((card+1)%flashcards.length);setFlip(false)}}>›</button></div></>}

          {tab === "quiz" && <><PageIntro eyebrow="QUIZ GENERATOR" title="Build a quiz" text="This version generates quizzes from the verified built-in CabinReady question bank. AI is intentionally disabled for now."/><div className="quiz-controls"><label>Topic<select value={quizTopic} onChange={e=>setQuizTopic(e.target.value)}>{topics.map(t=><option key={t}>{t}</option>)}</select></label><button className="primary" onClick={startQuiz}>Generate quiz</button></div>{quizQuestions.length>0 && !quizDone && <QuestionCard question={quizQuestions[quizIndex]} index={quizIndex} total={quizQuestions.length} answer={quizAnswer} onAnswer={answerQuiz} onNext={nextQuiz}/>} {quizDone && <ResultCard score={quizScore} total={quizQuestions.length} onRestart={startQuiz}/>}</>}

          {tab === "test" && <><PageIntro eyebrow="ASSESSMENT" title="Final Cabin Test" text="A graded practice assessment. Your score is shown at the end so the testing environment feels familiar."/>{!finalStarted ? <div className="assessment-card"><div className="big-icon">✓</div><h2>Final knowledge check</h2><p>10 randomized questions across the current built-in material. This is not an airline certification exam.</p><button className="primary" onClick={startFinal}>Start graded test</button></div> : finalDone ? <ResultCard score={finalScore} total={finalQuestions.length} onRestart={startFinal} final/> : <QuestionCard question={finalQuestions[finalIndex]} index={finalIndex} total={finalQuestions.length} answer={finalAnswer} onAnswer={answerFinalQuestion} onNext={nextFinal}/>}</>}

          {tab === "airports" && <><PageIntro eyebrow="QUICK REFERENCE" title="Airport Codes" text="Search the airport list and build fast IATA-code recall."/><input className="search-input" value={airportQuery} onChange={e=>setAirportQuery(e.target.value)} placeholder="Search city or code…"/><div className="airport-grid">{filteredAirports.map(a=><div className="airport-card" key={a.code}><span>{a.region}</span><strong>{a.code}</strong><p>{a.city}</p></div>)}</div></>}

          {tab === "phonetic" && <><PageIntro eyebrow="RADIO READY" title="ICAO Phonetic Alphabet" text="Learn the letter-to-word pairs from Alpha through Zulu."/><div className="phonetic-grid">{phonetic.map(([letter,word])=><div key={letter}><strong>{letter}</strong><span>{word}</span></div>)}</div></>}

          {tab === "aircraft" && <><PageIntro eyebrow="AIRCRAFT LAB" title="Airbus A220" text="A visual study shell for the aircraft family you identified. Exact seats, exits and equipment locations will be populated from your official training package; nothing is invented here."/><div className="aircraft-lab"><div className="aircraft-body"><div className="cockpit">FLIGHT DECK</div><div className="cabin-label">CABIN MAP • CONFIGURATION TO BE VERIFIED</div><div className="seat-map">{Array.from({length:18},(_,i)=><div className="seat-row" key={i}><span>{i+1}</span><b/><b/><em/><b/><b/></div>)}</div><div className="tail">TAIL</div></div><div className="equipment-list"><h3>Equipment learning cards</h3>{['Oxygen mask','Fire extinguisher','Defibrillator / AED','Emergency exits','Life vest','First-aid equipment'].map(item=><div key={item}><span>◇</span><div><strong>{item}</strong><p>What it looks like • what it is used for • where it is located</p><small>Location and procedures: verify with official training package.</small></div></div>)}</div></div></>}

          {tab === "training" && <><PageIntro eyebrow="YOUR SOURCE MATERIAL" title="Training Package" text="Upload the PDF you receive for training. AI is temporarily off, so this version records the package name without pretending to analyze it."/><div className="upload-card"><div className="upload-icon">↑</div><h2>{pdfName ? 'Training package selected' : 'Add your training PDF'}</h2><p>{pdfName ? pdfName : 'Keep your official study package ready here. PDF analysis will be added later when the AI integration is stable.'}</p><label className="upload-button">{pdfName?'Replace PDF':'Choose PDF'}<input type="file" accept="application/pdf,.pdf" onChange={uploadPdf}/></label>{pdfName && <button className="text-danger" onClick={()=>setPdfName('')}>Remove saved PDF name</button>}<div className="package-routing"><strong>When AI is re-enabled, the package will be organized into:</strong><span>Service & Hospitality • Onboard Operations • Medical & First Aid • Safety & Security • Breeze Knowledge • Emergency Procedures</span></div></div></>}

          {tab === "profile" && <><PageIntro eyebrow="YOUR PROFILE" title="Crew Candidate Profile" text="Your profile fields are ready. Account synchronization across devices requires an authentication/database service; this offline build saves locally for now."/><div className="profile-card"><label>Display name<input value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder="Your name"/></label><label>Username<input value={username} onChange={e=>setUsername(e.target.value.replace(/\s/g,'').toLowerCase())} placeholder="@username"/></label><div className="auth-placeholder"><strong>Apple / Google sign-in</strong><p>Authentication is not connected in this build. We will add it when the backend is ready rather than creating a fake login.</p><button className="secondary" disabled>Coming with account sync</button></div></div></>}

          {tab === "settings" && <><PageIntro eyebrow="PREFERENCES" title="Settings" text="Control the features that are active in CabinReady."/><div className="settings-card"><div><strong>AI assistant</strong><p>Temporarily disabled while we remove the failing Gemini integration. Your quizzes, flashcards, practice lab and final test do not depend on AI.</p></div><button className="toggle off" disabled><span/>OFF</button></div><div className="settings-card"><div><strong>Local progress</strong><p>Notes, lesson progress, calendar items and profile fields are saved in this browser.</p></div><span className="status-chip">ACTIVE</span></div></>}
        </section>

        <nav className="bottom-nav"><button className={tab==='home'?'active':''} onClick={()=>go('home')}>⌂<span>Home</span></button><button className={tab==='journey'?'active':''} onClick={()=>go('journey')}>✈<span>Journey</span></button><button className={tab==='study'?'active':''} onClick={()=>go('study')}>▦<span>Study</span></button><button className={tab==='airports'?'active':''} onClick={()=>go('airports')}>⌖<span>Airports</span></button><button className={tab==='notes'?'active':''} onClick={()=>go('notes')}>✎<span>Notes</span></button></nav>
      </div>
    </main>
  );
}

function PageIntro({eyebrow,title,text}:{eyebrow:string;title:string;text:string}) { return <div className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>; }

function QuestionCard({question,index,total,answer,onAnswer,onNext}:{question:Question;index:number;total:number;answer:number|null;onAnswer:(i:number)=>void;onNext:()=>void}) {
  const correct = answer === question.a;
  return <div className="question-card"><div className="question-meta"><span>QUESTION {index+1} / {total}</span><span>{question.topic}</span></div><h2>{question.q}</h2><div className="answer-list">{question.o.map((option,i)=><button key={option} className={answer===null?'':i===question.a?'correct':i===answer?'wrong':''} disabled={answer!==null} onClick={()=>onAnswer(i)}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>{answer!==null && <div className={`explanation ${correct?'good':'bad'}`}><strong>{correct?'✓ Correct':'✕ Not quite'}</strong><p>{question.e}</p></div>} {answer!==null && <button className="primary" onClick={onNext}>{index===total-1?'Finish':'Next question →'}</button>}</div>;
}

function ResultCard({score,total,onRestart,final=false}:{score:number;total:number;onRestart:()=>void;final?:boolean}) { const pct=total?Math.round((score/total)*100):0; return <div className="result-card"><span className="eyebrow">{final?'GRADED RESULT':'QUIZ RESULT'}</span><div className="result-score">{score}<small>/{total}</small></div><h2>{pct >= 80 ? 'Strong work.' : pct >= 60 ? 'Good start — keep practicing.' : 'Keep studying — you can improve this.'}</h2><p>You scored {pct}%. Review the explanations for anything you missed, then try again.</p><button className="primary" onClick={onRestart}>{final?'Retake test':'Generate another quiz'}</button></div>; }
