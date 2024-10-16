import Swal from "sweetalert2";


const Alerts = (mensaje, type) => {

    const alertas = (mensaje, type) => {
        Swal.fire({
            title: mensaje,
            icon: type,
            timer: 4000,
            timerProgressBar: true,
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            showCloseButton: true,
        });;
    }

    return (
        alertas(mensaje, type)
    );

};

export default Alerts;