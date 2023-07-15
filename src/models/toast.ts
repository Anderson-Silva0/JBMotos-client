import toastr from "toastr"
import 'react-confirm-alert/src/react-confirm-alert.css'
import { confirmAlert } from 'react-confirm-alert'

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "showDuration": 300,
  "hideDuration": 1000,
  "timeOut": 12000,
  "extendedTimeOut": 4000,
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

export function mostrarMensagem(titulo: string, mensagem: string, tipo: ToastrType) {
  toastr[tipo](mensagem, titulo)
}

export function mensagemErro(mensagem: string) {
  mostrarMensagem('Erro', mensagem, 'error')
}

export function mensagemSucesso(mensagem: string) {
  mostrarMensagem('Sucesso', mensagem, 'success')
}

export function mensagemAlerta(mensagem: string) {
  mostrarMensagem('Alerta', mensagem, 'warning')
}

export function confirmarDelecao(callback: () => void) {
  confirmAlert({
    title: 'Excluir Cliente',
    message: 'Ao deletar este cliente, todas as informações relacionadas a ele serão permanentemente removidas do sistema, incluindo o endereço cadastrado e quaisquer motocicletas associadas. Além disso, todas as vendas feitas para este cliente serão excluídas permanentemente. Por favor, tenha certeza antes de confirmar a exclusão do cliente, pois essa ação não poderá ser desfeita. Deseja realmente deletar?',
    buttons: [
      {
        label: 'Sim',
        onClick: callback
      },
      {
        label: 'Não',
        onClick: () => { }
      }
    ]
  })
}

