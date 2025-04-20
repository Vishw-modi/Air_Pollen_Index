import PollenIndex from "./PollenIndex";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import GetPollen from "./GetPollen";
import { Button } from "./components/ui/button";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/get-pollen"
                className={({ isActive }) =>
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                Get Pollen
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="container py-6">
          <Routes>
            <Route path="/" element={<PollenIndex />} />
            <Route path="/get-pollen" element={<GetPollen />} />
          </Routes>
        </main>
      </div>
    </Router>
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
