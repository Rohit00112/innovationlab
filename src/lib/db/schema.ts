import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

const timestampWithDefaults = (name: string) =>
  timestamp(name, { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull();

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "editor",
  "author",
  "viewer"
]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "invited",
  "disabled"
]);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    hashedPassword: text("hashed_password").notNull(),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    role: userRoleEnum("role").notNull().default("viewer"),
    status: userStatusEnum("status").notNull().default("active"),
    createdAt: timestampWithDefaults("created_at"),
    updatedAt: timestampWithDefaults("updated_at")
  },
  table => ({
    emailIdx: uniqueIndex("users_email_unique").on(table.email),
    statusIdx: index("users_status_idx").on(table.status)
  })
);

export const sessionStatusEnum = pgEnum("session_status", [
  "active",
  "revoked"
]);

export const userSessions = pgTable(
  "user_sessions",
  {
    id: serial("id").primaryKey(),
    tokenHash: text("token_hash").notNull(),
    status: sessionStatusEnum("status").notNull().default("active"),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    createdAt: timestampWithDefaults("created_at"),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull()
  },
  table => ({
    tokenIdx: uniqueIndex("user_sessions_token_hash_unique").on(table.tokenHash),
    userIdx: index("user_sessions_user_idx").on(table.userId)
  })
);

export const newsStatusEnum = pgEnum("news_status", [
  "draft",
  "scheduled",
  "published",
  "archived"
]);

export const news = pgTable(
  "news",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    coverImageUrl: text("cover_image_url"),
    status: newsStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "date" }),
    authorId: integer("author_id").references(() => users.id, {
      onDelete: "set null"
    }),
    createdAt: timestampWithDefaults("created_at"),
    updatedAt: timestampWithDefaults("updated_at")
  },
  table => ({
    slugIdx: uniqueIndex("news_slug_unique").on(table.slug),
    statusIdx: index("news_status_idx").on(table.status),
    authorIdx: index("news_author_idx").on(table.authorId)
  })
);

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "published",
  "cancelled"
]);

export const allowedRegistrationTypesEnum = pgEnum("allowed_registration_types", [
  "individual",
  "team",
  "both"
]);


export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    summary: text("summary"),
    description: text("description"),
    image: text("image"),
    location: text("location"),
    registrationUrl: text("registration_url"),
    isVirtual: boolean("is_virtual").notNull().default(false),
    hasRegistration: boolean("has_registration").notNull().default(true),
    allowedRegistrationTypes: allowedRegistrationTypesEnum("allowed_registration_types").notNull().default("both"),
    enableProposalSubmission: boolean("enable_proposal_submission").notNull().default(false),
    startsAt: timestamp("starts_at", { withTimezone: true, mode: "date" }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true, mode: "date" }),
    status: eventStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "date" }),
    organizerId: integer("organizer_id").references(() => users.id, {
      onDelete: "set null"
    }),
    parentEventId: integer("parent_event_id"),
    documents: json("documents"), // JSON of Array<{ title: string, url: string }>
    createdAt: timestampWithDefaults("created_at"),
    updatedAt: timestampWithDefaults("updated_at")
  },
  table => ({
    slugIdx: uniqueIndex("events_slug_unique").on(table.slug),
    statusIdx: index("events_status_idx").on(table.status),
    organizerIdx: index("events_organizer_idx").on(table.organizerId),
    startsAtIdx: index("events_starts_at_idx").on(table.startsAt),
    parentEventIdx: index("events_parent_event_idx").on(table.parentEventId)
  })
);

export const testimonialStatusEnum = pgEnum("testimonial_status", [
  "draft",
  "published",
  "archived"
]);

export const testimonials = pgTable(
  "testimonials",
  {
    id: serial("id").primaryKey(),
    headline: text("headline"),
    body: text("body").notNull(),
    authorName: text("author_name").notNull(),
    authorTitle: text("author_title"),
    company: text("company"),
    avatarUrl: text("avatar_url"),
    isFeatured: boolean("is_featured").notNull().default(false),
    status: testimonialStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "date" }),
    submittedById: integer("submitted_by_id").references(() => users.id, {
      onDelete: "set null"
    }),
    createdAt: timestampWithDefaults("created_at"),
    updatedAt: timestampWithDefaults("updated_at")
  },
  table => ({
    statusIdx: index("testimonials_status_idx").on(table.status),
    submitterIdx: index("testimonials_submitter_idx").on(table.submittedById),
    featuredIdx: index("testimonials_featured_idx").on(table.isFeatured)
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  news: many(news),
  events: many(events),
  testimonials: many(testimonials),
  sessions: many(userSessions),
  eventRegistrations: many(eventRegistrations),
  passwordResetTokens: many(passwordResetTokens)
}));

export const newsRelations = relations(news, ({ one }) => ({
  author: one(users, {
    fields: [news.authorId],
    references: [users.id]
  })
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id]
  }),
  registrations: many(eventRegistrations),
  parentEvent: one(events, {
    fields: [events.parentEventId],
    references: [events.id],
    relationName: "parentEvent"
  }),
  subEvents: many(events, {
    relationName: "parentEvent"
  })
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  submittedBy: one(users, {
    fields: [testimonials.submittedById],
    references: [users.id]
  })
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id]
  })
}));

// Event Registration System
export const registrationStatusEnum = pgEnum("registration_status", [
  "pending",
  "confirmed",
  "cancelled"
]);

export const registrationTypeEnum = pgEnum("registration_type", [
  "individual",
  "team"
]);

export const eventRegistrations = pgTable(
  "event_registrations",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    registrationType: registrationTypeEnum("registration_type").notNull().default("individual"),
    teamName: text("team_name"),
    participantName: text("participant_name").notNull(),
    participantEmail: text("participant_email").notNull(),
    participantPhone: text("participant_phone"),
    notes: text("notes"),
    teamMembers: text("team_members"), // JSON string of team members array
    proposalLink: text("proposal_link"), // URL to proposal document
    status: registrationStatusEnum("status").notNull().default("confirmed"),
    createdAt: timestampWithDefaults("created_at")
  },
  table => ({
    userEventIdx: uniqueIndex("event_registrations_user_event_unique").on(
      table.userId,
      table.eventId
    ),
    userIdx: index("event_registrations_user_idx").on(table.userId),
    eventIdx: index("event_registrations_event_idx").on(table.eventId),
    statusIdx: index("event_registrations_status_idx").on(table.status),
    typeIdx: index("event_registrations_type_idx").on(table.registrationType)
  })
);

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  user: one(users, {
    fields: [eventRegistrations.userId],
    references: [users.id]
  }),
  event: one(events, {
    fields: [eventRegistrations.eventId],
    references: [events.id]
  })
}));

// Password Reset Tokens
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true, mode: "date" }),
    createdAt: timestampWithDefaults("created_at")
  },
  table => ({
    tokenIdx: uniqueIndex("password_reset_tokens_token_hash_unique").on(table.tokenHash),
    userIdx: index("password_reset_tokens_user_idx").on(table.userId)
  })
);

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id]
  })
}));
