import appConfig from '../config.json'

function GlobalStyle() {
  return (
    <style global jsx>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
      }

      body {
        font-family: sans-serif;
        background: ${appConfig.theme.colors.neutrals[800]};
      }

      html,
      body,
      #__next {
        min-height: 100vh;
        display: flex;
        flex: 1;
      }

      #__next {
        flex: 1;
      }

      #__next > * {
        flex: 1;
      }

      h2 {
        color: ${appConfig.theme.colors.neutrals[300]};
      }
      input {
      }
    `}</style>
  )
}

export default function myApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  )
}
