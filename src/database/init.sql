CREATE TABLE IF NOT EXISTS users(user_id SERIAL PRIMARY KEY,
				  user_name CHARACTER VARYING UNIQUE NOT NULL,
				  email CHARACTER VARYING UNIQUE NOT NULL,
				  password CHARACTER VARYING NOT NULL,
				  first_name CHARACTER VARYING,
				  last_name CHARACTER VARYING,
				  role CHARACTER VARYING DEFAULT 'donor' NOT NULL,
				  contact_number CHARACTER VARYING,
				  address TEXT,
				  location_longitude DECIMAL(10,8),
				  location_latitude DECIMAL(10,8))

CREATE TABLE IF NOT EXISTS food_items(food_item_id SERIAL PRIMARY KEY,
									 name VARCHAR(255) NOT NULL,
									 description TEXT,
									 quantity INTEGER NOT NULL,
									 expiry_date DATE NOT NULL,
									 dietary_restrictions TEXT,
									 image_url VARCHAR(255) NOT NULL,
									 donor_id INTEGER REFERENCES users(user_id))

CREATE TABLE IF NOT EXISTS donations(donation_id SERIAL PRIMARY KEY,
									food_item_id INTEGER REFERENCES food_items(food_item_id) NOT NULL,
									donor_id INTEGER REFERENCES users(user_id) NOT NULL,
									recipient_id INTEGER REFERENCES users(user_id) NOT NULL,
									quantity INTEGER NOT NULL,
									 request_time TIMESTAMP WITH TIMEZONE NOT NULL,
									 confirmation_time TIMESTAMP WITH TIMEZONE,
									 pickup_time TIMESTAMP WITH TIMEZONE,
									 status text DEFAULT 'requested' NOT NULL
									)