const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sEspecialidade = document.querySelector('#m-especialidade');
const sCRM = document.querySelector('#m-crm');
const btnSalvar = document.querySelector('#btnSalvar');
const searchInput = document.querySelector('#searchInput'); // Campo de busca

let itens;
let id;

function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  if (edit) {
    sNome.value = itens[index].nome;
    sEspecialidade.value = itens[index].especialidade;
    sCRM.value = itens[index].crm;
    id = index;
  } else {
    sNome.value = '';
    sEspecialidade.value = '';
    sCRM.value = '';
  }
}

function editItem(index) {
  openModal(true, index);
}

function deleteItem(index) {
  itens.splice(index, 1);
  setItensBD();
  loadItens();
}

function insertItem(item, index) {
  let tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.especialidade}</td>
    <td>${item.crm}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

btnSalvar.onclick = e => {
  if (sNome.value == '' || sEspecialidade.value == '' || sCRM.value == '') {
    return;
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].nome = sNome.value;
    itens[id].especialidade = sEspecialidade.value;
    itens[id].crm = sCRM.value;
  } else {
    itens.push({ 'nome': sNome.value, 'especialidade': sEspecialidade.value, 'crm': sCRM.value });
  }

  setItensBD();
  modal.classList.remove('active');
  loadItens();
  id = undefined;
}

function loadItens() {
  itens = getItensBD();
  displayItems(itens); // Carrega os itens usando displayItems
}

// Função para exibir os itens (médicos) filtrados
function displayItems(items) {
  tbody.innerHTML = '';
  items.forEach((item, index) => {
    insertItem(item, index);
  });
}

// Função para filtrar os médicos conforme a busca
function searchItems() {
  const query = searchInput.value.toLowerCase();
  const filteredItems = itens.filter(item => 
    item.crm.toLowerCase().includes(query) || 
    item.especialidade.toLowerCase().includes(query)
  );
  displayItems(filteredItems);
}

// Escutador de eventos para atualizar a lista conforme o usuário digita
searchInput.addEventListener('input', searchItems);

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));

loadItens();
