
import { PubMedArticle } from '../types';

const BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

/**
 * Searches PubMed for articles matching the query.
 * Uses esearch.fcgi to get IDs and then esummary.fcgi to get details.
 */
export const searchPubMed = async (query: string): Promise<PubMedArticle[]> => {
  try {
    // 1. Search for IDs (Recent 5 articles, sorted by date)
    const searchUrl = `${BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json&retmax=5&sort=date`;
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) throw new Error('Falha na busca do PubMed');
    
    const searchData = await searchResponse.json();
    const ids = searchData.esearchresult?.idlist;

    if (!ids || ids.length === 0) {
      return [];
    }

    // 2. Fetch Summaries for these IDs
    const idsString = ids.join(',');
    const summaryUrl = `${BASE_URL}/esummary.fcgi?db=pubmed&id=${idsString}&retmode=json`;
    const summaryResponse = await fetch(summaryUrl);

    if (!summaryResponse.ok) throw new Error('Falha nos detalhes do PubMed');

    const summaryData = await summaryResponse.json();
    const articlesMap = summaryData.result;
    
    // Filter out the 'uids' list property from the result object
    const articles: PubMedArticle[] = ids.map((id: string) => {
        const item = articlesMap[id];
        return {
            uid: item.uid,
            title: item.title,
            source: item.source, // Journal Name
            pubdate: item.pubdate,
            authors: item.authors || [],
            volume: item.volume,
            url: `https://pubmed.ncbi.nlm.nih.gov/${item.uid}/`
        };
    });

    return articles;

  } catch (error) {
    console.error("PubMed API Error:", error);
    return [];
  }
};
