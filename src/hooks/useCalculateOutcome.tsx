import { useEffect, useState } from 'react';
import { QuestionType, OutcomeType } from '../types/questionaire.types';

const useCalculateOutcome = (
    questions: QuestionType[],
    currentScore: number,
    outcomes: OutcomeType[]
) => {
    const [outcome, setOutcome] = useState<OutcomeType | null>(null);

    useEffect(() => {
        if (questions.length === 0) return;

        // Assumption that next.outcomes will always exist in the last question object
        const lastQuestion = questions[questions.length - 1];
        const possibleOutcomes = lastQuestion.next.filter(
            (item) => item.max_score !== undefined || item.outcome !== undefined
        );

        const relevantOutcome = possibleOutcomes.find(
            (item) =>
                item.max_score === undefined || currentScore <= item.max_score
        );

        if (relevantOutcome) {
            const outcomeDetails = outcomes.find(
                (o) => o.id === relevantOutcome.outcome
            );
            setOutcome(outcomeDetails || null);
        }
    }, [questions, currentScore, outcomes]);

    return outcome;
};

export default useCalculateOutcome;
