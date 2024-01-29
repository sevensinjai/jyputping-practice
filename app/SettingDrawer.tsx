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
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

const defaultFilterSetting: any = require('./filterSetting.json')


interface FinalFilter {
    i: boolean,
    yu: boolean,
    u: boolean,
    e: boolean,
    eot: boolean,
    oe: boolean,
    o: boolean,
    a: boolean,
    aa: boolean
}
interface FilterSetting {
    final: FinalFilter
}

export default function SimpleDialogContainer({
    onResumeCallback, onModeChangeCallback, currentIndex, currentMode, maxIndex, onFilterChangeCallback
}: { onResumeCallback: (index: number) => void, onModeChangeCallback: (mode: string) => void, currentIndex: number, currentMode: string, maxIndex: number, onFilterChangeCallback: (filter: any) => void }) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState(currentMode)
    const [resumeIndex, setResumeIndex] = useState(currentIndex)
    const [filterState, setFilterState] = useState<FilterSetting>({
        final: {
            i: true,
            yu: true,
            u: true,
            e: true,
            eot: true,
            oe: true,
            o: true,
            a: true,
            aa: true
        }
    })

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

    const handleOnFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const final = event.target.name.split('_')[1] as keyof FinalFilter
        const newFilterFinalState = { ...filterState.final, [final]: !filterState.final[final] }
        const newFilterState = { ...filterState, final: newFilterFinalState }

        setFilterState(newFilterState)
        if (onFilterChangeCallback) {
            onFilterChangeCallback(newFilterState)
        }
    }

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
                    <Typography id="filter" component={'div'} gutterBottom>
                        Masked Final Setting
                    </Typography>
                    <FormControl component="fieldset" variant="standard">
                        {/* <FormLabel component="legend">Assign responsibility</FormLabel> */}
                        <FormGroup>
                            <Container>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={filterState['final']['i']} onChange={handleOnFilterChange} name="final_i" />
                                    }
                                    label="i"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={filterState['final']['yu']} onChange={handleOnFilterChange} name="final_yu" />
                                    }
                                    label="yu"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={filterState['final']['u']} onChange={handleOnFilterChange} name="final_u" />
                                    }
                                    label="u"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={filterState['final']['e']} onChange={handleOnFilterChange} name="final_e" />
                                    }
                                    label="e"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={filterState['final']['eot']} onChange={handleOnFilterChange} name="final_eot" />
                                    }
                                    label="eot"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={filterState['final']['oe']} onChange={handleOnFilterChange} name="final_oe" />
                                    }
                                    label="oe"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={filterState['final']['o']} onChange={handleOnFilterChange} name="final_o" />
                                    }
                                    label="o"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={filterState['final']['a']} onChange={handleOnFilterChange} name="final_a" />
                                    }
                                    label="a"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={filterState['final']['aa']} onChange={handleOnFilterChange} name="final_aa" />
                                    }
                                    label="aa"
                                />
                            </Container>
                        </FormGroup>
                    </FormControl>
                </Container>
            </Drawer>
        </div>
    );
}
