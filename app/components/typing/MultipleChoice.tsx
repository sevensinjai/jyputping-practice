'use client';

import { FormGroup } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';
import React, { useState } from 'react';

export interface MultipleChoiceContainerInterface {
    onChange: (selected: string[]) => void
}


export const MultipleChoice: React.FC<MultipleChoiceContainerInterface> = ({
    onChange,
}) => {
    const [selected, setSelected] = useState<string[]>([])
    const options = ['onset', 'final', 'tone']
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    }
    return (
        <FormGroup>
            {options.map((option) => (
                <FormControlLabel
                    key={option}
                    control={<Checkbox checked={selected.includes(option)} onChange={handleChange} value={option} />}
                    label={option}
                />
            ))}
        </FormGroup>
    );
}
