import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import Contact from "./Contact.vue";

const valid = {
  name: "テスト太郎",
  email: "test@example.com",
  message: "これはコンポーネントテストからの送信確認メッセージです。",
};

function mountContact() {
  return mount(Contact, {
    props: { bgColor: "bg-violet-100" },
    global: { stubs: { teleport: true } },
  });
}

async function fillValid(wrapper: ReturnType<typeof mountContact>) {
  await wrapper.find('input[name="name"]').setValue(valid.name);
  await wrapper.find('input[name="email"]').setValue(valid.email);
  await wrapper.find('textarea[name="message"]').setValue(valid.message);
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Contact.vue", () => {
  it("shows Japanese inline errors on empty submit without calling the API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const wrapper = mountContact();

    await wrapper.find("form").trigger("submit");
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("お名前を入力してください");
      expect(wrapper.text()).toContain(
        "有効なメールアドレスを入力してください",
      );
      expect(wrapper.text()).toContain("内容は最低10文字以上入力してください");
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts a valid submission to /api/contact and shows the success modal", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const wrapper = mountContact();

    await fillValid(wrapper);
    await wrapper.find("form").trigger("submit");
    await vi.waitFor(() => {
      expect(wrapper.find('[role="dialog"]').text()).toContain("送信完了");
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/contact");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body as string) as Record<string, string>;
    expect(body.name).toBe(valid.name);
    expect(body.email).toBe(valid.email);
    expect(body.message).toBe(valid.message);
    expect(body["bot-field"]).toBe("");
    expect(
      (wrapper.find('input[name="name"]').element as HTMLInputElement).value,
    ).toBe("");
  });

  it("shows the error modal when the API rejects the submission", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("{}", { status: 502 }));
    vi.stubGlobal("fetch", fetchMock);
    const wrapper = mountContact();

    await fillValid(wrapper);
    await wrapper.find("form").trigger("submit");
    await vi.waitFor(() => {
      expect(wrapper.find('[role="dialog"]').text()).toContain("送信エラー");
    });
  });

  it("validates a single field on blur without calling the API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const wrapper = mountContact();

    await wrapper.find('input[name="email"]').setValue("not-an-email");
    await wrapper.find('input[name="email"]').trigger("blur");
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain(
        "有効なメールアドレスを入力してください",
      );
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("clears a field error as soon as the user edits the field", async () => {
    const wrapper = mountContact();

    await wrapper.find("form").trigger("submit");
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain(
        "有効なメールアドレスを入力してください",
      );
    });

    await wrapper.find('input[name="email"]').setValue("fixed@example.com");
    await vi.waitFor(() => {
      expect(wrapper.text()).not.toContain(
        "有効なメールアドレスを入力してください",
      );
    });
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });
});
