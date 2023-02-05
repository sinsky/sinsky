import { type PropsWithChildren } from "react";
import Image from "next/image";
import Title from "@/ui/title";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

import type { IconType as SiIconType } from "@icons-pack/react-simple-icons";
import { Qiita, Twitter } from "@icons-pack/react-simple-icons";
import {
  C,
  Deno,
  Javascript,
  Php,
  Python,
  Rust,
  Typescript,
  Trpc,
} from "@icons-pack/react-simple-icons";
import {
  Django,
  Flask,
  Jest,
  Nextdotjs,
  Playwright,
  ReactJs,
  Selenium,
  Vite,
} from "@icons-pack/react-simple-icons";
import {
  Amazonaws,
  Googlecloud,
  Microsoftazure,
} from "@icons-pack/react-simple-icons";
import {
  Circleci,
  Jenkins,
  Githubactions,
} from "@icons-pack/react-simple-icons";
import {
  Cloudflarepages,
  Githubpages,
  Netlify,
  Vercel,
} from "@icons-pack/react-simple-icons";
import {
  Docker,
  Git,
  Gitea,
  Github,
  Visualstudiocode,
} from "@icons-pack/react-simple-icons";

const Account = ({
  Icon,
  label,
  link,
}: {
  Icon: SiIconType;
  label: string;
  link: string;
}) => (
  <a
    href={link}
    target="_blank"
    aria-label={`${label}の外部リンク`}
    role={"link"}
    rel={"noreferrer"}
  >
    <div className="relative flex flex-col items-center justify-center w-24 pt-2 rounded-md shadow-md bg-slate-300 hover:bg-blue-300 dark:bg-slate-600 dark:shadow-sm dark:shadow-slate-300 dark:hover:bg-blue-600">
      <Icon size={42} color="default" className={"dark:drop-shadow-fuchsia"} />
      <span className="text-center whitespace-normal select-text">{label}</span>
      <ArrowTopRightOnSquareIcon className="absolute top-0 right-0 mt-0.5 mr-0.5 h-4 w-4" />
    </div>
  </a>
);

const Skill = ({ Icon, label }: { Icon: SiIconType; label: string }) => (
  <div className="flex flex-col items-center justify-center w-24 pt-2 rounded-md shadow-md bg-slate-300 dark:bg-slate-600 dark:shadow-sm dark:shadow-slate-300">
    <Icon size={42} color="default" className={"dark:drop-shadow-fuchsia"} />
    <span className="text-center whitespace-normal select-text">{label}</span>
  </div>
);

const SkillArea = ({
  title,
  children,
}: PropsWithChildren<{ title: string }>) => {
  return (
    <>
      <h3 className="text-xl">{title}</h3>
      <div className="flex flex-wrap justify-center gap-6 m-4 sm:justify-start sm:gap-2">
        {children}
      </div>
    </>
  );
};

