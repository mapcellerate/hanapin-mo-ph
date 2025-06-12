import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'icon' | 'marker' | 'frame' | 'effect';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  imageUrl: string;
}

export const STORE_ITEMS: StoreItem[] = [
  // Icons
  {
    id: 'icon_ph_flag',
    name: 'Philippine Flag',
    description: 'Show your national pride',
    price: 100,
    type: 'icon',
    rarity: 'Common',
    imageUrl: '/store/icons/ph-flag.png'
  },
  {
    id: 'icon_jeepney',
    name: 'Jeepney',
    description: 'The king of Philippine roads',
    price: 200,
    type: 'icon',
    rarity: 'Rare',
    imageUrl: '/store/icons/jeepney.png'
  },
  // Markers
  {
    id: 'marker_tarsier',
    name: 'Tarsier Marker',
    description: 'A cute tarsier marks your guess',
    price: 300,
    type: 'marker',
    rarity: 'Epic',
    imageUrl: '/store/markers/tarsier.png'
  },
  {
    id: 'marker_carabao',
    name: 'Carabao Marker',
    description: 'The mighty carabao marks your location',
    price: 200,
    type: 'marker',
    rarity: 'Rare',
    imageUrl: '/store/markers/carabao.png'
  },
  // Frames
  {
    id: 'frame_bamboo',
    name: 'Bamboo Frame',
    description: 'A natural bamboo frame for your profile',
    price: 150,
    type: 'frame',
    rarity: 'Common',
    imageUrl: '/store/frames/bamboo.png'
  },
  {
    id: 'frame_gold',
    name: 'Golden Frame',
    description: 'A luxurious golden frame',
    price: 1000,
    type: 'frame',
    rarity: 'Legendary',
    imageUrl: '/store/frames/gold.png'
  },
  // Effects
  {
    id: 'effect_confetti',
    name: 'Confetti Effect',
    description: 'Celebrate your guesses with confetti',
    price: 500,
    type: 'effect',
    rarity: 'Epic',
    imageUrl: '/store/effects/confetti.png'
  },
  {
    id: 'effect_fireworks',
    name: 'Fireworks Effect',
    description: 'Light up the sky with every guess',
    price: 1000,
    type: 'effect',
    rarity: 'Legendary',
    imageUrl: '/store/effects/fireworks.png'
  }
];

export interface UserInventory {
  icons: string[];
  markers: string[];
  frames: string[];
  effects: string[];
  equipped: {
    icon?: string;
    marker?: string;
    frame?: string;
    effect?: string;
  };
}

export async function getUserInventory(userId: string): Promise<UserInventory> {
  const inventoryRef = doc(db, 'userInventory', userId);
  const inventoryDoc = await getDoc(inventoryRef);

  if (!inventoryDoc.exists()) {
    const defaultInventory: UserInventory = {
      icons: [],
      markers: [],
      frames: [],
      effects: [],
      equipped: {}
    };
    await setDoc(inventoryRef, defaultInventory);
    return defaultInventory;
  }

  return inventoryDoc.data() as UserInventory;
}

export async function purchaseItem(userId: string, itemId: string): Promise<boolean> {
  const item = STORE_ITEMS.find(i => i.id === itemId);
  if (!item) return false;

  const userRef = doc(db, 'users', userId);
  const inventoryRef = doc(db, 'userInventory', userId);

  const [userDoc, inventoryDoc] = await Promise.all([
    getDoc(userRef),
    getDoc(inventoryRef)
  ]);

  const userData = userDoc.data();
  const inventory = inventoryDoc.exists() ? inventoryDoc.data() as UserInventory : {
    icons: [],
    markers: [],
    frames: [],
    effects: [],
    equipped: {}
  };

  // Check if user has enough coins
  if ((userData?.coins || 0) < item.price) return false;

  // Check if user already owns the item
  if (inventory[`${item.type}s`].includes(itemId)) return false;

  // Update user's coins and inventory
  await Promise.all([
    setDoc(userRef, { coins: increment(-item.price) }, { merge: true }),
    setDoc(inventoryRef, {
      [`${item.type}s`]: [...inventory[`${item.type}s`], itemId]
    }, { merge: true })
  ]);

  return true;
}

export async function equipItem(userId: string, itemId: string): Promise<boolean> {
  const item = STORE_ITEMS.find(i => i.id === itemId);
  if (!item) return false;

  const inventoryRef = doc(db, 'userInventory', userId);
  const inventoryDoc = await getDoc(inventoryRef);
  const inventory = inventoryDoc.data() as UserInventory;

  // Check if user owns the item
  if (!inventory[`${item.type}s`].includes(itemId)) return false;

  // Update equipped items
  await setDoc(inventoryRef, {
    equipped: {
      ...inventory.equipped,
      [item.type]: itemId
    }
  }, { merge: true });

  return true;
} 