// Supabase Edge Function: Create Admin User
// This function creates a user account without requiring email verification
// It uses the service role key server-side for security

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Supabase automatically provides these environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

        // Verify we have the required environment variables
        if (!supabaseUrl || !supabaseAnonKey) {
            return new Response(
                JSON.stringify({ error: 'Server configuration error' }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Create Supabase admin client with service role key (server-side only)
        // The service role key must be set as a secret: supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
        const supabaseAdmin = createClient(
            supabaseUrl,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // Verify we have the service role key
        if (!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
            return new Response(
                JSON.stringify({ error: 'Service role key not configured' }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Parse request body
        const { email, password, firstName, lastName, userRole } = await req.json()

        // Validate required fields
        if (!email || !password || !firstName || !lastName || !userRole) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: email, password, firstName, lastName, userRole' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return new Response(
                JSON.stringify({ error: 'Invalid email format' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Validate password length
        if (password.length < 6) {
            return new Response(
                JSON.stringify({ error: 'Password must be at least 6 characters' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Check if email already exists
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
        const emailExists = existingUser?.users?.some(user => user.email === email)

        if (emailExists) {
            return new Response(
                JSON.stringify({ error: 'This email is already registered' }),
                {
                    status: 409,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Create user with Admin API (bypasses email verification)
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true, // Auto-confirm email - bypasses verification
            user_metadata: {
                first_name: firstName,
                last_name: lastName,
                is_active: true,
                user_role: userRole
            }
        })

        if (error) {
            console.error('Error creating user:', error)
            return new Response(
                JSON.stringify({ error: error.message || 'Failed to create user' }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Return success response
        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    id: data.user.id,
                    email: data.user.email,
                    user_role: userRole
                }
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        console.error('Unexpected error:', error)
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})

