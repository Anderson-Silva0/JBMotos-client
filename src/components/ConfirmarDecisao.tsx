import '@/styles/confirmarDecisao.css'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

export function ConfirmarDecisao(titulo: string, mensagem: string, callback: () => void) {
    confirmAlert({
        customUI: ({ onClose }) => (
            <div className='confirm-custom-ui'>
                <h1>{titulo}</h1>
                <hr className='hr-line'/>  
                <p>{mensagem}</p>
                <button
                    onClick={() => {
                        callback()
                        onClose()
                    }}
                >
                    Sim
                </button>
                <button
                    className="cancel"
                    onClick={onClose}
                >
                    Não
                </button>
            </div>
        ),
        overlayClassName: 'confirm-overlay'
    })
}