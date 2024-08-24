import { createGlobalStyle } from "styled-components";

export default createGlobalStyle `
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Roboto', san-serif; 
    }
    
    text[data-width="230"] {
        font-size: 20px !important;
        font-weight: bold !important;
        transform: translate(30px, -35px);
        
    }

    use[data-ctrl-n-menu-id] {
        transform: translate(-100px, -90px);
        fill: #000000 !important; 
    }
}
`