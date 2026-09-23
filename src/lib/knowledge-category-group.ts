/**
 * Category-directory grouping for the knowledge tree sidebar.
 *
 * The wiki content root (`<project>/wiki/`) is organized into top-level
 * category directories — e.g. `01-文献`, `02-正式版会议纪要`, … — while
 * pages that live directly at the content root (overview.md etc.) belong
 * to a synthetic root category. The knowledge tree renders one collapsible
 * section per category and keeps the existing per-type grouping inside
 * each category, so a library with ~1k literature pages stays navigable.
 */

export const ROOT_CATEGORY_KEY = "__root__"

const NUMERIC_PREFIX_RE = /^(\d+)-/

export interface CategoryInfo {
  /** Stable grouping key: first path segment, or ROOT_CATEGORY_KEY. */
  key: string
  /** Human label: folder name with a leading `NN-` order prefix stripped. */
  label: string
  /** Numeric ordering prefix when the folder starts with `NN-`. */
  order: number | null
}

/**
 * Derive the category of a wiki page from its path relative to the wiki
 * content root. `wikiRoot` is the normalized absolute path of `<project>/wiki`
 * (no trailing separator). Falls back to ROOT_CATEGORY_KEY for root-level
 * pages and for paths outside the content root.
 */
export function wikiCategoryOf(pagePath: string, wikiRoot: string): CategoryInfo {
  const normPath = pagePath.replace(/\\/g, "/")
  const normRoot = wikiRoot.replace(/\\/g, "/").replace(/\/+$/, "")
  const rel = normPath.startsWith(`${normRoot}/`)
    ? normPath.slice(normRoot.length + 1)
    : normPath
  const firstSegment = rel.split("/")[0] ?? ""
  if (!firstSegment || firstSegment.includes(".md")) {
    return { key: ROOT_CATEGORY_KEY, label: "", order: null }
  }
  return categoryFromKey(firstSegment)
}

/** Build CategoryInfo from a raw top-level folder name. */
export function categoryFromKey(key: string): CategoryInfo {
  const m = key.match(NUMERIC_PREFIX_RE)
  if (m) {
    return { key, label: key.slice(m[0].length), order: parseInt(m[1], 10) }
  }
  return { key, label: key, order: null }
}

export interface CategoryGroup<T> {
  category: CategoryInfo
  items: T[]
}

/**
 * Group items by category, ordering: root category first, then numeric
 * prefixes ascending, then alphabetical by key. Stable and pure so the
 * sidebar and tests share one source of truth.
 */
export function groupByCategory<T>(
  items: T[],
  categoryOf: (item: T) => CategoryInfo,
): Array<CategoryGroup<T>> {
  const map = new Map<string, CategoryGroup<T>>()
  for (const item of items) {
    const category = categoryOf(item)
    const group = map.get(category.key)
    if (group) {
      group.items.push(item)
    } else {
      map.set(category.key, { category, items: [item] })
    }
  }
  return [...map.values()].sort((a, b) => {
    if (a.category.key === ROOT_CATEGORY_KEY) return -1
    if (b.category.key === ROOT_CATEGORY_KEY) return 1
    const oa = a.category.order
    const ob = b.category.order
    if (oa !== null && ob !== null && oa !== ob) return oa - ob
    if (oa !== null && ob === null) return -1
    if (oa === null && ob !== null) return 1
    return a.category.key.localeCompare(b.category.key)
  })
}
