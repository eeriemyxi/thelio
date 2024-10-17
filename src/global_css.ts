import { css, cx, keyframes, Style } from "@hono/hono/css";

export const GLOBAL_CSS = css`
    :root {
        --gruvbox-dark: #282828;
        --gruvbox-light: #f2f0d5;
        --gruvbox-red: #fb4934;
        --gruvbox-green: #b8bb26;
        --gruvbox-yellow: #fabd2f;
        --gruvbox-blue: #458588;
        --gruvbox-purple: #968396;
        --gruvbox-orange: #fe8019;
        --gruvbox-cyan: #83a598;
        --gruvbox-red-darker: #ff3322;
    }
    html {
        font-family: Arial, Helvetica, sans-serif;
        background-color: var(--gruvbox-dark);
        color: var(--gruvbox-light);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    h1 {
        color: var(--gruvbox-cyan);
    }
    h1, .href-buttons, input[type="submit"] {
        display: flex;
        justify-content: center;
    }
    button, input[type="submit"] {
        background-color: var(--gruvbox-blue);
        border: none;
        color: var(--gruvbox-light);
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;  
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;  
    }
    button:hover, input[type="submit"]:hover {
        background-color: var(--gruvbox-red-darker);
    }
    input[type="text"] {
        padding: 8px;
        margin: 10 0 10 0px;
        border: 1px solid #ccc;
        border-radius: 0px;
        font-size: 16px;
    }
`;
export default { GLOBAL_CSS };
