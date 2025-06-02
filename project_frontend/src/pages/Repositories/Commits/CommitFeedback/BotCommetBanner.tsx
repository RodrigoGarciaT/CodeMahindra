import { useState } from 'react';
import Bot from '../../../../images/robot_male_1.svg';

type BotCommentProps = {
  comment: string;
};

const BotCommentBanner = ({ comment }: BotCommentProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`cursor-pointer relative border-l-4 px-4 py-2 my-4 rounded-md transition-all duration-300 
        ${
          expanded
            ? 'bg-[#1f1a1a] border-red-500'
            : 'bg-[#2a1d1d] border-red-500 animate-pulse-red'
        }
        hover:bg-[#3a2020] hover:border-red-400 shadow-md hover:shadow-xl`}
    >
      {!expanded && (
        <div className="absolute inset-0 rounded-md pointer-events-none animate-radiate-red z-0" />
      )}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-red-400 shadow-sm">
          <img
            src={Bot}
            alt="Bot"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-sm text-red-400 font-semibold tracking-wide">
          Bot Feedback
        </p>
      </div>
      {expanded && (
        <div className="mt-2 text-gray-300 text-sm z-10 relative">
          {comment}
        </div>
      )}
    </div>
  );
};

export default BotCommentBanner;
