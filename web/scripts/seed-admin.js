#!/usr/bin/env node

import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function seedAdmin() {
  try {
    const username = process.env.ADMIN_INITIAL_USERNAME;
    const password = process.env.ADMIN_INITIAL_PASSWORD;
    const email = process.env.ADMIN_INITIAL_EMAIL;

    if (!username || !password) {
      throw new Error('ADMIN_INITIAL_USERNAME and ADMIN_INITIAL_PASSWORD environment variables are required');
    }

    console.log('🌱 Seeding initial admin user...');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email || 'Not provided'}`);

    // Check if admin already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admins')
      .select('id, username')
      .eq('username', username)
      .single();

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with this username');
      return;
    }

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create admin user
    const { data, error } = await supabase
      .from('admins')
      .insert([{
        username,
        email: email || null,
        password_hash: passwordHash,
        role: 'admin',
        is_active: true
      }])
      .select();

    if (error) {
      throw error;
    }

    console.log('✅ Admin user created successfully!');
    console.log('Admin ID:', data[0].id);
    console.log('Username:', data[0].username);
    console.log('Role:', data[0].role);

    // Log the creation
    await supabase
      .from('admin_audit_logs')
      .insert([{
        admin_id: data[0].id,
        action: 'admin_created',
        resource_type: 'admin',
        resource_id: data[0].id,
        details: { username, email },
        ip: undefined,
        user_agent: 'seed-script'
      }]);

    console.log('📝 Admin creation logged to audit trail');

  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
}

// Run the seed function
seedAdmin();
