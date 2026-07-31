# SmolKV

> A lightweight **Log-Structured Merge (LSM) Tree** based key-value database built from scratch in **TypeScript**.

---

## ⋆˚꩜｡ About

SmolKV is a lightweight database project built to understand how modern key-value databases work internally.

It implements the core components of an LSM Tree storage engine including **Write-Ahead Logging (WAL)**, **MemTables**, **immutable SSTables**, **Manifest-based recovery**, **tombstone deletes**, **compaction**, **transactions**, an **HTTP API**, an **interactive CLI**, and **LSM Tree visualization**.

### Why this project?

SmolKV focuses on understanding **why databases are designed this way**—why writes go to a log first, why deletes use tombstones, why SSTables are immutable, and why compaction is essential in LSM-based storage engines.

---

## ⋆˚꩜｡ Architecture

<p align="center">
<img src="./image.png" width="900">
</p>

---

## ⋆˚꩜｡ How SmolKV Works

SmolKV follows a simplified **Log-Structured Merge (LSM) Tree** architecture.

- Every write (`put`/`delete`) is first appended to the **Write-Ahead Log (WAL)** for durability.
- The latest data is then stored in the in-memory **MemTable**.
- The **Index** keeps track of where every key currently lives (MemTable or SSTable).
- When the MemTable reaches its size limit, it is flushed into a new immutable **SSTable**.
- The **Manifest** records every SSTable along with the latest processed WAL offset.
- Reads always check the **MemTable** first, then use the **Index** to locate the correct SSTable.
- Deletes are represented using **tombstones** instead of immediately removing data.
- During startup, the engine reloads SSTables and replays unflushed WAL entries to recover recent writes.
- Periodically, **Compaction** merges SSTables, removes duplicate values and tombstones, and improves read performance.

---

## ⋆˚꩜｡ Project Structure

```text
smolkv/
├── src/
│   ├── engine.ts
│   ├── index.ts
│   ├── transaction.ts
│   ├── constants.ts
│   │
│   ├── api/
│   │   └── server.ts
│   │
│   ├── cli/
│   │   └── cli.ts
│   │
│   ├── memtable/
│   │   └── memtable.ts
│   │
│   └── storage/
│       ├── wal.ts
│       ├── sstable.ts
│       ├── manifest.ts
│       └── compactor.ts
│
├── tests/
├── data/
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⋆˚꩜｡ Features

### 1. Write-Ahead Log (WAL)

Before any write reaches memory, it is first appended to the WAL. If the application crashes before the MemTable is flushed, the WAL is replayed during recovery.

### 2. MemTable

An in-memory write buffer that stores the latest key-value pairs. Reads always check the MemTable first.

### 3. SSTables

Immutable sorted files written when the MemTable reaches its configured size.

### 4. Manifest

Tracks every SSTable and the latest processed WAL offset for recovery.

### 5. In-Memory Index

Maps every key to its latest location (MemTable or SSTable), avoiding full SSTable scans.

### 6. Crash Recovery

Rebuilds the Index from SSTables and replays only WAL entries written after the previous checkpoint.

### 7. Tombstones

Deletes are represented using tombstone markers and removed permanently during compaction.

### 8. Compaction

Merges multiple SSTables, removes duplicate values and tombstones, and improves read performance.

### 9. Transactions

Buffers operations until `commit()` is called. Calling `abort()` discards pending writes.

> Transaction support is currently available only through the Engine API.

### 10. REST API

Expose CRUD operations over HTTP using Express.

### 11. Interactive CLI

Insert, retrieve, delete, compact and inspect the database directly from the terminal.

### 12. LSM Tree Visualization

Displays the current MemTable, Index and SSTables after every CLI operation.

<p align="center">
<img src="./image-1.png" width="700">
</p>

---

## ⋆˚꩜｡ Getting Started

### Installation

```bash
npm install
```

---

### Run the HTTP API

```bash
npm run server
```

Server:

```text
http://localhost:3000
```

### Example Requests

Insert

```bash
curl -X POST http://localhost:3000/put \
-H "Content-Type: application/json" \
-d '{"key":"name","value":"YOUR_NAME"}'
```

Get

```bash
curl http://localhost:3000/get/name
```

Delete

```bash
curl -X DELETE http://localhost:3000/delete/name
```

Compact

```bash
curl -X POST http://localhost:3000/compact
```

---

### API Reference

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| POST   | `/put`         | Insert or update a key |
| GET    | `/get/:key`    | Retrieve a value       |
| DELETE | `/delete/:key` | Delete a key           |
| POST   | `/compact`     | Run compaction         |

---

## ⋆˚꩜｡ Using the CLI

Start the CLI

```bash
npm run cli
```

### Commands

| Command             | Description            |
| ------------------- | ---------------------- |
| `put <key> <value>` | Insert or update       |
| `get <key>`         | Retrieve a value       |
| `delete <key>`      | Delete a key           |
| `compact`           | Merge SSTables         |
| `show`              | Visualize the LSM Tree |
| `exit`              | Exit the CLI           |

---

### Example Session

```text
> put name YOUR_NAME
OK

> get name
YOUR_NAME

> show
┌─ LSM Tree State ─────────────────────
│ MemTable (RAM):
│   name → Ruchira
│
│ Index:
│   name → memtable
│
│ SSTables:
│   (none yet)
└──────────────────────────────────────
```

---

## ⋆˚꩜｡ Using SmolKV as a Library

```ts
import { KVEngine } from "./src/engine.js";

const db = new KVEngine();

db.recover();

db.put("name", "YOUR_NAME");

console.log(db.get("name"));

db.delete("name");
```

---

## ⋆˚꩜｡ Transactions

```ts
const tx = db.beginTransaction();

tx.put("a", "1");
tx.put("b", "2");

tx.commit();
```

Abort

```ts
const tx = db.beginTransaction();

tx.put("c", "99");

tx.abort();
```

> CLI and HTTP transaction support are planned for a future release.

---

## ⋆˚꩜｡ Running Tests

```bash
npx vitest run
```

---

## ⋆˚꩜｡ License

ISC
