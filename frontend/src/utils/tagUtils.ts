// For internal use: accepts only string arrays, deduplicates and sorts.
export const normalizeTags = (tags: string[] | undefined): string[] => {
  return [...new Set((tags ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean))].sort();
};

// For import parsing: accepts unknown (array or comma-separated string), no sort.
export const parseTagsInput = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((tag): tag is string => typeof tag === 'string')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  }

  return [];
};
