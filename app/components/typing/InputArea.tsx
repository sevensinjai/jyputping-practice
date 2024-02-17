'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { lyric } from '../../page';

export interface InputArea {
  lyric: lyric;
  mode: string;
  callback: () => void;
  wrongCallback: () => void;
}
export const InputArea: React.FC<InputArea> = ({ lyric, mode, callback, wrongCallback }) => {
  const [wrongCount, setWrongCount] = useState(0);
  const maxWrongCount = 3;
  const myCallback = (event: any) => {
    if (event.keyCode == 13) {
      event.preventDefault(); // prevent default on enter key pressed behavior

      switch (mode) {
        case 'full':
          if (event.target.value == lyric.full) {
            event.target.value = "";
            setWrongCount(0);
            callback();
          } else {
            myWrongCallback(wrongCount, event);
          }
          break;
        case 'onset':
          if (event.target.value == lyric.onset) {
            event.target.value = "";
            setWrongCount(0);
            callback();
          } else {
            myWrongCallback(wrongCount, event);
          }
          break;
        case 'final':
          if (event.target.value == lyric.final) {
            event.target.value = "";
            setWrongCount(0);
            callback();
          } else {
            myWrongCallback(wrongCount, event);
          }
          break;
        default:
          break;
      }
    }
  };
  const myWrongCallback = (wrongCount: number, event: any) => {
    if (wrongCount < maxWrongCount) {
      setWrongCount(wrongCount + 1);
    } else {
      wrongCallback();
      setWrongCount(0);
    }
  };

  const renderWrongCountDot = (wrongCount: number) => {
    return new Array(wrongCount).fill(".");
  };
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
        onKeyDown={myCallback} />
      <Typography variant="h6" component="div" gutterBottom style={{ color: 'grey', width: '100%' }}>
        {renderWrongCountDot(wrongCount)}
      </Typography>
    </Box>
  );
};