const SubData = ({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) => {
  return (
    <div
      className={`border-t border-gray-400 px-4 py-2 first:border-t-0 sm:p-3 md:border-t-0 md:even:border-l ${index > 1 ? "md:border-t" : ""
        }`}
    >
      <dt className="text-base font-normal">{question}</dt>
      <dd className="flex justify-center mt-1">
        <div className="text-xl font-semibold">{answer}</div>
      </dd>
    </div>
  );
};

import profileImage from "@/public/sinsky.png";

export default function Page() {
  return (
    <>
      <Title title={"About me"} />
      <section className="my-4 ml-6">
        <h2 className="text-3xl font-bold">Profile Card</h2>
        <div className="p-4 m-4 mr-12 bg-blue-300 rounded-lg shadow-md">
          <div className="flex justify-center">
            <Image
              src={profileImage}
              alt="sinsky's profile image"
              className="rounded-full pointer-events-none w-36"
            />
          </div>
          <div className="flex flex-col m-auto mb-8 text-center">
            <div className="text-2xl font-bold">sinsky</div>
          </div>
          <dl className="grid grid-cols-1 overflow-hidden rounded-lg shadow md:grid-cols-2">
            {[
              { question: "出身", answer: "福岡" },
              { question: "勤務地", answer: "東京" },
              { question: "プログラミング歴", answer: "5年" },
              { question: "好きなこと", answer: "ドライブ" },
            ].map(({ question, answer }, index) => (
              <SubData question={question} answer={answer} key={index} index={index} />
            ))}
          </dl>
        </div>
        <h2 className="text-3xl font-bold">Profile</h2>
        <div className="mx-4 my-2">
          <p>
            2021年に就職、1年間運用のインフラエンジニアとして活動し、現在は運用現場での業務効率化/自動化を行なっています。
          </p>
          <p>
            プログラミングは大学時代にC言語を学び、以降PythonやJavaScript/TypeScriptを趣味で学んでいます。
          </p>
          <p>現在はTypeScriptを使ってのtRPCや、Rustを学習中です。</p>
        </div>
      </section>
      <section className="my-4 ml-6">
        <h2 className="text-3xl font-bold">Accounts</h2>
        <div className="mx-4 my-2">
          <div className="flex flex-wrap justify-center gap-8 m-4 sm:justify-start sm:gap-2">
            <Account
              label={"GitHub"}
              Icon={Github}
              link="https://github.com/sinsky"
            />
            <Account
              label={"Qiita"}
              Icon={Qiita}
              link="https://qiita.com/sinsky"
            />
            <Account
              label={"Twitter"}
              Icon={Twitter}
              link="https://twitter.com/sin_sky_"
            />
          </div>
        </div>
      </section>
      <section className="my-4 ml-6">
        <h2 className="text-3xl font-bold">Skills</h2>
        <div className="mx-4 my-2">
          <SkillArea title="言語">
            <Skill label="C" Icon={C} />
            <Skill label="Deno" Icon={Deno} />
            <Skill label="JavaScript" Icon={Javascript} />
            <Skill label="PHP" Icon={Php} />
            <Skill label="Python" Icon={Python} />
            <Skill label="Rust" Icon={Rust} />
            <Skill label="TypeScript" Icon={Typescript} />
          </SkillArea>
          <SkillArea title="フレームワーク">
            <Skill label="Django" Icon={Django} />
            <Skill label="Flask" Icon={Flask} />
            <Skill label="Jest" Icon={Jest} />
            <Skill label="Next.js" Icon={Nextdotjs} />
            <Skill label="Playwright" Icon={Playwright} />
            <Skill label="React" Icon={ReactJs} />
            <Skill label="Selenium" Icon={Selenium} />
            <Skill label="Vite" Icon={Vite} />
            <Skill label="tRPC" Icon={Trpc} />
          </SkillArea>
          <SkillArea title="クラウド">
            <Skill label="AWS" Icon={Amazonaws} />
            <Skill label="Google Cloud" Icon={Googlecloud} />
            <Skill label="Microsoft Azure" Icon={Microsoftazure} />
          </SkillArea>
          <SkillArea title="CI/CD">
            <Skill label="CircleCI" Icon={Circleci} />
            <Skill label="Jenkins" Icon={Jenkins} />
            <Skill label="GitHub Actions" Icon={Githubactions} />
          </SkillArea>
          <SkillArea title="PaaS">
            <Skill label="Cloudflare Pages" Icon={Cloudflarepages} />
            <Skill label="GitHub Pages" Icon={Githubpages} />
            <Skill label="Netlify" Icon={Netlify} />
            <Skill label="Vercel" Icon={Vercel} />
          </SkillArea>
          <SkillArea title="環境">
            <Skill label="Docker" Icon={Docker} />
            <Skill label="Git" Icon={Git} />
            <Skill label="Gitea" Icon={Gitea} />
            <Skill label="GitHub" Icon={Github} />
            <Skill label="VisualStudio Code" Icon={Visualstudiocode} />
          </SkillArea>
        </div>
      </section>
    </>
  );
}
