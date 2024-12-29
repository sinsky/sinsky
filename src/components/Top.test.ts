import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Top from "./Top.vue";

describe("Top.vue", () => {
  it("renders the avatar correctly", () => {
    const wrapper = mount(Top, { props: { bgColor: "bg-gray-900" } });
    expect(wrapper.find('img[alt="@sinsky"]').exists()).toBe(true);
    expect(wrapper.find('img[alt="@sinsky"]').attributes("src")).toBe(
      "https://github.com/sinsky.png",
    );
    expect(wrapper.text()).toContain("SS"); // Checks for fallback initials
  });

  it("renders the username correctly", () => {
    const wrapper = mount(Top, { props: { bgColor: "bg-gray-900" } });
    expect(wrapper.text()).toContain("sinsky");
  });

  it("renders the social media links correctly", async () => {
    const wrapper = mount(Top, { props: { bgColor: "bg-gray-900" } });

    // GitHub link
    const githubLink = wrapper.find('a[href="https://github.com/sinsky"]');
    expect(githubLink.exists()).toBe(true);
    expect(githubLink.find("svg").exists()).toBe(true);

    // Twitter link
    const twitterLink = wrapper.find('a[href="https://x.com/sin_sky_"]');
    expect(twitterLink.exists()).toBe(true);
    expect(twitterLink.find("svg").exists()).toBe(true);
  });

  it("applies the background color prop correctly", () => {
    const bgColor = "bg-red-500";
    const wrapper = mount(Top, { props: { bgColor } });
    expect(wrapper.classes()).toContain(bgColor);
  });
  it("has shadow color", () => {
    const wrapper = mount(Top, { props: { bgColor: "bg-gray-900" } });
    const ul = wrapper.find("ul");
    expect(ul.attributes("style")).toContain("--shadow-color");
  });

  it("has correct class with transition-all", () => {
    const wrapper = mount(Top, { props: { bgColor: "bg-gray-900" } });
    const githubLink = wrapper.find('a[href="https://github.com/sinsky"]');
    const twitterLink = wrapper.find('a[href="https://x.com/sin_sky_"]');
    expect(githubLink.find("svg").classes()).toContain("transition-all");
    expect(twitterLink.find("svg").classes()).toContain("transition-all");
  });
  it("has correct class with will-change-auto", () => {
    const wrapper = mount(Top, { props: { bgColor: "bg-gray-900" } });
    const githubLink = wrapper.find('a[href="https://github.com/sinsky"]');
    const twitterLink = wrapper.find('a[href="https://x.com/sin_sky_"]');
    expect(githubLink.find("svg").classes()).toContain("will-change-auto");
    expect(twitterLink.find("svg").classes()).toContain("will-change-auto");
  });
  it("has correct class with size-8", () => {
    const wrapper = mount(Top, { props: { bgColor: "bg-gray-900" } });
    const githubLink = wrapper.find('a[href="https://github.com/sinsky"]');
    const twitterLink = wrapper.find('a[href="https://x.com/sin_sky_"]');
    expect(githubLink.find("svg").classes()).toContain("size-8");
    expect(twitterLink.find("svg").classes()).toContain("size-8");
  });
});
