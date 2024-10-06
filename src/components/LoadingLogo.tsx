import Image from "next/image";
import spinnerGif from '@/images/Spinner.gif';
import logoServipex from '@/images/LOGO_SERVIPEX.png';

export default function LoadingLogo() {

    return (
        <div style={{ position: 'relative' }}>
            <Image src={spinnerGif}
                height={280}
                width={280}
                alt=""
            />
            <Image style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '8px' }}
                src={logoServipex}

                height={54}
                width={60}
                alt=""
            />
        </div>
    )
}