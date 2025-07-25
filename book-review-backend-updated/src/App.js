import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import BookList from './pages/BookList';         //Import BookList
import AddBook from './pages/AddBook';           //Import AddBook
import EditBook from './pages/EditBook';         //Import EditBook
import BookDetails from './pages/BookDetails';   //Import BookDetails

function App() {
  console.log("App loaded");

  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Book Routes */}
        <Route path="/" element={<BookList />} />               {/*Shows all books */}
        <Route path="/add" element={<AddBook />} />             {/*Add new book */}
        <Route path="/edit/:id" element={<EditBook />} />       {/*Edit a book */}
        <Route path="/books/:id" element={<BookDetails />} />   {/*View details & reviews */}
      </Routes>
    </Router>
  );
}

export default App;
