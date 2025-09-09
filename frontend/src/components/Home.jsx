import "./styles.css";
import Subjects from "./Subjects.jsx";
import Footer from "./Footer.jsx";
import Image from "../assets/image.png";
import PropTypes from "prop-types";

function Home({ subjects }) {
  function navigateToLogin() {
    window.location.href = '/login';
  }

  return (
    <div className="app-container">
      <header className="app-header">
      <div className="flex"> <h1 className="app-title" >Notemate</h1> 
      <img src={Image} alt="Image here" onClick={() => window.location.href = 'https://learn.kletech.ac.in/login'} className="img" />
      <button className="button" style={{textAlign:"right",marginRight:"19px"}} onClick={navigateToLogin} >Admin</button></div> 
        <div className="app-para" >A study material sharing platform</div>
      </header>
      <main className="app-content">
        <Subjects subjects={subjects} />
      </main>
        <Footer/>
    </div>
  );
}

Home.propTypes = {
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Home;
