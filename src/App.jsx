import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const TICKETS = [
  { id: "TC-1023", customer: "Anil Deshmukh", phone: "+91 98201 34567", location: "Pune", product: "5kW Solar Rooftop", assetId: "AS-SOL-0098", issue: "Performance Issue", status: "In Progress", tech: "Rohit Patil", created: "2025-02-18 09:14", slaHrs: 24, elapsed: 18, desc: "System output dropped by 40% after recent rains. Inverter making noise.", org: "Madhuri Solars Pvt Ltd", timeline: [{ time: "09:14", label: "Ticket Created", done: true }, { time: "09:30", label: "Assigned to Rohit Patil", done: true }, { time: "14:00", label: "Technician En Route", done: true }, { time: "—", label: "Resolved", done: false }] },
  { id: "TC-1024", customer: "Sunita Kulkarni", phone: "+91 94220 78901", location: "Nashik", product: "RO Water Purifier 75L", assetId: "AS-RO-0045", issue: "Installation Issue", status: "Open", tech: "Suresh Jadhav", created: "2025-02-19 11:02", slaHrs: 12, elapsed: 6, desc: "Unit installed but water flow very slow. TDS reading seems off.", org: "Shree Sai RO Systems", timeline: [{ time: "11:02", label: "Ticket Created", done: true }, { time: "11:45", label: "Assigned to Suresh Jadhav", done: true }, { time: "—", label: "Technician En Route", done: false }, { time: "—", label: "Resolved", done: false }] },
  { id: "TC-1025", customer: "Rajesh Pawar", phone: "+91 70210 56789", location: "Satara", product: "Split AC 1.5T", assetId: "AS-AC-0211", issue: "Warranty / AMC", status: "Resolved", tech: "Mahesh Shinde", created: "2025-02-17 15:30", slaHrs: 24, elapsed: 22, desc: "Annual maintenance visit requested. Filters and gas check required.", org: "Omkar Appliances", timeline: [{ time: "15:30", label: "Ticket Created", done: true }, { time: "16:00", label: "Assigned to Mahesh Shinde", done: true }, { time: "17:30", label: "Technician En Route", done: true }, { time: "18:45", label: "Resolved", done: true }] },
  { id: "TC-1026", customer: "Anil Deshmukh", phone: "+91 98201 34567", location: "Pune", product: "5kW Solar Rooftop", assetId: "AS-SOL-0098", issue: "Performance Issue", status: "Open", tech: "Rohit Patil", created: "2025-02-20 08:00", slaHrs: 24, elapsed: 4, desc: "Panel cleaning required. Output efficiency at 67%.", org: "Madhuri Solars Pvt Ltd", timeline: [{ time: "08:00", label: "Ticket Created", done: true }, { time: "08:25", label: "Assigned to Rohit Patil", done: true }, { time: "—", label: "Technician En Route", done: false }, { time: "—", label: "Resolved", done: false }] },
  { id: "TC-1027", customer: "Priya Mehta", phone: "+91 99000 11223", location: "Kolhapur", product: "RO Water Purifier 50L", assetId: "AS-RO-0062", issue: "Installation Issue", status: "Open", tech: "Unassigned", created: "2025-02-21 07:45", slaHrs: 12, elapsed: 1, desc: "Newly submitted via QR scan.", org: "Shree Sai RO Systems", timeline: [{ time: "07:45", label: "Ticket Created", done: true }, { time: "—", label: "Assigned", done: false }, { time: "—", label: "Technician En Route", done: false }, { time: "—", label: "Resolved", done: false }] },
];

const ASSETS = [
  { id: "AS-SOL-0098", product: "5kW Solar Rooftop System", customer: "Anil Deshmukh", location: "Pune", installed: "12 March 2023", warranty: "Active till 2033", org: "Madhuri Solars Pvt Ltd", tickets: 4 },
  { id: "AS-RO-0045", product: "RO Water Purifier 75L", customer: "Sunita Kulkarni", location: "Nashik", installed: "5 Jan 2024", warranty: "Active till 2026", org: "Shree Sai RO Systems", tickets: 2 },
  { id: "AS-AC-0211", product: "Split AC 1.5T Inverter", customer: "Rajesh Pawar", location: "Satara", installed: "20 Apr 2022", warranty: "Active till 2027", org: "Omkar Appliances", tickets: 3 },
];

const TECHS = [
  { name: "Rohit Patil", role: "Solar Technician", location: "Pune", assigned: 8, resolved: 6, rating: 4.8 },
  { name: "Suresh Jadhav", role: "Water Systems Tech", location: "Nashik", assigned: 5, resolved: 5, rating: 4.6 },
  { name: "Mahesh Shinde", role: "HVAC Technician", location: "Satara", assigned: 7, resolved: 7, rating: 4.9 },
];

const MONTHLY = [
  { month: "Sep", count: 34 }, { month: "Oct", count: 42 }, { month: "Nov", count: 38 },
  { month: "Dec", count: 51 }, { month: "Jan", count: 47 }, { month: "Feb", count: 28 },
];

