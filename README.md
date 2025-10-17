# 🚀 Hybrid ORM Blog API - TypeORM + Drizzle

[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red)](https://nestjs.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle-0.35.0-green)](https://orm.drizzle.team/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3.17-orange)](https://typeorm.io/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)]()


### ORM Responsibilities

| ORM | Manages | Approach |
|-----|---------|----------|
| **TypeORM** | Users, Posts | Decorator-based entities (legacy system) |
| **Drizzle** | Comments, Tags | Schema-based definitions (modern system) |

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
Edit `.env` file:
```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_password  # ← SET THIS
DATABASE_NAME=blog_db
PORT=3001
NODE_ENV=development
```

### 3. Start Application
```bash
npm run start:dev
```

### 4. Access Dashboard
Open **http://localhost:3001** in your browser


## 🏗️ Architecture

### System Diagram
```
┌─────────────────────────────────────────────────────┐
│              NestJS Application                     │
│                                                     │
│  ┌──────────────┐         ┌───────────────┐       │
│  │   TypeORM    │         │   Drizzle     │       │
│  │              │         │               │       │
│  │ • Users      │         │ • Comments    │       │
│  │ • Posts      │         │ • Tags        │       │
│  │              │         │ • PostTags    │       │
│  └──────┬───────┘         └───────┬───────┘       │
│         │                         │               │
│         └─────────┬───────────────┘               │
│                   │                               │
└───────────────────┼───────────────────────────────┘
                    │
            ┌───────▼────────┐
            │  MariaDB/MySQL │
            │    blog_db     │
            │                │
            │  Tables:       │
            │  • users       │
            │  • posts       │
            │  • comments    │
            │  • tags        │
            │  • post_tags   │
            └────────────────┘
```

### Project Structure
```
blog-type-drizzle/
├── src/
│   ├── typeorm/
│   │   └── entities/
│   │       ├── user.entity.ts      # TypeORM entity
│   │       └── post.entity.ts      # TypeORM entity
│   ├── drizzle/
│   │   ├── schema.ts               # Drizzle schema definitions
│   │   └── drizzle.provider.ts    # Custom NestJS provider
│   ├── users/                      # User module (TypeORM)
│   │   ├── users.controller.ts
│   │   ├── users.service.ts        # Uses TypeORM + Drizzle
│   │   └── users.module.ts
│   ├── posts/                      # Post module (TypeORM)
│   │   ├── posts.controller.ts
│   │   ├── posts.service.ts        # Cross-ORM interactions
│   │   └── posts.module.ts
│   ├── comments/                   # Comment module (Drizzle)
│   │   ├── comments.controller.ts
│   │   ├── comments.service.ts     # Uses Drizzle + TypeORM
│   │   └── comments.module.ts
│   ├── tags/                       # Tag module (Drizzle)
│   │   ├── tags.controller.ts
│   │   ├── tags.service.ts         # Pure Drizzle
│   │   └── tags.module.ts
│   ├── dto/                        # Data Transfer Objects
│   │   ├── create-user.dto.ts
│   │   ├── create-post.dto.ts
│   │   ├── create-comment.dto.ts
│   │   └── create-tag.dto.ts
│   ├── app.module.ts               # Main module
│   ├── app.controller.ts           # Health checks
│   ├── app.service.ts              # Drizzle table initialization
│   └── main.ts                     # Application entry point
├── public/
│   └── index.html                  # Interactive dashboard
├── drizzle.config.ts               # Drizzle Kit configuration
├── .env                            # Environment variables
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
└── start-dev.sh                    # Startup script

```

---

## 📦 Installation

### Prerequisites
- Node.js v16 or higher
- MariaDB/MySQL 5.7+ running on port 3306
- npm or yarn package manager

### Step-by-Step Installation

#### 1. Clone/Navigate to Project
```bash
cd blog-type-drizzle
```

#### 2. Install Dependencies
```bash
npm install
```

Expected output:
```
added 812 packages in 38s
✅ Dependencies installed successfully
```

#### 3. Setup Database
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE blog_db;
exit;
```

#### 4. Configure Environment
Copy `.env.example` to `.env` and update:
```bash
cp .env.example .env
nano .env  # or use your preferred editor
```

Set your database password:
```env
DATABASE_PASSWORD=your_actual_password_here
```

#### 5. Build Application
```bash
npm run build
```

#### 6. Start Development Server
```bash
npm run start:dev
```

Expected output:
```
🔧 Initializing Drizzle ORM tables...
✅ Drizzle ORM tables initialized successfully

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Hybrid ORM Blog API - TypeORM + Drizzle             ║
║                                                            ║
║   Server running on: http://localhost:3001                ║
║   Dashboard: http://localhost:3001                        ║
║                                                            ║
║   TypeORM manages:  Users, Posts                          ║
║   Drizzle manages:  Comments, Tags                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## 🎮 Usage

### Option 1: Web Dashboard (Recommended)

1. Open http://localhost:3001 in your browser
2. Use the interactive UI to:
   - Create users, posts, comments, and tags
   - Link posts to tags
   - View all data with real-time updates
   - Monitor system health

### Option 2: API Endpoints

#### Create a User (TypeORM)
```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "bio": "Software developer"
  }'
```

#### Create a Post (TypeORM)
```bash
curl -X POST http://localhost:3001/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started with Drizzle ORM",
    "content": "Drizzle is a modern TypeScript ORM...",
    "authorId": 1
  }'
```

#### Create a Tag (Drizzle)
```bash
curl -X POST http://localhost:3001/tags \
  -H "Content-Type: application/json" \
  -d '{
    "name": "typescript",
    "description": "TypeScript related posts"
  }'
```

#### Link Post to Tag (Cross-ORM)
```bash
curl -X POST http://localhost:3001/posts/1/tags/1
```

#### Create a Comment (Drizzle)
```bash
curl -X POST http://localhost:3001/comments \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great article!",
    "userId": 1,
    "postId": 1
  }'
```

### Option 3: Import into Postman/Insomnia

All API endpoints are REST-compliant and can be easily imported into any API client.

---

## 📚 API Documentation

### Users Endpoints (TypeORM)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create a new user |
| GET | `/users` | Get all users (with comment counts) |
| GET | `/users/:id` | Get user by ID |
| PATCH | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

### Posts Endpoints (TypeORM + Drizzle)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/posts` | Create a new post |
| GET | `/posts` | Get all posts (with tags & comments) |
| GET | `/posts/:id` | Get post by ID |
| GET | `/posts/:id/details` | Get post with full details |
| GET | `/posts/author/:authorId` | Get posts by author |
| POST | `/posts/:postId/tags/:tagId` | Link post to tag (Cross-ORM) |
| GET | `/posts/:id/tags` | Get all tags for a post |
| PATCH | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Delete post |

### Comments Endpoints (Drizzle + TypeORM)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/comments` | Create a new comment |
| GET | `/comments` | Get all comments (with author info) |
| GET | `/comments/:id` | Get comment by ID |
| GET | `/comments/post/:postId` | Get comments by post |
| GET | `/comments/user/:userId` | Get comments by user |
| PATCH | `/comments/:id` | Update comment |
| DELETE | `/comments/:id` | Delete comment |

### Tags Endpoints (Drizzle)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tags` | Create a new tag |
| GET | `/tags` | Get all tags (with post counts) |
| GET | `/tags/:id` | Get tag by ID |
| GET | `/tags/name/:name` | Get tag by name |
| GET | `/tags/:id/posts` | Get posts for a tag |
| PATCH | `/tags/:id` | Update tag |
| DELETE | `/tags/:id` | Delete tag |

### Health Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | System health check |

---

## 🔄 Cross-ORM Interactions

### Example 1: Posts Service Enriching with Drizzle Data

**File**: `src/posts/posts.service.ts`

```typescript
async enrichPostWithDrizzleData(post: Post): Promise<void> {
  // Get comment count from Drizzle
  const [commentResult] = await this.drizzleDb
    .select({ count: count() })
    .from(schema.comments)
    .where(eq(schema.comments.postId, post.id));
  
  post.commentCount = commentResult?.count || 0;

  // Get tags from Drizzle
  const tagsData = await this.drizzleDb
    .select({
      id: schema.tags.id,
      name: schema.tags.name,
    })
    .from(schema.tags)
    .innerJoin(schema.postTags, eq(schema.postTags.tagId, schema.tags.id))
    .where(eq(schema.postTags.postId, post.id));
  
  post.tags = tagsData;
  post.tagCount = tagsData.length;
}
```

### Example 2: Comments Service Validating with TypeORM

**File**: `src/comments/comments.service.ts`

```typescript
async create(createCommentDto: CreateCommentDto): Promise<schema.Comment> {
  // Verify user exists in TypeORM
  const user = await this.typeormDataSource
    .getRepository('User')
    .findOne({ where: { id: createCommentDto.userId } });
  
  if (!user) {
    throw new NotFoundException(`User with ID ${createCommentDto.userId} not found`);
  }

  // Verify post exists in TypeORM
  const post = await this.typeormDataSource
    .getRepository('Post')
    .findOne({ where: { id: createCommentDto.postId } });
  
  if (!post) {
    throw new NotFoundException(`Post with ID ${createCommentDto.postId} not found`);
  }

  // Create comment using Drizzle
  const result = await this.drizzleDb.insert(schema.comments).values({
    content: createCommentDto.content,
    userId: createCommentDto.userId,
    postId: createCommentDto.postId,
  });
  
  return comment;
}
```

### Example 3: Linking TypeORM Posts to Drizzle Tags

**File**: `src/posts/posts.service.ts`

```typescript
async linkToTag(postId: number, tagId: number): Promise<{ message: string }> {
  // Verify post exists (TypeORM)
  await this.findOne(postId);
  
  // Verify tag exists (Drizzle)
  const [tag] = await this.drizzleDb
    .select()
    .from(schema.tags)
    .where(eq(schema.tags.id, tagId))
    .limit(1);
  
  if (!tag) {
    throw new NotFoundException(`Tag with ID ${tagId} not found`);
  }

  // Link them (Drizzle)
  try {
    await this.drizzleDb.insert(schema.postTags).values({
      postId,
      tagId,
    });
  } catch (error) {
    if (error.code !== 'ER_DUP_ENTRY') {
      throw error;
    }
  }

  return { message: `Post ${postId} linked to tag ${tagId}` };
}
```

---

## 🗄️ Database Schema

### TypeORM Tables (Auto-created)

#### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Posts Table
```sql
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT TRUE,
  author_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Drizzle Tables (Auto-created)

#### Comments Table
```sql
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
```

#### Tags Table
```sql
CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Post-Tags Junction Table
```sql
CREATE TABLE post_tags (
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

## 🐛 Troubleshooting

### Port 3001 Already in Use
The startup script automatically handles this, but if needed:
```bash
lsof -ti:3001 | xargs kill -9
npm run start:dev
```

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p

# Verify database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'blog_db';"

# Create if needed
mysql -u root -p -e "CREATE DATABASE blog_db;"

# Check credentials in .env
cat .env | grep DATABASE_
```

### Tables Not Created
Check console output for:
```
🔧 Initializing Drizzle ORM tables...
✅ Drizzle ORM tables initialized successfully
```

If you see warnings, tables might already exist (this is fine).

Verify manually:
```bash
mysql -u root -p blog_db -e "SHOW TABLES;"
```

Should see: `users`, `posts`, `comments`, `tags`, `post_tags`

### "Cannot find module" Errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Failures
```bash
# Clean build
rm -rf dist
npm run build
```

### Application Starts But Crashes
Check logs for specific errors:
```bash
npm run start:dev 2>&1 | tee debug.log
```

---

## 💻 Development

### Development Workflow

1. **Start development server**:
   ```bash
   npm run start:dev
   ```

2. **Make changes** to TypeScript files (auto-reloads)

3. **Test via dashboard**: http://localhost:3001

4. **Generate Drizzle migrations** (when schema changes):
   ```bash
   npm run drizzle:generate
   ```

5. **Run migrations**:
   ```bash
   npm run drizzle:migrate
   ```

6. **Inspect database** visually:
   ```bash
   npm run drizzle:studio
   ```

### Code Style
- **Formatter**: Prettier
- **Linter**: ESLint
- **Type Checker**: TypeScript strict mode

Run code quality checks:
```bash
npm run format
npm run lint
```

### Testing
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start:prod` | Run production build |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Lint code with ESLint |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Generate test coverage |
| `npm run drizzle:generate` | Generate Drizzle migrations |
| `npm run drizzle:migrate` | Run Drizzle migrations |
| `npm run drizzle:studio` | Open Drizzle Studio (visual DB tool) |


## 🎉 Success Checklist

After installation, verify:

- [x] `npm install` completed without errors
- [x] `.env` configured with database credentials
- [x] `npm run build` successful
- [x] Server starts on port 3001
- [x] Dashboard loads at http://localhost:3001
- [x] All 5 tables created in database
- [x] Can create users successfully
- [x] Can create posts successfully
- [x] Can create tags successfully
- [x] Can link posts to tags
- [x] Can create comments successfully
- [x] Posts show tag counts (cross-ORM works)
- [x] Comments show author info (cross-ORM works)
- [x] No errors in console logs
