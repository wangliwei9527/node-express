CREATE TABLE comments (
  commentId INT AUTO_INCREMENT PRIMARY KEY,        -- 评论ID
  houseId INT NOT NULL,                            -- 房屋ID，外键与house表关联
  userId INT NOT NULL,                             -- 用户ID，外键与用户表关联
  commentText TEXT,                                -- 评论内容
  imageUrls JSON,                                  -- 评论图片，存储为JSON格式的URL数组
  parentCommentId INT DEFAULT NULL,                -- 回复评论ID，NULL表示该评论没有回复，非NULL表示这是对某个评论的回复
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- 评论创建时间
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 更新时间
  FOREIGN KEY (houseId) REFERENCES house(id), -- 外键，关联到house表
  FOREIGN KEY (userId) REFERENCES users(id),   -- 外键，关联到用户表
  FOREIGN KEY (parentCommentId) REFERENCES comments(commentId) -- 外键，关联到父评论表
);
