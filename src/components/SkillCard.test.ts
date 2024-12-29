import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SkillCard from "./SkillCard.vue"; // コンポーネントのパスを適宜変更してください

describe("SkillCard.vue", () => {
  it("renders the slot content", () => {
    const slotContent = "<div>Slot Content</div>";
    const wrapper = mount(SkillCard, {
      slots: {
        default: slotContent,
      },
      props: {
        title: "Test Title",
      },
    });
    expect(wrapper.html()).toContain(slotContent);
  });

  it("renders the title prop correctly", () => {
    const title = "Test Title";
    const wrapper = mount(SkillCard, {
      props: { title },
    });
    expect(wrapper.text()).toContain(title);
    const p = wrapper.find("p");
    expect(p.classes()).toContain("!mt-0");
  });
  it("renders the title prop correctly not have margin", () => {
    const title = "Test Title";
    const wrapper = mount(SkillCard, {
      props: { title },
    });
    const p = wrapper.find("p");
    expect(p.classes()).toContain("!mt-0");
  });

  it("renders the default style", () => {
    const wrapper = mount(SkillCard, {
      props: { title: "Test Title" },
    });
    const div = wrapper.find("div");
    expect(div.classes()).toContain("flex");
    expect(div.classes()).toContain("flex-col");
    expect(div.classes()).toContain("items-center");
    expect(div.classes()).toContain("gap-2");
  });
});
