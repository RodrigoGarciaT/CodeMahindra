import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Bot as BotType } from "../BotStore/Page";

const botImage = new URL("../../images/robot_male_1.svg", import.meta.url).href;

const expressions = [
  "Hi! 🤖", "Yay! 🎉", "?!", ":D", "!!", "Hehe 😄", "<3 ❤️", "Oof 😅", "Bzzt! ⚡", "Uh? 🤔", "*blip*", "+1 👍", "Hey!", "Yo!", "Woop! 🙌",
  ":O 😲", "Eep!", "Ping!", "Zzz 💤", "!", "Boop", "?", ":3", "Ok!", "Ack!", "Wee!", "Woo!", "Yup!", "Bam! 💥", "Ding!", "Nom! 🍪", "Bloop!", "...",
  "Aha!", "Omg! 😱", "O.o", ":)", "Nah", "Yep", "Oops!", "Yikes! 😬", "Huh", "Yo!", "Ssshh 🤫", "Cool 😎", "Bip!", "Gone! 🛸", "Zoom!", "Yeehaw! 🤠",
  "Wow! 🤩", "Nice! 😎", "Glitch? 🤖", "Wait! ⏳", "Flyin'! 🛫", "Spin! 🌀", "Boom! 💣", "Pop! 🎈", "Eek!", "Pow! 💢", "Whoosh! 🌪️", "Shiny! ✨", "Brrr! ❄️",
  "Kaboom! 💥", "Zap! ⚡", "Meep! 🤖", "Nyoom! 🚀", "Blink! 💫",
  "Analyzing PR... 🔍", "Running tests... 🧪", "Merging commits... 🔧", "Review ready! ✅",
  "Leveling up... 🔺", "Ranking updated! 🏆", "Solving problem... 💡", "Task in progress... 📝",
  "Refactor mode! ♻️", "Syntax clean! 🧼", "Clean code vibes ✨", "XP gained! 🧠", "Review bot engaged 🤖",
  "Challenge accepted! 🧩", "Let's code! 👨‍💻", "Evaluating AI feedback... 🤓", "New badge unlocked! 🥇",
  "Retro incoming 🔁", "Commit digest ready 📦", "Diff loaded 🪄", "Rewriting history... ⌛",
  "Error? Never heard of it 🛡️", "Target acquired 🎯", "Deploying suggestions... 🚀",
  "JIRA synced 📋", "One more PR! 🙌", "Refactor complete 💅", "Rank climbing ⛰️",
  "Checklist complete ✅", "Ship it! 🚢", "Pull request approved 👍", "XP overflow! 📈",
  "Unit tests pass! ✔️", "Red to green 🟩", "Code smells detected 👃", "Fixing issues... 🛠️",
  "Achievement unlocked! 🏅", "Just another sprint 🏃‍♂️", "Feedback loop active 🔁",
  "Merge conflict? Nah 😎", "Push complete 🧨", "Awaiting approval 🔒", "Branch dancing 🌿",
  "Learning mode: ON 📚", "Analyzing diff... 🧠", "Code Mahindra at your service 🤖",
  "Retro sent! 📮", "New insight! 🌟", "Optimizing... ⏱️", "Debugger launched 🪲",
  "Another challenge? Bring it! 💪", "Autofix magic 🧙", "Score boosted! 🔢", "Queueing review... 🛤️",
  "Night shift coder 🌙", "Mahindra scanning 👁️", "Ranking you up... ⬆️", "Patch incoming 🧵",
  "Cool commit 😎", "Status: Reviewing 🔍", "Feedback initialized 💬", "XP loaded! ⚡"
];

type Props = {
  equippedBot: BotType | null;
  purchasedBot: BotType | null;
};

