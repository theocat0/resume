import OpenAI from "openai";

class AIService {
  constructor() {
    this.isInitialized = false;
    this.openai = null;
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
      }
    ];
    
    // Initialize OpenAI client with GitHub token for Azure endpoint
    if (process.env.REACT_APP_GITHUB_TOKEN) {
      this.client = new OpenAI({
        baseURL: "https://models.inference.ai.azure.com",
        apiKey: process.env.REACT_APP_GITHUB_TOKEN,
        dangerouslyAllowBrowser: true
      });
      this.isInitialized = true;
      console.log('AI Service initialized with GitHub token');
    } else {
      console.log('No GitHub token available, using fallback responses');
    }
    
    // Add your resume information here in this context object
    this.context = {
      personal: {
        name: "Your Name",
        role: "Your Current Role",
        location: "Your Location",
        summary: "Brief summary about yourself"
      },
      education: [
        {
          degree: "Your Degree",
          school: "School Name",
          period: "Year - Year",
          details: "Relevant coursework, achievements, GPA if notable"
        }
      ],
      experience: [
        {
          role: "Job Title",
          company: "Company Name",
          period: "Start Date - End Date",
          details: "Key responsibilities and achievements",
          technologies: ["Tech1", "Tech2"]
        }
      ],
      projects: [
        {
          name: "Project Name",
          description: "Project description",
          technologies: ["Tech1", "Tech2"],
          link: "Project URL (if any)"
        }
      ],
      skills: {
        technical: ["Skill1", "Skill2"],
        soft: ["Soft Skill1", "Soft Skill2"],
        languages: ["Language1", "Language2"]
      },
      certifications: [
        {
          name: "Certification Name",
          issuer: "Issuing Organization",
          date: "Date Obtained"
        }
      ]
    };
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
    
    try {
      if (!this.isInitialized) {
        console.log('AI not initialized, using simple matching');
        return this.simpleBlockSearch(query);
      }

      // Use AI to classify and select the best matching blocks
      const messages = [
        {
          role: "system",
          content: `You are a classifier that will analyze a query and select the most relevant information blocks from the following options. 
          Here are the available blocks:
          ${JSON.stringify(this.customBlocks.filter(block => block.category !== 'greeting'), null, 2)}
          
          Instructions:
          - Analyze the semantic meaning and intent of the query
          - Consider context, synonyms, and related concepts
          - Return a JSON array of block IDs, ordered by relevance
          - Include only truly relevant blocks (max 2)
          - If no blocks are relevant, return []
          - For Notion-related queries, prioritize blocks about Notion experience
          
          Example response format:
          [1] or [2,5] or []`
        },
        {
          role: "user",
          content: query
        }
      ];

      const completion = await this.client.chat.completions.create({
        messages,
        model: "gpt-4o",
        temperature: 0,
        max_tokens: 50
      });

      const response = completion.choices[0]?.message?.content || '[]';
      const selectedIds = JSON.parse(response);
      console.log('AI selected block IDs:', selectedIds);

      if (selectedIds.length === 0) {
        return [];
      }

      // Map selected blocks with confidence scores
      return selectedIds.map((id, index) => {
        const block = this.customBlocks.find(b => b.id === id);
        if (!block) return null;
        return {
          ...block,
          confidence: index === 0 ? 100 : 85 // Primary match 100%, secondary match 85%
        };
      }).filter(Boolean);

    } catch (error) {
      console.error('Error in AI classification:', error);
      return this.simpleBlockSearch(query);
    }
  }

  simpleBlockSearch(query) {
    // Fallback to simple keyword matching if AI fails
    const results = this.customBlocks.map(block => {
      const score = this.calculateRelevanceScore(query, block);
      return {
        ...block,
        confidence: Math.round(score * 100)
      };
    });

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