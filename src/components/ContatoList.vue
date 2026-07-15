<template>
  <div>
    <div v-if="loading">Carregando...</div>
    <div v-else>
      <div v-for="contato in contatos" :key="contato.id" class="contato-item">
        <span>{{ contato.nome }} - {{ contato.email }} - {{ contato.telefone }}</span>
        <button @click="abrirModalEdicao(contato)">Editar</button>
        <button @click="deletarContato(contato.id)">Deletar</button>
      </div>
    </div>
    
    <div v-if="modalAberto && contatoParaEditar" class="modal">
      <h3>Editar Contato</h3>
      <input v-model="contatoParaEditar.nome" placeholder="Nome" />
      <input v-model="contatoParaEditar.email" placeholder="Email" />
      <input v-model="contatoParaEditar.telefone" placeholder="Telefone" />
      <button @click="salvarEdicao">Salvar</button>
      <button @click="fecharModal">Cancelar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listContato, uptadeContato, deletecontatoByid } from '@/services/database'

interface Contato {
  id: number
  nome: string
  email: string
  telefone: string
}

const contatos = ref<Contato[]>([])
const loading = ref(true)
const modalAberto = ref(false)
const contatoParaEditar = ref<Contato | null>(null)

async function carregarContatos() {
  try {
    loading.value = true
    const data = await listContato()
    contatos.value = data
  } catch (error) {
    console.error('Erro ao carregar contatos:', error)
  } finally {
    loading.value = false
  }
}

function abrirModalEdicao(contato: Contato) {
  contatoParaEditar.value = { ...contato }
  modalAberto.value = true
}

async function salvarEdicao() {
  if (!contatoParaEditar.value) return
  
  try {
    const { id, nome, email } = contatoParaEditar.value // ← só 3 campos
    await uptadeContato(id, nome, email) // ← 3 argumentos
    await carregarContatos()
    fecharModal()
  } catch (error) {
    console.error('Erro ao salvar:', error)
  }
}

async function deletarContato(id: number) {
  if (!confirm('Tem certeza que deseja deletar este contato?')) return
  
  try {
    await deletecontatoByid(id)
    await carregarContatos()
  } catch (error) {
    console.error('Erro ao deletar:', error)
  }
}

function fecharModal() {
  modalAberto.value = false
  contatoParaEditar.value = null
}

onMounted(carregarContatos)
</script>

<style scoped>
.contato-item {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
}

.modal input {
  display: block;
  margin: 10px 0;
  padding: 8px;
  width: 100%;
}
</style>