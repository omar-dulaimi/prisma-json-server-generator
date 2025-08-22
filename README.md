<div align="center">
  <img src="https://raw.githubusercontent.com/omar-dulaimi/prisma-json-server-generator/master/logo.png" alt="Prisma JSON Server Generator Logo" width="120" height="120">
  
  # 🚀 Prisma JSON Server Generator
  
  **Transform your Prisma schema into a fully functional REST API in seconds**
  
  <p align="center">
    <a href="https://www.npmjs.com/package/prisma-json-server-generator">
      <img src="https://img.shields.io/npm/v/prisma-json-server-generator?style=for-the-badge&logo=npm&color=CB3837" alt="npm version">
    </a>
    <a href="https://www.npmjs.com/package/prisma-json-server-generator">
      <img src="https://img.shields.io/npm/dt/prisma-json-server-generator?style=for-the-badge&logo=npm&color=CB3837" alt="npm downloads">
    </a>
    <a href="https://github.com/omar-dulaimi/prisma-json-server-generator/stargazers">
      <img src="https://img.shields.io/github/stars/omar-dulaimi/prisma-json-server-generator?style=for-the-badge&logo=github&color=181717" alt="GitHub stars">
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/npm/l/prisma-json-server-generator?style=for-the-badge&color=green" alt="License">
    </a>
    <a href="https://github.com/sponsors/omar-dulaimi">
      <img src="https://img.shields.io/github/sponsors/omar-dulaimi?style=for-the-badge&logo=github&logoColor=white&labelColor=black&color=EA4AAA" alt="GitHub Sponsors">
    </a>
  </p>
  
  <p align="center">
    <a href="#-quick-start"><strong>Quick Start</strong></a> •
    <a href="#-new-in-v030"><strong>New Features</strong></a> •
    <a href="#-examples"><strong>Examples</strong></a> •
    <a href="https://github.com/omar-dulaimi/prisma-json-server-generator/issues/new?template=bug_report.yml"><strong>Report Bug</strong></a> •
    <a href="https://github.com/omar-dulaimi/prisma-json-server-generator/issues/new?template=feature_request.md"><strong>Request Feature</strong></a>
  </p>
</div>

---

## 🎯 Why Choose This Generator?

<div align="center">

| 🔴 **Before** (Manual Setup) | 🟢 **After** (This Generator) |
|:-----|:-----|
| 📝 Create mock data manually | 🚀 `npx prisma generate` |
| ✍️ Write JSON files by hand | ⚡ `json-server --watch db.json` |
| 🔧 Set up json-server manually | |
| 🔄 Maintain data consistency | |
| 📋 Update when schema changes | |
| | |
| ❌ **Time consuming** | ✅ **2 commands to full REST API** |
| ❌ **Error prone** | ✅ **Realistic data with faker.js** |
| ❌ **Hard to maintain** | ✅ **Auto-sync with schema changes** |
| ❌ **Inconsistent data** | ✅ **Customizable data patterns** |

</div>

---

## 🚀 Quick Start

Get a fully functional REST API running in **under 2 minutes**:

### 1️⃣ Install
```bash
npm install prisma-json-server-generator --save-dev
npm install -g json-server
```

### 2️⃣ Add to your Prisma schema
```prisma
generator json_server {
  provider = "prisma-json-server-generator"
}
```

### 3️⃣ Generate & Launch
```bash
npx prisma generate        # Generate data
json-server --watch db.json --port 3001   # Launch API
```

### 4️⃣ Start Building! 🎉
Your REST API is now live at `http://localhost:3001`
- `GET /users` - List all users
- `GET /posts` - List all posts  
- `POST /users` - Create user
- Full CRUD operations available!

---

## 🆕 New in v0.3.0

<div align="center">

### 🎭 **Custom Faker Patterns** • 🎯 **Data Volume Control** • 🌱 **Seed Data Support**

</div>

<table>
<tr>
<td width="33%" align="center">

### 🎭 Custom Patterns
```json
{
  "customPatterns": {
    "User.email": "{{internet.email}}",
    "Product.price": "{{commerce.price}}"
  }
}
```
**Generate realistic data** with 50+ faker patterns

