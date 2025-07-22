import { v } from "convex/values";
import { internalMutation, internalQuery, query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// Create or ensure profile exists for a user (used in auth flow)
export const createOrEnsureProfile = internalMutation({
  args: {
    userId: v.id("users"),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, { userId, email, name }) => {
    // Check if profile already exists
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();

    if (existing) {
      return existing._id;
    }

    // Get default subscriber role
    const subscriberRole = await ctx.db
      .query("roles")
      .withIndex("by_slug", q => q.eq("slug", "subscriber"))
      .first();

    // Generate username from email or name
    const baseUsername = name 
      ? name.toLowerCase().replace(/[^a-z0-9]/g, '') 
      : email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    
    let username = baseUsername;
    let counter = 1;
    
    // Ensure username is unique
    while (await ctx.db
      .query("profiles")
      .withIndex("by_login", q => q.eq("user_login", username))
      .first()) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    const displayName = name || username;
    const nicename = username; // URL-friendly version

    // Create new profile
    const profileId = await ctx.db.insert("profiles", {
      userId,
      user_login: username,
      user_nicename: nicename,
      user_email: email,
      user_registered: Date.now(),
      display_name: displayName,
      roleId: subscriberRole?._id,
    });

    console.log(`✅ Created profile for user ${username} with subscriber role`);
    return profileId;
  },
});

// Get current user with full profile and role data
export const getCurrentUserFull = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Get auth user
    const authUser = await ctx.db.get(userId);
    if (!authUser) return null;

    // Get profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();

    if (!profile) return { authUser, profile: null, role: null };

    // Get role
    const role = profile.roleId ? await ctx.db.get(profile.roleId) : null;

    return {
      authUser,
      profile,
      role,
    };
  },
});

// List all users (admin only)
export const listUsers = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 20, offset = 0 }) => {
    // Require admin access
    await ctx.runQuery(internal.roles.requireRole, { roles: ["administrator"] });

    const profiles = await ctx.db
      .query("profiles")
      .order("desc")
      .collect();

    // Get roles for each profile
    const usersWithRoles = await Promise.all(
      profiles.slice(offset, offset + limit).map(async (profile) => {
        const role = profile.roleId ? await ctx.db.get(profile.roleId) : null;
        return {
          ...profile,
          role,
        };
      })
    );

    return {
      users: usersWithRoles,
      total: profiles.length,
      hasMore: offset + limit < profiles.length,
    };
  },
});

// Get user profile by ID
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();

    if (!profile) return null;

    const role = profile.roleId ? await ctx.db.get(profile.roleId) : null;
    
    return {
      ...profile,
      role,
    };
  },
});

// Update current user's profile
export const updateProfile = mutation({
  args: {
    display_name: v.optional(v.string()),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    bio: v.optional(v.string()),
    user_url: v.optional(v.string()),
    avatarId: v.optional(v.id("media")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Filter out undefined values
    const updates = Object.fromEntries(
      Object.entries(args).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(profile._id, updates);
    
    return { success: true };
  },
});

// Update user profile (admin only)
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    display_name: v.optional(v.string()),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    bio: v.optional(v.string()),
    user_url: v.optional(v.string()),
    user_email: v.optional(v.string()),
    avatarId: v.optional(v.id("media")),
  },
  handler: async (ctx, { userId, ...args }) => {
    // Require admin access
    await ctx.runQuery(internal.roles.requireRole, { roles: ["administrator"] });

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Filter out undefined values
    const updates = Object.fromEntries(
      Object.entries(args).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(profile._id, updates);
    
    return { success: true };
  },
});

// Delete user (admin only)
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    // Require admin access
    await ctx.runQuery(internal.roles.requireRole, { roles: ["administrator"] });

    // Don't allow admins to delete themselves
    const currentUserId = await getAuthUserId(ctx);
    if (currentUserId === userId) {
      throw new Error("Cannot delete your own account");
    }

    // Find and delete profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();

    if (profile) {
      await ctx.db.delete(profile._id);
    }

    // Note: userMeta table removed – no meta cleanup necessary

    // Note: We don't delete the auth user record as that's managed by Convex Auth
    
    return { success: true };
  },
});

// --- User Meta Operations (WordPress-style wp_usermeta) ---

// Get user meta value
export const getUserMeta = query({
  args: {
    userId: v.optional(v.id("users")), // Optional - defaults to current user
    meta_key: v.string(),
  },
  handler: async (ctx, { userId, meta_key }) => {
    const targetUserId = userId || await getAuthUserId(ctx);
    if (!targetUserId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", targetUserId))
      .first();

    return profile?.meta?.[meta_key] ?? null;
  },
});

// Get all meta for a user
export const getUserMetaAll = query({
  args: {
    userId: v.optional(v.id("users")), // Optional - defaults to current user
  },
  handler: async (ctx, { userId }) => {
    const targetUserId = userId || await getAuthUserId(ctx);
    if (!targetUserId) return {};

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", targetUserId))
      .first();

    return profile?.meta ?? {};
  },
});

// Set user meta value
export const setUserMeta = mutation({
  args: {
    userId: v.optional(v.id("users")), // Optional - defaults to current user
    meta_key: v.string(),
    meta_value: v.any(),
  },
  handler: async (ctx, { userId, meta_key, meta_value }) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Authentication required");
    }

    const targetUserId = userId || currentUserId;

    // If setting meta for another user, require admin access
    if (targetUserId !== currentUserId) {
      await ctx.runQuery(internal.roles.requireRole, { roles: ["administrator"] });
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", targetUserId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    const newMeta = { ...(profile.meta || {}) };
    newMeta[meta_key] = meta_value;

    await ctx.db.patch(profile._id, { meta: newMeta });

    return { success: true };
  },
});

// Delete user meta
export const deleteUserMeta = mutation({
  args: {
    userId: v.optional(v.id("users")), // Optional - defaults to current user
    meta_key: v.string(),
  },
  handler: async (ctx, { userId, meta_key }) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Authentication required");
    }

    const targetUserId = userId || currentUserId;

    // If deleting meta for another user, require admin access
    if (targetUserId !== currentUserId) {
      await ctx.runQuery(internal.roles.requireRole, { roles: ["administrator"] });
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", targetUserId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    if (!profile.meta || !(meta_key in profile.meta)) {
      // Nothing to delete
      return { success: true };
    }

    const { [meta_key]: _, ...remaining } = profile.meta;
    await ctx.db.patch(profile._id, { meta: remaining });

    return { success: true };
  },
});