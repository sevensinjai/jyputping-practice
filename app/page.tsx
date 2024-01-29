'use client'

import { useState } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SettingDrawer from './SettingDrawer';

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
interface filterSetting {
  onset: boolean[];
  final: {
    [key: string]: string[];
  };
}

const filterSetting: filterSetting = require('./filterSetting.json')

interface LyricsContainer {
  lyrics: LyricArray;
  currentIndex: number;
  wrongIndex: number[];
  mode: string;
  filter: filterSetting;
}

interface renderLyricContainerInterface {
  lyrics: LyricArray;
  currentIndex: number;
  wrongIndex: number[];
  sideLimit: number;
  filter: filterSetting;
}

const LyricsContainer: React.FC<LyricsContainer> = ({ lyrics, currentIndex, wrongIndex, mode, filter }) => {
  const sideLimit = 4;
  const renderLyricContainer: React.FC<renderLyricContainerInterface> = ({ lyrics, currentIndex, wrongIndex, sideLimit, filter }) => {
    const lyricContainers = []
    for (let i = currentIndex - sideLimit; i <= currentIndex + sideLimit; i++) {
      if (i >= 0 && i < lyrics.length) {
        const lyric = lyrics[i]
        const valueColor = i == currentIndex ? 'black' : 'grey'
        let answer = lyric.full
        switch (mode) {
          case 'onset':
            answer = lyric.onset
            break;
          case 'final':
            answer = lyric.final
            break;
          default:
            break;
        }

        let shouldAnswerBeFiltered = false
        const finalEntries = Object.entries(filter.final)
        const selectedFinal = finalEntries.map((entry: any) => { return entry[1] }).flat(1)
        if (selectedFinal.indexOf(answer) < 0) {
          shouldAnswerBeFiltered = true
        }

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
                wrongIndex.includes(i) ? <div style={{ color: 'red' }}> {answer}</div> :
                  i < currentIndex ?
                    <><div style={{ color: 'blue' }}> {answer}</div></> : !shouldAnswerBeFiltered ? <><div style={{ color: 'grey' }}> {answer}</div></> :
                      answer.split("").map((i) => {
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
        renderLyricContainer({ lyrics, currentIndex, wrongIndex, sideLimit, filter })
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
  const [currentFilter, setCurrentFilter] = useState(filterSetting as filterSetting)

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

  const handleOnFilterChange: (e: any) => void = (e) => {
    const finalEntries = Object.entries(e.final)
    const selectedFinal = finalEntries.filter((entry: any) => {
      return entry[1] == true
    })
    const selectedFinalInObject = selectedFinal.reduce((acc, cur) => {
      const key = cur[0]
      return {
        ...acc,
        [key]: filterSetting.final[key]
      }
    }, {})
    const newFilter = {
      onset: filterSetting.onset,
      final: selectedFinalInObject
    }
    setCurrentFilter(newFilter as filterSetting)

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
            <SettingDrawer
              onResumeCallback={setCurrentIndex}
              onModeChangeCallback={setMode}
              currentIndex={currentIndex}
              currentMode={mode}
              maxIndex={filteredLyrics.length}
              onFilterChangeCallback={handleOnFilterChange}
            />
          </Box>

          <LyricsContainer mode={mode} lyrics={filteredLyrics} currentIndex={currentIndex} wrongIndex={wrongIndex} filter={currentFilter} />
          <InputArea lyric={filteredLyrics[currentIndex]} callback={handleOnEnter} wrongCallback={handleOnWrong} mode={
            mode} />
          <Typography variant="body1" component="div" gutterBottom>
            {currentIndex + 1 + "/" + filteredLyrics.length}
          </Typography>
        </Container>
      </Box>
    </>

  )
}
