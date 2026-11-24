import { contactSchema } from "@/lib/contactSchema";
import { describe, expect, it } from "vitest";

const valid = {
  "bot-field": "",
  name: "sinsky",
  email: "sin@example.com",
  message: "Hello, this is a contact form test.",
};

describe("contactSchema", () => {
  it("accepts a valid payload", () => {
    expect(contactSchema.parse(valid)).toEqual(valid);
  });

  it("defaults bot-field to an empty string when absent", () => {
    const { "bot-field": _ignored, ...withoutBotField } = valid;
    expect(contactSchema.parse(withoutBotField)["bot-field"]).toBe("");
  });

  it("rejects a blank name with the Japanese message", () => {
    const r = contactSchema.safeParse({ ...valid, name: "   " });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.find((i) => i.path[0] === "name")?.message).toBe(
        "お名前を入力してください",
      );
    }
  });

  it("rejects a 101-character name", () => {
    expect(
      contactSchema.safeParse({ ...valid, name: "a".repeat(101) }).success,
    ).toBe(false);
  });

  it("rejects an invalid email with the Japanese message", () => {
    const r = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.find((i) => i.path[0] === "email")?.message).toBe(
        "有効なメールアドレスを入力してください",
      );
    }
  });

  it("rejects an email longer than 254 characters", () => {
    expect(
      contactSchema.safeParse({ ...valid, email: `${"a".repeat(250)}@x.com` })
        .success,
    ).toBe(false);
  });

  it("rejects a short message with the Japanese message", () => {
    const r = contactSchema.safeParse({ ...valid, message: "short" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.find((i) => i.path[0] === "message")?.message).toBe(
        "内容は最低10文字以上入力してください",
      );
    }
  });

  it("rejects a 5001-character message", () => {
    expect(
      contactSchema.safeParse({ ...valid, message: "あ".repeat(5001) }).success,
    ).toBe(false);
  });
});
