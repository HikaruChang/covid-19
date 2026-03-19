-- COVID-19.ICU D1 数据库 Schema
-- 合并原 backend (MySQL) + robot-wechaty 缓存

-- 住宿信息（医护人员免费住宿）
CREATE TABLE IF NOT EXISTS accommodations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  province TEXT,
  city TEXT,
  suburb TEXT,
  address TEXT,
  latitude REAL,
  longitude REAL,
  beds TEXT,
  room TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  notes TEXT,
  lin_bao_ru_zhu INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 武汉在外人员住宿
CREATE TABLE IF NOT EXISTS people_accommodations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  province TEXT,
  city TEXT,
  suburb TEXT,
  address TEXT,
  latitude REAL,
  longitude REAL,
  contact_name TEXT,
  contact_phone TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 线上心理咨询平台
CREATE TABLE IF NOT EXISTS psychological_platforms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  contact TEXT,
  province TEXT,
  city TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 线上医疗诊断平台
CREATE TABLE IF NOT EXISTS medical_platforms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  contact TEXT,
  province TEXT,
  city TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 医院物资需求
CREATE TABLE IF NOT EXISTS hospital_supplies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  province TEXT,
  city TEXT,
  suburb TEXT,
  address TEXT,
  patients TEXT,
  beds TEXT,
  contact_name TEXT,
  contact_org TEXT,
  contact_phone TEXT,
  pathways TEXT,
  logistic_status TEXT,
  source TEXT,
  proof TEXT,
  notes TEXT,
  verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 医院物资需求明细
CREATE TABLE IF NOT EXISTS hospital_supply_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supply_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  unit TEXT,
  need TEXT,
  daily TEXT,
  have TEXT,
  requirements TEXT,
  FOREIGN KEY (supply_id) REFERENCES hospital_supplies(id)
);

-- 社区物资需求
CREATE TABLE IF NOT EXISTS community_supplies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER,
  province TEXT,
  city TEXT,
  suburb TEXT,
  address TEXT,
  contact_phone TEXT,
  agent_name TEXT,
  agent_contact_phone TEXT,
  needs_vehicle INTEGER DEFAULT 0,
  notes TEXT,
  verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 社区物资需求明细
CREATE TABLE IF NOT EXISTS community_supply_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  community_supply_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('medical', 'live')),
  name TEXT NOT NULL,
  unit TEXT,
  need TEXT,
  daily TEXT,
  have TEXT,
  requirements TEXT,
  FOREIGN KEY (community_supply_id) REFERENCES community_supplies(id)
);

-- 信息纠错报告
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  cause TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 信息看板/实时消息
CREATE TABLE IF NOT EXISTS wiki_streams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT NOT NULL,
  source TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 疫情数据缓存（原 robot-wechaty CacheTools）
CREATE TABLE IF NOT EXISTS epidemic_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  area_type TEXT NOT NULL CHECK(area_type IN ('country', 'province', 'city')),
  name TEXT NOT NULL,
  short_name TEXT,
  parent_name TEXT,
  confirmed INTEGER DEFAULT 0,
  suspected INTEGER DEFAULT 0,
  cured INTEGER DEFAULT 0,
  dead INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(area_type, name)
);

-- 疫情订阅（原 robot-wechaty 订阅功能）
CREATE TABLE IF NOT EXISTS epidemic_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  city TEXT NOT NULL,
  subscriber_type TEXT NOT NULL CHECK(subscriber_type IN ('webhook', 'telegram')),
  subscriber_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(city, subscriber_type, subscriber_id)
);

-- 管理員帳號（多管理員支援，密碼以 PBKDF2 加密儲存）
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,   -- format: pbkdf2:sha256:100000:{salt_hex}:{hash_hex}
  display_name TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  last_login_at TEXT
);
