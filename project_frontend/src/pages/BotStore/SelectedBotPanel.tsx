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

type SelectedBotPanelProps = {
  bot: Bot;
  isPurchasing: boolean;
  isEquipping: boolean;
  onPurchase: () => void;
  onEquip: () => void;
};

const SelectedBotPanel: React.FC<SelectedBotPanelProps> = ({
  bot,
  isPurchasing,
  isEquipping,
  onPurchase,
  onEquip,
}) => {
  return (
    <motion.div
      className="rounded-2xl p-6 flex flex-col bg-[#0d0d0d] border border-[#2a2a2a]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-3xl font-bold text-red-500">{bot.name}</h2>
          {bot.owns && (
            <div className="flex items-center gap-1 mt-2 text-green-400 text-sm">
              <Check className="w-4 h-4" />
              <span>Already owned</span>
            </div>
          )}
          {bot.isEquipped && (
            <div className="flex items-center gap-1 mt-1 text-yellow-400 text-sm">
              <Zap className="w-4 h-4" />
              <span>Equipped</span>
            </div>
          )}
        </div>
        <span className="text-2xl font-bold text-red-400">{bot.price} pts</span>
      </div>

      {/* Content */}
      <div className="flex gap-6">
        {/* Bot Image */}
        <div className="flex-1 relative rounded-xl bg-[#1a1a1a] overflow-hidden border border-[#2e2e2e]">
          <motion.img
            src={bot.image}
            alt={bot.name}
            className={`w-full h-full object-cover rounded-xl ${
              bot.owns ? '' : 'grayscale brightness-75'
            }`}
            animate={{
              y: [0, -6, 0],
              scale: [1, 1.015, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
          />
          {bot.isEquipped && (
            <div className="absolute inset-0 border-2 border-yellow-400/70 rounded-xl pointer-events-none" />
          )}
        </div>

        {/* Description and Actions */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-lg text-white text-sm shadow-inner">
              {bot.description}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <motion.button
              onClick={onPurchase}
              disabled={isPurchasing || bot.owns}
              whileHover={!bot.owns && !isPurchasing ? { scale: 1.02 } : {}}
              className={`w-full py-2.5 px-6 rounded-md font-semibold transition-all duration-300 border text-sm shadow-md ${
                isPurchasing
                  ? 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                  : bot.owns
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gradient-to-r from-red-600 to-pink-500 border-red-500 text-white hover:brightness-110'
              }`}
            >
              {isPurchasing
                ? 'Processing...'
                : bot.owns
                ? 'Purchased'
                : 'Purchase Bot'}
            </motion.button>

            {bot.owns && (
              <motion.button
                onClick={onEquip}
                disabled={isEquipping || bot.isEquipped}
                whileHover={!isEquipping && !bot.isEquipped ? { scale: 1.02 } : {}}
                className={`w-full py-2.5 px-6 rounded-md font-semibold transition-all duration-300 border text-sm shadow-md ${
                  isEquipping
                    ? 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                    : bot.isEquipped
                    ? 'bg-yellow-400 border-yellow-300 text-black'
                    : 'bg-gradient-to-r from-yellow-300 to-yellow-200 border-yellow-400 text-black hover:brightness-110'
                }`}
              >
                {isEquipping
                  ? 'Equipping...'
                  : bot.isEquipped
                  ? 'Equipped'
                  : 'Equip Bot'}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SelectedBotPanel;
