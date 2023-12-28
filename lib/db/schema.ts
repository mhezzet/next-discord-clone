import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { index, integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'

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
    inviteCode: text('inviteCode').notNull().unique(),
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

export const membersRelations = relations(members, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [members.profileId],
    references: [profiles.id],
  }),
  server: one(servers, {
    fields: [members.serverId],
    references: [servers.id],
  }),
  messages: many(messages),
  directMessages: many(directMessages),
  conversationsInitiated: many(conversations, { relationName: 'conversationsInitiated' }),
  conversationsReceived: many(conversations, { relationName: 'conversationsReceived' }),
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

export const channelsRelations = relations(channels, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [channels.profileId],
    references: [profiles.id],
  }),
  server: one(servers, {
    fields: [channels.serverId],
    references: [servers.id],
  }),
  messages: many(messages),
}))

export const messages = sqliteTable(
  'messages',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),

    content: text('content').notNull(),
    fileUrl: text('fileUrl'),

    memberId: text('memberId')
      .references(() => members.id, { onDelete: 'cascade' })
      .notNull(),

    channelId: text('channelId')
      .references(() => channels.id, { onDelete: 'cascade' })
      .notNull(),

    deleted: integer('deleted', { mode: 'boolean' }),

    createdAt: integer('createdAt', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    messagesMemberIdx: index('messagesMemberIdx').on(table.memberId),
    messagesChannelIdx: index('messagesChannelIdx').on(table.memberId),
  }),
)

export const messagesRelations = relations(messages, ({ one }) => ({
  member: one(members, {
    fields: [messages.memberId],
    references: [members.id],
  }),
  channel: one(channels, {
    fields: [messages.channelId],
    references: [channels.id],
  }),
}))

export const conversations = sqliteTable(
  'conversations',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),

    memberOneId: text('memberOneId')
      .references(() => members.id, { onDelete: 'cascade' })
      .notNull(),
    memberTwoId: text('memberTwoId')
      .references(() => members.id, { onDelete: 'cascade' })
      .notNull(),

    createdAt: integer('createdAt', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    conversationMemberOneIdx: index('conversationMemberOneIdx').on(table.memberOneId),
    conversationMemberTwoIdx: index('conversationMemberTwoIdx').on(table.memberTwoId),
    memberOneAndTwoUniq: unique('memberOneAndTwoUniq').on(table.memberOneId, table.memberTwoId),
  }),
)

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  memberOne: one(members, {
    fields: [conversations.memberOneId],
    references: [members.id],
    relationName: 'conversationsInitiated',
  }),
  memberTwo: one(members, {
    fields: [conversations.memberTwoId],
    references: [members.id],
    relationName: 'conversationsReceived',
  }),
  directMessages: many(directMessages),
}))

export const directMessages = sqliteTable(
  'directMessages',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),

    content: text('content').notNull(),
    fileUrl: text('fileUrl'),

    memberId: text('memberId')
      .references(() => members.id, { onDelete: 'cascade' })
      .notNull(),

    conversationId: text('conversationId')
      .references(() => conversations.id, { onDelete: 'cascade' })
      .notNull(),

    deleted: integer('deleted', { mode: 'boolean' }),

    createdAt: integer('createdAt', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    directMessagesMemberIdx: index('directMessagesMemberIdx').on(table.memberId),
    directMessagesConversationIdx: index('directMessagesConversationIdx').on(table.conversationId),
  }),
)

export const directMessagesRelations = relations(directMessages, ({ one }) => ({
  member: one(members, {
    fields: [directMessages.memberId],
    references: [members.id],
  }),
  conversations: one(conversations, {
    fields: [directMessages.conversationId],
    references: [conversations.id],
  }),
}))
