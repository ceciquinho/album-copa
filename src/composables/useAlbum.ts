import { ref, computed } from 'vue';
import { stickersData } from '@/data/stickers';

const STICKERS_KEY = 'user_stickers';

export function useAlbum() {
  const stickers = ref<any[]>([]);
  const filter = ref<'all' | 'collected' | 'pending'>('all');
  const searchTerm = ref('');

  const loadStickers = () => {
    const saved = localStorage.getItem(STICKERS_KEY);
    if (saved) {
      stickers.value = JSON.parse(saved);
    } else {
      stickers.value = JSON.parse(JSON.stringify(stickersData));
    }
  };

  const saveStickers = () => {
    localStorage.setItem(STICKERS_KEY, JSON.stringify(stickers.value));
  };

  const toggleCollected = (id: string) => {
    const sticker = stickers.value.find(s => s.id === id);
    if (sticker) {
      sticker.collected = !sticker.collected;
      saveStickers();
    }
  };

  const filteredStickers = computed(() => {
    let result = [...stickers.value];

    if (filter.value === 'collected') {
      result = result.filter(s => s.collected);
    } else if (filter.value === 'pending') {
      result = result.filter(s => !s.collected);
    }

    if (searchTerm.value.trim()) {
      const term = searchTerm.value.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.country.toLowerCase().includes(term)
      );
    }

    return result;
  });

  const stats = computed(() => ({
    total: stickers.value.length,
    collected: stickers.value.filter(s => s.collected).length,
    pending: stickers.value.filter(s => !s.collected).length,
    percentage: Math.round((stickers.value.filter(s => s.collected).length / stickers.value.length) * 100)
  }));

  const stickersByCountry = computed(() => {
    const groups: any = {};
    filteredStickers.value.forEach(sticker => {
      if (!groups[sticker.country]) {
        groups[sticker.country] = [];
      }
      groups[sticker.country].push(sticker);
    });
    return groups;
  });

  loadStickers();

  return {
    stickers,
    filter,
    searchTerm,
    stats,
    filteredStickers,
    stickersByCountry,
    toggleCollected,
  };
}