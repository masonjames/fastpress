import { v } from "convex/values";
import { internalMutation, internalQuery, query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// WordPress-style default roles with appropriate permissions
const DEFAULT_ROLES = [
  {
    name: "Administrator",
    slug: "administrator",
    description: "Full access to all features and content management",
    permissions: [
      "manage_posts",
      "manage_pages", 
      "manage_categories",
      "manage_comments",
      "manage_media",
      "manage_users",
      "manage_roles",
      "manage_settings",
      "moderate_comments",
      "publish_posts",
      "edit_posts",
      "delete_posts",
      "read_private_posts"
    ]
  },
  {
    name: "Editor",
    slug: "editor", 
    description: "Can manage content but not users or site settings",
    permissions: [
      "manage_posts",
      "manage_pages",
      "manage_categories", 
      "manage_comments",
      "manage_media",
      "moderate_comments",
      "publish_posts",
      "edit_posts",
      "delete_posts",
      "read_private_posts"
    ]
  },
  {
    name: "Subscriber",
    slug: "subscriber",
    description: "View-only access to published content",
    permissions: [
      "read_posts"
    ]
  }
];

// Seed default roles on deployment (runs once)
export const seedDefaultRoles = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if roles already exist
    const existingRoles = await ctx.db.query("roles").collect();
    
    // Only seed if no roles exist
    if (existingRoles.length === 0) {
      for (const roleData of DEFAULT_ROLES) {
        await ctx.db.insert("roles", roleData);
      }
      console.log("✅ Seeded default WordPress-style roles: Administrator, Editor, Subscriber");
    } else {
      // Ensure default roles exist, create missing ones
      for (const roleData of DEFAULT_ROLES) {
        const existing = existingRoles.find(r => r.slug === roleData.slug);
        if (!existing) {
          await ctx.db.insert("roles", roleData);
          console.log(`✅ Created missing role: ${roleData.name}`);
        }
      }
    }
  },
});

// Get all available roles
export const getRoles = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("roles").collect();
  },
});

// Get role by slug
export const getRoleBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("roles")
      .withIndex("by_slug", q => q.eq("slug", slug))
      .first();
  },
});

// Security helper: require specific role(s) for the current user
export const requireRole = internalQuery({
  args: { 
    roles: v.array(v.string()) // Array of acceptable role slugs
  },
  handler: async (ctx, { roles }) => {
    // Get current authenticated user
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user's profile to check role
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();

    if (!profile || !profile.roleId) {
      throw new Error("Access denied: No role assigned");
    }

    // Get the user's role
    const userRole = await ctx.db.get(profile.roleId);
    if (!userRole) {
      throw new Error("Access denied: Invalid role");
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(userRole.slug)) {
      throw new Error(`Access denied: Requires one of: ${roles.join(", ")}`);
    }

    return {
      userId,
      role: userRole,
      profile
    };
  },
});

// Check if current user has specific permission
export const hasPermission = internalQuery({
  args: { 
    permission: v.string()
  },
  handler: async (ctx, { permission }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();

    if (!profile?.roleId) return false;

    const role = await ctx.db.get(profile.roleId);
    return role?.permissions.includes(permission) ?? false;
  },
});

// Assign role to user (admin only)
export const assignRole = mutation({
  args: { 
    userId: v.id("users"), 
    roleSlug: v.string() 
  },
  handler: async (ctx, { userId, roleSlug }) => {
    // Require admin access
    await ctx.runQuery(internal.roles.requireRole, { roles: ["administrator"] });

    // Find the role
    const role = await ctx.db
      .query("roles")
      .withIndex("by_slug", q => q.eq("slug", roleSlug))
      .first();

    if (!role) {
      throw new Error(`Role not found: ${roleSlug}`);
    }

    // Find and update the user's profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("User profile not found");
    }

    await ctx.db.patch(profile._id, { roleId: role._id });
    
    return { success: true, role: role.name };
  },
});