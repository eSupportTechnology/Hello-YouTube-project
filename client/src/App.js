import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRouters from "./utils/ProtectedRouters";
import Notfound from "./pages/Notfound";
import Home from "./pages/Home";
import Loginuser from "./pages/user/Loginuser";
import Registration from "./pages/user/Registration";
import Subadd from "./pages/user/Subadd";
import Subtask from "./pages/user/Subtask";
import Tasksubtab from "./pages/user/Tasksubtab";
import Tasksubupload from "./pages/user/Tasksubupload";

function App() {
  return (


    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Loginuser />} />
        <Route path="/signup" element={<Registration />} />

        {/* protected routers */}
        <Route element={<ProtectedRouters />}>
          <Route path="/user-dashboard" element={<Subadd />} />
          <Route path="/subscription" element={<Subtask />} />
          <Route path="/tasksubscription" element={<Tasksubtab />} />
          <Route path="/tasksubcomplete/:taskSubID" element={<Tasksubupload />} />
        </Route>

        {/* 404 Page Route */}
        <Route path="*" element={<Notfound />} />
        
      </Routes>

    </BrowserRouter>
  );
}

export default App;
