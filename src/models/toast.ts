import toastr from "toastr"
import 'react-confirm-alert/src/react-confirm-alert.css'
import { confirmAlert } from 'react-confirm-alert'

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
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

export function confirmarDecisao(titulo: string, mensagem: string, callback: () => void) {
  confirmAlert({
    title: titulo,
    message: mensagem,
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

