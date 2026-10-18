export interface ProjectMediaItem {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  caption: string;
  badge?: string;
}

export type GalleryLayoutMode = "horizontal" | "vertical";

export interface ProjectData {
  id: string;
  internalId: string;
  title: string;
  subtitle?: string;
  category?: string;
  tagline: string;
  description?: string;
  meta: string;
  coverImage: string;
  device: "phone" | "macbook" | "tablet";
  orientation?: "portrait" | "landscape";
  galleryLayout?: GalleryLayoutMode;
  galleryImages: string[];
  mediaItems?: ProjectMediaItem[];
}

export function getProjectGalleryLayout(project: ProjectData): GalleryLayoutMode {
  if (project.galleryLayout) return project.galleryLayout;
  if (project.orientation === "landscape") return "vertical";
  if (project.orientation === "portrait") return "horizontal";
  if (project.device === "macbook") return "vertical";
  return "horizontal"; // default portrait horizontal rotunda
}

export const PROJECTS: ProjectData[] = [
  {
    id: "01",
    internalId: "medio",
    title: "MEDIO",
    subtitle: "Spatial Social Discovery",
    category: "PRODUCT DESIGN · MOBILE DEVELOPMENT",
    tagline: "Meet somewhere\nin the middle.",
    description: "Medio is an intelligent meeting-point engine that computes optimal rendezvous points between two or more parties, factoring in real-time transit routes, venue ambiance, and schedule overlap.",
    meta: "PRODUCT DESIGN · DEVELOPMENT · 2026",
    coverImage: "/projects/medio/medio.png",
    device: "phone",
    orientation: "portrait",
    galleryLayout: "horizontal",
    galleryImages: [
      "/projects/medio/medio.png",
      "/projects/medio/2.png",
      "/projects/medio/3.png",
      "/projects/medio/4.png",
      "/projects/medio/5.png",
      "/projects/medio/6.png",
      "/projects/medio/7.png"
    ],
    mediaItems: [
      {
        id: "medio-1",
        type: "image",
        src: "/projects/medio/medio.png",
        title: "Midpoint Calculation Map",
        caption: "Geospatial routing engine balancing travel times and transit convenience for all parties.",
        badge: "CORE ENGINE"
      },
      {
        id: "medio-2",
        type: "image",
        src: "/projects/medio/2.png",
        title: "Curated Venue Deck",
        caption: "Handpicked cafes and collaborative spaces with acoustic and amenity ratings.",
        badge: "CURATION"
      },
      {
        id: "medio-3",
        type: "image",
        src: "/projects/medio/3.png",
        title: "Smart Invitation Flow",
        caption: "One-tap invite cards sent directly via iMessage, WhatsApp, or calendar sync.",
        badge: "ONBOARDING"
      },
      {
        id: "medio-4",
        type: "image",
        src: "/projects/medio/4.png",
        title: "Live Transit Tracking",
        caption: "Real-time ETA synchronization preventing awkward waiting and arrival mismatches.",
        badge: "TELEMETRY"
      },
      {
        id: "medio-5",
        type: "image",
        src: "/projects/medio/5.png",
        title: "Preference Matcher",
        caption: "Synchronized filters for quiet corners, specialty roasts, or outdoor seating.",
        badge: "PREFERENCES"
      },
      {
        id: "medio-6",
        type: "image",
        src: "/projects/medio/6.png",
        title: "Calendar & Schedule Sync",
        caption: "Frictionless time-slot finder integrating Google Calendar and Apple iCal.",
        badge: "INTEGRATION"
      },
      {
        id: "medio-7",
        type: "image",
        src: "/projects/medio/7.png",
        title: "Arrival Notification Card",
        caption: "Contextual nudge and table locator when both participants reach the rendezvous venue.",
        badge: "DELIGHT"
      }
    ]
  },
  {
    id: "02",
    internalId: "cafemitra",
    title: "CAFEMITRA",
    subtitle: "Consumer Cafe Experience",
    category: "CONSUMER APP · POS INTEGRATION",
    tagline: "One system.\nTwo sides of the counter.",
    description: "CafeMitra bridges the gap between cafe patrons and counter staff with zero-wait table ordering, digital stamp rewards, and contactless payments.",
    meta: "PRODUCT DESIGN · FULL-STACK DEVELOPMENT · 2026",
    coverImage: "/projects/cafemitra/cafemitra-consumer-app.png",
    device: "phone",
    orientation: "portrait",
    galleryLayout: "horizontal",
    galleryImages: [
      "/projects/cafemitra/cafemitra-consumer-app.png",
      "/projects/cafemitra/2.png",
      "/projects/cafemitra/3.png",
      "/projects/cafemitra/4.png",
      "/projects/cafemitra/5.png",
      "/projects/cafemitra/6.png",
      "/projects/cafemitra/7.png"
    ],
    mediaItems: [
      {
        id: "cafe-1",
        type: "image",
        src: "/projects/cafemitra/cafemitra-consumer-app.png",
        title: "Mobile Ordering Deck",
        caption: "Fluid, zero-friction coffee customization with custom roasts, grinds, and milk options.",
        badge: "CONSUMER"
      },
      {
        id: "cafe-2",
        type: "image",
        src: "/projects/cafemitra/2.png",
        title: "Digital Loyalty Pass",
        caption: "NFC and QR-enabled stamp card that lives natively inside Apple and Google Wallet.",
        badge: "LOYALTY"
      },
      {
        id: "cafe-3",
        type: "image",
        src: "/projects/cafemitra/3.png",
        title: "Express Queue Tracker",
        caption: "Live barista progress display showing brewing, steaming, and ready-for-pickup states.",
        badge: "REAL-TIME"
      },
      {
        id: "cafe-4",
        type: "image",
        src: "/projects/cafemitra/4.png",
        title: "Table-Side Quick Order",
        caption: "Repeat previous orders with a single haptic tap without having to stand up.",
        badge: "HAPTIC"
      },
      {
        id: "cafe-5",
        type: "image",
        src: "/projects/cafemitra/5.png",
        title: "Roaster Origin Stories",
        caption: "Farm origin profiles, elevation data, and cupping notes for rotating single-origin beans.",
        badge: "EDITORIAL"
      },
      {
        id: "cafe-6",
        type: "image",
        src: "/projects/cafemitra/6.png",
        title: "Split Bill & Tip Hub",
        caption: "Instant bill splitting among table guests with localized micro-payment options.",
        badge: "FINTECH"
      },
      {
        id: "cafe-7",
        type: "image",
        src: "/projects/cafemitra/7.png",
        title: "Morning Habit Scheduler",
        caption: "Automated recurring weekday order timed to match the user's morning commuter train.",
        badge: "AUTOMATION"
      }
    ]
  },
  {
    id: "03",
    internalId: "boostai",
    title: "BOOST AI",
    subtitle: "Enterprise Workflow Intelligence",
    category: "AI AUTOMATION · WORKFLOW ENGINEERING",
    tagline: "AI that works\nalongside you.",
    description: "Boost AI is an enterprise desktop intelligence platform that orchestrates multi-agent task execution, code generation, and automated validation across business pipelines.",
    meta: "AI AUTOMATION · PRODUCT DEVELOPMENT · 2026",
    coverImage: "/projects/boostai/boostai.webp",
    device: "macbook",
    orientation: "landscape",
    galleryLayout: "vertical",
    galleryImages: [
      "/projects/boostai/boostai.webp",
      "/projects/boostai/boostai.mp4"
    ],
    mediaItems: [
      {
        id: "boost-1",
        type: "video",
        src: "/projects/boostai/boostai.mp4",
        poster: "/projects/boostai/boostai.webp",
        title: "Autonomous Agent Execution Loop",
        caption: "Real-time demonstration of multi-agent reasoning, self-correction, and tool invocation.",
        badge: "LIVE DEMO"
      },
      {
        id: "boost-2",
        type: "image",
        src: "/projects/boostai/boostai.webp",
        title: "Enterprise Command Console",
        caption: "High-density monitoring dashboard displaying live agent clusters and pipeline latency.",
        badge: "DASHBOARD"
      },
      {
        id: "boost-3",
        type: "video",
        src: "/projects/boostai/boostai.mp4",
        poster: "/projects/boostai/boostai.webp",
        title: "Pipeline Routing & Self-Healing",
        caption: "Dynamic task DAG execution with automatic fallback paths on model rate limits.",
        badge: "PIPELINE"
      },
      {
        id: "boost-4",
        type: "image",
        src: "/projects/boostai/boostai.webp",
        title: "Prompt & Benchmark Matrix",
        caption: "Side-by-side prompt tuning and latency benchmarking across frontier foundation models.",
        badge: "EVALUATION"
      },
      {
        id: "boost-5",
        type: "video",
        src: "/projects/boostai/boostai.mp4",
        poster: "/projects/boostai/boostai.webp",
        title: "Token Inspector & Reasoning Tree",
        caption: "Deep inspection view breaking down prompt tokens, reasoning chains, and JSON outputs.",
        badge: "INSPECTOR"
      },
      {
        id: "boost-6",
        type: "image",
        src: "/projects/boostai/boostai.webp",
        title: "Multi-Agent Topology Map",
        caption: "Hierarchical agent role allocation across research, coding, and quality assurance.",
        badge: "TOPOLOGY"
      },
      {
        id: "boost-7",
        type: "video",
        src: "/projects/boostai/boostai.mp4",
        poster: "/projects/boostai/boostai.webp",
        title: "Automated Code Synthesis Pipeline",
        caption: "Continuous validation loop synthesizing production code directly from user prompts.",
        badge: "SYNTHESIS"
      }
    ]
  },
  {
    id: "04",
    internalId: "cafemitra-erp",
    title: "CAFEMITRA ERP",
    subtitle: "Commercial Cafe Operating System",
    category: "CLOUD PLATFORM · RESTAURANT ERP",
    tagline: "Modern operational control\nfor scaling cafes.",
    description: "A high-performance cloud ERP built specifically for multi-location coffee roasteries and cafes, handling real-time inventory, kitchen display systems, and supplier automation.",
    meta: "CLOUD PLATFORM · ERP · 2026",
    coverImage: "/projects/cafemitra/cafe-erp.png",
    device: "macbook",
    orientation: "landscape",
    galleryLayout: "vertical",
    galleryImages: [
      "/projects/cafemitra/cafe-erp.png",
      "/projects/cafemitra/2.png",
      "/projects/cafemitra/3.png",
      "/projects/cafemitra/4.png",
      "/projects/cafemitra/5.png",
      "/projects/cafemitra/6.png",
      "/projects/cafemitra/7.png"
    ],
    mediaItems: [
      {
        id: "erp-1",
        type: "image",
        src: "/projects/cafemitra/cafe-erp.png",
        title: "Central POS & Management Dashboard",
        caption: "Multi-outlet console with real-time revenue velocity, open tickets, and table turnover.",
        badge: "OPERATIONS"
      },
      {
        id: "erp-2",
        type: "image",
        src: "/projects/cafemitra/2.png",
        title: "Batch Inventory & Bean Aging Track",
        caption: "Automated batch tracking from green bean delivery to roast peak date and waste logs.",
        badge: "INVENTORY"
      },
      {
        id: "erp-3",
        type: "image",
        src: "/projects/cafemitra/3.png",
        title: "Kitchen Display Matrix (KDS)",
        caption: "Color-coded ticket pacing with allergen highlights, milk switches, and bar station routing.",
        badge: "KITCHEN"
      },
      {
        id: "erp-4",
        type: "image",
        src: "/projects/cafemitra/4.png",
        title: "Dynamic Floor & Table Map",
        caption: "Interactive restaurant floor plan with live status: seated, waiting, served, and closing.",
        badge: "FLOOR PLAN"
      },
      {
        id: "erp-5",
        type: "image",
        src: "/projects/cafemitra/5.png",
        title: "Supplier Purchase Order Automation",
        caption: "Predictive replenishment trigger when dairy and single-origin beans hit safety thresholds.",
        badge: "SUPPLY CHAIN"
      },
      {
        id: "erp-6",
        type: "image",
        src: "/projects/cafemitra/6.png",
        title: "Staff Shift & Tip Allocation",
        caption: "Automated labor cost compliance, shift rostering, and transparent digital tip pooling.",
        badge: "STAFF"
      },
      {
        id: "erp-7",
        type: "image",
        src: "/projects/cafemitra/7.png",
        title: "Multi-Outlet Financial Audits",
        caption: "Automated end-of-day reconciliation across POS terminals, cash drawers, and delivery channels.",
        badge: "FINANCE"
      }
    ]
  }
];
