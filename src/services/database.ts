import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { stickers } from '@/data/stickers';

const DB_NAME = 'album_copa';
const sqlite = new SQLiteConnection(CapacitorSQLite);

let db: SQLiteDBConnection | null = null;
let initPromise: Promise<SQLiteDBConnection> | null = null;

const achievementsSeed = [
  ['primeira-figurinha', 'Primeira Figurinha', 'Desbloquear ao coletar a primeira figurinha.', 'ribbon', 'total_collected', 1, null],
  ['iniciante', 'Iniciante', 'Coletar 10 figurinhas.', 'medal', 'total_collected', 10, null],
  ['colecionador', 'Colecionador', 'Coletar 25 figurinhas.', 'trophy', 'total_collected', 25, null],
  ['album-em-construcao', 'Álbum em Construção', 'Coletar 50 figurinhas.', 'construct', 'total_collected', 50, null],
  ['cacador-de-raras', 'Caçador de Raras', 'Coletar 5 figurinhas raras.', 'diamond', 'rare_collected', 5, null],
  ['especialista-em-raras', 'Especialista em Raras', 'Coletar 15 figurinhas raras.', 'sparkles', 'rare_collected', 15, null],
  ['brilho-inicial', 'Brilho Inicial', 'Coletar 3 figurinhas brilhantes.', 'flash', 'shiny_collected', 3, null],
  ['mestre-das-brilhantes', 'Mestre das Brilhantes', 'Coletar 10 figurinhas brilhantes.', 'star', 'shiny_collected', 10, null],
  ['album-quase-completo', 'Álbum Quase Completo', 'Completar 80% do álbum.', 'podium', 'completion_percentage', 80, null],
  ['campeao-da-copa', 'Campeão da Copa', 'Completar 100% do álbum.', 'football', 'completion_percentage', 100, null],
];

const isWeb = () => Capacitor.getPlatform() === 'web';

const persistWebStore = async () => {
  if (isWeb()) {
    await sqlite.saveToStore(DB_NAME);
  }
};

const nowIso = () => new Date().toISOString();

export const getDb = async () => {
  if (db) {
    return db;
  }

  if (!initPromise) {
    initPromise = initDatabase();
  }

  db = await initPromise;
  return db;
};

export const initDatabase = async () => {
  if (isWeb()) {
    await sqlite.initWebStore();
  }

  const consistency = await sqlite.checkConnectionsConsistency();
  if (!consistency.result) {
    await sqlite.closeAllConnections();
  }

  const hasConnection = await sqlite.isConnection(DB_NAME, false);
  const connection = hasConnection.result
    ? await sqlite.retrieveConnection(DB_NAME, false)
    : await sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false);

  await connection.open();
  await createSchema(connection);
  await seedBaseData(connection);
  await persistWebStore();

  return connection;
};

const createSchema = async (connection: SQLiteDBConnection) => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stickers (
      id INTEGER PRIMARY KEY NOT NULL,
      nome TEXT NOT NULL,
      selecao TEXT NOT NULL,
      raridade TEXT NOT NULL,
      foto TEXT
    );

    CREATE TABLE IF NOT EXISTS user_stickers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      sticker_id INTEGER NOT NULL,
      coletada INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL,
      UNIQUE(user_id, sticker_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(sticker_id) REFERENCES stickers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY NOT NULL,
      nome TEXT NOT NULL,
      descricao TEXT NOT NULL,
      icone TEXT NOT NULL,
      criterio TEXT NOT NULL,
      valor INTEGER NOT NULL,
      selecao TEXT
    );

    CREATE TABLE IF NOT EXISTS user_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      achievement_id TEXT NOT NULL,
      data_desbloqueio TEXT NOT NULL,
      UNIQUE(user_id, achievement_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
    );
  `);
};

const seedBaseData = async (connection: SQLiteDBConnection) => {
  const stickerCount = await connection.query('SELECT COUNT(*) AS total FROM stickers');
  if ((stickerCount.values?.[0]?.total ?? 0) === 0) {
    for (const sticker of stickers) {
      await connection.run(
        'INSERT INTO stickers (id, nome, selecao, raridade, foto) VALUES (?, ?, ?, ?, ?)',
        [sticker.id, sticker.nome, sticker.selecao, sticker.raridade, sticker.foto],
      );
    }
  }

  for (const achievement of achievementsSeed) {
    await connection.run(
      `INSERT OR IGNORE INTO achievements
        (id, nome, descricao, icone, criterio, valor, selecao)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      achievement,
    );
  }

  const selections = await connection.query('SELECT DISTINCT selecao FROM stickers ORDER BY selecao');
  for (const row of selections.values ?? []) {
    await connection.run(
      `INSERT OR IGNORE INTO achievements
        (id, nome, descricao, icone, criterio, valor, selecao)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        `colecao-${String(row.selecao).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')}`,
        `Coleção ${row.selecao}`,
        `Completar todas as figurinhas da seleção ${row.selecao}.`,
        'flag',
        'selection_completed',
        100,
        row.selecao,
      ],
    );
  }
};

