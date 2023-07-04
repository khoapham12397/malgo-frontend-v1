import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Contest from './pages/Contest/Contest';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Rank from './pages/Rank/Rank';
import { Provider } from 'react-redux';
import store from './state';
import CodingProblems from './pages/CodingProblems/CodingProblems';
import { SingleCodingProblem } from './pages/SingleCodingProblem/SingleCodingProblem';
import Threads from './pages/Threads/Threads';
import SingleThread from './pages/SingleThread/SingleThread';
import MathProblems from './pages/MathProblems/MathProblems';
import { SingleMathProblem } from './pages/SingleMathProblem/SingleMathProblem';
import MathDashboardV2 from './pages/MathDashboard/MathDashboardV2';
import { SingleMathSet } from './pages/SingleMathSet/SingleMathSet';
import { CodingProblemV2 } from './pages/SingleCodingProblem/CodingProblemV2';
import GroupPage from './pages/GroupPage/GroupPage';

function App() {
  return (
    <div className='app'>
      <Provider store={store}>
        <BrowserRouter>
          <Toaster position='top-center' reverseOrder={false} />
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='coding' element={<CodingProblems />} />
            <Route path='math' element={<MathProblems />} />
            <Route path='contest' element={<Contest />} />
            <Route path='rank' element={<Rank />} />
            <Route path='profile' element={<Profile />} />
            <Route path='codingproblems' element={<CodingProblems />} />
            <Route
              path='codingproblem/:problemId'
              element={<SingleCodingProblem />}
            />
            <Route path='/threads/:category' element={<Threads />} />
            <Route path='/thread/:threadId' element={<SingleThread />} />
            <Route path='mathproblems' element={<MathProblems />} />
            <Route
              path='mathproblem/:problemId'
              element={<SingleMathProblem />}
            />
            <Route path='dashboard/math' element={<MathDashboardV2 />} />
            <Route path='mathset/:id' element={<SingleMathSet />} />
            <Route
              path='codingproblemV2/:problemId'
              element={<CodingProblemV2 />}
            />
            <Route
              path='group'
              element={<GroupPage />}
            />

          </Routes>
          <Footer />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
