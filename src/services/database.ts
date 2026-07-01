import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
 
const dbName = 'appdata' // variavel que nao pode ser modificada
let db: SQLiteDBConnection | null = null// variavel que pode ser modificada
let initialized = false // variavel feita pra quando carregar o banco nao ter carregado
const sqliteConnection = new SQLiteConnection(CapacitorSQLite)
 
async function ensureDatabase() {
    if (initialized && db) {         // se o banco ja ta inicializado ele so retorna e nn executa as tabelas pq ja ta carregado
        return
    }
   
    if (!db) {
        db = await sqliteConnection.createConnection(dbName, false, 'no-encryption', 1, false) //  se nao tiver ele cria a conecção
    }
 
    await db.open()
    await db.execute( `CREATE TABLE IF NOT EXISTS usuario (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                login TEXT NOT NULL UNIQUE,
                senha TEXT
                );`,
           
    )
 
     await db.execute( `CREATE TABLE IF NOT EXISTS contato (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL,
                telefone TEXT
                );`,
           
    )
    initialized = true
}
 
function getDb() {
    if(!db) {
        throw new Error('Banco de dados ainda nao incializado')
   
    }
    return db
}
 
    export async function initDatabase() {
        try{
            await ensureDatabase()
        } catch (error) {
            console.error('Erro ao iniciar DB', error )
            throw error
        }
    }
 
export async function addUsuario(login: string, email: string, senha: string) {    // aqui
// ele vai adicionar oq cada um deve ser e se o usuario quiser falar a meu nome é tal ,  e pra isso que a funcao serve
    await ensureDatabase()
    const query = `INSERT INTO registro (login, email, senha) VALUES (?,?,?);`
    await getDb().run( query, [login, email, senha])
}
 
export async function listUsuario() {
    await ensureDatabase()
    const result = await getDb().query(`SELECT * FROM usuario ;`) // funcao para listar todos os campos da tabela
    return result.values || []
 
}
 
export async function deleteusuarioByid(id: number){
    await ensureDatabase()
    const query = `DELETE FROM usuario where id = ?`;  // função para deletar algum campo da tabela
    return await getDb().run(query, [id]);
}
export async function uptadeUsuario(id: number, login: string, email: string, senha: string,){
        await ensureDatabase()
       const query = `UPTADE usuario SET login = ?, email = ?, senha = ? WHERE id = ?);`            // atualizar algum campo da tabela
    await getDb().run( query, [login, email, senha, id])
 
}
export async function findusuarioById(id: number){
    await ensureDatabase
    const query = `SELECT * FROM usuario where id = ? `  // listar um campo especifico da tabela
    const result = await getDb().query(query, [id])
    return result.values || []
}
 
export async function realizarlogin(login: string, senha:string){
    await ensureDatabase()
    const query = `SELECT * FROM usuario where login = ? and senha = ? `  // listar um campo especifico da tabela
    const result = await getDb().query(query, [login, senha ])
    return result.values || []
}
 
 
 
 
 
 
 
export async function addContato(nome: string, email: string, telefone: string) {    // aqui
// ele vai adicionar oq cada um deve ser e se o usuario quiser falar a meu nome é tal ,  e pra isso que a funcao serve
    await ensureDatabase()
    const query = `INSERT INTO contato (nome, email, telefone) VALUES (?,?,?);`
    await getDb().run( query, [nome, email, telefone])
}
 
export async function findcontatooById(id: number){
    await ensureDatabase
    const query = `SELECT * FROM contato where id = ? `  // listar um campo especifico da tabela
    const result = await getDb().query(query, [id])
    return result.values || []
}
 
export async function uptadeContato(id: number, email: string, telefone: string,){
        await ensureDatabase()
       const query = `UPTADE usuario SET contato = ?, email = ?, telefone = ? WHERE id = ?);`            // atualizar algum campo da tabela
    await getDb().run( query, [email, telefone, id])
 
}
 
export async function deletecontatoByid(id: number){
    await ensureDatabase()
    const query = `DELETE FROM contato where id = ?`;  // função para deletar algum campo da tabela
    return await getDb().run(query, [id]);
}
 
export async function listContato() {
    await ensureDatabase()
    const result = await getDb().query(`SELECT * FROM contato ;`) // funcao para listar todos os campos da tabela
    return result.values || []
 
}