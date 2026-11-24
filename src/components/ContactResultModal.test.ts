import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ContactResultModal from "./ContactResultModal.vue";

const mountModal = (type: "success" | "error") =>
  mount(ContactResultModal, {
    props: { type },
    global: { stubs: { teleport: true } },
  });

describe("ContactResultModal", () => {
  it("renders the success copy", () => {
    const wrapper = mountModal("success");
    expect(wrapper.text()).toContain("送信完了");
    expect(wrapper.text()).toContain("確認後、返答いたします。");
  });

  it("renders the error copy", () => {
    const wrapper = mountModal("error");
    expect(wrapper.text()).toContain("送信エラー");
    expect(wrapper.text()).toContain("お手数ですが、再度送信してください。");
  });

  it("emits close when the close button is clicked", async () => {
    const wrapper = mountModal("success");
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("emits close on Escape from the dialog", async () => {
    const wrapper = mountModal("success");
    await wrapper.find('[role="dialog"]').trigger("keydown.escape");
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("emits close when the backdrop is clicked", async () => {
    const wrapper = mountModal("success");
    await wrapper.find("[data-modal-backdrop]").trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("does not emit close when the panel itself is clicked", async () => {
    const wrapper = mountModal("success");
    await wrapper.find('[role="dialog"]').trigger("click");
    expect(wrapper.emitted("close")).toBeUndefined();
  });
});
