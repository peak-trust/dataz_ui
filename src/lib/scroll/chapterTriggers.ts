export const CHAPTER_RANGES = {
  chapter1: { start: 0, end: 0.2 }, // Globe
  chapter2: { start: 0.2, end: 0.4 }, // Zoom
  chapter3: { start: 0.4, end: 0.6 }, // Hotspots
  chapter4: { start: 0.6, end: 0.8 }, // Deep Dive
  chapter5: { start: 0.8, end: 1.0 }, // Future
} as const;

export type ChapterKey = keyof typeof CHAPTER_RANGES;

export function getChapterFromProgress(progress: number): 1 | 2 | 3 | 4 | 5 {
  if (progress < CHAPTER_RANGES.chapter2.start) return 1;
  if (progress < CHAPTER_RANGES.chapter3.start) return 2;
  if (progress < CHAPTER_RANGES.chapter4.start) return 3;
  if (progress < CHAPTER_RANGES.chapter5.start) return 4;
  return 5;
}

export function normalizeProgressForChapter(
  progress: number,
  chapter: 1 | 2 | 3 | 4 | 5
): number {
  const range = CHAPTER_RANGES[`chapter${chapter}` as ChapterKey];
  const normalized = (progress - range.start) / (range.end - range.start);
  return Math.max(0, Math.min(1, normalized));
}

