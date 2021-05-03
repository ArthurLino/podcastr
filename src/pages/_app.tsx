import { Header } from '../Components/Header'
import { Player } from '../Components/Player'
import '../styles/global.scss'
import styles from '../styles/app.module.scss'
import { PlayerContextProvider } from '../Contexts/PlayerContext'

function MyApp({ Component, pageProps }) {
  return (

    <PlayerContextProvider>
      <div className={styles.wrapper}>
        
        <main>

          <Header />
          <Component {...pageProps} />

        </main>

        <Player />

      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
