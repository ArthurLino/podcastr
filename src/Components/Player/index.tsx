import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../Contexts/PlayerContext';
import Slider from 'rc-slider'
import styles from './styles.module.scss';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    togglePlay, 
    setPlayingState,
    playNext,
    hasNext,
    playPrev,
    hasPrev,
    isLooping,
    toggleLooping,
    isShuffling,
    toggleShuffling,
    clearPlayerState,
  } = usePlayer()

  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!audioRef.current){
      return;
    }
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  function setupProgressiveListener() {
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount

    setProgress(amount)
  }

  function handleEpisodeEnded() {
    hasNext? playNext() : clearPlayerState()
  }

  const episode = episodeList[currentEpisodeIndex]

  return(
    <div className = {styles.playerContainer}>

      <header>
        <img src ="/playing.svg" alt="playing now"/>
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
          <div className = {styles.currentEpisode}>

            <Image
              width={592}
              height={592}
              src={episode.thumbnail}
              objectFit="cover"
            />

            <strong>{episode.title}</strong>
            <span>{episode.members}</span>

          </div>
        ) 
        : 
        (
          <div className = {styles.emptyPlayer}>

            <strong> Selecione um podcast para ouvir </strong>

          </div>
        ) 
      }

      <footer className={ episode ? '' : styles.empty}>

        <div className = {styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>

        { episode && 
        ( 
          <audio 
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            autoPlay
            onEnded={handleEpisodeEnded}
            onPlay={ () => setPlayingState(true) }
            onPause={ () => setPlayingState(false) }
            onLoadedMetadata={setupProgressiveListener}
          />
        ) 
        }        

          <div className = {styles.slider}>

            { episode ? 
              (
                <Slider 
                  max={episode.duration}
                  value={progress}
                  onChange={handleSeek}
                  trackStyle={{backgroundColor: '#04d361'}}
                  railStyle={{backgroundColor: '#9f75ff'}}
                  handleStyle={{borderColor: '#04d361', borderWidth: 4}}
                />
              ) 
              : 
              ( <div className = {styles.emptySlider} /> )
            }

          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>

        </div>

        <div className = {styles.buttons}>

          <button 
          type="button" 
          disabled={!episode || episodeList.length === 1}
          onClick={toggleShuffling}
          className={isShuffling? styles.isActive : ''}
          >
            <img src ="/shuffle.svg" alt="shuffle" />
          </button>

          <button type="button" disabled={!episode || !hasPrev} onClick={playPrev}>
            <img src ="/play-previous.svg" alt="play prev" />
          </button>
          
          <button 
          className={styles.playButton} 
          type="button" 
          disabled={!episode}
          onClick={togglePlay}
          >
            { isPlaying ? 
              (<img src ="/pause.svg" alt="play" />)
              :
              (<img src ="/play.svg" alt="play" />)
            }
          </button>

          <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
            <img src ="/play-next.svg" alt="play next" />
          </button>

          <button 
          type="button" 
          disabled={!episode}
          onClick={toggleLooping}
          className={isLooping? styles.isActive : ''}
          >
            <img src ="/repeat.svg" alt="repeat" />
          </button>

        </div>

      </footer>

    </div>
  )
}