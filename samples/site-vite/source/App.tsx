import React, { Fragment } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import BG from "dummy/assets/images/backgrounds/christma.jpeg";
import ASSESTANT from "dummy/assets/icons/inkore/NodejsLibrary_1024.png";
import DUMMYTXT from "dummy/assets/static/dummy.txt";
import viteLogo from '/vite.svg';
import FONT from "dummy/assets/fonts/pacifico/Pacifico-Regular.ttf";

import { Global } from "@emotion/react";

const DOCS_SITE = "https://docs.inkore.net/assestant";

const App: React.FunctionComponent<{ }> = () =>
{
    return (
        <Fragment>
            <Global styles=
                {{
                    'body': 
                    {
                        backgroundImage: `url("${BG.src}")`,
                        backgroundAttachment: "fixed",
                        fontFamily: "I Do Not Know",
                    },

                    '@font-face':
                    {
                        fontFamily: "I Do Not Know",
                        src: `url("${FONT.src}") format("truetype")`,
                    }
                }}/>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href={DOCS_SITE} target="_blank">
                    <img src={ASSESTANT.src} className="logo inko" alt="Assestant from iNKORE Open Source" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Assestant with Vite</h1>
            <div className="card">
                <a href={DUMMYTXT.src} download="LUV-LETTER.txt">
                    <button>
                        Let's download somethin!
                    </button>
                </a>
                <p>
                    Now you can ship your assets along with your NPM package with Assesant!
                </p>
            </div>
            <a href={DOCS_SITE}>
                <p className="read-the-docs">
                    Click on the Vite and React logos to learn more
                </p>
            </a>
        </Fragment>
    )
}

export default App
