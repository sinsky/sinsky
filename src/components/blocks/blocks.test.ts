import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SkillChip from "@/components/blocks/SkillChip.vue";
import PrCard from "@/components/blocks/PrCard.vue";

describe("SkillChip.vue", () => {
  it("renders the title", () => {
    const wrapper = mount(SkillChip, {
      props: { title: "TypeScript" },
      slots: { default: "<svg data-testid='icon'></svg>" },
    });
    expect(wrapper.text()).toContain("TypeScript");
  });

  it("renders the slotted icon", () => {
    const wrapper = mount(SkillChip, {
      props: { title: "Rust" },
      slots: { default: "<svg data-testid='icon'></svg>" },
    });
    expect(wrapper.find("[data-testid='icon']").exists()).toBe(true);
  });

  it("applies chip styling", () => {
    const wrapper = mount(SkillChip, {
      props: { title: "x" },
      slots: { default: "<svg></svg>" },
    });
    expect(wrapper.classes()).toContain("inline-flex");
    expect(wrapper.classes()).toContain("rounded-full");
  });
});

describe("PrCard.vue", () => {
  it("renders title and comment", () => {
    const wrapper = mount(PrCard, {
      props: {
        title: "feat: add foo",
        url: "https://github.com/sinsky/x/pull/1",
        comment: "this PR adds foo",
      },
    });
    expect(wrapper.text()).toContain("feat: add foo");
    expect(wrapper.text()).toContain("this PR adds foo");
  });

  it("links to the provided url with safe attributes", () => {
    const wrapper = mount(PrCard, {
      props: {
        title: "x",
        url: "https://github.com/sinsky/x/pull/2",
        comment: "y",
      },
    });
    const a = wrapper.find("a");
    expect(a.attributes("href")).toBe("https://github.com/sinsky/x/pull/2");
    expect(a.attributes("target")).toBe("_blank");
    expect(a.attributes("rel")).toBe("noopener noreferrer");
  });

  it("uses the shared bubble-shape class", () => {
    const wrapper = mount(PrCard, {
      props: { title: "x", url: "https://x", comment: "y" },
    });
    expect(wrapper.classes()).toContain("bubble-shape");
  });
});
