UPDATE public.donghua_catalog
SET
  payload = payload || jsonb_build_object(
    'knownTotalEpisodes', 165,
    'episodesSeason', 'Episodes 1–165+ | Ongoing',
    'anchorEpisode', 165,
    'anchorDate', '2026-11-01T13:00:00+03:00'
  ),
  updated_at = NOW()
WHERE id = 'renegade-immortal'
  AND payload ->> 'knownTotalEpisodes' = '165'
  AND payload ->> 'anchorEpisode' = '165';

UPDATE public.donghua_progress
SET
  current_episode = 165,
  last_updated = NOW()
WHERE current_episode = 167;