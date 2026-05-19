export const POINTS = {
  JOIN: 50,
  RSVP: 25,
  ATTEND_EVENT: 100,
  DONATE: 75,
  SUBMIT_PHOTO: 30,
  BECOME_AMBASSADOR: 200,
  REFERRAL_AWARD: 100,
  REFERRED_JOIN: 25,
  MONTHLY_GIVING: 50,
  SUBMIT_STORY: 30,
} as const

export type PointAction = keyof typeof POINTS

export async function awardPoints(
  supabase: ReturnType<typeof import('./supabase/server').createServiceClient>,
  userId: string,
  action: PointAction
): Promise<number> {
  const pointsToAdd = POINTS[action]

  const { data, error } = await supabase.rpc('increment_points', {
    user_id: userId,
    points_to_add: pointsToAdd,
  })

  if (error) {
    const { data: user } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single()

    const currentPoints = user?.points ?? 0
    await supabase
      .from('users')
      .update({ points: currentPoints + pointsToAdd })
      .eq('id', userId)
  }

  return pointsToAdd
}
