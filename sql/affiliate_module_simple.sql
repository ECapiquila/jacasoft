CREATE TABLE bc_affiliate_partners (
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

CREATE TABLE bc_affiliate_clicks (
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
  KEY idx_aff_click_ref (ref_code),
  KEY idx_aff_click_object (object_model, object_id)
);

CREATE TABLE bc_affiliate_commissions (
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

CREATE TABLE bc_affiliate_withdrawals (
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

CREATE TABLE bc_affiliate_coupons (
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

CREATE TABLE bc_affiliate_payouts (
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
