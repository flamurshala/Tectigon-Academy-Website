CREATE TABLE IF NOT EXISTS trainings (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  short_description TEXT NOT NULL,
  full_description LONGTEXT NULL,
  category_label VARCHAR(100) NULL,
  level_label VARCHAR(100) NULL,
  badge_text VARCHAR(100) NULL,
  training_hours INT NULL,
  students_count INT NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2) NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
  image_url VARCHAR(500) NULL,
  button_text VARCHAR(100) NOT NULL DEFAULT 'Me shume',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY trainings_slug_unique (slug),
  KEY trainings_public_sort_index (is_active, sort_order, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO trainings (
  title, slug, short_description, full_description, level_label,
  training_hours, students_count, rating, price, old_price, currency,
  button_text, is_active, sort_order
) VALUES
('Full Stack Developer', 'full-stack-developer', 'Aplikacione te plota web: frontend, backend, databaza dhe publikim.', 'Nderto aplikacione moderne nga fillimi deri ne fund.', 'Intermediate', 120, 1350, 4.9, 1499.00, 1999.00, 'EUR', 'Me shume', 1, 10),
('Graphic Design & UI/UX', 'graphic-design-ui-ux', 'Dizajn grafik dhe UI/UX: prototipim, dizajn sisteme dhe portofol.', 'Krijo identitet vizual dhe pervoja digjitale te orientuara te perdoruesi.', 'Beginner', 80, 820, 4.8, 1199.00, 1499.00, 'EUR', 'Me shume', 1, 20),
('Java Development', 'java-development', 'Java dhe Spring: OOP, API, databaza dhe aplikacione reale.', 'Nderto aplikacione te qendrueshme me Java, Spring, API dhe databaza.', 'Intermediate', 100, 610, 4.8, 1399.00, 1799.00, 'EUR', 'Me shume', 1, 30),
('Cyber Security', 'cyber-security', 'Siguri kibernetike: rrjete, hardening, monitoring dhe incidente.', 'Meso mbrojtjen e sistemeve dhe rrjeteve me lab-e praktike.', 'Advanced', 100, 910, 4.8, 1799.00, 2299.00, 'EUR', 'Me shume', 1, 40),
('DevOps', 'devops', 'CI/CD, Docker, monitoring dhe cloud bazik per DevOps.', 'Meso praktikat DevOps per automatizim, publikim dhe mirembajtje.', 'Intermediate', 80, 520, 4.8, 1499.00, 1899.00, 'EUR', 'Me shume', 1, 50),
('QA', 'qa', 'Manual QA dhe bazat e automation per testim profesional.', 'Meso testimin e softuerit: manual testing, test cases dhe bug reporting.', 'Beginner', 60, 420, 4.7, 899.00, 1099.00, 'EUR', 'Me shume', 1, 60);
