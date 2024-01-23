import { createContext, useState, useEffect } from "react";
import { QuestionaireType } from "../types/questionaire";

export const QuestionaireContext = createContext<QuestionaireType | null>(null);

export const QuestionaireProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [questionData, setQuestionData] = useState<QuestionaireType | null>(
    null
  );

  useEffect(() => {
    fetch("/data/questionaire.json?url")
      .then((response) => response.json())
      .then((data) => setQuestionData(data));
  }, []);

  return (
    <QuestionaireContext.Provider value={questionData}>
      {children}
    </QuestionaireContext.Provider>
  );
};
