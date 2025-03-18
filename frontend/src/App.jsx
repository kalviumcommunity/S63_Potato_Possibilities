import React, { useState, useEffect } from "react";
import axios from "axios";
import PotatoDishCard from "./components/PotatoDishCard";
import EntitiesList from "./components/EntitiesList";
import UpdateEntity from "./pages/UpdateEntity";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dishes from the backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/dishes")
      .then((response) => {
        setDishes(response.data);
        setLoading(false); // Stop loading when data is fetched
      })
      .catch((error) => {
        setError("Error fetching dishes. Please try again later.");
        console.error("Error fetching dishes:", error);
        setLoading(false); // Stop loading on error as well
      });
  }, []);

  return (
    <Router>
      <div className="landing-page">
        {/* Hero Section */}
        <header className="hero-section">
          <h1>Potato Possibilities</h1>
          <p>Unleash your creativity with the most versatile vegetable!</p>
          <button
            className="cta-button"
            onClick={() => alert("Let's get cooking!")}
          >
            Explore Dishes
          </button>
        </header>

        {/* About Section */}
        <section className="about-section">
          <h2>What is Potato Possibilities?</h2>
          <p>
            Potato Possibilities is a fun and interactive platform where you can
            share, discover, and vote on the most creative potato-based dishes.
            Whether it's a quirky recipe or a classic with a twist, this is the
            place to celebrate the humble potato in all its glory!
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
          <h2>Featured Potato Dishes</h2>
          {loading ? (
            <p>Loading dishes... 🍟</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : dishes.length > 0 ? (
            <div className="dishes-grid">
              {dishes.map((dish) => (
                <PotatoDishCard
                  key={dish._id}
                  name={dish.name}
                  description={dish.description}
                  image={dish.image}
                  creator={dish.creator}
                />
              ))}
            </div>
          ) : (
            <p>No dishes found. Be the first to share a new creation! 🥔</p>
          )}
        </section>

        {/* Entities List Section */}
        <section className="entities-section">
          <EntitiesList />
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>© 2023 Potato Possibilities. All rights reserved.</p>
        </footer>

        {/* Routes for UpdateEntity */}
        <Routes>
          <Route path="/update/:id" element={<UpdateEntity />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
