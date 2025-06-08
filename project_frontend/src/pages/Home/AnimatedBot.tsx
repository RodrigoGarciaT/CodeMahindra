import React, { useEffect, useRef, useState } from "react";

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


const AnimatedBot: React.FC = () => {
  const botRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 400, y: 200 });
  const [velocity, setVelocity] = useState({ x: 0.6, y: 0.5 });
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [animationClass, setAnimationClass] = useState("bot-animate-fun");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPosition((prev) => {
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;

        if (newX < 0 || newX > 2400) setVelocity((v) => ({ ...v, x: -v.x }));
        if (newY < 0 || newY > 2400) setVelocity((v) => ({ ...v, y: -v.y }));

        return { x: newX, y: newY };
      });
    }, 16);

    return () => clearInterval(moveInterval);
  }, [velocity]);

  useEffect(() => {
    const expressionInterval = setInterval(() => {
      const chance = Math.random();
      const randomText = expressions[Math.floor(Math.random() * expressions.length)];

      if (chance < 0.15) setDialogue(randomText);
      if (chance < 0.4) setTimeout(() => setDialogue(null), 1500);

      if (chance < 0.3) {
        setAnimationClass("bot-spin-fast");
        setTimeout(() => setAnimationClass("bot-animate-fun"), 2000);
      } else if (chance < 0.45) {
        setAnimationClass("bot-bounce");
        setTimeout(() => setAnimationClass("bot-animate-fun"), 1800);
      } else if (chance < 0.55) {
        setAnimationClass("bot-twirl");
        setTimeout(() => setAnimationClass("bot-animate-fun"), 3000);
      } else if (chance < 0.65) {
        setAnimationClass("bot-whirlwind");
        setTimeout(() => {
          setVisible(false);
          setTimeout(() => {
            setPosition({ x: Math.random() * 2200 + 100, y: Math.random() * 1200 + 100 });
            setVisible(true);
            setAnimationClass("bot-appear");
            setTimeout(() => setAnimationClass("bot-animate-fun"), 1000);
          }, 600);
        }, 1200);
      } else if (chance < 0.75) {
        setAnimationClass("bot-surprise-box");
        setTimeout(() => setAnimationClass("bot-animate-fun"), 2500);
      } else if (chance < 0.9) {
        setAnimationClass("bot-cinematic-zoom");
        setTimeout(() => setAnimationClass("bot-animate-fun"), 1800);
      } else {
        setAnimationClass("bot-pulse");
        setTimeout(() => setAnimationClass("bot-animate-fun"), 2000);
      }
    }, 8000);

    return () => clearInterval(expressionInterval);
  }, []);

  return (
    <>
      <div
        ref={botRef}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          pointerEvents: "none"
        }}
      >
        {visible && (
          <img
            src={botImage}
            alt="Floating Bot"
            className={`w-20 h-20 ${animationClass} bot-trail`}
            draggable={false}
          />
        )}
        {dialogue && (
          <div className="dialogue-bubble animate-fade-in-out">
            <div className="bubble-text">{dialogue}</div>
            <div className="bubble-tail" />
          </div>
        )}
      </div>

      <style>{`
        @keyframes floatRotatePlay {
          0% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-4px) rotate(10deg) scale(1.05); }
          50% { transform: translateY(2px) rotate(-5deg) scale(1); }
          75% { transform: translateY(-3px) rotate(15deg) scale(1.08); }
          100% { transform: translateY(0px) rotate(0deg) scale(1); }
        }

        .bot-animate-fun {
          animation: floatRotatePlay 8s ease-in-out infinite;
        }

        .bot-spin-fast {
          animation: spinFast 2s linear;
        }

        @keyframes spinFast {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .bot-bounce {
          animation: bounce 1.8s ease-in-out;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .bot-twirl {
          animation: twirl 3s ease-in-out;
        }

        @keyframes twirl {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(720deg) scale(1.2); }
          100% { transform: rotate(1440deg) scale(1); }
        }

        .bot-cinematic-zoom {
          animation: cinematicZoom 1.8s ease-in-out;
        }

        @keyframes cinematicZoom {
          0% { transform: scale(1) rotate(0); }
          50% { transform: scale(1.3) rotate(5deg); }
          100% { transform: scale(1) rotate(0); }
        }

        .bot-pulse {
          animation: pulseAura 2s ease-out;
          border-radius: 50%;
        }

        @keyframes pulseAura {
          0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.5); }
          70% { box-shadow: 0 0 20px 10px rgba(255, 0, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
        }

        .bot-whirlwind {
          animation: whirlwind 1.2s ease-in forwards;
        }

        @keyframes whirlwind {
          0% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0); }
          100% { transform: scale(0) rotate(720deg); opacity: 0; filter: blur(3px); }
        }

        .bot-surprise-box {
          animation: surpriseBox 2.5s ease-in-out;
        }

        @keyframes surpriseBox {
          0% { transform: scale(1); }
          20% { transform: scaleX(0.7) scaleY(1.2); }
          40% { transform: scale(1); }
          60% { transform: scale(1.3); }
          100% { transform: scale(0); opacity: 0; }
        }

        .bot-appear {
          animation: botAppear 1s ease-in-out;
        }

        @keyframes botAppear {
          0% { opacity: 0; transform: scale(0); }
          100% { opacity: 1; transform: scale(1); }
        }

        .bot-trail {
          filter: drop-shadow(0 0 4px rgba(255, 0, 0, 0.6));
        }

        .dialogue-bubble {
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bubble-text {
          background: #fff;
          color: #000;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: bold;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .bubble-tail {
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #fff;
        }

        .animate-fade-in-out {
          animation: fadeInOut 1.5s ease-in-out;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default AnimatedBot;
