import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { Switch, TextInput, Button, Textarea, Group } from "@mantine/core";

const contactFormData: { [key: string]: any } = {
  name: "entry.1117731376",
  email: "entry.492585574",
  subject: "entry.1206287081",
  body: "entry.1710164078",
  autoReply: "entry.1293719472",
  link: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSd5ml1G5F_cQ_gJP-ZXdbHs3Ia-HBzbbRZNK7BhhxNZKL-c1w/formResponse",
};
const scheme = z.object({
  name: z.string().min(2, { message: "2文字以上入力してください" }),
  email: z
    .string()
    .email({ message: "正しい形式のメールアドレスを入力してください" }),
  subject: z.string().min(1, { message: "必須項目です" }),
  body: z.string().min(1, { message: "必須項目です" }),
  autoReply: z.boolean(),
});

type FormProps = {
  name: string;
  email: string;
  subject: string;
  body: string;
  autoReply: boolean;
};

export const ContactForm = () => {
  const form = useForm({
    schema: zodResolver(scheme),
    initialValues: {
      name: "",
      email: "",
      subject: "",
      body: "",
      autoReply: false,
    },
  });
  const sendEvent = (values: { [key: string]: any }) => {
    console.log(values);
    const formItem = new FormData();
    Object.keys(values).map((key) => {
      if (key === "autoReply") {
        formItem.append(contactFormData[key], values[key] ? "あり" : "なし");
      } else {
        formItem.append(contactFormData[key], values[key]);
      }
    });
    const options = {
      method: "POST",
      body: formItem,
    };
    fetch(contactFormData["link"], options)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  return (
    <div className="w-[300px] md:w-[500px]">
      <form onSubmit={form.onSubmit((values) => sendEvent(values))}>
        <TextInput
          required
          label="名前"
          placeholder="Your name"
          className="my-4"
          radius={"md"}
          {...form.getInputProps("name")}
        />
        <TextInput
          required
          label="メールアドレス"
          placeholder="example@example.com"
          className="my-4"
          radius={"md"}
          {...form.getInputProps("email")}
        />
        <TextInput
          required
          label="件名"
          placeholder="件名"
          className="my-4"
          radius={"md"}
          {...form.getInputProps("subject")}
        />
        <Textarea
          required
          label="内容"
          placeholder="内容"
          className="my-4"
          radius={"md"}
          {...form.getInputProps("body")}
          minRows={4}
        />
        <div className="flex justify-center my-4">
          <Switch label="自動返信" {...form.getInputProps("autoReply")} />
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            variant={"filled"}
            color="green"
            className="bg-lime-700 hover:bg-lime-600"
          >
            送信
          </Button>
        </div>
      </form>
    </div>
  );
};
