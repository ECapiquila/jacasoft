-- Script seguro para produção (MySQL 8+)
CREATE TABLE IF NOT EXISTS bc_affiliate_partners (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  affiliate_code VARCHAR(32) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  full_name VARCHAR(191) NOT NULL,
  phone VARCHAR(30) NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_details TEXT NOT NULL,
  commission_type VARCHAR(20) NOT NULL DEFAULT 'percent',
  commission_value DECIMAL(12,2) NOT NULL DEFAULT 10,
  total_bookings INT UNSIGNED NOT NULL DEFAULT 0,
  total_earnings DECIMAL(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  UNIQUE KEY uq_aff_partner_user (user_id),
  UNIQUE KEY uq_aff_partner_code (affiliate_code),
  KEY idx_aff_partner_status (status)
);

CREATE TABLE IF NOT EXISTS bc_affiliate_clicks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  affiliate_id BIGINT UNSIGNED NOT NULL,
  ref_code VARCHAR(32) NOT NULL,
  object_model VARCHAR(191) NULL,
  object_id BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  session_id VARCHAR(191) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  KEY idx_aff_click_affiliate (affiliate_id),
  KEY idx_aff_click_ref (ref_code)
);

CREATE TABLE IF NOT EXISTS bc_affiliate_commissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  affiliate_id BIGINT UNSIGNED NOT NULL,
  booking_id BIGINT UNSIGNED NOT NULL,
  booking_customer_id BIGINT UNSIGNED NULL,
  commission_type VARCHAR(20) NOT NULL,
  commission_value DECIMAL(12,2) NOT NULL,
  booking_amount DECIMAL(14,2) NOT NULL,
  commission_amount DECIMAL(14,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  approved_at TIMESTAMP NULL,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  UNIQUE KEY uq_aff_commission_booking (affiliate_id, booking_id),
  KEY idx_aff_commission_status (status)
);

CREATE TABLE IF NOT EXISTS bc_affiliate_withdrawals (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  affiliate_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  admin_note TEXT NULL,
  approved_at TIMESTAMP NULL,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  KEY idx_aff_withdraw_affiliate (affiliate_id),
  KEY idx_aff_withdraw_status (status)
);

CREATE TABLE IF NOT EXISTS bc_affiliate_coupons (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  affiliate_id BIGINT UNSIGNED NOT NULL,
  coupon_code VARCHAR(60) NOT NULL,
  discount_type VARCHAR(20) NOT NULL DEFAULT 'percent',
  discount_value DECIMAL(12,2) NOT NULL,
  valid_from TIMESTAMP NULL,
  valid_to TIMESTAMP NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  UNIQUE KEY uq_aff_coupon_code (coupon_code),
  KEY idx_aff_coupon_affiliate (affiliate_id)
);

CREATE TABLE IF NOT EXISTS bc_affiliate_payouts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  withdrawal_id BIGINT UNSIGNED NOT NULL,
  provider VARCHAR(50) NOT NULL DEFAULT 'manual',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  external_reference VARCHAR(120) NULL,
  processed_at TIMESTAMP NULL,
  provider_payload TEXT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  KEY idx_aff_payout_withdrawal (withdrawal_id),
  KEY idx_aff_payout_status (status)
);

-- FK condicionais via INFORMATION_SCHEMA
SET @has_users := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bc_users');
SET @has_bookings := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bc_bookings');
SET @has_partners := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bc_affiliate_partners');
SET @has_withdrawals := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bc_affiliate_withdrawals');

SET @sql := IF(@has_users > 0 AND @has_partners > 0,
    'ALTER TABLE bc_affiliate_partners ADD CONSTRAINT fk_aff_partner_user FOREIGN KEY (user_id) REFERENCES bc_users(id)',
    'SELECT "SKIP fk_aff_partner_user"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := IF(@has_partners > 0,
    'ALTER TABLE bc_affiliate_clicks ADD CONSTRAINT fk_aff_click_partner FOREIGN KEY (affiliate_id) REFERENCES bc_affiliate_partners(id)',
    'SELECT "SKIP fk_aff_click_partner"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := IF(@has_partners > 0,
    'ALTER TABLE bc_affiliate_commissions ADD CONSTRAINT fk_aff_comm_partner FOREIGN KEY (affiliate_id) REFERENCES bc_affiliate_partners(id)',
    'SELECT "SKIP fk_aff_comm_partner"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := IF(@has_bookings > 0,
    'ALTER TABLE bc_affiliate_commissions ADD CONSTRAINT fk_aff_comm_booking FOREIGN KEY (booking_id) REFERENCES bc_bookings(id)',
    'SELECT "SKIP fk_aff_comm_booking"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := IF(@has_partners > 0,
    'ALTER TABLE bc_affiliate_withdrawals ADD CONSTRAINT fk_aff_withdraw_partner FOREIGN KEY (affiliate_id) REFERENCES bc_affiliate_partners(id)',
    'SELECT "SKIP fk_aff_withdraw_partner"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := IF(@has_withdrawals > 0,
    'ALTER TABLE bc_affiliate_payouts ADD CONSTRAINT fk_aff_payout_withdrawal FOREIGN KEY (withdrawal_id) REFERENCES bc_affiliate_withdrawals(id)',
    'SELECT "SKIP fk_aff_payout_withdrawal"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
