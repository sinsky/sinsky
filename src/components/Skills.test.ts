import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Skills from "./Skills.vue";
import SkillChip from "@/components/blocks/SkillChip.vue";
import PrCard from "@/components/blocks/PrCard.vue";

describe("Skills.vue", () => {
  it("renders the section with id and bg color", () => {
    const wrapper = mount(Skills, { props: { bgColor: "bg-emerald-50" } });
    expect(wrapper.find("section#skills").exists()).toBe(true);
    expect(wrapper.classes()).toContain("bg-emerald-50");
  });

  it("renders Languages chips with expected titles", () => {
    const wrapper = mount(Skills, { props: { bgColor: "bg-emerald-50" } });
    const chips = wrapper.findAllComponents(SkillChip);
    expect(chips.length).toBeGreaterThanOrEqual(4);
    expect(chips.slice(0, 4).map((c) => c.props("title"))).toEqual([
      "TypeScript",
      "JavaScript",
      "Python",
      "Rust",
    ]);
  });

  it("renders four featured PR cards", () => {
    const wrapper = mount(Skills, { props: { bgColor: "bg-emerald-50" } });
    const cards = wrapper.findAllComponents(PrCard);
    expect(cards).toHaveLength(4);
    expect(cards.every((c) => c.props("url").startsWith("https://"))).toBe(
      true,
    );
  });

  it("renders certifications placeholders", () => {
    const wrapper = mount(Skills, { props: { bgColor: "bg-emerald-50" } });
    expect(wrapper.text()).toContain("Certifications");
  });

  it("renders an svg icon inside each SkillChip", () => {
    const wrapper = mount(Skills, { props: { bgColor: "bg-emerald-50" } });
    wrapper.findAllComponents(SkillChip).forEach((chip) => {
      const host = chip.element as HTMLElement;
      expect(host.querySelector("svg")).toBeTruthy();
    });
  });
});
