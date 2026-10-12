# Street Challenge — agreed player-flow rules (October 12, 2026)

These rules apply to Street, Neighborhood, City and State Challenges. Use **Challenge**, never **cleanup**, in game-facing text.

## Account and profiles
- One verified email account can own multiple family-player profiles. Each has a separate avatar, Challenge progress, awards and point totals.
- After the sign-in email link, show profile choice when multiple profiles exist. Returning to the same trusted browser should restore the authenticated account without repeating email sign-in while the session remains valid.
- Switch Player changes the active profile without signing out; Log Out ends the authentication session. Neither action erases progress.
- Exit leaves the game while retaining the account session and current Challenge status.

## The Challenge button
- One **Challenge** action. If an unfinished Challenge exists, resume that exact player's saved state.
- If their previous Challenge was Finished, start the next Challenge at **Are You Ready?**. Do not make players choose Resume vs New.
- Switching between levels retains the same account/profile, with independent appropriate level progress.

## Progress
- Save important mutations to the authenticated server-side player and Challenge records as they occur. Never rely on pagehide/unload to guarantee a write.
- Show a retryable error when server saving fails; do not claim progress is saved before confirmation.
- Closing Safari, navigating away, or tapping Exit must **not** mark a Challenge Finished.
- **Finished** is explicit and only available once that Challenge's end conditions are met. Treat it as an idempotent, authenticated server operation: prevent double points/rewards; retain completion history and finish time.
- After Finished, show **Your Hero Rewards!** with this Challenge's awards and lifetime totals, followed by **Challenge** for the next adventure.
- No Save button and no Save & Exit button.

## Safety and rollout
- Do not delete or rewrite existing Tricia player profiles or records.
- Do not touch Track It, Community in Action or Scenic Discoveries.
- Current game challenge API persists equipment and ready state but has no Finished action; a schema-backed completion operation is required before enabling the button. Existing weekly challenge participation must not be silently considered Finished.
- Test: two profiles under one email, one different account on another device, reload during equipment, Exit vs Log Out, switch players, Finished once only, rewards, restart and score isolation.
