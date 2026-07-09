-- =========================================
-- 찾아줘노무사 데이터베이스 스키마 (PostgreSQL)
-- =========================================

-- 확장 기능
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================
-- 사용자 관련
-- =========================================

CREATE TYPE user_type AS ENUM ('worker', 'employer', 'attorney', 'admin');
CREATE TYPE auth_provider AS ENUM ('email', 'kakao', 'naver', 'google');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    user_type user_type NOT NULL DEFAULT 'worker',
    auth_provider auth_provider NOT NULL DEFAULT 'email',
    profile_image_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);

-- =========================================
-- 노무사 프로필
-- =========================================

CREATE TYPE attorney_status AS ENUM ('active', 'inactive', 'pending', 'suspended');

CREATE TABLE attorney_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    firm_name VARCHAR(200),
    introduction TEXT,
    career_years INTEGER DEFAULT 0,
    experience_summary TEXT,
    education TEXT,
    status attorney_status DEFAULT 'pending',
    is_online BOOLEAN DEFAULT FALSE,
    response_time_minutes INTEGER DEFAULT 30,
    chat_price INTEGER DEFAULT 30000,
    call_price INTEGER DEFAULT 50000,
    visit_price INTEGER DEFAULT 100000,
    region VARCHAR(100),
    address TEXT,
    website_url TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_attorney_profiles_user_id ON attorney_profiles(user_id);
CREATE INDEX idx_attorney_profiles_region ON attorney_profiles(region);
CREATE INDEX idx_attorney_profiles_status ON attorney_profiles(status);

