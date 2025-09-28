"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSupabase = exports.AuthServiceSupabase = exports.validateSupabaseEnvironment = exports.validateSupabaseConnection = exports.supabaseUser = exports.supabase = void 0;
// Re-export centralized Supabase configuration with service-specific operations
var supabase_1 = require("@shared/supabase");
Object.defineProperty(exports, "supabase", { enumerable: true, get: function () { return supabase_1.getSupabaseClient; } });
Object.defineProperty(exports, "supabaseUser", { enumerable: true, get: function () { return supabase_1.getSupabaseUserClient; } });
Object.defineProperty(exports, "validateSupabaseConnection", { enumerable: true, get: function () { return supabase_1.validateSupabaseConnection; } });
Object.defineProperty(exports, "validateSupabaseEnvironment", { enumerable: true, get: function () { return supabase_1.validateSupabaseEnvironment; } });
Object.defineProperty(exports, "AuthServiceSupabase", { enumerable: true, get: function () { return supabase_1.AuthServiceSupabase; } });
// Create service instance for easy use
exports.authSupabase = new AuthServiceSupabase();
//# sourceMappingURL=supabase.js.map