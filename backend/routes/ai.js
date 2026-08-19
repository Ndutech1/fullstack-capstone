const express = require('express');

const router = express.Router();

const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

// OpenRouter API
const OPENROUTER_URL = Buffer.from(
  'aHR0cHM6Ly9vcGVucm91dGVyLmFpL2FwaS92MS9jaGF0L2NvbXBsZXRpb25z',
  'base64'
).toString('utf8');

// TMDB movie search API
const TMDB_SEARCH_URL = Buffer.from(
  'aHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9zZWFyY2gvbW92aWU=',
  'base64'
).toString('utf8');

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const sanitize = (str) =>
  String(str || '')
    .replace(/[\r\n\t"'\s]/g, '')
    .trim();

/**
 * Converts the AI response into the format
 * expected by the application.
 *
 * The AI may return either:
 *
 * {
 *   recommendations: [...]
 * }
 *
 * or:
 *
 * {
 *   movies: [...]
 * }
 */
const parseRecommendations = (content) => {
  if (!content) {
    throw new Error('AI returned an empty response');
  }

  let data;

  try {
    data =
      typeof content === 'string'
        ? JSON.parse(content)
        : content;
  } catch (error) {
    console.error('[AI Raw Response]', content);

    throw new Error(
      `AI returned invalid JSON: ${error.message}`
    );
  }

  if (!data || typeof data !== 'object') {
    throw new Error(
      'AI returned an invalid response object'
    );
  }

  let movieList = [];

  // Preferred format
  if (Array.isArray(data.recommendations)) {
    console.log(
      '[AI Parser] Found recommendations array'
    );

    movieList = data.recommendations;
  }

  // Model sometimes returns "movies"
  else if (Array.isArray(data.movies)) {
    console.log(
      '[AI Parser] Found movies array'
    );

    movieList = data.movies;
  }

  else {
    console.error(
      '[AI Parsed Response]',
      data
    );

    throw new Error(
      'AI returned neither recommendations nor movies'
    );
  }

  // --------------------------------------------------
  // Normalize AI output
  // --------------------------------------------------

  const recommendations = movieList
    .filter(
      (item) =>
        item &&
        typeof item.title === 'string' &&
        item.title.trim().length > 0
    )
    .slice(0, 5)
    .map((item) => {
      let year = '';

      if (Number.isInteger(item.year)) {
        year = item.year;
      } else if (
        typeof item.year === 'string' &&
        /^\d{4}$/.test(item.year.trim())
      ) {
        year = Number(item.year.trim());
      }

      const why =
        typeof item.why === 'string' &&
        item.why.trim().length > 0
          ? item.why.trim()
          : typeof item.description === 'string' &&
            item.description.trim().length > 0
          ? item.description.trim()
          : 'A strong match for your mood.';

      return {
        title: item.title.trim(),
        year,
        why,
      };
    });

  if (recommendations.length === 0) {
    throw new Error(
      'AI returned no valid movie recommendations'
    );
  }

  console.log(
    `[AI Parser] Normalized ${recommendations.length} movies`
  );

  return recommendations;
};

// --------------------------------------------------
// POST /suggest
// --------------------------------------------------

router.post('/suggest', async (req, res) => {
  const prompt = String(
    req.body?.prompt || ''
  ).trim();

  // ------------------------------------------------
  // Validate prompt
  // ------------------------------------------------

  if (!prompt) {
    return res.status(400).json({
      message:
        'Tell us what you are in the mood for.',
    });
  }

  if (prompt.length > 500) {
    return res.status(400).json({
      message:
        'Please keep your prompt under 500 characters.',
    });
  }

  // ------------------------------------------------
  // Environment variables
  // ------------------------------------------------

  const tmdbKey = sanitize(
    process.env.TMDB_API ||
    process.env.TMDB_API_KEY
  );

  const openRouterKey = sanitize(
    process.env.OPENROUTER_API_KEY
  );

  if (!openRouterKey || !tmdbKey) {
    console.error(
      '[AI Route Config Error] Missing API keys in .env'
    );

    return res.status(503).json({
      message:
        'AI recommendations are not configured yet.',
    });
  }

  // ------------------------------------------------
  // Cache
  // ------------------------------------------------

  const cacheKey = prompt.toLowerCase();

  const cached = cache.get(cacheKey);

  if (
    cached &&
    Date.now() - cached.createdAt < CACHE_TTL_MS
  ) {
    console.log(
      '[AI Route] Returning cached result'
    );

    return res.json({
      ...cached.data,
      cached: true,
    });
  }

  try {
    // ------------------------------------------------
    // Model
    // ------------------------------------------------

    const model =
      sanitize(
        process.env.OPENROUTER_MODEL
      ) ||
      'openai/gpt-oss-20b:free';

    console.log(
      `[AI Route] Sending request via model: ${model}`
    );

    // ------------------------------------------------
    // OpenRouter request
    // ------------------------------------------------

    const response = await fetch(
      OPENROUTER_URL,
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${openRouterKey}`,

          'Content-Type':
            'application/json',

          'HTTP-Referer':
            process.env.APP_URL ||
            'http://localhost:5173',

          'X-Title':
            process.env.APP_NAME ||
            'Movie Recommendation App',
        },

        body: JSON.stringify({
          model,

          temperature: 0.2,

          max_tokens: 1200,

          // Allow OpenRouter to use another
          // provider if the current one fails.
          provider: {
            allow_fallbacks: true,
          },

          // We require JSON, but the backend
          // performs the final validation.
          response_format: {
            type: 'json_object',
          },

          messages: [
            {
              role: 'system',

              content:
                'You are a movie recommendation API. ' +
                'Recommend exactly 5 real movies based on the user mood. ' +
                'Return ONLY valid JSON. ' +
                'Use this structure: ' +
                '{"movies":[{"title":"Movie title","year":2020,"genre":"Genre","description":"Short description"}]}. ' +
                'Do not include Markdown. ' +
                'Do not include text before or after the JSON.',
            },

            {
              role: 'user',

              content:
                `Recommend 5 movies for this mood: ${prompt}`,
            },
          ],
        }),
      }
    );

    // ------------------------------------------------
    // Handle OpenRouter errors
    // ------------------------------------------------

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        '[OpenRouter Error]',
        errorText
      );

      if (response.status >= 500) {
        throw new Error(
          `OpenRouter provider failure (${response.status})`
        );
      }

      throw new Error(
        `OpenRouter request failed (${response.status}): ${errorText}`
      );
    }

    // ------------------------------------------------
    // Read OpenRouter response
    // ------------------------------------------------

    const aiData =
      await response.json();

    console.log(
      '[AI Route] Served by model:',
      aiData?.model || model
    );

    console.log(
      '[AI Route] Finish reason:',
      aiData?.choices?.[0]?.finish_reason
    );

    const message =
      aiData?.choices?.[0]?.message;

    if (!message) {
      console.error(
        '[AI Route] Missing AI message:',
        JSON.stringify(
          aiData,
          null,
          2
        )
      );

      throw new Error(
        'OpenRouter returned no AI message'
      );
    }

    const content =
      message.content;

    console.log(
      '[AI Route] AI response received:',
      content
    );

    if (!content) {
      throw new Error(
        'AI returned an empty message'
      );
    }

    // ------------------------------------------------
    // Normalize AI recommendations
    // ------------------------------------------------

    const recommendations =
      parseRecommendations(content);

    console.log(
      `[AI Route] Successfully received ${recommendations.length} recommendations`
    );

    // ------------------------------------------------
    // Search TMDB
    // ------------------------------------------------

    const searches =
      await Promise.all(
        recommendations.map(
          async (recommendation) => {
            if (!recommendation.title) {
              return null;
            }

            try {
              const queryParams =
                new URLSearchParams({
                  api_key: tmdbKey,
                  query:
                    recommendation.title,
                });

              if (
                recommendation.year &&
                Number.isInteger(
                  recommendation.year
                )
              ) {
                queryParams.append(
                  'year',
                  String(
                    recommendation.year
                  )
                );
              }

              const tmdbRes =
                await fetch(
                  `${TMDB_SEARCH_URL}?${queryParams.toString()}`
                );

              if (!tmdbRes.ok) {
                throw new Error(
                  `HTTP ${tmdbRes.status}`
                );
              }

              const tmdbData =
                await tmdbRes.json();

              const movie =
                tmdbData?.results?.[0];

              if (!movie) {
                console.warn(
                  `[TMDB] No movie found for "${recommendation.title}"`
                );

                return null;
              }

              // TMDB provides the actual
              // movie information.
              //
              // AI provides the reason.
              return {
                ...movie,
                aiReason:
                  recommendation.why,
              };
            } catch (error) {
              console.error(
                `TMDB lookup failed for "${recommendation.title}":`,
                error.message
              );

              return null;
            }
          }
        )
      );

    // ------------------------------------------------
    // Build final response
    // ------------------------------------------------

    const data = {
      recommendations,

      movies:
        searches.filter(Boolean),

      cached: false,
    };

    // ------------------------------------------------
    // Cache
    // ------------------------------------------------

    cache.set(
      cacheKey,
      {
        createdAt:
          Date.now(),

        data,
      }
    );

    // ------------------------------------------------
    // Return response
    // ------------------------------------------------

    return res.json(data);

  } catch (error) {
    console.error(
      '[AI Route Error]',
      error.message
    );

    return res.status(502).json({
      message:
        'The recommendation service is temporarily unavailable. Please try again.',
    });
  }
});

module.exports = router;