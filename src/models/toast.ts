import toastr from "toastr";

toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  showDuration: 300,
  hideDuration: 1000,
  timeOut: 12000,
  extendedTimeOut: 4000,
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

export function showMessage(title: string, message: string, type: ToastrType) {
  toastr[type](message, title);
}

export function errorMessage(message: string) {
  showMessage("Erro", message, "error");
}

export function successMessage(message: string) {
  showMessage("Sucesso", message, "success");
}

export function alertMessage(message: string) {
  showMessage("Alerta", message, "warning");
}
