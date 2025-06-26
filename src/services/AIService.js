class AIService {
  constructor() {
    this.customBlocks = [
      {
        id: 1,
        category: 'greeting',
        title: 'Welcome!',
        content: "Hi! I'm Théo's interactive resume search. You can ask me anything about Théo's education, skills, experience, or projects. Try questions like 'What's your experience with AI?' or 'Tell me about your Notion expertise'. I'll find the most relevant information for you!"
      },
      {
        id: 2,
        category: 'education',
        title: 'University Studies',
        content: 'I am a student at the University of New England, pursuing a degree in Computer Science with a minor in Business. Expected graduation: 2026.'
      },
      {
        id: 3,
        category: 'experience',
        title: 'Notion Leadership',
        content: "I am a full-time Notion Campus Leader at the University of New England and a Certified Consultant with over 3 years of hands-on experience. I've been part of Notion's journey well before the platform reached half a million users, watching it evolve from a budding startup into a powerful productivity solution. Notion holds a special place in my heart for how seamlessly it blends functionality and beauty, enabling people to customize their digital spaces. Over the years, I've consulted with professors, campus staff, students, and businesses, helping them master Notion to streamline workflows and boost collaboration."
      },
      {
        id: 4,
        category: 'experience',
        title: 'AI Research',
        content: 'I have been involved in AI research, particularly focusing on natural language processing and machine learning applications. I have experience with GPT models and have participated in AI model testing and evaluation.'
      },
      {
        id: 5,
        category: 'skills',
        title: 'Technical Skills',
        content: 'My core technical skills include Python, JavaScript, and React for web development. I am also proficient in AI/ML technologies, version control with Git, and cloud platforms.'
      },
      {
        id: 6,
        category: 'projects',
        title: 'AI Projects',
        content: 'I have worked on several AI projects, including developing chatbots, implementing natural language processing systems, and creating intelligent classification systems.'
      },
      {
        id: 7,
        category: 'experience',
        title: 'Leadership',
        content: 'I have experience in leading workshops and implementing productivity solutions. I focus on creating efficient systems and helping teams adopt new technologies.'
      },
      {
        id: 8,
        category: 'skills',
        title: 'Notion Expertise',
        content: 'As a certified Notion consultant, I specialize in leveraging Notion\'s API for seamless integrations, designing complex relational databases, and implementing advanced automations with tools like Zapier and Make. My skills include creating dynamic dashboards, optimizing workspace structures, building custom formulas, and developing scalable systems tailored to individual and team workflows.'
      },
      {
        id: 9,
        category: 'contact',
        title: 'Contact Information',
        content: '📱 (704) 877-0542\n📧 A.theo.0@icloud.com\n💼 <a href="https://linkedin.com/in/théo-pasquier-aa2993194" target="_blank">LinkedIn Profile</a>'
      },
      {
        id: 10,
        category: 'contact',
        title: 'Professional Profiles',
        content: 'Connect with me:\n• <a href="https://linkedin.com/in/théo-pasquier-aa2993194" target="_blank">LinkedIn</a>\n• <a href="https://github.com/theocat0" target="_blank">GitHub</a>'
      },
      // New blocks for expanded resume context
      {
        id: 11,
        category: 'awards',
        title: 'Academic Awards',
        content: 'Recipient of the Computer Science Department\'s Award for Excellence in AI Research (2024) and Dean\'s List honors for multiple consecutive semesters.'
      },
      {
        id: 12,
        category: 'volunteering',
        title: 'Community Outreach',
        content: 'Volunteered alongside Professor Thomas Klak in his American chestnut restoration initiative, assisting in planting blight-resistant trees to reintroduce this iconic species to its native habitat. Worked under his guidance to support environmental restoration efforts and promote biodiversity within the region'
      },
      {
        id: 13,
        category: 'interests',
        title: 'Personal Interests',
        content: 'Beyond academics and professional pursuits, I enjoy exploring new AI tools, setting up productivity systems in Notion, and hiking in the scenic landscapes of Maine. I am also president in cofounder of the UNE fencing club.'
      },
      {
        id: 14,
        category: 'personal',
        title: 'About Me',
        content: "I'm Théo Pasquier, a Computer Science student at the University of New England and a Notion consultant passionate about productivity and AI."
      }
    ];

    this.synonyms = {
      greeting: ['hi', 'hello', 'hey', 'greetings'],
      education: ['school', 'college', 'university', 'studies', 'degree'],
      experience: ['background', 'career', 'work', 'history'],
      skills: ['abilities', 'expertise', 'proficiency'],
      projects: ['portfolio', 'works', 'assignments'],
      contact: ['email', 'phone', 'reach', 'connect'],
      personal: ['bio', 'about'],
      awards: ['honors', 'achievements', 'recognition'],
      volunteering: ['volunteer', 'service', 'community'],
      interests: ['hobbies', 'passions', 'activities']
    };

    this.synonymMap = {};
    Object.entries(this.synonyms).forEach(([key, list]) => {
      this.synonymMap[key] = key;
      list.forEach(word => {
        this.synonymMap[word] = key;
      });
    });

    this.buildIndex();

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
    this.buildIndex();
  }

  buildIndex() {
    const df = {};
    this.blocksData = this.customBlocks.map(block => {
      const text = (
        block.title + ' ' + block.content + ' ' + block.category
      ).toLowerCase();
      const tokens = text.match(/\b[a-z]+\b/g) || [];
      const normalized = tokens.map(t => this.synonymMap[t] || t);
      const tf = {};
      normalized.forEach(tok => {
        tf[tok] = (tf[tok] || 0) + 1;
      });
      Object.keys(tf).forEach(tok => {
        df[tok] = (df[tok] || 0) + 1;
      });
      return { block, text, tf };
    });

    const totalDocs = this.blocksData.length;
    this.idf = {};
    Object.entries(df).forEach(([tok, count]) => {
      this.idf[tok] = Math.log((totalDocs + 1) / (count + 1)) + 1;
    });
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
    const tokens = query.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const expanded = [];
    tokens.forEach(t => {
      expanded.push(t);
      if (this.synonymMap[t] && this.synonymMap[t] !== t) {
        expanded.push(this.synonymMap[t]);
      }
    });

    let results = this.blocksData.map(data => {
      if (excludeGreeting && data.block.category === 'greeting') return null;
      const score = this.calculateRelevanceScore(expanded, data);
      return {
        ...data.block,
        confidence: Math.round(score * 100)
      };
    }).filter(Boolean);

    return results
      .filter(result => result.confidence > 30)
      .sort((a, b) => b.confidence - a.confidence);
  }

  calculateRelevanceScore(tokens, data) {
    let score = 0;
    tokens.forEach(tok => {
      if (data.tf[tok]) {
        score += data.tf[tok] * (this.idf[tok] || 0);
      }
    });

    const fuzzy = this.stringSimilarity(tokens.join(' '), data.text);
    score += fuzzy * 0.3;

    return Math.min(Math.max(score, 0), 1);
  }

  stringSimilarity(a, b) {
    if (!a || !b) return 0;
    const distance = this.levenshteinDistance(a, b);
    const maxLen = Math.max(a.length, b.length);
    return maxLen === 0 ? 1 : 1 - distance / maxLen;
  }

  levenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) {
      matrix[i][0] = i;
    }
    for (let j = 0; j <= b.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[a.length][b.length];
  }
}

const aiService = new AIService();
export default aiService;