-- 노무사 전문분야
CREATE TABLE attorney_specialties (
    id SERIAL PRIMARY KEY,
    attorney_id UUID NOT NULL REFERENCES attorney_profiles(id) ON DELETE CASCADE,
    specialty VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_attorney_specialties_attorney_id ON attorney_specialties(attorney_id);
CREATE INDEX idx_attorney_specialties_specialty ON attorney_specialties(specialty);

-- =========================================
-- 상담 관련
-- =========================================

CREATE TYPE consultation_type AS ENUM ('chat', 'call', 'visit', 'qna');
CREATE TYPE consultation_status AS ENUM ('pending', 'matched', 'in_progress', 'completed', 'cancelled', 'refunded');
CREATE TYPE consultation_topic AS ENUM (
    '임금체불', '퇴직금', '부당해고', '직장내괴롭힘', '성희롱',
    '산업재해', '실업급여', '근로계약', '4대보험', '취업규칙',
    '정부지원금', '육아휴직', '연장근로수당', '기타'
);

CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    attorney_id UUID REFERENCES attorney_profiles(id),
    type consultation_type NOT NULL DEFAULT 'chat',
    status consultation_status NOT NULL DEFAULT 'pending',
    topic consultation_topic,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    price INTEGER DEFAULT 0,
    payment_id VARCHAR(255),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_attorney_id ON consultations(attorney_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_topic ON consultations(topic);

-- 채팅 메시지
CREATE TYPE sender_type AS ENUM ('user', 'attorney', 'system');

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    sender_type sender_type NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    file_url TEXT,
    file_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_consultation_id ON chat_messages(consultation_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- =========================================
-- 후기
-- =========================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID NOT NULL REFERENCES consultations(id),
    user_id UUID NOT NULL REFERENCES users(id),
    attorney_id UUID NOT NULL REFERENCES attorney_profiles(id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    content TEXT NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    helpful_count INTEGER DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_attorney_id ON reviews(attorney_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- 후기 도움됨
CREATE TABLE review_helpful (
    id SERIAL PRIMARY KEY,
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, user_id)
);

-- =========================================
-- 노무 Q&A 게시판
-- =========================================

CREATE TYPE qna_status AS ENUM ('pending', 'answered', 'closed');

CREATE TABLE qna_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    category consultation_topic,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    status qna_status DEFAULT 'pending',
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_qna_posts_category ON qna_posts(category);
CREATE INDEX idx_qna_posts_status ON qna_posts(status);
CREATE INDEX idx_qna_posts_created_at ON qna_posts(created_at DESC);

CREATE TABLE qna_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES qna_posts(id) ON DELETE CASCADE,
    attorney_id UUID NOT NULL REFERENCES attorney_profiles(id),
    content TEXT NOT NULL,
    is_best_answer BOOLEAN DEFAULT FALSE,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_qna_answers_post_id ON qna_answers(post_id);

-- =========================================
-- 근로계약서
-- =========================================

CREATE TYPE contract_type AS ENUM ('regular', 'fixed_term', 'parttime', 'freelance', 'senior');
CREATE TYPE contract_status AS ENUM ('draft', 'sent', 'signed', 'expired');

CREATE TABLE labor_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    contract_type contract_type NOT NULL DEFAULT 'regular',
    status contract_status DEFAULT 'draft',
    company_name VARCHAR(200),
    employer_name VARCHAR(100),
    worker_name VARCHAR(100),
    worker_birth DATE,
    position VARCHAR(200),
    duties TEXT,
    start_date DATE,
    end_date DATE,
    monthly_salary INTEGER,
    pay_day INTEGER,
    work_hours_per_week INTEGER DEFAULT 40,
    break_time_minutes INTEGER DEFAULT 60,
    work_days VARCHAR(20)[],
    workplace_address TEXT,
    probation_months INTEGER DEFAULT 0,
    annual_leave_days INTEGER DEFAULT 15,
    pdf_url TEXT,
    kakao_sent_at TIMESTAMP WITH TIME ZONE,
    signed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_labor_contracts_user_id ON labor_contracts(user_id);

-- =========================================
-- 블로그
-- =========================================

CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES users(id),
    category VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    thumbnail_url TEXT,
    emoji VARCHAR(10),
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    read_time_minutes INTEGER DEFAULT 5,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- =========================================
-- 수수료 비교 견적
-- =========================================

CREATE TYPE quote_status AS ENUM ('open', 'responded', 'accepted', 'closed');

CREATE TABLE fee_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    topic consultation_topic NOT NULL,
    description TEXT NOT NULL,
    budget_min INTEGER,
    budget_max INTEGER,
    status quote_status DEFAULT 'open',
    deadline_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE fee_quote_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID NOT NULL REFERENCES fee_quotes(id) ON DELETE CASCADE,
    attorney_id UUID NOT NULL REFERENCES attorney_profiles(id),
    proposed_price INTEGER NOT NULL,
    message TEXT,
    is_selected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(quote_id, attorney_id)
);

-- =========================================
-- 결제
-- =========================================

CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'partial_refunded');
CREATE TYPE payment_method AS ENUM ('card', 'bank_transfer', 'kakao_pay', 'naver_pay', 'toss_pay', 'points');

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    consultation_id UUID REFERENCES consultations(id),
    amount INTEGER NOT NULL,
    fee_amount INTEGER DEFAULT 0,
    net_amount INTEGER NOT NULL,
    status payment_status DEFAULT 'pending',
    method payment_method,
    pg_transaction_id VARCHAR(255),
    pg_response JSONB,
    refunded_amount INTEGER DEFAULT 0,
    refunded_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_consultation_id ON payments(consultation_id);
CREATE INDEX idx_payments_status ON payments(status);

-- =========================================
-- 알림
-- =========================================

CREATE TYPE notification_type AS ENUM (
    'consultation_matched', 'message_received', 'review_request',
    'payment_completed', 'attorney_online', 'system_notice'
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- =========================================
-- 포인트/쿠폰
-- =========================================

CREATE TYPE point_type AS ENUM ('earned', 'used', 'refunded', 'expired', 'admin_grant');

CREATE TABLE point_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    type point_type NOT NULL,
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description VARCHAR(500),
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_point_transactions_user_id ON point_transactions(user_id);

-- =========================================
-- 앱 다운로드 SMS
-- =========================================

CREATE TABLE app_sms_logs (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET
);

-- =========================================
-- 통계 집계 뷰 (materialized)
-- =========================================

CREATE MATERIALIZED VIEW attorney_stats AS
SELECT
    ap.id AS attorney_id,
    COUNT(DISTINCT c.id) AS total_consultations,
    COUNT(DISTINCT r.id) AS total_reviews,
    ROUND(AVG(r.rating), 2) AS avg_rating,
    SUM(r.helpful_count) AS total_helpful,
    COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'completed') AS completed_consultations
FROM attorney_profiles ap
LEFT JOIN consultations c ON c.attorney_id = ap.id
LEFT JOIN reviews r ON r.attorney_id = ap.id
GROUP BY ap.id;

CREATE UNIQUE INDEX ON attorney_stats(attorney_id);

-- Refresh command (run periodically):
-- REFRESH MATERIALIZED VIEW CONCURRENTLY attorney_stats;

-- =========================================
-- 트리거: updated_at 자동 갱신
-- =========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_attorney_profiles_updated_at BEFORE UPDATE ON attorney_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_consultations_updated_at BEFORE UPDATE ON consultations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_labor_contracts_updated_at BEFORE UPDATE ON labor_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_fee_quotes_updated_at BEFORE UPDATE ON fee_quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================================
-- 기본 시드 데이터
-- =========================================

-- 시스템 어드민 계정
INSERT INTO users (email, name, user_type, is_verified, is_active)
VALUES ('admin@findnomusa.com', '관리자', 'admin', TRUE, TRUE);
