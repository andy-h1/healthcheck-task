import QuestionairePage from "./routes/QuestionairePage";
import { QuestionaireProvider } from "./context/QuestionaireContext";

const App = () => {
  return (
    <QuestionaireProvider>
      <QuestionairePage />;
    </QuestionaireProvider>
  );
};
export default App;
