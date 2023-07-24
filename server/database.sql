
CREATE DATABASE cartboard;


\c cartboard;

-- Create the "users" table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);


CREATE TABLE cardboards (
  cardboard_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  occasion VARCHAR(255),
  recipient VARCHAR(255),
  creator_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  is_archived BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  schedule TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE cardboard_user (
  cardboard_id INTEGER REFERENCES cardboards(cardboard_id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  PRIMARY KEY (cardboard_id, user_id)
);

-- Create indexes for performance optimization
CREATE INDEX idx_cardboard_user_user_id ON cardboard_user(user_id);
CREATE INDEX idx_cardboard_user_cardboard_id ON cardboard_user(cardboard_id);
