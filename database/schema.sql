-- Create Database
CREATE DATABASE IF NOT EXISTS db_ac78f8_fknews CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_ac78f8_fknews;

-- Table for suspicious keywords
CREATE TABLE IF NOT EXISTS suspicious_keywords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    weight INT DEFAULT 10 -- Weight used to decrease confidence score
) ENGINE=InnoDB;

-- Table for trusted sources (domains)
CREATE TABLE IF NOT EXISTS trusted_sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    source_name VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Table for analysis logs
CREATE TABLE IF NOT EXISTS analysis_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    input_text TEXT,
    source_url VARCHAR(255),
    result_status VARCHAR(50), -- 'fake', 'uncertain', 'trusted'
    confidence_score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Seed data for suspicious keywords
INSERT INTO suspicious_keywords (keyword, weight) VALUES
('عاجل', 15),
('صادم', 15),
('كارثة', 10),
('لن تصدق', 20),
('فضيحة', 20),
('تسريب', 15),
('شاهد قبل الحذف', 25),
('سري للغاية', 15);

-- Seed data for trusted sources
INSERT INTO trusted_sources (domain, source_name) VALUES
('bbc.com', 'BBC Arabic'),
('reuters.com', 'Reuters'),
('aljazeera.net', 'Al Jazeera'),
('skynewsarabia.com', 'Sky News Arabia'),
('alarabiya.net', 'Al Arabiya');
