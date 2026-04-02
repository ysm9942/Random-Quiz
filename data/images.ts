import { SourceImage } from "@/types";

export const sourceImages: SourceImage[] = [
  {
    id: "img-001",
    person: "농루트",
    name: "농루트 1",
    originalUrl: "/samples/nong1 (1).jpg",
    thumbnailUrl: "/samples/nong1 (1).jpg",
  },
  {
    id: "img-002",
    person: "농루트",
    name: "농루트 2",
    originalUrl: "/samples/nong1 (2).jpg",
    thumbnailUrl: "/samples/nong1 (2).jpg",
  },
  {
    id: "img-003",
    person: "농루트",
    name: "농루트 3",
    originalUrl: "/samples/nong1 (3).jpg",
    thumbnailUrl: "/samples/nong1 (3).jpg",
  },
  {
    id: "img-004",
    person: "농루트",
    name: "농루트 4",
    originalUrl: "/samples/nong1 (4).jpg",
    thumbnailUrl: "/samples/nong1 (4).jpg",
  },
  {
    id: "img-005",
    person: "농루트",
    name: "농루트 5",
    originalUrl: "/samples/nong1 (5).jpg",
    thumbnailUrl: "/samples/nong1 (5).jpg",
  },
  {
    id: "img-006",
    person: "농루트",
    name: "농루트 6",
    originalUrl: "/samples/nong1 (6).jpg",
    thumbnailUrl: "/samples/nong1 (6).jpg",
  },
  {
    id: "img-007",
    person: "농루트",
    name: "농루트 7",
    originalUrl: "/samples/nong1 (7).jpg",
    thumbnailUrl: "/samples/nong1 (7).jpg",
  },
  {
    id: "img-008",
    person: "농루트",
    name: "농루트 8",
    originalUrl: "/samples/nong1 (8).jpg",
    thumbnailUrl: "/samples/nong1 (8).jpg",
  },
  {
    id: "img-009",
    person: "농루트",
    name: "농루트 9",
    originalUrl: "/samples/nong1 (9).jpg",
    thumbnailUrl: "/samples/nong1 (9).jpg",
  },
  {
    id: "img-010",
    person: "농루트",
    name: "농루트 10",
    originalUrl: "/samples/nong1 (10).jpg",
    thumbnailUrl: "/samples/nong1 (10).jpg",
  },
  {
    id: "img-011",
    person: "농루트",
    name: "농루트 11",
    originalUrl: "/samples/nong1 (11).jpg",
    thumbnailUrl: "/samples/nong1 (11).jpg",
  },
  {
    id: "img-012",
    person: "농루트",
    name: "농루트 12",
    originalUrl: "/samples/nong1 (12).jpg",
    thumbnailUrl: "/samples/nong1 (12).jpg",
  },
  {
    id: "img-013",
    person: "농루트",
    name: "농루트 13",
    originalUrl: "/samples/nong1 (13).jpg",
    thumbnailUrl: "/samples/nong1 (13).jpg",
  },
  {
    id: "img-014",
    person: "농루트",
    name: "농루트 14",
    originalUrl: "/samples/nong1 (14).jpg",
    thumbnailUrl: "/samples/nong1 (14).jpg",
  },
  {
    id: "img-015",
    person: "쫀득",
    name: "쫀득 1",
    originalUrl: "/samples/Zzon (1).jpg",
    thumbnailUrl: "/samples/Zzon (1).jpg",
  },
  {
    id: "img-016",
    person: "쫀득",
    name: "쫀득 2",
    originalUrl: "/samples/Zzon (2).jpg",
    thumbnailUrl: "/samples/Zzon (2).jpg",
  },
  {
    id: "img-017",
    person: "쫀득",
    name: "쫀득 3",
    originalUrl: "/samples/Zzon (3).jpg",
    thumbnailUrl: "/samples/Zzon (3).jpg",
  },
  {
    id: "img-018",
    person: "쫀득",
    name: "쫀득 4",
    originalUrl: "/samples/Zzon (4).jpg",
    thumbnailUrl: "/samples/Zzon (4).jpg",
  },
  {
    id: "img-019",
    person: "쫀득",
    name: "쫀득 5",
    originalUrl: "/samples/Zzon (5).jpg",
    thumbnailUrl: "/samples/Zzon (5).jpg",
  },
  {
    id: "img-020",
    person: "쫀득",
    name: "쫀득 6",
    originalUrl: "/samples/Zzon (6).jpg",
    thumbnailUrl: "/samples/Zzon (6).jpg",
  },
  {
    id: "img-021",
    person: "쫀득",
    name: "쫀득 7",
    originalUrl: "/samples/Zzon (7).jpg",
    thumbnailUrl: "/samples/Zzon (7).jpg",
  },
  {
    id: "img-022",
    person: "쫀득",
    name: "쫀득 8",
    originalUrl: "/samples/Zzon (8).jpg",
    thumbnailUrl: "/samples/Zzon (8).jpg",
  },
  {
    id: "img-023",
    person: "쫀득",
    name: "쫀득 9",
    originalUrl: "/samples/Zzon (9).jpg",
    thumbnailUrl: "/samples/Zzon (9).jpg",
  },
  {
    id: "img-024",
    person: "쫀득",
    name: "쫀득 10",
    originalUrl: "/samples/Zzon (10).jpg",
    thumbnailUrl: "/samples/Zzon (10).jpg",
  },
];

export function getImageById(id: string): SourceImage | undefined {
  return sourceImages.find((img) => img.id === id);
}

export function getImagesByPerson(person: string): SourceImage[] {
  if (person === "all") return sourceImages;
  return sourceImages.filter((img) => img.person === person);
}
