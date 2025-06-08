import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';

type Bot = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  owns: boolean;
  isEquipped: boolean;
};

const botCardVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.06, transition: { duration: 0.3 } },
  select: { scale: 1.1, boxShadow: '0px 0px 25px rgba(255, 0, 70, 0.6)' },
};

const botImageVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3 } },
};

type BotCardProps = {
  bot: Bot;
  selected: boolean;
  onSelect: () => void;
};

const BotCard: React.FC<BotCardProps> = ({ bot, selected, onSelect }) => {
  return (
    <motion.button
      key={bot.id}
      initial="initial"
      whileHover="hover"
      whileTap="select"
      variants={botCardVariants}
      onClick={onSelect}
      className={`relative aspect-square rounded-xl overflow-hidden border-2 p-[2px] transition-all duration-300
        ${selected ? 'border-red-500 shadow-[0_0_25px_#ff003c80] bg-gradient-to-br from-[#1f1f1f] to-[#2e2e2e]' : 'border-neutral-700 bg-[#121212]'}
        ${bot.owns ? 'ring-2 ring-green-500/60' : ''}
        ${bot.isEquipped ? 'ring-2 ring-yellow-400/60' : ''}
        hover:scale-[1.01]
      `}
    >
      {/* Ownership Badge */}
      {bot.owns && (
        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 z-10 shadow-md">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Equipped Badge */}
      {bot.isEquipped && (
        <div className="absolute top-2 left-2 bg-yellow-500 rounded-full p-1 z-10 shadow-md">
          <Zap className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Bot Image */}
      <motion.img
        src={bot.image}
        alt={bot.name}
        className={`w-full h-full object-cover transition-all duration-300 ${bot.owns ? '' : 'grayscale brightness-75'}`}
        variants={botImageVariants}
        whileHover="hover"
      />
      
      {/* Overlay + Bot Name */}
      <motion.div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm transition-opacity duration-300 opacity-0 hover:opacity-100 flex items-end z-10">
        <div className="w-full text-center text-sm font-semibold text-white bg-black/40 py-2">
          {bot.name}
        </div>
      </motion.div>

      {/* Price Badge */}
      {!bot.owns && (
        <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 z-0">
          <div className="bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-md font-semibold">
            ${bot.price}
          </div>
        </div>
      )}
    </motion.button>
  );
};

export default BotCard;
