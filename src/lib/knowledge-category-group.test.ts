import { describe, expect, it } from "vitest"
import {
  ROOT_CATEGORY_KEY,
  categoryFromKey,
  groupByCategory,
  wikiCategoryOf,
} from "./knowledge-category-group"

const WIKI_ROOT = "/Users/joe/msre wiki/wiki"

describe("wikiCategoryOf", () => {
  it("maps nested pages to their top-level category folder", () => {
    const info = wikiCategoryOf(
      `${WIKI_ROOT}/01-文献/entities/bison.md`,
      WIKI_ROOT,
    )
    expect(info.key).toBe("01-文献")
    expect(info.label).toBe("文献")
    expect(info.order).toBe(1)
  })

  it("strips only a leading numeric order prefix", () => {
    const info = wikiCategoryOf(
      `${WIKI_ROOT}/06-其他工程资料/spec.md`,
      WIKI_ROOT,
    )
    expect(info.key).toBe("06-其他工程资料")
    expect(info.label).toBe("其他工程资料")
    expect(info.order).toBe(6)
  })

  it("keeps folders without a numeric prefix as-is", () => {
    const info = wikiCategoryOf(`${WIKI_ROOT}/misc/notes.md`, WIKI_ROOT)
    expect(info.key).toBe("misc")
    expect(info.label).toBe("misc")
    expect(info.order).toBeNull()
  })

  it("maps root-level pages to the synthetic root category", () => {
    const info = wikiCategoryOf(`${WIKI_ROOT}/overview.md`, WIKI_ROOT)
    expect(info.key).toBe(ROOT_CATEGORY_KEY)
  })

  it("normalizes backslash separators (Windows paths)", () => {
    const info = wikiCategoryOf(
      "C:\\projects\\demo\\wiki\\02-会议纪要\\m1.md",
      "C:\\projects\\demo\\wiki",
    )
    expect(info.key).toBe("02-会议纪要")
    expect(info.label).toBe("会议纪要")
  })

  it("does not confuse a category folder containing a dot", () => {
    const info = wikiCategoryOf(`${WIKI_ROOT}/v1.2-notes/page.md`, WIKI_ROOT)
    expect(info.key).toBe("v1.2-notes")
  })
})

describe("categoryFromKey", () => {
  it("parses multi-digit prefixes", () => {
    expect(categoryFromKey("10-第十类")).toEqual({
      key: "10-第十类",
      label: "第十类",
      order: 10,
    })
  })

  it("treats prefixes without a dash as plain names", () => {
    expect(categoryFromKey("2026papers")).toEqual({
      key: "2026papers",
      label: "2026papers",
      order: null,
    })
  })
})

describe("groupByCategory", () => {
  const paths = [
    `${WIKI_ROOT}/overview.md`,
    `${WIKI_ROOT}/01-文献/sources/src-a.md`,
    `${WIKI_ROOT}/01-文献/concepts/c.md`,
    `${WIKI_ROOT}/02-会议纪要/m.md`,
    `${WIKI_ROOT}/06-其他工程资料/x.md`,
    `${WIKI_ROOT}/notes/misc.md`,
  ]

  it("groups by category with root first, then numeric order, then alpha", () => {
    const groups = groupByCategory(paths, (p) => wikiCategoryOf(p, WIKI_ROOT))
    expect(groups.map((g) => g.category.key)).toEqual([
      ROOT_CATEGORY_KEY,
      "01-文献",
      "02-会议纪要",
      "06-其他工程资料",
      "notes",
    ])
  })

  it("collects every item exactly once", () => {
    const groups = groupByCategory(paths, (p) => wikiCategoryOf(p, WIKI_ROOT))
    expect(groups.reduce((n, g) => n + g.items.length, 0)).toBe(paths.length)
    const literature = groups.find((g) => g.category.key === "01-文献")!
    expect(literature.items).toHaveLength(2)
  })

  it("returns an empty array for no items", () => {
    expect(groupByCategory([], (p: string) => wikiCategoryOf(p, WIKI_ROOT))).toEqual([])
  })
})
