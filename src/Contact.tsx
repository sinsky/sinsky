import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { RadioGroup, Radio, TextInput, Button, Textarea } from "@mantine/core";
import { showNotification } from '@mantine/notifications';

const contactFormData: { [key: string]: string } = {
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
  autoReply: z.string().regex(/(あり|なし)/, { message: "設定がおかしいようです..." })
});

export const ContactForm = () => {
  const form = useForm({
    schema: zodResolver(scheme),
    initialValues: {
      name: "",
      email: "",
      subject: "",
      body: "",
      autoReply: "なし",
    },
  });
  const sendEvent = (values: { [key: string]: string }) => {
    console.log(values);
    const formItem = new FormData();
    Object.keys(values).map((key) => formItem.append(contactFormData[key], values[key]));
    const options = {
      method: "POST",
      body: formItem,
    };
    try {
      fetch(contactFormData["link"], { ...options, mode: "no-cors" })
        .then(() => showNotification({ message: "送信しました、返答をお待ちください!!", autoClose: false }))
        .then(() => form.reset())
        .catch(() => showNotification({ message: `エラーが発生しました,継続する場合はこちらから ${contactFormData["link"]}`, autoClose: false }))
    } catch (err) {
      console.log("Error");
      console.log(err);
      showNotification({ message: `エラーが発生しました,継続する場合はこちらから ${contactFormData["link"]}`, autoClose: false })
    }
  };
  return (
    <div className="w-[300px] md:w-[500px]">
      <form onSubmit={form.onSubmit(values => sendEvent(values))} >
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
          <RadioGroup label="自動返信" required {...form.getInputProps("autoReply")}>
            <Radio value="あり" label="あり" />
            <Radio value="なし" label="なし" />
          </RadioGroup>
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
