export interface ProjectData {
  id: string;
  internalId: string;
  title: string;
  tagline: string;
  meta: string;
  coverImage: string;
  device: "phone" | "macbook" | "tablet";
  galleryImages: string[];
}

export const PROJECTS: ProjectData[] = [
  {
    id: "01",
    internalId: "medio",
    title: "MEDIO",
    tagline: "Meet somewhere\nin the middle.",
    meta: "PRODUCT DESIGN · DEVELOPMENT · 2026",
    coverImage: "/projects/medio/medio.png",
    device: "phone",
    galleryImages: [
      "/projects/medio/medio.png",
      "/projects/medio/2.png",
      "/projects/medio/3.png",
      "/projects/medio/4.png",
      "/projects/medio/5.png",
      "/projects/medio/6.png",
      "/projects/medio/7.png"
    ]
  },
  {
    id: "02",
    internalId: "cafemitra",
    title: "CAFEMITRA",
    tagline: "One system.\nTwo sides of the counter.",
    meta: "PRODUCT DESIGN · FULL-STACK DEVELOPMENT · 2026",
    coverImage: "/projects/cafemitra/cafemitra-consumer-app.png",
    device: "phone",
    galleryImages: [
      "/projects/cafemitra/cafemitra-consumer-app.png",
      "/projects/cafemitra/cafe-erp.png",
      "/projects/cafemitra/2.png",
      "/projects/cafemitra/3.png",
      "/projects/cafemitra/4.png",
      "/projects/cafemitra/5.png",
      "/projects/cafemitra/6.png",
      "/projects/cafemitra/7.png"
    ]
  },
  {
    id: "03",
    internalId: "boostai",
    title: "BOOST AI",
    tagline: "AI that works\nalongside you.",
    meta: "AI AUTOMATION · PRODUCT DEVELOPMENT · 2026",
    coverImage: "/projects/boostai/boostai.webp",
    device: "macbook",
    galleryImages: [
      "/projects/boostai/boostai.webp",
      "/projects/boostai/boostai.mp4"
    ]
  }
];
