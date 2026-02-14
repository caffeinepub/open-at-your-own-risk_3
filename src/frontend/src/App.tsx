import { useState } from 'react';
import OpeningScreen from './components/valentine/OpeningScreen';
import YesTransition from './components/valentine/YesTransition';
import FinalCelebrationScreen from './components/valentine/FinalCelebrationScreen';

type Screen = 'opening' | 'transition' | 'celebration';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('opening');

  const handleYesClick = () => {
    setCurrentScreen('transition');
  };

  const handleTransitionComplete = () => {
    setCurrentScreen('celebration');
  };

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {currentScreen === 'opening' && (
        <OpeningScreen onYesClick={handleYesClick} />
      )}
      {currentScreen === 'transition' && (
        <YesTransition onComplete={handleTransitionComplete} />
      )}
      {currentScreen === 'celebration' && (
        <FinalCelebrationScreen />
      )}
    </div>
  );
}

export default App;
