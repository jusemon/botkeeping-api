CREATE TABLE tasks (
  id INT NOT NULL AUTO_INCREMENT,
  description VARCHAR(50) NOT NULL,
  duration INT UNSIGNED NOT NULL,
  isActive BIT(1) DEFAULT 1,
  queryable VARCHAR(255) GENERATED ALWAYS AS (UPPER(CONCAT(description, '|', duration, '|', if(isActive > 0, 'yes', 'no')))),
  PRIMARY KEY (id)
);

CREATE TABLE bots (
  id int NOT NULL AUTO_INCREMENT,
  name VARCHAR(16) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  queryable VARCHAR(255) GENERATED ALWAYS AS (UPPER(CONCAT(name, '|', createdAt))),
  PRIMARY KEY (id)
);

CREATE TABLE tasks_bot (
  botId INT NOT NULL,
  taskId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completedAt TIMESTAMP,
  FOREIGN KEY (botId) REFERENCES bots(id) ON DELETE CASCADE,
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
  PRIMARY KEY (botId, taskId)
);