export const saveDb = persistWebStore;

export const createUserStickerRows = async (userId: string) => {
  const connection = await getDb();
  const rows = await connection.query('SELECT id FROM stickers');
  for (const row of rows.values ?? []) {
    await connection.run(
      `INSERT OR IGNORE INTO user_stickers (user_id, sticker_id, coletada, updated_at)
       VALUES (?, ?, 0, ?)`,
      [userId, row.id, nowIso()],
    );
  }
  await persistWebStore();
};

export const recalculateAchievements = async (userId: string) => {
  const connection = await getDb();
  const statsResult = await connection.query(
    `SELECT
      COUNT(s.id) AS total,
      SUM(CASE WHEN us.coletada = 1 THEN 1 ELSE 0 END) AS collected,
      SUM(CASE WHEN us.coletada = 1 AND LOWER(s.raridade) = 'rara' THEN 1 ELSE 0 END) AS rare_collected,
      SUM(CASE WHEN us.coletada = 1 AND LOWER(s.raridade) = 'brilhante' THEN 1 ELSE 0 END) AS shiny_collected
     FROM stickers s
     LEFT JOIN user_stickers us ON us.sticker_id = s.id AND us.user_id = ?`,
    [userId],
  );

  const stats = statsResult.values?.[0] ?? {};
  const total = Number(stats.total ?? 0);
  const collected = Number(stats.collected ?? 0);
  const rareCollected = Number(stats.rare_collected ?? 0);
  const shinyCollected = Number(stats.shiny_collected ?? 0);
  const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;

  const achievements = await connection.query('SELECT * FROM achievements');

  for (const achievement of achievements.values ?? []) {
    let currentValue = achievement.criterio === 'total_collected'
      ? collected
      : achievement.criterio === 'rare_collected'
        ? rareCollected
        : achievement.criterio === 'shiny_collected'
          ? shinyCollected
          : achievement.criterio === 'completion_percentage'
            ? percentage
            : 0;

    if (achievement.criterio === 'selection_completed') {
      const selectionResult = await connection.query(
        `SELECT
          COUNT(s.id) AS total,
          SUM(CASE WHEN us.coletada = 1 THEN 1 ELSE 0 END) AS collected
         FROM stickers s
         LEFT JOIN user_stickers us ON us.sticker_id = s.id AND us.user_id = ?
         WHERE s.selecao = ?`,
        [userId, achievement.selecao],
      );
      const selectionStats = selectionResult.values?.[0] ?? {};
      const selectionTotal = Number(selectionStats.total ?? 0);
      const selectionCollected = Number(selectionStats.collected ?? 0);
      currentValue = selectionTotal > 0 ? Math.round((selectionCollected / selectionTotal) * 100) : 0;
    }

    if (currentValue >= Number(achievement.valor)) {
      await connection.run(
        `INSERT OR IGNORE INTO user_achievements
          (user_id, achievement_id, data_desbloqueio)
         VALUES (?, ?, ?)`,
        [userId, achievement.id, nowIso()],
      );
    }
  }

  await persistWebStore();
};

export const getAchievements = async (userId: string) => {

  const connection = await getDb();


  const result = await connection.query(
    `
    SELECT
      a.id,
      a.nome,
      a.descricao,
      a.icone,
      a.criterio,
      a.valor,
      a.selecao,
      ua.data_desbloqueio,

      CASE
        WHEN ua.id IS NULL THEN 0
        ELSE 1
      END AS desbloqueada

    FROM achievements a

    LEFT JOIN user_achievements ua

      ON ua.achievement_id = a.id

      AND ua.user_id = ?

    ORDER BY 
      desbloqueada DESC,
      a.nome

    `,
    [userId]
  );


  return (result.values ?? []).map(
    (achievement: any) => ({
      ...achievement,

      desbloqueada:
        Number(achievement.desbloqueada) === 1,

    })
  );

};