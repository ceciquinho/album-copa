import { computed, ref } from 'vue';
import { getDb, recalculateAchievements, saveDb } from '@/services/database';

const stickersList = ref<any[]>([]);
const filter = ref<'all' | 'collected' | 'pending'>('all');
const searchTerm = ref('');
const isLoading = ref(false);

let loadPromise: Promise<void> | null = null;
let loadedUserId: string | null = null;

const getCurrentUserId = () => localStorage.getItem('auth_user_id');

const loadStickers = async () => {
  const userId = getCurrentUserId();
  if (!userId) {
    stickersList.value = [];
    loadedUserId = null;
    return;
  }

  isLoading.value = true;
  const db = await getDb();
  const result = await db.query(
    `SELECT
      s.id,
      s.nome,
      s.selecao,
      s.raridade,
      s.foto,
      COALESCE(us.coletada, 0) AS coletada
     FROM stickers s
     LEFT JOIN user_stickers us ON us.sticker_id = s.id AND us.user_id = ?
     ORDER BY s.selecao, s.id`,
    [userId],
  );

  stickersList.value = (result.values ?? []).map((sticker: any) => ({
    ...sticker,
    coletada: Number(sticker.coletada) === 1,
  }));
  loadedUserId = userId;
  isLoading.value = false;
};

export function useAlbum() {
  const ensureLoaded = async () => {
    if (!loadPromise || loadedUserId !== getCurrentUserId()) {
      loadPromise = loadStickers();
    }
    await loadPromise;
  };

  const toggleCollected = async (id: number) => {
    const userId = getCurrentUserId();
    if (!userId) {
      return;
    }

    const sticker = stickersList.value.find(s => Number(s.id) === Number(id));
    if (!sticker) {
      return;
    }

    const nextCollected = !sticker.coletada;
    const db = await getDb();
    await db.run(
      `INSERT INTO user_stickers (user_id, sticker_id, coletada, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(user_id, sticker_id) DO UPDATE SET
        coletada = excluded.coletada,
        updated_at = excluded.updated_at`,
      [userId, id, nextCollected ? 1 : 0, new Date().toISOString()],
    );

    sticker.coletada = nextCollected;
    await recalculateAchievements(userId);
    await saveDb();
  };

  const refresh = async () => {
    loadPromise = loadStickers();
    await loadPromise;
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

  const stats = computed(() => {
    const total = stickersList.value.length;
    const collected = stickersList.value.filter(s => s.coletada === true).length;

    return {
      total,
      collected,
      pending: total - collected,
      percentage: total > 0 ? Math.round((collected / total) * 100) : 0,
      rareCollected: stickersList.value.filter(s => s.coletada && s.raridade === 'Rara').length,
      shinyCollected: stickersList.value.filter(s => s.coletada && s.raridade === 'Brilhante').length,
    };
  });

  const stickersByCountry = computed(() => {
    const groups: any = {};
    filteredStickers.value.forEach((sticker: any) => {
      const selecao = sticker.selecao;
      if (!groups[selecao]) {
        groups[selecao] = [];
      }
      groups[selecao].push(sticker);
    });
    return groups;
  });

  ensureLoaded();

  return {
    stickers: stickersList,
    filter,
    searchTerm,
    stats,
    isLoading,
    filteredStickers,
    stickersByCountry,
    ensureLoaded,
    refresh,
    toggleCollected,
  };
}
