# Voyage Proposal Voting Roadmap

This roadmap breaks the feature into small implementation challenges. The goal is to build a proposal system where logged-in users can vote on future voyages, and approved proposals can be promoted into the main voyage roster.

## Feature Goal

Users can register, log in, view proposed voyages, vote once per proposal, and see voting results. When a proposal closes, it can be promoted into the main `voyages` collection if approved votes are higher than rejected votes.

## Core Decision

Use JWT auth instead of anonymous browser voting.

Why:
- A real `user_id` makes one-vote-per-user validation much cleaner.
- Votes can be tied to users without relying on cookies, IP addresses, or browser storage.
- Auth is reusable for future features like bookings, profiles, admin tools, and saved voyages.

Tradeoff:
- This makes the feature bigger because auth must be built first.
- It is better practice and creates a stronger backend foundation.

## Mini Challenge 1: User Model

- [ ] Create a `User` Beanie document.
- [ ] Add fields:
  - `email`
  - `username`
  - `hashed_password`
  - `created_at`
- [ ] Add request models:
  - `UserRegister`
  - `UserLogin`
  - `UserPublic`
- [ ] Add validators:
  - Trim and lowercase email.
  - Trim username.
  - Require a minimum password length.
- [ ] Register the `User` document in `server/database.py`.

Done when:
- The app can initialize Beanie with the new `User` collection.
- The user model does not expose `hashed_password` in public responses.

## Mini Challenge 2: Password Hashing

- [ ] Add password hashing utilities.
- [ ] Use a library like `passlib[bcrypt]`.
- [ ] Create helper functions:
  - `hash_password(password: str) -> str`
  - `verify_password(password: str, hashed_password: str) -> bool`

Done when:
- Plain text passwords are never stored.
- Login can compare a submitted password against a stored hash.

## Mini Challenge 3: JWT Utilities

- [ ] Add JWT config values:
  - `JWT_SECRET_KEY`
  - `JWT_ALGORITHM`
  - `JWT_EXPIRE_MINUTES`
- [ ] Store secrets in `server/.env`.
- [ ] Create JWT helper functions:
  - `create_access_token(user_id: str) -> str`
  - `decode_access_token(token: str)`
- [ ] Add `python-jose` or another JWT library.

Done when:
- The server can create a signed token for a user.
- The server can decode that token and recover the user id.

## Mini Challenge 4: Auth Routes

- [ ] Create a new route file:
  - `server/routes/auth.py`
