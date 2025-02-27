import React from "react";
import PotatoDishCard from "./components/PotatoDishCard";
import "./App.css";

const dummyDish = {
  name: "Cheesy Garlic Mashed Potatoes",
  description: "Creamy mashed potatoes with melted cheese and garlic butter.",
  image: "https://homecookedharvest.com/wp-content/uploads/2021/10/Cheese-Garlic-Mashed-Potatoes-MAIN-360x361.jpg",
  creator: "Chef Angel Potato",
};

function App() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero-section">
        <h1>Potato Possibilities</h1>
        <p>Unleash your creativity with the most versatile vegetable!</p>
        <button className="cta-button" onClick={() => alert("Let's get cooking!")}>Explore Dishes</button>
      </header>

      {/* About Section */}
      <section className="about-section">
        <h2>What is Potato Possibilities?</h2>
        <p>
          Potato Possibilities is a fun and interactive platform where you can share, discover, and vote on the most creative potato-based dishes. Whether it's a quirky recipe or a classic with a twist, this is the place to celebrate the humble potato in all its glory!
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Submit Dishes</h3>
            <p>Share your unique potato creations with the world.</p>
          </div>
          <div className="feature-card">
            <h3>Browse & Vote</h3>
            <p>Discover and upvote your favorite potato dishes.</p>
          </div>
          <div className="feature-card">
            <h3>Interactive Dashboard</h3>
            <p>See the most popular dishes in real-time.</p>
          </div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="featured-dishes">
        <h2>Featured Potato Dish</h2>
        <PotatoDishCard {...dummyDish} />
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2023 Potato Possibilities. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
