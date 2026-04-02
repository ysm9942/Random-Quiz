import { SourceImage } from "@/types";

export const sourceImages: SourceImage[] = [
  {
    id: "img-001",
    person: "쫀득",
    name: "쫀득 정면 1",
    originalUrl: "/samples/jjondeuk-01.svg",
    thumbnailUrl: "/samples/jjondeuk-01.svg",
    tags: ["정면", "미소"],
  },
  {
    id: "img-002",
    person: "쫀득",
    name: "쫀득 측면 1",
    originalUrl: "/samples/jjondeuk-02.svg",
    thumbnailUrl: "/samples/jjondeuk-02.svg",
    tags: ["측면"],
  },
  {
    id: "img-003",
    person: "쫀득",
    name: "쫀득 정면 2",
    originalUrl: "/samples/jjondeuk-03.svg",
    thumbnailUrl: "/samples/jjondeuk-03.svg",
    tags: ["정면"],
  },
  {
    id: "img-004",
    person: "농루트",
    name: "농루트 정면 1",
    originalUrl: "/samples/nongrut-01.svg",
    thumbnailUrl: "/samples/nongrut-01.svg",
    tags: ["정면", "미소"],
  },
  {
    id: "img-005",
    person: "농루트",
    name: "농루트 측면 1",
    originalUrl: "/samples/nongrut-02.svg",
    thumbnailUrl: "/samples/nongrut-02.svg",
    tags: ["측면"],
  },
  {
    id: "img-006",
    person: "농루트",
    name: "농루트 정면 2",
    originalUrl: "/samples/nongrut-03.svg",
    thumbnailUrl: "/samples/nongrut-03.svg",
    tags: ["정면"],
  },
];

export function getImageById(id: string): SourceImage | undefined {
  return sourceImages.find((img) => img.id === id);
}

export function getImagesByPerson(person: string): SourceImage[] {
  if (person === "all") return sourceImages;
  return sourceImages.filter((img) => img.person === person);
}
