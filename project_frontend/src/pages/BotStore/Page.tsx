import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Toast from '@/components/Toast';
import BotCard from './BotCard';
import SelectedBotPanel from './SelectedBotPanel';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bot } from 'lucide-react';

export type Bot = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  owns: boolean;
  isEquipped: boolean;
};

const selectedBotVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

function BotStore() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isEquipping, setIsEquipping] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSuccess, setToastSuccess] = useState(false);
  const selectedBotControls = useAnimation();

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const employeeId = localStorage.getItem('user_id');
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/bots/employee/${employeeId}`);
        const data = await response.json();
        setBots(data);
        const equippedBot = data.find((bot: Bot) => bot.isEquipped);
        if (equippedBot) {
          setSelectedBot(equippedBot);
        }
      } catch (error) {
        console.error('Failed to fetch bots:', error);
      }
    };

    fetchBots();
  }, []);

  const handlePurchase = async (bot: Bot) => {
    if (bot.owns) {
      showToastMessage('You already own this bot', false);
      return;
    }

    setIsPurchasing(true);
    try {
      const employeeId = localStorage.getItem('user_id');
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/bots/buy_bots?employee_id=${employeeId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([{ bot_id: parseInt(bot.id, 10) }]),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to purchase bot');
      }

      setBots(prev => prev.map(b => (b.id === bot.id ? { ...b, owns: true, isEquipped: false } : b)));
      if (selectedBot?.id === bot.id) {
        setSelectedBot({ ...bot, owns: true, isEquipped: false });
      }

      showToastMessage('Bot purchased successfully!', true);
    } catch (error) {
      showToastMessage(error instanceof Error ? error.message : 'Failed to purchase bot', false);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleEquip = async (bot: Bot) => {
    if (!bot.owns || bot.isEquipped) return;
    setIsEquipping(true);

    try {
      const employeeId = localStorage.getItem('user_id');
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/employee-bots/${employeeId}/${bot.id}/equip`,
        { method: 'POST' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to equip bot');
      }

      setBots(prev => prev.map(b => ({ ...b, isEquipped: b.id === bot.id })));
      setSelectedBot(prev => (prev ? { ...prev, isEquipped: prev.id === bot.id } : null));

      showToastMessage(`Bot ${bot.name} equipped!`, true);
    } catch (error) {
      showToastMessage(error instanceof Error ? error.message : 'Failed to equip bot', false);
    } finally {
      setIsEquipping(false);
    }
  };

  const showToastMessage = (message: string, success: boolean) => {
    setToastMessage(message);
    setToastSuccess(success);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  useEffect(() => {
    selectedBotControls.start(selectedBot ? 'animate' : 'initial');
  }, [selectedBot]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] bg-[radial-gradient(circle_at_20%_20%,#2a2a2a_0%,#0f0f0f_100%)] text-white overflow-hidden">
      <Toast show={showToast} success={toastSuccess} msg={toastMessage} onClose={() => setShowToast(false)} />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex items-center">
          <Link
            to="/home"
            className="mr-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="text-white h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-white text-3xl font-bold flex items-center gap-2">
              Bot Store
            </h1>
            <p className="text-slate-400">Buy, equip and manage your virtual assistants</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-black/50 rounded-lg p-4 grid grid-cols-3 gap-2">
            {bots.map(bot => (
              <BotCard
                key={bot.id}
                bot={bot}
                selected={selectedBot?.id === bot.id}
                onSelect={() => setSelectedBot(bot)}
              />
            ))}
          </div>

          <motion.div
            className="lg:col-span-2"
            initial="initial"
            animate={selectedBot ? 'animate' : 'initial'}
            variants={selectedBotVariants}
          >
            {selectedBot ? (
              <SelectedBotPanel
                bot={selectedBot}
                isPurchasing={isPurchasing}
                isEquipping={isEquipping}
                onPurchase={() => handlePurchase(selectedBot)}
                onEquip={() => handleEquip(selectedBot)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a bot to view its details
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default BotStore;
