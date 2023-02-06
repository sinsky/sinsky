import Title from "@/ui/title";
import Notification from "@/components/notification";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createContactSchema, CreateContactSchema } from "@/schema/contact";
import Layout from "../app/(home)/layout";
import { api } from "@/utils/api";
import { useState } from "react";

export default function Page({ }) {
  const [show, setShow] = useState<boolean>(false);
  const [notificationData, setNotificationData] = useState<{
    status: "success" | "error";
    text: string;
  }>({
    status: "success",
    text: "確認後返信いたします",
  });
  const setSuccessNotificationData = () =>
    setNotificationData({
      status: "success",
      text: "確認後返信いたします。",
    });
  const setErrorNotificationData = () =>
    setNotificationData({
      status: "error",
      text: "お手数をおかけしますが時間をあけて再度実行するか、Twitter等でご連絡ください。",
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateContactSchema>({
    resolver: zodResolver(createContactSchema),
  });
  const createContact = api.contact.create.useMutation({
    onSuccess() {
      reset();
      setSuccessNotificationData();
      setShow(true);
    },
    onError(error) {
      console.error(error);
      setErrorNotificationData();
      setShow(true);
    },
  });

  return (
    <Layout>
      <Title title={"Contact"} />
      <div className="my-4">
        <p>下記フォームに問い合わせ内容を入力して送信してください。</p>
        <p>確認後、返答させていただきます。</p>
      </div>
      <form
        className="relative"
        onSubmit={handleSubmit((data) => createContact.mutate({ ...data }))}
      >
        <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500">
          <label htmlFor="replyEmail" className="sr-only">
            返信先
          </label>
          <input
            type="email"
            id="replyEmail"
            className="block w-full border-0 border-b border-gray-300 pt-2.5 text-xl font-medium placeholder-gray-500 focus:ring-0"
            placeholder="返信先"
            {...register("replyEmail")}
          />
          {errors.replyEmail?.message && (
            <p className="text-md bg-red-300 px-2.5 py-2 font-bold text-red-700">
              {errors.replyEmail.message.toString()}
            </p>
          )}
          <label htmlFor="subject" className="sr-only">
            件名
          </label>
          <input
            type="text"
            id="subject"
            className="block w-full border-0 border-b border-gray-300 pt-2.5 text-xl font-medium placeholder-gray-500 focus:ring-0"
            placeholder="件名"
            {...register("subject")}
          />
          {errors.subject?.message && (
            <p className="text-md bg-red-300 px-2.5 py-2 font-bold text-red-700">
              {errors.subject.message.toString()}
            </p>
          )}
          <label htmlFor="body" className="sr-only">
            本文
          </label>
          <textarea
            rows={10}
            id="body"
            className="block w-full resize-y border-0 py-2 text-lg placeholder-gray-500 focus:ring-0"
            placeholder="問い合わせ内容を記載してください"
            {...register("body")}
          />
          {errors.body?.message && (
            <p className="text-md bg-red-300 px-2.5 py-2 font-bold text-red-700">
              {errors.body.message.toString()}
            </p>
          )}
          {/* Spacer element to match the height of the toolbar */}
          <div aria-hidden="true">
            <div className="py-2">
              <div className="h-9" />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-px bottom-0">
          <div className="flex items-center justify-end space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3">
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                送信
              </button>
            </div>
          </div>
        </div>
      </form>
      <Notification
        show={show}
        setShow={setShow}
        status={notificationData.status}
        text={notificationData.text}
      />
    </Layout>
  );
}
