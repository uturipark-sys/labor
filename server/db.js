import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import bcrypt from 'bcryptjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, '..', 'data', 'nomusa.db')

import { mkdirSync } from 'fs'
try { mkdirSync(join(__dirname, '..', 'data'), { recursive: true }) } catch {}

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'user',  -- user | attorney | admin
      profile_image TEXT,
      points INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime')),
      updated_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS attorney_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      license_number TEXT UNIQUE,
      firm_name TEXT,
      introduction TEXT,
      career_years INTEGER DEFAULT 0,
      region TEXT,
      address TEXT,
      is_online INTEGER DEFAULT 0,
      is_approved INTEGER DEFAULT 0,
      response_time INTEGER DEFAULT 30,
      chat_price INTEGER DEFAULT 30000,
      call_price INTEGER DEFAULT 50000,
      visit_price INTEGER DEFAULT 100000,
      free_first INTEGER DEFAULT 1,
      available_from TEXT DEFAULT '09:00',
      available_to TEXT DEFAULT '18:00',
      available_days TEXT DEFAULT '["월","화","수","목","금"]',
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS attorney_specialties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attorney_id INTEGER NOT NULL REFERENCES attorney_profiles(id) ON DELETE CASCADE,
      specialty TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      attorney_id INTEGER REFERENCES attorney_profiles(id),
      type TEXT DEFAULT 'chat',
      status TEXT DEFAULT 'pending',
      topic TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      price INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime')),
      updated_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      consultation_id INTEGER NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
      sender_id INTEGER NOT NULL REFERENCES users(id),
      sender_role TEXT NOT NULL,
      content TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      consultation_id INTEGER NOT NULL REFERENCES consultations(id),
      user_id INTEGER NOT NULL REFERENCES users(id),
      attorney_id INTEGER NOT NULL REFERENCES attorney_profiles(id),
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      content TEXT NOT NULL,
      helpful_count INTEGER DEFAULT 0,
      category TEXT,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS qna_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      category TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      view_count INTEGER DEFAULT 0,
      is_anonymous INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS qna_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL REFERENCES qna_posts(id) ON DELETE CASCADE,
      attorney_id INTEGER NOT NULL REFERENCES attorney_profiles(id),
      content TEXT NOT NULL,
      is_best INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    );
  `)

  // 기본 어드민 + 샘플 데이터 시드
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@nomusa.com')
  if (!adminExists) {
    const hash = bcrypt.hashSync('admin1234', 10)
    db.prepare(`INSERT INTO users (email, password, name, role) VALUES (?,?,?,?)`).run('admin@nomusa.com', hash, '관리자', 'admin')

    // 샘플 노무사
    const attorneys = [
      { email: 'kim@nomusa.com', name: '김민준', firm: '한울 노무법인', region: '서울 강남구', years: 12, intro: '근로자 권익 보호 전문. 임금체불, 부당해고 분쟁에서 높은 승소율을 자랑합니다.', chat: 30000, specialties: ['임금체불', '부당해고', '산재'] },
      { email: 'lee@nomusa.com', name: '이수진', firm: '서울 노무사 사무소', region: '서울 서초구', years: 8, intro: '직장 내 괴롭힘, 성희롱 피해자를 위한 법적 지원 전문 노무사입니다.', chat: 25000, specialties: ['직장내괴롭힘', '성희롱', '노동위원회'] },
      { email: 'park@nomusa.com', name: '박성호', firm: '더나은 노무컨설팅', region: '서울 마포구', years: 15, intro: '사업주를 위한 인사노무 관리, 취업규칙 작성 및 4대보험 신고 전문입니다.', chat: 40000, specialties: ['4대보험', '취업규칙', '인사노무'] },
    ]

    const pw = bcrypt.hashSync('test1234', 10)
    for (const a of attorneys) {
      const u = db.prepare(`INSERT INTO users (email, password, name, role) VALUES (?,?,?,?)`).run(a.email, pw, a.name, 'attorney')
      const prof = db.prepare(`INSERT INTO attorney_profiles (user_id, firm_name, introduction, career_years, region, chat_price, is_approved, is_online) VALUES (?,?,?,?,?,?,1,1)`).run(u.lastInsertRowid, a.firm, a.intro, a.years, a.region, a.chat)
      for (const s of a.specialties) {
        db.prepare(`INSERT INTO attorney_specialties (attorney_id, specialty) VALUES (?,?)`).run(prof.lastInsertRowid, s)
      }
    }

    // 샘플 일반 유저
    const user = db.prepare(`INSERT INTO users (email, password, name, phone) VALUES (?,?,?,?)`).run('user@test.com', pw, '홍길동', '010-1234-5678')
  }

  console.log('✅ DB initialized')
}

export default db
