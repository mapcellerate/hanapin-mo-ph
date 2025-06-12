'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StoreItem, STORE_ITEMS, UserInventory, getUserInventory, purchaseItem, equipItem } from '@/lib/store';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface StoreItemCardProps {
  item: StoreItem;
  owned: boolean;
  equipped: boolean;
  userCoins: number;
  onPurchase: () => void;
  onEquip: () => void;
}

function StoreItemCard({ item, owned, equipped, userCoins, onPurchase, onEquip }: StoreItemCardProps) {
  const rarityColors = {
    Common: 'bg-gray-500',
    Rare: 'bg-blue-500',
    Epic: 'bg-purple-500',
    Legendary: 'bg-yellow-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <span className={`absolute top-2 right-2 px-2 py-1 text-xs text-white rounded ${rarityColors[item.rarity]}`}>
          {item.rarity}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-yellow-600 font-semibold">{item.price} coins</span>
        {owned ? (
          <button
            onClick={onEquip}
            className={`px-4 py-2 rounded ${
              equipped
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {equipped ? 'Equipped' : 'Equip'}
          </button>
        ) : (
          <button
            onClick={onPurchase}
            disabled={userCoins < item.price}
            className={`px-4 py-2 rounded ${
              userCoins >= item.price
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Purchase
          </button>
        )}
      </div>
    </div>
  );
}

export default function StorePage() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<UserInventory | null>(null);
  const [userCoins, setUserCoins] = useState(0);
  const [selectedType, setSelectedType] = useState<'all' | StoreItem['type']>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen for inventory changes
    const inventoryUnsubscribe = onSnapshot(
      doc(db, 'userInventory', user.id),
      (doc) => {
        if (doc.exists()) {
          setInventory(doc.data() as UserInventory);
        }
      }
    );

    // Listen for user coin changes
    const userUnsubscribe = onSnapshot(
      doc(db, 'users', user.id),
      (doc) => {
        if (doc.exists()) {
          setUserCoins(doc.data()?.coins || 0);
        }
      }
    );

    // Load initial inventory
    getUserInventory(user.id).then(inv => {
      setInventory(inv);
      setLoading(false);
    });

    return () => {
      inventoryUnsubscribe();
      userUnsubscribe();
    };
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg">Please sign in to access the store.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg">Loading store...</p>
        </div>
      </div>
    );
  }

  const handlePurchase = async (item: StoreItem) => {
    if (!user || !inventory) return;
    const success = await purchaseItem(user.id, item.id);
    if (!success) {
      alert('Purchase failed. Please try again.');
    }
  };

  const handleEquip = async (item: StoreItem) => {
    if (!user || !inventory) return;
    const success = await equipItem(user.id, item.id);
    if (!success) {
      alert('Failed to equip item. Please try again.');
    }
  };

  const filteredItems = selectedType === 'all'
    ? STORE_ITEMS
    : STORE_ITEMS.filter(item => item.type === selectedType);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Store</h1>
        <div className="flex items-center space-x-4">
          <span className="text-yellow-600 font-semibold">{userCoins} coins</span>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2 rounded-lg ${
            selectedType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSelectedType('icon')}
          className={`px-4 py-2 rounded-lg ${
            selectedType === 'icon' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Icons
        </button>
        <button
          onClick={() => setSelectedType('marker')}
          className={`px-4 py-2 rounded-lg ${
            selectedType === 'marker' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Markers
        </button>
        <button
          onClick={() => setSelectedType('frame')}
          className={`px-4 py-2 rounded-lg ${
            selectedType === 'frame' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Frames
        </button>
        <button
          onClick={() => setSelectedType('effect')}
          className={`px-4 py-2 rounded-lg ${
            selectedType === 'effect' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Effects
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <StoreItemCard
            key={item.id}
            item={item}
            owned={inventory![`${item.type}s`].includes(item.id)}
            equipped={inventory!.equipped[item.type] === item.id}
            userCoins={userCoins}
            onPurchase={() => handlePurchase(item)}
            onEquip={() => handleEquip(item)}
          />
        ))}
      </div>
    </div>
  );
} 