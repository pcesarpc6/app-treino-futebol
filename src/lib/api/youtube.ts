// YouTube API via RapidAPI
import { YouTubeVideo } from '../types/exercise';

const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '0ac918be3bmsha94716c7ce02f08p1580fajsnf432928042c5';
const RAPIDAPI_HOST = 'yt-api.p.rapidapi.com';

interface YouTubeSearchResult {
  data?: Array<{
    videoId: string;
    title: string;
    description: string;
    thumbnail: Array<{ url: string }>;
    lengthSeconds: number;
    channelTitle: string;
  }>;
}

export async function searchYouTubeVideos(query: string): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/search?query=${encodeURIComponent(query)}&geo=BR`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const result: YouTubeSearchResult = await response.json();
    
    if (!result.data || result.data.length === 0) {
      return [];
    }

    // Filtrar vídeos com duração entre 30s e 5min (300s)
    const filteredVideos = result.data
      .filter(video => {
        const duration = video.lengthSeconds;
        return duration >= 30 && duration <= 300;
      })
      .map(video => ({
        videoId: video.videoId,
        title: video.title,
        description: video.description || '',
        thumbnail: video.thumbnail?.[0]?.url || '',
        duration: video.lengthSeconds,
        channelTitle: video.channelTitle || '',
      }));

    return filteredVideos;
  } catch (error) {
    console.error('Erro ao buscar vídeos no YouTube:', error);
    return [];
  }
}

export async function getVideoInfo(videoId: string): Promise<YouTubeVideo | null> {
  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/video/info?id=${videoId}&geo=BR`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const video = await response.json();

    return {
      videoId: video.id,
      title: video.title,
      description: video.description || '',
      thumbnail: video.thumbnail?.[0]?.url || '',
      duration: video.lengthSeconds,
      channelTitle: video.channelTitle || '',
    };
  } catch (error) {
    console.error('Erro ao obter informações do vídeo:', error);
    return null;
  }
}

// Buscar vídeo específico para exercício de futebol
export async function searchExerciseVideo(exerciseName: string, objective?: string): Promise<YouTubeVideo | null> {
  const queries = [
    `exercício de futebol ${exerciseName}`,
    `treino físico para futebol ${exerciseName}`,
    `exercício funcional para futebol ${exerciseName}`,
  ];

  if (objective) {
    queries.push(`treino físico para futebol ${objective}`);
  }

  for (const query of queries) {
    const videos = await searchYouTubeVideos(query);
    if (videos.length > 0) {
      return videos[0]; // Retorna o primeiro vídeo válido
    }
  }

  return null;
}
