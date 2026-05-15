import logoImage from "../../img/logo512.png"
import "./logo.scss"



export default function Logo() {
    return (
        <div className="logo">
            <img src={logoImage} alt="Logo" />
        </div>
    )
}   
