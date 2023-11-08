var totalEntradas =0 
var totalSaidas =0 
var saldo =0 

const abrirformulario = () => {
    document.getElementById('tabela').classList.add('d-none')
    document.getElementById('formulario').classList.remove('d-none')
}
const formatarValor =(valor) =>{
    var valor = valor
    valor =parseFloat(valor).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    return String(valor)
}
const fecharFormulario = () => {    
    totalEntradas =0 
    totalSaidas =0 
    saldo =0 
    atualizarTabela()
    document.getElementById('tabela').classList.remove('d-none')
    document.getElementById('formulario').classList.add('d-none')
    limparFormulario()
}
const limparFormulario = () => {
    // const fields = document.querySelectorAll('.valor')
    // fields.forEach(field => field.value = "0")
    document.getElementById('valor').value=0
    document.getElementById('quantidade').dataset.index = 'new'
}
const deletarDados = () => {
    const response = confirm(`Deseja realmente excluir toda a tabela?`)
        if (response) {
            localStorage.setItem('db_registro_cotacao', JSON.stringify([]))
            atualizarTabela()
        }    
}
const lerRegistro = () => getArmazenamentoLocal()
const getArmazenamentoLocal = () => JSON.parse(localStorage.getItem('db_registro_cotacao')) ?? []
const setArmazenamentoLocal = (dbregistro) => {
    localStorage.setItem("db_registro_cotacao", JSON.stringify(dbregistro))
}
const criar = (documento) => {
    const dbregistro = lerRegistro()
    dbregistro.push (documento)
    setArmazenamentoLocal(dbregistro)
}
const limpaTabela = () => {
    const rows = document.querySelectorAll('#tabela>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}
const atualizarTabela = () => {
    const dbregistro = lerRegistro()
    limpaTabela()
    dbregistro.forEach(criarLinha)
}
const criarLinha = (documento, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td >
    
        <a type="button" class="btn btn-link"  id="edit-${index}" >
        ${formatarValor(documento.valor)}
        </a>
    </td>
    <td>${(documento.quantidade)}</td>    
    <td>${formatarValor(documento.valor/documento.quantidade)}</td>
    `
    document.querySelector('#tabela>tbody').appendChild(newRow)
}
const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}
const atualizar = (index, documento) => {
    const dbregistro = lerRegistro()
    dbregistro[index] = documento
    setArmazenamentoLocal(dbregistro)
}
const salvarFormulario = () =>{
    // debugger
    if (isValidFields()) {
        const documento = {
            quantidade: document.getElementById('quantidade').value,
            valor: document.getElementById('valor').value,
        }
        const index = document.getElementById('valor').dataset.index
        if (index == 'new') {
            criar(documento)
            atualizarTabela()
            fecharFormulario()
        } else {
            atualizar(index, documento)
            atualizarTabela()
            fecharFormulario()
        }
    }
}
const setDadosFormulario = (registro) => {
    document.getElementById('valor').value = registro.valor
    document.getElementById('quantidade').value = registro.quantidade
}
const editarRegistro = (index) => {
    const documento = lerRegistro()[index]
    documento.index = index
    setDadosFormulario(documento)
    abrirformulario()
}
const deletarRegistro = (index) => {
    const dbregistro = lerRegistro()
    dbregistro.splice(index, 1)
    setArmazenamentoLocal(dbregistro)
}
const editarDeletar = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')
        if (action == 'edit') {
            editarRegistro(index)
        } else if (action == 'delete') {
            const funcionario = lerRegistro()[index]
            const response = confirm(`Deseja realmente excluir o registro`)
            if (response) {
                deletarRegistro(index)
                atualizarTabela()
            }
        } 
    }
}
document.getElementById('adicionar')
.addEventListener('click', abrirformulario)


document.getElementById('cancelar')
.addEventListener('click', fecharFormulario)

document.getElementById('salvar')
.addEventListener('click', salvarFormulario)

document.querySelector('#tabela>tbody').addEventListener('click', editarDeletar)

document.getElementById('zerar')
.addEventListener('click', deletarDados)
atualizarTabela() 