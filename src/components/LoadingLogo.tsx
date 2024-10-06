import Image from "next/image";
import spinnerGif from '@/images/Spinner.gif';
import logoServipex from '@/images/LOGO_SERVIPEX.png';

interface LoadingLogoProps {
    descricao: string
}

export default function LoadingLogo({ descricao }: LoadingLogoProps) {

    return (
        <div id="container-loading">
            <Image src={spinnerGif}
                height={280}
                width={280}
                alt=""
            />
            <Image className="content-loading"
                src={logoServipex}
                height={54}
                width={60}
                alt=""
            />
            <p className="content-loading-desc">{descricao}</p>
        </div>
    )
}