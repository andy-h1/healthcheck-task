import { createContext, useState, useEffect } from "react";
import { QuestionaireType } from "../types/questionaire";

const QuestionaireContext = createContext <QuestionaireType | null>(null);

export const QuestionaireProvider = ({ children }: { children: React.ReactNode }) => {
    const [heartburnData, setHeartBurnData] = useState<QuestionaireType | null>(null);

    useEffect(() => {
        fetch('../data/questionaire.json')
        .then(response => response.json())
        .then((data) => setHeartBurnData(data));
    }, [])

    return (
        <QuestionaireContext.Provider value={heartburnData}>
            {children}
        </QuestionaireContext.Provider>
    )
}

