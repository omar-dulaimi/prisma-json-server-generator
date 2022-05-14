[![npm version](https://badge.fury.io/js/prisma-json-server-generator.svg)](https://badge.fury.io/js/prisma-json-server-generator)
[![npm](https://img.shields.io/npm/dt/prisma-json-server-generator.svg)](https://www.npmjs.com/package/prisma-json-server-generator)
[![HitCount](https://hits.dwyl.com/omar-dulaimi/prisma-json-server-generator.svg?style=flat)](http://hits.dwyl.com/omar-dulaimi/prisma-json-server-generator)
[![npm](https://img.shields.io/npm/l/prisma-json-server-generator.svg)](LICENSE)

<p align="center">
  <a href="https://github.com/omar-dulaimi/prisma-json-server-generator">
    <img src="https://raw.githubusercontent.com/omar-dulaimi/prisma-json-server-generator/master/logo.png" alt="Logo" width="120" height="120">
  </a>
  <h3 align="center">Prisma JSON Server Generator</h3>
  <p align="center">
    A Prisma generator that automates creating a JSON file that can be run as a server from your Prisma schema.
    <br />
    <a href="https://github.com/omar-dulaimi/prisma-json-server-generator#additional-options"><strong>Explore the options »</strong></a>
    <br />
    <br />
    <a href="https://github.com/omar-dulaimi/prisma-json-server-generator/issues/new?template=bug_report.yml">Report Bug</a>
    ·
    <a href="https://github.com/omar-dulaimi/prisma-json-server-generator/issues/new?template=feature_request.md">Request Feature</a>
  </p>
</p>

## Table of Contents

- [About The Project](#about-the-project)
- [Installation](#installation)
- [Usage](#usage)
- [Additional Options](#additional-options)
- [Community](#community)
- [Acknowledgement](#acknowledgement)

# About The Project

Automatically generate a JSON file that can be run as a server from your [Prisma](https://github.com/prisma/prisma) Schema. Updates every time `npx prisma generate` runs.

# Installation

Using npm:

```bash
 npm install prisma-json-server-generator
```

Using yarn:

```bash
 yarn add prisma-json-server-generator
```

# Usage

1- Star this repo 😉

2- Add the generator to your Prisma schema

```prisma
generator json_server {
  provider       = "prisma-json-server-generator"
  outputFileName = "jsonFile.json"
}
```

3- Install `json-server`

```bash
npm install -g json-server
```

4- Run `npx prisma generate` for the following schema.prisma, or your schema

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?
  published Boolean  @default(false)
  viewCount Int      @default(0)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}
```

5- Now you're ready to run your JSON server!

```bash
json-server --watch db.json
```

# Additional Options

| Option           |  Description                                                 | Type      |  Default      |
| ---------------- | ------------------------------------------------------------ | --------- | ------------- |
| `output`         | Output directory for the generated JSON server file          | `string`  | `./generated` |
| `outputFileName` | JSON output file name                                        | `string`  | `db.json`     |

Use additional options in the `schema.prisma`

```prisma
generator json_server {
  provider       = "prisma-json-server-generator"
  output         = "./json-server"
}
```
# Community
[![Stargazers repo roster for @omar-dulaimi/prisma-json-server-generator](https://reporoster.com/stars/omar-dulaimi/prisma-json-server-generator)](https://github.com/omar-dulaimi/prisma-json-server-generator/stargazers)

# Acknowledgement 

Source of one of the icons used in making the logo: <a href="https://www.flaticon.com/free-icons/json" title="json icons">Json icons created by Smashicons - Flaticon</a>