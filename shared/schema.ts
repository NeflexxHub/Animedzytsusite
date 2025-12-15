import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const genres = pgTable("genres", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const insertGenreSchema = createInsertSchema(genres).pick({
  name: true,
  slug: true,
});

export type InsertGenre = z.infer<typeof insertGenreSchema>;
export type Genre = typeof genres.$inferSelect;

export const anime = pgTable("anime", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleOriginal: text("title_original"),
  description: text("description").notNull(),
  poster: text("poster").notNull(),
  backdrop: text("backdrop"),
  rating: real("rating").notNull().default(0),
  year: integer("year").notNull(),
  status: text("status").notNull().default("ongoing"),
  episodeCount: integer("episode_count").notNull().default(0),
  genres: text("genres").array().notNull().default(sql`'{}'::text[]`),
  studio: text("studio"),
  duration: text("duration"),
  type: text("type").notNull().default("TV"),
});

export const insertAnimeSchema = createInsertSchema(anime).omit({
  id: true,
});

export type InsertAnime = z.infer<typeof insertAnimeSchema>;
export type Anime = typeof anime.$inferSelect;

export const episodes = pgTable("episodes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animeId: varchar("anime_id").notNull(),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail"),
  duration: text("duration"),
  videoUrl: text("video_url").notNull(),
  filler: boolean("filler").default(false),
});

export const insertEpisodeSchema = createInsertSchema(episodes).omit({
  id: true,
});

export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
export type Episode = typeof episodes.$inferSelect;

export const animeFilters = z.object({
  genres: z.array(z.string()).optional(),
  year: z.number().optional(),
  yearFrom: z.number().optional(),
  yearTo: z.number().optional(),
  status: z.enum(["ongoing", "completed", "announced"]).optional(),
  type: z.enum(["TV", "Movie", "OVA", "ONA", "Special"]).optional(),
  sort: z.enum(["rating", "year", "title", "newest"]).optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type AnimeFilters = z.infer<typeof animeFilters>;
