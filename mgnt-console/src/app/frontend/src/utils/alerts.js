import swal from 'sweetalert2'

export const swalAlert = (title, message, cb) =>
  swal({
    title: title,
    text: message,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, please'
  }).then(cb)