const ISSUE_DIST = [
  { label: "Performance Issue", pct: 42, color: "#f97316" },
  { label: "Installation Issue", pct: 31, color: "#60a5fa" },
  { label: "Warranty / AMC", pct: 27, color: "#34d399" },
];

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg1: "#07090f",       // darkest
  bg2: "#0d1117",       // sidebar / card
  bg3: "#131a26",       // card
  bg4: "#1a2235",       // input / hover
  bg5: "#1f2a3d",       // hover state
  border: "rgba(255,255,255,0.08)",
  text1: "#e8edf5",
  text2: "#8b9ab5",
  text3: "#4a5568",
  blue: "#3b82f6",
  cyan: "#22d3ee",
  green: "#34d399",
  amber: "#fbbf24",
  red: "#f87171",
  purple: "#a78bfa",
};

const ss = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { background: ${C.bg1}; color: ${C.text1}; }
  ::-webkit-scrollbar { width: 5px; background: ${C.bg2}; }
  ::-webkit-scrollbar-thumb { background: ${C.bg4}; border-radius: 10px; }
  ::placeholder { color: ${C.text3} !important; }
`;

// helpers
const card = (extra = {}) => ({
  background: C.bg3,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: 20,
  ...extra,
});

const statusColors = (s) => ({
  "Open": { bg: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "rgba(251,191,36,0.25)" },
  "In Progress": { bg: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "rgba(59,130,246,0.25)" },
  "Resolved": { bg: "rgba(52,211,153,0.1)", color: "#34d399", border: "rgba(52,211,153,0.25)" },
}[s] || { bg: C.bg4, color: C.text2, border: C.border });

const statusDot = (s) => ({ "Open": C.amber, "In Progress": C.blue, "Resolved": C.green }[s] || C.text3);

function Badge({ status }) {
  const sc = statusColors(status);
  return (
    <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: "3px 11px", borderRadius: 99, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

function SLABar({ slaHrs, elapsed, status }) {
  const pct = Math.min(100, Math.round((elapsed / slaHrs) * 100));
  const color = status === "Resolved" ? C.green : pct > 85 ? C.red : pct > 60 ? C.amber : C.blue;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.text2, marginBottom: 6 }}>
        <span>{elapsed}h / {slaHrs}h</span>
        <span style={{ color: pct > 85 && status !== "Resolved" ? C.red : C.text2, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: C.bg5, borderRadius: 99 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99 }} />
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>{label}</div>}
      <input style={{ width: "100%", background: C.bg4, border: `1px solid ${C.border}`, color: C.text1, borderRadius: 10, padding: "10px 14px", fontSize: 14, outline: "none" }} {...props} />
    </div>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function Landing({ go }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg1, color: C.text1, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <style>{ss}</style>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 40px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#3b82f6,#22d3ee)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 15 }}>F</div>
          <span style={{ fontWeight: 800, fontSize: 17 }}>Fast CMS</span>
          <span style={{ fontSize: 10, background: "rgba(34,211,238,0.1)", color: C.cyan, border: `1px solid rgba(34,211,238,0.2)`, padding: "2px 8px", borderRadius: 99, marginLeft: 2 }}>B2B SaaS</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => go("login")} style={{ padding: "8px 18px", fontSize: 13, color: C.text2, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 9, cursor: "pointer" }}>Sign In</button>
          <button onClick={() => go("customer")} style={{ padding: "8px 18px", fontSize: 13, color: "#fff", background: C.blue, border: "none", borderRadius: 9, fontWeight: 700, cursor: "pointer" }}>Try Demo</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "80px 24px 56px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, color: C.cyan, background: "rgba(34,211,238,0.07)", border: `1px solid rgba(34,211,238,0.18)`, padding: "5px 14px", borderRadius: 99, marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, background: C.cyan, borderRadius: 99, display: "inline-block", animation: "pulse 2s infinite" }} />
          QR · NFC · WhatsApp-First Service Management
        </div>
        <h1 style={{ fontSize: "clamp(36px,5.5vw,62px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-1.5px", marginBottom: 18 }}>
          One Tap to Service.<br />
          <span style={{ background: "linear-gradient(90deg,#60a5fa,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Lifetime Customer Connection.</span>
        </h1>
        <p style={{ fontSize: 16, color: C.text2, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 36px" }}>
          Fast Complaint Management System lets customers raise service requests by scanning a QR code on their product — no app download. Creates a structured ticket in your dashboard instantly.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => go("login")} style={{ padding: "13px 28px", fontSize: 14, fontWeight: 700, color: "#fff", background: C.blue, border: "none", borderRadius: 12, cursor: "pointer", boxShadow: "0 0 40px rgba(59,130,246,0.3)" }}>
            View Admin Dashboard →
          </button>
          <button onClick={() => go("customer")} style={{ padding: "13px 28px", fontSize: 14, fontWeight: 600, color: C.text1, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 12, cursor: "pointer" }}>
            📱 Simulate QR Scan
          </button>
        </div>
        <p style={{ fontSize: 12, color: C.text3, marginTop: 14 }}>Demo login: admin@madhurisolars.in / demo123</p>
      </div>

      {/* Flow */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 70px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
        {[
          { icon: "📦", n: "01", title: "Product Shipped", sub: "QR/NFC tag on product" },
          { icon: "📱", n: "02", title: "Customer Scans", sub: "Opens WhatsApp instantly" },
          { icon: "🎫", n: "03", title: "Ticket Created", sub: "Auto-structured in dashboard" },
          { icon: "✅", n: "04", title: "Job Resolved", sub: "Customer notified via WhatsApp" },
        ].map(({ icon, n, title, sub }) => (
          <div key={n} style={{ ...card(), textAlign: "center", transition: "border-color .2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
            <div style={{ fontSize: 10, color: C.blue, fontFamily: "monospace", marginBottom: 4 }}>STEP {n}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text1, marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 12, color: C.text2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 60, flexWrap: "wrap" }}>
          {[["34%", "Faster Resolution"], ["92%", "SLA Compliance"], ["0", "App Downloads Needed"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 38, fontWeight: 900, background: "linear-gradient(90deg,#60a5fa,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{v}</div>
              <div style={{ fontSize: 13, color: C.text2, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "40px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: C.text3, textTransform: "uppercase", letterSpacing: 3, marginBottom: 18 }}>Trusted By</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          {["Madhuri Solars Pvt Ltd", "Shree Sai RO Systems", "Omkar Appliances"].map(b => (
            <div key={b} style={{ fontSize: 13, color: C.text2, background: C.bg3, border: `1px solid ${C.border}`, padding: "8px 18px", borderRadius: 99 }}>{b}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ go, onLogin }) {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("admin@madhurisolars.in");
  const [pass, setPass] = useState("demo123");
  const [err, setErr] = useState("");

  const handle = () => {
    if (role === "admin" && email === "admin@madhurisolars.in" && pass === "demo123") return onLogin("admin");
    if (role === "tech") return onLogin("tech");
    setErr("Incorrect credentials. Use the demo credentials below.");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{ss}</style>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <button onClick={() => go("landing")} style={{ background: "none", border: "none", color: C.text2, fontSize: 13, cursor: "pointer", marginBottom: 28 }}>← Back to Home</button>
        <div style={{ ...card(), padding: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 28 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#3b82f6,#22d3ee)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff" }}>F</div>
            <span style={{ fontWeight: 800, fontSize: 17, color: C.text1 }}>Fast CMS</span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text1, marginBottom: 4 }}>Sign In</h2>
          <p style={{ fontSize: 13, color: C.text2, marginBottom: 24 }}>Access your service dashboard</p>

          <div style={{ display: "flex", background: C.bg4, borderRadius: 10, padding: 4, marginBottom: 22 }}>
            {["admin", "tech"].map(r => (
              <button key={r} onClick={() => { setRole(r); setEmail(r === "admin" ? "admin@madhurisolars.in" : "rohit@madhurisolars.in"); }}
                style={{ flex: 1, padding: "9px 0", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "none", background: role === r ? C.blue : "transparent", color: role === r ? "#fff" : C.text2, cursor: "pointer", transition: "all .15s" }}>
                {r === "admin" ? "Admin" : "Technician"}
              </button>
            ))}
          </div>

          <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} />
          {err && <p style={{ fontSize: 12, color: C.red, marginBottom: 12 }}>{err}</p>}
          <button onClick={handle} style={{ width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 700, color: "#fff", background: C.blue, border: "none", borderRadius: 10, cursor: "pointer", marginTop: 4 }}>Sign In</button>
          <div style={{ marginTop: 18, padding: "10px 14px", background: C.bg4, borderRadius: 9, fontSize: 12, color: C.text3 }}>
            Demo: admin@madhurisolars.in / demo123
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CUSTOMER QR FLOW ─────────────────────────────────────────────────────────
function CustomerFlow({ go, onTicketCreate }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [desc, setDesc] = useState("");
  const [done, setDone] = useState(false);
  const [tid] = useState("TC-" + (1028 + Math.floor(Math.random() * 40)));
  const chatRef = useRef(null);
  const issues = ["🔧 Installation Issue", "⚡ Performance Issue", "🧾 Warranty / AMC"];

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    if (step === 2) { const t = setTimeout(() => setStep(3), 700); return () => clearTimeout(t); }
  }, [step]);

  const submit = () => {
    onTicketCreate && onTicketCreate(tid, selected);
    setDone(true);
  };

  if (done) return (
    <div style={{ minHeight: "100vh", background: C.bg1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{ss}</style>
      <div style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
        <div style={{ width: 76, height: 76, background: "rgba(52,211,153,0.1)", border: `2px solid rgba(52,211,153,0.3)`, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 22px" }}>✅</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: C.text1, marginBottom: 6 }}>Ticket Created!</h2>
        <p style={{ fontSize: 14, color: C.text2, marginBottom: 22 }}>Your request has been submitted successfully.</p>
        <div style={{ ...card(), marginBottom: 18, textAlign: "left" }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: C.blue, textAlign: "center", marginBottom: 4 }}>{tid}</div>
          <div style={{ fontSize: 13, color: C.text2, textAlign: "center", marginBottom: 16 }}>Service Request ID</div>
          {[["Issue", selected], ["Status", "Open"], ["Organization", "Madhuri Solars Pvt Ltd"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.text2 }}>{k}</span>
              <span style={{ color: C.text1, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
        {/* WhatsApp notification */}
        <div style={{ background: "#075e54", borderRadius: 16, padding: 16, marginBottom: 18, textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 99, background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#fff" }}>F</div>
            <div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Fast CMS Alerts</div>
              <div style={{ color: "#a7f3d0", fontSize: 11 }}>Business Account ✓</div>
            </div>
          </div>
          <div style={{ background: "#dcf8c6", borderRadius: "0 12px 12px 12px", padding: "10px 14px", color: "#111", fontSize: 13, lineHeight: 1.65 }}>
            ✅ <strong>Ticket Raised Successfully!</strong><br /><br />
            Ticket ID: <strong>{tid}</strong><br />
            Issue: {selected}<br />
            Our team will contact you shortly.<br /><br />
            — Madhuri Solars Pvt Ltd
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => go("login")} style={{ flex: 1, padding: 13, fontSize: 13, fontWeight: 700, color: "#fff", background: C.blue, border: "none", borderRadius: 12, cursor: "pointer" }}>View Admin Dashboard</button>
          <button onClick={() => go("landing")} style={{ flex: 1, padding: 13, fontSize: 13, color: C.text2, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 12, cursor: "pointer" }}>Back to Home</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <style>{ss}</style>
      <div style={{ width: "100%", maxWidth: 340 }}>
        <button onClick={() => go("landing")} style={{ background: "none", border: "none", color: C.text2, fontSize: 13, cursor: "pointer", marginBottom: 14 }}>← Back</button>
        {/* Phone */}
        <div style={{ background: "#0d1117", borderRadius: 36, border: "2px solid rgba(255,255,255,0.1)", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}>
          {/* WA Header */}
          <div style={{ background: "#075e54", padding: "14px 16px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => go("landing")} style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, background: "none", border: "none", cursor: "pointer" }}>←</button>
              <div style={{ width: 36, height: 36, borderRadius: 99, background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#fff" }}>M</div>
              <div>
                <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>Madhuri Solars Service</div>
                <div style={{ color: "#a7f3d0", fontSize: 11 }}>Business Account</div>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div ref={chatRef} style={{ background: "#e5ddd5", padding: 12, minHeight: 300, maxHeight: 400, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ background: "#dcf8c6", borderRadius: "12px 12px 0 12px", padding: "8px 12px", fontSize: 13, color: "#111", maxWidth: "80%" }}>
                👋 Hi, I need service for my solar system.
              </div>
            </div>
            {step >= 1 && <div style={{ display: "flex" }}><div style={{ background: "#fff", borderRadius: "12px 12px 12px 0", padding: "8px 12px", fontSize: 13, color: "#111", maxWidth: "85%" }}>Sure! Select your issue type 👇</div></div>}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 8 }}>
                {issues.map(i => (
                  <button key={i} onClick={() => { setSelected(i); setStep(2); }}
                    style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 10, padding: "8px 12px", fontSize: 13, color: "#111", textAlign: "left", cursor: "pointer" }}>{i}</button>
                ))}
              </div>
            )}
            {step >= 2 && selected && <div style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ background: "#dcf8c6", borderRadius: "12px 12px 0 12px", padding: "8px 12px", fontSize: 13, color: "#111" }}>{selected}</div></div>}
            {step >= 3 && <div style={{ display: "flex" }}><div style={{ background: "#fff", borderRadius: "12px 12px 12px 0", padding: "8px 12px", fontSize: 13, color: "#111", maxWidth: "85%" }}>Got it! Describe the issue briefly.</div></div>}
            {step >= 3 && desc && <div style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ background: "#dcf8c6", borderRadius: "12px 12px 0 12px", padding: "8px 12px", fontSize: 13, color: "#111", maxWidth: "80%" }}>{desc}</div></div>}
            {step >= 4 && <div style={{ display: "flex" }}><div style={{ background: "#fff", borderRadius: "12px 12px 12px 0", padding: "8px 12px", fontSize: 13, color: "#111" }}>📷 Optionally attach a photo, then submit.</div></div>}
          </div>

          {/* Controls */}
          <div style={{ background: "#f0f0f0", padding: 10 }}>
            {step === 0 && <button onClick={() => setStep(1)} style={{ width: "100%", padding: "11px 0", background: "#25d366", color: "#fff", border: "none", borderRadius: 13, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Start Service Request 🚀</button>}
            {step >= 3 && step < 4 && (
              <div style={{ display: "flex", gap: 8 }}>
                <input placeholder="Describe your issue..." value={desc} onChange={e => setDesc(e.target.value)} onKeyDown={e => e.key === "Enter" && desc && setStep(4)}
                  style={{ flex: 1, background: "#fff", border: "1px solid #ddd", color: "#111", borderRadius: 99, padding: "9px 14px", fontSize: 13, outline: "none" }} />
                <button onClick={() => desc && setStep(4)} style={{ width: 38, height: 38, borderRadius: 99, background: "#25d366", color: "#fff", border: "none", fontSize: 16, cursor: "pointer", flexShrink: 0 }}>↑</button>
              </div>
            )}
            {step >= 4 && (
              <div style={{ display: "flex", gap: 8 }}>
                <label style={{ flex: 1, padding: "9px 14px", background: "#fff", borderRadius: 99, fontSize: 12, color: "#888", textAlign: "center", cursor: "pointer" }}>
                  📎 Attach photo (optional)<input type="file" style={{ display: "none" }} />
                </label>
                <button onClick={submit} style={{ padding: "9px 16px", background: "#25d366", color: "#fff", border: "none", borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Submit</button>
              </div>
            )}
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: C.text3, marginTop: 12 }}>Simulating QR Scan → WhatsApp → Ticket</p>
      </div>
    </div>
  );
}

// ─── ADMIN SHELL ──────────────────────────────────────────────────────────────
function Admin({ go, tickets, setTickets }) {
  const [view, setView] = useState("overview");
  const [sel, setSel] = useState(null);
  const nav = [
    { id: "overview", icon: "⊞", label: "Overview" },
    { id: "tickets", icon: "🎫", label: "Tickets" },
    { id: "assets", icon: "📦", label: "Assets" },
    { id: "analytics", icon: "📊", label: "Analytics" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg1, color: C.text1, fontFamily: "'DM Sans',system-ui,sans-serif", overflow: "hidden" }}>
      <style>{ss}</style>
      {/* Sidebar */}
      <div style={{ width: 210, background: C.bg2, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#3b82f6,#22d3ee)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#fff" }}>F</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: C.text1 }}>Fast CMS</span>
          </div>
          <div style={{ fontSize: 11, color: C.text3 }}>Madhuri Solars Pvt Ltd</div>
        </div>
        <div style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 3 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => { setView(n.id); setSel(null); }}
              style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderRadius: 9, border: "none", background: view === n.id ? C.blue : "transparent", color: view === n.id ? "#fff" : C.text2, fontSize: 13, fontWeight: view === n.id ? 700 : 400, cursor: "pointer", textAlign: "left" }}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>
        <div style={{ padding: "14px 16px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.text3 }}>Logged in as</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text1, marginTop: 2, marginBottom: 10 }}>Admin User</div>
          <button onClick={() => go("landing")} style={{ fontSize: 12, color: C.text3, background: "none", border: "none", cursor: "pointer" }}>← Sign Out</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        {view === "overview" && <Overview tickets={tickets} setView={setView} setSel={setSel} />}
        {view === "tickets" && !sel && <TicketList tickets={tickets} onSelect={setSel} />}
        {view === "tickets" && sel && <TicketDetail ticket={sel} onBack={() => setSel(null)} tickets={tickets} setTickets={setTickets} />}
        {view === "assets" && <Assets />}
        {view === "analytics" && <Analytics tickets={tickets} />}
      </div>
    </div>
  );
}

function Overview({ tickets, setView, setSel }) {
  const open = tickets.filter(t => t.status === "Open").length;
  const inp = tickets.filter(t => t.status === "In Progress").length;
  const kpis = [
    { label: "Total Tickets", val: tickets.length, color: C.blue },
    { label: "Open", val: open, color: C.amber },
    { label: "In Progress", val: inp, color: "#60a5fa" },
    { label: "Avg Resolution", val: "26 hrs", color: C.purple },
    { label: "SLA Compliance", val: "92%", color: C.green },
  ];
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text1 }}>Dashboard Overview</h1>
        <p style={{ fontSize: 13, color: C.text2, marginTop: 4 }}>Sat, 21 Feb 2025 — Madhuri Solars Pvt Ltd</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, marginBottom: 30 }}>
        {kpis.map(k => (
          <div key={k.label} style={card()}>
            <div style={{ fontSize: 26, fontWeight: 900, color: k.color }}>{k.val}</div>
            <div style={{ fontSize: 12, color: C.text2, marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: C.text1, marginBottom: 12 }}>Recent Tickets</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {tickets.slice(0, 5).map(t => (
          <div key={t.id} onClick={() => { setView("tickets"); setSel(t); }}
            style={{ ...card(), padding: "13px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 8, height: 8, borderRadius: 99, background: statusDot(t.status), flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text1 }}>{t.id} – {t.customer}</div>
                <div style={{ fontSize: 12, color: C.text2, marginTop: 2 }}>{t.issue} · {t.product}</div>
              </div>
            </div>
            <Badge status={t.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketList({ tickets, onSelect }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? tickets : tickets.filter(t => t.status === filter);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text1 }}>Ticket Management</h1>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Open", "In Progress", "Resolved"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "7px 13px", fontSize: 12, fontWeight: 600, border: `1px solid ${filter === f ? C.blue : C.border}`, background: filter === f ? C.blue : "transparent", color: filter === f ? "#fff" : C.text2, borderRadius: 8, cursor: "pointer" }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div style={{ ...card(), padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 110px 130px 120px", gap: 12, padding: "11px 18px", background: C.bg4, borderBottom: `1px solid ${C.border}` }}>
          {["Ticket ID", "Customer", "Issue", "Status", "Technician", "SLA"].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</div>
          ))}
        </div>
        {filtered.map((t, i) => (
          <div key={t.id} onClick={() => onSelect(t)}
            style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 110px 130px 120px", gap: 12, padding: "13px 18px", borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer", alignItems: "center" }}
            onMouseEnter={e => e.currentTarget.style.background = C.bg4}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 700, color: C.blue }}>{t.id}</div>
            <div><div style={{ fontSize: 13, fontWeight: 600, color: C.text1 }}>{t.customer}</div><div style={{ fontSize: 11, color: C.text2 }}>{t.location}</div></div>
            <div style={{ fontSize: 12, color: C.text2 }}>{t.issue}</div>
            <Badge status={t.status} />
            <div style={{ fontSize: 12, color: C.text2 }}>{t.tech}</div>
            <div>
              <div style={{ fontSize: 11, color: C.text2, marginBottom: 4 }}>{t.elapsed}h / {t.slaHrs}h</div>
              <div style={{ height: 4, background: C.bg5, borderRadius: 99, width: 80 }}>
                <div style={{ height: "100%", width: `${Math.min(100, Math.round((t.elapsed / t.slaHrs) * 100))}%`, background: t.status === "Resolved" ? C.green : Math.round((t.elapsed / t.slaHrs) * 100) > 85 ? C.red : C.blue, borderRadius: 99 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketDetail({ ticket, onBack, tickets, setTickets }) {
  const [t, setT] = useState(ticket);
  const [note, setNote] = useState("");
  const [assignTech, setAssignTech] = useState(ticket.tech);

  const updateStatus = (s) => {
    const u = { ...t, status: s };
    setT(u);
    setTickets(prev => prev.map(tk => tk.id === t.id ? u : tk));
  };

  const kv = (k, v, mono = false) => (
    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
      <span style={{ color: C.text2 }}>{k}</span>
      <span style={{ color: mono ? C.blue : C.text1, fontWeight: 600, fontFamily: mono ? "monospace" : "inherit" }}>{v}</span>
    </div>
  );

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.text2, fontSize: 13, cursor: "pointer", marginBottom: 18 }}>← Ticket List</button>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text1 }}>{t.id}</h1>
          <p style={{ fontSize: 13, color: C.text2, marginTop: 3 }}>{t.created} · {t.org}</p>
        </div>
        <Badge status={t.status} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Customer */}
          <div style={card()}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Customer Details</div>
            {kv("Name", t.customer)}{kv("Phone", t.phone)}{kv("Location", t.location)}{kv("Asset ID", t.assetId, true)}
          </div>

          {/* Complaint */}
          <div style={card()}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Complaint</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, background: "rgba(249,115,22,0.1)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.25)", padding: "3px 10px", borderRadius: 99 }}>{t.issue}</span>
              <span style={{ fontSize: 12, background: C.bg4, color: C.text2, border: `1px solid ${C.border}`, padding: "3px 10px", borderRadius: 99 }}>{t.product}</span>
            </div>
            <p style={{ fontSize: 14, color: C.text1, lineHeight: 1.65 }}>{t.desc}</p>
            <div style={{ marginTop: 12, padding: "9px 13px", background: C.bg4, borderRadius: 9, fontSize: 12, color: C.text3 }}>📎 No image attached</div>
          </div>

          {/* Timeline */}
          <div style={card()}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Status Timeline</div>
            {t.timeline.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < t.timeline.length - 1 ? 16 : 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: 99, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: step.done ? "rgba(52,211,153,0.1)" : C.bg4, color: step.done ? C.green : C.text3, border: `2px solid ${step.done ? C.green : C.border}` }}>
                  {step.done ? "✓" : i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: step.done ? 600 : 400, color: step.done ? C.text1 : C.text3 }}>{step.label}</div>
                  {step.time !== "—" && <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{step.time}</div>}
                </div>
              </div>
            ))}
          </div>

          {t.status === "In Progress" && (
            <div style={{ background: "#075e54", borderRadius: 14, padding: 16 }}>
              <div style={{ color: "#a7f3d0", fontSize: 12, fontWeight: 600, marginBottom: 10 }}>📱 WhatsApp update auto-sent to customer</div>
              <div style={{ background: "#dcf8c6", borderRadius: "0 12px 12px 12px", padding: "10px 14px", color: "#111", fontSize: 13, lineHeight: 1.65 }}>
                Your ticket <strong>{t.id}</strong> has been assigned to <strong>{t.tech}</strong>.<br />
                ETA: Today 4–6 PM &nbsp;—&nbsp; {t.org}
              </div>
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={card()}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>SLA Monitor</div>
            <SLABar slaHrs={t.slaHrs} elapsed={t.elapsed} status={t.status} />
          </div>

          <div style={card()}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Assign Technician</div>
            <select value={assignTech} onChange={e => setAssignTech(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", fontSize: 13, marginBottom: 12, borderRadius: 9, background: C.bg4, border: `1px solid ${C.border}`, color: C.text1, outline: "none" }}>
              <option>Unassigned</option>
              {TECHS.map(tc => <option key={tc.name}>{tc.name}</option>)}
            </select>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {["Open", "In Progress", "Resolved"].map(s => (
                <button key={s} onClick={() => updateStatus(s)}
                  style={{ padding: "10px 0", fontSize: 13, fontWeight: 600, borderRadius: 9, border: `1px solid ${t.status === s ? C.blue : C.border}`, background: t.status === s ? C.blue : "transparent", color: t.status === s ? "#fff" : C.text2, cursor: "pointer" }}>
                  {s === "Resolved" && "✓ "}Mark as {s}
                </button>
              ))}
            </div>
          </div>

          <div style={card()}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Internal Notes</div>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={4} placeholder="Add a note for the team..."
              style={{ width: "100%", padding: "9px 12px", fontSize: 13, borderRadius: 9, background: C.bg4, border: `1px solid ${C.border}`, color: C.text1, outline: "none", resize: "none", marginBottom: 10 }} />
            <button style={{ width: "100%", padding: 10, fontSize: 13, fontWeight: 600, color: C.text1, background: C.bg5, border: `1px solid ${C.border}`, borderRadius: 9, cursor: "pointer" }}>Save Note</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Assets() {
  const [sel, setSel] = useState(null);
  if (sel) return (
    <div>
      <button onClick={() => setSel(null)} style={{ background: "none", border: "none", color: C.text2, fontSize: 13, cursor: "pointer", marginBottom: 20 }}>← Asset Registry</button>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text1, marginBottom: 22 }}>{sel.id}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 16 }}>
        <div style={card()}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Asset Details</div>
          {[["Product", sel.product], ["Asset ID", sel.id], ["Customer", sel.customer], ["Location", sel.location], ["Installed On", sel.installed], ["Warranty", sel.warranty], ["Organization", sel.org], ["Total Tickets", sel.tickets]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.text2 }}>{k}</span><span style={{ color: C.text1, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ ...card(), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 11, color: C.text3, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>QR Code</div>
          <div style={{ width: 110, height: 110, background: "#fff", borderRadius: 10, padding: 8, display: "grid", gridTemplateColumns: "repeat(9,1fr)", gap: 1.5 }}>
            {Array.from({ length: 81 }).map((_, i) => (
              <div key={i} style={{ background: ((i % 7 + i * 3 + i) % 5 > 1) ? "#111" : "#fff" }} />
            ))}
          </div>
          <div style={{ fontSize: 12, fontFamily: "monospace", color: C.blue, marginTop: 10 }}>{sel.id}</div>
          <div style={{ fontSize: 11, color: C.text3, marginTop: 4 }}>Scan to raise service request</div>
          <div style={{ marginTop: 10, fontSize: 11, color: C.green, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", padding: "3px 12px", borderRadius: 99 }}>NFC also supported</div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text1, marginBottom: 22 }}>Asset Registry</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
        {ASSETS.map(a => (
          <div key={a.id} onClick={() => setSel(a)} style={{ ...card(), cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>📦</div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: C.blue, marginBottom: 4 }}>{a.id}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text1, marginBottom: 4 }}>{a.product}</div>
            <div style={{ fontSize: 12, color: C.text2, marginBottom: 14 }}>{a.customer} · {a.location}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: C.green, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", padding: "3px 10px", borderRadius: 99 }}>Warranty Active</span>
              <span style={{ fontSize: 12, color: C.text3 }}>{a.tickets} tickets</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  const maxCount = Math.max(...MONTHLY.map(m => m.count));
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text1, marginBottom: 22 }}>Analytics & Reports</h1>
      <div style={{ background: "linear-gradient(135deg,#1d4ed8,#0e7490)", borderRadius: 16, padding: 22, marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Business Impact</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.55, marginBottom: 18 }}>"Fast CMS reduced average resolution time by 34% and increased customer satisfaction by 28%."</div>
        <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
          {[["34%", "Faster Resolution"], ["92%", "SLA Met"], ["0", "App Downloads"]].map(([v, l]) => (
            <div key={l}><div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{v}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{l}</div></div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={card()}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text1, marginBottom: 18 }}>Tickets Per Month</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
            {MONTHLY.map(m => (
              <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ fontSize: 11, color: C.text2, fontWeight: 600 }}>{m.count}</div>
                <div style={{ width: "100%", borderRadius: "5px 5px 0 0", background: m.month === "Feb" ? C.blue : C.bg5, height: `${(m.count / maxCount) * 90}px`, minHeight: 10 }} />
                <div style={{ fontSize: 10, color: C.text3 }}>{m.month}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={card()}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text1, marginBottom: 18 }}>Issue Categories</div>
          {ISSUE_DIST.map(d => (
            <div key={d.label} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: C.text1 }}>{d.label}</span>
                <span style={{ color: d.color, fontWeight: 700 }}>{d.pct}%</span>
              </div>
              <div style={{ height: 8, background: C.bg5, borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${d.pct}%`, background: d.color, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={card()}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text1, marginBottom: 18 }}>Technician Performance</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
          {TECHS.map(tc => (
            <div key={tc.name} style={{ background: C.bg4, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 99, background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: C.blue }}>{tc.name[0]}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text1 }}>{tc.name}</div>
                  <div style={{ fontSize: 11, color: C.text2 }}>{tc.role}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", textAlign: "center" }}>
                {[["Assigned", tc.assigned, C.blue], ["Resolved", tc.resolved, C.green], ["Rating", "⭐"+tc.rating, C.amber]].map(([l, v, c]) => (
                  <div key={l}><div style={{ fontSize: 15, fontWeight: 800, color: c }}>{v}</div><div style={{ fontSize: 10, color: C.text3, marginTop: 2 }}>{l}</div></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TECH VIEW ────────────────────────────────────────────────────────────────
function TechView({ go }) {
  const tech = TECHS[0];
  const myTickets = TICKETS.filter(t => t.tech === tech.name);
  const [statuses, setStatuses] = useState({});
  const [notes, setNotes] = useState({});
  const [waMsg, setWaMsg] = useState(null);

  const updateJob = (id, status) => {
    setStatuses(p => ({ ...p, [id]: status }));
    if (status === "Resolved") setWaMsg(id);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg1, color: C.text1, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <style>{ss}</style>
      <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 99, background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: C.blue }}>R</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text1 }}>{tech.name}</div>
            <div style={{ fontSize: 12, color: C.text2 }}>{tech.role} · {tech.location}</div>
          </div>
        </div>
        <button onClick={() => go("landing")} style={{ background: "none", border: "none", color: C.text3, fontSize: 12, cursor: "pointer" }}>Sign Out</button>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 26 }}>
          {[["Assigned", myTickets.length, C.blue], ["Resolved", Object.values(statuses).filter(s => s === "Resolved").length, C.green], ["Rating", "⭐"+tech.rating, C.amber]].map(([l, v, c]) => (
            <div key={l} style={{ ...card(), textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: c }}>{v}</div>
              <div style={{ fontSize: 12, color: C.text2, marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text1, marginBottom: 14 }}>My Jobs Today</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {myTickets.map(t => {
            const st = statuses[t.id] || t.status;
            return (
              <div key={t.id} style={card()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 700, color: C.blue }}>{t.id}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.text1, marginTop: 2 }}>{t.customer}</div>
                    <div style={{ fontSize: 12, color: C.text2 }}>{t.location} · {t.product}</div>
                  </div>
                  <Badge status={st} />
                </div>
                <div style={{ fontSize: 13, color: C.text1, background: C.bg4, borderRadius: 9, padding: "10px 13px", marginBottom: 12, lineHeight: 1.55 }}>{t.desc}</div>
                <textarea value={notes[t.id] || ""} onChange={e => setNotes(p => ({ ...p, [t.id]: e.target.value }))} rows={2}
                  placeholder="Add job notes..." style={{ width: "100%", padding: "9px 12px", fontSize: 13, marginBottom: 12, resize: "none", background: C.bg4, border: `1px solid ${C.border}`, color: C.text1, borderRadius: 9, outline: "none" }} />
                <div style={{ display: "flex", gap: 10 }}>
                  {st === "Open" && <button onClick={() => updateJob(t.id, "In Progress")} style={{ flex: 1, padding: "12px 0", fontSize: 13, fontWeight: 700, color: "#fff", background: C.blue, border: "none", borderRadius: 11, cursor: "pointer" }}>▶ Start Job</button>}
                  {st === "In Progress" && <button onClick={() => updateJob(t.id, "Resolved")} style={{ flex: 1, padding: "12px 0", fontSize: 13, fontWeight: 700, color: "#fff", background: "#16a34a", border: "none", borderRadius: 11, cursor: "pointer" }}>✓ Mark Resolved</button>}
                  {st === "Resolved" && <div style={{ flex: 1, padding: "12px 0", fontSize: 13, fontWeight: 700, color: C.green, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 11, textAlign: "center" }}>✅ Resolved</div>}
                </div>
              </div>
            );
          })}
        </div>
        {waMsg && (
          <div style={{ marginTop: 20, background: "#075e54", borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#a7f3d0", marginBottom: 10 }}>📱 Auto-sent to customer via WhatsApp</div>
            <div style={{ background: "#dcf8c6", borderRadius: "0 12px 12px 12px", padding: "10px 14px", color: "#111", fontSize: 13, lineHeight: 1.65 }}>
              ✅ <strong>Ticket {waMsg} has been resolved!</strong><br /><br />
              Technician: <strong>{tech.name}</strong><br />
              Notes: {notes[waMsg] || "Job completed successfully."}<br /><br />
              Rate your experience: ⭐⭐⭐⭐⭐<br />
              — Madhuri Solars Pvt Ltd
            </div>
            <button onClick={() => setWaMsg(null)} style={{ marginTop: 10, background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 12, cursor: "pointer", width: "100%", textAlign: "center" }}>Dismiss</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [tickets, setTickets] = useState(TICKETS);

  const handleTicketCreate = (id, issue) => {
    setTickets(p => [{
      id, customer: "Priya Mehta", phone: "+91 99000 11223", location: "Kolhapur",
      product: "RO Water Purifier 50L", assetId: "AS-RO-0062", issue,
      status: "Open", tech: "Unassigned", created: new Date().toLocaleString(),
      slaHrs: 12, elapsed: 0, desc: "Submitted via QR scan.",
      org: "Shree Sai RO Systems",
      timeline: [
        { time: new Date().toLocaleTimeString(), label: "Ticket Created", done: true },
        { time: "—", label: "Assigned", done: false },
        { time: "—", label: "Technician En Route", done: false },
        { time: "—", label: "Resolved", done: false },
      ]
    }, ...p]);
  };

  return (
    <>
      {page === "landing" && <Landing go={setPage} />}
      {page === "customer" && <CustomerFlow go={setPage} onTicketCreate={handleTicketCreate} />}
      {page === "login" && <Login go={setPage} onLogin={r => setPage(r === "admin" ? "admin" : "tech")} />}
      {page === "admin" && <Admin go={setPage} tickets={tickets} setTickets={setTickets} />}
      {page === "tech" && <TechView go={setPage} />}
    </>
  );
}
