import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { filterSettingInterface } from '../../mc/page';
const filterSetting: filterSettingInterface = require('../../data/filterSetting.json')

type nThongToVowelType = {
    [key: string]: string;
}

const nThongToVowel: nThongToVowelType = Object.entries(filterSetting.final).reduce((acc, cur) => {
    const key = cur[0]
    const value = cur[1]
    const result = value.reduce((acc, cur) => {
        return {
            ...acc,
            [cur]: key
        }
    }, {})
    return {
        ...acc,
        ...result,
    }
}, {})


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    cursor: 'pointer',
}));

interface IOptionContainer {
    answer: string;
    onWrongClicked: () => void;
    onAnswerClicked: () => void;
}

type Option = string | boolean;

export const OptionContainer = ({ answer, onAnswerClicked, onWrongClicked }: IOptionContainer) => {
    const handleOnAnswerClicked = (option: Option[]) => {
        if (option[1]) {
            onAnswerClicked()
        } else {
            onWrongClicked()
        }
    }

    const generateOptions = (answer: string): Option[][] => {
        const vowel = nThongToVowel[answer]
        const siblings = filterSetting.final[vowel].filter((v: string) => v !== answer)
        const shuffledOptions = siblings.sort(() => Math.random() - 0.5)
        const options = shuffledOptions.slice(0, 3).map((v: string) => [v, false])
        const optionsWithAnswer = [
            ...options,
            [answer, true]
        ]
        const shuffledOptionsWithAnswer = optionsWithAnswer.sort(() => Math.random() - 0.5)
        return shuffledOptionsWithAnswer
    }

    return (
        <Grid container spacing={2} sx={{
            width: '80%',
            margin: 'auto',
            marginBottom: '20px',
        }}>

            {
                generateOptions(answer).map((option: Option[], index: number) => {
                    return (
                        <Grid item xs={6} key={index + '_' + option[0]} onClick={() => handleOnAnswerClicked(option)} >
                            <Item suppressHydrationWarning>{option[0]}</Item>
                        </Grid>
                    )
                }
                )
            }

        </Grid>
    )
}