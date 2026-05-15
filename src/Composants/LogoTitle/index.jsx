import React from "react";
import './logotitle.scss';
import Logotitle from "../../img/titre.png"

const LogoTitle = () => {
    return (
        <div className="logo-title">
            <img src={Logotitle} alt="Logotitle" />
        </div>
    );
};

export default LogoTitle;