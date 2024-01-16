'use client'

import { useState, useMemo } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';

// read json file

interface lyric {
  answer: string;
  value: string;
}
interface LyricArray extends Array<lyric> { };

const lyrics: LyricArray = require('./lyrics.json')

interface LyricsContainer {
  lyrics: LyricArray;
  currentIndex: number;
  wrongIndex: number[];
}

const LyricsContainer: React.FC<LyricsContainer> = ({ lyrics, currentIndex, wrongIndex }) => {
  const sideLimit = 4;
  const renderLyricContainer = ({ lyrics, currentIndex, wrongIndex, sideLimit }) => {
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
                wrongIndex.includes(i) ? <div style={{ color: 'red' }}> {lyric.answer}</div> :
                  i < currentIndex ? <div style={{ color: 'green' }}> {lyric.answer} </div> :
                    lyric.answer.split("").map((i) => {
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
  callback: () => void;
  wrongCallback: () => void;
}
const InputArea: React.FC<InputArea> = ({ lyric, callback, wrongCallback }) => {
  const [wrongCount, setWrongCount] = useState(0)
  const maxWrongCount = 3
  const myCallback = (event: any) => {
    if (event.keyCode == 13) {
      event.preventDefault(); // prevent default on enter key pressed behavior
      if (event.target.value == lyric.answer) {
        event.target.value = ""
        setWrongCount(0)
        callback()
      } else {
        myWrongCallback(wrongCount, event)
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
      <TextField id="outlined-basic" label="jyutping" variant="outlined"
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

  const handleResume: (event: any) => void = (event) => {
    if (event.keyCode == 13) {
      event.preventDefault(); // prevent default on enter key pressed behavior
      const value = parseInt(event.target.value)
      if (value < lyrics.length) {
        setCurrentIndex(value)
        setWrongIndex([])
      }
    }
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
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField id="outlined-basic" label="Resume to..." variant="outlined"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onKeyDown={handleResume}
            />
          </Box>
          <LyricsContainer lyrics={filteredLyrics} currentIndex={currentIndex} wrongIndex={wrongIndex} />
          <InputArea lyric={filteredLyrics[currentIndex]} callback={handleOnEnter} wrongCallback={handleOnWrong} />
        </Container>
      </Box>
    </>

  )
}
