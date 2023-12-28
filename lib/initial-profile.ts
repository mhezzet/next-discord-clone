import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { currentUser, redirectToSignIn } from '@clerk/nextjs'

export const initialProfile = async () => {
  const user = await currentUser()

  if (!user) {
    return redirectToSignIn()
  }

  const profile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.userId, user.id),
  })

  if (profile) {
    return profile
  }

  const name =
    user.firstName || user.lastName
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
      : user.username || user.emailAddresses[0].emailAddress.split('@')[0]

  const [newProfile] = await db
    .insert(profiles)
    .values({
      userId: user.id,
      name,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    })
    .returning()

  return newProfile
}