</td>
<td width="33%" align="center">

### 🎯 Volume Control  
```json
{
  "recordCounts": {
    "User": 100,
    "Product": 500,
    "Order": 1000
  }
}
```
**Control exactly** how much data you need

</td>
<td width="33%" align="center">

### 🌱 Seed Data
```json
// seeds/admins.json
[{
  "id": 1,
  "role": "admin",
  "email": "admin@company.com"
}]
```
**Load real data** then generate additional records

</td>
</tr>
</table>

---

## ✨ Supported Prisma Versions

<div align="center">

| Prisma Version | Generator Version | Status |
|----------------|-------------------|--------|
| **6.x (Latest)** | **0.3.0+** | ✅ **Fully Supported** |
| 5.x | 0.2.5+ | ✅ Compatible |
| 4.x | 0.2.0 - 0.2.4 | ⚠️ Legacy |
| 2.x/3.x | 0.1.2 and lower | ❌ Deprecated |

</div>

---

## 📦 Installation

<details open>
<summary><strong>📋 Choose your package manager</strong></summary>

```bash
# npm
npm install prisma-json-server-generator --save-dev

# yarn
yarn add prisma-json-server-generator --dev

# pnpm
pnpm add -D prisma-json-server-generator
```

</details>

**Don't forget json-server:**
```bash
npm install -g json-server
```

---

## 🔧 Advanced Configuration

### 💪 Power User Setup

Create `prisma/json-server-config.json`:

```json
{
  "outputFileName": "api-data.json",
  "recordCounts": {
    "User": 50,
    "Product": 200,
    "Category": 10,
    "Order": 300
  },
  "customPatterns": {
    "User.email": "{{internet.email}}",
    "User.firstName": "{{person.firstName}}",
    "User.lastName": "{{person.lastName}}",
    "User.avatar": "{{image.avatar}}",
    "Product.name": "{{commerce.productName}}",
    "Product.price": "{{commerce.price}}",
    "Product.description": "{{commerce.productDescription}}",
    "Category.name": "{{commerce.department}}",
    "Order.status": "{{helpers.arrayElement(['pending', 'shipped', 'delivered'])}}"
  },
  "seedData": {
    "enabled": true,
    "seedDataPath": "./seeds/",
    "generateAdditionalRecords": true
  }
}
```

Update your schema:
```prisma
generator json_server {
  provider = "prisma-json-server-generator"
  config   = "./prisma/json-server-config.json"
}
```

### 🎨 Popular Faker Patterns

<details>
<summary><strong>👤 Person Data</strong></summary>

```json
{
  "User.firstName": "{{person.firstName}}",
  "User.lastName": "{{person.lastName}}",
  "User.fullName": "{{person.fullName}}",
  "User.jobTitle": "{{person.jobTitle}}",
  "User.bio": "{{person.bio}}"
}
```
</details>

<details>
<summary><strong>🌐 Internet & Contact</strong></summary>

```json
{
  "User.email": "{{internet.email}}",
  "User.username": "{{internet.userName}}",
  "User.website": "{{internet.url}}",
  "User.phone": "{{phone.number}}"
}
```
</details>

<details>
<summary><strong>🛍️ E-commerce</strong></summary>

```json
{
  "Product.name": "{{commerce.productName}}",
  "Product.price": "{{commerce.price}}",
  "Product.department": "{{commerce.department}}",
  "Product.material": "{{commerce.productMaterial}}"
}
```
</details>

<details>
<summary><strong>📍 Location</strong></summary>

```json
{
  "Address.street": "{{location.streetAddress}}",
  "Address.city": "{{location.city}}",
  "Address.country": "{{location.country}}",
  "Address.zipCode": "{{location.zipCode}}"
}
```
</details>

### 🌱 Seed Data Example

<details>
<summary><strong>Setting up seed data</strong></summary>

**1. Create seed files:**
```
seeds/
├── users.json        # Admin users, test accounts
├── categories.json   # Product categories  
└── settings.json     # App configuration
```

