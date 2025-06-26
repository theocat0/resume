import { customBlocks } from "../data/customBlocks";
class AIService {
  constructor() {
    this.customBlocks = [...customBlocks];
  }
    

  addCustomBlock(category, title, content) {
    const newId = this.customBlocks.length + 1;
    this.customBlocks.push({
      id: newId,
      category,
      title,
      content
    });
    console.log('Added new block:', { category, title });
  }

  async searchBlocks(query) {
    query = query.toLowerCase();
    console.log('Searching blocks for query:', query);
    
    // Check for greetings first
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'help', 'what is this', 'what can you do'];
    if (greetings.some(greeting => query.includes(greeting))) {
      const greetingBlock = this.customBlocks.find(block => block.category === 'greeting');
      if (greetingBlock) {
        return [{
          ...greetingBlock,
          confidence: 100
        }];
      }
    }
    
    // Direct mappings for common questions
    const directMappings = [
      { phrases: ['who am i', 'who are you', 'your name', 'about you'], blockId: 14 },
      { phrases: ['what are your skills'], blockId: 5 }
    ];

    for (const mapping of directMappings) {
      if (mapping.phrases.some(p => query.includes(p))) {
        const block = this.customBlocks.find(b => b.id === mapping.blockId);
        if (block) {
          return [{ ...block, confidence: 100 }];
        }
      }
    }

    // For all other queries run the keyword matcher but ignore the greeting
    // block so it doesn't appear as the top result every time
    return this.simpleBlockSearch(query, { excludeGreeting: true });
  }

  simpleBlockSearch(query, options = {}) {
    const { excludeGreeting = false } = options;
    // Fallback to simple keyword matching if AI fails
    let results = this.customBlocks.map(block => {
      const score = this.calculateRelevanceScore(query, block);
      return {
        ...block,
        confidence: Math.round(score * 100)
      };
    });

    if (excludeGreeting) {
      results = results.filter(r => r.category !== 'greeting');
    }

    return results
      .filter(result => result.confidence > 30)
      .sort((a, b) => b.confidence - a.confidence);
  }

  calculateRelevanceScore(query, block) {
    const keywords = query.toLowerCase().split(' ').filter(word => word.length > 2);
    const blockText = (block.title + ' ' + block.content + ' ' + block.category).toLowerCase();
    
    let score = 0;
    let matches = 0;

    // Check for exact phrase match
    if (blockText.includes(query)) {
      score += 0.5;
    }

    // Check for keyword matches
    keywords.forEach(keyword => {
      if (blockText.includes(keyword)) {
        matches++;
        // Title matches are more important
        if (block.title.toLowerCase().includes(keyword)) {
          score += 0.3;
        }
        // Category matches are also important
        if (block.category.toLowerCase().includes(keyword)) {
          score += 0.2;
        }
      }
    });

    // Calculate keyword coverage
    const keywordCoverage = keywords.length > 0 ? matches / keywords.length : 0;
    score += keywordCoverage;

    // Normalize score to be between 0 and 1
    return Math.min(Math.max(score, 0), 1);
  }
}

const aiService = new AIService();
export default aiService;