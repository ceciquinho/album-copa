import { computed, ref } from 'vue';
import { getDb, recalculateAchievements } from '@/services/database';

const achievements = ref<any[]>([]);
const isLoading = ref(false);

let loadPromise: Promise<void> | null = null;
let loadedUserId: string | null = null;

const getCurrentUserId = () => localStorage.getItem('auth_user_id');

const loadAchievements = async () => {
  const userId = getCurrentUserId();
  if (!userId) {
    achievements.value = [];
    loadedUserId = null;
    return;
  }

  isLoading.value = true;
  await recalculateAchievements(userId);

  const db = await getDb();
  const result = await db.query(
    `SELECT
      a.id,
      a.nome,
      a.descricao,
      a.icone,
      a.criterio,
      a.valor,
      a.selecao,
      ua.data_desbloqueio,
      CASE WHEN ua.id IS NULL THEN 0 ELSE 1 END AS desbloqueada
     FROM achievements a
     LEFT JOIN user_achievements ua
      ON ua.achievement_id = a.id AND ua.user_id = ?
     ORDER BY desbloqueada DESC, a.criterio, a.valor, a.nome`,
    [userId],
  );

  achievements.value = (result.values ?? []).map((achievement: any) => ({
    ...achievement,
    desbloqueada: Number(achievement.desbloqueada) === 1,
  }));
  loadedUserId = userId;
  isLoading.value = false;
};

export function useAchievements() {
  const ensureLoaded = async () => {
    if (!loadPromise || loadedUserId !== getCurrentUserId()) {
      loadPromise = loadAchievements();
    }
    await loadPromise;
  };

  const refresh = async () => {
    loadPromise = loadAchievements();
    await loadPromise;
  };

  const stats = computed(() => {
    const total = achievements.value.length;
    const unlocked = achievements.value.filter(achievement => achievement.desbloqueada).length;
    return {
      total,
      unlocked,
      locked: total - unlocked,
      percentage: total > 0 ? Math.round((unlocked / total) * 100) : 0,
    };
  });

  ensureLoaded();

  return {
    achievements,
    isLoading,
    stats,
    ensureLoaded,
    refresh,
  };
}
