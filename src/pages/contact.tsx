import Title from "@/ui/title";
import Layout from "../app/(home)/layout";

export default function Page({ }) {
  return (
    <Layout>
      <Title title={"Contact"} />
      <div className="my-4">
        <p>下記フォームに問い合わせ内容を入力して送信してください。</p>
        <p>確認後、返答させていただきます。</p>
      </div>
      <form action="#" className="relative">
        <div className="overflow-hidden border border-gray-300 rounded-lg shadow-sm focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500">
          <label htmlFor="reply" className="sr-only">
            返信先
          </label>
          <input
            type="email"
            name="replyEmail"
            id="reply"
            className="block w-full border-0 pt-2.5 text-xl font-medium placeholder-gray-500 focus:ring-0 border-b border-gray-300"
            placeholder="返信先"
          />
          <label htmlFor="subject" className="sr-only">
            件名
          </label>
          <input
            type="text"
            name="subject"
            id="subject"
            className="block w-full border-0 pt-2.5 text-xl font-medium placeholder-gray-500 focus:ring-0 border-b border-gray-300"
            placeholder="件名"
          />
          <label htmlFor="body" className="sr-only">
            本文
          </label>
          <textarea
            rows={10}
            name="body"
            id="body"
            className="block w-full py-2 text-lg placeholder-gray-500 border-0 resize-y focus:ring-0"
            placeholder="問い合わせ内容を記載してください"
            defaultValue={''}
          />

          {/* Spacer element to match the height of the toolbar */}
          <div aria-hidden="true">
            <div className="py-2">
              <div className="h-9" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-px">
          <div className="flex items-center justify-end px-2 py-2 space-x-3 border-t border-gray-200 sm:px-3">
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-cyan-600 border border-transparent rounded-md shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                送信
              </button>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  )
}
