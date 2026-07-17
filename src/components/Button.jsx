import { Link } from "react-router-dom";
import "./Button.css";

function Button({ className, text, icon, to, ...props }) {

    if (to) {
        return (
            <Link to={to} className={className}>
                {icon}
                {text}
            </Link>
        );
    }

    return (
        <button className={className} {...props}>
            {icon}
            {text}
        </button>
    );
}

export default Button;

