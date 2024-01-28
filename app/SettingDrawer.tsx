import * as React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react'
import Drawer from '@mui/material/Drawer';



export default function SimpleDialogContainer({
    onResumeCallback, onModeChangeCallback, currentIndex, currentMode, maxIndex
}: { onResumeCallback: (index: number) => void, onModeChangeCallback: (mode: string) => void, currentIndex: number, currentMode: string, maxIndex: number }) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState(currentMode)
    const [resumeIndex, setResumeIndex] = useState(currentIndex)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
    };

    const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMode(event.target.value)
        if (onModeChangeCallback) {
            onModeChangeCallback(event.target.value)
        }
    }
    const handleResume = (event: Event, newValue: number | number[]) => {
        setResumeIndex(newValue as number)
        if (onResumeCallback) {
            onResumeCallback(newValue as number);
        }
    };
    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Open setting
            </Button>
            <Drawer
                anchor={'bottom'}
                open={open}
                onClose={handleClose}
            >
                <Container>
                    <Typography id="discrete-slider" component={'div'} gutterBottom>
                        Resume to position: {resumeIndex}
                    </Typography>
                    <Slider defaultValue={resumeIndex} value={resumeIndex} onChange={handleResume}
                        max={maxIndex - 1}
                    />
                    <Typography id="mode-selector" component={'div'} gutterBottom>
                        Mode
                    </Typography>
                    <FormControl>
                        <RadioGroup
                            row
                            name="row-radio-buttons-group"
                            onChange={handleModeChange}
                            defaultValue={mode}
                        >
                            <FormControlLabel value="full" control={<Radio />} label="Full 全部" />
                            <FormControlLabel value="onset" control={<Radio />} label="Onset(聲母)" />
                            <FormControlLabel value="final" control={<Radio />} label="Finals(韻母)" />
                        </RadioGroup>
                    </FormControl>
                </Container>
            </Drawer>
        </div>
    );
}
