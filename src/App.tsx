import { QuestionaireProvider } from "./context/QuestionaireContext";
import { QuestionairePage } from "./routes/QuestionairePage";

const App = () => {
  return (
    <QuestionaireProvider>
      <QuestionairePage />
    </QuestionaireProvider>
  );
};

export default App;