const BotSection: React.FC<Props> = ({ equippedBot, purchasedBot }) => {
  const navigate = useNavigate();
  const currentBot = equippedBot || purchasedBot;

  useEffect(() => {
    const interval = setInterval(() => {
      const chance = Math.random();
      const expression = expressions[Math.floor(Math.random() * expressions.length)];

      if (chance < 0.6) {
        setDialogue(expression);

        // Espera 2s y empieza a desvanecer
        setTimeout(() => {
          const bubble = document.querySelector(".dialogue-bubble");
          if (bubble) {
            (bubble as HTMLElement).classList.add("fade-out");
          }

          // Luego de desvanecer, elimina el diálogo
          setTimeout(() => {
            setDialogue(null);
          }, 600); // igual a duración del fade-out
        }, 2000);
      }

      if (chance < 0.2) {
        setAnimationClass("bot-bounce");
        setTimeout(() => setAnimationClass("bot-animate-fun"), 1500);
      } else if (chance < 0.4) {
        setAnimationClass("bot-twirl");
        setTimeout(() => setAnimationClass("bot-animate-fun"), 2000);
      } else {
        setAnimationClass("bot-pulse");
        setTimeout(() => setAnimationClass("bot-animate-fun"), 2000);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const botRef = useRef<HTMLImageElement>(null);
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [animationClass, setAnimationClass] = useState("bot-animate-fun");

  useEffect(() => {
    const interval = setInterval(() => {
      const chance = Math.random();
      const expression = expressions[Math.floor(Math.random() * expressions.length)];

      if (chance < 0.6) setDialogue(expression);

      if (chance < 0.2) {
        setAnimationClass("bot-bounce");
        setTimeout(() => setAnimationClass("bot-animate-fun"), 1500);
      } else if (chance < 0.4) {
        setAnimationClass("bot-twirl");
        setTimeout(() => setAnimationClass("bot-animate-fun"), 2000);
      } else {
        setAnimationClass("bot-pulse");
        setTimeout(() => setAnimationClass("bot-animate-fun"), 2000);
      }

      if (chance < 0.8) {
        setTimeout(() => setDialogue(null), 2800);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="bg-[#1e1e1e] border border-[#2e2e2e] text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition cursor-pointer relative overflow-hidden"
      onClick={() => navigate("/bot-store")}
    >
      <h2 className="text-xl font-bold text-center mb-4">{currentBot?.name || "Mahindra Bot"}</h2>

      <div className="flex flex-col items-center justify-center relative">
        {/* 💬 Diálogo */}
        {dialogue && (
          <div className="dialogue-bubble animate-fade-in-out">
            <div className="bubble-text">💬 {dialogue}</div>
            <div className="bubble-tail" />
          </div>
        )}

        {/* 🤖 Imagen del bot */}
        <img
          ref={botRef}
          src={currentBot?.image || botImage}
          alt="Bot"
          className={`w-28 h-28 object-contain ${animationClass} bot-trail`}
          draggable={false}
        />

        {/* ℹ️ Descripción */}
        {currentBot && (
          <>
            <p className="text-sm text-gray-300 mt-4 text-center max-w-xs bg-[#2a2a2a] px-3 py-2 rounded-lg border border-[#3a3a3a]">
              {currentBot.description}
            </p>
            <p className={`mt-2 text-xs font-semibold ${equippedBot ? "text-green-400" : "text-gray-500"}`}>
              {equippedBot ? "Equipped" : "Not Equipped"}
            </p>
          </>
        )}
      </div>

      {/* 🎨 Estilos */}
      <style>{`
        @keyframes floatRotatePlay {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(3deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        .bot-animate-fun {
          animation: floatRotatePlay 6s ease-in-out infinite;
        }

        @keyframes bot-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .bot-bounce {
          animation: bot-bounce 1.5s ease-in-out;
        }

        @keyframes bot-twirl {
          0% { transform: rotate(0); }
          100% { transform: rotate(720deg); }
        }

        .bot-twirl {
          animation: bot-twirl 2s ease-in-out;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }

        .animate-fade-in-out {
          animation: fadeInOut 2.6s ease-in-out;
        }

        @keyframes pulseAura {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.5);
          }
          70% {
            box-shadow: 0 0 20px 10px rgba(255, 0, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
          }
        }

        .bot-pulse {
          animation: pulseAura 2s ease-out;
          border-radius: 50%;
        }

        .bot-trail {
          filter: drop-shadow(0 0 4px rgba(255, 0, 0, 0.5));
        }

        .dialogue-bubble {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }

        .bubble-text {
          background: #ffffff;
          color: #111;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: bold;
          white-space: nowrap;
          max-width: 220px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .bubble-tail {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #ffffff;
          margin-top: -1px;
        }
        .fade-out {
          opacity: 0;
          transition: opacity 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default BotSection;
