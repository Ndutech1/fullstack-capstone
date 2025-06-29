const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API;

router.post('/suggest', async (req, res) => {
  const { prompt } = req.body;
  console.log('Prompt Received:', prompt);

  if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

  try {
    const aiResponse = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'mistralai/mistral-7b-instruct',
      messages: [{ role: 'user', content: `Only reply with the movie title for this description: ${prompt}` }],
      max_tokens: 20,
    }, {
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
    });

    console.log('AI Raw Response:', aiResponse.data);

    let aiSuggestion = aiResponse.data.choices[0]?.message?.content?.trim();
    if (!aiSuggestion) throw new Error('AI returned no suggestion');

    console.log('AI Suggested:', aiSuggestion);

    // Extract title inside quotes if present
    const titleMatch = aiSuggestion.match(/["“”'](.+?)["“”']/);
    const movieTitle = titleMatch ? titleMatch[1] : aiSuggestion;

    console.log('Clean Movie Title:', movieTitle);

    const tmdbResponse = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: { api_key: TMDB_API_KEY, query: movieTitle },
    });

    res.json({
      suggestion: movieTitle,
      movies: tmdbResponse.data.results,
    });

  } catch (err) {
    console.error('AI Route Error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to fetch movie suggestions' });
  }
});

module.exports = router;
