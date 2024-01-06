import data from '../data/questionaire.json';

interface QuestionsType {
    id: string,
    question_text: string,
    answers: Array<Answers>,
    next: Array<NextQuestions>
}

interface Answers {
    id: string,
    label: string,
    score: number
}

interface NextQuestions {
    answered: string,
    next_question: string,
}

export const Home = () => {

    const { questions, outcomes } = data;
    console.log(questions[0]);

    const Questionaire: Array<QuestionsType> = questions.map((question) => {
        return (
            <div key={question.id}>
                <h1>{question.question_text}</h1>
            </div>
        )}
        )


return <>
<div> 
    <h1>Home</h1>
    <p>Home page content</p>
    {questions.map((question) => {
        return (
            <h1 key={question.id}>
                {question.question_text}
            </h1>
        );
    })}
</div>
</>
}
