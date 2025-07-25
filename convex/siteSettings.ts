import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const getSetting = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    
    if (!setting) return null;
    
    // Parse the value based on type
    switch (setting.type) {
      case "boolean":
        return setting.value === "true";
      case "number":
        return parseFloat(setting.value);
      case "json":
        return JSON.parse(setting.value);
      default:
        return setting.value;
    }
  },
});

export const setSetting = mutation({
  args: { 
    key: v.string(), 
    value: v.any(),
    type: v.optional(v.union(v.literal("string"), v.literal("number"), v.literal("boolean"), v.literal("json")))
  },
  handler: async (ctx, args) => {
    // Determine type if not provided
    let type = args.type;
    let value = args.value;
    
    if (!type) {
      if (typeof args.value === "boolean") {
        type = "boolean";
        value = args.value.toString();
      } else if (typeof args.value === "number") {
        type = "number";  
        value = args.value.toString();
      } else if (typeof args.value === "object") {
        type = "json";
        value = JSON.stringify(args.value);
      } else {
        type = "string";
        value = args.value.toString();
      }
    } else {
      value = args.value.toString();
    }

    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { value, type });
    } else {
      await ctx.db.insert("siteSettings", { key: args.key, value, type });
    }
  },
});

export const getCommentsEnabled = query({
  args: {},
  handler: async (ctx) => {
    const setting = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "commentsEnabledGlobally"))
      .unique();
    
    // Default to true if not set
    return setting ? setting.value === "true" : true;
  },
});

export const setCommentsEnabled = mutation({
  args: { enabled: v.boolean() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "commentsEnabledGlobally"))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { 
        value: args.enabled.toString(),
        type: "boolean" as const
      });
    } else {
      await ctx.db.insert("siteSettings", { 
        key: "commentsEnabledGlobally", 
        value: args.enabled.toString(),
        type: "boolean" as const
      });
    }
  },
});

export const getAllSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").collect();
    const result: Record<string, any> = {};
    
    for (const setting of settings) {
      switch (setting.type) {
        case "boolean":
          result[setting.key] = setting.value === "true";
          break;
        case "number":
          result[setting.key] = parseFloat(setting.value);
          break;
        case "json":
          try {
            result[setting.key] = JSON.parse(setting.value);
          } catch {
            result[setting.key] = setting.value;
          }
          break;
        default:
          result[setting.key] = setting.value;
      }
    }
    
    return result;
  },
});

export const saveMultipleSettings = mutation({
  args: { 
    settings: v.record(v.string(), v.any())
  },
  handler: async (ctx, { settings }) => {
    for (const [key, value] of Object.entries(settings)) {
      await ctx.runMutation(api.siteSettings.setSetting, { key, value });
    }
  },
});