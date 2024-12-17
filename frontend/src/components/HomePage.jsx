import  { useState } from 'react';
import { Search, Bell, User, Heart } from 'lucide-react';
import './HomePage.css';

const subjectsData = [
  { id: 1, title: 'Mathematics', image: '/api/placeholder/300/200', liked: false },
  { id: 2, title: 'Physics', image: '/api/placeholder/300/200', liked: false },
  { id: 3, title: 'Chemistry', image: '/api/placeholder/300/200', liked: false },
  { id: 4, title: 'Biology', image: '/api/placeholder/300/200', liked: false },
  { id: 5, title: 'Computer Science', image: '/api/placeholder/300/200', liked: false },
  { id: 6, title: 'History', image: '/api/placeholder/300/200', liked: false },
  { id: 7, title: 'Geography', image: '/api/placeholder/300/200', liked: false },
  { id: 8, title: 'Literature', image: '/api/placeholder/300/200', liked: false },
  { id: 9, title: 'Economics', image: '/api/placeholder/300/200', liked: false },
  { id: 10, title: 'Psychology', image: '/api/placeholder/300/200', liked: false },
  { id: 11, title: 'Sociology', image: '/api/placeholder/300/200', liked: false },
  { id: 12, title: 'Political Science', image: '/api/placeholder/300/200', liked: false }
];

const HomePage = () => {
  const [subjects, setSubjects] = useState(subjectsData);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLike = (id) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, liked: !subject.liked } : subject
    ));
  };

  const handleCardClick = (id) => {
    console.log(`Navigating to subject ${id}`);
  };

  const handleNotificationClick = () => {
    console.log('Opening notifications');
  };

  const handleProfileClick = () => {
    console.log('Opening user profile');
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">Notes App</div>
          
          <div className="search-container">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search notes..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="search-icon" size={16} />
            </div>
          </div>
          
          <div className="nav-icons">
            <button className="icon-button" onClick={handleNotificationClick}>
              <Bell size={16} />
            </button>
            <button className="icon-button" onClick={handleProfileClick}>
              <User size={16} />
            </button>
          </div>
        </div>
      </nav>
        <br /> <br /> <br /> <br />
      <div className="main-content">
        <div className="cards-grid">
          {filteredSubjects.map((subject) => (
            <div key={subject.id} className="card">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(subject.id);
                }}
                className="like-button"
              >
                <Heart
                  size={16}
                  className={subject.liked ? 'heart-icon liked' : 'heart-icon'}
                />
              </button>
              
              <div className="card-content" onClick={() => handleCardClick(subject.id)}>
                <img
                  src={subject.image}
                  alt={subject.title}
                  className="card-image"
                />
                <div className="card-body">
                  <h3 className="card-title">{subject.title}</h3>
                  <p className="card-text">
                    Click to view notes for {subject.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;