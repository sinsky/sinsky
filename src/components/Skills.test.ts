import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Skills from "./Skills.vue";
import SkillCard from "./SkillCard.vue";

describe("Skills.vue", () => {
  it("renders all skill categories", () => {
    const wrapper = mount(Skills, { props: { bgColor: "bg-gray-900" } });
    expect(wrapper.text()).toContain("Programming Languages");
    expect(wrapper.text()).toContain("Frameworks & Libraries");
    expect(wrapper.text()).toContain("Platforms & Services");
    expect(wrapper.text()).toContain("SaaS");
  });

  it("renders SkillCard components with correct titles for Programming Languages", () => {
    const wrapper = mount(Skills, { props: { bgColor: "bg-gray-900" } });
    const programmingLanguagesCards = wrapper.findAllComponents(SkillCard);
    const programmingLanguagesTitles = programmingLanguagesCards
      .slice(0, 4)
      .map((card) => card.props("title"));
    expect(programmingLanguagesTitles).toEqual([
      "Javascript",
      "Typescript",
      "Python",
      "Rust",
    ]);
  });

  it("renders SkillCard components with correct titles for Frameworks & Libraries", () => {
    const wrapper = mount(Skills, { props: { bgColor: "bg-gray-900" } });
    const frameworksAndLibrariesCards = wrapper.findAllComponents(SkillCard);
    const frameworksAndLibrariesTitles = frameworksAndLibrariesCards
      .slice(4, 17)
      .map((card) => card.props("title"));
    expect(frameworksAndLibrariesTitles).toEqual([
      "Vite",
      "React",
      "Next.js",
      "Vue.js",
      "Django",
      "tRPC",
      "Prisma",
      "Drizzle",
      "Jest",
      "Playwright",
      "Tailwind CSS",
      "Mantine UI",
      "Shadcn UI",
    ]);
  });

  it("renders SkillCard components with correct titles for Platforms & Services", () => {
    const wrapper = mount(Skills, { props: { bgColor: "bg-gray-900" } });
    const platformsAndServicesCards = wrapper.findAllComponents(SkillCard);
    const platformsAndServicesTitles = platformsAndServicesCards
      .slice(17, 25)
      .map((card) => card.props("title"));
    expect(platformsAndServicesTitles).toEqual([
      "Github",
      "Github Actions",
      "Docker",
      "Google Cloud",
      "Vercel",
      "Cloudflare",
      "Netlify",
      "Supabase",
    ]);
  });

  it("renders SkillCard components with correct titles for SaaS", () => {
    const wrapper = mount(Skills, { props: { bgColor: "bg-gray-900" } });
    const saasCards = wrapper.findAllComponents(SkillCard);
    const saasTitles = saasCards
      .slice(25, 27)
      .map((card) => card.props("title"));
    expect(saasTitles).toEqual(["Power BI", "ServiceNow"]);
  });

  it("applies the background color prop correctly", () => {
    const bgColor = "bg-red-500";
    const wrapper = mount(Skills, { props: { bgColor } });
    expect(wrapper.classes()).toContain(bgColor);
  });
  it("renders icons with correct size", () => {
    const wrapper = mount(Skills, { props: { bgColor: "bg-gray-900" } });
    const svgElements = wrapper.findAll("svg");
    svgElements.forEach((svg) => {
      expect(svg.classes()).toContain("size-8");
    });
  });
});
