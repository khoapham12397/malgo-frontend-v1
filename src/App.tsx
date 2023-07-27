import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AdminContests from './components/AdminContests/AdminContests';
import AdminUsers from './components/AdminUsers/AdminUsers';
import Footer from './components/Footer/Footer';
import GameContainerV2 from './components/Game/GameContainer/GameContainerV2';
import Header from './components/Header/Header';
import Admin from './pages/Admin/Admin';
import Algorithm from './pages/Algorithm/Algorithm';
import GroupPage from './pages/ChatPage/ChatPage';
import { CheckMathJax } from './pages/checkMathJax';
import Contest from './pages/Contest/Contest';
import { ContestList } from './pages/ContestList/ContestList';
import ContestProblem from './pages/ContestProblem/ContestProblem';
import { LessonHome } from './pages/Lessons/Lessons';
import MathDashboardV2 from './pages/MathDashboard/MathDashboardV2';
import MathProblems from './pages/MathProblems/MathProblems';
import Profile from './pages/Profile/Profile';
import Rank from './pages/Rank/Rank';
import { CodingProblemV2 } from './pages/SingleCodingProblem/CodingProblemV2';
import { CodingProblemV3 } from './pages/SingleCodingProblem/CodingProblemV3';
import SingleContest from './pages/SingleContest/SingleContest';
import { SingleContestPage } from './pages/SingleContestPage/SingleContestPage';
import { SingleLesson } from './pages/SingleLesson/SingleLesson';
import { SingleMathProblem } from './pages/SingleMathProblem/SingleMathProblem';
import { SingleMathSet } from './pages/SingleMathSet/SingleMathSet';
import SingleThread from './pages/SingleThread/SingleThread';
import { SubmissionStatus } from './pages/SubmissionStatus/SubmissionStatus';
import Threads from './pages/Threads/Threads';
import { ThreadSearch } from './pages/ThreadSearch/ThreadSearch';
import store from './state';

function App() {
  return (
    <div className='app'>
      <Provider store={store}>
        <BrowserRouter>
          <div className='content-wrap'>
            <Toaster position='top-center' reverseOrder={false} />
            <Header />
            <Routes>
              <Route path='/' element={<Algorithm />} />

              <Route path='algorithm' element={<Algorithm />} />
              <Route path='algorithm/:id' element={<CodingProblemV3 />} />

              <Route path='math' element={<MathProblems />} />
              <Route path='math/:id' element={<SingleMathProblem />} />
              <Route path='dashboard/math' element={<MathDashboardV2 />} />
              <Route path='mathset/:id' element={<SingleMathSet />} />

              <Route path='contest' element={<Contest />} />
              <Route path='contest/:id' element={<SingleContest />} />
              <Route
                path='contest/:id/:problemId'
                element={<ContestProblem />}
              />

              <Route path='threads/' element={<Threads />} />
              <Route path='threads/:category' element={<Threads />} />
              <Route path='thread/:threadId' element={<SingleThread />} />

              <Route path='rank' element={<Rank />} />

              <Route path='profile' element={<Profile />} />

              <Route path='admin' element={<Admin />} />
              <Route path='admin/users' element={<AdminUsers />} />
              <Route path='admin/contests' element={<AdminContests />} />
              <Route path='chat' element={<GroupPage />} />
              <Route path='game' element={<GameContainerV2 />} />
              <Route path='submission/:page' element={<SubmissionStatus />} />
              <Route path='contest2' element={<ContestList />} />
              <Route
                path='singlecontest/:contestId'
                element={<SingleContestPage />}
              />
              <Route path='search/thread' element={<ThreadSearch />} />
              <Route path='vd' element={<CheckMathJax />} />
              <Route path='/lesson' element={<LessonHome />} />
              <Route path='/lesson/:file' element={<SingleLesson />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
