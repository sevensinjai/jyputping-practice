'use client'

import { useState } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SettingDialog from './SettingDialog';

// read json file

interface lyric {
  full: string;
  value: string;
  onset: string;
  final: string;
  tone: string;
}
interface LyricArray extends Array<lyric> { };

const lyrics: LyricArray = require('./lyrics.json')

interface LyricsContainer {
  lyrics: LyricArray;
  currentIndex: number;
  wrongIndex: number[];
}

interface renderLyricContainerInterface {
  lyrics: LyricArray;
  currentIndex: number;
  wrongIndex: number[];
  sideLimit: number;
}

const LyricsContainer: React.FC<LyricsContainer> = ({ lyrics, currentIndex, wrongIndex }) => {
  const sideLimit = 4;
  const renderLyricContainer: React.FC<renderLyricContainerInterface> = ({ lyrics, currentIndex, wrongIndex, sideLimit }) => {
    const lyricContainers = []
    for (let i = currentIndex - sideLimit; i <= currentIndex + sideLimit; i++) {
      if (i >= 0 && i < lyrics.length) {
        const lyric = lyrics[i]
        const valueColor = i == currentIndex ? 'black' : 'grey'
        lyricContainers.push(
          <Box
            key={'lyric_container_' + i}
            // horizontally aligns children
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" component="div" gutterBottom style={{ color: 'grey' }}>
              {
                wrongIndex.includes(i) ? <div style={{ color: 'red' }}> {lyric.full}</div> :
                  i < currentIndex ? <div style={{ color: 'green' }}> {lyric.full} </div> :
                    lyric.full.split("").map((i) => {
                      return '.'
                    })
              }
            </Typography>
            <Typography variant="h3" component="div" gutterBottom style={{ color: valueColor }}>
              {lyric.value}
            </Typography>
          </Box>
        )
      }
    }
    return lyricContainers

  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      {
        renderLyricContainer({ lyrics, currentIndex, wrongIndex, sideLimit })
      }
      {/* wrong count indicator */}
    </Box>
  )
}

interface InputArea {
  lyric: lyric;
  mode: string;
  callback: () => void;
  wrongCallback: () => void;
}
const InputArea: React.FC<InputArea> = ({ lyric, mode, callback, wrongCallback }) => {
  const [wrongCount, setWrongCount] = useState(0)
  const maxWrongCount = 3
  const myCallback = (event: any) => {
    if (event.keyCode == 13) {
      event.preventDefault(); // prevent default on enter key pressed behavior

      switch (mode) {
        case 'full':
          if (event.target.value == lyric.full) {
            event.target.value = ""
            setWrongCount(0)
            callback()
          } else {
            myWrongCallback(wrongCount, event)
          }
          break;
        case 'onset':
          if (event.target.value == lyric.onset) {
            event.target.value = ""
            setWrongCount(0)
            callback()
          } else {
            myWrongCallback(wrongCount, event)
          }
          break;
        case 'final':
          if (event.target.value == lyric.final) {
            event.target.value = ""
            setWrongCount(0)
            callback()
          } else {
            myWrongCallback(wrongCount, event)
          }
          break;
        default:
          break
      }
    }
  }
  const myWrongCallback = (wrongCount: number, event: any) => {
    if (wrongCount < maxWrongCount) {
      setWrongCount(wrongCount + 1)
    } else {
      wrongCallback()
      setWrongCount(0)
    }
  }

  const renderWrongCountDot = (wrongCount: number) => {
    return new Array(wrongCount).fill(".")
  }
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      flexDirection='row'
      justifyContent="center"
      alignItems="center"

    >
      <TextField id="outlined-basic" label={"jyutping - " + mode} variant="outlined"
        onKeyDown={myCallback}
      />
      <Typography variant="h6" component="div" gutterBottom style={{ color: 'grey', width: '100%' }}>
        {renderWrongCountDot(wrongCount)}
      </Typography>
    </Box>
  )
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [wrongIndex, setWrongIndex] = useState([] as number[])
  const [mode, setMode] = useState('full' as string)

  const maxLyricHistoryCount = 9
  const handleOnEnter: () => void = () => {
    if (currentIndex < lyrics.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }
  const handleOnWrong: () => void = () => {
    if (wrongIndex.length > maxLyricHistoryCount) {
      wrongIndex.shift()
    }
    const newWrongIndex = [...wrongIndex, currentIndex]
    setWrongIndex(newWrongIndex)
  }

  const filteredLyrics = lyrics.filter((lyric: any) => {
    return lyric.value != " "
  })
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh" // This makes sure the Box takes up the full height of the viewport
      >
        <Container maxWidth='sm' style={{ textAlign: 'center' }}>
          <Box sx={{ mb: 2 }}>
            <SettingDialog
              onResumeCallback={setCurrentIndex}
              onModeChangeCallback={setMode}
              currentIndex={currentIndex}
              currentMode={mode}
            />
          </Box>
          <LyricsContainer lyrics={filteredLyrics} currentIndex={currentIndex} wrongIndex={wrongIndex} />
          <InputArea lyric={filteredLyrics[currentIndex]} callback={handleOnEnter} wrongCallback={handleOnWrong} mode={
            mode
          } />
        </Container>
      </Box>
    </>

  )
}
