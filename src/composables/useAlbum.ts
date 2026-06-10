import { ref, computed } from 'vue';
import { stickers } from '@/data/stickers';

const STICKERS_KEY = 'user_stickers';

export function useAlbum() {
  const stickersList = ref<any[]>([]);
  const filter = ref<'all' | 'collected' | 'pending'>('all');
  const searchTerm = ref('');

  const loadStickers = () => {
    const saved = localStorage.getItem(STICKERS_KEY);
    if (saved) {
      stickersList.value = JSON.parse(saved);
    } else {
      stickersList.value = JSON.parse(JSON.stringify(stickers));
    }
  };

  const saveStickers = () => {
    localStorage.setItem(STICKERS_KEY, JSON.stringify(stickersList.value));
  };

  const toggleCollected = (id: number) => {
    const sticker = stickersList.value.find(s => s.id === id);
    if (sticker) {
      sticker.coletada = !sticker.coletada;
      saveStickers();
    }
  };

  const filteredStickers = computed(() => {
    let result = [...stickersList.value];

    if (filter.value === 'collected') {
      result = result.filter(s => s.coletada === true);
    } else if (filter.value === 'pending') {
      result = result.filter(s => s.coletada === false);
    }

    if (searchTerm.value.trim()) {
      const term = searchTerm.value.toLowerCase();
      result = result.filter(s => 
        s.nome.toLowerCase().includes(term) || 
        s.selecao.toLowerCase().includes(term)
      );
    }

    return result;
  });

  const stats = computed(() => ({
    total: stickersList.value.length,
    collected: stickersList.value.filter(s => s.coletada === true).length,
    pending: stickersList.value.filter(s => s.coletada === false).length,
    percentage: Math.round((stickersList.value.filter(s => s.coletada === true).length / stickersList.value.length) * 100)
  }));

  const stickersByCountry = computed(() => {
    const groups: any = {};
    // Usar filteredStickers.value em vez de stickersList.value
    filteredStickers.value.forEach((sticker: any) => {
      const selecao = sticker.selecao;
      if (!groups[selecao]) {
        groups[selecao] = [];
      }
      groups[selecao].push(sticker);
    });
    return groups;
  });

  loadStickers();

  return {
    stickers: stickersList,
    filter,
    searchTerm,
    stats,
    filteredStickers,
    stickersByCountry,
    toggleCollected,
  };
}