# Specification

## Summary
**Goal:** Add a care activity logging system to track horse care tasks like thrush checks, baths, tail washes, fungus checks, and hives.

**Planned changes:**
- Add CareActivity type to backend with fields for id, horseId, careType (user-entered text), timestamp, and userId
- Create stable careActivities HashMap with auto-incrementing IDs
- Implement logCareActivity function to create care records and getCareActivitiesForHorse query to retrieve them
- Update deleteHorse to cascade delete associated care activities
- Create CareForm component with text input for care type and submit button
- Create CareList component to display care activities with timestamps
- Add useLogCareActivity mutation and useCareActivities query hooks
- Add Care tab to HorseDetailPage displaying CareForm and CareList
- Update useActivityTimeline hook to include care activities in merged timeline
- Update ActivityTimelineItem component to display care activities with appropriate icon

**User-visible outcome:** Users can log custom care activities (like "thrush check", "bath", "tail wash") for each horse, view care history in a dedicated Care tab, and see care activities integrated into the unified activity timeline.
