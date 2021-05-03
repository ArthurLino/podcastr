import { GetStaticProps } from 'next'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import homeStyles from './home.module.scss'
import { usePlayer } from '../Contexts/PlayerContext'

type Episode = {
    id: string,
    title: string,
    thumbnail: string, 
    members: string,
    publishedAt: string,
    durationAsString: string,
    duration: number,
    url: string,
} 

type HomeProps = {
  allEps: Episode[],
  latestEps: Episode[],
}

export default function Home({latestEps, allEps}: HomeProps) {
  const { playList } = usePlayer()

  const episodeList = [...latestEps, ...allEps]
  
  return(
    <div className={homeStyles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={homeStyles.latestEpisodes}>

        <h2>Últimos Lançamentos</h2>

        <ul>
          {latestEps.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title} 
                  objectFit="cover"
                />

                <div className={homeStyles.episodeDetails}>
                  <Link href={`/episode/${episode.id}`}>
                    <a>{episode.title}</a>  
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                
                <button type="button" onClick={ () => playList(episodeList, index) }>
                  <img src="/play-green.svg" alt="play episode"/>
                </button>

              </li>
            )
          })}
        </ul>

      </section>

      <section className={homeStyles.allEpisodes}>
        <h2>Episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEps.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style = { {width: 72} }>
                    <Image
                      width={120} 
                      height={120} 
                      src={episode.thumbnail} 
                      alt={episode.title} 
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episode/${episode.id}`}>
                      <a>{episode.title}</a>  
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style = { {width: 100} }>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                  <button type="button" onClick={ () => playList(episodeList, index + latestEps.length) }>
                      <img src="/play-green.svg" alt="play episode"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
    const { data } = await api.get('episodes', {
      params: { 
        _limit: 12,
        _sort: 'published_at',
        _order: 'desc',
      }
    })

    const episodes = data.map(episode => {
      return {
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail,
        members: episode.members,
        publishedAt: format(parseISO(episode.published_at), 'd, MMM yy', {locale: ptBR}),
        duration: Number(episode.file.duration),
        durationAsString:  convertDurationToTimeString(Number(episode.file.duration)),
        url: episode.file.url,
      }
    })
    
    const latestEps = episodes.slice(0, 2)
    const allEps = episodes.slice(2, episodes.length)

    return {
      props: {
        latestEps,
        allEps,
      },
      revalidate: 60 * 60 * 8
    }
}