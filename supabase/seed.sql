-- Seed data for IndieGameBoost

-- Create user in auth
insert into auth.users (id, email)
values ('00000000-0000-0000-0000-000000000101', 'test@example.com');

-- Insert organization
INSERT INTO organizations (id, name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Pixel Pioneers');

-- Insert user (must match an existing auth.user id for testing)
INSERT INTO users (id, organization_id, role, full_name, avatar_url) VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'admin', 'Alice Dev', 'https://example.com/avatar.png');

-- Insert games
INSERT INTO games (id, organization_id, name, description, cover_image) VALUES
  ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000001', 'Retro Racer', 'A fast-paced pixel art racing game.', 'https://example.com/game1.png');

-- Insert email list
INSERT INTO email_lists (id, game_id, name) VALUES
  ('00000000-0000-0000-0000-000000003001', '00000000-0000-0000-0000-000000001001', 'Launch Subscribers');

-- Insert subscribers
INSERT INTO subscribers (id, email_list_id, email) VALUES
  ('00000000-0000-0000-0000-000000004001', '00000000-0000-0000-0000-000000003001', 'fan1@example.com'),
  ('00000000-0000-0000-0000-000000004002', '00000000-0000-0000-0000-000000003001', 'fan2@example.com');

-- Insert integration
INSERT INTO integrations (id, organization_id, platform, status) VALUES
  ('00000000-0000-0000-0000-000000007001', '00000000-0000-0000-0000-000000000001', 'twitter', 'connected');


-- Insert scheduled post
INSERT INTO scheduled_posts (id, game_id, content, media_url, scheduled_time, status) VALUES
  ('00000000-0000-0000-0000-000000005001', '00000000-0000-0000-0000-000000001001', '🚗 Retro Racer is coming April 7th! Wishlist now!', 'https://example.com/post1.png', '2025-04-03T12:00:00Z', 'scheduled');

-- Insert scheduled post target
INSERT INTO scheduled_post_targets (id, scheduled_post_id, platform, integration_id) VALUES
  ('00000000-0000-0000-0000-000000005002', '00000000-0000-0000-0000-000000005001', 'twitter', '00000000-0000-0000-0000-000000007001');

-- Insert post template
INSERT INTO post_templates (id, organization_id, platform, title, content, media_url) VALUES
  ('00000000-0000-0000-0000-000000006001', '00000000-0000-0000-0000-000000000001', 'twitter', 'Launch Tweet', 'Check out our new game! #gamedev', '');

-- Insert team invite
INSERT INTO team_invites (id, organization_id, email, status) VALUES
  ('00000000-0000-0000-0000-000000008001', '00000000-0000-0000-0000-000000000001', 'teammate@example.com', 'pending');
