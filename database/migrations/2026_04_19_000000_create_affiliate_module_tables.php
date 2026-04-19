<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bc_affiliate_partners', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->string('affiliate_code', 32)->unique();
            $table->string('status', 20)->default('pending')->index();
            $table->string('full_name');
            $table->string('phone', 30)->nullable();
            $table->string('payment_method', 50);
            $table->text('payment_details');
            $table->string('commission_type', 20)->default('percent');
            $table->decimal('commission_value', 12, 2)->default(10);
            $table->unsignedInteger('total_bookings')->default(0);
            $table->decimal('total_earnings', 14, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('bc_affiliate_clicks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('affiliate_id')->index();
            $table->string('ref_code', 32)->index();
            $table->string('object_model', 191)->nullable();
            $table->unsignedBigInteger('object_id')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('session_id', 191)->nullable();
            $table->timestamps();
        });

        Schema::create('bc_affiliate_commissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('affiliate_id')->index();
            $table->unsignedBigInteger('booking_id')->index();
            $table->unsignedBigInteger('booking_customer_id')->nullable()->index();
            $table->string('commission_type', 20);
            $table->decimal('commission_value', 12, 2);
            $table->decimal('booking_amount', 14, 2);
            $table->decimal('commission_amount', 14, 2);
            $table->string('status', 20)->default('pending')->index();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            $table->unique(['affiliate_id', 'booking_id']);
        });

        Schema::create('bc_affiliate_withdrawals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('affiliate_id')->index();
            $table->decimal('amount', 14, 2);
            $table->string('status', 20)->default('pending')->index();
            $table->text('admin_note')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        Schema::create('bc_affiliate_coupons', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('affiliate_id')->index();
            $table->string('coupon_code', 60)->unique();
            $table->string('discount_type', 20)->default('percent');
            $table->decimal('discount_value', 12, 2);
            $table->timestamp('valid_from')->nullable();
            $table->timestamp('valid_to')->nullable();
            $table->string('status', 20)->default('active')->index();
            $table->timestamps();
        });

        Schema::create('bc_affiliate_payouts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('withdrawal_id')->index();
            $table->string('provider', 50)->default('manual');
            $table->string('status', 20)->default('pending')->index();
            $table->string('external_reference', 120)->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->text('provider_payload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bc_affiliate_payouts');
        Schema::dropIfExists('bc_affiliate_coupons');
        Schema::dropIfExists('bc_affiliate_withdrawals');
        Schema::dropIfExists('bc_affiliate_commissions');
        Schema::dropIfExists('bc_affiliate_clicks');
        Schema::dropIfExists('bc_affiliate_partners');
    }
};
