import PollenIndex from "./PollenIndex";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import GetPollen from "./GetPollen";

function App() {
  return (
    <>
      <>
        <Router>
          <div className="min-h-screen pb-11 ">
            <header className="bg-slate-900 shadow-lg text-white p-4 sticky top-0 z-50">
              <nav className="flex justify-center items-center">
                <div className="space-x-4 items-center justify-center">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? "text-yellow-400 font-semibold px-3"
                        : "text-gray-200 font-semibold hover:text-yellow-400 px-3"
                    }
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/get-pollen"
                    className={({ isActive }) =>
                      isActive
                        ? "text-yellow-400 font-semibold px-3"
                        : "text-gray-200 font-semibold hover:text-yellow-400 px-3"
                    }
                  >
                    Get Pollen
                  </NavLink>
                </div>
              </nav>
            </header>

            {/* Routes */}
            <Routes>
              <Route path="/" element={<PollenIndex />} />

              <Route path="/get-pollen" element={<GetPollen />} />
            </Routes>
          </div>
        </Router>

        {/* <PollenIndex />
      <GetPollen /> */}
      </>
    </>
  );
}

export default App;

// import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
// import PollenIndex from "./PollenIndex";
// import GetPollen from "./GetPollen";

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="min-h-screen">
//         <header className="bg-slate-900  text-white shadow-lg p-4 sticky top-0 z-50">
//           <nav>
//             <ul className="flex space-x-4 justify-center">
//               <li>
//                 <NavLink
//                   to="/"
//                   className={({ isActive }) =>
//                     isActive
//                       ? "text-yellow-400 font-semibold"
//                       : "text-gray-200 font-semibold hover:text-yellow-400"
//                   }
//                 >
//                   Home
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/get-pollen"
//                   className={({ isActive }) =>
//                     isActive
//                       ? "text-yellow-400 font-semibold"
//                       : "text-gray-200 font-semibold hover:text-yellow-400"
//                   }
//                 >
//                   Get Pollen
//                 </NavLink>
//               </li>
//             </ul>
//           </nav>
//         </header>
//         <div className="container mx-auto p-6 bg-gray-100 shadow-inner rounded-md">
//           <Routes>
//             <Route exact path="/" element={<PollenIndex />} />
//             <Route exact path="/get-pollen" element={<GetPollen />} />
//           </Routes>
//         </div>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
