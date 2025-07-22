import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password,
    Anonymous,
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { existingUserId, userId }) {
      // Seed roles if this is the first user
      await ctx.runMutation(internal.roles.seedDefaultRoles, {});

      // Get the user data
      const user = await ctx.db.get(userId);
      if (!user) return;

      // Create profile if it doesn't exist
      await ctx.runMutation(internal.users.createOrEnsureProfile, {
        userId,
        email: user.email || `user-${userId}@fastpress.local`,
        name: user.name,
      });
    },
  },
});

export const loggedInUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return user;
  },
});

// Get current user with full profile and role information
export const currentUserFull = query({
  args: {},
  handler: async (ctx): Promise<any> => {
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
    
    if (!profile) return { ...authUser, role: null };
    
    // Get role
    const role = profile.roleId ? await ctx.db.get(profile.roleId) : null;
    
    return {
      ...authUser,
      profile,
      role: role || null,
      roleSlug: role?.slug || null
    };
  },
});
