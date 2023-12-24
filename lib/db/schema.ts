import { relations } from 'drizzle-orm'
import { text, integer, sqliteTable, index } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'

export const profiles = sqliteTable('profiles', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  userId: text('userId').unique().notNull(),
  name: text('name').notNull(),
  imageUrl: text('imageUrl').notNull(),
  email: text('email').notNull(),

  createdAt: integer('createdAt', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
})

export const profilesRelations = relations(profiles, ({ many }) => ({
  servers: many(servers),
  members: many(members),
  channels: many(channels),
}))

export const servers = sqliteTable(
  'servers',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),

    name: text('name').notNull(),
    imageUrl: text('imageUrl').notNull(),
    inviteCode: text('inviteCode').notNull(),
    profileId: text('profileId')
      .references(() => profiles.id, { onDelete: 'cascade' })
      .notNull(),

    createdAt: integer('createdAt', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    serversProfileIdx: index('serversProfileIdx').on(table.profileId),
  }),
)

export const serversRelations = relations(servers, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [servers.profileId],
    references: [profiles.id],
  }),
  members: many(members),
  channels: many(channels),
}))

export const members = sqliteTable(
  'members',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),

    role: text('role', { enum: ['ADMIN', 'MODERATOR', 'GUEST'] }).notNull(),
    profileId: text('profileId')
      .references(() => profiles.id, { onDelete: 'cascade' })
      .notNull(),
    serverId: text('serverId')
      .references(() => servers.id, { onDelete: 'cascade' })
      .notNull(),

    createdAt: integer('createdAt', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    membersProfileIdx: index('membersProfileIdx').on(table.profileId),
    membersServerIdx: index('membersServerIdx').on(table.serverId),
  }),
)

export const membersRelations = relations(members, ({ one }) => ({
  profile: one(profiles, {
    fields: [members.profileId],
    references: [profiles.id],
  }),
  server: one(servers, {
    fields: [members.serverId],
    references: [servers.id],
  }),
}))

export const channels = sqliteTable(
  'channels',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),

    name: text('name').notNull(),
    type: text('type', { enum: ['TEXT', 'AUDIO', 'VIDEO'] }).notNull(),
    profileId: text('profileId')
      .references(() => profiles.id, { onDelete: 'cascade' })
      .notNull(),
    serverId: text('serverId')
      .references(() => servers.id, { onDelete: 'cascade' })
      .notNull(),

    createdAt: integer('createdAt', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    channelsProfileIdx: index('channelsProfileIdx').on(table.profileId),
    channelsServerIdx: index('channelsServerIdx').on(table.serverId),
  }),
)

export const channelsRelations = relations(channels, ({ one }) => ({
  profile: one(profiles, {
    fields: [channels.profileId],
    references: [profiles.id],
  }),
  server: one(servers, {
    fields: [channels.serverId],
    references: [servers.id],
  }),
}))
