import { FaTwitterSquare, FaGithubSquare } from "react-icons/fa";
import { useState } from "react";
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
    <div className="bg-slate-300 text-center">
      <div className="flex-flex-col snap-y snap-mandatory overflow-y-auto h-screen">
        <div className="container m-auto h-screen flex flex-col items-center justify-around snap-center snap-always">
          <div>
            <div>
              <img
                className="w-32 h-32 m-auto border rounded-full"
                src="https://github.com/sinsky.png"
                alt="My Icon"
              />
            </div>
            <h1 className="font-bold text-4xl mt-4">sinsky</h1>
          </div>
          <div>
            <h2 className="font-bold text-3xl mb-4 capitalize">About me</h2>
            <div className="flex justify-around">
              <div>
                <a href="https://twitter.com/sin_sky_">
                  <FaTwitterSquare size={40} className="hover:text-blue-500" />
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
        <div className="container m-auto h-screen flex flex-col items-center justify-around snap-center snap-always">
          <div>
            <h2 className="font-bold text-3xl mb-4 capitalize">Use skills</h2>
            <div className="flex flex-col">
              <div className="border-b border-teal-800 grid grid-cols-2 gap-4 font-bold py-4">
                <div>Language</div>
                <div>Framework/Library</div>
              </div>
              {useSkill.map((skillItem) => {
                const { lang, skills } = skillItem;
                return (
                  <div className="border-b border-teal-800 grid grid-cols-2 gap-4 py-4">
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
        <div className="container m-auto h-screen flex flex-col items-center justify-around snap-center snap-always">
          <div>
            <h2 className="font-bold text-3xl mb-4 capitalize">Other skills</h2>
            <div className="flex flex-col">
              <div className="border-b border-teal-800 grid grid-cols-2 gap-4 font-bold py-4">
                <div></div>
                <div>説明</div>
              </div>
              {others.map((other) => {
                const { title, description } = other;
                return (
                  <div className="border-b border-teal-800 grid grid-cols-2 gap-4 py-4">
                    <div>{title}</div>
                    <div className="whitespace-normal">{description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="container m-auto h-screen flex flex-col items-center justify-around snap-center snap-always">
          <div>
            <h2 className="font-bold text-3xl mb-4 capitalize">Contact</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
