import { createContext, ReactNode, useContext, useState } from 'react'

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[]
  currentEpisodeIndex: number
  isPlaying: boolean
  play: (episode: Episode) => void
  playNext: () => void
  playPrev: () => void
  playList: (list: Episode[], index: number) => void
  togglePlay: () => void
  toggleLooping: () => void
  setPlayingState: (state: boolean) => void
  toggleShuffling: () => void
  clearPlayerState: () => void
  hasPrev: boolean
  hasNext: boolean
  isLooping: boolean
  isShuffling: boolean
}

type PlayerContextProviderProps = {
  children: ReactNode,
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  
  const [episodeList, setEpList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function play(episode: Episode) {
    setEpList([episode])
    setCurrentEpIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number) {
    setEpList(list)
    setCurrentEpIndex(index)
    setIsPlaying(true)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function toggleLooping() {
    setIsLooping(!isLooping)
  }

  function toggleShuffling() {
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  const hasPrev = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

  function playNext() {
    if(hasNext) {
      setCurrentEpIndex(currentEpisodeIndex + 1)
    }
    else if (isShuffling) {
      const nextRandomEpIndex = Math.floor(Math.random() * episodeList.length)

      setCurrentEpIndex(nextRandomEpIndex)
    }
  }

  function playPrev() {
    if(hasPrev) {
      setCurrentEpIndex(currentEpisodeIndex - 1)
    }
  }

  function clearPlayerState() {
    setEpList([])
    setCurrentEpIndex(0)
  }


  return (

    <PlayerContext.Provider value={{
      episodeList, 
      currentEpisodeIndex, 
      isPlaying, 
      play, 
      playPrev,
      hasPrev,
      playNext,
      hasNext,
      playList,
      togglePlay,
      isLooping,
      toggleLooping,
      setPlayingState,
      isShuffling, 
      toggleShuffling,
      clearPlayerState,
      }}
    >

      {children}

    </PlayerContext.Provider>
  )
}

export const PlayerContext = createContext({} as PlayerContextData);

export const usePlayer = () => {
  return useContext(PlayerContext)
}