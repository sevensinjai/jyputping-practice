'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LyricArray, filterSettingInterface } from '../../page';

export interface LyricsContainer {
  lyrics: LyricArray;
  currentIndex: number;
  wrongIndex: number[];
  mode: string;
  filter: filterSettingInterface;
}
interface renderLyricContainerInterface {
  lyrics: LyricArray;
  currentIndex: number;
  wrongIndex: number[];
  sideLimit: number;
  filter: filterSettingInterface;
  mode: string;
}

const RenderLyricContainer: React.FC<renderLyricContainerInterface> = ({ lyrics, currentIndex, wrongIndex, sideLimit, filter, mode }) => {
  const lyricContainers = [];
  for (let i = currentIndex - sideLimit; i <= currentIndex + sideLimit; i++) {
    if (i >= 0 && i < lyrics.length) {
      const lyric = lyrics[i];
      const valueColor = i == currentIndex ? 'black' : 'grey';
      let answer = lyric.full;
      switch (mode) {
        case 'onset':
          answer = lyric.onset;
          break;
        case 'final':
          answer = lyric.final;
          break;
        default:
          break;
      }

      let shouldAnswerBeFiltered = false;
      const finalEntries = Object.entries(filter.final);
      const selectedFinal = finalEntries.map((entry: any) => { return entry[1]; }).flat(1);
      if (selectedFinal.indexOf(answer) < 0) {
        shouldAnswerBeFiltered = true;
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
            {wrongIndex.includes(i) ? <div style={{ color: 'red' }}> {answer}</div> :
              i < currentIndex ?
                <><div style={{ color: 'blue' }}> {answer}</div></> : !shouldAnswerBeFiltered ? <><div style={{ color: 'grey' }}> {answer}</div></> :
                  answer.split("").map((i) => {
                    return '.';
                  })}
          </Typography>
          <Typography variant="h3" component="div" gutterBottom style={{ color: valueColor }}>
            {lyric.value}
          </Typography>
        </Box>
      );
    }
  }
  return lyricContainers;

};

export const LyricsContainer: React.FC<LyricsContainer> = ({ lyrics, currentIndex, wrongIndex, mode, filter }) => {
  const sideLimit = 4;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      <RenderLyricContainer
        lyrics={lyrics}
        currentIndex={currentIndex}
        wrongIndex={wrongIndex}
        sideLimit={sideLimit}
        filter={filter}
        mode={mode}
      />
      {/* wrong count indicator */}
    </Box>
  );
};