- [ ] Add routes:
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /auth/me`
- [ ] Include the auth router in `server/main.py`.
- [ ] Return an access token from register and login.
- [ ] Return the current public user from `/auth/me`.

Done when:
- A user can register.
- A user can log in.
- A valid JWT can fetch the current user.
- Invalid or expired tokens return `401`.

## Mini Challenge 5: Auth Dependency

- [ ] Create a reusable dependency like `get_current_user`.
- [ ] Read the `Authorization: Bearer <token>` header.
- [ ] Decode the JWT.
- [ ] Fetch the matching user from MongoDB.
- [ ] Raise `401` if the token is missing, invalid, expired, or points to a deleted user.

Done when:
- Any route can require login by adding `current_user = Depends(get_current_user)`.

## Mini Challenge 6: Proposal Model

- [ ] Create a `VoyageProposal` Beanie document.
- [ ] Add fields similar to `Voyage`:
  - `proposal_id`
  - `name`
  - `description`
  - `origin`
  - `destination`
  - `difficulty`
  - `recommendedShip`
  - `reward`
  - `imageUrlKey`
- [ ] Add proposal-specific fields:
  - `status`: `open`, `approved`, `rejected`, or `promoted`
  - `closes_at`
  - `created_at`
- [ ] Register the document in `server/database.py`.

Done when:
- The database has a separate collection for proposed voyages.
- A proposal can exist without being part of the active voyage roster.

## Mini Challenge 7: Proposal Vote Model

- [ ] Create a `VoyageProposalVote` Beanie document.
- [ ] Add fields:
  - `proposal_id`
  - `user_id`
  - `vote`: `approved` or `rejected`
  - `created_at`
  - `updated_at`
- [ ] Add a unique index for:
  - `proposal_id`
  - `user_id`

Done when:
- The database prevents the same user from creating two vote records for the same proposal.

## Mini Challenge 8: Proposal Routes

- [ ] Create a route file:
  - `server/routes/voyage_proposals.py`
- [ ] Add routes:
  - `GET /voyage-proposals`
  - `GET /voyage-proposals/{proposal_id}`
- [ ] Include vote counts in responses:
  - `approved_votes`
  - `rejected_votes`
- [ ] If the user is logged in, include their vote:
  - `user_vote`

Done when:
- The frontend can list proposed voyages.
- A logged-in user can see how they already voted.

## Mini Challenge 9: Voting Route

- [ ] Add route:
  - `POST /voyage-proposals/{proposal_id}/vote`
- [ ] Require JWT auth.
- [ ] Accept payload:

```json
{
  "vote": "approved"
}
```

- [ ] Validate that the proposal exists.
- [ ] Validate that the proposal status is `open`.
- [ ] Validate that `closes_at` has not passed.
- [ ] Create or update the user's vote.

Done when:
- A logged-in user can vote once per proposal.
- Voting again updates their existing vote instead of adding a duplicate.

## Mini Challenge 10: Close Proposal Logic

- [ ] Add service logic to close a proposal.
- [ ] Count approved and rejected votes.
- [ ] If approved votes are higher, mark the proposal as `approved`.
- [ ] If rejected votes are equal or higher, mark it as `rejected`.
- [ ] Do not allow votes after close.

Done when:
- A proposal can move out of `open` status based on vote totals.

## Mini Challenge 11: Promote Approved Proposal

- [ ] Add logic to copy an approved proposal into the `voyages` collection.
- [ ] Generate or assign a new `voyage_id`.
- [ ] Mark the proposal as `promoted`.
- [ ] Prevent promoting the same proposal twice.

Done when:
- An approved proposal becomes a real voyage returned by `GET /voyages`.

## Mini Challenge 12: Frontend Auth

- [ ] Add register form.
- [ ] Add login form.
- [ ] Store the JWT on the client.
- [ ] Add logout.
- [ ] Fetch `/auth/me` to restore the session on page reload.

Done when:
- The UI knows whether a user is logged in.
- Logged-in requests include the JWT.

## Mini Challenge 13: Frontend Proposal View

- [ ] Add a proposal section or app view.
- [ ] Fetch `GET /voyage-proposals`.
- [ ] Render proposal cards.
- [ ] Show:
  - Proposal name
  - Description
  - Vote counts
  - Closing date
  - Current user vote
- [ ] Add approve and reject buttons.

Done when:
- Users can browse proposals from the UI.

## Mini Challenge 14: Frontend Voting Flow

- [ ] Require login before voting.
- [ ] Send `POST /voyage-proposals/{proposal_id}/vote`.
- [ ] Update the proposal counts after voting.
- [ ] Show clear states:
  - User has not voted
  - User voted approved
  - User voted rejected
  - Proposal is closed

Done when:
- Voting works from the UI and reflects the user's current vote.

## Mini Challenge 15: Seed Proposal Data

- [ ] Create 3-4 starter proposals.
- [ ] Keep them separate from current voyages.
- [ ] Use existing image keys where possible.
- [ ] Give each proposal a short voting window for testing.

Example proposal ideas:
- `Europa Signal Survey`
- `Vesper Gate Supply Run`
- `Helios Wreckage Recovery`
- `Nebula Orchard Expedition`

Done when:
- The proposal page has useful data without manually creating records every time.

## Suggested Build Order

1. User model
2. Password hashing
3. JWT utilities
4. Auth routes
5. Auth dependency
6. Proposal model
7. Vote model
8. Proposal list/detail routes
9. Voting route
10. Close proposal logic
11. Promotion logic
12. Frontend auth
13. Frontend proposal view
14. Frontend voting flow
15. Seed proposal data

## Important Validation Rules

- Users must be logged in to vote.
- One user can only have one active vote per proposal.
- A user can change their vote while the proposal is open.
- Votes are blocked after `closes_at`.
- Closed proposals cannot be voted on.
- Only approved proposals can be promoted.
- A promoted proposal cannot be promoted again.

## Future Improvements

- Add admin-only routes for creating proposals.
- Add scheduled proposal closing.
- Add email verification.
- Add refresh tokens.
- Add user profile pages.
- Add vote history for each user.
- Add proposal comments.
- Add minimum vote threshold before promotion.
- Add role-based permissions for closing and promoting proposals.
