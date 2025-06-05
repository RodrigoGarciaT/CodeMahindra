import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Check, Zap } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import Toast from '@/components/Toast';

export interface Bot {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  owns: boolean;
  isEquipped: boolean;
}

const botCardVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  select: { scale: 1.1, boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)" },
};

const botImageVariants = {
  hover: { scale: 1.1, transition: { duration: 0.2 } },
};

const selectedBotVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function BotStore() {
  const navigate = useNavigate();
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
        const employeeId = localStorage.getItem("user_id");
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/bots/employee/${employeeId}`);
        const data = await response.json();
        setBots(data);
      } catch (error) {
        console.error("Failed to fetch bots:", error);
      }
    };

    fetchBots();
  }, []);

  const handlePurchase = async (bot: Bot) => {
    if (bot.owns) {
      showToastMessage("Ya posees este bot", false);
      return;
    }

    setIsPurchasing(true);

    try {
      const employeeId = localStorage.getItem("user_id");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/bots/buy_bots?employee_id=${employeeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          { bot_id: parseInt(bot.id, 10) }
        ])
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to purchase bot');
      }

      // Update local state to reflect purchase
      setBots(prevBots => prevBots.map(b => 
        b.id === bot.id ? { ...b, owns: true, isEquipped: false } : b
      ));
      
      if (selectedBot?.id === bot.id) {
        setSelectedBot({ ...selectedBot, owns: true, isEquipped: false });
      }

      showToastMessage("¡Bot comprado con éxito!", true);
    } catch (error) {
      console.error('Purchase error:', error);
      showToastMessage(error instanceof Error ? error.message : 'Failed to purchase bot', false);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleEquip = async (bot: Bot) => {
    if (!bot.owns) return;
    if (bot.isEquipped) return;

    setIsEquipping(true);

    try {
      const employeeId = localStorage.getItem("user_id");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/employee-bots/${employeeId}/${bot.id}/equip`,
        { method: 'POST' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to equip bot');
      }

      // Update local state to reflect equip changes
      setBots(prevBots => prevBots.map(b => ({
        ...b,
        isEquipped: b.id === bot.id // Equip selected bot, unequip others
      })));

      if (selectedBot) {
        setSelectedBot({
          ...selectedBot,
          isEquipped: selectedBot.id === bot.id
        });
      }

      showToastMessage(`¡Bot ${bot.name} equipado!`, true);
    } catch (error) {
      console.error('Equip error:', error);
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

  const closeToast = () => {
    setShowToast(false);
  };

  useEffect(() => {
    if (selectedBot) {
      selectedBotControls.start("animate");
    } else {
      selectedBotControls.start("initial");
    }
  }, [selectedBot, selectedBotControls]);

  return (
    <div className="min-h-screen bg-[#363B41]">
      <Toast 
        show={showToast} 
        success={toastSuccess} 
        msg={toastMessage} 
        onClose={closeToast} 
      />

      <div className="max-w-7xl mx-auto p-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 p-2 rounded-md mb-6 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bot Selection Grid */}
          <div className="bg-black/50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-2">
              {bots.map((bot) => (
                <motion.button
                  key={bot.id}
                  initial="initial"
                  whileHover="hover"
                  whileTap="select"
                  variants={botCardVariants}
                  onClick={() => setSelectedBot(bot)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedBot?.id === bot.id 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/50' 
                      : 'border-gray-700'
                  } ${bot.owns ? 'border-green-500' : ''} ${
                    bot.isEquipped ? 'border-yellow-400 shadow-lg shadow-yellow-400/50' : ''
                  }`}
                >
                  {bot.owns && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 z-10">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {bot.isEquipped && (
                    <div className="absolute top-2 left-2 bg-yellow-500 rounded-full p-1 z-10">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <motion.img
                    src={bot.image}
                    alt={bot.name}
                    className={`w-full h-full object-cover ${bot.owns ? '' : 'grayscale'}`}
                    variants={botImageVariants}
                    whileHover="hover"
                  />
                  <motion.div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 opacity-0 hover:opacity-100">
                    <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium text-center">
                      {bot.name}
                    </div>
                  </motion.div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Selected Bot Preview */}
          <motion.div
            className="lg:col-span-2 bg-black/50 rounded-lg p-6 flex flex-col"
            initial="initial"
            animate={selectedBot ? "animate" : "initial"}
            variants={selectedBotVariants}
          >
            {selectedBot ? (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-blue-400">{selectedBot.name}</h2>
                    {selectedBot.owns && (
                      <div className="flex items-center gap-1 mt-1 text-green-400 text-sm">
                        <Check className="w-4 h-4" />
                        <span>Ya posees este bot</span>
                      </div>
                    )}
                    {selectedBot.isEquipped && (
                      <div className="flex items-center gap-1 mt-1 text-yellow-400 text-sm">
                        <Zap className="w-4 h-4" />
                        <span>Actualmente equipado</span>
                      </div>
                    )}
                  </div>
                  <span className="text-2xl font-bold text-green-400">{selectedBot.price} puntos</span>
                </div>

                <div className="flex-1 flex gap-6">
                  <div className="flex-1 relative overflow-hidden rounded-lg">
                    <motion.img
                      src={selectedBot.image}
                      alt={selectedBot.name}
                      className={`w-full h-full object-cover ${selectedBot.owns ? '' : 'grayscale'}`}
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    />
                    {selectedBot.isEquipped && (
                      <div className="absolute inset-0 bg-yellow-400/20 border-2 border-yellow-400 rounded-lg pointer-events-none" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-4">Descripción</h3>
                    <div className="bg-gradient-to-r from-blue-500/50 to-purple-500/50 p-4 rounded-lg text-white">
                      <p>{selectedBot.description}</p>
                    </div>

                    <div className="flex flex-col gap-4 mt-6">
                      <motion.button
                        onClick={() => handlePurchase(selectedBot)}
                        disabled={isPurchasing || selectedBot.owns}
                        className={`w-full text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                          isPurchasing 
                            ? 'bg-gray-500 cursor-not-allowed' 
                            : selectedBot.owns
                              ? 'bg-blue-500 cursor-default'
                              : 'bg-green-500 hover:bg-green-600 hover:shadow-green-500/50'
                        }`}
                        whileHover={!isPurchasing && !selectedBot.owns ? { scale: 1.05 } : {}}
                      >
                        {isPurchasing 
                          ? 'Procesando...' 
                          : selectedBot.owns 
                            ? 'Bot adquirido' 
                            : 'Comprar Bot'}
                      </motion.button>
                      {selectedBot.owns && (
                        <motion.button
                          onClick={() => handleEquip(selectedBot)}
                          disabled={isEquipping || selectedBot.isEquipped}
                          className={`w-full text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                            isEquipping
                              ? 'bg-gray-500 cursor-not-allowed'
                              : selectedBot.isEquipped
                                ? 'bg-yellow-500 cursor-default'
                                : 'bg-yellow-400 hover:bg-yellow-500 hover:shadow-yellow-400/50'
                          }`}
                          whileHover={!isEquipping && !selectedBot.isEquipped ? { scale: 1.05 } : {}}
                        >
                          {isEquipping
                            ? 'Procesando...'
                            : selectedBot.isEquipped
                              ? 'Equipado'
                              : 'Equipar Bot'}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Selecciona un bot para ver sus detalles
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default BotStore;