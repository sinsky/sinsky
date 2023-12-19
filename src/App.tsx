import { FaTwitterSquare, FaGithubSquare } from "react-icons/fa";
import { useState } from "react";
import { NotificationsProvider } from "@mantine/notifications";
import { ContactForm } from "./Contact";
import MySkill from "./MySkill.json";

type SkillProps = {
  lang: string;
  skills: string[];
};
type otherProps = {
  title: string;
  description: string;
};

function App() {
  const [useSkill] = useState<SkillProps[]>(MySkill.languages);
  const [others] = useState<otherProps[]>(MySkill.otherSkill);
  return (
    <NotificationsProvider>
      <div className="text-center bg-slate-300">
        <div className="h-screen overflow-y-auto flex-flex-col snap-y snap-mandatory">
          <div className="container flex flex-col items-center justify-around h-screen m-auto snap-center snap-always">
            <div>
              <h1 className="my-12 text-5xl font-bold">My Profile</h1>
              <div>
                <img
                  className="w-32 h-32 m-auto border rounded-full"
                  src="https://github.com/sinsky.png"
                  alt="My Icon"
                />
              </div>
              <h2 className="mt-4 text-4xl font-bold">sinsky</h2>
            </div>
            <div>
              <h2 className="mb-4 text-3xl font-bold capitalize">About me</h2>
              <div className="flex justify-around">
                <div>
                  <a href="https://twitter.com/sin_sky_">
                    <FaTwitterSquare
                      size={40}
                      className="hover:text-blue-500"
                    />
                  </a>
                </div>
                <div>
                  <a href="https://github.com/sinsky">
                    <FaGithubSquare size={40} className="hover:text-teal-700" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="container flex flex-col items-center justify-around h-screen m-auto snap-center snap-always">
            <div>
              <h2 className="mb-4 text-3xl font-bold capitalize">Use skills</h2>
              <div className="flex flex-col">
                <div className="grid grid-cols-2 gap-4 py-4 font-bold border-b border-teal-800">
                  <div>Language</div>
                  <div>Framework/Library</div>
                </div>
                {useSkill.map((skillItem) => {
                  const { lang, skills } = skillItem;
                  return (
                    <div className="grid grid-cols-2 gap-4 py-4 border-b border-teal-800">
                      <div>{lang}</div>
                      <div>
                        {skills.map((skill) => (
                          <div>{skill}</div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="container flex flex-col items-center justify-around h-screen m-auto snap-center snap-always">
            <div>
              <h2 className="mb-4 text-3xl font-bold capitalize">
                Other skills
              </h2>
              <div className="flex flex-col">
                <div className="grid grid-cols-2 gap-4 py-4 font-bold border-b border-teal-800">
                  <div></div>
                  <div>説明</div>
                </div>
                {others.map((other) => {
                  const { title, description } = other;
                  return (
                    <div className="grid grid-cols-2 gap-4 py-4 border-b border-teal-800">
                      <div>{title}</div>
                      <div className="whitespace-normal">{description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="container flex flex-col items-center justify-around h-screen m-auto snap-center snap-always">
            <div>
              <h2 className="mb-4 text-3xl font-bold capitalize">Contact</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </NotificationsProvider>
  );
}

export default App;
