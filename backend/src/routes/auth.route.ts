import { FastifyInstance } from 'fastify';
import { supabase } from '../config/database';

export default async function authRoutes(fastify: FastifyInstance) {
  // Register new user
  fastify.post('/register', async (request, reply) => {
    const { email, password, fullName } = request.body as {
      email: string;
      password: string;
      fullName: string;
    };

    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

      if (authError) {
        return reply.status(400).send({ error: authError.message });
      }

      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: authData.user.id,
        email: authData.user.email,
      });

      return { user: authData.user, token };
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Login user
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: data.user.id,
        email: data.user.email,
        isAdmin: profile?.is_admin || false,
      });

      return {
        user: data.user,
        profile,
        token,
        session: data.session,
      };
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get current user profile
  fastify.get('/me', {
    preHandler: [(fastify as any).authenticate],
  }, async (request, reply) => {
    const user = (request as any).user;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        return reply.status(404).send({ error: 'Profile not found' });
      }

      return { profile };
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Update user profile
  fastify.put('/profile', {
    preHandler: [(fastify as any).authenticate],
  }, async (request, reply) => {
    const user = (request as any).user;
    const updates = request.body as {
      full_name?: string;
      phone?: string;
      address?: string;
    };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return reply.status(400).send({ error: error.message });
      }

      return { profile: data };
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
}