**2. Example seed file (`seeds/users.json`):**
```json
[
  {
    "id": 1,
    "email": "admin@company.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  },
  {
    "id": 2,
    "email": "demo@company.com", 
    "firstName": "Demo",
    "lastName": "User",
    "role": "USER"
  }
]
```

**3. Configure in your JSON config:**
```json
{
  "seedData": {
    "enabled": true,
    "seedDataPath": "./seeds/",
    "generateAdditionalRecords": true
  },
  "recordCounts": {
    "User": 25  // Will generate 23 more (25 - 2 seeds)
  }
}
```

</details>

---

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) for lightning-fast testing:

```bash
# Run tests in watch mode
npm test

# Run tests once  
npm run test:run

# Generate coverage report
npm run test:coverage
```

**Test Coverage:**
- ✅ Configuration validation
- ✅ Faker pattern evaluation  
- ✅ Seed data loading
- ✅ Record generation logic
- ✅ Error handling

---

## 🛠️ Generator Options

### In `schema.prisma`:

| Option | Description | Type | Default |
|--------|-------------|------|---------|
| `output` | Output directory | `string` | `./generated` |
| `config` | External config file path | `string` | `null` |

```prisma
generator json_server {
  provider = "prisma-json-server-generator"
  output   = "./api-data"
  config   = "./my-config.json" 
}
```

### In external config file:

| Option | Description | Type | Default |
|--------|-------------|------|---------|
| `outputFileName` | Generated JSON filename | `string` | `db.json` |
| `recordCounts` | Records per model | `Record<string,number>` | `{}` |
| `customPatterns` | Faker patterns | `Record<string,string>` | `{}` |
| `seedData` | Seed configuration | `object` | `{}` |

---

## 🎨 Real-World Examples

<details>
<summary><strong>🏪 E-commerce Store</strong></summary>

**Schema:**
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  firstName String
  lastName  String
  orders    Order[]
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  price       Float
  categoryId  Int
  category    Category @relation(fields: [categoryId], references: [id])
}

model Category {
  id       Int       @id @default(autoincrement())
  name     String
  products Product[]
}

model Order {
  id     Int  @id @default(autoincrement())
  userId Int
  user   User @relation(fields: [userId], references: [id])
  total  Float
}
```

**Configuration:**
```json
{
  "recordCounts": {
    "User": 100,
    "Product": 500, 
    "Category": 12,
    "Order": 1000
  },
  "customPatterns": {
    "User.email": "{{internet.email}}",
    "User.firstName": "{{person.firstName}}",
    "User.lastName": "{{person.lastName}}",
    "Product.name": "{{commerce.productName}}",
    "Product.price": "{{commerce.price}}",
    "Category.name": "{{commerce.department}}"
  }
}
```

**Generated API endpoints:**
- `GET /users` - Customer list
- `GET /products` - Product catalog
- `GET /categories` - Product categories
- `GET /orders` - Order history
- Full CRUD on all resources

</details>

<details>
<summary><strong>📱 Social Media App</strong></summary>

**Schema:**
```prisma
model User {
  id       Int    @id @default(autoincrement())
  username String @unique
  email    String @unique
  avatar   String?
  bio      String?
  posts    Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  imageUrl  String?
  likes     Int      @default(0)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}
```

**Configuration:**
```json
{
  "recordCounts": {
    "User": 200,
    "Post": 1000
  },
  "customPatterns": {
    "User.username": "{{internet.userName}}",
    "User.email": "{{internet.email}}",
    "User.avatar": "{{image.avatar}}",
    "User.bio": "{{lorem.sentence}}",
    "Post.title": "{{lorem.sentence}}",
    "Post.content": "{{lorem.paragraphs}}",
    "Post.imageUrl": "{{image.url}}",
    "Post.likes": "{{number.int({'min': 0, 'max': 500})}}"
  }
}
```

</details>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by [Omar Dulaimi](https://github.com/omar-dulaimi)**

⭐ **Don't forget to star this repo if you found it useful!** ⭐

</div>